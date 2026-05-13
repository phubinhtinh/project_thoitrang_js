import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

// Auto attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/auth/profile'),
};

// Categories APIs
export const categoriesAPI = {
  getAll: () => API.get('/categories'),
  getOne: (id) => API.get(`/categories/${id}`),
  create: (data) => API.post('/categories', data),
  update: (id, data) => API.put(`/categories/${id}`, data),
  remove: (id) => API.delete(`/categories/${id}`),
};

// Products APIs
export const productsAPI = {
  getAll: (params) => API.get('/products', { params }),
  getOne: (id) => API.get(`/products/${id}`),
  create: (data) => API.post('/products', data),
  update: (id, data) => API.put(`/products/${id}`, data),
  remove: (id) => API.delete(`/products/${id}`),
};

// Upload APIs
export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return API.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Colors APIs (ProductColor — màu + ảnh)
export const colorsAPI = {
  getByProduct: (productId) => API.get(`/products/${productId}/colors`),
  create: (productId, data) => API.post(`/products/${productId}/colors`, data),
  update: (id, data) => API.put(`/colors/${id}`, data),
  remove: (id) => API.delete(`/colors/${id}`),
};

// Variants APIs (ProductVariant — size + stock + SKU, thuộc về 1 color)
export const variantsAPI = {
  create: (colorId, data) => API.post(`/colors/${colorId}/variants`, data),
  update: (id, data) => API.put(`/variants/${id}`, data),
  remove: (id) => API.delete(`/variants/${id}`),
};

// Cart APIs
export const cartAPI = {
  getCart: () => API.get('/cart'),
  addItem: (data) => API.post('/cart', data),
  updateItem: (id, data) => API.put(`/cart/${id}`, data),
  removeItem: (id) => API.delete(`/cart/${id}`),
};

// Orders APIs
export const ordersAPI = {
  checkout: (data) => API.post('/orders/checkout', data),
  getAll: () => API.get('/orders'),
  getOne: (id) => API.get(`/orders/${id}`),
  updateStatus: (id, data) => API.put(`/orders/${id}/status`, data),
  updatePayment: (id, data) => API.put(`/orders/${id}/payment`, data),
  confirmBanking: (id) => API.post(`/orders/${id}/confirm-banking`),
};

// Reviews APIs
export const reviewsAPI = {
  getByProduct: (productId) => API.get(`/products/${productId}/reviews`),
  create: (productId, data) => API.post(`/products/${productId}/reviews`, data),
  remove: (id) => API.delete(`/reviews/${id}`),
};

export default API;
