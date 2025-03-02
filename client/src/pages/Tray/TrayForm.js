import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { format, addDays } from 'date-fns';
import axios from 'axios';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage';

const TrayForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  // Fetch tray data if in edit mode
  const { data: tray, isLoading: isLoadingTray, error: trayError } = useQuery(
    ['tray', id],
    async () => {
      const response = await axios.get(`/api/trays/${id}`);
      return response.data;
    },
    {
      enabled: isEditMode,
      onSuccess: (data) => {
        setFormData({
          ...formData,
          ...data,
          variety: data.variety.id || data.variety._id,
          seedingDate: data.seedingDate ? format(new Date(data.seedingDate), 'yyyy-MM-dd') : '',
          blackoutEndDate: data.blackoutEndDate ? format(new Date(data.blackoutEndDate), 'yyyy-MM-dd') : '',
          expectedHarvestDate: data.expectedHarvestDate ? format(new Date(data.expectedHarvestDate), 'yyyy-MM-dd') : '',
        });
      },
    }
  );

  // Fetch varieties for dropdown
  const { data: varieties, isLoading: isLoadingVarieties, error: varietiesError } = useQuery('varieties', async () => {
    const response = await axios.get('/api/varieties');
    return response.data;
  });

  // Fetch growing areas for dropdown
  const { data: growingAreas, isLoading: isLoadingAreas } = useQuery('growingAreas', async () => {
    const response = await axios.get('/api/growing-areas');
    return response.data;
  }, {
    // Fallback to default areas if API fails
    onError: () => {
      return ['Default Area', 'Shelf A', 'Shelf B', 'Shelf C'];
    }
  });

  // Form state
  const [formData, setFormData] = useState({
    batchId: '',
    variety: '',
    seedAmount: 30,
    traySize: '10x20',
    location: 'Default Location',
    growingArea: 'Default Area',
    status: 'seeding',
    seedingDate: format(new Date(), 'yyyy-MM-dd'),
    blackoutEndDate: '',
    expectedHarvestDate: '',
    notes: '',
  });

  const [formError, setFormError] = useState(null);

  // Create mutation
  const createTrayMutation = useMutation(
    async (newTray) => {
      const response = await axios.post('/api/trays', newTray);
      return response.data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('trays');
        navigate(`/trays/${data.id || data._id}`);
      },
      onError: (error) => {
        setFormError(error.response?.data?.message || 'Failed to create tray');
      },
    }
  );

  // Update mutation
  const updateTrayMutation = useMutation(
    async (updatedTray) => {
      const response = await axios.put(`/api/trays/${id}`, updatedTray);
      return response.data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['tray', id]);
        queryClient.invalidateQueries('trays');
        navigate(`/trays/${id}`);
      },
      onError: (error) => {
        setFormError(error.response?.data?.message || 'Failed to update tray');
      },
    }
  );

  // Handle variety selection change
  const handleVarietyChange = (e) => {
    const selectedVarietyId = e.target.value;
    const selectedVariety = varieties.find(v => v.id === selectedVarietyId || v._id === selectedVarietyId);
    
    if (selectedVariety) {
      const seedingDate = new Date(formData.seedingDate || new Date());
      const blackoutEndDate = addDays(seedingDate, selectedVariety.blackoutDays || 0);
      const harvestDate = addDays(seedingDate, 
        (selectedVariety.germTime || 0) + 
        (selectedVariety.blackoutDays || 0) + 
        (selectedVariety.growingDays || 0)
      );

      setFormData({
        ...formData,
        variety: selectedVarietyId,
        seedAmount: selectedVariety.seedDensity || 30,
        blackoutEndDate: format(blackoutEndDate, 'yyyy-MM-dd'),
        expectedHarvestDate: format(harvestDate, 'yyyy-MM-dd'),
      });
    } else {
      setFormData({
        ...formData,
        variety: selectedVarietyId,
      });
    }
  };

  // Handle date change and update related dates
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'seedingDate' && value && formData.variety && varieties) {
      const selectedVariety = varieties.find(v => v.id === formData.variety || v._id === formData.variety);
      
      if (selectedVariety) {
        const seedingDate = new Date(value);
        const blackoutEndDate = addDays(seedingDate, selectedVariety.blackoutDays || 0);
        const harvestDate = addDays(seedingDate, 
          (selectedVariety.germTime || 0) + 
          (selectedVariety.blackoutDays || 0) + 
          (selectedVariety.growingDays || 0)
        );

        setFormData({
          ...formData,
          [name]: value,
          blackoutEndDate: format(blackoutEndDate, 'yyyy-MM-dd'),
          expectedHarvestDate: format(harvestDate, 'yyyy-MM-dd'),
        });
        return;
      }
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'variety') {
      handleVarietyChange(e);
      return;
    }
    
    if (name === 'seedingDate' || name === 'blackoutEndDate' || name === 'expectedHarvestDate') {
      handleDateChange(e);
      return;
    }

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Generate batch ID if not provided
  useEffect(() => {
    if (!isEditMode && !formData.batchId) {
      const today = new Date();
      const dateStr = format(today, 'yyyyMMdd');
      const randomStr = Math.floor(1000 + Math.random() * 9000);
      setFormData((prev) => ({
        ...prev,
        batchId: `T${dateStr}-${randomStr}`,
      }));
    }
  }, [isEditMode, formData.batchId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);

    // Basic validation
    if (!formData.batchId.trim()) {
      setFormError('Batch ID is required');
      return;
    }

    if (!formData.variety) {
      setFormError('Please select a variety');
      return;
    }

    if (!formData.seedingDate) {
      setFormError('Seeding date is required');
      return;
    }

    if (formData.seedAmount <= 0) {
      setFormError('Seed amount must be greater than zero');
      return;
    }

    // Prepare data for submission
    const submissionData = {
      ...formData,
      seedingDate: new Date(formData.seedingDate),
      blackoutEndDate: formData.blackoutEndDate ? new Date(formData.blackoutEndDate) : undefined,
      expectedHarvestDate: formData.expectedHarvestDate ? new Date(formData.expectedHarvestDate) : undefined,
    };

    // Submit form
    if (isEditMode) {
      updateTrayMutation.mutate(submissionData);
    } else {
      createTrayMutation.mutate(submissionData);
    }
  };

  if (isLoadingTray || isLoadingVarieties) {
    return <LoadingSpinner />;
  }

  if (trayError || varietiesError) {
    return <ErrorMessage message="Failed to load necessary data" />;
  }

  const isSubmitting = createTrayMutation.isLoading || updateTrayMutation.isLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-2 text-gray-400 hover:text-gray-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Edit Tray' : 'Add New Tray'}
        </h1>
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
            <h3 className="text-lg leading-6 font-medium text-gray-900">Tray Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Basic details about this tray.</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="batchId" className="block text-sm font-medium text-gray-700">
                  Batch ID*
                </label>
                <input
                  type="text"
                  name="batchId"
                  id="batchId"
                  value={formData.batchId}
                  onChange={handleChange}
                  required
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="variety" className="block text-sm font-medium text-gray-700">
                  Variety*
                </label>
                <select
                  id="variety"
                  name="variety"
                  value={formData.variety}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                >
                  <option value="">Select a variety</option>
                  {varieties && varieties.map((variety) => (
                    <option key={variety.id || variety._id} value={variety.id || variety._id}>
                      {variety.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="seedAmount" className="block text-sm font-medium text-gray-700">
                  Seed Amount (g)*
                </label>
                <input
                  type="number"
                  name="seedAmount"
                  id="seedAmount"
                  min="0.1"
                  step="0.1"
                  value={formData.seedAmount}
                  onChange={handleChange}
                  required
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="traySize" className="block text-sm font-medium text-gray-700">
                  Tray Size
                </label>
                <select
                  id="traySize"
                  name="traySize"
                  value={formData.traySize}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                >
                  <option value="10x20">10x20 Standard</option>
                  <option value="20x20">20x20 Large</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="growingArea" className="block text-sm font-medium text-gray-700">
                  Growing Area
                </label>
                <select
                  id="growingArea"
                  name="growingArea"
                  value={formData.growingArea}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                >
                  {growingAreas ? (
                    growingAreas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))
                  ) : (
                    <option value="Default Area">Default Area</option>
                  )}
                </select>
              </div>

              {isEditMode && (
                <div className="sm:col-span-3">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  >
                    <option value="seeding">Seeding</option>
                    <option value="blackout">Blackout</option>
                    <option value="growing">Growing</option>
                    <option value="ready">Ready</option>
                    <option value="harvested">Harvested</option>
                    <option value="discarded">Discarded</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Timeline</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Key dates for this tray.</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label htmlFor="seedingDate" className="block text-sm font-medium text-gray-700">
                  Seeding Date*
                </label>
                <input
                  type="date"
                  name="seedingDate"
                  id="seedingDate"
                  value={formData.seedingDate}
                  onChange={handleChange}
                  required
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="blackoutEndDate" className="block text-sm font-medium text-gray-700">
                  Blackout End Date
                </label>
                <input
                  type="date"
                  name="blackoutEndDate"
                  id="blackoutEndDate"
                  value={formData.blackoutEndDate}
                  onChange={handleChange}
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="expectedHarvestDate" className="block text-sm font-medium text-gray-700">
                  Expected Harvest Date
                </label>
                <input
                  type="date"
                  name="expectedHarvestDate"
                  id="expectedHarvestDate"
                  value={formData.expectedHarvestDate}
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
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Additional information or observations.</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <textarea
              name="notes"
              id="notes"
              rows={4}
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              placeholder="Enter any additional notes or observations about this tray..."
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
            {isSubmitting ? 'Saving...' : isEditMode ? 'Update Tray' : 'Save Tray'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrayForm;
