import API from './axios';

export const authApi = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => {
    if (data instanceof FormData) {
      return API.put('/auth/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return API.put('/auth/profile', data);
  },
};
