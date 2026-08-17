import { useState, useCallback } from 'react'
import { getApiUrl } from '../utils/apiConfig'

export const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem('authToken') || '')
  const [role, setRole] = useState(localStorage.getItem('authRole') || '')
  const [loginError, setLoginError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  const login = useCallback(async (username, password) => {
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
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('authRole', data.role)
      setStatusMessage(`Logged in as ${data.role}`)
      return { success: true, token: data.token, role: data.role }
    } catch (error) {
      setLoginError(error.message)
      return { success: false, error: error.message }
    }
  }, [])

  const logout = useCallback(() => {
    setToken('')
    setRole('')
    localStorage.removeItem('authToken')
    localStorage.removeItem('authRole')
    setStatusMessage('Logged out')
  }, [])

  return {
    token,
    role,
    loginError,
    statusMessage,
    setStatusMessage,
    login,
    logout,
    isAdmin: role === 'admin',
  }
}
