import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight } from 'lucide-react';

const InventoryAlerts = ({ alerts }) => {
  if (alerts.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">All inventory levels are good</h3>
        <p className="mt-1 text-sm text-gray-500">No items are below their reorder threshold.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {alerts.map((alert) => (
          <li key={alert.id} className="px-4 py-4 sm:px-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertCircle className={`h-5 w-5 ${alert.level === 'critical' ? 'text-red-500' : 'text-yellow-500'}`} />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{alert.itemName}</h4>
                    <p className="text-sm text-gray-500">
                      {alert.type === 'seed' ? 'Seed Inventory' : 'Supply Inventory'}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      alert.level === 'critical' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {alert.level === 'critical' ? 'Out of Stock' : 'Low Stock'}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Current: {alert.currentQuantity}{alert.unit}</span>
                    <span>Minimum: {alert.minimumQuantity}{alert.unit}</span>
                  </div>
                  <div className="mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${alert.level === 'critical' ? 'bg-red-500' : 'bg-yellow-500'} h-2 rounded-full`} 
                        style={{ width: `${Math.max(5, (alert.currentQuantity / alert.minimumQuantity) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex justify-end">
                  <Link
                    to={`/inventory/${alert.type}/${alert.id}`}
                    className="flex items-center text-sm font-medium text-green-600 hover:text-green-500"
                  >
                    Manage inventory
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InventoryAlerts;
