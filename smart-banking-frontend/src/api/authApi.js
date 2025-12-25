import apiClient from './apiClient';

export const loginApi = (credentials) => {
  return apiClient.post('/auth/login', credentials);
};

export const registerApi = (userData) => {
  return apiClient.post('/auth/register', userData);
};