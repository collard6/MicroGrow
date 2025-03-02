import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { 
  Users, 
  Layers, 
  ShoppingBag, 
  TrendingUp, 
  Settings, 
  FileText 
} from 'lucide-react';

import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  // Fetch admin dashboard data
  const { data, isLoading, error } = useQuery('adminDashboardData', async () => {
    const response = await axios.get('/api/admin/dashboard');
    return response.data;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorMessage 
          message="Failed to load admin dashboard data. Please try again." 
        />
      </div>
    );
  }

  const stats = data?.stats || {
    totalUsers: 0,
    activeUsers: 0,
    totalTrays: 0,
    totalVarieties: 0,
    totalSales: 0,
    averageYield: 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">System overview and management</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.totalUsers}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/users" className="font-medium text-indigo-600 hover:text-indigo-500">
                View all users
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <Layers className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Trays</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.totalTrays}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/trays" className="font-medium text-green-600 hover:text-green-500">
                View all trays
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <ShoppingBag className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Sales</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">${stats.totalSales}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/sales" className="font-medium text-purple-600 hover:text-purple-500">
                View sales data
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Functions */}
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Admin Functions</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Quick access to administrative tools</p>
        </div>
        <div className="border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            <Link to="/admin/users" className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
              <div className="bg-indigo-100 rounded-full p-3 mr-4">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">User Management</h4>
                <p className="text-sm text-gray-500">Manage system users and permissions</p>
              </div>
            </Link>

            <Link to="/admin/settings" className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
              <div className="bg-gray-100 rounded-full p-3 mr-4">
                <Settings className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">System Settings</h4>
                <p className="text-sm text-gray-500">Configure global application settings</p>
              </div>
            </Link>

            <Link to="/admin/logs" className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
              <div className="bg-blue-100 rounded-full p-3 mr-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">System Logs</h4>
                <p className="text-sm text-gray-500">View application logs and errors</p>
              </div>
            </Link>

            <Link to="/admin/analytics" className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
              <div className="bg-green-100 rounded-full p-3 mr-4">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Analytics</h4>
                <p className="text-sm text-gray-500">System-wide metrics and reports</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Latest system events</p>
          </div>
        </div>
        <div className="border-t border-gray-200">
          {data?.recentActivity && data.recentActivity.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {data.recentActivity.map((activity) => (
                <li key={activity.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">{activity.action}</div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {activity.type}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{activity.date}</div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <span className="font-medium">{activity.user}</span> - {activity.description}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
              No recent activity to display
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
