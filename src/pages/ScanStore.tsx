import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, Camera, AlertCircle, Loader, MapPin, Phone, DollarSign, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import type { ActiveStore, RootState } from '../types/index';
import { PATHS } from '../app/paths';
import { useBarcodeScanner } from '../hooks/products/useBarcodeScanner.ts';
import { useScanStore } from '../hooks/stores/useScanStore.ts';
import { ScannerOverlay } from '../components/ScannerOverlay.tsx';
import StoreSwitchConfirmDialog from '../components/StoreSwitchConfirmDialog.tsx';
import { setActiveStore } from '../store/slices/storeSlice.ts';

/**
 * Scan Store Page Component
 * Handles store QR code scanning and store session activation
 * Displays store information and allows continuing to shopping
 *
 * @returns {React.ReactElement} Store scanner and selection page
 */
const ScanStore: React.FC = (): React.ReactElement => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const activeStore = useSelector((state: RootState) => state.store.activeStore);
  const [scannedStoreId, setScannedStoreId] = useState<string | null>(null);
  const [manualStoreId, setManualStoreId] = useState<string>('');
  const [showStoreInfo, setShowStoreInfo] = useState<boolean>(false);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [pendingStore, setPendingStore] = useState<ActiveStore | null>(null);
  const hasShownStoreRef = useRef<boolean>(false);

  console.log('ScanStore component mounted');

  const { data: store, isLoading: isSearching, error: searchError } = useScanStore(
    scannedStoreId || '',
    { enabled: !!scannedStoreId }
  );

  console.log('storeInfoooooo', store, 'scannedStoreId', scannedStoreId, 'isSearching', isSearching, 'error', searchError);
  const {
    isInitialized,
    isScanning,
    error: scannerError,
    initializeScanner,
    stopScanner,
    restartScanner,
  } = useBarcodeScanner(
    (storeId: string) => {
      console.log('Scanner success:', storeId);
      setScannedStoreId(storeId);
      toast.success(`Store ID scanned: ${storeId}`);
    },
    (error: Error) => {
      console.error('Scan error:', error);
    }
  );

  console.log('Scanner state:', { isInitialized, isScanning, scannerError });

  useEffect(() => {
    console.log('Initializing scanner...');
    initializeScanner().then(() => console.log('Scanner initialized')).catch(err => console.error('Init error:', err));
    return () => {
      console.log('Stopping scanner...');
      stopScanner();
    };
  }, [initializeScanner, stopScanner]);

  useEffect(() => {
    if (store && scannedStoreId && !hasShownStoreRef.current) {
      stopScanner();
      hasShownStoreRef.current = true;
      setShowStoreInfo(true);
      toast.success('Store loaded successfully!');
    }
  }, [store, scannedStoreId, stopScanner]);

  useEffect(() => {
    if (searchError) {
      if ((searchError as any).response?.status === 404) {
        toast.error('Store not found. Try another ID.');
      } else if ((searchError as any).response?.status === 400) {
        toast.error((searchError as any).response?.data?.message || 'Store is not available');
      } else {
        toast.error((searchError as Error).message || 'Failed to load store');
      }
      const timer = setTimeout(() => {
        setScannedStoreId(null);
        restartScanner();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [searchError, restartScanner]);

  useEffect(() => {
    if (scannerError) {
      toast.error(scannerError);
    }
  }, [scannerError]);

  const handleManualSearch = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    if (!manualStoreId.trim()) {
      toast.error('Please enter a Store ID');
      return;
    }
    setScannedStoreId(manualStoreId.trim());
  };

  const handleContinueShopping = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    if (store && !isNavigating) {
      // Check if switching stores with existing cart
      if (activeStore?.storeId && activeStore.storeId !== (store as ActiveStore).storeId) {
        setPendingStore(store as ActiveStore);
        setShowConfirmDialog(true);
        return;
      }

      await proceedWithStoreSwitch(store as ActiveStore);
    }
  };

  const proceedWithStoreSwitch = async (newStore: ActiveStore): Promise<void> => {
    setIsNavigating(true);
    try {
      await Promise.race([stopScanner(), new Promise(r => setTimeout(r, 500))]);
      console.log('Dispatching store to Redux:', newStore);
      dispatch(setActiveStore(newStore));
      // Clear cart in localStorage
      localStorage.removeItem('cartItems');
      localStorage.removeItem('cart');
      toast.success('Store session activated');
      navigate(PATHS.HOME);
    } catch (error) {
      console.error('Error saving store:', error);
      navigate(PATHS.HOME);
    } finally {
      setIsNavigating(false);
    }
  };

  const handleConfirmSwitch = (): void => {
    if (pendingStore) {
      proceedWithStoreSwitch(pendingStore);
      setShowConfirmDialog(false);
      setPendingStore(null);
    }
  };

  const handleCancelSwitch = (): void => {
    setShowConfirmDialog(false);
    setPendingStore(null);
  };

  const handleScanAnother = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    try {
      hasShownStoreRef.current = false;
      setScannedStoreId(null);
      setManualStoreId('');
      setShowStoreInfo(false);
      await restartScanner();
      toast.info('Ready to scan another store');
    } catch (error) {
      console.error('Error restarting scanner:', error);
    }
  };

  const handleBackButton = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    try {
      await Promise.race([stopScanner(), new Promise(r => setTimeout(r, 500))]);
    } catch (error) {
      console.error('Error stopping scanner:', error);
    } finally {
      navigate(-1);
    }
  };

  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setManualStoreId(e.target.value);
  };

  const handleManualInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      const button = e.currentTarget.nextElementSibling as HTMLButtonElement | null;
      if (button) {
        button.click();
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 via-black to-black flex flex-col pb-24 relative overflow-hidden">
      {/* Store Switch Confirmation Dialog */}
      <StoreSwitchConfirmDialog
        isOpen={showConfirmDialog}
        onConfirm={handleConfirmSwitch}
        onCancel={handleCancelSwitch}
        isLoading={isNavigating}
      />

      {/* Header */}
      <header className="w-full px-4 py-6 flex items-center justify-between relative z-20 bg-black/50 backdrop-blur-md border-b border-white/10">
        <button
          onClick={handleBackButton}
          className="bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-xl border border-white/20 transition-all active:scale-95"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>
        <h1 className="text-white font-bold text-lg">Scan Store QR Code</h1>
        <div className="w-10" />
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full flex flex-col items-center justify-end relative overflow-hidden bg-gradient-to-b from-gray-900 via-black to-black">
        {!showStoreInfo && !isInitialized && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
              <p className="text-white/70 text-sm">Initializing camera...</p>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait" onExitComplete={() => null}>
          {/* Scanner View */}
          {!showStoreInfo ? (
            <motion.div
              key="scanner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center justify-center space-y-6 px-4"
            >
              {/* Scanner Container */}
              <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden bg-black border-2 border-white/20 shadow-2xl">
                <div
                  id="scanner-container"
                  className="w-full h-full"
                  style={{ display: 'block', visibility: isInitialized ? 'visible' : 'hidden' }}
                />

                {!isInitialized && (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-black">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="text-white"
                    >
                      <Loader size={40} />
                    </motion.div>
                  </div>
                )}

                {isInitialized && (
                  <ScannerOverlay
                    isScanning={isScanning && !isSearching}
                    scannedBarcode={scannedStoreId}
                  />
                )}

                {isSearching && (
                  <motion.div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                      <Loader size={40} className="text-blue-400" />
                    </motion.div>
                  </motion.div>
                )}
              </div>

              {!scannedStoreId && isInitialized && !scannerError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center space-y-3 px-4"
                >
                  <motion.div
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Camera size={32} className="mx-auto text-white/60" />
                  </motion.div>
                  <p className="text-white/70 text-sm font-medium">
                    Position store QR code in frame
                  </p>
                  <p className="text-white/50 text-xs">
                    Or enter Store ID manually below
                  </p>
                </motion.div>
              )}

              {scannerError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 max-w-md w-full px-4"
                >
                  <AlertCircle size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-300 text-sm font-semibold">Camera Not Available</p>
                    <p className="text-yellow-200/80 text-xs mt-1">
                      Please grant camera permission or use manual entry below
                    </p>
                  </div>
                </motion.div>
              )}

              {searchError && !scannerError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-lg p-4 max-w-md w-full px-4"
                >
                  <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-300 text-sm font-semibold">Store Not Found</p>
                    <p className="text-red-200/80 text-xs mt-1">
                      {(searchError as any)?.response?.data?.message || 'Unable to find store. Check Store ID and try again.'}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Manual Input Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full max-w-md space-y-3"
              >
                <div className="text-center text-white/50 text-xs font-medium">OR</div>
                <div className="space-y-2">
                  <label className="block text-white/70 text-sm font-medium">
                    Enter Store ID
                  </label>
                  <input
                    type="text"
                    value={manualStoreId}
                    onChange={handleManualInputChange}
                    onKeyPress={handleManualInputKeyPress}
                    placeholder="Store ID"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-blue-400/50 focus:bg-white/15 transition-all"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleManualSearch}
                    disabled={isSearching || !manualStoreId.trim()}
                    className="w-full px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    {isSearching ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Load Store'
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          ) : null}

          {/* Store Info Card View */}
          {showStoreInfo && store && (
            <motion.div
              key="store-info"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="w-full px-4 py-8"
            >
              <motion.div
                className="max-w-md mx-auto bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl overflow-hidden shadow-2xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {/* Store Logo */}
                {store.logo && (
                  <div className="w-full h-48 bg-gradient-to-br from-gray-800 to-black overflow-hidden">
                    <img
                      src={store.logo}
                      alt={store.name || store.storeName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Store Details */}
                <div className="p-6 space-y-4">
                  <div>
                    <h2 className="text-white text-2xl font-bold">{store.name}</h2>
                    <p className={`text-xs font-semibold mt-2 ${
                      store.status === 'active' ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {store.status === 'active' ? '✓ Open' : 'Currently Closed'}
                    </p>
                  </div>

                  {/* Info Items */}
                  <div className="space-y-3">
                    {/* Address */}
                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white/70 text-xs">Address</p>
                        <p className="text-white text-sm font-medium">{store.address}</p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-3">
                      <Phone size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white/70 text-xs">Phone</p>
                        <p className="text-white text-sm font-medium">{store.phoneNumber || store.phone}</p>
                      </div>
                    </div>

                    {/* Currency */}
                    <div className="flex items-start gap-3">
                      <DollarSign size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white/70 text-xs">Currency</p>
                        <p className="text-white text-sm font-medium">{store.currency}</p>
                      </div>
                    </div>

                    {/* Timezone */}
                    <div className="flex items-start gap-3">
                      <Globe size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white/70 text-xs">Timezone</p>
                        <p className="text-white text-sm font-medium">{store.timezone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 space-y-2">
                    <motion.button
                      whileHover={!isNavigating ? { scale: 1.02 } : {}}
                      whileTap={!isNavigating ? { scale: 0.98 } : {}}
                      onClick={handleContinueShopping}
                      disabled={isNavigating}
                      className="w-full px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      {isNavigating ? (
                        <>
                          <Loader size={18} className="animate-spin" />
                          Loading...
                        </>
                      ) : (
                        'Continue Shopping'
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={!isNavigating ? { scale: 1.02 } : {}}
                      whileTap={!isNavigating ? { scale: 0.98 } : {}}
                      onClick={handleScanAnother}
                      disabled={isNavigating}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 text-white font-semibold transition-all"
                    >
                      {isNavigating ? 'Processing...' : 'Scan Another Store'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ScanStore;
