import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash,
  AlertCircle
} from 'lucide-react';

import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage';

const QualityForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  // Initial form state
  const [formData, setFormData] = useState({
    trayId: '',
    date: new Date().toISOString().split('T')[0],
    score: 7,
    appearance: 7,
    appearanceNotes: '',
    flavor: 7,
    flavorNotes: '',
    texture: 7,
    textureNotes: '',
    shelfLife: 7,
    shelfLifeNotes: '',
    notes: '',
    assessor: '',
    issues: []
  });

  const [formError, setFormError] = useState(null);
  const [issueForm, setIssueForm] = useState({
    title: '',
    description: '',
    severity: 'medium'
  });

  // Fetch trays for dropdown
  const { data: trays, isLoading: isLoadingTrays } = useQuery('activeTraysList', async () => {
    const response = await axios.get('/api/trays?status=active,harvested');
    return response.data;
  });

  // Fetch quality record if in edit mode
  const { data: record, isLoading: isLoadingRecord, error: fetchError } = useQuery(
    ['qualityRecord', id],
    async () => {
      const response = await axios.get(`/api/quality/${id}`);
      return response.data;
    },
    {
      enabled: isEditMode,
      onSuccess: (data) => {
        setFormData({
          ...data,
          trayId: data.tray?.id || '',
          date: data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        });
      },
    }
  );

  // Create mutation
  const createMutation = useMutation(
    async (newRecord) => {
      const response = await axios.post('/api/quality', newRecord);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('qualityRecords');
        navigate('/quality');
      },
      onError: (error) => {
        setFormError(error.response?.data?.message || 'Failed to create quality record');
      },
    }
  );

  // Update mutation
  const updateMutation = useMutation(
    async (updatedRecord) => {
      const response = await axios.put(`/api/quality/${id}`, updatedRecord);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['qualityRecord', id]);
        queryClient.invalidateQueries('qualityRecords');
        navigate(`/quality/${id}`);
      },
      onError: (error) => {
        setFormError(error.response?.data?.message || 'Failed to update quality record');
      },
    }
  );

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value, 10) : value,
    });
  };

  const handleIssueChange = (e) => {
    const { name, value } = e.target;
    setIssueForm({
      ...issueForm,
      [name]: value,
    });
  };

  const handleAddIssue = (e) => {
    e.preventDefault();
    if (!issueForm.title) return;

    setFormData({
      ...formData,
      issues: [...formData.issues, { ...issueForm }],
    });

    // Reset issue form
    setIssueForm({
      title: '',
      description: '',
      severity: 'medium'
    });
  };

  const handleRemoveIssue = (index) => {
    const updatedIssues = [...formData.issues];
    updatedIssues.splice(index, 1);
    setFormData({
      ...formData,
      issues: updatedIssues,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);

    // Basic validation
    if (!formData.trayId) {
      setFormError('Please select a tray');
      return;
    }

    if (!formData.date) {
      setFormError('Please enter an assessment date');
      return;
    }

    // Calculate overall score from sub-scores
    const calculatedScore = Math.round(
      (formData.appearance + formData.flavor + formData.texture + formData.shelfLife) / 4
    );
    
    const submissionData = {
      ...formData,
      score: calculatedScore
    };

    // Submit form
    if (isEditMode) {
      updateMutation.mutate(submissionData);
    } else {
      createMutation.mutate(submissionData);
    }
  };

  if ((isEditMode && isLoadingRecord) || isLoadingTrays) {
    return <LoadingSpinner />;
  }

  if (isEditMode && fetchError) {
    return <ErrorMessage message="Failed to load quality record data" />;
  }

  const isSubmitting = createMutation.isLoading || updateMutation.isLoading;

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
            {isEditMode ? 'Edit Quality Assessment' : 'New Quality Assessment'}
          </h1>
        </div>
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
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Assessment details and tray information</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="trayId" className="block text-sm font-medium text-gray-700">
                  Tray ID*
                </label>
                <select
                  id="trayId"
                  name="trayId"
                  value={formData.trayId}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                >
                  <option value="">Select a tray</option>
                  {trays?.map((tray) => (
                    <option key={tray.id} value={tray.id}>
                      {tray.batchId} - {tray.variety?.name || 'Unknown variety'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Assessment Date*
                </label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="assessor" className="block text-sm font-medium text-gray-700">
                  Assessed By
                </label>
                <input
                  type="text"
                  name="assessor"
                  id="assessor"
                  value={formData.assessor}
                  onChange={handleChange}
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quality Metrics */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Quality Metrics</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Rate the various quality aspects</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            {/* Appearance */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <label htmlFor="appearance" className="block text-sm font-medium text-gray-700">
                  Appearance (color, size, uniformity)
                </label>
                <span className="text-sm text-gray-500">{formData.appearance}/10</span>
              </div>
              <input
                type="range"
                name="appearance"
                id="appearance"
                min="1"
                max="10"
                value={formData.appearance}
                onChange={handleChange}
                className="mt-1 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <textarea
                name="appearanceNotes"
                id="appearanceNotes"
                rows="2"
                value={formData.appearanceNotes}
                onChange={handleChange}
                placeholder="Notes about appearance..."
                className="mt-2 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>

            {/* Flavor */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <label htmlFor="flavor" className="block text-sm font-medium text-gray-700">
                  Flavor (taste, aroma)
                </label>
                <span className="text-sm text-gray-500">{formData.flavor}/10</span>
              </div>
              <input
                type="range"
                name="flavor"
                id="flavor"
                min="1"
                max="10"
                value={formData.flavor}
                onChange={handleChange}
                className="mt-1 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <textarea
                name="flavorNotes"
                id="flavorNotes"
                rows="2"
                value={formData.flavorNotes}
                onChange={handleChange}
                placeholder="Notes about flavor..."
                className="mt-2 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>

            {/* Texture */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <label htmlFor="texture" className="block text-sm font-medium text-gray-700">
                  Texture (crispness, tenderness)
                </label>
                <span className="text-sm text-gray-500">{formData.texture}/10</span>
              </div>
              <input
                type="range"
                name="texture"
                id="texture"
                min="1"
                max="10"
                value={formData.texture}
                onChange={handleChange}
                className="mt-1 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <textarea
                name="textureNotes"
                id="textureNotes"
                rows="2"
                value={formData.textureNotes}
                onChange={handleChange}
                placeholder="Notes about texture..."
                className="mt-2 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>

            {/* Shelf Life */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="shelfLife" className="block text-sm font-medium text-gray-700">
                  Shelf Life (freshness, durability)
                </label>
                <span className="text-sm text-gray-500">{formData.shelfLife}/10</span>
              </div>
              <input
                type="range"
                name="shelfLife"
                id="shelfLife"
                min="1"
                max="10"
                value={formData.shelfLife}
                onChange={handleChange}
                className="mt-1 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <textarea
                name="shelfLifeNotes"
                id="shelfLifeNotes"
                rows="2"
                value={formData.shelfLifeNotes}
                onChange={handleChange}
                placeholder="Notes about shelf life..."
                className="mt-2 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Quality Issues */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Quality Issues</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Add any quality issues identified</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            {/* Issue List */}
            {formData.issues.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Identified Issues:</h4>
                <ul className="divide-y divide-gray-200 mb-6">
                  {formData.issues.map((issue, index) => (
                    <li key={index} className="py-3 flex justify-between items-center">
                      <div>
                        <h5 className="text-sm font-medium">{issue.title}</h5>
                        <p className="text-sm text-gray-500">{issue.description}</p>
                        <span className={`inline-flex mt-1 px-2 py-0.5 text-xs leading-5 font-semibold rounded-full ${
                          issue.severity === 'high' ? 'bg-red-100 text-red-800' :
                          issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)} Severity
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveIssue(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Add New Issue Form */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Issue:</h4>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label htmlFor="issueTitle" className="block text-sm font-medium text-gray-700">
                    Issue Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="issueTitle"
                    value={issueForm.title}
                    onChange={handleIssueChange}
                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="issueDescription" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="issueDescription"
                    name="description"
                    rows={2}
                    value={issueForm.description}
                    onChange={handleIssueChange}
                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="issueSeverity" className="block text-sm font-medium text-gray-700">
                    Severity
                  </label>
                  <select
                    id="issueSeverity"
                    name="severity"
                    value={issueForm.severity}
                    onChange={handleIssueChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="sm:col-span-3 flex items-end">
                  <button
                    type="button"
                    onClick={handleAddIssue}
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Issue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Additional Notes</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Any other observations or comments</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <textarea
              name="notes"
              id="notes"
              rows={4}
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              placeholder="Enter any additional notes or observations..."
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
            {isSubmitting ? 'Saving...' : 'Save Assessment'}
          </button>
        </div>
      </form>
    </div>
  );