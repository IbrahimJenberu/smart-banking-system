import apiClient from './apiClient';

export const getUserAccounts = () => {
  return apiClient.get('/customer/accounts');
};

export const getAccountDetails = (accountNumber) => {
  return apiClient.get(`/customer/accounts/${accountNumber}`);
};

export const createAccount = (accountType, currency) => {
  return apiClient.post(`/customer/accounts?accountType=${accountType}&currency=${currency}`);
};

export const getAccountTransactions = (accountNumber, page = 0, size = 20, startDate, endDate) => {
  let url = `/customer/accounts/${accountNumber}/transactions?page=${page}&size=${size}`;
  
  if (startDate) {
    url += `&startDate=${startDate.toISOString()}`;
  }
  
  if (endDate) {
    url += `&endDate=${endDate.toISOString()}`;
  }
  
  return apiClient.get(url);
};

// Admin endpoints
export const adminGetAccountDetails = (accountNumber) => {
  return apiClient.get(`/admin/accounts/${accountNumber}`);
};

export const changeAccountStatus = (accountNumber, status) => {
  return apiClient.put(`/admin/accounts/${accountNumber}/status?status=${status}`);
};