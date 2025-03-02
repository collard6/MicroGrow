import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import axios from 'axios';
import { useQueryClient } from 'react-query';

const TaskList = ({ tasks }) => {
  const queryClient = useQueryClient();
  const [completingTask, setCompletingTask] = useState(null);

  const getTaskIcon = (type) => {
    switch (type) {
      case 'seeding':
        return (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
            <span className="text-blue-600">S</span>
          </div>
        );
      case 'blackout':
        return (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-100">
            <span className="text-purple-600">B</span>
          </div>
        );
      case 'harvest':
        return (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100">
            <span className="text-green-600">H</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
            <span className="text-gray-600">T</span>
          </div>
        );
    }
  };

  const handleCompleteTask = async (taskId) => {
    setCompletingTask(taskId);
    try {
      await axios.post(`/api/tasks/${taskId}/complete`);
      // Invalidate and refetch dashboard data
      queryClient.invalidateQueries('dashboardData');
    } catch (error) {
      console.error('Failed to complete task:', error);
    } finally {
      setCompletingTask(null);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks for today</h3>
        <p className="mt-1 text-sm text-gray-500">Enjoy your day off or create some new trays.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {tasks.map((task) => (
        <div key={task.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getTaskIcon(task.type)}
              <div className="ml-3">
                <div className="flex items-center">
                  <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                  {task.isUrgent && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      Urgent
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium">{task.variety}</span> - {task.details}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center mr-4 text-sm text-gray-500">
                <Clock className="mr-1 h-4 w-4" />
                {task.dueTime || 'Today'}
              </div>
              <button
                onClick={() => handleCompleteTask(task.id)}
                disabled={completingTask === task.id}
                className={`flex items-center justify-center h-8 w-8 rounded-full ${
                  task.completed
                    ? 'bg-green-100 text-green-600 cursor-default'
                    : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600'
                } ${completingTask === task.id ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <CheckCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
