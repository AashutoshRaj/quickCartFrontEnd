/**
 * Staff Protected Route Component
 * Route wrapper that ensures only authenticated staff (Security Guard / Employee)
 * can access staff-only pages. Fully separate from the customer ProtectedRoute —
 * checks `state.staffAuth`, not `state.auth`.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState, ProtectedRouteProps } from '../types/index';
import { PATHS } from '../app/paths';

interface StaffProtectedRouteProps extends ProtectedRouteProps {
  /** Restrict to specific actor types. Defaults to Security Guards only. */
  allowedActorTypes?: Array<'guard' | 'employee'>;
}

const StaffProtectedRoute: React.FC<StaffProtectedRouteProps> = ({
  children,
  allowedActorTypes = ['guard'],
}): React.ReactElement => {
  const { isStaffAuthenticated, staffUser } = useSelector((state: RootState) => state.staffAuth);
  const location = useLocation();

  if (!isStaffAuthenticated) {
    return (
      <Navigate
        to={PATHS.LOGIN}
        state={{ from: location }}
        replace
      />
    );
  }

  if (staffUser && !allowedActorTypes.includes(staffUser.actorType)) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  return <>{children}</>;
};

export default StaffProtectedRoute;
