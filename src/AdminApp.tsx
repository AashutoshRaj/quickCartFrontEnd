import React, { ReactElement } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import { AuthProvider } from './admin-auth/AuthContext';

// Admin Layout & Auth
import { AdminLayout } from './components/admin-layouts/AdminLayout';
import { AuthLayout } from './components/admin-layouts/AuthLayout';

// Auth Pages
import { LoginPage } from './pages/admin/auth/LoginPage';
import { SignupPage } from './pages/admin/auth/SignupPage';

// Admin Pages (re-exported from components)
import { DashboardPage } from './pages/admin/dashboard/DashboardPage';
import { ProductsPage } from './pages/admin/inventory/ProductsPage';
import { CategoriesPage } from './pages/admin/inventory/CategoriesPage';
import { BarcodeScannerPage } from './pages/admin/inventory/BarcodeScannerPage';
import { BulkImportPage } from './pages/admin/inventory/BulkImportPage';
import { StockManagementPage } from './pages/admin/inventory/StockManagementPage';
import { ActiveOrdersPage } from './pages/admin/orders/ActiveOrdersPage';
import { CompletedOrdersPage } from './pages/admin/orders/CompletedOrdersPage';
import { RefundsPage } from './pages/admin/orders/RefundsPage';
import { CustomerDatabasePage } from './pages/admin/customers/CustomerDatabasePage';
import { LoyaltyProgramPage } from './pages/admin/customers/LoyaltyProgramPage';
import { PurchaseHistoryPage } from './pages/admin/customers/PurchaseHistoryPage';
import { RevenueAnalyticsPage } from './pages/admin/analytics/RevenueAnalyticsPage';
import { SalesReportsPage } from './pages/admin/analytics/SalesReportsPage';
import { ProductPerformancePage } from './pages/admin/analytics/ProductPerformancePage';
import { CustomerInsightsPage } from './pages/admin/analytics/CustomerInsightsPage';
import { CouponsPage } from './pages/admin/promotions/CouponsPage';
import { DiscountsPage } from './pages/admin/promotions/DiscountsPage';
import { CampaignsPage } from './pages/admin/promotions/CampaignsPage';
import { EmployeesPage } from './pages/admin/staff/EmployeesPage';
import { RolesPermissionsPage } from './pages/admin/staff/RolesPermissionsPage';
import { SmsCampaignsPage } from './pages/admin/notifications/SmsCampaignsPage';
import { PushNotificationsPage } from './pages/admin/notifications/PushNotificationsPage';
import { EmailCampaignsPage } from './pages/admin/notifications/EmailCampaignsPage';
import { StoreSettingsPage } from './pages/admin/settings/StoreSettingsPage';
import { PaymentMethodsPage } from './pages/admin/settings/PaymentMethodsPage';
import { IntegrationsPage } from './pages/admin/settings/IntegrationsPage';
import { SecurityPage } from './pages/admin/settings/SecurityPage';
import { ExitGatePage } from './pages/admin/operations/ExitGatePage';
import { LiveMonitorPage } from './pages/admin/operations/LiveMonitorPage';
import { NotFoundPage } from './pages/admin/NotFoundPage';

/**
 * Admin Application Router
 * Handles all admin dashboard routes with authentication
 */
const AdminApp = (): ReactElement => {
  return (
    <AuthProvider>
      <Routes>
        {/* Root redirects */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Auth Routes - No protection */}
        <Route path="login" element={<AuthLayout><LoginPage /></AuthLayout>} />
        <Route path="signup" element={<AuthLayout><SignupPage /></AuthLayout>} />
        <Route path="auth/login" element={<Navigate to="/admin/login" replace />} />
        <Route path="auth/signup" element={<Navigate to="/admin/signup" replace />} />

        {/* Admin Dashboard Routes - Protected */}
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Inventory */}
          <Route path="inventory/products" element={<ProductsPage />} />
          <Route path="inventory/categories" element={<CategoriesPage />} />
          <Route path="inventory/barcode-scanner" element={<BarcodeScannerPage />} />
          <Route path="inventory/bulk-import" element={<BulkImportPage />} />
          <Route path="inventory/stock-management" element={<StockManagementPage />} />

          {/* Orders */}
          <Route path="orders/active" element={<ActiveOrdersPage />} />
          <Route path="orders/completed" element={<CompletedOrdersPage />} />
          <Route path="orders/refunds" element={<RefundsPage />} />

          {/* Customers */}
          <Route path="customers/database" element={<CustomerDatabasePage />} />
          <Route path="customers/loyalty-program" element={<LoyaltyProgramPage />} />
          <Route path="customers/purchase-history" element={<PurchaseHistoryPage />} />

          {/* Analytics */}
          <Route path="analytics/revenue" element={<RevenueAnalyticsPage />} />
          <Route path="analytics/sales-reports" element={<SalesReportsPage />} />
          <Route path="analytics/product-performance" element={<ProductPerformancePage />} />
          <Route path="analytics/customer-insights" element={<CustomerInsightsPage />} />

          {/* Promotions */}
          <Route path="promotions/coupons" element={<CouponsPage />} />
          <Route path="promotions/discounts" element={<DiscountsPage />} />
          <Route path="promotions/campaigns" element={<CampaignsPage />} />

          {/* Staff */}
          <Route path="staff/employees" element={<EmployeesPage />} />
          <Route path="staff/roles-permissions" element={<RolesPermissionsPage />} />

          {/* Notifications */}
          <Route path="notifications/sms" element={<SmsCampaignsPage />} />
          <Route path="notifications/push" element={<PushNotificationsPage />} />
          <Route path="notifications/email" element={<EmailCampaignsPage />} />

          {/* Settings */}
          <Route path="settings/store" element={<StoreSettingsPage />} />
          <Route path="settings/payments" element={<PaymentMethodsPage />} />
          <Route path="settings/integrations" element={<IntegrationsPage />} />
          <Route path="settings/security" element={<SecurityPage />} />

          {/* Operations */}
          <Route path="exit-gate" element={<ExitGatePage />} />
          <Route path="live-monitor" element={<LiveMonitorPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
};

export default AdminApp;
