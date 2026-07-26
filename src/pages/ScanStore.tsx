import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, Bell, AlertCircle, Loader, MapPin, Phone, DollarSign, Globe, Copy, QrCode, X, ShoppingBag, Keyboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';
import type { ActiveStore, RootState } from '../types/index';
import { PATHS } from '../app/paths';
import { useBarcodeScanner } from '../hooks/products/useBarcodeScanner.ts';
import { useScanStore } from '../hooks/stores/useScanStore.ts';
import { ScannerViewfinder } from '../components/ScannerViewfinder.tsx';
import StoreSwitchConfirmDialog from '../components/StoreSwitchConfirmDialog.tsx';
import BottomNav from '../components/BottomNav.tsx';
import { setActiveStore } from '../store/slices/storeSlice.ts';

/**
 * Scan Store Page Component
 * "Check-In" screen: scan a store QR code (or enter Store ID manually) to start a shopping session
 *
 * @returns {React.ReactElement} Store check-in and selection page
 */
const ScanStore: React.FC = (): React.ReactElement => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const activeStore = useSelector((state: RootState) => state.store.activeStore);
  const [scannedStoreId, setScannedStoreId] = useState<string | null>(null);
  const [manualStoreId, setManualStoreId] = useState<string>('');
  const [showManualInput, setShowManualInput] = useState<boolean>(false);
  const [showStoreInfo, setShowStoreInfo] = useState<boolean>(false);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [pendingStore, setPendingStore] = useState<ActiveStore | null>(null);
  const [showUrlQR, setShowUrlQR] = useState<boolean>(false);
  const hasShownStoreRef = useRef<boolean>(false);

  const storeUrl = `${window.location.origin}${PATHS.SCAN_STORE}`;

  const { data: store, isLoading: isSearching, error: searchError } = useScanStore(
    scannedStoreId || '',
    { enabled: !!scannedStoreId }
  );
  const {
    isInitialized,
    isScanning,
    error: scannerError,
    torchOn,
    toggleTorch,
    initializeScanner,
    stopScanner,
    restartScanner,
  } = useBarcodeScanner(
    (storeId: string) => {
      setScannedStoreId(storeId);
      toast.success('Store found!');
    }
  );

  useEffect(() => {
    initializeScanner().catch(err => console.error('Init error:', err));
    return () => {
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
      dispatch(setActiveStore(newStore));
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

  const handleCopyUrl = (): void => {
    navigator.clipboard.writeText(storeUrl);
    toast.success('URL copied to clipboard!');
  };

  const statusText = scannedStoreId || isSearching
    ? 'Searching...'
    : isScanning
      ? 'Scanning...'
      : 'Position QR in Center';

  return (
    <div className="w-full h-full bg-[#0b1220] flex flex-col relative overflow-hidden pb-24">
      {/* Store Switch Confirmation Dialog */}
      <StoreSwitchConfirmDialog
        isOpen={showConfirmDialog}
        onConfirm={handleConfirmSwitch}
        onCancel={handleCancelSwitch}
        isLoading={isNavigating}
      />

      {/* Share URL + QR Modal */}
      <AnimatePresence>
        {showUrlQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowUrlQR(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8 max-w-sm w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-xl font-bold">Share Store Link</h2>
                <button
                  onClick={() => setShowUrlQR(false)}
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex justify-center p-4 bg-white rounded-xl">
                  <QRCodeSVG value={storeUrl} size={200} level="H" />
                </div>

                <div className="space-y-2">
                  <p className="text-white/70 text-xs font-medium">Store Scanning URL</p>
                  <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg p-3">
                    <input
                      type="text"
                      value={storeUrl}
                      readOnly
                      className="flex-1 bg-transparent text-white text-sm outline-none"
                    />
                    <button
                      onClick={handleCopyUrl}
                      className="bg-white/20 hover:bg-white/30 p-2 rounded transition-all flex-shrink-0"
                      title="Copy URL"
                    >
                      <Copy size={18} className="text-white" />
                    </button>
                  </div>
                </div>

                <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                  <p className="text-white/80 text-sm">
                    <strong className="text-primary-container">Share this:</strong> Print the QR code or send the link to customers so they can scan to access the store check-in page.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="w-full px-4 py-4 flex items-center justify-between relative z-20 bg-[#0b1220]">
        <button
          onClick={handleBackButton}
          className="bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all active:scale-95"
        >
          <ChevronLeft size={22} className="text-white" />
        </button>
        <h1 className="text-white font-bold text-lg">QuickCart</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUrlQR(true)}
            className="bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all active:scale-95"
            title="Share store check-in link"
          >
            <QrCode size={20} className="text-white" />
          </button>
          <button className="bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all active:scale-95">
            <Bell size={20} className="text-white" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full flex flex-col items-center relative overflow-y-auto px-6 pt-6">
        <AnimatePresence mode="wait" onExitComplete={() => null}>
          {!showStoreInfo ? (
            <motion.div
              key="scanner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center space-y-8"
            >
              <div className="text-center space-y-1.5">
                <h2 className="text-white text-2xl font-bold">Check-In</h2>
                <p className="text-primary-container text-sm font-medium">
                  Scan the store QR code to start shopping
                </p>
              </div>

              <ScannerViewfinder
                isInitialized={isInitialized}
                isScanning={isScanning}
                isBusy={isSearching}
                statusText={statusText}
                torchOn={torchOn}
                onToggleTorch={toggleTorch}
              />

              {scannerError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 max-w-md w-full"
                >
                  <AlertCircle size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-300 text-sm font-semibold">Camera Access Denied</p>
                    <p className="text-yellow-200/80 text-xs mt-1">
                      Use Store ID entry below or enable camera in browser settings
                    </p>
                  </div>
                </motion.div>
              )}

              {searchError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 max-w-md w-full"
                >
                  <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-300 text-sm font-semibold">Store Not Found</p>
                    <p className="text-red-200/80 text-xs mt-1">
                      {(searchError as any)?.response?.data?.message || 'Unable to find store. Check ID and try again.'}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Manual Entry Toggle */}
              {!showManualInput ? (
                <button
                  onClick={() => setShowManualInput(true)}
                  className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors"
                >
                  <Keyboard size={16} />
                  Enter Store ID manually
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-sm space-y-2"
                >
                  <input
                    type="text"
                    value={manualStoreId}
                    onChange={handleManualInputChange}
                    onKeyPress={handleManualInputKeyPress}
                    placeholder="Enter Store ID"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-primary focus:bg-white/15 transition-all text-sm"
                    autoFocus
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleManualSearch}
                    disabled={isSearching || !manualStoreId.trim()}
                    className="w-full px-4 py-3 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    {isSearching ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Continue'
                    )}
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            /* Store Info Card View */
            store && (
              <motion.div
                key="store-info"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="w-full pb-8"
              >
                <motion.div
                  className="max-w-md mx-auto bg-gradient-to-br from-white/15 via-white/10 to-white/5 border border-white/30 rounded-3xl overflow-hidden shadow-2xl"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {store.logo ? (
                    <div className="w-full h-56 bg-gradient-to-br from-gray-800 to-black overflow-hidden relative">
                      <img
                        src={store.logo}
                        alt={store.name || store.storeName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                  ) : (
                    <div className="w-full h-56 bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                      <ShoppingBag size={64} className="text-white/40" />
                    </div>
                  )}

                  <div className="p-7 space-y-5">
                    <div>
                      <h2 className="text-white text-3xl font-bold mb-2">{store.name || store.storeName}</h2>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                        store.status === 'active'
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${store.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                        {store.status === 'active' ? 'Open Now' : 'Closed'}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {store.address && (
                        <div className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/10">
                          <MapPin size={20} className="text-primary-container flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Address</p>
                            <p className="text-white text-sm font-medium mt-1">{store.address}</p>
                          </div>
                        </div>
                      )}

                      {(store.phoneNumber || store.phone) && (
                        <div className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/10">
                          <Phone size={20} className="text-primary-container flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Contact</p>
                            <p className="text-white text-sm font-medium mt-1">{store.phoneNumber || store.phone}</p>
                          </div>
                        </div>
                      )}

                      {store.currency && (
                        <div className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/10">
                          <DollarSign size={20} className="text-primary-container flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Currency</p>
                            <p className="text-white text-sm font-medium mt-1">{store.currency}</p>
                          </div>
                        </div>
                      )}

                      {store.timezone && (
                        <div className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/10">
                          <Globe size={20} className="text-primary-container flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Timezone</p>
                            <p className="text-white text-sm font-medium mt-1">{store.timezone}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 space-y-3 border-t border-white/10">
                      <motion.button
                        whileHover={!isNavigating ? { scale: 1.02 } : {}}
                        whileTap={!isNavigating ? { scale: 0.98 } : {}}
                        onClick={handleContinueShopping}
                        disabled={isNavigating}
                        className="w-full px-5 py-3.5 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-lg"
                      >
                        {isNavigating ? (
                          <>
                            <Loader size={18} className="animate-spin" />
                            Activating Session...
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={18} />
                            Start Shopping
                          </>
                        )}
                      </motion.button>
                      <motion.button
                        whileHover={!isNavigating ? { scale: 1.02 } : {}}
                        whileTap={!isNavigating ? { scale: 0.98 } : {}}
                        onClick={handleScanAnother}
                        disabled={isNavigating}
                        className="w-full px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 hover:border-white/40 text-white font-semibold transition-all"
                      >
                        {isNavigating ? 'Processing...' : 'Scan Different Store'}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
};

export default ScanStore;
