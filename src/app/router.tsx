import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PATHS } from './paths';

// Customer App Pages
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Onboarding from '../pages/Onboarding';
import Home from '../pages/Home';
import ScanStore from '../pages/ScanStore';
import Scanner from '../pages/Scanner';
import Cart from '../pages/Cart';
import Profile from '../pages/Profile';
import History from '../pages/History';
import OrderDetails from '../pages/OrderDetails';
import PaymentSuccess from '../pages/PaymentSuccess';
import PaymentCancel from '../pages/PaymentCancel';
import ExitGate from '../pages/ExitGate';

interface CustomerRouterProps {
  isAuthenticated: boolean;
}

/**
 * Customer App Routes
 * Centralized route configuration for customer-facing pages
 */
export const CustomerRouter: React.FC<CustomerRouterProps> = ({ isAuthenticated }) => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path={PATHS.LOGIN} element={<Login />} />
      <Route path={PATHS.SIGNUP} element={<Signup />} />
      <Route path={PATHS.ONBOARDING} element={<Onboarding />} />

      {/* Protected Routes */}
      {isAuthenticated ? (
        <>
          <Route path={PATHS.HOME} element={<Home />} />
          <Route path={PATHS.SCAN_STORE} element={<ScanStore />} />
          <Route path={PATHS.SCANNER} element={<Scanner />} />
          <Route path={PATHS.CART} element={<Cart />} />
          <Route path={PATHS.PROFILE} element={<Profile />} />
          <Route path={PATHS.HISTORY} element={<History />} />
          <Route path={PATHS.ORDER_DETAILS} element={<OrderDetails />} />
          <Route path={PATHS.PAYMENT_SUCCESS} element={<PaymentSuccess />} />
          <Route path={PATHS.PAYMENT_CANCEL} element={<PaymentCancel />} />
          <Route path={PATHS.EXIT_GATE} element={<ExitGate />} />

          {/* Catch-all redirect to home for authenticated users */}
          <Route path={PATHS.NOT_FOUND} element={<Navigate to={PATHS.HOME} replace />} />
        </>
      ) : (
        <>
          {/* Redirect to login for protected routes when not authenticated */}
          <Route path={PATHS.NOT_FOUND} element={<Navigate to={PATHS.LOGIN} replace />} />
        </>
      )}
    </Routes>
  );
};
