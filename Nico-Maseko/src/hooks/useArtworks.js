import { useState, useCallback, useEffect } from 'react'
import { getApiUrl } from '../utils/apiConfig'

export const useArtworks = () => {
  const [artworks, setArtworks] = useState([])
  const [statusMessage, setStatusMessage] = useState('')

  const fetch = useCallback(async () => {
    try {
      const response = await fetch(getApiUrl('/api/artworks'))
      const data = await response.json()
      setArtworks(data)
      return data
    } catch (error) {
      console.error(error)
      setStatusMessage('Unable to load gallery items')
      return []
    }
  }, [])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { artworks, setArtworks, fetch, statusMessage, setStatusMessage }
}

export const useAdminArtworks = (token, role) => {
  const [adminArtworks, setAdminArtworks] = useState([])
  const [statusMessage, setStatusMessage] = useState('')

  const fetch = useCallback(async (authToken = token, authRole = role) => {
    if (!authToken || authRole !== 'admin') return []

    try {
      const response = await fetch(getApiUrl('/api/admin/artworks'), {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Unable to load admin artworks')
      setAdminArtworks(data)
      return data
    } catch (error) {
      console.error(error)
      setStatusMessage(error.message)
      return []
    }
  }, [token, role])

  useEffect(() => {
    fetch()
  }, [token, role, fetch])

  const deleteArtwork = useCallback(
    async (id, authToken) => {
      if (!window.confirm('Remove this artwork from the gallery?')) return false

      try {
        const response = await fetch(getApiUrl(`/api/artworks/${id}`), {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${authToken}` },
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.message || 'Delete failed')
        setStatusMessage('Artwork removed')
        await fetch(authToken)
        return true
      } catch (error) {
        setStatusMessage(error.message)
        return false
      }
    },
    [fetch]
  )

  const updateFeature = useCallback(
    async (id, isFeatured, authToken) => {
      try {
        const response = await fetch(getApiUrl(`/api/artworks/${id}`), {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ featured: !isFeatured }),
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.message || 'Update failed')
        setStatusMessage(data.success ? 'Artwork updated' : 'Update failed')
        await fetch(authToken)
        return true
      } catch (error) {
        setStatusMessage(error.message)
        return false
      }
    },
    [fetch]
  )

  const updatePublish = useCallback(
    async (id, isPublished, authToken) => {
      try {
        const response = await fetch(getApiUrl(`/api/artworks/${id}`), {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ published: !isPublished }),
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.message || 'Update failed')
        setStatusMessage(data.success ? 'Artwork publish state updated' : 'Update failed')
        await fetch(authToken)
        return true
      } catch (error) {
        setStatusMessage(error.message)
        return false
      }
    },
    [fetch]
  )

  return {
    adminArtworks,
    setAdminArtworks,
    fetch,
    statusMessage,
    setStatusMessage,
    deleteArtwork,
    updateFeature,
    updatePublish,
  }
}
