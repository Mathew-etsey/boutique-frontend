import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// ✅ ADD THIS: Log the API URL to console
console.log('🔍 API_URL is set to:', API_URL)

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
  },
})

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // ✅ ADD THIS: Log the full request URL
  console.log('📡 API Request:', config.baseURL + config.url)
  return config
})

export default api