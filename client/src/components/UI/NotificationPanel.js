import React from 'react';
import { X, Bell, CheckCircle, AlertCircle, Calendar, Package } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const NotificationPanel = ({ notifications, onClose }) => {
  if (!notifications || notifications.length === 0) {
    return (
      <div className="absolute top-16 right-0 w-80 bg-white shadow-lg rounded-lg border border-gray-200 z-10">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-medium">Notifications</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 text-center text-gray-500">
          <Bell className="h-12 w-12 text-gray-300 mx-auto mb-2" />
          <p>No notifications yet</p>
        </div>
      </div>
    );
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'schedule':
        return <Calendar className="h-6 w-6 text-blue-500" />;
      case 'inventory':
        return <Package className="h-6 w-6 text-yellow-500" />;
      default:
        return <Bell className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="absolute top-16 right-0 w-80 bg-white shadow-lg rounded-lg border border-gray-200 z-10">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-medium">Notifications</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border-b hover:bg-gray-50 ${
              !notification.read ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex">
              <div className="flex-shrink-0 mr-3">
                {getNotificationIcon(notification.type)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                <p className="text-sm text-gray-500">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDistanceToNow(new Date(notification.date), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-2 text-center border-t">
        <button className="text-sm text-green-600 font-medium">Mark all as read</button>
      </div>
    </div>
  );
};

export default NotificationPanel;
