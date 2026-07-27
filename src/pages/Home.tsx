import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Bell, Search, ShoppingBag, ChevronRight, Plus, MapPin as Marker, ScanQrCode, Edit2, Keyboard, Flame, Clock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import type { RootState } from '../types/index';
import { PATHS } from '../app/paths';
import BottomNav from '../components/BottomNav.tsx';

interface Category {
  id: number;
  name: string;
  emoji: string;
  bg: string;
}

interface Deal {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  bg: string;
}

interface StoreCardProps {
  name: string;
  distance: string;
  status: string;
  statusColor: string;
}

const SOFT_SHADOW = 'shadow-[0_2px_8px_rgba(15,23,42,0.04),0_12px_30px_rgba(15,23,42,0.08)]';
const SOFT_SHADOW_HOVER = 'hover:shadow-[0_4px_12px_rgba(15,23,42,0.06),0_16px_40px_rgba(15,23,42,0.10)]';

const categories: Category[] = [
  { id: 1, name: 'Veggies', emoji: '🥒', bg: 'bg-green-100' },
  { id: 2, name: 'Fruits', emoji: '🍎', bg: 'bg-red-100' },
  { id: 3, name: 'Meat', emoji: '🍗', bg: 'bg-orange-100' },
  { id: 4, name: 'Dairy', emoji: '🥛', bg: 'bg-purple-100' },
  { id: 5, name: 'Bakery', emoji: '🧁', bg: 'bg-yellow-100' },
  { id: 6, name: 'Drinks', emoji: '🥤', bg: 'bg-blue-100' },
];

const deals: Deal[] = [
  { id: 1, name: 'Fresh Oranges', price: 3.99, originalPrice: 5.99, discount: -25, image: '🍊', bg: 'bg-yellow-50' },
  { id: 2, name: 'Red Apples', price: 4.49, originalPrice: 6.49, discount: -30, image: '🍎', bg: 'bg-red-50' },
];

/**
 * Home Page Component
 * Main landing page showing active store session, categories, nearby stores, and deals
 * Displays user greeting and navigation options
 *
 * @returns {React.ReactElement} Home page with store information and shopping options
 */
const Home: React.FC = (): React.ReactElement => {
  const navigate = useNavigate();
  const [showProductIdInput, setShowProductIdInput] = useState(false);
  const [productId, setProductId] = useState('');
  const { user } = useSelector((state: RootState) => state.auth);
console.log('userinfoooo', user);

  const { activeStore } = useSelector((state: RootState) => state.store);
  console.log('activeStore', activeStore);

  const handleStoreNavigation = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    navigate(PATHS.SCAN_STORE);
  };

  const handleScanProduct = (): void => {
    if (activeStore) {
      navigate(PATHS.SCANNER);
    }
  };

  const handleProductIdSubmit = (): void => {
    if (productId.trim() && activeStore) {
      navigate(`/product/${productId}`, { state: { storeId: activeStore.storeId } });
      setProductId('');
      setShowProductIdInput(false);
    }
  };

  return (
    <div className="h-full bg-background pb-32 px-4">
      {/* Header */}
      <header className="flex justify-between items-center fixed left-0 px-4 py-4 w-full top-0 bg-background/80 backdrop-blur-xl z-20">
        <button
          onClick={handleStoreNavigation}
          className="flex items-center gap-3 flex-1 hover:opacity-70 transition-opacity duration-200 text-left"
        >
          <div>
            <p className="text-secondary font-inter text-xs font-medium">Hello, {(user as { name?: string } | null)?.name || 'Seema'}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin size={16} className="text-primary" />
              <h1 className="text-on-surface font-poppins font-semibold text-base">
                {activeStore?.name || activeStore?.storeName || 'Select Store'}
              </h1>
              {activeStore && (
                <Edit2 size={14} className="text-primary ml-1" />
              )}
            </div>
          </div>
        </button>
        <button className={`bg-white p-3 rounded-full ${SOFT_SHADOW} ${SOFT_SHADOW_HOVER} transition-shadow duration-200`}>
          <Bell size={20} className="text-on-surface" />
        </button>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="max-w-2xl mx-auto pt-[50px]"
      >
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-outline" size={20} />
          <input
            type="text"
            placeholder="Search for products or stores..."
            className={`w-full bg-white pl-12 pr-6 py-4 rounded-[20px] ${SOFT_SHADOW} border-none focus:outline-none focus:ring-4 focus:ring-primary/15 font-inter text-sm placeholder:text-outline/70 transition-all duration-200`}
          />
        </div>

        {/* Active Session Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.05 }}
          className="mt-6 bg-gradient-to-br from-primary via-[#FFC12E] to-[#FF9F1C] p-6 rounded-[24px] shadow-[0_8px_20px_rgba(255,184,0,0.18),0_20px_45px_rgba(255,184,0,0.28)] relative overflow-hidden"
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-6 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-center gap-4 relative">
            <div>
              <span className="text-white/80 font-inter text-[11px] font-semibold tracking-[0.2em] uppercase">
                {activeStore ? 'Active Session' : 'No Store Selected'}
              </span>
              <h2 className="text-white font-poppins font-bold text-2xl mt-1.5">
                {activeStore ? 'Ready to Scan' : 'Scan a Store'}
              </h2>
              <p className="text-white/85 font-inter text-xs mt-1.5">
                {activeStore ? 'Tap to start scanning items' : 'Select a store to begin shopping'}
              </p>
            </div>
            <Link
              to={activeStore ? PATHS.SCANNER : PATHS.SCAN_STORE}
              className="flex-shrink-0 bg-white p-4 rounded-2xl shadow-[0_4px_14px_rgba(0,0,0,0.12)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.16)] hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <div className="text-2xl text-primary"><ScanQrCode /></div>
            </Link>
          </div>
        </motion.div>

        {/* Product Scan Section */}
        {activeStore && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 hidden"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Scan Product QR Button */}
              <button
                onClick={handleScanProduct}
                className={`bg-white p-5 rounded-[20px] ${SOFT_SHADOW} ${SOFT_SHADOW_HOVER} transition-all duration-200 active:scale-95 flex flex-col items-center gap-2.5`}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <ScanQrCode className="text-primary" size={22} />
                </div>
                <span className="text-on-surface font-poppins font-semibold text-sm">Scan Product</span>
                <span className="text-secondary font-inter text-xs">QR Code</span>
              </button>

              {/* Manual Product ID Button */}
              <button
                onClick={() => setShowProductIdInput(!showProductIdInput)}
                className={`bg-white p-5 rounded-[20px] ${SOFT_SHADOW} ${SOFT_SHADOW_HOVER} transition-all duration-200 active:scale-95 flex flex-col items-center gap-2.5`}
              >
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Keyboard className="text-secondary" size={22} />
                </div>
                <span className="text-on-surface font-poppins font-semibold text-sm">Enter Product</span>
                <span className="text-secondary font-inter text-xs">ID (Test)</span>
              </button>
            </div>

            {/* Product ID Input Modal */}
            {showProductIdInput && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className={`mt-4 bg-white p-5 rounded-[20px] ${SOFT_SHADOW}`}
              >
                <label className="block text-on-surface font-poppins font-semibold text-sm mb-3">
                  Enter Product ID
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleProductIdSubmit()}
                    placeholder="e.g., PROD-001"
                    className="flex-1 px-4 py-3 bg-background rounded-[16px] focus:outline-none focus:ring-4 focus:ring-primary/15 font-inter text-sm transition-all duration-200"
                    autoFocus
                  />
                  <button
                    onClick={handleProductIdSubmit}
                    disabled={!productId.trim()}
                    className="px-5 py-3 bg-primary text-white rounded-[16px] font-inter font-semibold text-sm hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Go
                  </button>
                </div>
              </motion.div>
            )}
          </motion.section>
        )}

        {/* Categories Section */}
        <section className="mt-8 hidden">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-on-surface font-poppins font-bold text-xl">Categories</h3>
            <button className="text-primary font-inter font-semibold text-sm hover:opacity-70 transition-opacity duration-200">See All</button>
          </div>
          <div className="grid grid-cols-6 gap-3">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity duration-200"
              >
                <div className={`w-16 h-16 ${cat.bg} rounded-full flex items-center justify-center text-2xl ${SOFT_SHADOW} ${SOFT_SHADOW_HOVER} transition-shadow duration-200`}>
                  {cat.emoji}
                </div>
                <p className="text-on-surface font-inter text-xs font-medium text-center">{cat.name}</p>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Nearby Stores */}
        <section className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-on-surface font-poppins font-bold text-xl">Nearby Stores</h3>
            <button className="text-primary font-inter font-semibold text-sm hover:opacity-70 transition-opacity duration-200">See All</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth [-webkit-overflow-scrolling:touch] -mx-4 px-4">
            <StoreCard name="FreshMart" distance="0.2 km" status="Open" statusColor="bg-green-100 text-green-700" />
            <StoreCard name="Organic Oasis" distance="1.5 km" status="Open" statusColor="bg-green-100 text-green-700" />
            <StoreCard name="Green Basket" distance="2.1 km" status="Busy" statusColor="bg-orange-100 text-orange-700" />
          </div>
        </section>

        {/* Flash Sale Banner */}
        <section className="mt-10">
          <div className="bg-gradient-to-br from-[#0d1b2a] to-[#16324a] p-6 rounded-[24px] shadow-[0_10px_30px_rgba(13,27,42,0.35)] relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="flex justify-between items-center gap-4 relative">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex items-center gap-1.5 bg-primary/20 text-primary px-3 py-1.5 rounded-full text-[11px] font-bold">
                    <Flame size={13} />
                    FLASH SALE
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[11px] font-bold">
                    <Clock size={13} />
                    04:23:15
                  </span>
                </div>
                <h3 className="text-white font-poppins font-bold text-2xl mb-2">Fresh Berries</h3>
                <p className="text-white/70 font-inter text-sm">Get 20% off all berries today. Limited stock!</p>
                <button className="mt-4 flex items-center gap-2 text-white font-inter font-bold text-sm hover:opacity-80 transition-opacity duration-200">
                  View Deal
                  <ChevronRight size={18} />
                </button>
              </div>
              <div className="flex-shrink-0 w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Sparkles className="text-primary" size={32} />
              </div>
            </div>
          </div>
        </section>

        {/* Today's Deals */}
        <section className="mt-10 mb-4 hidden">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-on-surface font-poppins font-bold text-xl">Today's Deals</h3>
            <button className="text-primary font-inter font-semibold text-sm hover:opacity-70 transition-opacity duration-200">See All</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {deals.map((deal) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${deal.bg} rounded-[24px] p-5 relative overflow-hidden ${SOFT_SHADOW} ${SOFT_SHADOW_HOVER} transition-shadow duration-200`}
              >
                <div className="absolute top-3 right-3 bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold">{deal.discount}%</div>
                <div className="flex flex-col h-full">
                  <div className="text-5xl text-center my-4">{deal.image}</div>
                  <h4 className="text-on-surface font-poppins font-semibold text-sm mt-2">{deal.name}</h4>
                  <div className="flex items-center gap-2 mt-3 mb-4">
                    <span className="text-on-surface font-poppins font-bold text-lg">${deal.price}</span>
                    <span className="text-secondary font-inter text-xs line-through">${deal.originalPrice}</span>
                  </div>
                  <button className="mt-auto bg-primary text-white rounded-[16px] py-2.5 flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-95 transition-all duration-200 font-inter font-semibold text-sm">
                    <Plus size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </motion.main>

      <BottomNav />
    </div>
  );
};

/**
 * Store Card Component
 * Displays individual store card with name, distance, and status
 *
 * @param {StoreCardProps} props - Store card properties
 * @returns {React.ReactElement} Store card element
 */
const StoreCard: React.FC<StoreCardProps> = ({ name, distance, status, statusColor }): React.ReactElement => {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      className={`flex-shrink-0 w-40 bg-white p-4 rounded-[24px] ${SOFT_SHADOW} ${SOFT_SHADOW_HOVER} hover:-translate-y-0.5 transition-all duration-200 text-left snap-center`}
    >
      <div className="w-full aspect-square rounded-2xl mb-3 flex items-center justify-center bg-primary/10">
        <ShoppingBag className="text-primary" size={28} />
      </div>
      <h4 className="text-on-surface font-poppins font-semibold text-sm">{name}</h4>
      <div className="flex items-center gap-1 mt-2">
        <Marker size={14} className="text-secondary" />
        <p className="text-secondary font-inter text-xs">{distance} away</p>
      </div>
      <div className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold mt-2 ${statusColor}`}>
        {status}
      </div>
    </motion.button>
  );
};

export default Home;
