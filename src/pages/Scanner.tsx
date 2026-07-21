import React, { useEffect, useState } from 'react';
import { ChevronLeft, Camera, AlertCircle, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { Product } from '../types/index';
import { useBarcodeScanner } from '../hooks/products/useBarcodeScanner.ts';
import { useBarcodeSearch } from '../hooks/products/useBarcodeSearch.ts';
import { ScannerOverlay } from '../components/ScannerOverlay.tsx';
import { ProductCard } from '../components/ProductCard.tsx';
import BottomNav from '../components/BottomNav.tsx';
import { useAddToCart } from '../hooks/cart/useAddToCart.ts';

/**
 * Scanner Page Component
 * Handles barcode scanning for product lookup and cart addition
 * Uses device camera for real-time barcode detection
 *
 * @returns {React.ReactElement} Scanner page with camera feed and product display
 */
const Scanner: React.FC = (): React.ReactElement => {
  const navigate = useNavigate();
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
  const [showProduct, setShowProduct] = useState<boolean>(false);
  const addToCartMutation = useAddToCart();

  // Barcode search hook (only enabled when barcode is scanned)
  const { data: product, isLoading: isSearching, error: searchError } = useBarcodeSearch(
    scannedBarcode,
    { enabled: !!scannedBarcode }
  );

  // Barcode scanner hook
  const {
    isInitialized,
    isScanning,
    error: scannerError,
    initializeScanner,
    stopScanner,
    restartScanner,
  } = useBarcodeScanner(
    (barcode: string) => {
      // On successful scan
      setScannedBarcode(barcode);
      toast.success(`Barcode scanned: ${barcode}`);
    },
    (error: Error) => {
      console.error('Scan error:', error);
    }
  );

  // Initialize scanner on mount
  useEffect(() => {
    initializeScanner();
    return () => {
      stopScanner();
    };
  }, []);

  // Handle product found
  useEffect(() => {
    if (product && scannedBarcode) {
      stopScanner();
      setShowProduct(true);
      toast.success('Product found!');
    }
  }, [product, scannedBarcode]);

  // Handle search errors
  useEffect(() => {
    if (searchError) {
      if ((searchError as any).response?.status === 404) {
        toast.error('Product not found. Try another barcode.');
      } else {
        toast.error((searchError as Error).message || 'Failed to search product');
      }
      // Reset for another scan
      setTimeout(() => {
        setScannedBarcode(null);
        restartScanner();
      }, 2000);
    }
  }, [searchError]);

  // Handle scanner errors
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
        navigate('/cart');
      }, 500);
    } catch (error) {
      // handled by mutation error toast
    }
  };

  const handleScanAnother = async (): Promise<void> => {
    setScannedBarcode(null);
    setShowProduct(false);
    await restartScanner();
    toast.info('Ready to scan another product');
  };

  const handleManualInput = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    const barcode = prompt('Enter barcode manually:');
    if (barcode) {
      setScannedBarcode(barcode.trim());
    }
  };

  const handleNavigateBack = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-black flex flex-col pb-24 relative overflow-hidden">
      {/* Header */}
      <header className="px-4 py-6 flex items-center justify-between relative z-20 bg-black/50 backdrop-blur-md border-b border-white/10">
        <button
          onClick={handleNavigateBack}
          className="bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-xl border border-white/20 transition-all active:scale-95"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>
        <h1 className="text-white font-bold text-lg">Scan Product</h1>
        <div className="w-10" /> {/* Spacer for alignment */}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-end relative overflow-hidden">
        <AnimatePresence mode="wait">
          {/* Scanner View */}
          {!showProduct ? (
            <motion.div
              key="scanner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center justify-center space-y-6"
            >
              {/* Scanner Container */}
              <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden bg-black border-2 border-white/20 shadow-2xl">
                {/* Camera Feed */}
                <div
                  id="scanner-container"
                  className="w-full h-full"
                  style={{ display: isInitialized ? 'block' : 'none' }}
                />

                {/* Placeholder when initializing */}
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

                {/* Scanner Overlay */}
                {isInitialized && (
                  <ScannerOverlay
                    isScanning={isScanning && !isSearching}
                    scannedBarcode={scannedBarcode}
                  />
                )}

                {/* Loading Indicator */}
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

              {/* Status Messages */}
              {scannedBarcode && !isSearching && !product && !searchError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-2"
                >
                  <Loader className="animate-spin mx-auto text-blue-400" size={24} />
                  <p className="text-white/70 text-sm">Searching for product...</p>
                </motion.div>
              )}

              {!scannedBarcode && isInitialized && !scannerError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center space-y-3"
                >
                  <motion.div
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Camera size={32} className="mx-auto text-white/60" />
                  </motion.div>
                  <p className="text-white/70 text-sm font-medium">
                    Position barcode in frame
                  </p>
                  <p className="text-white/50 text-xs">
                    Supports EAN, UPC, Code-128 and QR codes
                  </p>
                </motion.div>
              )}

              {/* Error Display */}
              {(scannerError || searchError) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-lg p-4 max-w-md w-full"
                >
                  <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-300 text-sm font-semibold">Error</p>
                    <p className="text-red-200/80 text-xs mt-1">
                      {scannerError || 'Unable to find product. Please try again.'}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Manual Input Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleManualInput}
                className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold transition-all backdrop-blur-md"
              >
                Type Barcode Manually
              </motion.button>
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

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Scanner;
