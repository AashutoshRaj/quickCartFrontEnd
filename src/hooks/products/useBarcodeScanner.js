import { useState, useRef, useEffect, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

/**
 * Custom hook for managing barcode scanner lifecycle
 * Handles camera initialization, scanning, and cleanup
 */
export const useBarcodeScanner = (onScanSuccess, onScanError) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);
  const qrcodeRef = useRef(null);

  // Initialize scanner
  const initializeScanner = useCallback(async () => {
    if (qrcodeRef.current || isInitialized) return;

    try {
      setError(null);
      const qrcode = new Html5Qrcode('scanner-container');
      qrcodeRef.current = qrcode;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1,
        disableFlip: false,
        rememberLastUsedCamera: true,
        showTorchButtonIfSupported: true,
        useBarCodeDetectorIfSupported: true,
        formatsToSupport: [
          'QR_CODE',
          'EAN_13',
          'EAN_8',
          'CODE_128',
          'CODE_39',
          'UPC_A',
          'UPC_E',
          'ITF',
        ],
      };

      await qrcode.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          if (!isScanning) return;

          const trimmedBarcode = decodedText.trim();

          // Prevent duplicate scans
          if (scannerRef.current !== trimmedBarcode) {
            scannerRef.current = trimmedBarcode;
            setIsScanning(false);

            if (onScanSuccess) {
              onScanSuccess(trimmedBarcode);
            }
          }
        },
        (error) => {
          // Silently handle scanning errors (camera frame issues)
          if (onScanError && error && !error.message?.includes('Not found')) {
            // Only call error handler for actual errors, not "Not found" messages
          }
        }
      );

      setIsScanning(true);
      setIsInitialized(true);
    } catch (err) {
      setError(err.message || 'Failed to initialize camera');
      console.error('Scanner initialization error:', err);
    }
  }, [isInitialized, isScanning, onScanSuccess, onScanError]);

  // Stop scanner
  const stopScanner = useCallback(async () => {
    if (qrcodeRef.current) {
      try {
        await qrcodeRef.current.stop();
        await qrcodeRef.current.clear();
        qrcodeRef.current = null;
        setIsScanning(false);
        setIsInitialized(false);
        scannerRef.current = null;
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
  }, []);

  // Restart scanner
  const restartScanner = useCallback(async () => {
    await stopScanner();
    scannerRef.current = null;
    setIsInitialized(false);
    setError(null);
    // Small delay to ensure cleanup
    setTimeout(() => {
      initializeScanner();
    }, 100);
  }, [stopScanner, initializeScanner]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (qrcodeRef.current) {
        qrcodeRef.current
          .stop()
          .catch((err) => console.error('Cleanup error:', err));
      }
    };
  }, []);

  return {
    isInitialized,
    isScanning,
    error,
    initializeScanner,
    stopScanner,
    restartScanner,
  };
};
