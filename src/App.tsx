import React, { useState, useEffect, type ReactElement } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Store & API
import { store } from './store/store.ts';
import queryClient from './api/queryClient.ts';
import { setupInterceptors } from './api/interceptors.ts';

// Routing
import { PATHS } from './app/paths';

// Hooks
import { useInitializeAuth } from './hooks/useInitializeAuth.ts';
import { useInitializeStaffAuth } from './hooks/useInitializeStaffAuth.ts';

// Components
import ProtectedRoute from './components/ProtectedRoute.tsx'
import StaffProtectedRoute from './components/StaffProtectedRoute.tsx'

// Pages
import Home from './pages/Home.tsx'
import Cart from './pages/Cart.tsx'
import Scanner from './pages/Scanner.tsx'
import ScanStore from './pages/ScanStore.tsx'
import Onboarding from './pages/Onboarding.tsx'
import Login from './pages/Login.tsx'
import Profile from './pages/Profile.tsx'
import History from './pages/History.tsx'
import OrderDetails from './pages/OrderDetails.tsx'
import PaymentSuccess from './pages/PaymentSuccess.tsx'
import PaymentCancel from './pages/PaymentCancel.tsx'
import ExitGate from './pages/ExitGate.tsx'
import QRTest from './pages/QRTest.tsx'
import StaffLogin from './pages/StaffLogin.tsx'
import StaffHome from './pages/StaffHome.tsx'
import StaffScanner from './pages/StaffScanner.tsx'
import StaffVerifyResult from './pages/StaffVerifyResult.tsx'
import StaffProfile from './pages/StaffProfile.tsx'
import AdminApp from './AdminApp.tsx'

// Initialize Interceptors
setupInterceptors();

/**
 * App Content Component
 * Handles route rendering and splash screen
 */
function AppContent(): ReactElement {
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize Firebase authentication state on app load
  useInitializeAuth();
  // Initialize staff (Security Guard / Employee) authentication state on app load
  useInitializeStaffAuth();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const location = useLocation();
  const pageQR = [
    PATHS.SCANNER,
    PATHS.SCAN_STORE,
    PATHS.CART,
    PATHS.HISTORY,
    PATHS.PROFILE,
    PATHS.LOGIN,
    PATHS.STAFF_LOGIN,
    PATHS.STAFF_HOME,
    PATHS.STAFF_SCAN,
    PATHS.STAFF_PROFILE,
  ].some((path) => path === location.pathname) ||
    location.pathname.match(/^\/history\/[^\/]+$/) !== null ||
    location.pathname.match(/^\/staff-verify\/[^\/]+$/) !== null;

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div
      className={isAdminRoute ? '' : `max-w-md mx-auto bg-background shadow-2xl h-dvh overflow-auto relative flex flex-col ${
        pageQR ? "pt-0" : "pt-[50px]"
      }`}
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-50 bg-primary flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-white p-6 rounded-[2.5rem] shadow-2xl"
            >
              <ShoppingBag size={64} className="text-primary" strokeWidth={2.5} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <h1 className="text-white font-poppins font-bold text-4xl tracking-tighter">QuickCart</h1>
              <p className="text-white/80 font-inter text-sm font-semibold mt-2">Skip the Queue, Shop Smart</p>
            </motion.div>

            <div className="absolute bottom-12 flex gap-1">
              {[0, 1, 2].map((i: number) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  className="w-1.5 h-1.5 bg-white rounded-full"
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col"
          >
            <Routes>
              <Route path={PATHS.HOME} element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path={PATHS.CART} element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path={PATHS.SCANNER} element={<ProtectedRoute><Scanner /></ProtectedRoute>} />
              <Route path={PATHS.SCAN_STORE} element={<ProtectedRoute><ScanStore /></ProtectedRoute>} />
              <Route path={PATHS.EXIT_GATE} element={<ExitGate />} />
              <Route path={PATHS.ONBOARDING} element={<Onboarding />} />
              <Route path={PATHS.LOGIN} element={<Login />} />
              <Route path={PATHS.STAFF_LOGIN} element={<StaffLogin />} />
              <Route path={PATHS.STAFF_HOME} element={<StaffProtectedRoute><StaffHome /></StaffProtectedRoute>} />
              <Route path={PATHS.STAFF_SCAN} element={<StaffProtectedRoute><StaffScanner /></StaffProtectedRoute>} />
              <Route path={PATHS.STAFF_VERIFY} element={<StaffProtectedRoute><StaffVerifyResult /></StaffProtectedRoute>} />
              <Route path={PATHS.STAFF_PROFILE} element={<StaffProtectedRoute><StaffProfile /></StaffProtectedRoute>} />
              <Route path={PATHS.PROFILE} element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path={PATHS.HISTORY} element={<ProtectedRoute><History /></ProtectedRoute>} />
              <Route path={PATHS.ORDER_DETAILS} element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
              <Route path={PATHS.PAYMENT_SUCCESS} element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
              <Route path={PATHS.PAYMENT_CANCEL} element={<ProtectedRoute><PaymentCancel /></ProtectedRoute>} />
              <Route path={PATHS.QR_TEST} element={<QRTest />} />
              <Route path="/admin/*" element={<AdminApp />} />
              <Route path={PATHS.NOT_FOUND} element={<Navigate to={PATHS.ONBOARDING} replace />} />
            </Routes>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Root App component
 * Provides Redux store, React Query, and Router context
 */
function App(): ReactElement {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AppContent />
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  )
}

export default App
