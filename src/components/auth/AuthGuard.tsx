import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireAuth = false }) => {
  const { user } = useAuth();

  // If user is authenticated and trying to access auth pages (signin/signup)
  if (user && !requireAuth) {
    return <Navigate to="/" replace />;
  }

  // If user is not authenticated and trying to access protected pages
  if (!user && requireAuth) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard; 