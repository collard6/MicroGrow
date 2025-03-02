import React from 'react';
import { Leaf } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="animate-pulse">
        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Leaf className="h-10 w-10 text-green-600" />
        </div>
      </div>
      <h2 className="text-xl font-medium text-gray-700">Loading MicroGrow Tracker...</h2>
    </div>
  );
};

export default LoadingScreen;
