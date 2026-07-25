import axios from 'axios'

// ✅ Use hardcoded Railway URL as fallback
const API_URL = import.meta.env.VITE_API_URL || 'https://onlineshoppingboutique-production.up.railway.app'

console.log('🔍 API_URL is set to:', API_URL)

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  console.log('📡 API Request:', config.baseURL + config.url)
  return config
})

export default api