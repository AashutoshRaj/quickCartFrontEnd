import React, { useEffect, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import QRCode from 'qrcode';
import { PATHS } from '../app/paths';
import cartService from '../api/services/cartService.ts';
import apiClient from '../api/axios.ts';

/**
 * Payment Success Page Component
 * Displays order confirmation with QR code for exit gate scanning
 * Handles order completion and cart clearing
 *
 * @returns {React.ReactElement} Payment success confirmation page
 */
const PaymentSuccess: React.FC = (): React.ReactElement => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const queryClient = useQueryClient();
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handlePaymentSuccess = async (): Promise<void> => {
      try {
        // Mark order as completed
        if (sessionId) {
          await apiClient.post('/checkout/complete', { sessionId });
          // Invalidate orders query to refresh history
          queryClient.invalidateQueries({ queryKey: ['orders'] });
        }

        // Clear cart
        await cartService.clearCart();
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      } catch (error) {
        console.error('Error handling payment success:', error);
      }
    };

    handlePaymentSuccess();
  }, [sessionId, queryClient]);

  useEffect(() => {
    if (qrCanvasRef.current && sessionId) {
      QRCode.toCanvas(qrCanvasRef.current, sessionId, {
        width: 200,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      }).catch((err: Error) => console.error('Error generating QR code:', err));
    }
  }, [sessionId]);

  const handleDone = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    navigate(PATHS.HOME);
  };

  const handleViewReceipt = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    if (sessionId) {
      navigate(`/receipt?session_id=${sessionId}`);
    }
  };

  const transactionId = `#QC-${sessionId?.slice(0, 6).toUpperCase() || 'UNKNOWN'}`;
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Success Card */}
        <div className="bg-white rounded-3xl border border-green-200 p-8 text-center shadow-sm mb-6">
          {/* Checkmark */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-green-500 flex items-center justify-center bg-green-50">
                <CheckCircle2 className="w-12 h-12 text-green-500" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-sm text-gray-600 mb-6">Your transaction was completed safely.</p>

          {/* Transaction Details */}
          <div className="bg-gray-50 rounded-2xl p-5 mb-6 space-y-4">
            <div className="flex justify-between items-start text-sm">
              <span className="text-gray-600 font-medium">Store Name</span>
              <span className="text-gray-900 font-semibold">FreshMart Downtown</span>
            </div>
            <div className="border-t border-gray-200" />
            <div className="flex justify-between items-start text-sm">
              <span className="text-gray-600 font-medium">Total Paid</span>
              <span className="text-green-600 font-bold text-lg">$42.85</span>
            </div>
            <div className="border-t border-gray-200" />
            <div className="flex justify-between items-start text-sm">
              <span className="text-gray-600 font-medium">Transaction ID</span>
              <span className="text-gray-900 font-semibold">{transactionId}</span>
            </div>
            <div className="border-t border-gray-200" />
            <div className="flex justify-between items-start text-sm">
              <span className="text-gray-600 font-medium">Date & Time</span>
              <span className="text-gray-900 font-semibold text-right text-xs">{currentDate}</span>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="bg-blue-50 rounded-2xl p-6 mb-6">
            <div className="inline-block bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-bold mb-4">
              SCAN TO EXIT
            </div>
            <div className="flex justify-center mb-4">
              <canvas
                ref={qrCanvasRef}
                className="rounded-lg border-8 border-white shadow-lg"
              />
            </div>
            <p className="text-xs text-gray-700">
              Please scan this code at the security gate to complete your checkout process.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleDone}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-2xl transition-colors"
          >
            Done
          </button>
          <button
            onClick={handleViewReceipt}
            className="w-full border-2 border-gray-900 text-gray-900 hover:bg-gray-50 font-bold py-3 px-4 rounded-2xl transition-colors"
          >
            View Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
