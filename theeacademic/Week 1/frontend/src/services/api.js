import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
};

// Products API
export const productsAPI = {
  getProducts: (params = {}) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  getCategories: () => api.get('/products/categories'),
};

// Cart API
export const cartAPI = {
  addToCart: (productId, quantity = 1) => 
    api.post('/cart/add-to-cart', { productId, quantity }),
  getCart: (userId) => api.get(`/cart/get-cart/${userId}`),
  updateCartItem: (productId, quantity) => 
    api.put(`/cart/update-item/${productId}`, { quantity }),
  removeFromCart: (productId) => 
    api.delete(`/cart/remove-item/${productId}`),
  clearCart: () => api.delete('/cart/clear-cart'),
};

export default api;
