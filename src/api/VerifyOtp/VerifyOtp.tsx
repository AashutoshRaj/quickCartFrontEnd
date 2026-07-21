/**
 * Verify OTP Component
 * Placeholder component for OTP verification UI
 *
 * This component can be extended with a form for verifying OTP codes
 * sent via SMS or other channels. Currently serves as a placeholder.
 */

import React from 'react';

/**
 * Props for VerifyOtp component
 */
export interface VerifyOtpProps {
  /** Phone number that OTP was sent to */
  phoneNumber?: string;
  /** Callback when OTP is successfully verified */
  onSuccess?: (data: unknown) => void;
  /** Callback when OTP verification fails */
  onFailure?: (error: Error) => void;
  /** Custom CSS class for styling */
  className?: string;
  /** Whether to show the component */
  isVisible?: boolean;
}

/**
 * VerifyOtp Component
 *
 * @param {VerifyOtpProps} props - Component props
 * @returns {React.ReactElement | null} OTP verification UI or null if not visible
 *
 * @example
 * <VerifyOtp
 *   phoneNumber="+919876543210"
 *   onSuccess={handleSuccess}
 *   onFailure={handleFailure}
 *   isVisible={showVerification}
 * />
 */
export const VerifyOtp: React.FC<VerifyOtpProps> = ({
  phoneNumber,
  onSuccess,
  onFailure,
  className,
  isVisible = true,
}): React.ReactElement | null => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className={className}>
      <div className="p-4">
        <h2 className="text-lg font-bold mb-2">Verify OTP</h2>
        <p className="text-sm text-gray-600 mb-4">
          {phoneNumber ? `Enter the OTP sent to ${phoneNumber}` : 'Enter the OTP you received'}
        </p>

        {/* Placeholder for OTP input form - to be implemented */}
        <div className="text-center text-sm text-gray-500">
          OTP verification form to be implemented
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
