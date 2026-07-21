import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../../admin-auth/AuthContext';
import { adminRouter } from '../../admin-routes/AdminRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

// Debug: list QueryClient prototype keys to diagnose runtime errors
if (typeof window !== 'undefined') {
  // eslint-disable-next-line no-console
  console.log('QueryClient prototype methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(queryClient)));
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={adminRouter} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
