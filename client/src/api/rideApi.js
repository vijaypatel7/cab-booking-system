import API from './axios';

export const rideApi = {
  bookRide: (data) => API.post('/rides', data),
  getRides: (params) => API.get('/rides', { params }),
  getRide: (id) => API.get(`/rides/${id}`),
  cancelRide: (id, data) => API.put(`/rides/${id}/cancel`, data),
  rateRide: (id, data) => API.put(`/rides/${id}/rate`, data),
};
