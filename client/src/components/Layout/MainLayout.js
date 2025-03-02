import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import {
  Home,
  Layers,
  Calendar,
  Database,
  BarChart2,
  Sliders,
  User,
  LogOut,
  Menu,
  X,
  CheckCircle,
  Leaf,
  Package,
  ShoppingBag
} from 'lucide-react';

const MainLayout = () => {
  const { user, logout } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Home size={20} /> },
    { name: 'Varieties', path: '/varieties', icon: <Leaf size={20} /> },
    { name: 'Trays', path: '/trays', icon: <Layers size={20} /> },
    { name: 'Schedule', path: '/schedules', icon: <Calendar size={20} /> },
    { name: 'Inventory', path: '/inventory', icon: <Package size={20} /> },
    { name: 'Quality', path: '/quality', icon: <CheckCircle size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart2 size={20} /> },
    { name: 'Marketplace', path: '/marketplace', icon: <ShoppingBag size={20} /> },
  ];

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-green-800">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-green-900">
              <Link to="/" className="flex items-center">
                <Leaf className="h-8 w-8 text-white" />
                <span className="ml-2 text-white font-medium text-lg">MicroGrow</span>
              </Link>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`${
                      location.pathname === item.path
                        ? 'bg-green-700 text-white'
                        : 'text-green-100 hover:bg-green-700'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                ))}
              </nav>
              <div className="px-2 py-4 space-y-1 border-t border-green-700">
                <Link
                  to="/profile"
                  className={`${
                    location.pathname === '/profile'
                      ? 'bg-green-700 text-white'
                      : 'text-green-100 hover:bg-green-700'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <User size={20} />
                  <span className="ml-3">Profile</span>
                </Link>
                <Link
                  to="/settings"
                  className={`${
                    location.pathname === '/settings'
                      ? 'bg-green-700 text-white'
                      : 'text-green-100 hover:bg-green-700'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <Sliders size={20} />
                  <span className="ml-3">Settings</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-green-100 hover:bg-green-700 w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <LogOut size={20} />
                  <span className="ml-3">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`${
          mobileSidebarOpen ? 'fixed inset-0 z-40 flex md:hidden' : 'hidden'
        }`}
        onClick={closeMobileSidebar}
      >
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
        <div
          className="relative flex-1 flex flex-col max-w-xs w-full bg-green-800"
          onClick={e => e.stopPropagation()}
        >
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              onClick={closeMobileSidebar}
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <Leaf className="h-8 w-8 text-white" />
              <span className="ml-2 text-white font-medium text-lg">MicroGrow</span>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`${
                    location.pathname === item.path
                      ? 'bg-green-700 text-white'
                      : 'text-green-100 hover:bg-green-700'
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                  onClick={closeMobileSidebar}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-green-700 p-4">
            <div className="flex-shrink-0 group block">
              <div className="flex items-center">
                <div>
                  <div className="h-10 w-10 bg-green-600 rounded-full flex items-center justify-center text-white">
                    {user?.name?.charAt(0)}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-base font-medium text-white">{user?.name}</p>
                  <p className="text-sm font-medium text-green-200">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 w-14"></div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            onClick={toggleMobileSidebar}
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
