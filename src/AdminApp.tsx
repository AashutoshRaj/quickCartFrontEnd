import React, { Suspense, lazy, type ReactElement } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { PrivateRoute } from './admin-routes/PrivateRoute';
import { AuthProvider } from './admin-auth/AuthContext';

// Admin Layout & Auth (eager: needed on the very first admin visit)
import { AdminLayout } from './components/admin-layouts/AdminLayout';
import { AuthLayout } from './components/admin-layouts/AuthLayout';
import { LoginPage } from './pages/admin/auth/LoginPage';
import { SignupPage } from './pages/admin/auth/SignupPage';
import { NotFoundPage } from './pages/admin/NotFoundPage';

/**
 * Admin dashboard pages (lazy-loaded: each is a named export, fetched only
 * when its route is visited — a store owner rarely touches all 30 sections
 * in one session)
 */
const DashboardPage = lazy(() => import('./pages/admin/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const ProductsPage = lazy(() => import('./pages/admin/inventory/ProductsPage').then(m => ({ default: m.ProductsPage })));
const CategoriesPage = lazy(() => import('./pages/admin/inventory/CategoriesPage').then(m => ({ default: m.CategoriesPage })));
const BarcodeScannerPage = lazy(() => import('./pages/admin/inventory/BarcodeScannerPage').then(m => ({ default: m.BarcodeScannerPage })));
const BulkImportPage = lazy(() => import('./pages/admin/inventory/BulkImportPage').then(m => ({ default: m.BulkImportPage })));
const StockManagementPage = lazy(() => import('./pages/admin/inventory/StockManagementPage').then(m => ({ default: m.StockManagementPage })));
const ActiveOrdersPage = lazy(() => import('./pages/admin/orders/ActiveOrdersPage').then(m => ({ default: m.ActiveOrdersPage })));
const CompletedOrdersPage = lazy(() => import('./pages/admin/orders/CompletedOrdersPage').then(m => ({ default: m.CompletedOrdersPage })));
const RefundsPage = lazy(() => import('./pages/admin/orders/RefundsPage').then(m => ({ default: m.RefundsPage })));
const CustomerDatabasePage = lazy(() => import('./pages/admin/customers/CustomerDatabasePage').then(m => ({ default: m.CustomerDatabasePage })));
const LoyaltyProgramPage = lazy(() => import('./pages/admin/customers/LoyaltyProgramPage').then(m => ({ default: m.LoyaltyProgramPage })));
const PurchaseHistoryPage = lazy(() => import('./pages/admin/customers/PurchaseHistoryPage').then(m => ({ default: m.PurchaseHistoryPage })));
const RevenueAnalyticsPage = lazy(() => import('./pages/admin/analytics/RevenueAnalyticsPage').then(m => ({ default: m.RevenueAnalyticsPage })));
const SalesReportsPage = lazy(() => import('./pages/admin/analytics/SalesReportsPage').then(m => ({ default: m.SalesReportsPage })));
const ProductPerformancePage = lazy(() => import('./pages/admin/analytics/ProductPerformancePage').then(m => ({ default: m.ProductPerformancePage })));
const CustomerInsightsPage = lazy(() => import('./pages/admin/analytics/CustomerInsightsPage').then(m => ({ default: m.CustomerInsightsPage })));
const CouponsPage = lazy(() => import('./pages/admin/promotions/CouponsPage').then(m => ({ default: m.CouponsPage })));
const DiscountsPage = lazy(() => import('./pages/admin/promotions/DiscountsPage').then(m => ({ default: m.DiscountsPage })));
const CampaignsPage = lazy(() => import('./pages/admin/promotions/CampaignsPage').then(m => ({ default: m.CampaignsPage })));
const EmployeesPage = lazy(() => import('./pages/admin/staff/EmployeesPage').then(m => ({ default: m.EmployeesPage })));
const SecurityGuardsPage = lazy(() => import('./pages/admin/staff/SecurityGuardsPage').then(m => ({ default: m.SecurityGuardsPage })));
const RolesPermissionsPage = lazy(() => import('./pages/admin/staff/RolesPermissionsPage').then(m => ({ default: m.RolesPermissionsPage })));
const SmsCampaignsPage = lazy(() => import('./pages/admin/notifications/SmsCampaignsPage').then(m => ({ default: m.SmsCampaignsPage })));
const PushNotificationsPage = lazy(() => import('./pages/admin/notifications/PushNotificationsPage').then(m => ({ default: m.PushNotificationsPage })));
const EmailCampaignsPage = lazy(() => import('./pages/admin/notifications/EmailCampaignsPage').then(m => ({ default: m.EmailCampaignsPage })));
const StoreProfilePage = lazy(() => import('./pages/admin/settings/StoreProfilePage').then(m => ({ default: m.StoreProfilePage })));
const StoreSettingsPage = lazy(() => import('./pages/admin/settings/StoreSettingsPage').then(m => ({ default: m.StoreSettingsPage })));
const PaymentMethodsPage = lazy(() => import('./pages/admin/settings/PaymentMethodsPage').then(m => ({ default: m.PaymentMethodsPage })));
const IntegrationsPage = lazy(() => import('./pages/admin/settings/IntegrationsPage').then(m => ({ default: m.IntegrationsPage })));
const SecurityPage = lazy(() => import('./pages/admin/settings/SecurityPage').then(m => ({ default: m.SecurityPage })));
const ExitGatePage = lazy(() => import('./pages/admin/operations/ExitGatePage').then(m => ({ default: m.ExitGatePage })));
const LiveMonitorPage = lazy(() => import('./pages/admin/operations/LiveMonitorPage').then(m => ({ default: m.LiveMonitorPage })));

/**
 * Admin Route Fallback
 * Shown while a lazy-loaded admin section chunk is being fetched
 */
function AdminRouteFallback(): ReactElement {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="w-10 h-10 rounded-full border-[3px] border-primary/20 border-t-primary animate-spin" />
    </div>
  );
}

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
        <Route element={<PrivateRoute />}>
          <Route element={<AdminLayout />}>
            {/* Suspense boundary shared by every lazy-loaded admin section below */}
            <Route element={<Suspense fallback={<AdminRouteFallback />}><Outlet /></Suspense>}>
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
              <Route path="staff/security-guards" element={<SecurityGuardsPage />} />
              <Route path="staff/roles-permissions" element={<RolesPermissionsPage />} />

              {/* Notifications */}
              <Route path="notifications/sms" element={<SmsCampaignsPage />} />
              <Route path="notifications/push" element={<PushNotificationsPage />} />
              <Route path="notifications/email" element={<EmailCampaignsPage />} />

              {/* Settings */}
              <Route path="settings/store-profile" element={<StoreProfilePage />} />
              <Route path="settings/store" element={<StoreSettingsPage />} />
              <Route path="settings/payments" element={<PaymentMethodsPage />} />
              <Route path="settings/integrations" element={<IntegrationsPage />} />
              <Route path="settings/security" element={<SecurityPage />} />

              {/* Operations */}
              <Route path="exit-gate" element={<ExitGatePage />} />
              <Route path="live-monitor" element={<LiveMonitorPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
};

export default AdminApp;
