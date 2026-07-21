/**
 * Protected Route Component
 * Route wrapper that ensures only authenticated users can access protected pages
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState, ProtectedRouteProps } from '../types/index';

/**
 * ProtectedRoute Component
 *
 * Wraps routes that require authentication.
 * Redirects unauthenticated users to the login page while preserving location state.
 *
 * @param {ProtectedRouteProps} props - Component props
 * @param {React.ReactNode} props.children - Protected page component
 * @returns {React.ReactElement} Protected route or redirect to login
 *
 * @remarks
 * - Uses Redux to check authentication state
 * - Preserves navigation state for return after login
 * - Replaces history entry to prevent back button issues
 *
 * @example
 * <ProtectedRoute>
 *   <HomePage />
 * </ProtectedRoute>
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }): React.ReactElement => {
  /**
   * Get authentication state from Redux
   */
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  /**
   * Redirect to login if not authenticated
   */
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  /**
   * Render protected content
   */
  return <>{children}</>;
};

export default ProtectedRoute;
