import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { ArrowLeft, Edit, Trash, Calendar, Clock, MapPin, User, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage';

const ScheduleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch event data
  const { data: event, isLoading, error } = useQuery(['scheduleEvent', id], async () => {
    const response = await axios.get(`/api/schedules/${id}`);
    return response.data;
  });

  // Delete event mutation
  const deleteEventMutation = useMutation(
    async () => {
      await axios.delete(`/api/schedules/${id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('schedule');
        navigate('/schedules');
      },
    }
  );

  // Mark as completed mutation
  const completeEventMutation = useMutation(
    async () => {
      await axios.patch(`/api/schedules/${id}/complete`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['scheduleEvent', id]);
      },
    }
  );

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      deleteEventMutation.mutate();
    }
  };

  const handleComplete = () => {
    completeEventMutation.mutate();
  };

  // Get event type badge styling
  const getEventTypeBadge = (type) => {
    switch (type) {
      case 'seeding':
        return 'bg-blue-100 text-blue-800';
      case 'blackout-end':
        return 'bg-purple-100 text-purple-800';
      case 'harvest':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return format(date, 'MMMM d, yyyy');
  };

  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'h:mm a');
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load event details" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 mr-3">{event.title}</h1>
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEventTypeBadge(event.type)}`}>
                {event.type.charAt(0).toUpperCase() + event.type.slice(1).replace('-', ' ')}
              </span>
            </div>
            <p className="text-gray-500">{event.relatedEntity?.type}: {event.relatedEntity?.name}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/schedules/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Event Details */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Event Details</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Information about this scheduled event.</p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  {formatDate(event.date)}
                </div>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Time</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  {formatTime(event.date) || 'All day'}
                </div>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Location</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                  {event.location || 'Not specified'}
                </div>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Assigned To</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-2" />
                  {event.assignedTo || 'Not assigned'}
                </div>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  {event.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                  )}
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    event.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {event.completed ? 'Completed' : 'Pending'}
                  </span>
                  {!event.completed && (
                    <button
                      onClick={handleComplete}
                      className="ml-3 inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Related Entity */}
      {event.relatedEntity && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Related {event.relatedEntity.type}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Details about the associated item.</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-medium">
                {event.relatedEntity.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900">{event.relatedEntity.name}</h4>
                <p className="text-sm text-gray-500">{event.relatedEntity.description}</p>
              </div>
            </div>
            <div className="mt-3">
              <Link
                to={`/${event.relatedEntity.type.toLowerCase()}s/${event.relatedEntity.id}`}
                className="text-sm font-medium text-green-600 hover:text-green-500"
              >
                View details
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      {event.description && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Description</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{event.description}</p>
          </div>
        </div>
      )}

      {/* Notes */}
      {event.notes && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Notes</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{event.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleDetails;
