import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { 
  ArrowLeft, 
  Filter, 
  Download, 
  TrendingUp, 
  Calendar, 
  ArrowUp, 
  ArrowDown,
  BarChart2
} from 'lucide-react';

import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage';

const YieldAnalytics = () => {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState('month'); // week, month, year, all
  const [filterVariety, setFilterVariety] = useState('all');

  // Fetch yield analytics data
  const { data, isLoading, error, refetch } = useQuery(
    ['yieldAnalytics', timeframe, filterVariety], 
    async () => {
      const response = await axios.get(`/api/analytics/yield?timeframe=${timeframe}&variety=${filterVariety}`);
      return response.data;
    }
  );

  // Fetch varieties for filter dropdown
  const { data: varieties } = useQuery('varietiesList', async () => {
    const response = await axios.get('/api/varieties?fields=id,name');
    return response.data;
  });

  const handleFilterChange = (e) => {
    setFilterVariety(e.target.value);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load yield analytics data" retry={refetch} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Yield Analytics</h1>
            <p className="text-gray-500">Detailed analysis of your microgreen yields</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <div className="inline-flex shadow-sm">
            <button
              onClick={() => setTimeframe('week')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                timeframe === 'week'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeframe('month')}
              className={`px-4 py-2 text-sm font-medium ${
                timeframe === 'month'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-gray-300`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeframe('year')}
              className={`px-4 py-2 text-sm font-medium ${
                timeframe === 'year'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-gray-300`}
            >
              Year
            </button>
            <button
              onClick={() => setTimeframe('all')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                timeframe === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300`}
            >
              All Time
            </button>
          </div>
          <button
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
          </div>
          <div className="mt-2 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div>
              <label htmlFor="varietyFilter" className="sr-only">Filter by Variety</label>
              <select
                id="varietyFilter"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                value={filterVariety}
                onChange={handleFilterChange}
              >
                <option value="all">All Varieties</option>
                {varieties?.map((variety) => (
                  <option key={variety.id} value={variety.id}>
                    {variety.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Yield */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Yield
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {data?.totalYield || 0} g
                    </div>
                    {data?.yieldChange && (
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        data.yieldChange > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {data.yieldChange > 0 ? (
                          <ArrowUp className="self-center flex-shrink-0 h-5 w-5" />
                        ) : (
                          <ArrowDown className="self-center flex-shrink-0 h-5 w-5" />
                        )}
                        <span className="sr-only">
                          {data.yieldChange > 0 ? 'Increased' : 'Decreased'} by
                        </span>
                        {Math.abs(data.yieldChange)}%
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Average Yield Per Tray */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart2 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Avg. Yield per Tray
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {data?.avgYieldPerTray || 0} g
                    </div>
                    {data?.avgYieldChange && (
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        data.avgYieldChange > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {data.avgYieldChange > 0 ? (
                          <ArrowUp className="self-center flex-shrink-0 h-5 w-5" />
                        ) : (
                          <ArrowDown className="self-center flex-shrink-0 h-5 w-5" />
                        )}
                        <span className="sr-only">
                          {data.avgYieldChange > 0 ? 'Increased' : 'Decreased'} by
                        </span>
                        {Math.abs(data.avgYieldChange)}%
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Number of Harvests */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Harvests
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {data?.harvestCount || 0}
                    </div>
                    {data?.harvestChange && (
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        data.harvestChange > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {data.harvestChange > 0 ? (
                          <ArrowUp className="self-center flex-shrink-0 h-5 w-5" />
                        ) : (
                          <ArrowDown className="self-center flex-shrink-0 h-5 w-5" />
                        )}
                        <span className="sr-only">
                          {data.harvestChange > 0 ? 'Increased' : 'Decreased'} by
                        </span>
                        {Math.abs(data.harvestChange)}%
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Yield Efficiency */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Yield vs. Expected
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {data?.yieldEfficiency || 0}%
                    </div>
                    {data?.efficiencyChange && (
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        data.efficiencyChange > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {data.efficiencyChange > 0 ? (
                          <ArrowUp className="self-center flex-shrink-0 h-5 w-5" />
                        ) : (
                          <ArrowDown className="self-center flex-shrink-0 h-5 w-5" />
                        )}
                        <span className="sr-only">
                          {data.efficiencyChange > 0 ? 'Increased' : 'Decreased'} by
                        </span>
                        {Math.abs(data.efficiencyChange)}%
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Yield Over Time</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Trend analysis of microgreen yield</p>
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-xs rounded-md bg-green-100 text-green-800">
              Weekly
            </button>
            <button className="px-3 py-1 text-xs rounded-md bg-gray-100 text-gray-800">
              Monthly
            </button>
            <button className="px-3 py-1 text-xs rounded-md bg-gray-100 text-gray-800">
              By Variety
            </button>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="h-72 flex items-center justify-center bg-gray-100 rounded-lg">
            <BarChart2 className="h-12 w-12 text-gray-400" />
            <span className="ml-2 text-gray-500">Yield trend chart will be displayed here</span>
          </div>
        </div>
      </div>

      {/* Yield By Variety */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Yield by Variety</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Compare performance across different microgreens</p>
        </div>
        <div className="border-t border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Variety
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Yield
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Harvests
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg. Yield/Tray
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Efficiency
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.varietyData?.map((variety) => (
                  <tr key={variety.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {variety.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {variety.totalYield} g
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {variety.harvestCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {variety.avgYieldPerTray} g
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        variety.efficiency >= 100 ? 'bg-green-100 text-green-800' :
                        variety.efficiency >= 85 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {variety.efficiency}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {variety.trend === 'up' ? (
                        <ArrowUp className="h-5 w-5 text-green-500" />
                      ) : variety.trend === 'down' ? (
                        <ArrowDown className="h-5 w-5 text-red-500" />
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Factors Affecting Yield */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Factors Affecting Yield</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Analysis of environmental and growing conditions</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3">
            {/* Temperature Impact */}
            <div>
              <h4 className="text-sm font-medium text-gray-900">Temperature</h4>
              <div className="mt-2 h-36 flex items-center justify-center bg-gray-100 rounded-lg">
                <span className="text-gray-500">Temperature chart</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Optimal temperature range: 18-24°C. Your average: 21°C
              </p>
            </div>

            {/* Humidity Impact */}
            <div>
              <h4 className="text-sm font-medium text-gray-900">Humidity</h4>
              <div className="mt-2 h-36 flex items-center justify-center bg-gray-100 rounded-lg">
                <span className="text-gray-500">Humidity chart</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Optimal humidity range: 50-70%. Your average: 60%
              </p>
            </div>

            {/* Growing Time Impact */}
            <div>
              <h4 className="text-sm font-medium text-gray-900">Growing Time</h4>
              <div className="mt-2 h-36 flex items-center justify-center bg-gray-100 rounded-lg">
                <span className="text-gray-500">Growing time chart</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Optimal harvest window varies by variety. You're harvesting on average 1 day late.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YieldAnalytics;