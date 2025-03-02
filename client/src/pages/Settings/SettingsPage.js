import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import axios from 'axios';
import { 
  User, 
  Bell, 
  Settings, 
  Grid, 
  Database,
  Moon,
  Sun,
  LogOut,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

import { useAuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const SettingsPage = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const [confirmingLogout, setConfirmingLogout] = useState(false);

  const [settings, setSettings] = useState({
    theme: 'light',
    autoSave: true,
    emailNotifications: true,
    pushNotifications: true,
    remindersEnabled: true,
    metricUnits: true
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Settings Navigation Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <nav className="space-y-1">
              <Link 
                to="/settings" 
                className="bg-green-50 border-l-4 border-green-600 text-green-700 hover:bg-green-50 hover:text-green-700 group flex items-center px-3 py-3 text-sm font-medium"
              >
                <Settings className="mr-3 flex-shrink-0 h-5 w-5 text-green-500 group-hover:text-green-500" />
                <span className="truncate">General Settings</span>
              </Link>

              <Link 
                to="/settings/account" 
                className="border-l-4 border-transparent text-gray-700 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-3 py-3 text-sm font-medium"
              >
                <User className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                <span className="truncate">Account Settings</span>
              </Link>

              <Link 
                to="/settings/notifications" 
                className="border-l-4 border-transparent text-gray-700 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-3 py-3 text-sm font-medium"
              >
                <Bell className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                <span className="truncate">Notifications</span>
              </Link>

              <Link 
                to="/settings/display" 
                className="border-l-4 border-transparent text-gray-700 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-3 py-3 text-sm font-medium"
              >
                <Grid className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                <span className="truncate">Display</span>
              </Link>

              <Link 
                to="/settings/data" 
                className="border-l-4 border-transparent text-gray-700 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-3 py-3 text-sm font-medium"
              >
                <Database className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                <span className="truncate">Data Management</span>
              </Link>

              <button 
                onClick={() => setConfirmingLogout(true)}
                className="w-full border-l-4 border-transparent text-gray-700 hover:bg-red-50 hover:text-red-700 group flex items-center px-3 py-3 text-sm font-medium"
              >
                <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-red-500" />
                <span className="truncate">Logout</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {confirmingLogout ? (
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Logout</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to log out? You will need to log back in to access your account.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setConfirmingLogout(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* General Settings */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">General Settings</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Customize your experience</p>
                </div>
                <div className="border-t border-gray-200">
                  <dl>
                    {/* Theme Toggle */}
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Theme</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {settings.theme === 'light' ? (
                              <Sun className="h-5 w-5 text-yellow-500 mr-2" />
                            ) : (
                              <Moon className="h-5 w-5 text-indigo-500 mr-2" />
                            )}
                            <span>{settings.theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
                          </div>
                          <button
                            onClick={toggleTheme}
                            className="bg-gray-200 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <span className="sr-only">Toggle theme</span>
                            <span
                              className={`${
                                settings.theme === 'light' ? 'translate-x-0' : 'translate-x-5'
                              } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                            >
                              <span
                                className={`${
                                  settings.theme === 'light' ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100'
                                } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
                              >
                                <Sun className="h-3 w-3 text-yellow-500" />
                              </span>
                              <span
                                className={`${
                                  settings.theme === 'light' ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200'
                                } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
                              >
                                <Moon className="h-3 w-3 text-indigo-500" />
                              </span>
                            </span>
                          </button>
                        </div>
                      </dd>
                    </div>

                    {/* Autosave Toggle */}
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Auto-save</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="flex items-center justify-between">
                          <span>Automatically save changes</span>
                          <button
                            onClick={() => setSettings(prev => ({ ...prev, autoSave: !prev.autoSave }))}
                            className={`${
                              settings.autoSave ? 'bg-green-600' : 'bg-gray-200'
                            } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                          >
                            <span className="sr-only">Toggle auto-save</span>
                            <span
                              className={`${
                                settings.autoSave ? 'translate-x-5' : 'translate-x-0'
                              } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                            ></span>
                          </button>
                        </div>
                      </dd>
                    </div>

                    {/* Measurement Units */}
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Measurement Units</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="flex items-center justify-between">
                          <span>{settings.metricUnits ? 'Metric (g, kg, cm)' : 'Imperial (oz, lb, in)'}</span>
                          <button
                            onClick={() => setSettings(prev => ({ ...prev, metricUnits: !prev.metricUnits }))}
                            className={`${
                              settings.metricUnits ? 'bg-green-600' : 'bg-gray-200'
                            } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                          >
                            <span className="sr-only">Toggle measurement units</span>
                            <span
                              className={`${
                                settings.metricUnits ? 'translate-x-5' : 'translate-x-0'
                              } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                            ></span>
                          </button>
                        </div>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Notification Settings</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">How you'll be notified</p>
                  </div>
                  <Link
                    to="/settings/notifications"
                    className="text-sm font-medium text-green-600 hover:text-green-500 flex items-center"
                  >
                    View All
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
                <div className="border-t border-gray-200">
                  <dl>
                    {/* Email Notifications */}
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Email Notifications</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="flex items-center justify-between">
                          <span>Receive email notifications</span>
                          <button
                            onClick={() => setSettings(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
                            className={`${
                              settings.emailNotifications ? 'bg-green-600' : 'bg-gray-200'
                            } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                          >
                            <span className="sr-only">Toggle email notifications</span>
                            <span
                              className={`${
                                settings.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                              } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                            ></span>
                          </button>
                        </div>
                      </dd>
                    </div>

                    {/* Push Notifications */}
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Push Notifications</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="flex items-center justify-between">
                          <span>Receive browser push notifications</span>
                          <button
                            onClick={() => setSettings(prev => ({ ...prev, pushNotifications: !prev.pushNotifications }))}
                            className={`${
                              settings.pushNotifications ? 'bg-green-600' : 'bg-gray-200'
                            } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                          >
                            <span className="sr-only">Toggle push notifications</span>
                            <span
                              className={`${
                                settings.pushNotifications ? 'translate-x-5' : 'translate-x-0'
                              } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                            ></span>
                          </button>
                        </div>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Data Options */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Data Management</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Export or delete your data</p>
                  </div>
                  <Link
                    to="/settings/data"
                    className="text-sm font-medium text-green-600 hover:text-green-500 flex items-center"
                  >
                    View All
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <div className="space-y-4">
                    <button className="w-full sm:w-auto inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                      Export All Data
                    </button>
                    <p className="text-sm text-gray-500">
                      Download all your data in a CSV or JSON format for backup or transfer purposes.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;