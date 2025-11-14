import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true, // This is crucial for sending cookies
});

// Interceptor to handle expired access tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await api.post('/auth/refresh-token');
        // The new accessToken is automatically set in the cookie by the backend
        // We just need to retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login (handled in components)
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;