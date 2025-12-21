import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../../auth/useAuth';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();

  const dashboardLink = () => {
    const role = user?.role?.toLowerCase();
    if (role === 'customer') return '/customer/dashboard';
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'manager') return '/manager/dashboard';
    return '/';
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-700 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link
            to={dashboardLink()}
            className="ml-2 md:ml-4 text-xl font-bold text-blue-700"
          >
            Smart Banking
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100">
            <Bell className="h-5 w-5" />
          </button>
          
          <div className="relative group">
            <button className="flex items-center space-x-2 p-2 rounded-full text-gray-600 hover:bg-gray-100">
              <User className="h-5 w-5" />
              <span className="hidden md:block font-medium">{user?.username}</span>
            </button>
            
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 hidden group-hover:block">
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </Link>
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;