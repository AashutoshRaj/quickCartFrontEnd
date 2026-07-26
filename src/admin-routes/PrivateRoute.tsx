import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../admin-auth/AuthContext';
import { AUTH_PATHS } from './RouteConstants';

export function PrivateRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 text-[#6f806f]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600"></div>
          <span className="text-xl font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Verifying Admin Session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={AUTH_PATHS.login} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
