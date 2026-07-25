import axios from 'axios'

// ✅ Add /api to the Railway URL
const API_URL = 'https://onlineshoppingboutique-production.up.railway.app/api'

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