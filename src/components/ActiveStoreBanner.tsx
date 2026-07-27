import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { MapPin, ChevronRight } from 'lucide-react';
import type { RootState } from '../types/index';
import { PATHS } from '../app/paths';

const ActiveStoreBanner: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeStore = useSelector((state: RootState) => state.store.activeStore);

  if (!activeStore?.storeId) {
    return null;
  }

  const handleChangeStore = () => {
    navigate(PATHS.SCAN_STORE);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="px-4 pt-4"
    >
      <div className="flex items-center justify-between gap-3 bg-white/10 backdrop-blur-xl rounded-[18px] px-4 py-3 ring-1 ring-white/10">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <MapPin size={15} className="text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-white/60 font-inter text-[10px] uppercase tracking-wider">Shopping at</p>
            <p className="text-white font-poppins font-semibold text-sm truncate">{activeStore.name || activeStore.storeName}</p>
          </div>
        </div>
        {location.pathname === PATHS.SCANNER && (
          <button
            onClick={handleChangeStore}
            className="flex items-center gap-1 text-primary text-xs font-semibold hover:opacity-70 transition-opacity duration-200 flex-shrink-0"
          >
            Change
            <ChevronRight size={14} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ActiveStoreBanner;
