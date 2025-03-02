import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { 
  ArrowLeft, 
  Filter, 
  Download, 
  Award, 
  BarChart2, 
  ChevronRight, 
  ArrowUp, 
  ArrowDown, 
  AlertCircle 
} from 'lucide-react';

import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage';

const QualityAnalytics = () => {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState('month'); // week, month, year, all
  const [filterVariety, setFilterVariety] = useState('all');

  // Fetch quality analytics data
  const { data, isLoading, error, refetch } = useQuery(
    ['qualityAnalytics', timeframe, filterVariety], 
    async () => {
      const response = await axios.get(`/api/analytics/quality?timeframe=${timeframe}&variety=${filterVariety}`);
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

  // Get score badge styling
  const getScoreBadge = (score) => {
    if (score >= 8) {
      return 'bg-green-100 text-green-800';
    } else if (score >= 5) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-red-100 text-red-800';
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load quality analytics data" retry={refetch} />;
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
            <h1 className="text-2xl font-bold text-gray-900">Quality Analytics</h1>
            <p className="text-gray-500">Analysis of microgreen quality metrics</p>
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
        {/* Overall Quality Score */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Overall Quality
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {data?.overallQuality || 0}/10
                    </div>
                    {data?.qualityChange && (
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        data.qualityChange > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {data.qualityChange > 0 ? (
                          <ArrowUp className="self-center flex-shrink-0 h-5 w-5" />
                        ) : (
                          <ArrowDown className="self-center flex-shrink-0 h-5 w-5" />
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
        </div>

        {/* Appearance Score */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Appearance
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {data?.appearanceScore || 0}/10
                    </div>
                    {data?.appearanceChange && (
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        data.appearanceChange > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {data.appearanceChange > 0 ? (
                          <ArrowUp className="self-center flex-shrink-0 h-5 w-5" />
                        ) : (
                          <ArrowDown className="self-center flex-shrink-0 h-5 w-5" />
                        )}
                        <span className="sr-only">
                          {data.appearanceChange > 0 ? 'Increased' : 'Decreased'} by
                        </span>
                        {Math.abs(data.appearanceChange)}%
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Flavor Score */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Flavor
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {data?.flavorScore || 0}/10
                    </div>
                    {data?.flavorChange && (
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        data.flavorChange > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {data.flavorChange > 0 ? (
                          <ArrowUp className="self-center flex-shrink-0 h-5 w-5" />
                        ) : (
                          <ArrowDown className="self-center flex-shrink-0 h-5 w-5" />
                        )}
                        <span className="sr-only">
                          {data.flavorChange > 0 ? 'Increased' : 'Decreased'} by
                        </span>
                        {Math.abs(data.flavorChange)}%
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Issues Count */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Quality Issues
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {data?.issuesCount || 0}
                    </div>
                    {data?.issuesChange && (
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        data.issuesChange > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {data.issuesChange > 0 ? (
                          <ArrowUp className="self-center flex-shrink-0 h-5 w-5" />
                        ) : (
                          <ArrowDown className="self-center flex-shrink-0 h-5 w-5" />
                        )}
                        <span className="sr-only">
                          {data.issuesChange > 0 ? 'Increased' : 'Decreased'} by
                        </span>
                        {Math.abs(data.issuesChange)}%
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quality Trend Chart */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Quality Score Trends</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Quality metrics over time</p>
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-xs rounded-md bg-green-100 text-green-800">
              Overall
            </button>
            <button className="px-3 py-1 text-xs rounded-md bg-gray-100 text-gray-800">
              Appearance
            </button>
            <button className="px-3 py-1 text-xs rounded-md bg-gray-100 text-gray-800">
              Flavor
            </button>
            <button className="px-3 py-1 text-xs rounded-md bg-gray-100 text-gray-800">
              Texture
            </button>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="h-72 flex items-center justify-center bg-gray-100 rounded-lg">
            <BarChart2 className="h-12 w-12 text-gray-400" />
            <span className="ml-2 text-gray-500">Quality trend chart will be displayed here</span>
          </div>
        </div>
      </div>

      {/* Quality By Variety */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Quality by Variety</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Compare quality metrics across different microgreens</p>
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
                    Overall Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Appearance
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Flavor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Texture
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shelf Life
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issues
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.varietyQuality?.map((variety) => (
                  <tr key={variety.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {variety.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getScoreBadge(variety.overallScore)}`}>
                        {variety.overallScore}/10
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getScoreBadge(variety.appearance)}`}>
                        {variety.appearance}/10
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getScoreBadge(variety.flavor)}`}>
                        {variety.flavor}/10
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getScoreBadge(variety.texture)}`}>
                        {variety.texture}/10
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getScoreBadge(variety.shelfLife)}`}>
                        {variety.shelfLife}/10
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {variety.issuesCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Common Quality Issues */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Common Quality Issues</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Frequency analysis of quality problems</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Issues Chart */}
            <div className="h-80 flex items-center justify-center bg-gray-100 rounded-lg">
              <PieChart className="h-12 w-12 text-gray-400" />
              <span className="ml-2 text-gray-500">Quality issues chart will be displayed here</span>
            </div>

            {/* Top Issues Table */}
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Issue Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Occurrences
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      % of Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data?.commonIssues?.map((issue) => (
                    <tr key={issue.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {issue.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {issue.count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {issue.percentage}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {issue.trend === 'up' ? (
                          <div className="flex items-center text-sm font-medium text-red-600">
                            <ArrowUp className="mr-1 h-4 w-4" />
                            {issue.trendValue}%
                          </div>
                        ) : issue.trend === 'down' ? (
                          <div className="flex items-center text-sm font-medium text-green-600">
                            <ArrowDown className="mr-1 h-4 w-4" />
                            {issue.trendValue}%
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

      {/* Quality vs. Environment */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Quality vs. Environment</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Impact of growing conditions on quality</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3">
            {/* Temperature Impact */}
            <div>
              <h4 className="text-sm font-medium text-gray-900">Temperature</h4>
              <div className="mt-2 h-36 flex items-center justify-center bg-gray-100 rounded-lg">
                <span className="text-gray-500">Temperature impact chart</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Optimal temperature range for quality: 18-24°C
              </p>
            </div>

            {/* Humidity Impact */}
            <div>
              <h4 className="text-sm font-medium text-gray-900">Humidity</h4>
              <div className="mt-2 h-36 flex items-center justify-center bg-gray-100 rounded-lg">
                <span className="text-gray-500">Humidity impact chart</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Optimal humidity range for quality: 50-70%
              </p>
            </div>

            {/* Light Impact */}
            <div>
              <h4 className="text-sm font-medium text-gray-900">Light</h4>
              <div className="mt-2 h-36 flex items-center justify-center bg-gray-100 rounded-lg">
                <span className="text-gray-500">Light impact chart</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Optimal light intensity: 1500-2500 lux
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quality Improvement Recommendations */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Quality Improvement Recommendations</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Suggestions to enhance microgreen quality</p>
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
                    {recommendation.targetVariety && (
                      <span className="ml-2 text-xs text-gray-500">
                        Target: {recommendation.targetVariety}
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

export default QualityAnalytics;