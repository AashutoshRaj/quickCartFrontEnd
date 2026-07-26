/**
 * Store API Service
 * Handles all store-related API calls for admin panel
 */

import apiClient from '../admin-auth/api';

export interface StoreData {
  _id?: string;
  name: string;
  address: string;
  phoneNumber: string;
  currency: string;
  timezone: string;
  status: 'active' | 'inactive' | 'closed';
  logo?: string | null;
  qrCode?: string | null;
  email?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  description?: string;
}

/**
 * Get admin's store profile
 * Fetches the current authenticated admin's store profile
 */
export const getStoreProfile = async (): Promise<{ store: StoreData }> => {
  try {
    const response = await apiClient.get('/stores/profile');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching store profile:', error);
    throw error;
  }
};

/**
 * Save or update admin's store profile
 * Updates store information in MongoDB
 */
export const updateStoreProfile = async (
  storeData: Partial<StoreData>
): Promise<{ store: StoreData }> => {
  try {
    const response = await apiClient.post('/stores/profile', storeData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating store profile:', error);
    throw error;
  }
};

/**
 * Generate or regenerate QR code for admin's store
 * Creates a new QR code for the store
 */
export const regenerateStoreQRCode = async (): Promise<{ store: StoreData }> => {
  try {
    const response = await apiClient.post('/stores/profile/generate-qr');
    return response.data.data;
  } catch (error) {
    console.error('Error regenerating QR code:', error);
    throw error;
  }
};
