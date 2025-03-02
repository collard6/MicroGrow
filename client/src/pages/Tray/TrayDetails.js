import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { 
  Edit, 
  ArrowLeft, 
  Trash, 
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
  MapPin,
  Thermometer,
  Droplet,
  Camera,
  Plus
} from 'lucide-react';

import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage';

const TrayDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch tray data
  const { data: tray, isLoading, error } = useQuery(['tray', id], async () => {
    const response = await axios.get(`/api/trays/${id}`);
    return response.data;
  });

  // Delete tray mutation
  const deleteTrayMutation = useMutation(
    async () => {
      await axios.delete(`/api/trays/${id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('trays');
        navigate('/trays');
      },
    }
  );

  // Handle status change mutation
  const updateStatusMutation = useMutation(
    async (newStatus) => {
      await axios.patch(`/api/trays/${id}/status`, { status: newStatus });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tray', id]);
      },
    }
  );

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this tray? This action cannot be undone.')) {
      deleteTrayMutation.mutate();
    }
  };

  const handleStatusChange = (newStatus) => {
    updateStatusMutation.mutate(newStatus);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load tray details" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 mr-3">Tray {tray.batchId}</h1>
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(tray.status)}`}>
                {tray.status.charAt(0).toUpperCase() + tray.status.slice(1)}
              </span>
            </div>
            <p className="text-gray-500">{tray.variety.name}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/trays/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Tray Timeline */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Tray Timeline</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Current status and upcoming events</p>
        </div>
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex space-x-4">
                <div className={`h-16 w-16 rounded-full flex items-center justify-center ${
                  tray.status === 'seeding' ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-600' : 
                  tray.status === 'blackout' || tray.status === 'growing' || tray.status === 'ready' || tray.status === 'harvested' ? 
                  'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-400'
                }`}>
                  <span className="text-sm font-medium">Seeding</span>
                </div>
                <div className={`h-16 w-16 rounded-full flex items-center justify-center ${
                  tray.status === 'blackout' ? 'bg-purple-100 text-purple-800 ring-2 ring-purple-600' : 
                  tray.status === 'growing' || tray.status === 'ready' || tray.status === 'harvested' ? 
                  'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-400'
                }`}>
                  <span className="text-sm font-medium">Blackout</span>
                </div>
                <div className={`h-16 w-16 rounded-full flex items-center justify-center ${
                  tray.status === 'growing' ? 'bg-green-100 text-green-800 ring-2 ring-green-600' : 
                  tray.status === 'ready' || tray.status === 'harvested' ? 
                  'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'
                }`}>
                  <span className="text-sm font-medium">Growing</span>
                </div>
                <div className={`h-16 w-16 rounded-full flex items-center justify-center ${
                  tray.status === 'ready' ? 'bg-yellow-100 text-yellow-800 ring-2 ring-yellow-600' : 
                  tray.status === 'harvested' ? 
                  'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-400'
                }`}>
                  <span className="text-sm font-medium">Ready</span>
                </div>
                <div className={`h-16 w-16 rounded-full flex items-center justify-center ${
                  tray.status === 'harvested' ? 'bg-gray-100 text-gray-800 ring-2 ring-gray-600' : 
                  'bg-gray-100 text-gray-400'
                }`}>
                  <span className="text-sm font-medium">Harvested</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Update Status:</p>
                <div className="mt-2 flex space-x-2">
                  {tray.status !== 'harvested' && (
                    <button
                      onClick={() => handleStatusChange('harvested')}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Mark as Harvested
                    </button>
                  )}
                  {tray.status !== 'discarded' && (
                    <button
                      onClick={() => handleStatusChange('discarded')}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Mark as Discarded
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Seeding Date</span>
                </div>
                <div className="text-lg font-semibold">{formatDate(tray.seedingDate)}</div>
              </div>
              <div className="flex flex-col border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Blackout End</span>
                </div>
                <div className="text-lg font-semibold">{formatDate(tray.blackoutEndDate)}</div>
              </div>
              <div className="flex flex-col border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Expected Harvest</span>
                </div>
                <div className="text-lg font-semibold">{formatDate(tray.expectedHarvestDate)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tray Details */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Tray Details</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Specifications and growing conditions</p>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Tray Size</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{tray.traySize || '10x20 Standard'}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Seed Amount</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{tray.seedAmount}g</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Growing Area</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{tray.growingArea || 'Default Area'}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Location</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{tray.location || 'Default Location'}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Seed Batch</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{tray.seedBatchId || 'Not specified'}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Age</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{tray.ageInDays} days</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Issues */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Issues</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Recorded problems and resolutions</p>
          </div>
          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            <Plus className="mr-1 h-4 w-4" />
            Add Issue
          </button>
        </div>
        <div className="border-t border-gray-200">
          {tray.issues && tray.issues.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {tray.issues.map((issue, index) => (
                <li key={index} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                        issue.severity >= 4 ? 'bg-red-100 text-red-700' : 
                        issue.severity >= 2 ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-blue-100 text-blue-700'
                      }`}>
                        <AlertCircle className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{issue.type.charAt(0).toUpperCase() + issue.type.slice(1)} Issue</p>
                        <p className="text-sm text-gray-500">{formatDate(issue.reportDate)}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        issue.resolved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {issue.resolved ? 'Resolved' : 'Open'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">{issue.description}</p>
                    {issue.resolved && issue.resolutionNotes && (
                      <div className="mt-2 pl-4 border-l-2 border-green-200">
                        <p className="text-xs text-gray-500">Resolution ({formatDate(issue.resolutionDate)}):</p>
                        <p className="text-sm text-gray-600">{issue.resolutionNotes}</p>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-12 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">No issues reported for this tray.</p>
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Notes</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Additional observations and comments</p>
          </div>
          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            <Edit className="mr-1 h-4 w-4" />
            Edit Notes
          </button>
        </div>
        <div className="border-t border-gray-200 p-4">
          {tray.notes ? (
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{tray.notes}</p>
          ) : (
            <p className="text-sm text-gray-500 italic">No notes added yet.</p>
          )}
        </div>
      </div>
      
      {/* Growth Photos */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Growth Documentation</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Photos of the growing progress</p>
          </div>
          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            <Camera className="mr-1 h-4 w-4" />
            Add Photo
          </button>
        </div>
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 text-center">
            <Camera className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">No photos uploaded yet.</p>
            <p className="text-sm text-gray-500">Document your tray's growth to track progress.</p>
          </div>
        </div>
      </div>
      
      {/* Harvest Data */}
      {tray.status === 'harvested' && tray.actualHarvestDate && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Harvest Data</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Yield and quality metrics</p>
          </div>
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col border rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Harvest Date</span>
                  </div>
                  <div className="text-lg font-semibold">{formatDate(tray.actualHarvestDate)}</div>
                </div>
                <div className="flex flex-col border rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Final Yield</span>
                  </div>
                  <div className="text-lg font-semibold">{tray.yieldWeight || 'Not recorded'} g</div>
                </div>
                <div className="flex flex-col border rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Quality Rating</span>
                  </div>
                  <div className="text-lg font-semibold">{tray.yieldQuality ? `${tray.yieldQuality}/10` : 'Not rated'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrayDetails;
