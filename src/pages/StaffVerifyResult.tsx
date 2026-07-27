import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { PATHS } from '../app/paths';
import { verifyExitQr, approveExit, VerifyResult } from '../api/staffVerificationApi';

type ScreenState = 'loading' | 'error' | VerifyResult['result'] | 'approved';

/**
 * Staff Verify Result Page
 * Single screen covering every exit-verification outcome: loading, order
 * detail (approve/report), already verified, invalid/expired QR, payment
 * failed, and the post-approval success state.
 */
const StaffVerifyResult: React.FC = (): React.ReactElement => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [state, setState] = useState<ScreenState>('loading');
  const [data, setData] = useState<VerifyResult | null>(null);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setState('error');
      return;
    }

    let cancelled = false;
    setState('loading');

    verifyExitQr(sessionId)
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setState(result.result);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setState('error');
      });

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const handleApprove = async (): Promise<void> => {
    if (!sessionId || approving) return;
    setApproving(true);
    try {
      await approveExit(sessionId);
      toast.success('Exit approved');
      setState('approved');
    } catch (err) {
      console.error(err);
      toast.error('Unable to approve exit — please try again');
    } finally {
      setApproving(false);
    }
  };

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="h-dvh bg-background flex flex-col px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col">
        {children}
      </motion.div>
    </div>
  );

  if (state === 'loading') {
    return (
      <Wrapper>
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="bg-primary/10 p-6 rounded-full">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
          <p className="text-on-surface font-poppins font-semibold text-lg">Verifying Order...</p>
          <p className="text-secondary font-inter text-sm text-center px-8">
            Checking payment and order status
          </p>
        </div>
      </Wrapper>
    );
  }

  if (state === 'error' || state === 'invalid') {
    return (
      <Wrapper>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
          <div className="bg-red-50 p-6 rounded-full">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <p className="text-on-surface font-poppins font-bold text-xl">Invalid or Expired QR</p>
          <p className="text-secondary font-inter text-sm px-8">
            This code isn't valid or is no longer active. Please ask the customer to show their receipt again.
          </p>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => navigate(PATHS.STAFF_SCAN)}
            className="w-full bg-primary py-4 rounded-2xl text-white font-poppins font-bold shadow-xl shadow-primary/20"
          >
            Scan Again
          </button>
          <button
            onClick={() => navigate(PATHS.STAFF_HOME)}
            className="w-full bg-white border border-outline/10 py-4 rounded-2xl text-on-surface font-poppins font-semibold"
          >
            Go Back
          </button>
        </div>
      </Wrapper>
    );
  }

  if (state === 'payment_failed') {
    const failed = data as Extract<VerifyResult, { result: 'payment_failed' }>;
    return (
      <Wrapper>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
          <div className="bg-red-50 p-6 rounded-full">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          <p className="text-on-surface font-poppins font-bold text-xl">Payment Not Completed</p>
          <p className="text-secondary font-inter text-sm px-8">
            Order #{failed?.orderNumber} has an incomplete payment. Do not allow exit until this is resolved.
          </p>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => toast.info('Contact your store admin about this order')}
            className="w-full bg-primary py-4 rounded-2xl text-white font-poppins font-bold shadow-xl shadow-primary/20"
          >
            Contact Store Staff
          </button>
          <button
            onClick={() => navigate(PATHS.STAFF_HOME)}
            className="w-full bg-white border border-outline/10 py-4 rounded-2xl text-on-surface font-poppins font-semibold"
          >
            Close
          </button>
        </div>
      </Wrapper>
    );
  }

  if (state === 'already_verified') {
    const verified = data as Extract<VerifyResult, { result: 'already_verified' }>;
    return (
      <Wrapper>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
          <div className="bg-amber-50 p-6 rounded-full">
            <Clock className="w-10 h-10 text-amber-500" />
          </div>
          <p className="text-on-surface font-poppins font-bold text-xl">Order Already Verified</p>
          <div className="bg-white rounded-2xl border border-outline/10 shadow-sm p-4 w-full text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-secondary font-inter">Order Number</span>
              <span className="text-on-surface font-inter font-semibold">#{verified.orderNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-secondary font-inter">Verified By</span>
              <span className="text-on-surface font-inter font-semibold">{verified.verifiedBy}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-secondary font-inter">Verified At</span>
              <span className="text-on-surface font-inter font-semibold">
                {new Date(verified.verifiedAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate(PATHS.STAFF_HOME)}
          className="w-full bg-white border border-outline/10 py-4 rounded-2xl text-on-surface font-poppins font-semibold"
        >
          Close
        </button>
      </Wrapper>
    );
  }

  if (state === 'approved') {
    return (
      <Wrapper>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
          <div className="bg-green-50 p-6 rounded-full">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <p className="text-on-surface font-poppins font-bold text-xl">Exit Approved</p>
          <p className="text-secondary font-inter text-sm px-8">
            Customer verified successfully. The exit protocol is complete.
          </p>
        </div>
        <button
          onClick={() => navigate(PATHS.STAFF_HOME)}
          className="w-full bg-primary py-4 rounded-2xl text-white font-poppins font-bold shadow-xl shadow-primary/20"
        >
          Done
        </button>
      </Wrapper>
    );
  }

  // state === 'success' — order verification detail
  const order = data as Extract<VerifyResult, { result: 'success' }>;

  return (
    <Wrapper>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-secondary font-inter text-sm mb-4 w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-5 h-5 text-primary" />
        <h1 className="text-on-surface font-poppins font-bold text-xl">Order Verification</h1>
      </div>

      <div className="bg-white rounded-2xl border border-outline/10 shadow-sm p-4 space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-secondary font-inter">Customer</span>
          <span className="text-on-surface font-inter font-semibold">{order.customerName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-secondary font-inter">Order Number</span>
          <span className="text-on-surface font-inter font-semibold">#{order.orderNumber}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-secondary font-inter">Payment Status</span>
          <span className="text-green-600 font-inter font-semibold capitalize">{order.paymentStatus}</span>
        </div>
        {order.paidAt && (
          <div className="flex justify-between text-sm">
            <span className="text-secondary font-inter">Payment Time</span>
            <span className="text-on-surface font-inter font-semibold">
              {new Date(order.paidAt).toLocaleTimeString()}
            </span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-secondary font-inter">Total Amount</span>
          <span className="text-on-surface font-inter font-semibold">₹{order.totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-secondary font-inter">Total Items</span>
          <span className="text-on-surface font-inter font-semibold">{order.itemsCount}</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto space-y-2 mb-4">
        {order.items.map((item, i) => (
          <div key={i} className="bg-white rounded-2xl border border-outline/10 shadow-sm p-3 flex items-center gap-3">
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-on-surface font-inter font-semibold truncate">{item.name}</p>
              {item.barcode && <p className="text-xs text-secondary font-inter">{item.barcode}</p>}
              <p className="text-xs text-secondary font-inter">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm text-on-surface font-inter font-semibold">₹{item.price.toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <button
          onClick={handleApprove}
          disabled={approving}
          className="w-full bg-primary py-4 rounded-2xl text-white font-poppins font-bold shadow-xl shadow-primary/20 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {approving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Approve Exit'}
        </button>
        <button
          onClick={() => toast.info('Report Issue is coming in the next update')}
          className="w-full bg-white border border-outline/10 py-4 rounded-2xl text-on-surface font-poppins font-semibold"
        >
          Report Issue
        </button>
      </div>
    </Wrapper>
  );
};

export default StaffVerifyResult;
