import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },
  
  verify: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },

  setupAdmin: async (credentials) => {
    const response = await api.post('/auth/setup-admin', credentials);
    return response.data;
  }
};

// Dashboard services
export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
  
  getPerformance: async (period = '30') => {
    const response = await api.get(`/dashboard/performance?period=${period}`);
    return response.data;
  },
  
  getAlerts: async () => {
    const response = await api.get('/dashboard/alerts');
    return response.data;
  }
};

// Proposal services
export const proposalService = {
  getAll: async (params = {}) => {
    const response = await api.get('/proposals', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/proposals/${id}`);
    return response.data;
  },
  
  updateStatus: async (id, status) => {
    const response = await api.patch(`/proposals/${id}/status`, { status });
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/proposals/${id}`);
    return response.data;
  },
  
  bulkUpdateStatus: async (proposalIds, status) => {
    const response = await api.patch('/proposals/bulk/status', { proposalIds, status });
    return response.data;
  }
};

// Upload services
export const uploadService = {
  uploadExcel: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('excelFile', file);
    
    const response = await api.post('/upload/excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    });
    
    return response.data;
  },
  
  getHistory: async () => {
    const response = await api.get('/upload/history');
    return response.data;
  }
};

export default api;