import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <h2 className="text-9xl font-extrabold text-green-600">404</h2>
        <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">Page not found</h1>
        <p className="mt-6 text-base text-gray-500">Sorry, we couldn't find the page you're looking for.</p>
        <div className="mt-10">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Home className="mr-2 h-5 w-5" />
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
