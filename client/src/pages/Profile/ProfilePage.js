import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from 'react-query';
import axios from 'axios';
import { 
  User, 
  Mail, 
  Calendar, 
  Edit,
  Save,
  X,
  Leaf,
  Check,
  AlertCircle
} from 'lucide-react';

import { useAuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const ProfilePage = () => {
  const { user, updateProfile } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    growerType: user?.growerType || 'hobby',
    productionScale: user?.productionScale || 'small',
    profileVisibility: user?.profileVisibility || false
  });

  // Profile update mutation
  const mutation = useMutation(
    async (updatedProfile) => {
      return await updateProfile(updatedProfile);
    },
    {
      onSuccess: () => {
        setIsEditing(false);
        setFormError(null);
      },
      onError: (error) => {
        setFormError(error.response?.data?.message || 'Failed to update profile');
      }
    }
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim()) {
      setFormError('Name is required');
      return;
    }
    
    mutation.mutate(formData);
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      name: user?.name || '',
      growerType: user?.growerType || 'hobby',
      productionScale: user?.productionScale || 'small',
      profileVisibility: user?.profileVisibility || false
    });
    setIsEditing(false);
    setFormError(null);
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={mutation.isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {mutation.isLoading ? (
                <LoadingSpinner size="small" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </button>
          </div>
        )}
      </div>

      {formError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{formError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Profile Information */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and application settings</p>
          </div>
          <div className="flex-shrink-0">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <User className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          {isEditing ? (
            <form className="px-4 py-5">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={user.email}
                    disabled
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="growerType" className="block text-sm font-medium text-gray-700">
                    Grower Type
                  </label>
                  <select
                    id="growerType"
                    name="growerType"
                    value={formData.growerType}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                  >
                    <option value="hobby">Hobby Grower</option>
                    <option value="small-commercial">Small Commercial</option>
                    <option value="commercial">Commercial Grower</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="productionScale" className="block text-sm font-medium text-gray-700">
                    Production Scale
                  </label>
                  <select
                    id="productionScale"
                    name="productionScale"
                    value={formData.productionScale}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                  >
                    <option value="small">1-5 trays</option>
                    <option value="medium">6-20 trays</option>
                    <option value="large">21-100 trays</option>
                    <option value="xlarge">100+ trays</option>
                  </select>
                </div>

                <div className="sm:col-span-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="profileVisibility"
                        name="profileVisibility"
                        type="checkbox"
                        checked={formData.profileVisibility}
                        onChange={handleChange}
                        className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="profileVisibility" className="font-medium text-gray-700">
                        Public Profile
                      </label>
                      <p className="text-gray-500">
                        Allow other growers to see your profile in the marketplace
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.name}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Grower type</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.growerType === 'hobby' && 'Hobby Grower'}
                  {user.growerType === 'small-commercial' && 'Small Commercial'}
                  {user.growerType === 'commercial' && 'Commercial Grower'}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Production scale</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.productionScale === 'small' && '1-5 trays'}
                  {user.productionScale === 'medium' && '6-20 trays'}
                  {user.productionScale === 'large' && '21-100 trays'}
                  {user.productionScale === 'xlarge' && '100+ trays'}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Profile visibility</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="flex items-center">
                    {user.profileVisibility ? (
                      <>
                        <Check className="h-5 w-5 text-green-500 mr-1.5" />
                        <span>Public - Other users can see your profile</span>
                      </>
                    ) : (
                      <>
                        <X className="h-5 w-5 text-gray-400 mr-1.5" />
                        <span>Private - Only you can see your profile</span>
                      </>
                    )}
                  </div>
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Member since</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(user.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          )}
        </div>
      </div>

      {/* Account Security */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Account Security</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Password and security settings</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Password</h4>
              <p className="mt-1 text-sm text-gray-500">
                Last changed {user.passwordUpdatedAt ? new Date(user.passwordUpdatedAt).toLocaleDateString() : 'never'}
              </p>
            </div>
            <Link
              to="/settings/account"
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Change Password
            </Link>
          </div>
        </div>
      </div>

      {/* Marketplace Settings */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Marketplace Settings</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Your presence in the microgreens marketplace</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Seller Profile</h4>
              {user.sellerProfile ? (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    You have set up your seller profile. You can edit your seller information or manage your listings.
                  </p>
                  <div className="mt-4 flex space-x-3">
                    <Link
                      to="/marketplace/my-profile"
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Edit Seller Profile
                    </Link>
                    <Link
                      to="/marketplace/my-listings"
                      className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Manage Listings
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    You haven't set up your seller profile yet. Set up your profile to sell microgreens in the marketplace.
                  </p>
                  <div className="mt-4">
                    <Link
                      to="/marketplace/setup"
                      className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Set Up Seller Profile
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Buyer Profile</h4>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  You can browse and purchase microgreens from other sellers in the marketplace.
                </p>
                <div className="mt-4">
                  <Link
                    to="/marketplace/browse"
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Browse Marketplace
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;