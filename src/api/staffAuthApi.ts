/**
 * Staff Auth API Service
 * Login for Security Guards / Employees via the mobile app's staff entry point
 */

import apiClient from './staffApiClient';
import type { StaffUser } from '../types/index';

export interface StaffLoginResponse {
  status: string;
  token: string;
  data: StaffUser;
}

/**
 * Log in as a Security Guard or Employee using email/Employee ID + password
 */
export const staffLogin = async (identifier: string, password: string): Promise<StaffLoginResponse> => {
  const response = await apiClient.post('/staff/auth/login', { identifier, password });
  return response.data;
};
