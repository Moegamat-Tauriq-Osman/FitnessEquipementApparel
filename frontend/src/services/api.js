import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const protectedRoutes = ['/orders', '/checkout'];
    const currentPath = window.location.pathname;
    
    if (error.response?.status === 401 && protectedRoutes.some(route => currentPath.includes(route))) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/Register', userData),
  logout: () => api.post('/logout'),
  getMe: () => api.get('/me'),
};

export const productsAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (categoryId) => api.get(`/products/category/${categoryId}`),
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
  search: (query) => api.get(`/search?q=${query}`),
};

export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (categoryData) => api.post('/categories', categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/categories/${id}`),
};


export const cartAPI = {
  get: () => api.get('/cart'),
  add: (item) => api.post('/cart/add', item),
  update: (itemId, updates) => api.put(`/cart/update/${itemId}`, updates),
  remove: (itemId) => api.delete(`/cart/remove/${itemId}`),
  clear: () => api.delete('/cart/clear'),
};

export const ordersAPI = {
  create: (orderData) => api.post('/order', orderData),
  getUserOrders: () => api.get('/my'),
  getById: (orderId) => api.get(`/${orderId}`),
  updateStatus: (orderId, statusData) => api.put(`/${orderId}/status`, statusData),
  cancelOrder: (orderId) => api.delete(`/${orderId}/cancel`), 

  getAllOrders: () => api.get('/admin/all'),
  getOrderStats: () => api.get('/admin/stats'),
};

export default api;