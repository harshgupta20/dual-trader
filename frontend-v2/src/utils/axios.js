// src/api/axios.js
import axios from 'axios'

const BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: BACKEND_API_BASE_URL, // change to your backend base URL
  timeout: 20000, // optional
})

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') // or sessionStorage, or Redux state
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized - maybe redirect to login')
      // window.location.href = '/login' (or use a navigation hook)
    }
    return Promise.reject(error)
  }
)

export default axiosInstance;
