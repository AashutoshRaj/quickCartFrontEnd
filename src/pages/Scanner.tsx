import React, { useEffect, useState } from 'react';
import { ChevronLeft, Bell, AlertCircle, Loader, Keyboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import type { Product, RootState } from '../types/index';
import { PATHS } from '../app/paths';
import { useBarcodeScanner } from '../hooks/products/useBarcodeScanner.ts';
import { useBarcodeSearch } from '../hooks/products/useBarcodeSearch.ts';
import { ScannerViewfinder } from '../components/ScannerViewfinder.tsx';
import { ProductCard } from '../components/ProductCard.tsx';
import ActiveStoreBanner from '../components/ActiveStoreBanner.tsx';
import BottomNav from '../components/BottomNav.tsx';
import { useAddToCart } from '../hooks/cart/useAddToCart.ts';

/**
 * Scanner Page Component
 * "Scan Product" check-in style screen for barcode scanning and cart addition
 *
 * @returns {React.ReactElement} Scanner page with camera feed and product display
 */
const Scanner: React.FC = (): React.ReactElement => {
  const navigate = useNavigate();
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
  const [showProduct, setShowProduct] = useState<boolean>(false);
  const [showManualInput, setShowManualInput] = useState<boolean>(false);
  const [manualBarcode, setManualBarcode] = useState<string>('');
  const addToCartMutation = useAddToCart();
  const activeStore = useSelector((state: RootState) => state.store.activeStore);

  const { data: product, isLoading: isSearching, error: searchError } = useBarcodeSearch(
    scannedBarcode || '',
    activeStore?.storeId,
    { enabled: !!scannedBarcode && !!activeStore?.storeId }
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
    (barcode: string) => {
      setScannedBarcode(barcode);
      toast.success(`Barcode scanned: ${barcode}`);
    },
    (error: Error) => {
      console.error('Scan error:', error);
    }
  );

  useEffect(() => {
    if (!activeStore?.storeId) {
      toast.error('Please scan the store QR code before scanning products.');
      navigate(PATHS.SCAN_STORE);
    }
  }, [activeStore, navigate]);

  useEffect(() => {
    if (activeStore?.storeId) {
      initializeScanner();
    }
    return () => {
      stopScanner();
    };
  }, [activeStore, initializeScanner, stopScanner]);

  useEffect(() => {
    if (product && scannedBarcode) {
      stopScanner();
      setShowProduct(true);
      toast.success('Product found!');
    }
  }, [product, scannedBarcode]);

  useEffect(() => {
    if (searchError) {
      if ((searchError as any).response?.status === 404) {
        toast.error('Product not found. Try another barcode.');
      } else {
        toast.error((searchError as Error).message || 'Failed to search product');
      }
      setTimeout(() => {
        setScannedBarcode(null);
        restartScanner();
      }, 2000);
    }
  }, [searchError]);

  useEffect(() => {
    if (scannerError) {
      toast.error(scannerError);
    }
  }, [scannerError]);

  const handleAddToCart = async (quantity: number = 1): Promise<void> => {
    if (!product) return;

    try {
      await addToCartMutation.mutateAsync({
        productId: product._id || product.id || '',
        quantity,
        storeId: localStorage.getItem('activeStoreId') || 'default-store',
      });
      setTimeout(() => {
        navigate(PATHS.CART);
      }, 500);
    } catch (error) {
      // handled by mutation error toast
    }
  };

  const handleScanAnother = async (): Promise<void> => {
    setScannedBarcode(null);
    setShowProduct(false);
    setManualBarcode('');
    setShowManualInput(false);
    await restartScanner();
    toast.info('Ready to scan another product');
  };

  const handleManualSearch = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      setScannedBarcode(manualBarcode.trim());
    }
  };

  const handleManualInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && manualBarcode.trim()) {
      setScannedBarcode(manualBarcode.trim());
    }
  };

  const handleNavigateBack = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    navigate(-1);
  };

  const statusText = scannedBarcode || isSearching
    ? 'Searching...'
    : isScanning
      ? 'Scanning...'
      : 'Position Barcode in Center';

  return (
    <div className="w-full h-full bg-[#0b1220] flex flex-col relative overflow-hidden pb-24">
      <ActiveStoreBanner />

      {/* Header */}
      <header className="w-full px-4 py-4 flex items-center justify-between relative z-20 bg-[#0b1220]">
        <button
          onClick={handleNavigateBack}
          className="bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all active:scale-95"
        >
          <ChevronLeft size={22} className="text-white" />
        </button>
        <h1 className="text-white font-bold text-lg">QuickCart</h1>
        <button className="bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all active:scale-95">
          <Bell size={20} className="text-white" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full flex flex-col items-center relative overflow-y-auto px-6 pt-6">
        <AnimatePresence mode="wait">
          {!showProduct ? (
            <motion.div
              key="scanner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center space-y-8"
            >
              <div className="text-center space-y-1.5">
                <h2 className="text-white text-2xl font-bold">Scan Product</h2>
                <p className="text-primary-container text-sm font-medium">
                  Scan the product barcode to add to cart
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
                    <p className="text-yellow-300 text-sm font-semibold">Camera Not Available</p>
                    <p className="text-yellow-200/80 text-xs mt-1">
                      Please grant camera permission or type barcode manually
                    </p>
                  </div>
                </motion.div>
              )}

              {searchError && !scannerError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 max-w-md w-full"
                >
                  <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-300 text-sm font-semibold">Product Not Found</p>
                    <p className="text-red-200/80 text-xs mt-1">
                      Product not available in this store. Try another barcode.
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
                  Type barcode manually
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-sm space-y-2"
                >
                  <input
                    type="text"
                    value={manualBarcode}
                    onChange={(e) => setManualBarcode(e.target.value)}
                    onKeyPress={handleManualInputKeyPress}
                    placeholder="Enter barcode"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-primary focus:bg-white/15 transition-all text-sm"
                    autoFocus
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleManualSearch}
                    disabled={isSearching || !manualBarcode.trim()}
                    className="w-full px-4 py-3 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    {isSearching ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Searching...
                      </>
                    ) : (
                      'Search'
                    )}
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          ) : null}

          {/* Product Card View */}
          {showProduct && product && (
            <motion.div
              key="product"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
                isAdding={addToCartMutation.isPending}
                onScanAnother={handleScanAnother}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
};

export default Scanner;
