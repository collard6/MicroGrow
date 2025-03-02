import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Edit, ArrowLeft, Trash, Leaf, Plus } from 'lucide-react';

import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage';

const VarietyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch variety data
  const { data: variety, isLoading, error } = useQuery(['variety', id], async () => {
    const response = await axios.get(`/api/varieties/${id}`);
    return response.data;
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load variety details" />;
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
            <h1 className="text-2xl font-bold text-gray-900">{variety.name}</h1>
            {variety.scientificName && (
              <p className="text-gray-500 italic">{variety.scientificName}</p>
            )}
          </div>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/varieties/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Variety Details */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Variety Details</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Growing specifications and information.</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Variety Name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{variety.name}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Scientific Name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {variety.scientificName || "Not specified"}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {variety.description || "No description available"}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Growing Specifications */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Growing Specifications</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Details for optimal growing conditions.</p>
        </div>
        <div className="border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 bg-gray-50 border-b">
            <div className="px-6 py-5 text-center border-r">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Germination Time
              </div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">{variety.germTime} days</div>
            </div>
            <div className="px-6 py-5 text-center border-r">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Blackout Period
              </div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">{variety.blackoutDays} days</div>
            </div>
            <div className="px-6 py-5 text-center">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Growing Period
              </div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">{variety.growingDays} days</div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3">
            <div className="px-6 py-5 text-center border-r">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Seed Density
              </div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">{variety.seedDensity} g/tray</div>
            </div>
            <div className="px-6 py-5 text-center border-r">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Soaking Time
              </div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">{variety.soakHours || 0} hours</div>
            </div>
            <div className="px-6 py-5 text-center">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Growth Cycle
              </div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">
                {(variety.germTime + variety.blackoutDays + variety.growingDays)} days
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Environment Requirements */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Environment Requirements</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Optimal growing conditions for this variety.</p>
        </div>
        <div className="border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3">
            <div className="px-6 py-5 text-center border-r">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Temperature
              </div>
              <div className="mt-1 text-xl font-semibold text-gray-900">
                {variety.tempMin}°C - {variety.tempMax}°C
              </div>
              <div className="mt-1 text-sm text-gray-500">
                Optimal: {variety.tempOptimal}°C
              </div>
            </div>
            <div className="px-6 py-5 text-center border-r">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Humidity
              </div>
              <div className="mt-1 text-xl font-semibold text-gray-900">
                {variety.humidityMin}% - {variety.humidityMax}%
              </div>
              <div className="mt-1 text-sm text-gray-500">
                Optimal: {variety.humidityOptimal}%
              </div>
            </div>
            <div className="px-6 py-5 text-center">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Light Requirements
              </div>
              <div className="mt-1 text-xl font-semibold text-gray-900">
                Medium
              </div>
              <div className="mt-1 text-sm text-gray-500">
                After blackout period
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Production Metrics */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Production Metrics</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Yield and financial information.</p>
        </div>
        <div className="border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3">
            <div className="px-6 py-5 text-center border-r">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expected Yield
              </div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">
                {variety.expectedYieldPerTray || 'Not set'} g/tray
              </div>
            </div>
            <div className="px-6 py-5 text-center border-r">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Seed Cost
              </div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">
                ${variety.costPerKg ? (variety.costPerKg / 1000 * variety.seedDensity).toFixed(2) : 'Not set'}/tray
              </div>
            </div>
            <div className="px-6 py-5 text-center">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Market Price
              </div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">
                ${variety.pricePerGram ? (variety.pricePerGram * (variety.expectedYieldPerTray || 0)).toFixed(2) : 'Not set'}/tray
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {variety.notes && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Notes</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Additional information about this variety.</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{variety.notes}</p>
          </div>
        </div>
      )}

      {/* Recent Trays */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Trays</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Current and past trays of this variety.</p>
          </div>
          <Link
            to="/trays/new"
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Plus className="mr-1 h-4 w-4" />
            New Tray
          </Link>
        </div>
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
            <Leaf className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2">No recent trays found for this variety.</p>
            <p className="text-sm">Plant some to track your growing progress.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VarietyDetails;
