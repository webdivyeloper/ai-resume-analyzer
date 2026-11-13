import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Interceptor to attach Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle global 401 unauth
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register') && window.location.pathname !== '/') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const loginApi = (email, password) => api.post('/auth/login', { email, password });
export const registerApi = (name, email, password, role = 'user') =>
  api.post('/auth/register', { name, email, password, role });
export const getProfileApi = () => api.get('/auth/profile');
export const updateProfileApi = (data) => api.put('/auth/profile', data);

// Resume Services
export const uploadResumeApi = (formData) =>
  api.post('/resumes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const getResumesApi = () => api.get('/resumes');
export const getResumeByIdApi = (id) => api.get(`/resumes/${id}`);
export const deleteResumeApi = (id) => api.delete(`/resumes/${id}`);

// Analysis Services
export const createAnalysisApi = (payload, isFormData = false) => {
  return api.post('/analysis', payload, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
};
export const getAnalysesApi = () => api.get('/analysis');
export const getAnalysisByIdApi = (id) => api.get(`/analysis/${id}`);
export const deleteAnalysisApi = (id) => api.delete(`/analysis/${id}`);
export const getSampleTemplatesApi = () => api.get('/analysis/sample-templates');

// Admin Services
export const getAdminStatsApi = () => api.get('/admin/stats');
export const getAdminUsersApi = () => api.get('/admin/users');
export const deleteAdminUserApi = (id) => api.delete(`/admin/users/${id}`);

export default api;

