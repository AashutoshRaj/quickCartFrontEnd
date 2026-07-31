import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Download,
  Copy,
  Check,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import type { OrderDetailsParams, CartItem, OrderDetails, RootState } from '../types/index';
import { formatCurrency } from '../utils/currency.ts';
import BottomNav from '../components/BottomNav.tsx';
import { useOrderDetails, useDownloadInvoice } from '../queries/ordersQueries.ts';

interface StatusColorConfig {
  bg: string;
  text: string;
}

interface StatusColors {
  completed: StatusColorConfig;
  pending: StatusColorConfig;
  cancelled: StatusColorConfig;
  refunded: StatusColorConfig;
  [key: string]: StatusColorConfig;
}

const STATUS_COLORS: StatusColors = {
  completed: { bg: 'bg-green-100', text: 'text-green-700' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-700' },
  refunded: { bg: 'bg-purple-100', text: 'text-purple-700' },
};

/**
 * Order Details Page Component
 * Displays comprehensive order information including items, totals, and payment details
 * Allows copying order ID and downloading invoice
 *
 * @returns {React.ReactElement} Order details page
 */
const OrderDetailsPage: React.FC = (): React.ReactElement => {
  const { orderId } = useParams<OrderDetailsParams>();
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState<boolean>(false);

  const { activeStore } = useSelector((state: RootState) => state.store);
  const { data: order, isLoading, isError, error } = useOrderDetails(orderId || '');
  const currency = order?.currency || activeStore?.currency || 'USD';
  const downloadInvoice = useDownloadInvoice();

  const handleCopyOrderId = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleDownloadInvoice = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    if (orderId) {
      downloadInvoice.mutate(orderId);
    }
  };

  const handleNavigateBack = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-28">
        <header className="sticky top-0 bg-background/80 backdrop-blur-md z-20 border-b border-outline/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleNavigateBack}
              className="p-2 -ml-2 hover:bg-white rounded-full transition-colors"
            >
              <ArrowLeft size={24} className="text-on-surface" />
            </button>
            <h1 className="text-on-surface font-poppins font-bold text-xl">Order Details</h1>
          </div>
        </header>
        <main className="px-6 py-6 space-y-4">
          {[1, 2, 3].map((i: number) => (
            <div key={i} className="bg-white p-5 rounded-2xl animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </main>
        <BottomNav />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background pb-28">
        <header className="sticky top-0 bg-background/80 backdrop-blur-md z-20 border-b border-outline/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleNavigateBack}
              className="p-2 -ml-2 hover:bg-white rounded-full transition-colors"
            >
              <ArrowLeft size={24} className="text-on-surface" />
            </button>
            <h1 className="text-on-surface font-poppins font-bold text-xl">Order Details</h1>
          </div>
        </header>
        <main className="px-6 py-6">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-on-surface font-poppins font-bold text-sm mb-1">
              Failed to Load Order
            </p>
            <p className="text-secondary font-inter text-xs">
              {(error as { response?: { data?: { message?: string } } } | null)?.response?.data?.message
                || error?.message
                || 'Something went wrong'}
            </p>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background pb-28">
        <header className="sticky top-0 bg-background/80 backdrop-blur-md z-20 border-b border-outline/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleNavigateBack}
              className="p-2 -ml-2 hover:bg-white rounded-full transition-colors"
            >
              <ArrowLeft size={24} className="text-on-surface" />
            </button>
            <h1 className="text-on-surface font-poppins font-bold text-xl">Order Details</h1>
          </div>
        </header>
        <main className="px-6 py-6">
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-on-surface font-poppins font-bold">Order not found</p>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  const statusKey = (order.status?.toLowerCase() || 'pending') as keyof typeof STATUS_COLORS;
  const statusColor = STATUS_COLORS[statusKey] || STATUS_COLORS.pending;

  const orderDate = new Date((order.createdAt as string | number | undefined) || Date.now());
  const dateStr = orderDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = orderDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const totalItems = order.items?.reduce((sum: number, item: CartItem) => sum + (item.quantity || 0), 0) || 0;
  const subtotal = (order as any).subtotal || 0;
  const tax = (order as any).tax || 0;
  const discount = (order as any).discount || 0;
  const total = order.total || subtotal + tax - discount;

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-md z-20 border-b border-outline/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={handleNavigateBack}
              className="p-2 -ml-2 hover:bg-white rounded-full transition-colors"
            >
              <ArrowLeft size={24} className="text-on-surface" />
            </button>
            <div>
              <h1 className="text-on-surface font-poppins font-bold text-lg">Order Details</h1>
              <p className="text-secondary font-inter text-xs">#{orderId}</p>
            </div>
          </div>
          <span
            className={`${statusColor.bg} ${statusColor.text} text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider`}
          >
            {order.status || 'Pending'}
          </span>
        </div>
      </header>

      <main className="px-6 py-6 space-y-6">
        {/* Order Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 border border-outline/10 space-y-4"
        >
          {/* Store Info */}
          <div>
            <h3 className="text-secondary font-poppins font-bold text-xs uppercase tracking-widest mb-3">
              Store Information
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="text-primary" size={24} />
              </div>
              <div className="flex-1">
                <p className="text-on-surface font-poppins font-bold text-sm">
                  {(order as any).storeName || 'Store'}
                </p>
                {(order as any).storeAddress && (
                  <p className="text-secondary font-inter text-xs mt-1">
                    {(order as any).storeAddress}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="flex gap-4 pt-3 border-t border-outline/10">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Calendar size={14} className="text-secondary" />
                <span className="text-secondary font-inter text-xs">Date</span>
              </div>
              <p className="text-on-surface font-poppins font-bold text-sm">{dateStr}</p>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={14} className="text-secondary" />
                <span className="text-secondary font-inter text-xs">Time</span>
              </div>
              <p className="text-on-surface font-poppins font-bold text-sm">{timeStr}</p>
            </div>
          </div>

          {/* Order ID */}
          <div className="pt-3 border-t border-outline/10">
            <p className="text-secondary font-inter text-xs mb-2">Order ID</p>
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-outline/10">
              <code className="text-on-surface font-mono text-xs font-semibold flex-1 truncate">
                {orderId}
              </code>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleCopyOrderId}
                className="p-1 hover:bg-white rounded transition-colors"
              >
                {copiedId ? (
                  <Check size={16} className="text-green-600" />
                ) : (
                  <Copy size={16} className="text-secondary" />
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Itemized Receipt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 border border-outline/10"
        >
          <h3 className="text-secondary font-poppins font-bold text-xs uppercase tracking-widest mb-4">
            Itemized Receipt ({totalItems} items)
          </h3>
          <div className="space-y-3">
            {order.items?.map((item: CartItem, idx: number) => (
              <div key={idx} className="flex items-start justify-between gap-3 pb-3 last:pb-0 last:border-b-0 border-b border-outline/10">
                <div className="flex-1 min-w-0">
                  <p className="text-on-surface font-inter font-medium text-sm truncate">
                    {(item as any).name || (item as any).productName}
                  </p>
                  <p className="text-secondary font-inter text-xs mt-1">
                    Quantity: {item.quantity}x @ {formatCurrency(Number(item.price || (item as any).unitPrice || 0), currency)}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-on-surface font-poppins font-bold text-sm">
                    {formatCurrency(Number((item.price || (item as any).unitPrice || 0) * (item.quantity || 1)), currency)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-5 border border-outline/10 space-y-3"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-secondary font-inter">Subtotal</span>
            <span className="text-on-surface font-inter font-medium">
              {formatCurrency(subtotal, currency)}
            </span>
          </div>
          {tax > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-secondary font-inter">Tax</span>
              <span className="text-on-surface font-inter font-medium">
                {formatCurrency(tax, currency)}
              </span>
            </div>
          )}
          {discount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-secondary font-inter">Discount</span>
              <span className="text-green-600 font-inter font-medium">
                -{formatCurrency(discount, currency)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm pt-3 border-t border-outline/10 font-poppins font-bold">
            <span className="text-on-surface">Grand Total</span>
            <span className="text-primary text-lg">{formatCurrency(total, currency)}</span>
          </div>
        </motion.div>

        {/* Payment Information */}
        {(order as any).paymentMethod && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-5 border border-outline/10"
          >
            <h3 className="text-secondary font-poppins font-bold text-xs uppercase tracking-widest mb-3">
              Payment Information
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-secondary font-inter text-sm">Method</span>
                <span className="text-on-surface font-poppins font-bold text-sm capitalize">
                  {(order as any).paymentMethod}
                </span>
              </div>
              {(order as any).paymentStatus && (
                <div className="flex items-center justify-between">
                  <span className="text-secondary font-inter text-sm">Status</span>
                  <span className={`text-sm font-semibold capitalize ${
                    (order as any).paymentStatus === 'completed'
                      ? 'text-green-600'
                      : 'text-yellow-600'
                  }`}>
                    {(order as any).paymentStatus}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Download Invoice */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleDownloadInvoice}
          disabled={downloadInvoice.isPending}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-inter font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          <Download size={18} />
          {downloadInvoice.isPending ? 'Downloading...' : 'Download Invoice PDF'}
        </motion.button>
      </main>
      <BottomNav />
    </div>
  );
};

export default OrderDetailsPage;
