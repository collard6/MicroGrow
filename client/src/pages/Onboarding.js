import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { CheckCircle, Leaf } from 'lucide-react';

const Onboarding = () => {
  const { user, updateProfile } = useAuthContext();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    growerType: user?.growerType || 'hobby',
    productionScale: user?.productionScale || 'small',
    varieties: [],
    growingAreas: ['Default Area'],
    notifications: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAddGrowingArea = () => {
    setFormData({
      ...formData,
      growingAreas: [...formData.growingAreas, ''],
    });
  };

  const handleGrowingAreaChange = (index, value) => {
    const newGrowingAreas = [...formData.growingAreas];
    newGrowingAreas[index] = value;
    setFormData({
      ...formData,
      growingAreas: newGrowingAreas,
    });
  };

  const handleVarietyChange = (variety) => {
    if (formData.varieties.includes(variety)) {
      setFormData({
        ...formData,
        varieties: formData.varieties.filter((v) => v !== variety),
      });
    } else {
      setFormData({
        ...formData,
        varieties: [...formData.varieties, variety],
      });
    }
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await updateProfile({
        ...formData,
        profileCompleted: true,
      });
      navigate('/');
    } catch (error) {
      console.error('Error updating profile:', error);
      setIsSubmitting(false);
    }
  };

  // Sample microgreen varieties
  const microgreens = [
    'Sunflower',
    'Pea Shoots',
    'Radish',
    'Broccoli',
    'Arugula',
    'Kale',
    'Mustard',
    'Amaranth',
    'Basil',
    'Cilantro',
    'Beets',
    'Buckwheat',
  ];

  // Render steps
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Welcome to MicroGrow Tracker</h2>
            <p className="text-gray-600">
              Let's set up your account to get the most out of your microgreen growing experience.
              This will only take a few minutes.
            </p>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Leaf className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Why complete your profile?</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Get personalized recommendations for your growing operation</li>
                      <li>Customize the system to match your specific needs</li>
                      <li>Save time with tailored workflows and views</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <button
              className="w-full py-3 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={nextStep}
            >
              Let's Get Started
            </button>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Grower Profile</h2>
            <p className="text-gray-600">Tell us a bit about your microgreen growing operation.</p>

            <div className="space-y-4">
              <div>
                <label htmlFor="growerType" className="block text-sm font-medium text-gray-700">
                  What type of grower are you?
                </label>
                <select
                  id="growerType"
                  name="growerType"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                  value={formData.growerType}
                  onChange={handleChange}
                >
                  <option value="hobby">Hobby Grower (Personal Use)</option>
                  <option value="small-commercial">Small Commercial (Farmers Markets, etc.)</option>
                  <option value="commercial">Commercial Grower (Restaurants, Retail)</option>
                </select>
              </div>

              <div>
                <label htmlFor="productionScale" className="block text-sm font-medium text-gray-700">
                  How many trays do you typically grow at once?
                </label>
                <select
                  id="productionScale"
                  name="productionScale"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                  value={formData.productionScale}
                  onChange={handleChange}
                >
                  <option value="small">1-5 trays</option>
                  <option value="medium">6-20 trays</option>
                  <option value="large">21-100 trays</option>
                  <option value="xlarge">100+ trays</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={prevStep}
              >
                Back
              </button>
              <button
                className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={nextStep}
              >
                Continue
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Select Your Varieties</h2>
            <p className="text-gray-600">Which microgreens do you grow? Select all that apply.</p>

            <div className="grid grid-cols-2 gap-3">
              {microgreens.map((variety) => (
                <div
                  key={variety}
                  className={`p-3 border rounded-lg cursor-pointer ${
                    formData.varieties.includes(variety) ? 'border-green-600 bg-green-50' : 'border-gray-200'
                  }`}
                  onClick={() => handleVarietyChange(variety)}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 mr-2 rounded-full border flex items-center justify-center ${
                        formData.varieties.includes(variety) ? 'border-green-600 bg-green-600' : 'border-gray-300'
                      }`}
                    >
                      {formData.varieties.includes(variety) && <CheckCircle size={12} className="text-white" />}
                    </div>
                    <span>{variety}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button
                className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={prevStep}
              >
                Back
              </button>
              <button
                className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={nextStep}
              >
                Continue
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Growing Areas</h2>
            <p className="text-gray-600">Define the areas where you grow your microgreens.</p>

            <div className="space-y-3">
              {formData.growingAreas.map((area, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => handleGrowingAreaChange(index, e.target.value)}
                    placeholder={`Growing Area ${index + 1}`}
                    className="flex-1 appearance-none block px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddGrowingArea}
                className="inline-flex items-center px-3 py-2 border border-green-600 text-sm leading-4 font-medium rounded-md text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                + Add Another Area
              </button>
            </div>

            <div className="flex justify-between pt-4">
              <button
                className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={prevStep}
              >
                Back
              </button>
              <button
                className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={nextStep}
              >
                Continue
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Almost Done!</h2>
            <p className="text-gray-600">Just a few final preferences to complete your setup.</p>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="notifications"
                  name="notifications"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  checked={formData.notifications}
                  onChange={handleChange}
                />
                <label htmlFor="notifications" className="ml-2 block text-sm text-gray-900">
                  Enable notifications for tasks and alerts
                </label>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={prevStep}
              >
                Back
              </button>
              <button
                className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Setting Up...' : 'Complete Setup'}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white shadow rounded-lg p-8">
      {/* Progress Indicator */}
      {currentStep > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= step ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > step ? <CheckCircle size={16} /> : step}
                </div>
                <div className="text-xs mt-1 text-gray-500">
                  {step === 1 && 'Profile'}
                  {step === 2 && 'Varieties'}
                  {step === 3 && 'Areas'}
                  {step === 4 && 'Finish'}
                </div>
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute top-0 h-1 bg-gray-200 w-full"></div>
            <div
              className="absolute top-0 h-1 bg-green-600 transition-all duration-500 ease-in-out"
              style={{ width: `${(currentStep - 1) * 33.33}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Step Content */}
      {renderStep()}
    </div>
  );
};

export default Onboarding;
