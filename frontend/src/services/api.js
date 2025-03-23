// src/services/api.js

import axios from 'axios';

// Base API configuration
const API_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 (Unauthorized) - redirect to login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getUser: () => api.get('/auth/user')
};

// Snippets API endpoints
export const snippetService = {
  getAll: () => api.get('/snippets'),
  getById: (id) => api.get(`/snippets/${id}`),
  create: (data) => api.post('/snippets', data),
  update: (id, data) => api.put(`/snippets/${id}`, data),
  delete: (id) => api.delete(`/snippets/${id}`),
  search: (params) => api.get('/snippets/search', { params })
};

// Cache for favorite snippets to avoid repeated API calls
let favoritesCache = null;

// Favorites API endpoints
export const favoriteService = {
  // Get all user favorites
  getAll: async () => {
    const response = await api.get('/favorites');
    favoritesCache = response.data.favorites || response.data;
    return response;
  },
  
  // Add a snippet to favorites
  add: async (id) => {
    const response = await api.post(`/favorites/${id}`);
    favoritesCache = null; // Invalidate cache
    return response;
  },
  
  // Remove a snippet from favorites
  remove: async (id) => {
    const response = await api.delete(`/favorites/${id}`);
    favoritesCache = null; // Invalidate cache
    return response;
  },
  
  // Check if a snippet is in favorites
  isFavorite: async (id) => {
    // If we have a cache, use it to avoid an API call
    if (favoritesCache) {
      return favoritesCache.some(fav => fav.id === parseInt(id));
    }
    
    // Otherwise fetch favorites and check
    const response = await favoriteService.getAll();
    const favorites = response.data.favorites || response.data;
    return favorites.some(fav => fav.id === parseInt(id));
  },
  
  // Toggle favorite status (add if not favorite, remove if favorite)
  toggle: async (id) => {
    const isFavorite = await favoriteService.isFavorite(id);
    
    if (isFavorite) {
      return favoriteService.remove(id);
    } else {
      return favoriteService.add(id);
    }
  }
};

// Tags and languages API endpoints
export const tagService = {
  getAll: () => api.get('/tags'),
  getLanguages: () => api.get('/languages')
};

export default api;