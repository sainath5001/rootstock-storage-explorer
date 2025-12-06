import axios, { AxiosError, AxiosInstance } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 120000, // 2 minutes timeout for large storage reads
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data as any;

      switch (status) {
        case 400:
          throw new Error(data.message || 'Invalid request. Please check the contract address.');
        case 404:
          throw new Error('Resource not found.');
        case 500:
          throw new Error(data.message || 'Server error. Please try again later.');
        case 503:
          throw new Error('Service unavailable. The backend may be down.');
        default:
          throw new Error(data.message || `Error: ${status}`);
      }
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('No response from server. Please check your connection and that the backend is running.');
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred.');
    }
  }
);

export default apiClient;

