import React from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  CheckSquare, 
  BarChart2, 
  Calendar, 
  ShoppingBag,
  Tool,
  Camera,
  FileText
} from 'lucide-react';

const QuickActionPanel = ({ userName }) => {
  const quickActions = [
    {
      name: 'New Tray',
      icon: <PlusCircle className="h-6 w-6 text-green-600" />,
      path: '/trays/new',
      description: 'Start tracking a new microgreen tray'
    },
    {
      name: 'Record Harvest',
      icon: <CheckSquare className="h-6 w-6 text-blue-600" />,
      path: '/trays',
      description: 'Log a completed harvest'
    },
    {
      name: 'View Schedule',
      icon: <Calendar className="h-6 w-6 text-purple-600" />,
      path: '/schedules',
      description: 'Check your growing calendar'
    },
    {
      name: 'Marketplace',
      icon: <ShoppingBag className="h-6 w-6 text-yellow-600" />,
      path: '/marketplace',
      description: 'Connect with buyers'
    },
    {
      name: 'Log Growth',
      icon: <Camera className="h-6 w-6 text-pink-600" />,
      path: '/trays',
      description: 'Document plant progress'
    },
    {
      name: 'Generate Report',
      icon: <FileText className="h-6 w-6 text-gray-600" />,
      path: '/analytics',
      description: 'Create production reports'
    },
    {
      name: 'View Analytics',
      icon: <BarChart2 className="h-6 w-6 text-indigo-600" />,
      path: '/analytics',
      description: 'Analyze growing performance'
    },
    {
      name: 'Manage Inventory',
      icon: <Tool className="h-6 w-6 text-orange-600" />,
      path: '/inventory',
      description: 'Check and update stock'
    }
  ];

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.name}
            to={action.path}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-gray-100 rounded-full mb-2">
              {action.icon}
            </div>
            <div className="font-medium text-gray-900">{action.name}</div>
            <div className="text-xs text-gray-500 text-center mt-1">{action.description}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActionPanel;
