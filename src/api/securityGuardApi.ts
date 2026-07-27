/**
 * Security Guard API Service
 * Handles all Security Guard management API calls for the admin panel
 */

import apiClient from '../admin-auth/api';

export interface SecurityGuardPermissions {
  login: boolean;
  scanExitQr: boolean;
  viewOrderDetails: boolean;
  verifyExit: boolean;
  viewVerificationHistory: boolean;
  reportIssues: boolean;
}

export interface SecurityGuard {
  _id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  photo?: string | null;
  mobileNumber: string;
  email: string;
  storeId: string;
  shift: 'Morning' | 'Afternoon' | 'Night';
  joiningDate: string;
  employeeCode?: string;
  status: 'active' | 'inactive';
  permissions: SecurityGuardPermissions;
  todayVerifications: number;
  weekVerifications: number;
  monthVerifications: number;
  totalOrdersVerified: number;
  reportedIssuesCount: number;
  lastLogin?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SecurityGuardStats {
  totalGuards: number;
  activeGuards: number;
  guardsOnShift: number;
  todayVerifications: number;
  reportedIssues: number;
}

export interface CreateSecurityGuardPayload {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  shift: 'Morning' | 'Afternoon' | 'Night';
  joiningDate?: string;
  employeeCode?: string;
  photo?: string | null;
  status?: 'active' | 'inactive';
}

export interface SecurityGuardListFilters {
  search?: string;
  shift?: string;
  status?: string;
  sort?: 'newest' | 'mostActive' | 'employeeId';
  page?: number;
  limit?: number;
}

/**
 * List security guards for the admin's store, with search/filter/sort
 */
export const getSecurityGuards = async (
  filters: SecurityGuardListFilters = {}
): Promise<{ guards: SecurityGuard[]; results: number }> => {
  try {
    const response = await apiClient.get('/security-guards', { params: filters });
    return { guards: response.data.data.guards, results: response.data.results };
  } catch (error) {
    console.error('Error fetching security guards:', error);
    throw error;
  }
};

/**
 * Fetch dashboard summary stats for security guards
 */
export const getSecurityGuardStats = async (): Promise<SecurityGuardStats> => {
  try {
    const response = await apiClient.get('/security-guards/stats');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching security guard stats:', error);
    throw error;
  }
};

/**
 * Fetch a single security guard by ID
 */
export const getSecurityGuard = async (id: string): Promise<SecurityGuard> => {
  try {
    const response = await apiClient.get(`/security-guards/${id}`);
    return response.data.data.guard;
  } catch (error) {
    console.error('Error fetching security guard:', error);
    throw error;
  }
};

/**
 * Create a new security guard account; returns the guard plus a
 * one-time plaintext temporary password to share with them
 */
export const createSecurityGuard = async (
  payload: CreateSecurityGuardPayload
): Promise<{ guard: SecurityGuard; tempPassword: string }> => {
  try {
    const response = await apiClient.post('/security-guards', payload);
    return response.data.data;
  } catch (error) {
    console.error('Error creating security guard:', error);
    throw error;
  }
};

/**
 * Update an existing security guard's profile fields
 */
export const updateSecurityGuard = async (
  id: string,
  payload: Partial<CreateSecurityGuardPayload>
): Promise<SecurityGuard> => {
  try {
    const response = await apiClient.patch(`/security-guards/${id}`, payload);
    return response.data.data.guard;
  } catch (error) {
    console.error('Error updating security guard:', error);
    throw error;
  }
};

/**
 * Toggle a security guard's account status between active and inactive
 */
export const toggleSecurityGuardStatus = async (id: string): Promise<SecurityGuard> => {
  try {
    const response = await apiClient.patch(`/security-guards/${id}/status`);
    return response.data.data.guard;
  } catch (error) {
    console.error('Error toggling security guard status:', error);
    throw error;
  }
};

/**
 * Reset a security guard's password; returns the new one-time plaintext password
 */
export const resetSecurityGuardPassword = async (id: string): Promise<{ tempPassword: string }> => {
  try {
    const response = await apiClient.patch(`/security-guards/${id}/reset-password`);
    return response.data.data;
  } catch (error) {
    console.error('Error resetting security guard password:', error);
    throw error;
  }
};

/**
 * Permanently delete a security guard account
 */
export const deleteSecurityGuard = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/security-guards/${id}`);
  } catch (error) {
    console.error('Error deleting security guard:', error);
    throw error;
  }
};

/**
 * Send a security guard's credentials via email or SMS
 */
export const sendSecurityGuardCredentials = async (
  id: string,
  method: 'email' | 'sms',
  tempPassword: string
): Promise<void> => {
  try {
    await apiClient.post(`/security-guards/${id}/send-credentials`, { method, tempPassword });
  } catch (error) {
    console.error(`Error sending security guard credentials via ${method}:`, error);
    throw error;
  }
};
