import axios from 'axios';
import { useAppStore } from '@/store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = useAppStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAppStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/api/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  
  getProfile: () =>
    api.get('/api/auth/profile'),
  
  updateProfile: (data: any) =>
    api.put('/api/auth/profile', data)
};

// Sessions API
export const sessionsAPI = {
  create: (data: any) =>
    api.post('/api/sessions', data),
  
  getAll: () =>
    api.get('/api/sessions'),
  
  getById: (id: string) =>
    api.get(`/api/sessions/${id}`),
  
  delete: (id: string) =>
    api.delete(`/api/sessions/${id}`)
};

// Stats API
export const statsAPI = {
  getUserStats: () =>
    api.get('/api/stats'),
  
  getLeaderboard: () =>
    api.get('/api/stats/leaderboard'),
  
  getProgress: (period: 'week' | 'month' | 'year') =>
    api.get(`/api/stats/progress?period=${period}`)
};

export default api;