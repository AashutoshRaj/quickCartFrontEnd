/**
 * Staff Verification API Service
 * Security Dashboard, exit-QR scan verification and exit approval
 */

import apiClient from './staffApiClient';

export interface StaffDashboardStats {
  guardName: string;
  storeName: string;
  shift: string | null;
  status: string;
  todayVerifications: number;
  totalOrdersVerified: number;
  reportedIssuesCount: number;
  recentActivity: {
    orderNumber: string;
    customerName: string;
    totalAmount: number;
    verifiedAt: string;
  }[];
}

export interface VerifyItem {
  name: string;
  quantity: number;
  price: number;
  image: string | null;
  barcode: string | null;
}

export type VerifyResult =
  | { result: 'invalid' }
  | { result: 'payment_failed'; orderNumber: string }
  | { result: 'already_verified'; orderNumber: string; verifiedAt: string; verifiedBy: string }
  | {
      result: 'success';
      sessionId: string;
      orderNumber: string;
      customerName: string;
      storeName: string;
      paymentStatus: string;
      paidAt: string | null;
      totalAmount: number;
      itemsCount: number;
      items: VerifyItem[];
    };

/**
 * Fetch the Security Dashboard summary + recent activity
 */
export const getStaffDashboardStats = async (): Promise<StaffDashboardStats> => {
  const response = await apiClient.get('/staff/dashboard/stats');
  return response.data.data;
};

/**
 * Scan-check a QR payload against the guard's assigned store — read-only
 */
export const verifyExitQr = async (qrPayload: string): Promise<VerifyResult> => {
  const response = await apiClient.post('/staff/verify', { qrPayload });
  return response.data.data;
};

/**
 * Approve exit for a verified order
 */
export const approveExit = async (
  sessionId: string
): Promise<{ result: 'approved'; orderNumber: string; verifiedAt: string }> => {
  const response = await apiClient.post(`/staff/verify/${encodeURIComponent(sessionId)}/approve`);
  return response.data.data;
};
