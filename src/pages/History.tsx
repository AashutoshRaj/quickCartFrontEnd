import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  ChevronRight,
  ShoppingBag,
  Download,
  Eye,
  MapPin,
  Calendar,
  Clock,
  X,
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

interface OrdersResponse {
  orders: Order[];
  totalPages: number;
}

interface OrderCardProps {
  order: Order;
  index: number;
  onDownload: () => void;
  onViewDetails: () => void;
}

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
      if (filterConfig.days) {
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
      setPage(Math.min(data?.totalPages || 1, page + 1));
    }
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-md z-20 border-b border-outline/10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleNavigateBack}
              className="p-2 -ml-2 hover:bg-white rounded-full transition-colors"
            >
              <ArrowLeft size={24} className="text-on-surface" />
            </button>
            <h1 className="text-on-surface font-poppins font-bold text-xl">Order History</h1>
            <div className="w-10" />
          </div>
          <p className="text-secondary font-inter text-sm">Review your past shopping sessions</p>
        </div>

        {/* Search & Filter */}
        <div className="px-6 pb-4 space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
              />
              <input
                type="text"
                placeholder="Search by store or order ID"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-outline/20 rounded-xl font-inter text-sm focus:outline-none focus:border-primary/50"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                >
                  <X size={16} className="text-secondary" />
                </button>
              )}
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleFilterClick}
              className={`px-4 py-2.5 rounded-xl font-inter font-semibold text-sm transition-colors ${
                selectedFilter !== 'all'
                  ? 'bg-primary text-white'
                  : 'bg-white border border-outline/20 text-on-surface'
              }`}
            >
              Filter
            </motion.button>
          </div>

          {/* Filter Dropdown */}
          {showFilter && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="bg-white border border-outline/20 rounded-xl overflow-hidden shadow-lg"
            >
              {Object.entries(DATE_FILTERS).map(([key, config]: [string, DateFilter]) => (
                <button
                  key={key}
                  onClick={() => handleFilterSelect(key)}
                  className={`w-full px-4 py-3 text-left font-inter text-sm transition-colors ${
                    selectedFilter === key
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-on-surface hover:bg-gray-50'
                  }`}
                >
                  {config.label}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </header>

      <main className="px-6 py-6 space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i: number) => (
              <div key={i} className="bg-white p-5 rounded-2xl animate-pulse">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center"
          >
            <ShoppingBag className="text-red-500 mx-auto mb-3" size={32} />
            <p className="text-on-surface font-poppins font-bold text-sm mb-1">
              Failed to Load Orders
            </p>
            <p className="text-secondary font-inter text-xs mb-4">
              {error?.response?.data?.message || 'Something went wrong'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-inter font-semibold text-xs hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        ) : filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-12 text-center border border-outline/10"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="text-primary" size={32} />
            </div>
            <p className="text-on-surface font-poppins font-bold text-lg mb-1">
              No Order History
            </p>
            <p className="text-secondary font-inter text-sm mb-6">
              Your completed purchases will appear here.
            </p>
            <button
              onClick={() => navigate(PATHS.HOME)}
              className="px-6 py-2.5 bg-primary text-white rounded-xl font-inter font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              Continue Shopping
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
            {data?.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange('prev')}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-outline/20 font-inter text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-secondary font-inter text-sm px-4">
                  Page {page} of {data.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange('next')}
                  disabled={page === data.totalPages}
                  className="px-4 py-2 rounded-lg border border-outline/20 font-inter text-sm disabled:opacity-50"
                >
                  Next
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
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl shadow-sm border border-outline/10 overflow-hidden hover:shadow-md transition-all"
    >
      {/* Collapsed View */}
      <motion.button
        onClick={handleExpandClick}
        className="w-full text-left p-5 hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex gap-4">
          {/* Store Icon */}
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="text-primary" size={28} />
          </div>

          {/* Store Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h4 className="text-on-surface font-poppins font-bold text-sm truncate">
                  {(order as any).storeName || 'Store'}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1 text-secondary font-inter text-xs">
                    <Calendar size={12} />
                    {dateStr}
                  </div>
                  <span className="w-1 h-1 bg-outline/20 rounded-full" />
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
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-outline/10">
              <div>
                <p className="text-secondary font-inter text-xs">Total Items</p>
                <p className="text-on-surface font-poppins font-bold text-sm">{totalItems}</p>
              </div>
              <div>
                <p className="text-secondary font-inter text-xs">Total Amount</p>
                <p className="text-primary font-poppins font-bold text-sm">
                  ${total.toFixed(2)}
                </p>
              </div>
              <div className="ml-auto">
                <ChevronRight
                  size={20}
                  className={`text-secondary transition-transform ${
                    expanded ? 'rotate-90' : ''
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.button>

      {/* Expanded View */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-outline/10 bg-gray-50/50"
        >
          <div className="p-5 space-y-5">
            {/* Itemized Receipt */}
            <div className="space-y-3">
              <h5 className="text-on-surface font-poppins font-bold text-xs uppercase tracking-widest">
                Itemized Receipt
              </h5>
              <div className="space-y-2">
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
              <div className="flex gap-2 p-3 bg-white rounded-lg border border-outline/10">
                <MapPin size={16} className="text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-secondary font-inter text-xs mb-1">Store Address</p>
                  <p className="text-on-surface font-inter text-xs">{(order as any).storeAddress}</p>
                </div>
              </div>
            )}

            {/* Order ID */}
            <div className="bg-white rounded-lg p-3 border border-outline/10">
              <p className="text-secondary font-inter text-xs mb-1">Order ID</p>
              <p className="text-on-surface font-poppins font-bold text-sm">
                #{order._id || (order as any).id}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-outline/10">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleDownloadClick}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-outline/20 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download size={16} className="text-primary" />
                <span className="font-inter font-semibold text-sm text-primary">
                  Download PDF
                </span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleViewDetailsClick}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Eye size={16} />
                <span className="font-inter font-semibold text-sm">View Details</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default History;
