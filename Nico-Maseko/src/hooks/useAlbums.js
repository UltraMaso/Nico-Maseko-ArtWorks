import { useState, useCallback, useEffect } from 'react'
import { getApiUrl } from '../utils/apiConfig'

export const useAlbums = () => {
  const [albums, setAlbums] = useState([])
  const [statusMessage, setStatusMessage] = useState('')

  const fetch = useCallback(async () => {
    try {
      const response = await fetch(getApiUrl('/api/albums'))
      const data = await response.json()
      setAlbums(data)
      return data
    } catch (error) {
      console.error(error)
      setStatusMessage('Unable to load albums')
      return []
    }
  }, [])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { albums, setAlbums, fetch, statusMessage, setStatusMessage }
}

export const useAdminAlbums = (token, role) => {
  const [adminAlbums, setAdminAlbums] = useState([])
  const [statusMessage, setStatusMessage] = useState('')

  const fetch = useCallback(async (authToken = token, authRole = role) => {
    if (!authToken || authRole !== 'admin') return []

    try {
      const response = await fetch(getApiUrl('/api/admin/albums'), {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Unable to load admin albums')
      setAdminAlbums(data)
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

  const deleteAlbum = useCallback(
    async (id, authToken) => {
      if (!window.confirm('Remove this album?')) return false

      try {
        const response = await fetch(getApiUrl(`/api/albums/${id}`), {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${authToken}` },
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.message || 'Delete album failed')
        setStatusMessage('Album removed')
        await fetch(authToken)
        return true
      } catch (error) {
        setStatusMessage(error.message)
        return false
      }
    },
    [fetch]
  )

  const updateAlbum = useCallback(
    async (id, title, description, newFiles, authToken) => {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      newFiles.forEach((file) => formData.append('media', file))

      try {
        const response = await fetch(getApiUrl(`/api/albums/${id}`), {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${authToken}` },
          body: formData,
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.message || 'Album update failed')
        setStatusMessage('Album updated successfully')
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
    adminAlbums,
    setAdminAlbums,
    fetch,
    statusMessage,
    setStatusMessage,
    deleteAlbum,
    updateAlbum,
  }
}
