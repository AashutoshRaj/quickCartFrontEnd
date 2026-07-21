/**
 * Store Welcome Component
 * Displayed to customers after scanning store QR code
 * Shows store info and allows proceeding to shopping
 */

import React from 'react';
import { MapPin, DollarSign, Globe, CheckCircle } from 'lucide-react';

interface StoreWelcomeProps {
  storeId: string;
  storeName: string;
  address: string;
  currency: string;
  timezone?: string;
  logo?: string | null;
  onProceed: () => void;
  isLoading?: boolean;
}

export const StoreWelcome: React.FC<StoreWelcomeProps> = ({
  storeId,
  storeName,
  address,
  currency,
  timezone = 'UTC',
  logo,
  onProceed,
  isLoading = false,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary to-primary/90 p-4">
      {/* Success Check Animation */}
      <div className="mb-8 animate-bounce">
        <CheckCircle size={64} className="text-white" strokeWidth={1.5} />
      </div>

      {/* Store Logo */}
      {logo && (
        <div className="mb-6">
          <img
            src={logo}
            alt={storeName}
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
          />
        </div>
      )}

      {/* Welcome Text */}
      <h1 className="text-3xl font-bold text-white text-center mb-2">
        Welcome to
      </h1>
      <h2 className="text-4xl font-bold text-white text-center mb-8">
        {storeName}
      </h2>

      {/* Store Details Card */}
      <div className="bg-white rounded-lg shadow-xl p-6 mb-8 w-full max-w-md space-y-4">
        {/* Address */}
        <div className="flex items-start gap-4">
          <MapPin className="text-primary flex-shrink-0 mt-1" size={20} />
          <div>
            <p className="text-sm text-gray-600">Store Location</p>
            <p className="font-semibold text-gray-900">{address}</p>
          </div>
        </div>

        {/* Currency */}
        <div className="flex items-start gap-4">
          <DollarSign className="text-primary flex-shrink-0 mt-1" size={20} />
          <div>
            <p className="text-sm text-gray-600">Currency</p>
            <p className="font-semibold text-gray-900">{currency}</p>
          </div>
        </div>

        {/* Timezone */}
        <div className="flex items-start gap-4">
          <Globe className="text-primary flex-shrink-0 mt-1" size={20} />
          <div>
            <p className="text-sm text-gray-600">Timezone</p>
            <p className="font-semibold text-gray-900">{timezone}</p>
          </div>
        </div>
      </div>

      {/* Info Text */}
      <p className="text-white text-center text-sm mb-8 max-w-md">
        You're now connected to this store. Browse products and start shopping!
      </p>

      {/* Proceed Button */}
      <button
        onClick={onProceed}
        disabled={isLoading}
        className="w-full max-w-md px-6 py-3 bg-white text-primary font-bold rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {isLoading ? 'Connecting...' : 'Start Shopping'}
      </button>

      {/* Fallback Store ID (for debugging) */}
      <p className="text-white/60 text-xs mt-12">Store ID: {storeId}</p>
    </div>
  );
};

export default StoreWelcome;
