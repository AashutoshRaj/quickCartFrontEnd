/**
 * Centralized Route Paths Configuration
 * All navigation routes defined in one place for consistency and maintainability
 */

export const PATHS = {
  // Auth Routes
  LOGIN: '/login',
  SIGNUP: '/signup',
  ONBOARDING: '/onboarding',

  // Staff App Routes
  STAFF_LOGIN: '/staff-login',
  STAFF_HOME: '/staff-home',
  STAFF_SCAN: '/staff-scan',
  STAFF_VERIFY: '/staff-verify/:sessionId',
  STAFF_PROFILE: '/staff-profile',

  // Customer App Routes
  HOME: '/',
  SCAN_STORE: '/scan-store',
  SCANNER: '/scanner',
  CART: '/cart',
  PROFILE: '/profile',
  HISTORY: '/history',
  ORDER_DETAILS: '/history/:orderId',
  EXIT_GATE: '/exit-gate',

  // Payment Routes
  PAYMENT_SUCCESS: '/payment-success',
  PAYMENT_CANCEL: '/payment-cancel',

  // Test/Debug Routes
  QR_TEST: '/qr-test',

  // Admin Routes
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_SIGNUP: '/admin/signup',

  // Admin Inventory Routes
  ADMIN_PRODUCTS: '/admin/inventory/products',
  ADMIN_CATEGORIES: '/admin/inventory/categories',
  ADMIN_BARCODE_SCANNER: '/admin/inventory/barcode-scanner',
  ADMIN_BULK_IMPORT: '/admin/inventory/bulk-import',
  ADMIN_STOCK_MANAGEMENT: '/admin/inventory/stock-management',

  // Admin Orders Routes
  ADMIN_ACTIVE_ORDERS: '/admin/orders/active',
  ADMIN_COMPLETED_ORDERS: '/admin/orders/completed',
  ADMIN_REFUNDS: '/admin/orders/refunds',

  // Admin Customers Routes
  ADMIN_CUSTOMER_DATABASE: '/admin/customers/database',
  ADMIN_LOYALTY_PROGRAM: '/admin/customers/loyalty-program',
  ADMIN_PURCHASE_HISTORY: '/admin/customers/purchase-history',

  // Admin Analytics Routes
  ADMIN_REVENUE: '/admin/analytics/revenue',
  ADMIN_SALES_REPORTS: '/admin/analytics/sales-reports',
  ADMIN_PRODUCT_PERFORMANCE: '/admin/analytics/product-performance',
  ADMIN_CUSTOMER_INSIGHTS: '/admin/analytics/customer-insights',

  // Admin Promotions Routes
  ADMIN_COUPONS: '/admin/promotions/coupons',
  ADMIN_DISCOUNTS: '/admin/promotions/discounts',
  ADMIN_CAMPAIGNS: '/admin/promotions/campaigns',

  // Admin Staff Routes
  ADMIN_EMPLOYEES: '/admin/staff/employees',
  ADMIN_ROLES_PERMISSIONS: '/admin/staff/roles-permissions',

  // Admin Notifications Routes
  ADMIN_SMS_CAMPAIGNS: '/admin/notifications/sms',
  ADMIN_PUSH_NOTIFICATIONS: '/admin/notifications/push',

  // Admin Store Settings Routes
  ADMIN_STORE_PROFILE: '/admin/store/profile',
  ADMIN_STORE_QR: '/admin/store/qr-code',

  // Catch All
  NOT_FOUND: '*',
} as const;

/**
 * Type-safe route paths
 */
export type RoutePath = typeof PATHS[keyof typeof PATHS];

/**
 * Helper function to generate dynamic routes with parameters
 */
export const getOrderDetailsPath = (orderId: string): string =>
  PATHS.ORDER_DETAILS.replace(':orderId', orderId);

export const getStaffVerifyPath = (sessionId: string): string =>
  PATHS.STAFF_VERIFY.replace(':sessionId', encodeURIComponent(sessionId));
