import React, { useState, useEffect } from 'react';
import { getUsersApi, changeUserStatusApi } from '../../api/adminApi';
import { usePagination } from '../../hooks/usePagination';
import { useToast } from '../../hooks/useToast';
import { UserPlus, Search, Users as UsersIcon, Check, X } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(null);
  const pagination = usePagination();
  const toast = useToast();

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.size, selectedRole, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsersApi({
        page: pagination.page,
        size: pagination.size,
        role: selectedRole,
        search: searchTerm
      });
      
      if (response.status === 'SUCCESS') {
        setUsers(response.data.content);
        pagination.updatePagination({
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusChange = async (userId, newStatus) => {
    try {
      setStatusUpdating(userId);
      const response = await changeUserStatusApi(userId, newStatus);
      
      if (response.status === 'SUCCESS') {
        toast.success(`User status updated to ${newStatus}`);
        // Update user status in the list
        setUsers(users.map(user => 
          user.id === userId ? { ...user, status: newStatus } : user
        ));
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error(error.response?.data?.message || 'Failed to update user status');
    } finally {
      setStatusUpdating(null);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    pagination.goToPage(0); // Reset to first page when searching
    fetchUsers();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage system users</p>
        </div>
        <button className="mt-4 md:mt-0 btn-primary flex items-center">
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </button>
      </div>
      
      <div className="card">
        <div className="flex flex-col md:flex-row items-center mb-6 gap-4">
          <div className="flex-1">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search users..."
                className="form-input pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>
          
          <div className="w-full md:w-48">
            <select
              className="form-input"
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                pagination.goToPage(0);
              }}
            >
              <option value="">All Roles</option>
              <option value="CUSTOMER">Customers</option>
              <option value="ADMIN">Admins</option>
              <option value="MANAGER">Managers</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <UsersIcon className="h-12 w-12 mb-2" />
            <p>No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.role === 'ADMIN' 
                          ? 'bg-purple-100 text-purple-800' 
                          : user.role === 'MANAGER'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {statusUpdating === user.id ? (
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 inline-block"></span>
                      ) : (
                        <div className="flex space-x-2">
                          {user.status === 'ACTIVE' ? (
                            <button
                              onClick={() => handleStatusChange(user.id, 'INACTIVE')}
                              className="text-red-600 hover:text-red-800"
                              title="Deactivate"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(user.id, 'ACTIVE')}
                              className="text-green-600 hover:text-green-800"
                              title="Activate"
                            >
                              <Check className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        <div className="pagination">
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
      </div>
    </div>
  );
};

export default Users;