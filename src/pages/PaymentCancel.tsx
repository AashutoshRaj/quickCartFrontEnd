import React, { useEffect } from 'react';
import { XCircle } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { PATHS } from '../app/paths';
import apiClient from '../api/axios.ts';

/**
 * Payment Cancel Page Component
 * Displays a message when user cancels payment checkout
 * Provides option to return to cart
 *
 * @returns {React.ReactElement} Payment cancellation page
 */
const PaymentCancel: React.FC = (): React.ReactElement => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) return;
    void apiClient.post(`/checkout/cancel/${encodeURIComponent(sessionId)}`).catch(() => {
      // The cart remains available even if cancellation confirmation fails.
    });
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-[2rem] border border-red-200 bg-white p-8 text-center shadow-sm">
        <XCircle className="mx-auto mb-4 h-14 w-14 text-red-500" />
        <h1 className="font-poppins text-2xl font-bold text-on-surface">Payment Cancelled</h1>
        <p className="mt-3 text-sm text-secondary">
          The checkout was cancelled. Your cart is still available if you want to try again.
        </p>
        <Link to={PATHS.CART} className="mt-6 inline-flex rounded-2xl bg-primary px-5 py-3 font-poppins font-semibold text-white">
          Return to Cart
        </Link>
      </div>
    </div>
  );
};

export default PaymentCancel;
