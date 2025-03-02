import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import LoadingScreen from '../UI/LoadingScreen';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    // Redirect to dashboard if not an admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
