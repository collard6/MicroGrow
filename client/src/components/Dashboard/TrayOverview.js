import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const TrayOverview = ({ trays }) => {
  // Group trays by stage
  const stageGroups = {
    seeding: trays.filter(tray => tray.status === 'seeding'),
    blackout: trays.filter(tray => tray.status === 'blackout'),
    growing: trays.filter(tray => tray.status === 'growing'),
    ready: trays.filter(tray => tray.status === 'ready')
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'seeding':
        return 'bg-blue-100 text-blue-800';
      case 'blackout':
        return 'bg-purple-100 text-purple-800';
      case 'growing':
        return 'bg-green-100 text-green-800';
      case 'ready':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercent = (tray) => {
    const totalDays = tray.totalGrowDays;
    const elapsed = tray.ageInDays;
    const percent = Math.min(Math.round((elapsed / totalDays) * 100), 100);
    return percent;
  };

  if (trays.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No active trays</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating your first tray.</p>
        <div className="mt-6">
          <Link
            to="/trays/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Tray
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tray ID
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Variety
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Seeded
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Progress
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Expected Harvest
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">View</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {trays.map((tray) => (
            <tr key={tray.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {tray.batchId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {tray.variety.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStageColor(tray.status)}`}>
                  {tray.status.charAt(0).toUpperCase() + tray.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(tray.seedingDate), 'MMM d, yyyy')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full" 
                    style={{ width: `${getProgressPercent(tray)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Day {tray.ageInDays} of {tray.totalGrowDays}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {tray.expectedHarvestDate 
                  ? format(new Date(tray.expectedHarvestDate), 'MMM d, yyyy')
                  : 'Not set'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link to={`/trays/${tray.id}`} className="text-green-600 hover:text-green-900">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrayOverview;
