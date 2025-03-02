import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import axios from 'axios';
import { 
  ArrowLeft, 
  Bell, 
  Save, 
  Clock,
  Calendar,
  AlertCircle,
  Check,
  Leaf,
  Mail,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';

import { useAuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const NotificationSettings = () => {
  const { user } = useAuthContext();
  const [formSuccess, setFormSuccess] = useState(null);
  
  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      taskReminders: true,
      harvestAlerts: true,
      inventoryAlerts: true,
      marketplaceMessages: true,
      marketplaceOrders: true,
      systemUpdates: true
    },
    push: {
      taskReminders: true,
      harvestAlerts: true,
      inventoryAlerts: true,
      marketplaceMessages: false,
      marketplaceOrders: true,
      systemUpdates: false
    }
  });

  // Update notification settings mutation
  const mutation = useMutation(
    async (settings) => {
      return await axios.put('/api/users/notification-settings', settings);
    },
    {
      onSuccess: () => {
        setFormSuccess('Notification settings updated successfully');
        setTimeout(() => setFormSuccess(null), 3000);
      }
    }
  );

  const handleToggle = (type, setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [setting]: !prev[type][setting]
      }
    }));
  };

  const handleSaveSettings = () => {
    mutation.mutate(notificationSettings);
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link
            to="/settings"
            className="mr-4 p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
        </div>
        <button
          onClick={handleSaveSettings}
          disabled={mutation.isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {mutation.isLoading ? (
            <>
              <LoadingSpinner size="small" />
              <span className="ml-2">Saving...</span>
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </button>
      </div>

      {formSuccess && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{formSuccess}</p>
            </div>
          </div>
        </div>
      )}

      {/* Email Notifications */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex items-start">
          <Mail className="h-6 w-6 text-gray-400 mr-3" />
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Email Notifications</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Choose which notifications to receive via email</p>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            {/* Task Reminders */}
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                Task Reminders
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <span>Reminders for upcoming tasks and deadlines</span>
                  <button
                    onClick={() => handleToggle('email', 'taskReminders')}
                    className={`${
                      notificationSettings.email.taskReminders ? 'bg-green-600' : 'bg-gray-200'
                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                  >
                    <span className="sr-only">Toggle task reminders</span>
                    <span
                      className={`${
                        notificationSettings.email.taskReminders ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                    ></span>
                  </button>
                </div>
              </dd>
            </div>

            {/* Harvest Alerts */}
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                Harvest Alerts
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <span>Notifications when trays are ready to harvest</span>
                  <button
                    onClick={() => handleToggle('email', 'harvestAlerts')}
                    className={`${
                      notificationSettings.email.harvestAlerts ? 'bg-green-600' : 'bg-gray-200'
                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                  >
                    <span className="sr-only">Toggle harvest alerts</span>
                    <span
                      className={`${
                        notificationSettings.email.harvestAlerts ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                    ></span>
                  </button>
                </div>
              </dd>
            </div>

            {/* Inventory Alerts */}
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <AlertCircle className="h-5 w-5 text-gray-400 mr-2" />
                Inventory Alerts
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <span>Alerts when inventory items are running low</span>
                  <button
                    onClick={() => handleToggle('email', 'inventoryAlerts')}
                    className={`${
                      notificationSettings.email.inventoryAlerts ? 'bg-green-600' : 'bg-gray-200'
                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                  >
                    <span className="sr-only">Toggle inventory alerts</span>
                    <span
                      className={`${
                        notificationSettings.email.inventoryAlerts ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                    ></span>
                  </button>
                </div>
              </dd>
            </div>

            {/* Marketplace Messages */}
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <MessageSquare className="h-5 w-5 text-gray-400 mr-2" />
                Marketplace Messages
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <span>Notifications for new marketplace messages</span>
                  <button
                    onClick={() => handleToggle('email', 'marketplaceMessages')}
                    className={`${
                      notificationSettings.email.marketplaceMessages ? 'bg-green-600' : 'bg-gray-200'
                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                  >
                    <span className="sr-only">Toggle marketplace message notifications</span>
                    <span
                      className={`${
                        notificationSettings.email.marketplaceMessages ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                    ></span>
                  </button>
                </div>
              </dd>
            </div>

            {/* System Updates */}
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Bell className="h-5 w-5 text-gray-400 mr-2" />
                System Updates
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <span>Important system updates and announcements</span>
                  <button
                    onClick={() => handleToggle('email', 'systemUpdates')}
                    className={`${
                      notificationSettings.email.systemUpdates ? 'bg-green-600' : 'bg-gray-200'
                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                  >
                    <span className="sr-only">Toggle system update notifications</span>
                    <span
                      className={`${
                        notificationSettings.email.systemUpdates ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                    ></span>
                  </button>
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Push Notifications */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex items-start">
          <Bell className="h-6 w-6 text-gray-400 mr-3" />
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Push Notifications</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Choose which notifications to receive in your browser</p>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            {/* Task Reminders */}
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                Task Reminders
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <span>Reminders for upcoming tasks and deadlines</span>
                  <button
                    onClick={() => handleToggle('push', 'taskReminders')}
                    className={`${
                      notificationSettings.push.taskReminders ? 'bg-green-600' : 'bg-gray-200'
                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                  >
                    <span className="sr-only">Toggle task reminders</span>
                    <span
                      className={`${
                        notificationSettings.push.taskReminders ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                    ></span>
                  </button>
                </div>
              </dd>
            </div>

            {/* Harvest Alerts */}
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                Harvest Alerts
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <span>Notifications when trays are ready to harvest</span>
                  <button
                    onClick={() => handleToggle('push', 'harvestAlerts')}
                    className={`${
                      notificationSettings.push.harvestAlerts ? 'bg-green-600' : 'bg-gray-200'
                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                  >
                    <span className="sr-only">Toggle harvest alerts</span>
                    <span
                      className={`${
                        notificationSettings.push.harvestAlerts ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                    ></span>
                  </button>
                </div>
              </dd>
            </div>

            {/* Inventory Alerts */}
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <AlertCircle className="h-5 w-5 text-gray-400 mr-2" />
                Inventory Alerts
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <span>Alerts when inventory items are running low</span>
                  <button
                    onClick={() => handleToggle('push', 'inventoryAlerts')}
                    className={`${
                      notificationSettings.push.inventoryAlerts ? 'bg-green-600' : 'bg-gray-200'
                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                  >
                    <span className="sr-only">Toggle inventory alerts</span>
                    <span
                      className={`${
                        notificationSettings.push.inventoryAlerts ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                    ></span>
                  </button>
                </div>
              </dd>
            </div>

            {/* Marketplace Messages */}
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <MessageSquare className="h-5 w-5 text-gray-400 mr-2" />
                Marketplace Messages
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <span>Notifications for new marketplace messages</span>
                  <button
                    onClick={() => handleToggle('push', 'marketplaceMessages')}
                    className={`${
                      notificationSettings.push.marketplaceMessages ? 'bg-green-600' : 'bg-gray-200'
                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                  >
                    <span className="sr-only">Toggle marketplace message notifications</span>
                    <span
                      className={`${
                        notificationSettings.push.marketplaceMessages ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                    ></span>
                  </button>
                </div>
              </dd>
            </div>

            {/* System Updates */}
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Bell className="h-5 w-5 text-gray-400 mr-2" />
                System Updates
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <span>Important system updates and announcements</span>
                  <button
                    onClick={() => handleToggle('push', 'systemUpdates')}
                    className={`${
                      notificationSettings.push.systemUpdates ? 'bg-green-600' : 'bg-gray-200'
                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                  >
                    <span className="sr-only">Toggle system update notifications</span>
                    <span
                      className={`${
                        notificationSettings.push.systemUpdates ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                    ></span>
                  </button>
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Notification Schedule */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Notification Schedule</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Set quiet hours when notifications won't be sent</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <p className="text-sm text-gray-500 mb-4">
            Feature coming soon. You'll be able to set quiet hours when notifications won't be sent.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;