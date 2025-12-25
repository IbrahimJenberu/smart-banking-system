import React, { useState, useEffect } from 'react';
import { getUserAccounts } from '../../api/accountApi';
import { transferFunds } from '../../api/transactionApi';
import { useForm } from '../../hooks/useForm';
import { useToast } from '../../hooks/useToast';

const Transfers = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const response = await getUserAccounts();
        
        if (response.status === 'SUCCESS') {
          setAccounts(response.data.filter(account => account.status === 'ACTIVE'));
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
        toast.error('Failed to load accounts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [toast]);

  const validateForm = (values) => {
    const errors = {};
    
    if (!values.sourceAccountNumber) {
      errors.sourceAccountNumber = 'Source account is required';
    }
    
    if (!values.destinationAccountNumber) {
      errors.destinationAccountNumber = 'Destination account is required';
    } else if (values.sourceAccountNumber === values.destinationAccountNumber) {
      errors.destinationAccountNumber = 'Source and destination accounts cannot be the same';
    }
    
    if (!values.amount) {
      errors.amount = 'Amount is required';
    } else if (isNaN(values.amount) || parseFloat(values.amount) <= 0) {
      errors.amount = 'Amount must be greater than zero';
    }
    
    if (!values.currency) {
      errors.currency = 'Currency is required';
    }
    
    return errors;
  };
  
  const handleTransfer = async (values) => {
    try {
      setSubmitting(true);
      const response = await transferFunds(values);
      
      if (response.status === 'SUCCESS') {
        toast.success(response.message);
        resetForm();
      } else {
        toast.error(response.message || 'Transfer failed');
      }
    } catch (error) {
      console.error('Transfer error:', error);
      toast.error(error.response?.data?.message || 'Transfer failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm
  } = useForm(
    {
      sourceAccountNumber: '',
      destinationAccountNumber: '',
      amount: '',
      currency: 'USD',
      description: ''
    },
    handleTransfer,
    validateForm
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transfer Funds</h1>
        <p className="text-gray-600">Send money to another account</p>
      </div>

      <div className="card max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="sourceAccountNumber" className="block text-sm font-medium text-gray-700">
              From Account
            </label>
            <select
              id="sourceAccountNumber"
              name="sourceAccountNumber"
              value={values.sourceAccountNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${
                touched.sourceAccountNumber && errors.sourceAccountNumber ? 'border-red-500' : ''
              }`}
            >
              <option value="">Select source account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.accountNumber}>
                  {account.accountType} - {account.accountNumber} ({account.balance} {account.currency})
                </option>
              ))}
            </select>
            {touched.sourceAccountNumber && errors.sourceAccountNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.sourceAccountNumber}</p>
            )}
          </div>

          <div>
            <label htmlFor="destinationAccountNumber" className="block text-sm font-medium text-gray-700">
              To Account
            </label>
            <input
              id="destinationAccountNumber"
              name="destinationAccountNumber"
              type="text"
              placeholder="Enter destination account number"
              value={values.destinationAccountNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${
                touched.destinationAccountNumber && errors.destinationAccountNumber ? 'border-red-500' : ''
              }`}
            />
            {touched.destinationAccountNumber && errors.destinationAccountNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.destinationAccountNumber}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="Enter amount"
                value={values.amount}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${
                  touched.amount && errors.amount ? 'border-red-500' : ''
                }`}
              />
              {touched.amount && errors.amount && (
                <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
              )}
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={values.currency}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${
                  touched.currency && errors.currency ? 'border-red-500' : ''
                }`}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
              {touched.currency && errors.currency && (
                <p className="mt-1 text-sm text-red-500">{errors.currency}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              placeholder="Enter description (optional)"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              className="form-input"
            ></textarea>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <button
              type="button"
              onClick={resetForm}
              className="btn-secondary"
              disabled={submitting}
            >
              Clear
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <span className="flex items-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Processing...
                </span>
              ) : (
                'Transfer Funds'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Transfers;