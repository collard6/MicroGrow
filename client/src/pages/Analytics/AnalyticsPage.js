import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { 
  TrendingUp, 
  BarChart2, 
  PieChart, 
  Calendar, 
  DollarSign, 
  Award,
  Download, 
  Filter,
  ChevronRight
} from 'lucide-react';

import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage';

const AnalyticsPage = () => {
  const [timeframe, setTimeframe] = useState('month'); // week, month, year, all

  // Fetch analytics data
  const { data, isLoading, error, refetch } = useQuery(
    ['analyticsData', timeframe], 
    async () => {
      const response = await axios.get(`/api/analytics?timeframe=${timeframe}`);
      return response.data;
    }
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load analytics data" retry={refetch} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-500">Data insights to optimize your microgreen operation</p>
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

      {/* Analytics Cards */}
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
                          <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="self-center flex-shrink-0 h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
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
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/analytics/yield" className="font-medium text-green-600 hover:text-green-500">
                View Yield Details
                <ChevronRight className="ml-1 h-4 w-4 inline" />
              </Link>
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Revenue
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      ${data?.revenue || 0}
                    </div>
                    {data?.revenueChange && (
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        data.revenueChange > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {data.revenueChange > 0 ? (
                          <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="self-center flex-shrink-0 h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span className="sr-only">
                          {data.revenueChange > 0 ? 'Increased' : 'Decreased'} by
                        </span>
                        {Math.abs(data.revenueChange)}%
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/analytics/cost" className="font-medium text-green-600 hover:text-green-500">
                View Revenue Details
                <ChevronRight className="ml-1 h-4 w-4 inline" />
              </Link>
            </div>
          </div>
        </div>

        {/* Profit Margin */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PieChart className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Profit Margin
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {data?.profitMargin || 0}%
                    </div>
                    {data?.profitMarginChange && (
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        data.profitMarginChange > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {data.profitMarginChange > 0 ? (
                          <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="self-center flex-shrink-0 h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span className="sr-only">
                          {data.profitMarginChange > 0 ? 'Increased' : 'Decreased'} by
                        </span>
                        {Math.abs(data.profitMarginChange)}%
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/analytics/cost" className="font-medium text-green-600 hover:text-green-500">
                View Profit Details
                <ChevronRight className="ml-1 h-4 w-4 inline" />
              </Link>
            </div>
          </div>
        </div>

        {/* Quality Score */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Average Quality
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {data?.averageQuality || 0}/10
                    </div>
                    {data?.qualityChange && (
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        data.qualityChange > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {data.qualityChange > 0 ? (
                          <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="self-center flex-shrink-0 h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span className="sr-only">
                          {data.qualityChange > 0 ? 'Increased' : 'Decreased'} by
                        </span>
                        {Math.abs(data.qualityChange)}%
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/analytics/quality" className="font-medium text-green-600 hover:text-green-500">
                View Quality Details
                <ChevronRight className="ml-1 h-4 w-4 inline" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Production & Revenue Trends</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Compare yield and revenue over time</p>
          </div>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 text-xs rounded-md bg-gray-100 text-gray-800"
            >
              Yield
            </button>
            <button
              className="px-3 py-1 text-xs rounded-md bg-gray-100 text-gray-800"
            >
              Revenue
            </button>
            <button
              className="px-3 py-1 text-xs rounded-md bg-gray-100 text-gray-800"
            >
              Combined
            </button>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="h-72 flex items-center justify-center bg-gray-100 rounded-lg">
            <BarChart2 className="h-12 w-12 text-gray-400" />
            <span className="ml-2 text-gray-500">Analytics chart will be displayed here</span>
          </div>
        </div>
      </div>

      {/* Variety Performance */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Variety Performance</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Yield, quality, and profit metrics by variety</p>
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
                    Avg. Yield/Tray
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quality Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profit Margin
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.varietyPerformance?.map((variety) => (
                  <tr key={variety.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {variety.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {variety.totalYield} g
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {variety.avgYieldPerTray} g
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        variety.qualityScore >= 8 ? 'bg-green-100 text-green-800' :
                        variety.qualityScore >= 5 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {variety.qualityScore}/10
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${variety.revenue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {variety.profitMargin}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Growth Over Time */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Monthly Growth</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Production growth over the past year</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="h-72 flex items-center justify-center bg-gray-100 rounded-lg">
            <Calendar className="h-12 w-12 text-gray-400" />
            <span className="ml-2 text-gray-500">Growth calendar will be displayed here</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
