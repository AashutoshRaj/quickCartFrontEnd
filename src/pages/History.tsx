import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  ChevronRight,
  ChevronLeft,
  ShoppingBag,
  Download,
  Eye,
  MapPin,
  Calendar,
  Clock,
  X,
  SlidersHorizontal,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { CartItem, Order } from '../types/index';
import { PATHS, getOrderDetailsPath } from '../app/paths';
import BottomNav from '../components/BottomNav.tsx';
import { useOrders, useDownloadInvoice } from '../queries/ordersQueries.ts';

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

interface DateFilter {
  label: string;
  days: number | null;
}

interface DateFilters {
  [key: string]: DateFilter;
}

interface OrderCardProps {
  order: Order;
  index: number;
  onDownload: () => void;
  onViewDetails: () => void;
}

const SOFT_SHADOW = 'shadow-[0_2px_8px_rgba(15,23,42,0.04),0_12px_30px_rgba(15,23,42,0.08)]';
const SOFT_SHADOW_HOVER = 'hover:shadow-[0_4px_12px_rgba(15,23,42,0.06),0_16px_40px_rgba(15,23,42,0.10)]';

const STATUS_COLORS: StatusColors = {
  completed: { bg: 'bg-green-100', text: 'text-green-700' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-700' },
  refunded: { bg: 'bg-purple-100', text: 'text-purple-700' },
};

const DATE_FILTERS: DateFilters = {
  today: { label: 'Today', days: 1 },
  week: { label: 'Last 7 Days', days: 7 },
  month: { label: 'Last 30 Days', days: 30 },
  six_months: { label: 'Last 6 Months', days: 180 },
  all: { label: 'All Orders', days: null },
};

/**
 * History Page Component
 * Displays order history with search and filtering capabilities
 * Allows viewing order details and downloading invoices
 *
 * @returns {React.ReactElement} Order history page
 */
const History: React.FC = (): React.ReactElement => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  const { data, isLoading, error, isError } = useOrders({
    page,
    limit: 10,
  });
  console.log('historylist', data);

  const totalPages = data?.totalPages ?? 1;

  const filteredOrders = useMemo((): Order[] => {
    if (!data?.orders) return [];

    let filtered = data.orders;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order: Order) =>
          (order as any).storeName?.toLowerCase().includes(query) ||
          (order as any).storeAddress?.toLowerCase().includes(query) ||
          order._id?.toLowerCase().includes(query) ||
          (order as any).id?.toLowerCase().includes(query)
      );
    }

    // Date filter
    if (selectedFilter !== 'all') {
      const filterConfig = DATE_FILTERS[selectedFilter];
      if (filterConfig?.days) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - filterConfig.days);

        filtered = filtered.filter((order: Order) => {
          const orderDate = new Date((order as any).createdAt || new Date());
          return orderDate >= cutoffDate;
        });
      }
    }

    return filtered;
  }, [data?.orders, searchQuery, selectedFilter]);

  const invoiceMutation = useDownloadInvoice();

  const handleDownloadInvoice = (orderId: string): void => {
    invoiceMutation.mutate(orderId);
  };

  const handleViewDetails = (orderId: string): void => {
    navigate(getOrderDetailsPath(orderId));
  };

  const handleNavigateBack = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    navigate(-1);
  };

  const handleClearSearch = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    setSearchQuery('');
  };

  const handleFilterClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    setShowFilter(!showFilter);
  };

  const handleFilterSelect = (key: string): void => {
    setSelectedFilter(key);
    setShowFilter(false);
    setPage(1);
  };

  const handlePageChange = (direction: 'prev' | 'next'): void => {
    if (direction === 'prev') {
      setPage(Math.max(1, page - 1));
    } else {
      setPage(Math.min(totalPages, page + 1));
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-xl z-20 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
        <div className="px-5 pt-5 pb-1">
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={handleNavigateBack}
              className={`bg-white p-2.5 rounded-full ${SOFT_SHADOW} ${SOFT_SHADOW_HOVER} transition-shadow duration-200`}
            >
              <ArrowLeft size={20} className="text-on-surface" />
            </button>
            <h1 className="text-on-surface font-poppins font-bold text-lg">Order History</h1>
            <div className="w-10" />
          </div>
          <p className="text-secondary font-inter text-sm mb-5">Review your past shopping sessions</p>
        </div>

        {/* Search & Filter */}
        <div className="px-5 pb-5 space-y-3 relative">
          <div className="flex gap-2.5">
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-outline"
              />
              <input
                type="text"
                placeholder="Search by store or order ID"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className={`w-full pl-11 pr-9 py-3.5 bg-white rounded-[18px] ${SOFT_SHADOW} border-none font-inter text-sm placeholder:text-outline/70 focus:outline-none focus:ring-4 focus:ring-primary/15 transition-all duration-200`}
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 hover:bg-background rounded-full transition-colors duration-200"
                >
                  <X size={15} className="text-secondary" />
                </button>
              )}
            </div>
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={handleFilterClick}
              className={`flex items-center gap-1.5 px-4 py-3.5 rounded-[18px] font-inter font-semibold text-sm transition-all duration-200 ${
                selectedFilter !== 'all'
                  ? `bg-gradient-to-br from-primary to-[#FF9F1C] text-white shadow-[0_6px_16px_rgba(255,184,0,0.35)]`
                  : `bg-white text-on-surface ${SOFT_SHADOW}`
              }`}
            >
              <SlidersHorizontal size={16} />
            </motion.button>
          </div>

          {/* Filter Dropdown */}
          <AnimatePresence>
            {showFilter && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className={`absolute right-5 top-full mt-1 w-56 bg-white rounded-[20px] overflow-hidden ${SOFT_SHADOW} z-30 p-1.5`}
              >
                {Object.entries(DATE_FILTERS).map(([key, config]: [string, DateFilter]) => (
                  <button
                    key={key}
                    onClick={() => handleFilterSelect(key)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[14px] text-left font-inter text-sm transition-colors duration-150 ${
                      selectedFilter === key
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-on-surface hover:bg-background'
                    }`}
                  >
                    {config.label}
                    {selectedFilter === key && <Check size={15} />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <main className="px-5 pt-5 space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i: number) => (
              <div key={i} className={`bg-white p-5 rounded-[24px] ${SOFT_SHADOW} animate-pulse`}>
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-background rounded-[18px]" />
                  <div className="flex-1 space-y-2.5 py-1">
                    <div className="h-3.5 bg-background rounded-full w-3/4" />
                    <div className="h-3 bg-background rounded-full w-1/2" />
                    <div className="h-3 bg-background rounded-full w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`bg-white rounded-[24px] p-8 text-center ${SOFT_SHADOW}`}
          >
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-red-500" size={26} />
            </div>
            <p className="text-on-surface font-poppins font-bold text-sm mb-1">
              Failed to Load Orders
            </p>
            <p className="text-secondary font-inter text-xs mb-5">
              {(error as { response?: { data?: { message?: string } } } | null)?.response?.data?.message
                || error?.message
                || 'Something went wrong'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-on-surface text-white rounded-[16px] font-inter font-semibold text-xs hover:opacity-90 active:scale-95 transition-all duration-200"
            >
              Try Again
            </button>
          </motion.div>
        ) : filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`bg-white rounded-[24px] p-12 text-center ${SOFT_SHADOW}`}
          >
            <div className="w-16 h-16 bg-primary/10 rounded-[20px] flex items-center justify-center mx-auto mb-5">
              <ShoppingBag className="text-primary" size={30} />
            </div>
            <p className="text-on-surface font-poppins font-bold text-lg mb-1.5">
              No Order History
            </p>
            <p className="text-secondary font-inter text-sm mb-6">
              Your completed purchases will appear here.
            </p>
            <button
              onClick={() => navigate(PATHS.HOME)}
              className="px-6 py-3 bg-gradient-to-br from-primary to-[#FF9F1C] text-white rounded-[16px] font-inter font-semibold text-sm shadow-[0_8px_20px_rgba(255,184,0,0.3)] hover:shadow-[0_10px_24px_rgba(255,184,0,0.4)] active:scale-95 transition-all duration-200"
            >
              Continue Shopping
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="space-y-4"
          >
            {filteredOrders.map((order: Order, index: number) => (
              <OrderCard
                key={order._id || (order as any).id}
                order={order}
                index={index}
                onDownload={() => handleDownloadInvoice(order._id || (order as any).id)}
                onViewDetails={() => handleViewDetails(order._id || (order as any).id)}
              />
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange('prev')}
                  disabled={page === 1}
                  className={`p-2.5 rounded-full bg-white ${SOFT_SHADOW} ${SOFT_SHADOW_HOVER} transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none`}
                >
                  <ChevronLeft size={18} className="text-on-surface" />
                </button>
                <span className="text-secondary font-inter text-xs font-semibold px-3 py-1.5 bg-white rounded-full">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange('next')}
                  disabled={page === totalPages}
                  className={`p-2.5 rounded-full bg-white ${SOFT_SHADOW} ${SOFT_SHADOW_HOVER} transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none`}
                >
                  <ChevronRight size={18} className="text-on-surface" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

/**
 * Order Card Component
 * Displays individual order information with expand/collapse functionality
 * Shows order summary and detailed itemized receipt
 *
 * @param {OrderCardProps} props - Order card properties
 * @returns {React.ReactElement} Order card element
 */
const OrderCard: React.FC<OrderCardProps> = ({ order, index, onDownload, onViewDetails }): React.ReactElement => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const statusKey = (order.status?.toLowerCase() || 'pending') as keyof typeof STATUS_COLORS;
  const statusColor = STATUS_COLORS[statusKey] || STATUS_COLORS.pending;

  const orderDate = new Date((order as any).createdAt || new Date());
  const dateStr = orderDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
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

  const handleExpandClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    setExpanded(!expanded);
  };

  const handleDownloadClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    onDownload();
  };

  const handleViewDetailsClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    onViewDetails();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut', delay: Math.min(index * 0.05, 0.3) }}
      className={`bg-white rounded-[24px] overflow-hidden ${SOFT_SHADOW} ${SOFT_SHADOW_HOVER} transition-shadow duration-200`}
    >
      {/* Collapsed View */}
      <button
        onClick={handleExpandClick}
        className="w-full text-left p-5 active:bg-background/60 transition-colors duration-150"
      >
        <div className="flex gap-4">
          {/* Store Icon */}
          <div className="w-16 h-16 bg-primary/10 rounded-[18px] flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="text-primary" size={26} />
          </div>

          {/* Store Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2.5">
              <div>
                <h4 className="text-on-surface font-poppins font-bold text-sm truncate">
                  {(order as any).storeName || 'Store'}
                </h4>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex items-center gap-1 text-secondary font-inter text-xs">
                    <Calendar size={12} />
                    {dateStr}
                  </div>
                  <span className="w-1 h-1 bg-outline/30 rounded-full" />
                  <div className="flex items-center gap-1 text-secondary font-inter text-xs">
                    <Clock size={12} />
                    {timeStr}
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <span
                className={`${statusColor.bg} ${statusColor.text} text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap flex-shrink-0`}
              >
                {order.status || 'Pending'}
              </span>
            </div>

            {/* Order Summary */}
            <div className="flex items-center gap-5 mt-3 pt-3 border-t border-outline/10">
              <div>
                <p className="text-secondary font-inter text-[11px]">Total Items</p>
                <p className="text-on-surface font-poppins font-bold text-sm mt-0.5">{totalItems}</p>
              </div>
              <div>
                <p className="text-secondary font-inter text-[11px]">Total Amount</p>
                <p className="text-primary font-poppins font-bold text-sm mt-0.5">
                  ${total.toFixed(2)}
                </p>
              </div>
              <motion.div
                animate={{ rotate: expanded ? 90 : 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="ml-auto w-8 h-8 rounded-full bg-background flex items-center justify-center"
              >
                <ChevronRight size={16} className="text-secondary" />
              </motion.div>
            </div>
          </div>
        </div>
      </button>

      {/* Expanded View */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="bg-background/60"
          >
            <div className="p-5 space-y-5">
              {/* Itemized Receipt */}
              <div className="space-y-3">
                <h5 className="text-on-surface font-poppins font-bold text-xs uppercase tracking-widest">
                  Itemized Receipt
                </h5>
                <div className="space-y-2.5">
                  {order.items?.map((item: CartItem, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex-1 min-w-0">
                        <p className="text-on-surface font-inter font-medium truncate">
                          {(item as any).name || (item as any).productName}
                        </p>
                        <p className="text-secondary font-inter text-xs">
                          {item.quantity}x @ ${(item.price || (item as any).unitPrice || 0).toFixed(2)}
                        </p>
                      </div>
                      <p className="text-on-surface font-inter font-semibold text-xs ml-2 flex-shrink-0">
                        ${((item.price || (item as any).unitPrice || 0) * (item.quantity || 1)).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Details */}
              <div className="space-y-2 pt-3 border-t border-outline/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary font-inter">Subtotal</span>
                  <span className="text-on-surface font-inter font-medium">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                {tax > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary font-inter">Tax</span>
                    <span className="text-on-surface font-inter font-medium">
                      ${tax.toFixed(2)}
                    </span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary font-inter">Discount</span>
                    <span className="text-green-600 font-inter font-medium">
                      -${discount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm pt-2 border-t border-outline/10 font-poppins font-bold">
                  <span className="text-on-surface">Grand Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Store Details */}
              {(order as any).storeAddress && (
                <div className={`flex gap-2.5 p-3.5 bg-white rounded-[16px] ${SOFT_SHADOW}`}>
                  <MapPin size={16} className="text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-secondary font-inter text-xs mb-1">Store Address</p>
                    <p className="text-on-surface font-inter text-xs">{(order as any).storeAddress}</p>
                  </div>
                </div>
              )}

              {/* Order ID */}
              <div className={`bg-white rounded-[16px] p-3.5 ${SOFT_SHADOW}`}>
                <p className="text-secondary font-inter text-xs mb-1">Order ID</p>
                <p className="text-on-surface font-poppins font-bold text-sm">
                  #{order._id || (order as any).id}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2.5 pt-3 border-t border-outline/10">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleDownloadClick}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-[16px] ${SOFT_SHADOW} ${SOFT_SHADOW_HOVER} transition-all duration-200`}
                >
                  <Download size={16} className="text-primary" />
                  <span className="font-inter font-semibold text-sm text-primary">
                    Download PDF
                  </span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleViewDetailsClick}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-br from-primary to-[#FF9F1C] text-white rounded-[16px] shadow-[0_6px_16px_rgba(255,184,0,0.3)] hover:shadow-[0_8px_20px_rgba(255,184,0,0.4)] transition-all duration-200"
                >
                  <Eye size={16} />
                  <span className="font-inter font-semibold text-sm">View Details</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default History;
