import React, { createContext, useState, useContext, useEffect } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      } catch (e) {
        console.error('Failed to parse user:', e)
      }
    }
    setLoading(false)
  }, [])

  // Login function
  const login = async (email, password) => {
    try {
      const response = await api.post('/login', { email, password })
      const { user, token } = response.data.data
      
      setUser(user)
      setToken(token)
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      toast.success('Login successful!')
      return { success: true, user }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return { success: false, message }
    }
  }

  // Register function
  const register = async (name, email, phone, password, password_confirmation) => {
    try {
      const response = await api.post('/register', {
        name,
        email,
        phone,
        password,
        password_confirmation
      })
      
      const { user, token } = response.data.data
      
      setUser(user)
      setToken(token)
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      toast.success('Registration successful!')
      return { success: true, user }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return { success: false, message }
    }
  }

  // Logout function
  const logout = async () => {
    try {
      if (token) {
        await api.post('/logout')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
    
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    toast.success('Logged out successfully')
  }

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin'
  }

  // Check if user is customer
  const isCustomer = () => {
    return user?.role === 'customer'
  }

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user && !!token
  }

  return (
    <AuthContext.Provider value={{
      user,
      setUser, // ✅ Added this
      token,
      loading,
      login,
      register,
      logout,
      isAdmin,
      isCustomer,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  )
}