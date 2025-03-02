import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash, 
  CheckCircle, 
  XCircle, 
  User,
  Shield,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';

const UserManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users data
  const { data: users, isLoading, error } = useQuery('users', async () => {
    const response = await axios.get('/api/admin/users');
    return response.data;
  });

  // Delete user mutation
  const deleteUserMutation = useMutation(
    async (userId) => {
      await axios.delete(`/api/admin/users/${userId}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
      },
    }
  );

  // Toggle admin status mutation
  const toggleAdminMutation = useMutation(
    async ({ userId, isAdmin }) => {
      await axios.patch(`/api/admin/users/${userId}/role`, {
        role: isAdmin ? 'user' : 'admin',
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
      },
    }
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (role) => {
    setFilterRole(role);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteUser = (user) => {
    if (window.confirm(`Are you sure you want to delete user ${user.name}?`)) {
      deleteUserMutation.mutate(user.id);
    }
  };

  const handleToggleAdmin = (user) => {
    const confirmMessage = user.role === 'admin'
      ? `Remove admin privileges from ${user.name}?`
      : `Grant admin privileges to ${user.name}?`;
    
    if (window.confirm(confirmMessage)) {
      toggleAdminMutation.mutate({
        userId: user.id,
        isAdmin: user.role === 'admin',
      });
    }
  };

  // Filter and sort users
  const filteredAndSortedUsers = () => {
    if (!users) return [];

    let result = [...users];

    // Apply role filter
    if (filterRole !== 'all') {
      result = result.filter((user) => user.role === filterRole);
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (a[sortField] < b[sortField]) {
        comparison = -1;
      } else if (a[sortField] > b[sortField]) {
        comparison = 1;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  };

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
        <ErrorMessage message="Failed to load users. Please try again." />
      </div>
    );
  }

  const filteredUsers = filteredAndSortedUsers();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500">Manage system users and their permissions</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => {
              setSelectedUser(null);
              setShowModal(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            className="form-input pl-10 block w-full sm:text-sm border-gray-300 rounded-md"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filterRole === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            onClick={() => handleFilterChange('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filterRole === 'admin'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            onClick={() => handleFilterChange('admin')}
          >
            Admins
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filterRole === 'user'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            onClick={() => handleFilterChange('user')}
          >
            Users
          </button>
        </div>
      </div>

      {/* User List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  <span>Name</span>
                  {sortField === 'name' && (
                    sortDirection === 'asc' ? 
                    <ArrowUp className="ml-1 h-4 w-4" /> : 
                    <ArrowDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center">
                  <span>Email</span>
                  {sortField === 'email' && (
                    sortDirection === 'asc' ? 
                    <ArrowUp className="ml-1 h-4 w-4" /> : 
                    <ArrowDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('role')}
              >
                <div className="flex items-center">
                  <span>Role</span>
                  {sortField === 'role' && (
                    sortDirection === 'asc' ? 
                    <ArrowUp className="ml-1 h-4 w-4" /> : 
                    <ArrowDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center">
                  <span>Joined</span>
                  {sortField === 'createdAt' && (
                    sortDirection === 'asc' ? 
                    <ArrowUp className="ml-1 h-4 w-4" /> : 
                    <ArrowDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt={user.name} className="h-10 w-10 rounded-full" />
                      ) : (
                        <User className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.growerType || 'Not specified'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.profileCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.profileCompleted ? 'Active' : 'Setup Incomplete'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleToggleAdmin(user)}
                    className={`inline-flex items-center px-2 py-1 border border-transparent rounded-md text-xs font-medium ${
                      user.role === 'admin'
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                    } mr-2`}
                  >
                    <Shield className="mr-1 h-3 w-3" />
                    {user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-2"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;