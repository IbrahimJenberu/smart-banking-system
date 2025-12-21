import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, CreditCard, ArrowRightLeft, FileText, Users, 
  Settings, PieChart, AlertTriangle, X 
} from 'lucide-react';

const Sidebar = ({ isOpen, toggle, userRole }) => {
  const navLinkClass = ({ isActive }) => 
    isActive ? 'sidebar-link-active' : 'sidebar-link';

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={toggle}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-30 w-64 h-screen bg-white shadow-md transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-6 border-b">
            <h2 className="text-xl font-bold text-blue-700">Smart Banking</h2>
            <button className="p-1 rounded-md text-gray-700 lg:hidden" onClick={toggle}>
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Sidebar links based on user role */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            {userRole === 'CUSTOMER' && (
              <div className="space-y-2">
                <NavLink to="/customer/dashboard" className={navLinkClass}>
                  <Home className="w-5 h-5 mr-4" />
                  <span>Dashboard</span>
                </NavLink>
                <NavLink to="/customer/accounts" className={navLinkClass}>
                  <CreditCard className="w-5 h-5 mr-4" />
                  <span>Accounts</span>
                </NavLink>
                <NavLink to="/customer/transactions" className={navLinkClass}>
                  <ArrowRightLeft className="w-5 h-5 mr-4" />
                  <span>Transactions</span>
                </NavLink>
                <NavLink to="/customer/transfers" className={navLinkClass}>
                  <ArrowRightLeft className="w-5 h-5 mr-4" />
                  <span>Transfer Funds</span>
                </NavLink>
                <NavLink to="/customer/loans" className={navLinkClass}>
                  <FileText className="w-5 h-5 mr-4" />
                  <span>Loans</span>
                </NavLink>
                <NavLink to="/profile" className={navLinkClass}>
                  <Settings className="w-5 h-5 mr-4" />
                  <span>Profile</span>
                </NavLink>
              </div>
            )}
            
            {userRole === 'ADMIN' && (
              <div className="space-y-2">
                <NavLink to="/admin/dashboard" className={navLinkClass}>
                  <Home className="w-5 h-5 mr-4" />
                  <span>Dashboard</span>
                </NavLink>
                <NavLink to="/admin/users" className={navLinkClass}>
                  <Users className="w-5 h-5 mr-4" />
                  <span>User Management</span>
                </NavLink>
                <NavLink to="/admin/accounts" className={navLinkClass}>
                  <CreditCard className="w-5 h-5 mr-4" />
                  <span>Account Management</span>
                </NavLink>
                <NavLink to="/admin/loans" className={navLinkClass}>
                  <FileText className="w-5 h-5 mr-4" />
                  <span>Loan Approvals</span>
                </NavLink>
                <NavLink to="/admin/audit" className={navLinkClass}>
                  <AlertTriangle className="w-5 h-5 mr-4" />
                  <span>Audit Logs</span>
                </NavLink>
                <NavLink to="/profile" className={navLinkClass}>
                  <Settings className="w-5 h-5 mr-4" />
                  <span>Profile</span>
                </NavLink>
              </div>
            )}
            
            {userRole === 'MANAGER' && (
              <div className="space-y-2">
                <NavLink to="/manager/dashboard" className={navLinkClass}>
                  <Home className="w-5 h-5 mr-4" />
                  <span>Dashboard</span>
                </NavLink>
                <NavLink to="/manager/analytics" className={navLinkClass}>
                  <PieChart className="w-5 h-5 mr-4" />
                  <span>Analytics</span>
                </NavLink>
                <NavLink to="/manager/high-value-transactions" className={navLinkClass}>
                  <ArrowRightLeft className="w-5 h-5 mr-4" />
                  <span>High Value Approvals</span>
                </NavLink>
                <NavLink to="/manager/reports" className={navLinkClass}>
                  <FileText className="w-5 h-5 mr-4" />
                  <span>Reports</span>
                </NavLink>
                <NavLink to="/profile" className={navLinkClass}>
                  <Settings className="w-5 h-5 mr-4" />
                  <span>Profile</span>
                </NavLink>
              </div>
            )}
          </nav>
          
          {/* Sidebar footer */}
          <div className="p-4 border-t text-center text-xs text-gray-500">
            Smart Banking System v1.0
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;