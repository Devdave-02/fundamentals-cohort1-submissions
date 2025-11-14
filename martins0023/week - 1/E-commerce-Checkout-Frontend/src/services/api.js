import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const cartAPI = {
  addToCart: (item) => api.post('/cart/add-to-cart', item),
  getCart: (userId) => api.get(`/cart/get-cart/${userId}`),
  updateCartItem: (data) => api.put('/cart/update-item', data),
  removeFromCart: (data) => api.delete('/cart/remove-item', { data }),
  clearCart: (userId) => api.delete(`/cart/clear/${userId}`)
};

export default api;