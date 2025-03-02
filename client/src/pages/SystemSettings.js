import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { Save, RefreshCw } from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';

const SystemSettings = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('general');

  // Fetch system settings
  const { data: settings, isLoading, error } = useQuery('systemSettings', async () => {
    const response = await axios.get('/api/admin/settings');
    return response.data;
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation(
    async (updatedSettings) => {
      const response = await axios.put('/api/admin/settings', updatedSettings);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('systemSettings');
        alert('Settings updated successfully');
      },
      onError: (error) => {
        alert(`Error updating settings: ${error.response?.data?.message || error.message}`);
      },
    }
  );

  // Form state
  const [formData, setFormData] = useState({
    siteName: '',
    siteDescription: '',
    maintenanceMode: false,
    userRegistration: true,
    defaultUserRole: 'user',
    sessionTimeout: 30,
    maxUploadSize: 10,
    backupFrequency: 'daily',
    emailNotifications: true,
    marketplaceEnabled: true,
    analyticsEnabled: true,
    loggingLevel: 'info',
    // Theme settings
    primaryColor: '#22c55e',
    secondaryColor: '#3b82f6',
    logoUrl: '',
    faviconUrl: '',
    // Email settings
    smtpHost: '',
    smtpPort: '',
    smtpUsername: '',
    smtpPassword: '',
    smtpFromEmail: '',
    // Security settings
    passwordMinLength: 8,
    passwordRequireSpecial: true,
    passwordRequireNumbers: true,
    maxLoginAttempts: 5,
    twoFactorAuth: false,
  });

  // Update form data when settings are loaded
  React.useEffect(() => {
    if (settings) {
      setFormData((prev) => ({
        ...prev,
        ...settings,
      }));
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettingsMutation.mutate(formData);
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
        <ErrorMessage message="Failed to load system settings. Please try again." />
      </div>
    );
  }

  // Tab navigation
  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'email', label: 'Email' },
    { id: 'security', label: 'Security' },
    { id: 'backup', label: 'Backup & Logs' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-500">Configure global application settings</p>
      </div>

      {/* Settings Form */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 text-sm font-medium text-center border-b-2 ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="py-6 px-4 sm:px-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                    Site Name
                  </label>
                  <input
                    type="text"
                    name="siteName"
                    id="siteName"
                    value={formData.siteName}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">
                    Site Description
                  </label>
                  <textarea
                    id="siteDescription"
                    name="siteDescription"
                    rows={3}
                    value={formData.siteDescription}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    name="sessionTimeout"
                    id="sessionTimeout"
                    min="5"
                    max="240"
                    value={formData.sessionTimeout}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="maxUploadSize" className="block text-sm font-medium text-gray-700">
                    Max Upload Size (MB)
                  </label>
                  <input
                    type="number"
                    name="maxUploadSize"
                    id="maxUploadSize"
                    min="1"
                    max="100"
                    value={formData.maxUploadSize}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="defaultUserRole" className="block text-sm font-medium text-gray-700">
                    Default User Role
                  </label>
                  <select
                    id="defaultUserRole"
                    name="defaultUserRole"
                    value={formData.defaultUserRole}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="sm:col-span-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center h-5">
                      <input
                        id="maintenanceMode"
                        name="maintenanceMode"
                        type="checkbox"
                        checked={formData.maintenanceMode}
                        onChange={handleChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="maintenanceMode" className="font-medium text-gray-700">
                        Maintenance Mode
                      </label>
                      <p className="text-gray-500">Put the application in maintenance mode (only admins can access)</p>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center h-5">
                      <input
                        id="userRegistration"
                        name="userRegistration"
                        type="checkbox"
                        checked={formData.userRegistration}
                        onChange={handleChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="userRegistration" className="font-medium text-gray-700">
                        Allow User Registration
                      </label>
                      <p className="text-gray-500">Enable new users to register accounts</p>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center h-5">
                      <input
                        id="marketplaceEnabled"
                        name="marketplaceEnabled"
                        type="checkbox"
                        checked={formData.marketplaceEnabled}
                        onChange={handleChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="marketplaceEnabled" className="font-medium text-gray-700">
                        Enable Marketplace
                      </label>
                      <p className="text-gray-500">Allow users to buy and sell through the marketplace</p>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center h-5">
                      <input
                        id="analyticsEnabled"
                        name="analyticsEnabled"
                        type="checkbox"
                        checked={formData.analyticsEnabled}
                        onChange={handleChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="analyticsEnabled" className="font-medium text-gray-700">
                        Enable Analytics
                      </label>
                      <p className="text-gray-500">Collect anonymous usage data to improve the application</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
                    Primary Color
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="color"
                      name="primaryColor"
                      id="primaryColor"
                      value={formData.primaryColor}
                      onChange={handleChange}
                      className="h-8 w-8 border border-gray-300 rounded-md mr-2"
                    />
                    <input
                      type="text"
                      name="primaryColor"
                      value={formData.primaryColor}
                      onChange={handleChange}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700">
                    Secondary Color
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="color"
                      name="secondaryColor"
                      id="secondaryColor"
                      value={formData.secondaryColor}
                      onChange={handleChange}
                      className="h-8 w-8 border border-gray-300 rounded-md mr-2"
                    />
                    <input
                      type="text"
                      name="secondaryColor"
                      value={formData.secondaryColor}
                      onChange={handleChange}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">
                    Logo URL
                  </label>
                  <input
                    type="text"
                    name="logoUrl"
                    id="logoUrl"
                    value={formData.logoUrl}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="faviconUrl" className="block text-sm font-medium text-gray-700">
                    Favicon URL
                  </label>
                  <input
                    type="text"
                    name="faviconUrl"
                    id="faviconUrl"
                    value={formData.faviconUrl}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="smtpHost" className="block text-sm font-medium text-gray-700">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    name="smtpHost"
                    id="smtpHost"
                    value={formData.smtpHost}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700">
                    SMTP Port
                  </label>
                  <input
                    type="text"
                    name="smtpPort"
                    id="smtpPort"
                    value={formData.smtpPort}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="smtpUsername" className="block text-sm font-medium text-gray-700">
                    SMTP Username
                  </label>
                  <input
                    type="text"
                    name="smtpUsername"
                    id="smtpUsername"
                    value={formData.smtpUsername}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-700">
                    SMTP Password
                  </label>
                  <input
                    type="password"
                    name="smtpPassword"
                    id="smtpPassword"
                    value={formData.smtpPassword}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="smtpFromEmail" className="block text-sm font-medium text-gray-700">
                    From Email Address
                  </label>
                  <input
                    type="email"
                    name="smtpFromEmail"
                    id="smtpFromEmail"
                    value={formData.smtpFromEmail}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="sm:col-span-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center h-5">
                      <input
                        id="emailNotifications"
                        name="emailNotifications"
                        type="checkbox"
                        checked={formData.emailNotifications}
                        onChange={handleChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="emailNotifications" className="font-medium text-gray-700">
                        Enable Email Notifications
                      </label>
                      <p className="text-gray-500">Send email notifications for system events</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="passwordMinLength" className="block text-sm font-medium text-gray-700">
                    Minimum Password Length
                  </label>
                  <input
                    type="number"
                    name="passwordMinLength"
                    id="passwordMinLength"
                    min="6"
                    max="20"
                    value={formData.passwordMinLength}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="maxLoginAttempts" className="block text-sm font-medium text-gray-700">
                    Max Login Attempts
                  </label>
                  <input
                    type="number"
                    name="maxLoginAttempts"
                    id="maxLoginAttempts"
                    min="3"
                    max="10"
                    value={formData.maxLoginAttempts}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="sm:col-span-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center h-5">
                      <input
                        id="passwordRequireSpecial"
                        name="passwordRequireSpecial"
                        type="checkbox"
                        checked={formData.passwordRequireSpecial}
                        onChange={handleChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="passwordRequireSpecial" className="font-medium text-gray-700">
                        Require Special Characters
                      </label>
                      <p className="text-gray-500">Require at least one special character in passwords</p>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center h-5">
                      <input
                        id="passwordRequireNumbers"
                        name="passwordRequireNumbers"
                        type="checkbox"
                        checked={formData.passwordRequireNumbers}
                        onChange={handleChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="passwordRequireNumbers" className="font-medium text-gray-700">
                        Require Numbers
                      </label>
                      <p className="text-gray-500">Require at least one number in passwords</p>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center h-5">
                      <input
                        id="twoFactorAuth"
                        name="twoFactorAuth"
                        type="checkbox"
                        checked={formData.twoFactorAuth}
                        onChange={handleChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="twoFactorAuth" className="font-medium text-gray-700">
                        Enable Two-Factor Authentication
                      </label>
                      <p className="text-gray-500">Require two-factor authentication for all users</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Backup & Logs Settings */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="backupFrequency" className="block text-sm font-medium text-gray-700">
                    Backup Frequency
                  </label>
                  <select
                    id="backupFrequency"
                    name="backupFrequency"
                    value={formData.backupFrequency}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="loggingLevel" className="block text-sm font-medium text-gray-700">
                    Logging Level
                  </label>
                  <select
                    id="loggingLevel"
                    name="loggingLevel"
                    value={formData.loggingLevel}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="error">Error Only</option>
                    <option value="warn">Warning</option>
                    <option value="info">Info</option>
                    <option value="debug">Debug</option>
                  </select>
                </div>

                <div className="sm:col-span-6">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-700">Backup Actions</h3>
                  </div>
                  <div className="space-x-4">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Create Backup Now
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Download Latest Backup
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-700">Log Actions</h3>
                  </div>
                  <div className="space-x-4">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      View Logs
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Clear Logs
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-6 flex justify-end space-x-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={updateSettingsMutation.isLoading}
            >
              <Save className="mr-2 h-4 w-4" />
              {updateSettingsMutation.isLoading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SystemSettings;
