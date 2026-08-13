import 'dotenv/config'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import crypto from 'crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_DIR = path.join(__dirname, 'data')
const STORE_PATH = path.join(DATA_DIR, 'store.json')

const username = process.argv[2] || 'admin'
const password = process.argv[3] || 'password123'

const readStore = () => {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(STORE_PATH, JSON.stringify({ users: [], artworks: [] }, null, 2))
  }
  return JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'))
}

const writeStore = (store) => fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2))

const run = () => {
  const store = readStore()
  const existing = store.users.find((user) => user.username === username)
  if (existing) {
    console.log(`Admin user '${username}' already exists.`)
    return process.exit(0)
  }

  const passwordHash = bcrypt.hashSync(password, 10)
  store.users.push({
    id: crypto.randomUUID(),
    username,
    passwordHash,
    role: 'admin',
  })
  writeStore(store)

  console.log(`Created admin user: ${username}`)
  console.log('Use npm run seed-admin or node server/seedAdmin.js [username] [password]')
  process.exit(0)
}

run()
