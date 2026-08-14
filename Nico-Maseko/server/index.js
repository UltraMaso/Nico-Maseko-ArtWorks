import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import Album from './models/Album.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_DIR = path.join(__dirname, 'data')
const STORE_PATH = path.join(DATA_DIR, 'store.json')

const app = express()
const upload = multer({ storage: multer.memoryStorage() })
const PORT = process.env.PORT || 4000
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret'

const ensureDataStore = () => {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(STORE_PATH)) {
    const defaultStore = {
      users: [],
      artworks: [],
      albums: [],
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(defaultStore, null, 2))
  }
}

const readStore = () => {
  ensureDataStore()
  return JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'))
}

const writeStore = (store) => {
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2))
}

const ensureAdminUser = () => {
  const store = readStore()
  if (!store.users.some((user) => user.role === 'admin')) {
    store.users.push({
      id: crypto.randomUUID(),
      username: 'admin',
      passwordHash: bcrypt.hashSync('password123', 10),
      role: 'admin',
    })
    writeStore(store)
  }
  return readStore()
}

const getUserByUsername = (username) => {
  const store = ensureAdminUser()
  return store.users.find((user) => user.username === username)
}

const getAllArtworks = () => {
  const store = readStore()
  return [...store.artworks].sort((a, b) => {
    if (a.featured !== b.featured) return Number(b.featured) - Number(a.featured)
    if (a.published !== b.published) return Number(b.published) - Number(a.published)
    return new Date(b.createdAt) - new Date(a.createdAt)
  })
}

const isMongoConnected = () => mongoose.connection.readyState === 1

const getAllAlbums = async () => {
  if (isMongoConnected()) {
    const albums = await Album.find().sort({ createdAt: -1 }).lean()
    return albums
  }

  const store = readStore()
  return [...(store.albums || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

const wrapAlbum = (album) => ({
  id: album.id,
  title: album.title,
  description: album.description,
  published: album.published,
  featured: album.featured,
  createdAt: album.createdAt,
  cover: album.cover || album.items?.[0] || null,
  mediaCount: album.items?.length || 0,
  items: (album.items || []).map((item) => ({
    id: item.id,
    title: item.title,
    type: item.type,
    mimeType: item.mimeType,
    imageData: item.imageData || '',
    videoData: item.videoData || '',
    dataUrl: item.dataUrl || '',
  })),
})

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://nico-maseko-artworks-web.onrender.com',
  'https://nico-maseko-artworks.onrender.com',
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
      return
    }

    callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))
app.use(express.json())

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' })
  const token = authHeader.replace('Bearer ', '')
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ message: 'Missing credentials' })

  const user = getUserByUsername(username)
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' })

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '12h' })
  res.json({ token, role: user.role })
})

app.get('/api/artworks', async (req, res) => {
  const artworks = getAllArtworks().filter((art) => art.published)
  const formatted = artworks.map((art) => ({
    id: art.id,
    title: art.title,
    description: art.description,
    mimeType: art.mimeType,
    imageData: art.imageData,
    thumbnailData: art.thumbnailData,
    featured: art.featured,
  }))
  res.json(formatted)
})

app.get('/api/albums', async (req, res) => {
  const albums = await getAllAlbums()
  res.json(albums.filter((album) => album.published).map((album) => wrapAlbum(album)))
})

app.get('/api/admin/artworks', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' })

  const formatted = getAllArtworks().map((art) => ({
    id: art.id,
    title: art.title,
    description: art.description,
    mimeType: art.mimeType,
    imageData: art.imageData,
    thumbnailData: art.thumbnailData,
    featured: art.featured,
    published: art.published,
  }))
  res.json(formatted)
})

app.get('/api/admin/albums', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' })

  const albums = await getAllAlbums()
  res.json(albums.map((album) => wrapAlbum(album)))
})

app.post('/api/artworks', authMiddleware, upload.single('image'), async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' })
  const { title, description, featured } = req.body
  if (!req.file || !title) return res.status(400).json({ message: 'Title and image are required' })

  const store = readStore()
  const contentHash = crypto.createHash('sha256').update(req.file.buffer).digest('hex')
  const duplicate = store.artworks.some((art) => art.contentHash === contentHash)
  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate image already uploaded' })
  }

  const thumbnailBuffer = await sharp(req.file.buffer)
    .resize({ width: 640, height: 640, fit: 'inside' })
    .toBuffer()

  const artwork = {
    id: crypto.randomUUID(),
    title,
    description: description || '',
    filename: req.file.originalname,
    mimeType: req.file.mimetype,
    imageData: req.file.buffer.toString('base64'),
    thumbnailData: thumbnailBuffer.toString('base64'),
    contentHash,
    featured: featured === 'true' || featured === true,
    published: true,
    createdAt: new Date().toISOString(),
  }

  store.artworks.push(artwork)
  writeStore(store)
  res.status(201).json({ id: artwork.id })
})

app.post('/api/albums', authMiddleware, upload.array('media', 20), async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' })

  const { title, description } = req.body
  const files = Array.isArray(req.files) ? req.files : []
  if (!title || !files.length) return res.status(400).json({ message: 'Album title and at least one media file are required' })

  const mediaItems = files.map((file) => {
    const base64 = file.buffer.toString('base64')
    const mimeType = file.mimetype
    const type = mimeType.startsWith('video/') ? 'video' : mimeType.startsWith('image/') ? 'image' : 'file'

    return {
      id: crypto.randomUUID(),
      title: file.originalname,
      type,
      mimeType,
      imageData: type === 'image' ? base64 : '',
      videoData: type === 'video' ? base64 : '',
      dataUrl: `data:${mimeType};base64,${base64}`,
    }
  })

  const album = {
    id: crypto.randomUUID(),
    title,
    description: description || '',
    items: mediaItems,
    cover: mediaItems[0] || null,
    featured: false,
    published: true,
    createdAt: new Date().toISOString(),
  }

  if (isMongoConnected()) {
    const savedAlbum = await Album.create(album)
    return res.status(201).json({ id: savedAlbum.id, mediaCount: savedAlbum.items.length })
  }

  const store = readStore()
  store.albums = store.albums || []
  store.albums.push(album)
  writeStore(store)
  res.status(201).json({ id: album.id, mediaCount: mediaItems.length })
})

app.patch('/api/artworks/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' })

  const store = readStore()
  const artworkIndex = store.artworks.findIndex((art) => art.id === req.params.id)
  if (artworkIndex === -1) return res.status(404).json({ message: 'Artwork not found' })

  const { featured, published } = req.body
  if (typeof featured !== 'undefined') {
    store.artworks[artworkIndex].featured = featured === true || featured === 'true'
  }
  if (typeof published !== 'undefined') {
    store.artworks[artworkIndex].published = published === true || published === 'true'
  }

  writeStore(store)
  const artwork = store.artworks[artworkIndex]
  res.json({ success: true, featured: artwork.featured, published: artwork.published })
})

app.delete('/api/artworks/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' })

  const store = readStore()
  store.artworks = store.artworks.filter((art) => art.id !== req.params.id)
  writeStore(store)
  res.json({ success: true })
})

app.delete('/api/albums/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' })

  if (isMongoConnected()) {
    await Album.deleteOne({ id: req.params.id })
    return res.json({ success: true })
  }

  const store = readStore()
  store.albums = (store.albums || []).filter((album) => album.id !== req.params.id)
  writeStore(store)
  res.json({ success: true })
})

app.post('/api/background', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' })
  const { color } = req.body
  if (!color) return res.status(400).json({ message: 'Color is required' })
  res.json({ message: 'Background color saved in client demo only', color })
})

app.get('/health', (req, res) => res.json({ status: 'ok' }))

const startServer = async () => {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI)
      console.log('Connected to MongoDB')
    } else {
      console.log('MONGO_URI not set; using local JSON store only')
    }
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
  }

  ensureAdminUser()
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
}

startServer()
