import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { 
  ArrowLeft,
  Edit,
  Trash,
  AlertCircle,
  CheckCircle,
  BarChart2,
  ChevronRight
} from 'lucide-react';

import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage';

const QualityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch quality record
  const { data: record, isLoading, error } = useQuery(['qualityRecord', id], async () => {
    const response = await axios.get(`/api/quality/${id}`);
    return response.data;
  });

  // Delete mutation
  const deleteMutation = useMutation(
    async () => {
      await axios.delete(`/api/quality/${id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('qualityRecords');
        navigate('/quality');
      }
    }
  );

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this quality record? This action cannot be undone.')) {
      deleteMutation.mutate();
    }
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
    return <ErrorMessage message="Failed to load quality record details" />;
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
            <h1 className="text-2xl font-bold text-gray-900">
              Quality Assessment: {record.tray?.batchId || 'N/A'}
            </h1>
            <p className="text-gray-500">
              {new Date(record.date).toLocaleDateString()} - {record.variety?.name || 'Unknown Variety'}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/quality/${id}/edit`}
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

      {/* Quality Score Summary */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Quality Score</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Overall assessment and metrics</p>
        </div>
        <div className="border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 bg-gray-50 border-b">
            <div className="px-6 py-5 text-center border-r">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Overall Score
              </div>
              <div className="mt-1">
                <span className={`px-2 py-1 inline-flex text-xl leading-5 font-semibold rounded-full ${getScoreBadge(record.score)}`}>
                  {record.score}/10
                </span>
              </div>
            </div>
            <div className="px-6 py-5 text-center border-r">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Issues Identified
              </div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">{record.issues?.length || 0}</div>
            </div>
            <div className="px-6 py-5 text-center">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assessed By
              </div>
              <div className="mt-1 text-lg font-semibold text-gray-900">{record.assessor || 'Unknown'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Assessment */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Assessment Details</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Detailed quality metrics</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Appearance</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  <span className={`inline-flex mr-2 px-2 py-1 text-xs leading-5 font-semibold rounded-full ${getScoreBadge(record.appearance || 0)}`}>
                    {record.appearance || 0}/10
                  </span>
                  {record.appearanceNotes}
                </div>
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Flavor</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  <span className={`inline-flex mr-2 px-2 py-1 text-xs leading-5 font-semibold rounded-full ${getScoreBadge(record.flavor || 0)}`}>
                    {record.flavor || 0}/10
                  </span>
                  {record.flavorNotes}
                </div>
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Texture</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  <span className={`inline-flex mr-2 px-2 py-1 text-xs leading-5 font-semibold rounded-full ${getScoreBadge(record.texture || 0)}`}>
                    {record.texture || 0}/10
                  </span>
                  {record.textureNotes}
                </div>
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Shelf Life</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  <span className={`inline-flex mr-2 px-2 py-1 text-xs leading-5 font-semibold rounded-full ${getScoreBadge(record.shelfLife || 0)}`}>
                    {record.shelfLife || 0}/10
                  </span>
                  {record.shelfLifeNotes}
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Issues */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Quality Issues</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Problems identified during assessment</p>
        </div>
        <div className="border-t border-gray-200">
          {record.issues && record.issues.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {record.issues.map((issue, index) => (
                <li key={index} className="px-4 py-4 sm:px-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900">{issue.title}</h4>
                      <p className="mt-1 text-sm text-gray-500">{issue.description}</p>
                      {issue.severity && (
                        <div className="mt-1">
                          <span className="text-xs text-gray-500">Severity: </span>
                          <span className={`inline-flex px-2 py-0.5 text-xs leading-5 font-semibold rounded-full ${
                            issue.severity === 'high' ? 'bg-red-100 text-red-800' :
                            issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-5 sm:px-6 text-center">
              <CheckCircle className="mx-auto h-8 w-8 text-green-500" />
              <p className="mt-2 text-sm text-gray-500">No quality issues identified</p>
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Additional Notes</h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          {record.notes ? (
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{record.notes}</p>
          ) : (
            <p className="text-sm text-gray-500 italic">No additional notes provided</p>
          )}
        </div>
      </div>

      {/* Tray Link */}
      {record.tray && (
        <div className="flex justify-end">
          <Link
            to={`/trays/${record.tray.id}`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            View Tray Details
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default QualityDetails;
