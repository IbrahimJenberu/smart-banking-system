import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, ArrowRightLeft, FileText, TrendingUp } from 'lucide-react';
import { getUserAccounts } from '../../api/accountApi';
import { getAccountTransactions } from '../../api/accountApi';
import { getUserLoans } from '../../api/loanApi';
import { useToast } from '../../hooks/useToast';

const Dashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch accounts
        const accountsResponse = await getUserAccounts();
        if (accountsResponse.status === 'SUCCESS') {
          setAccounts(accountsResponse.data);
          
          // Calculate total balance
          const total = accountsResponse.data.reduce(
            (sum, account) => sum + parseFloat(account.balance), 0
          );
          setTotalBalance(total);
          
          // Fetch recent transactions for the first account
          if (accountsResponse.data.length > 0) {
            const firstAccount = accountsResponse.data[0];
            const transactionsResponse = await getAccountTransactions(
              firstAccount.accountNumber, 0, 5
            );
            
            if (transactionsResponse.status === 'SUCCESS') {
              setRecentTransactions(transactionsResponse.data.content);
            }
          }
        }
        
        // Fetch loans
        const loansResponse = await getUserLoans(0, 5);
        if (loansResponse.status === 'SUCCESS') {
          setLoans(loansResponse.data.content);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to your Smart Banking dashboard</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/customer/transfers" className="btn-primary">
            New Transfer
          </Link>
        </div>
      </div>

      {/* Account Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Your Accounts</h2>
              <Link to="/customer/accounts" className="text-sm text-blue-600 hover:text-blue-800">
                View All
              </Link>
            </div>
            
            {accounts.length === 0 ? (
              <div className="p-4 text-center bg-gray-50 rounded-md">
                <p className="text-gray-600">You don't have any accounts yet.</p>
                <Link to="/customer/accounts" className="mt-2 btn-primary inline-block">
                  Open a New Account
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {accounts.map((account) => (
                  <div key={account.id} className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-md font-medium text-gray-900">
                        {account.accountType} - {account.accountNumber}
                      </h3>
                      <p className="text-sm text-gray-500">{account.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        {parseFloat(account.balance).toLocaleString('en-US', {
                          style: 'currency',
                          currency: account.currency
                        })}
                      </p>
                      <p className="text-sm text-gray-500">{account.currency}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div>
          <div className="card bg-gradient-to-br from-blue-500 to-blue-700 text-white">
            <h2 className="text-lg font-semibold mb-4">Total Balance</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">
                  {totalBalance.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  })}
                </p>
                <p className="text-sm mt-1 opacity-80">Across all accounts</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          <Link to="/customer/transactions" className="text-sm text-blue-600 hover:text-blue-800">
            View All
          </Link>
        </div>
        
        {recentTransactions.length === 0 ? (
          <div className="p-4 text-center bg-gray-50 rounded-md">
            <p className="text-gray-600">No recent transactions found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <ArrowRightLeft className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-900">
                          {transaction.referenceId.substring(0, 8)}...
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.transactionType}
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
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        transaction.status === 'COMPLETED' 
                          ? 'bg-green-100 text-green-800' 
                          : transaction.status === 'FAILED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Active Loans */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Your Loans</h2>
          <Link to="/customer/loans" className="text-sm text-blue-600 hover:text-blue-800">
            View All
          </Link>
        </div>
        
        {loans.length === 0 ? (
          <div className="p-4 text-center bg-gray-50 rounded-md">
            <p className="text-gray-600">You don't have any loans.</p>
            <Link to="/customer/loans" className="mt-2 text-blue-600 hover:text-blue-800">
              Apply for a Loan
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {loans.map((loan) => (
              <div key={loan.id} className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-md font-medium text-gray-900">
                    Loan #{loan.id}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {loan.termMonths} months at {loan.interestRate}% interest
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    {parseFloat(loan.amount).toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    })}
                  </p>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    loan.status === 'APPROVED' || loan.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800' 
                      : loan.status === 'REJECTED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {loan.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;