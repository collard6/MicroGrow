import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { ArrowLeft, Save, Trash, AlertCircle } from 'lucide-react';

import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage';

const VarietyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  // Initial form state
  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    description: '',
    germTime: 1,
    blackoutDays: 3,
    growingDays: 7,
    seedDensity: 30,
    soakHours: 0,
    tempMin: 15,
    tempOptimal: 20,
    tempMax: 25,
    humidityMin: 40,
    humidityOptimal: 60,
    humidityMax: 80,
    expectedYieldPerTray: 0,
    costPerKg: 0,
    pricePerGram: 0,
    otherCostsPerTray: 0,
    notes: '',
    isActive: true,
  });

  const [formError, setFormError] = useState(null);

  // Fetch variety data if in edit mode
  const { data: variety, isLoading: isLoadingVariety, error: fetchError } = useQuery(
    ['variety', id],
    async () => {
      const response = await axios.get(`/api/varieties/${id}`);
      return response.data;
    },
    {
      enabled: isEditMode,
      onSuccess: (data) => {
        setFormData(data);
      },
    }
  );

  // Create mutation
  const createMutation = useMutation(
    async (newVariety) => {
      const response = await axios.post('/api/varieties', newVariety);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('varieties');
        navigate('/varieties');
      },
      onError: (error) => {
        setFormError(error.response?.data?.message || 'Failed to create variety');
      },
    }
  );

  // Update mutation
  const updateMutation = useMutation(
    async (updatedVariety) => {
      const response = await axios.put(`/api/varieties/${id}`, updatedVariety);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['variety', id]);
        queryClient.invalidateQueries('varieties');
        navigate(`/varieties/${id}`);
      },
      onError: (error) => {
        setFormError(error.response?.data?.message || 'Failed to update variety');
      },
    }
  );

  // Delete mutation
  const deleteMutation = useMutation(
    async () => {
      await axios.delete(`/api/varieties/${id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('varieties');
        navigate('/varieties');
      },
      onError: (error) => {
        setFormError(error.response?.data?.message || 'Failed to delete variety');
      },
    }
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);

    // Basic validation
    if (!formData.name.trim()) {
      setFormError('Variety name is required');
      return;
    }

    if (formData.germTime < 0 || formData.blackoutDays < 0 || formData.growingDays < 0) {
      setFormError('Time periods cannot be negative');
      return;
    }

    if (formData.seedDensity <= 0) {
      setFormError('Seed density must be greater than zero');
      return;
    }

    // Submit form
    if (isEditMode) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this variety? This action cannot be undone.')) {
      deleteMutation.mutate();
    }
  };

  if (isEditMode && isLoadingVariety) {
    return <LoadingSpinner />;
  }

  if (isEditMode && fetchError) {
    return <ErrorMessage message="Failed to load variety data" />;
  }

  const isSubmitting = createMutation.isLoading || updateMutation.isLoading;
  const isDeleting = deleteMutation.isLoading;

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
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? `Edit ${variety.name}` : 'Add New Variety'}
          </h1>
        </div>
        {isEditMode && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
              isDeleting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <Trash className="mr-2 h-4 w-4" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>

      {formError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{formError}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Basic Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">General details about this microgreen variety.</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Variety Name*
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="scientificName" className="block text-sm font-medium text-gray-700">
                  Scientific Name
                </label>
                <input
                  type="text"
                  name="scientificName"
                  id="scientificName"
                  value={formData.scientificName}
                  onChange={handleChange}
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="sm:col-span-6">
                <div className="flex items-center">
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Active (available for planting)
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Growing Specifications */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Growing Specifications</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Timeline and requirements for growing.</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label htmlFor="germTime" className="block text-sm font-medium text-gray-700">
                  Germination Time (days)*
                </label>
                <input
                  type="number"
                  name="germTime"
                  id="germTime"
                  min="0"
                  value={formData.germTime}
                  onChange={handleChange}
                  required
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="blackoutDays" className="block text-sm font-medium text-gray-700">
                  Blackout Period (days)*
                </label>
                <input
                  type="number"
                  name="blackoutDays"
                  id="blackoutDays"
                  min="0"
                  value={formData.blackoutDays}
                  onChange={handleChange}
                  required
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="growingDays" className="block text-sm font-medium text-gray-700">
                  Growing Period (days)*
                </label>
                <input
                  type="number"
                  name="growingDays"
                  id="growingDays"
                  min="0"
                  value={formData.growingDays}
                  onChange={handleChange}
                  required
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="seedDensity" className="block text-sm font-medium text-gray-700">
                  Seed Density (g/tray)*
                </label>
                <input
                  type="number"
                  name="seedDensity"
                  id="seedDensity"
                  min="0.1"
                  step="0.1"
                  value={formData.seedDensity}
                  onChange={handleChange}
                  required
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="soakHours" className="block text-sm font-medium text-gray-700">
                  Soaking Time (hours)
                </label>
                <input
                  type="number"
                  name="soakHours"
                  id="soakHours"
                  min="0"
                  step="0.5"
                  value={formData.soakHours}
                  onChange={handleChange}
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Environment Requirements */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Environment Requirements</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Optimal growing conditions.</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {/* Temperature Range */}
              <div className="sm:col-span-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Temperature Range (°C)</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="tempMin" className="block text-xs text-gray-500">
                      Minimum
                    </label>
                    <input
                      type="number"
                      name="tempMin"
                      id="tempMin"
                      value={formData.tempMin}
                      onChange={handleChange}
                      className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="tempOptimal" className="block text-xs text-gray-500">
                      Optimal
                    </label>
                    <input
                      type="number"
                      name="tempOptimal"
                      id="tempOptimal"
                      value={formData.tempOptimal}
                      onChange={handleChange}
                      className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="tempMax" className="block text-xs text-gray-500">
                      Maximum
                    </label>
                    <input
                      type="number"
                      name="tempMax"
                      id="tempMax"
                      value={formData.tempMax}
                      onChange={handleChange}
                      className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* Humidity Range */}
              <div className="sm:col-span-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Humidity Range (%)</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="humidityMin" className="block text-xs text-gray-500">
                      Minimum
                    </label>
                    <input
                      type="number"
                      name="humidityMin"
                      id="humidityMin"
                      value={formData.humidityMin}
                      onChange={handleChange}
                      className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="humidityOptimal" className="block text-xs text-gray-500">
                      Optimal
                    </label>
                    <input
                      type="number"
                      name="humidityOptimal"
                      id="humidityOptimal"
                      value={formData.humidityOptimal}
                      onChange={handleChange}
                      className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="humidityMax" className="block text-xs text-gray-500">
                      Maximum
                    </label>
                    <input
                      type="number"
                      name="humidityMax"
                      id="humidityMax"
                      value={formData.humidityMax}
                      onChange={handleChange}
                      className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial and Production Information */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Financial Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Cost and yield metrics.</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="costPerKg" className="block text-sm font-medium text-gray-700">
                  Seed Cost ($/kg)
                </label>
                <input
                  type="number"
                  name="costPerKg"
                  id="costPerKg"
                  min="0"
                  step="0.01"
                  value={formData.costPerKg}
                  onChange={handleChange}
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="pricePerGram" className="block text-sm font-medium text-gray-700">
                  Market Price ($/g)
                </label>
                <input
                  type="number"
                  name="pricePerGram"
                  id="pricePerGram"
                  min="0"
                  step="0.01"
                  value={formData.pricePerGram}
                  onChange={handleChange}
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="expectedYieldPerTray" className="block text-sm font-medium text-gray-700">
                  Expected Yield (g/tray)
                </label>
                <input
                  type="number"
                  name="expectedYieldPerTray"
                  id="expectedYieldPerTray"
                  min="0"
                  step="0.1"
                  value={formData.expectedYieldPerTray}
                  onChange={handleChange}
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="otherCostsPerTray" className="block text-sm font-medium text-gray-700">
                  Other Costs ($/tray)
                </label>
                <input
                  type="number"
                  name="otherCostsPerTray"
                  id="otherCostsPerTray"
                  min="0"
                  step="0.01"
                  value={formData.otherCostsPerTray}
                  onChange={handleChange}
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Notes</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Additional information or growing tips.</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <textarea
              name="notes"
              id="notes"
              rows={4}
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              placeholder="Enter any additional notes, observations, or growing tips for this variety..."
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Saving...' : 'Save Variety'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VarietyForm;
