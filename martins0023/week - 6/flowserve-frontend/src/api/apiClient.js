import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
  // Use the backend URL from your .env file
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Response Interceptor ---
// This is crucial for handling errors gracefully.
// It intercepts the backend's structured error response.
apiClient.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Just return the response data
    return response.data;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    
    let errorMessage = 'An unexpected error occurred';
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      // Use the error message from our backend's ApiResponse/ApiError
      errorMessage = error.response.data.message || error.message;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response from server. Please check your network connection.';
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message;
    }

    // Return a rejected Promise with the structured error message
    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;
