import apiClient from './apiClient';

export const transferFunds = (transferData) => {
  return apiClient.post('/customer/transfers', transferData);
};

// Manager endpoints
export const getHighValueTransactions = (page = 0, size = 20) => {
  return apiClient.get(`/manager/transactions/high-value?page=${page}&size=${size}`);
};

export const approveTransaction = (transactionId, approved) => {
  return apiClient.put(`/manager/transactions/${transactionId}/approve?approved=${approved}`);
};