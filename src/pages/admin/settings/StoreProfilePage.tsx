/**
 * Store Profile Page - Admin
 * Displays store information, QR code, and settings
 */

import React, { useState } from 'react';
import { ArrowLeft, Edit2, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { StoreQRCode } from '../../../components/StoreQRCode';

interface StoreData {
  _id: string;
  name: string;
  address: string;
  phoneNumber: string;
  currency: string;
  timezone: string;
  status: 'active' | 'inactive' | 'closed';
  logo?: string | null;
  qrCode?: string | null;
}

export function StoreProfilePage(): React.ReactElement {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Mock store data - in real app, fetch from backend/context
  const [store, setStore] = useState<StoreData>({
    _id: '507f1f77bcf86cd799439011',
    name: 'QuickCart Flagship Store',
    address: '1420 Main Street, San Francisco, CA 94102',
    phoneNumber: '+1 555-0100',
    currency: 'USD',
    timezone: 'America/Los_Angeles',
    status: 'active',
    logo: null,
    qrCode: null,
  });

  const [formData, setFormData] = useState<StoreData>(store);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (): Promise<void> => {
    setIsSaving(true);
    try {
      // TODO: Call backend API to save store profile
      // await updateStore(formData);
      setStore(formData);
      setIsEditing(false);
      toast.success('Store profile updated');
    } catch (error) {
      toast.error('Failed to update store profile');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = (): void => {
    setFormData(store);
    setIsEditing(false);
  };

  const handleRegenerate = async (): Promise<void> => {
    try {
      // TODO: Call backend API to regenerate QR code
      // const response = await regenerateQRCode(store._id);
      // setStore(prev => ({ ...prev, qrCode: response.qrCode }));
      toast.success('QR Code regenerated');
    } catch (error) {
      toast.error('Failed to regenerate QR Code');
      console.error('Regenerate error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Store Profile</h1>
              <p className="text-sm text-gray-600 mt-0.5">Manage your store information and settings</p>
            </div>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
                >
                  <X size={18} />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2"
                >
                  <Save size={18} />
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Edit2 size={18} />
                Edit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Store Information - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Store Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Store Information</h2>

              <div className="space-y-5">
                {/* Store Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 disabled:bg-gray-50 disabled:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 disabled:bg-gray-50 disabled:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 disabled:bg-gray-50 disabled:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Currency & Timezone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 disabled:bg-gray-50 disabled:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>USD</option>
                      <option>EUR</option>
                      <option>GBP</option>
                      <option>INR</option>
                      <option>JPY</option>
                      <option>AUD</option>
                      <option>CAD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <input
                      type="text"
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="e.g., America/Los_Angeles"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 disabled:bg-gray-50 disabled:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 disabled:bg-gray-50 disabled:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code - Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-28">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Store QR Code</h2>

              <StoreQRCode
                storeId={store._id}
                storeName={store.name}
                qrCodeDataURL={store.qrCode ?? undefined}
                onRegenerate={handleRegenerate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoreProfilePage;
