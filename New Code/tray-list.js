import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { 
  Plus, 
  Filter, 
  Search, 
  Layers, 
  ChevronRight, 
  Calendar, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage';

const TrayList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('active'); // active, completed, all

  // Fetch trays data
  const { data: trays, isLoading, error, refetch } = useQuery('trays', async () => {
    const response = await axios.get('/api/trays');
    return response.data;
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  // Filter trays based on search term and status
  const filteredTrays = () => {
    if (!trays) return [];

    let filtered = [...trays];

    // Apply status filter
    if (filterStatus === 'active') {
      filtered = filtered.filter(tray => ['seeding', 'blackout', 'growing', 'ready'].includes(tray.status));
    } else if (filterStatus === 'completed') {
      filtered = filtered.filter(tray => ['harvested', 'discarded'].includes(tray.status));
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        tray =>
          tray.batchId.toLowerCase().includes(term) ||
          tray.variety?.name.toLowerCase().includes(term) ||
          tray.location?.toLowerCase().includes(term)
      );
    }

    return filtered;
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'seeding':
        return 'bg-blue-100 text-blue-800';
      case 'blackout':
        return 'bg-purple-100 text-purple-800';
      case 'growing':
        return 'bg-green-100 text-green-800';
      case 'ready':
        return 'bg-yellow-100 text-yellow-800';
      case 'harvested':
        return 'bg-gray-100 text-gray-800';
      case 'discarded':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load trays" retry={refetch} />;
  }

  const filtered = filteredTrays();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tray Management</h1>
          <p className="text-gray-500">Track and manage your microgreen trays from seeding to harvest</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            to="/trays/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Tray
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
            placeholder="Search trays..."
            className="form-input pl-10 block w-full sm:text-sm border-gray-300 rounded-md"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filterStatus === 'active'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            onClick={() => handleFilterChange('active')}
          >
            Active
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filterStatus === 'completed'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            onClick={() => handleFilterChange('completed')}
          >
            Completed
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filterStatus === 'all'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            onClick={() => handleFilterChange('all')}
          >
            All
          </button>
        </div>
      </div>

      {/* Tray List */}
      {filtered.length === 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-12 text-center">
            <Layers className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No trays found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? 'No trays match your search criteria.'
                : filterStatus === 'active'
                ? 'No active trays found. Start growing some microgreens!'
                : filterStatus === 'completed'
                ? 'No completed trays found.'
                : 'No trays found. Start by adding your first tray.'}
            </p>
            <div className="mt-6">
              <Link
                to="/trays/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                Add Tray
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
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tray ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Variety
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Seeded
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Expected Harvest
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Location
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
                {filtered.map((tray) => (
                  <tr key={tray.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {tray.batchId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-green-700 font-medium">{tray.variety?.name.charAt(0) || '?'}</span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{tray.variety?.name || 'Unknown'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(tray.status)}`}>
                        {tray.status.charAt(0).toUpperCase() + tray.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(tray.seedingDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(tray.expectedHarvestDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tray.location || 'Default'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/trays/${tray.id}`}
                        className="text-green-600 hover:text-green-900 flex items-center justify-end"
                      >
                        View
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrayList;
