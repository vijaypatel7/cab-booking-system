import API from './axios';

export const userApi = {
  getStats: () => API.get('/users/stats'),
  getUsers: (params) => API.get('/users', { params }),
  deleteUser: (id) => API.delete(`/users/${id}`),
};
