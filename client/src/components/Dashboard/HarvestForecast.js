import React from 'react';
import { Link } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';

const HarvestForecast = ({ harvests }) => {
  if (harvests.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming harvests</h3>
        <p className="mt-1 text-sm text-gray-500">No trays are scheduled for harvest in the next 7 days.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {harvests.map((harvest) => {
          const daysUntil = differenceInDays(new Date(harvest.expectedHarvestDate), new Date());
          let badgeColor = 'bg-green-100 text-green-800';
          
          if (daysUntil === 0) {
            badgeColor = 'bg-red-100 text-red-800';
          } else if (daysUntil === 1) {
            badgeColor = 'bg-yellow-100 text-yellow-800';
          }
          
          return (
            <li key={harvest.id}>
              <Link to={`/trays/${harvest.id}`} className="block hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                          {harvest.variety.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {harvest.variety.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Batch: {harvest.batchId}
                        </div>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeColor}`}>
                        {daysUntil === 0
                          ? 'Today'
                          : daysUntil === 1
                          ? 'Tomorrow'
                          : `In ${daysUntil} days`}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        {format(new Date(harvest.expectedHarvestDate), 'MMM d, yyyy')}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      Est. Yield: {harvest.estimatedYield}g
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default HarvestForecast;
