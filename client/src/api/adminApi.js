import API from './axios';

export const adminApi = {
  getStats: () => API.get('/admin/stats'),
  getLocationStats: () => API.get('/admin/locations'),
  getAllRides: (params) => API.get('/admin/rides', { params }),
  updateRide: (id, data) => API.put(`/admin/rides/${id}`, data),
  deleteRide: (id) => API.delete(`/admin/rides/${id}`),
  getAllUsers: (params) => API.get('/admin/users', { params }),
  updateUserRole: (id, data) => API.put(`/admin/users/${id}/role`, data),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  toggleUserActive: (id) => API.put(`/admin/users/${id}/toggle-active`),
};
