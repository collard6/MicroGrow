import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { 
  ArrowLeft, 
  Filter, 
  Download, 
  DollarSign, 
  PieChart, 
  TrendingUp, 
  ArrowUp, 
  ArrowDown
} from 'lucide-react';

import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage';

const CostAnalytics = () => {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState('month'); // week, month, year, all
  const [filterCategory, setFilterCategory] = useState('all');

  // Fetch cost analytics data
  const { data, isLoading, error, refetch } = useQuery(
    ['costAnalytics', timeframe, filterCategory], 
    async () => {
      const response = await axios.get(`/api/analytics/cost?timeframe=${timeframe}&category=${filterCategory}`);
      return response.data;
    }
  );

  const handleFilterChange = (e) => {
    setFilterCategory(e.target.value);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load cost analytics data" retry={refetch} />;
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
            <h1 className="text-2xl font-bold text-gray-900">Cost & Revenue Analytics</h1>
            <p className="text-gray-500">Financial performance of your microgreen operation</p>
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
              <label htmlFor="categoryFilter" className="sr-only">Filter by Category</label>
              <select
                id="categoryFilter"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                value={filterCategory}
                onChange={handleFilterChange}
              >
                <option value="all">All Categories</option>
                <option value="seeds">Seeds</option>
                <option value="growing_medium">Growing Medium</option>
                <option value="supplies">Supplies</option>
                <option value="utilities">Utilities</option>
                <option value="labor">Labor</option>
                <option value="packaging">Packaging</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Revenue */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Revenue
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
                          <ArrowUp className="self-center flex-shrink-0 h-5 w-5" />
                        ) : (
                          <ArrowDown className="self-center flex-shrink-0 h-5 w-5" />
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
        </div>

        {/* Total Costs */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Costs
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      ${data?.totalCosts || 0}
                    </div>
                    {data?.costsChange && (
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        data.costsChange > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {data.costsChange > 0 ? (
                          <ArrowUp className="self-center flex-shrink-0 h-5 w-5" />
                        ) : (
                          <ArrowDown className="self-center flex-shrink-0 h-5 w-5" />
                        )}
                        <span className="sr-only">
                          {data.costsChange > 0 ? 'Increased' : 'Decreased'} by
                        </span>
                        {Math.abs(data.costsChange)}%
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Profit */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Profit
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      ${data?.profit || 0}
                    </div>
                    {data?.profitChange && (
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        data.profitChange > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {data.profitChange > 0 ? (
                          <ArrowUp className="self-center flex-shrink-0 h-5 w-5" />
                        ) : (
                          <ArrowDown className="self-center flex-shrink-0 h-5 w-5" />
                        )}
                        <span className="sr-only">
                          {data.profitChange > 0 ? 'Increased' : 'Decreased'} by
                        </span>
                        {Math.abs(data.profitChange)}%
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
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
                    {data?.marginChange && (
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        data.marginChange > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {data.marginChange > 0 ? (
                          <ArrowUp className="self-center flex-shrink-0 h-5 w-5" />
                        ) : (
                          <ArrowDown className="self-center flex-shrink-0 h-5 w-5" />
                        )}
                        <span className="sr-only">
                          {data.marginChange > 0 ? 'Increased' : 'Decreased'} by
                        </span>
                        {Math.abs(data.marginChange)}%
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue & Cost Trend */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Revenue & Cost Trends</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Compare revenue and costs over time</p>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="h-72 flex items-center justify-center bg-gray-100 rounded-lg">
            <PieChart className="h-12 w-12 text-gray-400" />
            <span className="ml-2 text-gray-500">Revenue & cost trend chart will be displayed here</span>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Cost Breakdown</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Where your money is going</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="h-80 flex items-center justify-center bg-gray-100 rounded-lg">
              <PieChart className="h-12 w-12 text-gray-400" />
              <span className="ml-2 text-gray-500">Cost breakdown chart will be displayed here</span>
            </div>

            {/* Cost Categories Table */}
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      % of Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      vs Previous
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data?.costBreakdown?.map((category) => (
                    <tr key={category.name}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {category.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${category.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {category.percentage}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {category.change ? (
                          <div className={`flex items-center text-sm font-medium ${
                            category.change > 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {category.change > 0 ? (
                              <ArrowUp className="mr-1 h-4 w-4" />
                            ) : (
                              <ArrowDown className="mr-1 h-4 w-4" />
                            )}
                            {Math.abs(category.change)}%
                          </div>
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
      </div>

      {/* Cost Per Variety */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Cost Per Variety</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Comparison of costs and profitability by microgreen variety</p>
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
                    Revenue
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profit
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Margin
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost per Gram
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.varietyCosts?.map((variety) => (
                  <tr key={variety.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {variety.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${variety.revenue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${variety.cost}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${variety.profit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        variety.margin >= 50 ? 'bg-green-100 text-green-800' :
                        variety.margin >= 25 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {variety.margin}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${variety.costPerGram}/g
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cost Optimization Recommendations */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Cost Optimization Recommendations</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Suggestions to improve profitability</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <ul className="space-y-4">
            {data?.recommendations?.map((recommendation, index) => (
              <li key={index} className="flex">
                <div className="flex-shrink-0">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    recommendation.impact === 'high' ? 'bg-green-100' :
                    recommendation.impact === 'medium' ? 'bg-yellow-100' :
                    'bg-blue-100'
                  }`}>
                    <span className={`text-sm font-medium ${
                      recommendation.impact === 'high' ? 'text-green-800' :
                      recommendation.impact === 'medium' ? 'text-yellow-800' :
                      'text-blue-800'
                    }`}>
                      {index + 1}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900">{recommendation.title}</h4>
                  <p className="mt-1 text-sm text-gray-500">{recommendation.description}</p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      recommendation.impact === 'high' ? 'bg-green-100 text-green-800' :
                      recommendation.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {recommendation.impact === 'high' ? 'High impact' :
                       recommendation.impact === 'medium' ? 'Medium impact' :
                       'Low impact'}
                    </span>
                    {recommendation.estimatedSavings && (
                      <span className="ml-2 text-xs text-gray-500">
                        Est. savings: ${recommendation.estimatedSavings}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
            {!data?.recommendations?.length && (
              <li className="text-center text-gray-500 py-4">
                No recommendations available for the current time period.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CostAnalytics;