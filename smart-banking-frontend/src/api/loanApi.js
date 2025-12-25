import apiClient from './apiClient';

export const getUserLoans = (page = 0, size = 20) => {
  return apiClient.get(`/customer/loans?page=${page}&size=${size}`);
};

export const requestLoan = (loanData) => {
  return apiClient.post('/customer/loans', loanData);
};

// Admin endpoints
export const getPendingLoans = (page = 0, size = 20) => {
  return apiClient.get(`/admin/loans/pending?page=${page}&size=${size}`);
};

export const approveLoan = (approvalData) => {
  return apiClient.put('/admin/loans/approval', approvalData);
};