import type { ElementType, ReactNode } from 'react';
import {
  LayoutDashboard, Radio, ShoppingCart, Package, Users, BarChart3, Tag,
  UserCog, DoorOpen, Bell, Settings, List, Grid3X3, Scan, Upload, Warehouse,
  CheckCircle, RefreshCcw, Star, History, TrendingUp, FileText, Target,
  Ticket, Percent, Megaphone, UserSquare, Shield, MessageSquare, Mail, Store,
  CreditCard, Plug, Lock,
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { DashboardPage } from '../pages/admin/dashboard/DashboardPage';
import { ProductsPage } from '../pages/admin/inventory/ProductsPage';
import { CategoriesPage } from '../pages/admin/inventory/CategoriesPage';
import { BarcodeScannerPage } from '../pages/admin/inventory/BarcodeScannerPage';
import { BulkImportPage } from '../pages/admin/inventory/BulkImportPage';
import { StockManagementPage } from '../pages/admin/inventory/StockManagementPage';
import { ActiveOrdersPage } from '../pages/admin/orders/ActiveOrdersPage';
import { CompletedOrdersPage } from '../pages/admin/orders/CompletedOrdersPage';
import { RefundsPage } from '../pages/admin/orders/RefundsPage';
import { CustomerDatabasePage } from '../pages/admin/customers/CustomerDatabasePage';
import { LoyaltyProgramPage } from '../pages/admin/customers/LoyaltyProgramPage';
import { PurchaseHistoryPage } from '../pages/admin/customers/PurchaseHistoryPage';
import { RevenueAnalyticsPage } from '../pages/admin/analytics/RevenueAnalyticsPage';
import { SalesReportsPage } from '../pages/admin/analytics/SalesReportsPage';
import { ProductPerformancePage } from '../pages/admin/analytics/ProductPerformancePage';
import { CustomerInsightsPage } from '../pages/admin/analytics/CustomerInsightsPage';
import { CouponsPage } from '../pages/admin/promotions/CouponsPage';
import { DiscountsPage } from '../pages/admin/promotions/DiscountsPage';
import { CampaignsPage } from '../pages/admin/promotions/CampaignsPage';
import { EmployeesPage } from '../pages/admin/staff/EmployeesPage';
import { RolesPermissionsPage } from '../pages/admin/staff/RolesPermissionsPage';
import { SmsCampaignsPage } from '../pages/admin/notifications/SmsCampaignsPage';
import { PushNotificationsPage } from '../pages/admin/notifications/PushNotificationsPage';
import { EmailCampaignsPage } from '../pages/admin/notifications/EmailCampaignsPage';
import { StoreSettingsPage } from '../pages/admin/settings/StoreSettingsPage';
import { PaymentMethodsPage } from '../pages/admin/settings/PaymentMethodsPage';
import { IntegrationsPage } from '../pages/admin/settings/IntegrationsPage';
import { SecurityPage } from '../pages/admin/settings/SecurityPage';
import { ExitGatePage } from '../pages/admin/operations/ExitGatePage';
import { LiveMonitorPage } from '../pages/admin/operations/LiveMonitorPage';

export const ADMIN_BASE_PATH = '/admin';
export const AUTH_BASE_PATH = '/auth';

export const AUTH_PATHS = {
  login: `${AUTH_BASE_PATH}/login`,
  signup: `${AUTH_BASE_PATH}/signup`,
} as const;

export const ADMIN_PATHS = {
  dashboard: `${ADMIN_BASE_PATH}/dashboard`,
  inventory: {
    products: `${ADMIN_BASE_PATH}/inventory/products`,
    categories: `${ADMIN_BASE_PATH}/inventory/categories`,
    barcodeScanner: `${ADMIN_BASE_PATH}/inventory/barcode-scanner`,
    bulkImport: `${ADMIN_BASE_PATH}/inventory/bulk-import`,
    stockManagement: `${ADMIN_BASE_PATH}/inventory/stock-management`,
  },
  orders: {
    active: `${ADMIN_BASE_PATH}/orders/active`,
    completed: `${ADMIN_BASE_PATH}/orders/completed`,
    refunds: `${ADMIN_BASE_PATH}/orders/refunds`,
  },
  customers: {
    database: `${ADMIN_BASE_PATH}/customers/database`,
    loyaltyProgram: `${ADMIN_BASE_PATH}/customers/loyalty-program`,
    purchaseHistory: `${ADMIN_BASE_PATH}/customers/purchase-history`,
  },
  analytics: {
    revenue: `${ADMIN_BASE_PATH}/analytics/revenue`,
    salesReports: `${ADMIN_BASE_PATH}/analytics/sales-reports`,
    productPerformance: `${ADMIN_BASE_PATH}/analytics/product-performance`,
    customerInsights: `${ADMIN_BASE_PATH}/analytics/customer-insights`,
  },
  promotions: {
    coupons: `${ADMIN_BASE_PATH}/promotions/coupons`,
    discounts: `${ADMIN_BASE_PATH}/promotions/discounts`,
    campaigns: `${ADMIN_BASE_PATH}/promotions/campaigns`,
  },
  staff: {
    employees: `${ADMIN_BASE_PATH}/staff/employees`,
    rolesPermissions: `${ADMIN_BASE_PATH}/staff/roles-permissions`,
  },
  notifications: {
    sms: `${ADMIN_BASE_PATH}/notifications/sms`,
    push: `${ADMIN_BASE_PATH}/notifications/push`,
    email: `${ADMIN_BASE_PATH}/notifications/email`,
  },
  settings: {
    store: `${ADMIN_BASE_PATH}/settings/store`,
    payments: `${ADMIN_BASE_PATH}/settings/payments`,
    integrations: `${ADMIN_BASE_PATH}/settings/integrations`,
    security: `${ADMIN_BASE_PATH}/settings/security`,
  },
  exitGate: `${ADMIN_BASE_PATH}/exit-gate`,
  liveMonitor: `${ADMIN_BASE_PATH}/live-monitor`,
} as const;

export interface AdminRouteConfig {
  path: string;
  label: string;
  element: ReactNode;
  icon?: ElementType;
  index?: boolean;
  children?: AdminRouteConfig[];
}

export const adminNavigation: AdminRouteConfig[] = [
  {
    path: ADMIN_PATHS.dashboard,
    label: 'Dashboard',
    icon: LayoutDashboard,
    element: <DashboardPage />,
  },
  {
    path: `${ADMIN_BASE_PATH}/inventory`,
    label: 'Inventory',
    icon: Package,
    element: <Navigate to={ADMIN_PATHS.inventory.products} replace />,
    children: [
      { path: ADMIN_PATHS.inventory.products, label: 'Products', icon: List, element: <ProductsPage /> },
      { path: ADMIN_PATHS.inventory.categories, label: 'Categories', icon: Grid3X3, element: <CategoriesPage /> },
      { path: ADMIN_PATHS.inventory.barcodeScanner, label: 'Barcode Scanner', icon: Scan, element: <BarcodeScannerPage /> },
      { path: ADMIN_PATHS.inventory.bulkImport, label: 'Bulk Import', icon: Upload, element: <BulkImportPage /> },
      { path: ADMIN_PATHS.inventory.stockManagement, label: 'Stock Management', icon: Warehouse, element: <StockManagementPage /> },
    ],
  },
  {
    path: `${ADMIN_BASE_PATH}/orders`,
    label: 'Orders',
    icon: ShoppingCart,
    element: <Navigate to={ADMIN_PATHS.orders.active} replace />,
    children: [
      { path: ADMIN_PATHS.orders.active, label: 'Active Orders', icon: Radio, element: <ActiveOrdersPage /> },
      { path: ADMIN_PATHS.orders.completed, label: 'Completed', icon: CheckCircle, element: <CompletedOrdersPage /> },
      { path: ADMIN_PATHS.orders.refunds, label: 'Refunds', icon: RefreshCcw, element: <RefundsPage /> },
    ],
  },
  {
    path: `${ADMIN_BASE_PATH}/customers`,
    label: 'Customers',
    icon: Users,
    element: <Navigate to={ADMIN_PATHS.customers.database} replace />,
    children: [
      { path: ADMIN_PATHS.customers.database, label: 'Database', icon: UserSquare, element: <CustomerDatabasePage /> },
      { path: ADMIN_PATHS.customers.loyaltyProgram, label: 'Loyalty Program', icon: Star, element: <LoyaltyProgramPage /> },
      { path: ADMIN_PATHS.customers.purchaseHistory, label: 'Purchase History', icon: History, element: <PurchaseHistoryPage /> },
    ],
  },
  {
    path: `${ADMIN_BASE_PATH}/analytics`,
    label: 'Analytics',
    icon: BarChart3,
    element: <Navigate to={ADMIN_PATHS.analytics.revenue} replace />,
    children: [
      { path: ADMIN_PATHS.analytics.revenue, label: 'Revenue', icon: TrendingUp, element: <RevenueAnalyticsPage /> },
      { path: ADMIN_PATHS.analytics.salesReports, label: 'Sales Reports', icon: FileText, element: <SalesReportsPage /> },
      { path: ADMIN_PATHS.analytics.productPerformance, label: 'Product Perf.', icon: Target, element: <ProductPerformancePage /> },
      { path: ADMIN_PATHS.analytics.customerInsights, label: 'Customer Insights', icon: Users, element: <CustomerInsightsPage /> },
    ],
  },
  {
    path: `${ADMIN_BASE_PATH}/promotions`,
    label: 'Offers',
    icon: Tag,
    element: <Navigate to={ADMIN_PATHS.promotions.coupons} replace />,
    children: [
      { path: ADMIN_PATHS.promotions.coupons, label: 'Coupons', icon: Ticket, element: <CouponsPage /> },
      { path: ADMIN_PATHS.promotions.discounts, label: 'Discounts', icon: Percent, element: <DiscountsPage /> },
      { path: ADMIN_PATHS.promotions.campaigns, label: 'Campaigns', icon: Megaphone, element: <CampaignsPage /> },
    ],
  },
  {
    path: `${ADMIN_BASE_PATH}/staff`,
    label: 'Staff',
    icon: UserCog,
    element: <Navigate to={ADMIN_PATHS.staff.employees} replace />,
    children: [
      { path: ADMIN_PATHS.staff.employees, label: 'Employees', icon: UserSquare, element: <EmployeesPage /> },
      { path: ADMIN_PATHS.staff.rolesPermissions, label: 'Roles & Permissions', icon: Shield, element: <RolesPermissionsPage /> },
    ],
  },
  {
    path: `${ADMIN_BASE_PATH}/notifications`,
    label: 'Notifications',
    icon: Bell,
    element: <Navigate to={ADMIN_PATHS.notifications.sms} replace />,
    children: [
      { path: ADMIN_PATHS.notifications.sms, label: 'SMS Campaigns', icon: MessageSquare, element: <SmsCampaignsPage /> },
      { path: ADMIN_PATHS.notifications.push, label: 'Push Notifications', icon: Bell, element: <PushNotificationsPage /> },
      { path: ADMIN_PATHS.notifications.email, label: 'Email Campaigns', icon: Mail, element: <EmailCampaignsPage /> },
    ],
  },
  {
    path: `${ADMIN_BASE_PATH}/settings`,
    label: 'Settings',
    icon: Settings,
    element: <Navigate to={ADMIN_PATHS.settings.store} replace />,
    children: [
      { path: ADMIN_PATHS.settings.store, label: 'Store Settings', icon: Store, element: <StoreSettingsPage /> },
      { path: ADMIN_PATHS.settings.payments, label: 'Payment Methods', icon: CreditCard, element: <PaymentMethodsPage /> },
      { path: ADMIN_PATHS.settings.integrations, label: 'Integrations', icon: Plug, element: <IntegrationsPage /> },
      { path: ADMIN_PATHS.settings.security, label: 'Security', icon: Lock, element: <SecurityPage /> },
    ],
  },
  { path: ADMIN_PATHS.exitGate, label: 'Exit Gate', icon: DoorOpen, element: <ExitGatePage /> },
  { path: ADMIN_PATHS.liveMonitor, label: 'Live Monitor', icon: Radio, element: <LiveMonitorPage /> },
];

export const flatAdminRoutes = adminNavigation.flatMap(route => (
  route.children ? [route, ...route.children] : [route]
));
