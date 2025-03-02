import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUp, 
  ArrowDown, 
  Trash, 
  Edit, 
  AlertCircle,
  Leaf
} from 'lucide-react';

import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage';

const SeedInventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterStatus, setFilterStatus] = useState('all'); // all, in-stock, low-stock, out-of-stock

  // Fetch seed inventory data
  const { data: seeds, isLoading, error, refetch } = useQuery('seedInventory', async () => {
    const response = await axios.get('/api/inventory/seeds');
    return response.data;
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  // Filter and sort seeds
  const filteredAndSortedSeeds = () => {
    if (!seeds) return [];

    let filtered = [...seeds];

    // Apply status filter
    if (filterStatus === 'in-stock') {
      filtered = filtered.filter(seed => seed.quantity > 0);
    } else if (filterStatus === 'low-stock') {
      filtered = filtered.filter(seed => seed.quantity > 0 && seed.quantity <= seed.reorderThreshold);
    } else if (filterStatus === 'out-of-stock') {
      filtered = filtered.filter(seed => seed.quantity === 0);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        seed => 
          seed.name.toLowerCase().includes(term) ||
          seed.variety?.toLowerCase().includes(term) ||
          seed.supplier?.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      if (a[sortField] < b[sortField]) {
        comparison = -1;
      } else if (a[sortField] > b[sortField]) {
        comparison = 1;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get status badge styling
  const getStatusBadge = (seed) => {
    if (seed.quantity === 0) {
      return 'bg-red-100 text-red-800';
    } else if (seed.quantity <= seed.reorderThreshold) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-green-100 text-green-800';
    }
  };

  // Get status text
  const getStatusText = (seed) => {
    if (seed.quantity === 0) {
      return 'Out of Stock';
    } else if (seed.quantity <= seed.reorderThreshold) {
      return 'Low Stock';
    } else {
      return 'In Stock';
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load seed inventory" retry={refetch} />;
  }

  const filteredSeeds = filteredAndSortedSeeds();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seed Inventory</h1>
          <p className="text-gray-500">Manage your microgreen seed inventory</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            to="/inventory/seeds/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Seeds
          </Link>
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
            placeholder="Search seeds..."
            className="form-input pl-10 block w-full sm:text-sm border-gray-300 rounded-md"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filterStatus === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            onClick={() => handleFilterChange('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filterStatus === 'in-stock'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            onClick={() => handleFilterChange('in-stock')}
          >
            In Stock
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filterStatus === 'low-stock'
                ? 'bg-yellow-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            onClick={() => handleFilterChange('low-stock')}
          >
            Low Stock
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filterStatus === 'out-of-stock'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            onClick={() => handleFilterChange('out-of-stock')}
          >
            Out of Stock
          </button>
        </div>
      </div>

      {/* Seed List */}
      {filteredSeeds.length === 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-12 text-center">
            <Leaf className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No seeds found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? 'No seeds match your search criteria.'
                : 'Get started by adding your first seed to inventory.'}
            </p>
            <div className="mt-6">
              <Link
                to="/inventory/seeds/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                Add Seeds
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
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
                    onClick={() => handleSort('variety')}
                  >
                    <div className="flex items-center">
                      <span>Variety</span>
                      {sortField === 'variety' && (
                        sortDirection === 'asc' ? 
                        <ArrowUp className="ml-1 h-4 w-4" /> : 
                        <ArrowDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('quantity')}
                  >
                    <div className="flex items-center">
                      <span>Quantity</span>
                      {sortField === 'quantity' && (
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
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('expirationDate')}
                  >
                    <div className="flex items-center">
                      <span>Expiration</span>
                      {sortField === 'expirationDate' && (
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
                    Supplier
                  </th>
                  <th
                    scope="col"
                    className="relative px-6 py-3"
                  >
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSeeds.map((seed) => (
                  <tr key={seed.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <Leaf className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{seed.name}</div>
                          <div className="text-xs text-gray-500">SKU: {seed.sku || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {seed.variety || 'Standard'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{seed.quantity} {seed.unit}</div>
                      <div className="text-xs text-gray-500">Min: {seed.reorderThreshold} {seed.unit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(seed)}`}>
                        {getStatusText(seed)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(seed.expirationDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {seed.supplier || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/inventory/seeds/${seed.id}`}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inventory Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Varieties</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{seeds ? seeds.length : 0}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-full p-3">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Low Stock Items</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {seeds ? seeds.filter(seed => seed.quantity > 0 && seed.quantity <= seed.reorderThreshold).length : 0}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 rounded-full p-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Out of Stock</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {seeds ? seeds.filter(seed => seed.quantity === 0).length : 0}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Expiring Soon</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {seeds ? seeds.filter(seed => {
                        if (!seed.expirationDate) return false;
                        const expirationDate = new Date(seed.expirationDate);
                        const today = new Date();
                        const diffTime = expirationDate - today;
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        return diffDays <= 30 && diffDays > 0;
                      }).length : 0}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeedInventory;
