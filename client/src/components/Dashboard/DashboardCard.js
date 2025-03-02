import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const DashboardCard = ({ title, value, icon, to, color = 'bg-white' }) => {
  return (
    <div className={`${color} overflow-hidden shadow rounded-lg`}>
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">{icon}</div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <Link to={to} className="font-medium text-green-600 hover:text-green-500">
            View details
            <ChevronRight className="ml-1 h-4 w-4 inline" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
