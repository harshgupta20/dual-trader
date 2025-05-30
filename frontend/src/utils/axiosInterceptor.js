import axios from 'axios';

// Create instance
const axiosInstance = axios.create({
  baseURL: 'https://api.example.com', // replace with your API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // or use cookies/storage as needed
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common error logic here
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized, redirecting...');
      // Optionally redirect to login page or refresh token
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
