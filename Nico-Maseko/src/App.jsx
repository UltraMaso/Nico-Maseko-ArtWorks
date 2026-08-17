import { useEffect, useMemo, useRef, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'

import NavBar from './components/shared/NavBar'
import GalleryPage from './components/pages/GalleryPage'
import LoginPage from './components/pages/LoginPage'
import AdminPage from './components/pages/AdminPage'
import ArtworkModal from './components/modals/ArtworkModal'
import AlbumModal from './components/modals/AlbumModal'

import { useAuth } from './hooks/useAuth'
import { useArtworks, useAdminArtworks } from './hooks/useArtworks'
import { useAlbums, useAdminAlbums } from './hooks/useAlbums'
import { useSlideshow } from './hooks/useSlideshow'
import { getApiUrl } from './utils/apiConfig'

function App() {
  // Auth state and handlers
  const { token, role, loginError, statusMessage, setStatusMessage, login, logout, isAdmin } = useAuth()

  // Form state
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [slideIndex, setSlideIndex] = useState(0)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [featured, setFeatured] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState(localStorage.getItem('galleryBackground') || '#0f172a')
  const [backgroundMessage, setBackgroundMessage] = useState('')
  const [albumTitle, setAlbumTitle] = useState('')
  const [albumDescription, setAlbumDescription] = useState('')
  const [albumFiles, setAlbumFiles] = useState([])
  const [editingAlbum, setEditingAlbum] = useState(null)
  const [editAlbumTitle, setEditAlbumTitle] = useState('')
  const [editAlbumDescription, setEditAlbumDescription] = useState('')
  const [editAlbumFiles, setEditAlbumFiles] = useState([])
  const [selectedArtwork, setSelectedArtwork] = useState(null)
  const [selectedAlbum, setSelectedAlbum] = useState(null)
  const fileInputRef = useRef(null)

  // API data hooks
  const { artworks, fetch: fetchArtworks, setStatusMessage: setArtworkMessage } = useArtworks()
  const { albums, fetch: fetchAlbums, setStatusMessage: setAlbumMessage } = useAlbums()
  const { adminArtworks, fetch: fetchAdminArtworks, statusMessage: adminArtworkMessage } = useAdminArtworks(token, role)
  const { adminAlbums, fetch: fetchAdminAlbums, statusMessage: adminAlbumMessage } = useAdminAlbums(token, role)

  // Slideshow logic
  const featuredArtworks = useMemo(() => artworks.filter((item) => item.featured), [artworks])
  const availableSlides = featuredArtworks.length ? featuredArtworks : artworks
  const currentSlide = availableSlides[slideIndex % (availableSlides.length || 1)]
  useSlideshow(availableSlides, slideIndex, setSlideIndex)

  // Persist background color
  useEffect(() => {
    localStorage.setItem('galleryBackground', backgroundColor)
  }, [backgroundColor])

  // Aggregate status messages
  useEffect(() => {
    const messages = [statusMessage, adminArtworkMessage, adminAlbumMessage].filter(Boolean)
    if (messages.length) {
      setStatusMessage(messages[0])
    }
  }, [adminArtworkMessage, adminAlbumMessage])

  // Login handler
  const handleLogin = async (event) => {
    event.preventDefault()
    const result = await login(username, password)
    if (result.success) {
      setUsername('')
      setPassword('')
    }
  }

  // Upload artwork handler
  const handleUpload = async (event) => {
    event.preventDefault()
    if (!imageFile || !title) {
      setStatusMessage('Title and image are required')
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('image', imageFile)
    formData.append('featured', featured)

    try {
      setStatusMessage('Uploading artwork...')
      const response = await fetch(getApiUrl('/api/artworks'), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Upload failed')
      setTitle('')
      setDescription('')
      setImageFile(null)
      setFeatured(false)
      if (fileInputRef.current) fileInputRef.current.value = null
      setStatusMessage('Artwork uploaded successfully')
      await fetchArtworks()
    } catch (error) {
      setStatusMessage(error.message)
    }
  }

  // Delete artwork handler
  const handleDelete = async (id) => {
    if (!window.confirm('Remove this artwork from the gallery?')) return
    try {
      const response = await fetch(getApiUrl(`/api/artworks/${id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Delete failed')
      setStatusMessage('Artwork removed')
      await fetchArtworks()
      await fetchAdminArtworks()
    } catch (error) {
      setStatusMessage(error.message)
    }
  }

  // Feature artwork handler
  const handleFeature = async (id, isFeatured) => {
    try {
      const response = await fetch(getApiUrl(`/api/artworks/${id}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ featured: !isFeatured }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Update failed')
      setStatusMessage(data.success ? 'Artwork updated' : 'Update failed')
      await fetchArtworks()
      await fetchAdminArtworks()
    } catch (error) {
      setStatusMessage(error.message)
    }
  }

  // Publish artwork handler
  const handlePublish = async (id, isPublished) => {
    try {
      const response = await fetch(getApiUrl(`/api/artworks/${id}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ published: !isPublished }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Update failed')
      setStatusMessage(data.success ? 'Artwork publish state updated' : 'Update failed')
      await fetchArtworks()
      await fetchAdminArtworks()
    } catch (error) {
      setStatusMessage(error.message)
    }
  }

  // Background handler
  const handleBackground = async (event) => {
    event.preventDefault()
    setBackgroundMessage('')
    try {
      const response = await fetch(getApiUrl('/api/background'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ color: backgroundColor }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Unable to save background')
      setBackgroundMessage('Background updated')
    } catch (error) {
      setBackgroundMessage(error.message)
    }
  }

  // Create album handler
  const handleCreateAlbum = async (event) => {
    event.preventDefault()
    if (!albumTitle || !albumFiles.length) {
      setStatusMessage('Album title and at least one media file are required')
      return
    }

    const formData = new FormData()
    formData.append('title', albumTitle)
    formData.append('description', albumDescription)
    albumFiles.forEach((file) => formData.append('media', file))

    try {
      const response = await fetch(getApiUrl('/api/albums'), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Album creation failed')
      setAlbumTitle('')
      setAlbumDescription('')
      setAlbumFiles([])
      setStatusMessage('Album created successfully')
      await fetchAlbums()
      await fetchAdminAlbums()
    } catch (error) {
      setStatusMessage(error.message)
    }
  }

  // Delete album handler
  const handleDeleteAlbum = async (id) => {
    if (!window.confirm('Remove this album?')) return

    try {
      const response = await fetch(getApiUrl(`/api/albums/${id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Delete album failed')
      setStatusMessage('Album removed')
      await fetchAlbums()
      await fetchAdminAlbums()
    } catch (error) {
      setStatusMessage(error.message)
    }
  }

  // Update album handler
  const handleUpdateAlbum = async (event) => {
    event.preventDefault()
    if (!editingAlbum) return

    const formData = new FormData()
    formData.append('title', editAlbumTitle)
    formData.append('description', editAlbumDescription)
    editAlbumFiles.forEach((file) => formData.append('media', file))

    try {
      const response = await fetch(getApiUrl(`/api/albums/${editingAlbum.id}`), {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Album update failed')
      setStatusMessage('Album updated successfully')
      setEditingAlbum(null)
      setEditAlbumTitle('')
      setEditAlbumDescription('')
      setEditAlbumFiles([])
      await fetchAlbums()
      await fetchAdminAlbums()
    } catch (error) {
      setStatusMessage(error.message)
    }
  }

  return (
    <BrowserRouter>
      <div className="app-shell" style={{ backgroundColor }}>
        <ArtworkModal artwork={selectedArtwork} onClose={() => setSelectedArtwork(null)} />
        <AlbumModal album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />

        <header className="app-header">
          <div>
            <p className="tagline">Digital Art Gallery</p>
            <h1>Nico Maseko</h1>
            <u>
              <h2>Digital Artwork Platform</h2>
            </u>
            <p className="intro">
              Browse the slide preview, explore the full gallery, and let an admin manage
              new artwork and the background look.
            </p>
          </div>
          <div className="status-bar">
            <span>{statusMessage || 'Welcome to the gallery.'}</span>
          </div>
          <NavBar isAdmin={isAdmin} token={token} logout={logout} />
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <GalleryPage
                artworks={artworks}
                albums={albums}
                currentSlide={currentSlide}
                slideIndex={slideIndex}
                setSlideIndex={setSlideIndex}
                isAdmin={isAdmin}
                handleDelete={handleDelete}
                handleFeature={handleFeature}
                handlePublish={handlePublish}
                onOpenArtwork={setSelectedArtwork}
                onOpenAlbum={setSelectedAlbum}
              />
            }
          />
          <Route
            path="/login"
            element={
              token ? (
                <Navigate to="/admin" replace />
              ) : (
                <LoginPage
                  username={username}
                  password={password}
                  setUsername={setUsername}
                  setPassword={setPassword}
                  loginError={loginError}
                  handleLogin={handleLogin}
                />
              )
            }
          />
          <Route
            path="/admin"
            element={
              isAdmin ? (
                <AdminPage
                  title={title}
                  description={description}
                  imageFile={imageFile}
                  featured={featured}
                  setTitle={setTitle}
                  setDescription={setDescription}
                  setImageFile={setImageFile}
                  setFeatured={setFeatured}
                  fileInputRef={fileInputRef}
                  handleUpload={handleUpload}
                  backgroundColor={backgroundColor}
                  setBackgroundColor={setBackgroundColor}
                  backgroundMessage={backgroundMessage}
                  handleBackground={handleBackground}
                  adminArtworks={adminArtworks}
                  handleDelete={handleDelete}
                  handleFeature={handleFeature}
                  handlePublish={handlePublish}
                  albumTitle={albumTitle}
                  albumDescription={albumDescription}
                  albumFiles={albumFiles}
                  setAlbumTitle={setAlbumTitle}
                  setAlbumDescription={setAlbumDescription}
                  setAlbumFiles={setAlbumFiles}
                  handleCreateAlbum={handleCreateAlbum}
                  adminAlbums={adminAlbums}
                  handleDeleteAlbum={handleDeleteAlbum}
                  editingAlbum={editingAlbum}
                  setEditingAlbum={setEditingAlbum}
                  editAlbumTitle={editAlbumTitle}
                  setEditAlbumTitle={setEditAlbumTitle}
                  editAlbumDescription={editAlbumDescription}
                  setEditAlbumDescription={setEditAlbumDescription}
                  editAlbumFiles={editAlbumFiles}
                  setEditAlbumFiles={setEditAlbumFiles}
                  handleUpdateAlbum={handleUpdateAlbum}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
