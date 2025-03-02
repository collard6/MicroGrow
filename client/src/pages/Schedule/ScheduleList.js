import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Calendar, List, ChevronLeft, ChevronRight, Plus, Filter } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from 'date-fns';

import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage';

const ScheduleList = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // 'month', 'week', 'list'

  // Fetch schedule data
  const { data: scheduleData, isLoading, error } = useQuery('schedule', async () => {
    const response = await axios.get('/api/schedules');
    return response.data;
  });

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  // Calendar helper functions
  const getMonthDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: startDate, end: endDate });
  };

  // Find events for a specific day
  const getEventsForDay = (day) => {
    if (!scheduleData?.events) return [];
    
    return scheduleData.events.filter(event => {
      const eventDate = new Date(event.date);
      return isSameDay(eventDate, day);
    });
  };

  // Render day cell with events
  const renderDayCell = (day) => {
    const dayEvents = getEventsForDay(day);
    const isCurrentMonth = isSameMonth(day, currentDate);
    const isCurrentDay = isToday(day);
    
    return (
      <div
        key={day.toString()}
        className={`min-h-[100px] border p-2 ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'} ${
          isCurrentDay ? 'border-green-500' : 'border-gray-200'
        }`}
      >
        <div className={`text-right ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'} ${
          isCurrentDay ? 'font-bold' : ''
        }`}>
          {format(day, 'd')}
        </div>
        <div className="mt-1 space-y-1">
          {dayEvents.map((event, index) => (
            <div
              key={index}
              className={`text-xs truncate rounded px-1 py-0.5 ${
                event.type === 'seeding' ? 'bg-blue-100 text-blue-800' :
                event.type === 'blackout-end' ? 'bg-purple-100 text-purple-800' :
                event.type === 'harvest' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}
            >
              {event.title}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load schedule data" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Growing Schedule</h1>
          <p className="text-gray-500">Manage your growing calendar and upcoming tasks</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button
            onClick={() => setView('month')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              view === 'month' ? 'bg-green-100 text-green-800' : 'bg-white text-gray-600 border border-gray-300'
            }`}
          >
            <Calendar className="h-4 w-4 inline mr-1" />
            Month
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              view === 'list' ? 'bg-green-100 text-green-800' : 'bg-white text-gray-600 border border-gray-300'
            }`}
          >
            <List className="h-4 w-4 inline mr-1" />
            List
          </button>
          <button
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Event
          </button>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="flex items-center justify-between bg-white p-4 shadow rounded-lg">
        <button
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h2 className="text-xl font-semibold text-gray-900">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Calendar View */}
      {view === 'month' && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Day labels */}
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="bg-gray-50 py-2 text-center text-xs font-semibold text-gray-700">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {getMonthDays().map((day) => renderDayCell(day))}
          </div>
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {scheduleData?.events && scheduleData.events.length > 0 ? (
              scheduleData.events
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((event, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                        event.type === 'seeding' ? 'bg-blue-100 text-blue-800' :
                        event.type === 'blackout-end' ? 'bg-purple-100 text-purple-800' :
                        event.type === 'harvest' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.type === 'seeding' ? 'S' :
                         event.type === 'blackout-end' ? 'B' :
                         event.type === 'harvest' ? 'H' : 'E'}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                        <div className="text-sm text-gray-500">{format(new Date(event.date), 'MMMM d, yyyy')}</div>
                        {event.description && (
                          <div className="mt-1 text-sm text-gray-600">{event.description}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="p-6 text-center">
                <Calendar className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating your first event.
                </p>
                <div className="mt-6">
                  <button
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    New Event
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="bg-white p-4 shadow rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Event Types</h3>
        <div className="flex space-x-4">
          <div className="flex items-center">
            <div className="h-4 w-4 rounded-full bg-blue-100 mr-2"></div>
            <span className="text-sm text-gray-600">Seeding</span>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 rounded-full bg-purple-100 mr-2"></div>
            <span className="text-sm text-gray-600">Blackout End</span>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 rounded-full bg-green-100 mr-2"></div>
            <span className="text-sm text-gray-600">Harvest</span>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 rounded-full bg-gray-100 mr-2"></div>
            <span className="text-sm text-gray-600">Other</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleList;
