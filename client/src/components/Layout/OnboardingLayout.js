import React from 'react';
import { Outlet } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const OnboardingLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="flex items-center">
          <Leaf size={24} className="text-green-600 mr-2" />
          <div className="text-xl font-bold text-gray-800">MicroGrow</div>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default OnboardingLayout;
