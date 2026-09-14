import axios from 'axios';

const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ========== AUTH API ==========
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  telegramLogin: (data) => apiClient.post('/auth/telegram', data),
  refreshToken: (data) => apiClient.post('/auth/refresh', data),
  getProfile: () => apiClient.get('/profile'),
  updateProfile: (data) => apiClient.put('/profile', data),
  requestPasswordReset: (email) => apiClient.post('/auth/reset-request', { email }),
  resetPassword: (data) => apiClient.post('/auth/reset', data),
};

// ========== SERVICES API ==========
export const servicesAPI = {
  getAll: () => apiClient.get('/services'),
  getByCode: (code) => apiClient.get(`/services/${code}`),
};

// ========== CALCULATIONS API ==========
export const calculationsAPI = {
  create: (data) => apiClient.post('/calculations', data),
  getHistory: (params) => apiClient.get('/calculations', { params }),
  getById: (id) => apiClient.get(`/calculations/${id}`),
};

// ========== BALANCE API ==========
export const balanceAPI = {
  getBalance: () => apiClient.get('/balance'),
  getTransactions: (params) => apiClient.get('/transactions', { params }),
};

// ========== SUBSCRIPTIONS API ==========
export const subscriptionsAPI = {
  getAll: () => apiClient.get('/subscriptions'),
  create: (data) => apiClient.post('/subscriptions', data),
  cancel: (id) => apiClient.delete(`/subscriptions/${id}`),
};

// ========== MODULE-SPECIFIC API ==========
export const numerologyAPI = {
  calculateBasic: (data) => apiClient.post('/numerology/calculate/basic', data),
  calculateFull: (data) => apiClient.post('/numerology/calculate/full', data),
  getProfile: (id) => apiClient.get(`/numerology/profile/${id}`),
};

export const astrologyAPI = {
  calculate: (data) => apiClient.post('/astrology/calculate', data),
  getProfile: (id) => apiClient.get(`/astrology/profile/${id}`),
};

export const astropsychologyAPI = {
  calculate: (type, data) => apiClient.post(`/astropsychology/calculate/${type}`, data),
  getProfile: (id) => apiClient.get(`/astropsychology/profile/${id}`),
};

export default apiClient;