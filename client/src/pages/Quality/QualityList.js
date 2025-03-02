import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { 
  Plus, 
  Filter, 
  Search, 
  CheckCircle, 
  AlertCircle, 
  BarChart2,
  Calendar,
  ChevronRight
} from 'lucide-react';

import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage';

const QualityList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, high, medium, low

  // Fetch quality records
  const { data: qualityRecords, isLoading, error, refetch } = useQuery('qualityRecords', async () => {
    const response = await axios.get('/api/quality');
    return response.data;
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  // Filter quality records
  const filteredRecords = () => {
    if (!qualityRecords) return [];

    let filtered = [...qualityRecords];

    // Apply status filter
    if (filterStatus === 'high') {
      filtered = filtered.filter(record => record.score >= 8);
    } else if (filterStatus === 'medium') {
      filtered = filtered.filter(record => record.score >= 5 && record.score < 8);
    } else if (filterStatus === 'low') {
      filtered = filtered.filter(record => record.score < 5);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        record =>
          record.tray?.batchId.toLowerCase().includes(term) ||
          record.variety?.name.toLowerCase().includes(term) ||
          record.notes?.toLowerCase().includes(term)
      );
    }

    return filtered;
  };

  // Get score badge styling
  const getScoreBadge = (score) => {
    if (score >= 8) {
      return 'bg-green-100 text-green-800';
    } else if (score >= 5) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-red-100 text-red-800';
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load quality records" retry={refetch} />;
  }

  const filtered = filteredRecords();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quality Control</h1>
          <p className="text-gray-500">Monitor and improve the quality of your microgreens</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            to="/quality/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Quality Record
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
            placeholder="Search quality records..."
            className="form-input pl-10 block w-full sm:text-sm border-gray-300 rounded-md"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="flex space-x-2">
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
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filterStatus === 'high'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            onClick={() => handleFilterChange('high')}
          >
            High Quality
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filterStatus === 'medium'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            onClick={() => handleFilterChange('medium')}
          >
            Medium Quality
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filterStatus === 'low'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            onClick={() => handleFilterChange('low')}
          >
            Low Quality
          </button>
        </div>
      </div>

      {/* Quality Records List */}
      {filtered.length === 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-12 text-center">
            <BarChart2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No quality records found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterStatus !== 'all'
                ? 'No records match your search criteria.'
                : 'Start by adding your first quality assessment.'}
            </p>
            <div className="mt-6">
              <Link
                to="/quality/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                New Quality Record
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
                    Date
                  </th>
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
                    Quality Score
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Issues
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
                {filtered.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.tray?.batchId || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.variety?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getScoreBadge(record.score)}`}>
                        {record.score}/10
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.issues?.length || 0} issues
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/quality/${record.id}`}
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

export default QualityList;
