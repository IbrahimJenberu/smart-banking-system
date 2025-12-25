import React, { useState, useEffect } from 'react';
import { getPendingLoans, approveLoan } from '../../api/loanApi';
import { usePagination } from '../../hooks/usePagination';
import { useToast } from '../../hooks/useToast';
import { FileText, Check, X } from 'lucide-react';

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingLoan, setProcessingLoan] = useState(null);
  const pagination = usePagination();
  const toast = useToast();
  
  useEffect(() => {
    fetchLoans();
  }, [pagination.page, pagination.size]);
  
  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await getPendingLoans(pagination.page, pagination.size);
      
      if (response.status === 'SUCCESS') {
        setLoans(response.data.content);
        pagination.updatePagination({
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements
        });
      }
    } catch (error) {
      console.error('Error fetching loans:', error);
      toast.error('Failed to load loan applications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLoanApproval = async (loanId, approved, comments = '') => {
    try {
      setProcessingLoan(loanId);
      
      const response = await approveLoan({
        loanId,
        approved,
        comments
      });
      
      if (response.status === 'SUCCESS') {
        toast.success(approved ? 'Loan approved successfully' : 'Loan rejected');
        // Remove the loan from the list
        setLoans(loans.filter(loan => loan.id !== loanId));
        
        // Update pagination
        pagination.updatePagination({
          totalPages: pagination.totalElements === 1 
            ? pagination.totalPages - 1 
            : pagination.totalPages,
          totalElements: pagination.totalElements - 1
        });
      }
    } catch (error) {
      console.error('Error processing loan approval:', error);
      toast.error(error.response?.data?.message || 'Failed to process loan. Please try again.');
    } finally {
      setProcessingLoan(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Loan Applications</h1>
        <p className="text-gray-600">Approve or reject pending loan applications</p>
      </div>
      
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : loans.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <FileText className="h-12 w-12 mb-2" />
            <p>No pending loan applications</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Term</th>
                    <th>Interest Rate</th>
                    <th>Purpose</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loans.map((loan) => (
                    <tr key={loan.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {loan.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {loan.user ? (
                          <div>
                            <div className="text-sm font-medium text-gray-900">{loan.user.fullName}</div>
                            <div className="text-sm text-gray-500">{loan.user.email}</div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">ID: {loan.userId}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {parseFloat(loan.amount).toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {loan.termMonths} months
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {loan.interestRate}%
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {loan.purpose}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                          {loan.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(loan.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {processingLoan === loan.id ? (
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 inline-block"></span>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleLoanApproval(loan.id, true)}
                              className="text-green-600 hover:text-green-800"
                              title="Approve"
                            >
                              <Check className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleLoanApproval(loan.id, false)}
                              className="text-red-600 hover:text-red-800"
                              title="Reject"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="pagination mt-6">
              <button
                onClick={pagination.prevPage}
                disabled={!pagination.hasPrevPage}
                className={pagination.hasPrevPage ? 'pagination-item' : 'pagination-item-disabled'}
              >
                Previous
              </button>
              
              <span className="px-4 py-2">
                Page {pagination.page + 1} of {pagination.totalPages || 1}
              </span>
              
              <button
                onClick={pagination.nextPage}
                disabled={!pagination.hasNextPage}
                className={pagination.hasNextPage ? 'pagination-item' : 'pagination-item-disabled'}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Loans;