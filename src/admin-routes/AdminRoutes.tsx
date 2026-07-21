import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AdminLayout } from '../components/admin-layouts/AdminLayout';
import { AuthLayout } from '../components/admin-layouts/AuthLayout';
import { ADMIN_BASE_PATH, ADMIN_PATHS, AUTH_BASE_PATH, AUTH_PATHS, adminNavigation, flatAdminRoutes } from './RouteConstants';
import { NotFoundPage } from '../pages/admin/NotFoundPage';
import { LoginPage } from '../pages/admin/auth/LoginPage';
import { SignupPage } from '../pages/admin/auth/SignupPage';
import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';

export const adminRouter = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={AUTH_PATHS.login} replace />,
  },
  {
    path: '/login',
    element: <Navigate to={AUTH_PATHS.login} replace />,
  },
  {
    path: '/signup',
    element: <Navigate to={AUTH_PATHS.signup} replace />,
  },
  {
    path: AUTH_BASE_PATH,
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            index: true,
            element: <Navigate to={AUTH_PATHS.signup} replace />,
          },
          {
            path: 'signup',
            element: <SignupPage />,
          },
          {
            path: 'login',
            element: <LoginPage />,
          },
        ],
      },
    ],
  },
  {
    path: ADMIN_BASE_PATH,
    element: <PrivateRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Navigate to={ADMIN_PATHS.dashboard} replace />,
          },
          ...flatAdminRoutes.map(route => {
            const section = adminNavigation.find(item => (
              item.path === route.path || item.children?.some(child => child.path === route.path)
            ));

            return {
              path: route.path.replace(`${ADMIN_BASE_PATH}/`, ''),
              element: route.element,
              handle: {
                crumb: route.label,
                navPath: route.path,
                section: section?.label,
                sectionPath: section?.path,
              },
            };
          }),
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
