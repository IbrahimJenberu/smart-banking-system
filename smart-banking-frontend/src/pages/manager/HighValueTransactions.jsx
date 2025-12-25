import React, { useState, useEffect } from 'react';
import { getHighValueTransactions, approveTransaction } from '../../api/transactionApi';
import { usePagination } from '../../hooks/usePagination';
import { useToast } from '../../hooks/useToast';
import { CheckCircle, XCircle, AlertTriangle, ArrowRightLeft } from 'lucide-react';

const HighValueTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingTx, setProcessingTx] = useState(null);
  const pagination = usePagination();
  const toast = useToast();
  
  useEffect(() => {
    fetchTransactions();
  }, [pagination.page, pagination.size]);
  
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await getHighValueTransactions(pagination.page, pagination.size);
      
      if (response.status === 'SUCCESS') {
        setTransactions(response.data.content);
        pagination.updatePagination({
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements
        });
      }
    } catch (error) {
      console.error('Error fetching high-value transactions:', error);
      toast.error('Failed to load transactions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleTransactionApproval = async (transactionId, approved) => {
    try {
      setProcessingTx(transactionId);
      
      const response = await approveTransaction(transactionId, approved);
      
      if (response.status === 'SUCCESS') {
        toast.success(approved 
          ? 'Transaction approved and processed successfully' 
          : 'Transaction rejected'
        );
        
        // Remove the transaction from the list
        setTransactions(transactions.filter(tx => tx.id !== transactionId));
        
        // Update pagination
        pagination.updatePagination({
          totalPages: pagination.totalElements === 1 
            ? pagination.totalPages - 1 
            : pagination.totalPages,
          totalElements: pagination.totalElements - 1
        });
      }
    } catch (error) {
      console.error('Error processing transaction approval:', error);
      toast.error(error.response?.data?.message || 'Failed to process transaction. Please try again.');
    } finally {
      setProcessingTx(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">High-Value Transaction Approvals</h1>
        <p className="text-gray-600">Review and approve high-value transactions requiring management authorization</p>
      </div>
      
      <div className="card">
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                These transactions exceed the automatic approval threshold and require manual review.
                Please verify the source, destination, and amount carefully before approval.
              </p>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <ArrowRightLeft className="h-12 w-12 mb-2" />
            <p>No pending high-value transactions</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Reference ID</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Amount</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.referenceId.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.sourceAccountNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.destinationAccountNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {parseFloat(transaction.amount).toLocaleString('en-US', {
                            style: 'currency',
                            currency: transaction.currency
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {transaction.transactionType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {transaction.description || 'No description'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {processingTx === transaction.id ? (
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 inline-block"></span>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleTransactionApproval(transaction.id, true)}
                              className="text-green-600 hover:text-green-800"
                              title="Approve"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleTransactionApproval(transaction.id, false)}
                              className="text-red-600 hover:text-red-800"
                              title="Reject"
                            >
                              <XCircle className="h-5 w-5" />
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

export default HighValueTransactions;