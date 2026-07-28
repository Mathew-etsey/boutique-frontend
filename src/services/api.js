import axios from 'axios'

// ✅ Detect environment
const isProduction = window.location.hostname !== 'localhost'

// ✅ Set URLs based on environment
const API_URL = isProduction 
  ? 'https://onlineshoppingboutique-production.up.railway.app/api'
  : 'http://localhost:8000/api'

const BASE_URL = isProduction
  ? 'https://onlineshoppingboutique-production.up.railway.app'
  : 'http://localhost:8000'

console.log('🔍 Environment:', isProduction ? 'Production' : 'Local')
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

/**
 * Helper function to get image URL
 * Handles both local storage paths and Cloudinary URLs
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL (Cloudinary)
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // For local storage paths
  // Remove any leading slashes to avoid double slashes
  const cleanPath = imagePath.replace(/^\/+/, '');
  
  // If it's a storage path
  if (cleanPath.startsWith('storage/')) {
    return `${BASE_URL}/${cleanPath}`;
  }
  
  return `${BASE_URL}/storage/${cleanPath}`;
}

export default api