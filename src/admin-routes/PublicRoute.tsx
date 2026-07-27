import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../admin-auth/AuthContext';
import { ADMIN_PATHS } from './RouteConstants';

export function PublicRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ADMIN_PATHS.dashboard} replace />;
  }

  return <Outlet />;
}
