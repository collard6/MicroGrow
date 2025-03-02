import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { format, parseISO, isToday, isTomorrow, addDays } from 'date-fns';
import { 
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
  TrendingUp,
  Layers,
  Plus,
  ChevronRight,
  Filter,
  RefreshCw,
  Bell,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Leaf,
  Droplet,
  User
} from 'lucide-react';

// Components
import DashboardCard from '../components/Dashboard/DashboardCard';
import TaskList from '../components/Dashboard/TaskList';
import TrayOverview from '../components/Dashboard/TrayOverview';
import HarvestForecast from '../components/Dashboard/HarvestForecast';
import InventoryAlerts from '../components/Dashboard/InventoryAlerts';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';
import WeatherWidget from '../components/Dashboard/WeatherWidget';
import PerformanceChart from '../components/Dashboard/PerformanceChart';
import QuickActionPanel from '../components/Dashboard/QuickActionPanel';
import NotificationPanel from '../components/Dashboard/NotificationPanel';

// Hooks
import { useAuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuthContext();
  const [dailyTasks, setDailyTasks] = useState([]);
  const [upcomingHarvests, setUpcomingHarvests] = useState([]);
  const [activeTrays, setActiveTrays] = useState([]);
  const [inventoryAlerts, setInventoryAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [timeframe, setTimeframe] = useState('week'); // 'week', 'month', 'year'
  const [dashboardStats, setDashboardStats] = useState({
    totalActiveTrays: 0,
    traySeedingToday: 0,
    trayHarvestToday: 0,
    weeklyHarvestForecast: 0,
    monthlySales: 0,
    seedUsage: 0,
    growingAreaUtilization: 0,
    profitMargin: 0
  });
  
  // Fetch weather data for user's location
  const [weather, setWeather] = useState(null);
  const [weatherLocation, setWeatherLocation] = useState('');

  // Fetch dashboard data
  const { data, isLoading, error, refetch } = useQuery(
    ['dashboardData', timeframe], 
    async () => {
      const response = await axios.get(`/api/dashboard?timeframe=${timeframe}`);
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Format today's date for display
  const todayDate = useMemo(() => {
    return format(new Date(), 'EEEE, MMMM d, yyyy');
  }, []);

  // Calculate if we have good growing conditions based on environment data
  const growingConditionsStatus = useMemo(() => {
    if (!data?.environmentData) return 'unknown';
    
    const { temperature, humidity, light } = data.environmentData;
    
    if (
      temperature >= 18 && temperature <= 24 &&
      humidity >= 50 && humidity <= 70 &&
      light >= 1500
    ) {
      return 'optimal';
    } else if (
      temperature >= 16 && temperature <= 26 &&
      humidity >= 40 && humidity <= 80 &&
      light >= 1000
    ) {
      return 'good';
    } else {
      return 'suboptimal';
    }
  }, [data?.environmentData]);
  
  // Get color for growing conditions indicator
  const growingConditionsColor = useMemo(() => {
    switch (growingConditionsStatus) {
      case 'optimal': return 'text-green-500';
      case 'good': return 'text-yellow-500';
      case 'suboptimal': return 'text-red-500';
      default: return 'text-gray-500';
    }
  }, [growingConditionsStatus]);

  useEffect(() => {
    if (data) {
      setDailyTasks(data.tasks.map(task => ({
        ...task,
        dueDate: parseISO(task.dueDate)
      })));
      setUpcomingHarvests(data.upcomingHarvests.map(harvest => ({
        ...harvest,
        expectedHarvestDate: parseISO(harvest.expectedHarvestDate)
      })));
      setActiveTrays(data.activeTrays);
      setInventoryAlerts(data.inventoryAlerts);
      setDashboardStats(data.stats);
      setNotifications(data.notifications || []);
      
      // Set weather information
      if (data.weather) {
        setWeather(data.weather);
        setWeatherLocation(data.weather.location);
      }
    }
  }, [data]);

  // Handle task completion
  const handleCompleteTask = async (taskId) => {
    try {
      await axios.post(`/api/tasks/${taskId}/complete`);
      
      // Update local state to show the task as completed
      setDailyTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, completed: true } : task
        )
      );
      
      // Refetch dashboard data after a short delay
      setTimeout(() => {
        refetch();
      }, 1000);
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };
  
  // Toggle notification panel
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };
  
  // Calculate notification count for badge
  const unreadNotificationCount = useMemo(() => {
    return notifications.filter(notification => !notification.read).length;
  }, [notifications]);
  
  // Format stat change indicator (up/down arrow with percentage)
  const formatStatChange = (change, isHigherBetter = true) => {
    const isPositive = change > 0;
    const isNegative = change < 0;
    
    if (change === 0) return null;
    
    const IndicatorIcon = isPositive ? ArrowUp : ArrowDown;
    
    // Determine color based on whether higher is better
    let colorClass;
    if (isPositive) {
      colorClass = isHigherBetter ? 'text-green-500' : 'text-red-500';
    } else {
      colorClass = isHigherBetter ? 'text-red-500' : 'text-green-500';
    }
    
    return (
      <div className={`flex items-center ${colorClass} text-xs`}>
        <IndicatorIcon size={12} className="mr-1" />
        {Math.abs(change)}%
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorMessage 
          message="Failed to load dashboard data. Please try again." 
          retry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">{todayDate}</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <button 
            className="p-2 text-gray-400 hover:text-gray-600 relative"
            onClick={toggleNotifications}
          >
            <Bell size={20} />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadNotificationCount}
              </span>
            )}
          </button>
          <button 
            className="p-2 text-gray-400 hover:text-gray-600"
            onClick={() => refetch()}
          >
            <RefreshCw size={20} />
          </button>
          <div className="relative inline-block text-left">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Filter size={20} />
            </button>
          </div>
          <Link
            to="/trays/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Tray
          </Link>
        </div>
      </div>
      
      {/* Notification Panel (conditionally rendered) */}
      {showNotifications && (
        <NotificationPanel 
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
        />
      )}

      {/* Growing Conditions Alert */}
      {data?.environmentData && (
        <div className={`p-4 rounded-lg border ${
          growingConditionsStatus === 'optimal' ? 'bg-green-50 border-green-200' :
          growingConditionsStatus === 'good' ? 'bg-yellow-50 border-yellow-200' :
          'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center">
            <div className={`p-2 rounded-full ${
              growingConditionsStatus === 'optimal' ? 'bg-green-100' :
              growingConditionsStatus === 'good' ? 'bg-yellow-100' :
              'bg-red-100'
            } mr-3`}>
              <Leaf size={16} className={growingConditionsColor} />
            </div>
            <div>
              <h3 className="font-medium">
                {growingConditionsStatus === 'optimal' ? 'Optimal Growing Conditions' :
                 growingConditionsStatus === 'good' ? 'Good Growing Conditions' :
                 'Suboptimal Growing Conditions'}
              </h3>
              <p className="text-sm text-gray-600">
                Temperature: {data.environmentData.temperature}°C, 
                Humidity: {data.environmentData.humidity}%, 
                Light: {data.environmentData.light} lux
              </p>
            </div>
            <div className="ml-auto">
              <Link 
                to="/analytics"
                className="text-sm text-green-600 hover:text-green-500 flex items-center"
              >
                Details
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Active Trays"
          value={dashboardStats.totalActiveTrays}
          change={dashboardStats.trayChange}
          icon={<Layers className="h-6 w-6 text-blue-600" />}
          to="/trays"
        />
        <DashboardCard
          title="Today's Tasks"
          value={dashboardStats.tasksToday}
          completed={dashboardStats.tasksCompleted}
          icon={<CheckCircle className="h-6 w-6 text-green-600" />}
          to="/schedules"
        />
        <DashboardCard
          title="Harvest Forecast"
          value={`${dashboardStats.weeklyHarvestForecast} kg`}
          change={dashboardStats.harvestChange}
          icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
          to="/analytics/yield"
        />
        <DashboardCard
          title={timeframe === 'week' ? 'Weekly Revenue' : 'Monthly Revenue'}
          value={`$${dashboardStats.revenue}`}
          change={dashboardStats.revenueChange}
          icon={<TrendingUp className="h-6 w-6 text-green-600" />}
          to="/analytics"
        />
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Column 1: Tasks + Inventory */}
        <div className="lg:col-span-1 space-y-6">
          {/* Tasks for Today */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Today's Tasks</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {dailyTasks.filter(task => !task.completed).length} tasks remaining
                </p>
              </div>
              <Link
                to="/schedules"
                className="text-sm font-medium text-green-600 hover:text-green-500 flex items-center"
              >
                View All
                <ChevronRight size={16} />
              </Link>
            </div>
            <TaskList 
              tasks={dailyTasks} 
              onCompleteTask={handleCompleteTask} 
            />
          </div>
          
          {/* Inventory Alerts */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Inventory Alerts</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Seeds and supplies that need attention
                </p>
              </div>
              <Link
                to="/inventory"
                className="text-sm font-medium text-green-600 hover:text-green-500 flex items-center"
              >
                Manage Inventory
                <ChevronRight size={16} />
              </Link>
            </div>
            <InventoryAlerts alerts={inventoryAlerts} />
          </div>
          
          {/* Weather Widget */}
          {weather && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Local Weather</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">{weatherLocation}</p>
              </div>
              <div className="px-4 py-3 sm:px-6">
                <WeatherWidget weather={weather} />
              </div>
            </div>
          )}
        </div>
        
        {/* Column 2: Performance Chart + Harvests */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Chart */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Performance Overview</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Yield and quality trends</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setTimeframe('week')}
                  className={`px-3 py-1 text-xs rounded-md ${
                    timeframe === 'week' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  Week
                </button>
                <button 
                  onClick={() => setTimeframe('month')}
                  className={`px-3 py-1 text-xs rounded-md ${
                    timeframe === 'month' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  Month
                </button>
                <button 
                  onClick={() => setTimeframe('year')}
                  className={`px-3 py-1 text-xs rounded-md ${
                    timeframe === 'year' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  Year
                </button>
              </div>
            </div>
            <div className="px-4 py-3 sm:px-6">
              {data?.performanceData ? (
                <PerformanceChart 
                  data={data.performanceData} 
                  timeframe={timeframe}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No performance data available yet
                </div>
              )}
            </div>
          </div>
          
          {/* Upcoming Harvests */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Upcoming Harvests</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Trays that will be ready to harvest soon
                </p>
              </div>
              <Link
                to="/schedules"
                className="text-sm font-medium text-green-600 hover:text-green-500 flex items-center"
              >
                View Calendar
                <ChevronRight size={16} />
              </Link>
            </div>
            <HarvestForecast harvests={upcomingHarvests} />
          </div>
        </div>
      </div>

      {/* Tray Overview */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Active Trays Overview</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Current status of all growing trays</p>
          </div>
          <Link
            to="/trays"
            className="text-sm font-medium text-green-600 hover:text-green-500 flex items-center"
          >
            View All Trays
            <ChevronRight size={16} />
          </Link>
        </div>
        <TrayOverview trays={activeTrays} />
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Common tasks and shortcuts</p>
        </div>
        <div className="px-4 py-3 sm:px-6">
          <QuickActionPanel userName={user?.name} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
