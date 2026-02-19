import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Get auth config with token
const getAuthConfig = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  return {
    headers: {
      Authorization: `Bearer ${userInfo?.token}`
    }
  };
};

// Income API
export const incomeAPI = {
  getAll: (params = {}) => axios.get(`${API_URL}/income`, { ...getAuthConfig(), params }),
  create: (data) => axios.post(`${API_URL}/income`, data, getAuthConfig()),
  update: (id, data) => axios.put(`${API_URL}/income/${id}`, data, getAuthConfig()),
  delete: (id) => axios.delete(`${API_URL}/income/${id}`, getAuthConfig())
};

// Expense API
export const expenseAPI = {
  getAll: (params = {}) => axios.get(`${API_URL}/expense`, { ...getAuthConfig(), params }),
  create: (data) => axios.post(`${API_URL}/expense`, data, getAuthConfig()),
  update: (id, data) => axios.put(`${API_URL}/expense/${id}`, data, getAuthConfig()),
  delete: (id) => axios.delete(`${API_URL}/expense/${id}`, getAuthConfig())
};

// Contact API
export const contactAPI = {
  create: (data) => axios.post(`${API_URL}/contact`, data, getAuthConfig())
};

// Admin API
export const adminAPI = {
  getUsers: () => axios.get(`${API_URL}/admin/users`, getAuthConfig()),
  deleteUser: (id) => axios.delete(`${API_URL}/admin/users/${id}`, getAuthConfig()),
  getContacts: () => axios.get(`${API_URL}/admin/contacts`, getAuthConfig()),
  updateContact: (id, data) => axios.put(`${API_URL}/admin/contacts/${id}`, data, getAuthConfig())
};
