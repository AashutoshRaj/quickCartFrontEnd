import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
    <div className="bg-green-600 text-white px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={18} />
          <div>
            <p className="text-xs opacity-90">Shopping at</p>
            <p className="font-semibold">{activeStore.name || activeStore.storeName}</p>
          </div>
        </div>
        {location.pathname === PATHS.SCANNER && (
          <button
            onClick={handleChangeStore}
            className="flex items-center gap-1 text-sm hover:bg-green-700 px-3 py-1 rounded transition-colors"
          >
            Change Store
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ActiveStoreBanner;
