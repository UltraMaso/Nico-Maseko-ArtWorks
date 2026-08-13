import { useEffect, useMemo, useRef, useState } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'

const getApiUrl = (path) => {
  const baseUrl = import.meta.env.VITE_API_URL || ''
  return `${baseUrl.replace(/\/$/, '')}${path}`
}

function NavBar({ isAdmin, token, logout }) {
  const location = useLocation()
  return (
    <nav className="nav-bar">
      <Link className={location.pathname === '/' ? 'nav-link active' : 'nav-link'} to="/">
        Gallery
      </Link>
      <Link className={location.pathname === '/admin' ? 'nav-link active' : 'nav-link'} to="/admin">
        Admin
      </Link>
      {!token ? (
        <Link className={location.pathname === '/login' ? 'nav-link active' : 'nav-link'} to="/login">
          Login
        </Link>
      ) : (
        <button className="nav-link button-link" onClick={logout}>
          Logout
        </button>
      )}
      {isAdmin && <span className="role-badge">Admin</span>}
    </nav>
  )
}

function GalleryPage({ artworks, currentSlide, slideIndex, setSlideIndex, isAdmin, handleDelete, handleFeature }) {
  return (
    <>
      <section className="hero-panel">
        <div className="hero-card">
          <h2>Featured artwork</h2>
          {currentSlide ? (
            <div className="hero-slide">
              <img
                src={`data:${currentSlide.mimeType};base64,${currentSlide.imageData}`}
                alt={currentSlide.title}
              />
              <div className="hero-copy">
                <strong>{currentSlide.title}</strong>
                <p>{currentSlide.description}</p>
                <p className="slide-note">Slide {slideIndex + 1} of {artworks.length}</p>
              </div>
            </div>
          ) : (
            <div className="hero-empty">No artworks available yet.</div>
          )}
        </div>
      </section>

      <section className="gallery-section">
        <div className="gallery-header">
          <h2>Gallery</h2>
          <p>Click an image to open in the slide preview. Admins can remove or toggle featured status.</p>
        </div>
        <div className="gallery-grid">
          {artworks.length ? (
            artworks.map((item, index) => (
              <article key={item.id} className="art-card" onClick={() => setSlideIndex(index)}>
                <img
                  src={`data:${item.mimeType};base64,${item.thumbnailData || item.imageData}`}
                  alt={item.title}
                />
                <div className="art-details">
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                  {item.featured && <span className="badge-featured">Featured</span>}
                  {isAdmin && (
                    <div className="admin-actions">
                      <button className="remove-button" onClick={(event) => {
                        event.stopPropagation()
                        handleDelete(item.id)
                      }}>
                        Remove
                      </button>
                      <button className="feature-button" onClick={(event) => {
                        event.stopPropagation()
                        handleFeature(item.id, item.featured)
                      }}>
                        {item.featured ? 'Unfeature' : 'Feature'}
                      </button>
                      <button className="feature-button" onClick={(event) => {
                        event.stopPropagation()
                        handlePublish(item.id, item.published)
                      }}>
                        {item.published ? 'Unpublish' : 'Publish'}
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))
          ) : (
            <p className="empty-list">No artwork has been uploaded yet.</p>
          )}
        </div>
      </section>
    </>
  )
}

function LoginPage({ username, password, setUsername, setPassword, loginError, handleLogin }) {
  return (
    <div className="panel auth-panel">
      <h2>Admin login</h2>
      <form onSubmit={handleLogin} className="form-grid">
        <label>
          Username
          <input value={username} onChange={(event) => setUsername(event.target.value)} />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button type="submit">Login</button>
        {loginError && <p className="error-text">{loginError}</p>}
      </form>
    </div>
  )
}

function AdminPage({ title, description, imageFile, featured, setTitle, setDescription, setImageFile, setFeatured, fileInputRef, handleUpload, backgroundColor, setBackgroundColor, backgroundMessage, handleBackground, adminArtworks, handleDelete, handleFeature, handlePublish }) {
  return (
    <div className="panel admin-panel">
      <h2>Admin controls</h2>
      <form onSubmit={handleUpload} className="form-grid">
        <label>
          Title
          <input value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label>
          Description
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
        <label>
          Upload image
          <input
            id="image-input"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(event) => setImageFile(event.target.files?.[0] || null)}
          />
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={featured}
            onChange={(event) => setFeatured(event.target.checked)}
          />
          Mark as featured
        </label>
        <button type="submit">Upload Artwork</button>
      </form>

      <form onSubmit={handleBackground} className="form-grid small-grid">
        <label>
          Gallery background
          <input
            type="color"
            value={backgroundColor}
            onChange={(event) => setBackgroundColor(event.target.value)}
          />
        </label>
        <button type="submit">Set background</button>
        {backgroundMessage && <p className="info-text">{backgroundMessage}</p>}
      </form>

      <div className="admin-list">
        <h3>Manage uploaded artworks</h3>
        {adminArtworks.length ? (
          adminArtworks.map((item) => (
            <div key={item.id} className="admin-item">
              <div>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
                <p className="admin-meta">Published: {item.published ? 'Yes' : 'No'} • Featured: {item.featured ? 'Yes' : 'No'}</p>
              </div>
              <div className="admin-actions">
                <button className="remove-button" onClick={() => handleDelete(item.id)}>
                  Remove
                </button>
                <button className="feature-button" onClick={() => handleFeature(item.id, item.featured)}>
                  {item.featured ? 'Unfeature' : 'Feature'}
                </button>
                <button className="feature-button" onClick={() => handlePublish(item.id, item.published)}>
                  {item.published ? 'Unpublish' : 'Publish'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-list">No artworks are available for management.</p>
        )}
      </div>
    </div>
  )
}

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState(localStorage.getItem('authToken') || '')
  const [role, setRole] = useState(localStorage.getItem('authRole') || '')
  const [loginError, setLoginError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [artworks, setArtworks] = useState([])
  const [slideIndex, setSlideIndex] = useState(0)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [featured, setFeatured] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState(localStorage.getItem('galleryBackground') || '#0f172a')
  const [backgroundMessage, setBackgroundMessage] = useState('')
  const [adminArtworks, setAdminArtworks] = useState([])
  const fileInputRef = useRef(null)

  const isAdmin = role === 'admin'
  const featuredArtworks = useMemo(() => artworks.filter((item) => item.featured), [artworks])
  const availableSlides = featuredArtworks.length ? featuredArtworks : artworks
  const currentSlide = availableSlides[slideIndex % (availableSlides.length || 1)]

  useEffect(() => {
    localStorage.setItem('galleryBackground', backgroundColor)
  }, [backgroundColor])

  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token)
      localStorage.setItem('authRole', role)
    } else {
      localStorage.removeItem('authToken')
      localStorage.removeItem('authRole')
    }
  }, [token, role])

  useEffect(() => {
    fetchArtworks()
  }, [])

  useEffect(() => {
    if (token && isAdmin) {
      fetchAdminArtworks()
    } else {
      setAdminArtworks([])
    }
  }, [token, isAdmin])

  useEffect(() => {
    if (!availableSlides.length) return undefined
    if (slideIndex >= availableSlides.length) setSlideIndex(0)
    const timer = setInterval(() => {
      setSlideIndex((prevIndex) => (prevIndex + 1) % availableSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [availableSlides, slideIndex])

  const fetchArtworks = async () => {
    try {
      const response = await fetch(getApiUrl('/api/artworks'))
      const data = await response.json()
      setArtworks(data)
      if (data.length && slideIndex >= data.length) setSlideIndex(0)
    } catch (error) {
      console.error(error)
      setStatusMessage('Unable to load gallery items')
    }
  }

  const fetchAdminArtworks = async (authToken = token, authRole = role) => {
    if (!authToken || authRole !== 'admin') return
    try {
      const response = await fetch(getApiUrl('/api/admin/artworks'), {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Unable to load admin artworks')
      setAdminArtworks(data)
    } catch (error) {
      console.error(error)
      setStatusMessage(error.message)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoginError('')
    setStatusMessage('')

    try {
      const response = await fetch(getApiUrl('/api/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Login failed')
      setToken(data.token)
      setRole(data.role)
      setUsername('')
      setPassword('')
      setStatusMessage(`Logged in as ${data.role}`)
    } catch (error) {
      setLoginError(error.message)
    }
  }

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
      fetchArtworks()
    } catch (error) {
      setStatusMessage(error.message)
    }
  }

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
      fetchArtworks()
      fetchAdminArtworks()
    } catch (error) {
      setStatusMessage(error.message)
    }
  }

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
      fetchArtworks()
      fetchAdminArtworks()
    } catch (error) {
      setStatusMessage(error.message)
    }
  }

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
      fetchArtworks()
      fetchAdminArtworks()
    } catch (error) {
      setStatusMessage(error.message)
    }
  }

  const logout = () => {
    setToken('')
    setRole('')
    setStatusMessage('Logged out')
  }

  return (
    <BrowserRouter>
      <div className="app-shell" style={{ backgroundColor }}>
        <header className="app-header">
          <div>
            <p className="tagline">Digital Art Gallery</p>
            <h1>Nico Maseko </h1>
          <u>  <h2>Digital Artwork Platform</h2></u>
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
                currentSlide={currentSlide}
                slideIndex={slideIndex}
                setSlideIndex={setSlideIndex}
                isAdmin={isAdmin}
                handleDelete={handleDelete}
                handleFeature={handleFeature}
              />
            }
          />
          <Route
            path="/login"
            element={token ? <Navigate to="/admin" replace /> : (
              <LoginPage
                username={username}
                password={password}
                setUsername={setUsername}
                setPassword={setPassword}
                loginError={loginError}
                handleLogin={handleLogin}
              />
            )}
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
