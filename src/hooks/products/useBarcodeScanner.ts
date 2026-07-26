/**
 * Barcode Scanner Hook
 * Manages HTML5 QR code scanner lifecycle and scanning operations
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import type { BarcodeScannerHookResult, ScanSuccessCallback, ScanErrorCallback } from '../../types/index';

/**
 * Hook for managing barcode/QR code scanning
 *
 * Handles camera initialization, scanning state, error management,
 * and cleanup of scanner resources.
 *
 * @param {ScanSuccessCallback} onScanSuccess - Callback when barcode is successfully scanned
 * @param {ScanErrorCallback} onScanError - Callback when scanning error occurs
 * @returns {BarcodeScannerHookResult} Scanner state and control methods
 * @returns {boolean} isInitialized - Whether scanner is initialized
 * @returns {boolean} isScanning - Whether actively scanning
 * @returns {string | null} error - Error message if initialization failed
 * @returns {Function} initializeScanner - Async function to initialize scanner
 * @returns {Function} stopScanner - Async function to stop scanning
 * @returns {Function} restartScanner - Async function to restart scanning
 *
 * @remarks
 * - Requires 'scanner-container' HTML element to be present in DOM
 * - Supports multiple barcode formats (QR, EAN, CODE_128, etc.)
 * - Prevents duplicate scans with internal ref tracking
 * - Automatically enables torch control if supported
 * - Cleans up camera resources on unmount
 *
 * @example
 * const {
 *   isInitialized,
 *   isScanning,
 *   error,
 *   initializeScanner
 * } = useBarcodeScanner(
 *   (barcode) => console.log('Scanned:', barcode),
 *   (error) => console.error('Scan error:', error)
 * );
 *
 * useEffect(() => {
 *   initializeScanner();
 * }, [initializeScanner]);
 */
export const useBarcodeScanner = (
  onScanSuccess?: ScanSuccessCallback,
  onScanError?: ScanErrorCallback
): BarcodeScannerHookResult => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const scannerRef = useRef<string | null>(null);
  const qrcodeRef = useRef<Html5Qrcode | null>(null);

  /**
   * Initialize barcode scanner with camera access
   */
  const initializeScanner = useCallback(async (): Promise<void> => {
    if (qrcodeRef.current) {
      console.log('Scanner already initialized');
      return;
    }

    try {
      setError(null);
      console.log('Starting scanner initialization...');

      /**
       * Create scanner instance targeting scanner-container element
       */
      const qrcode = new Html5Qrcode('scanner-container');
      qrcodeRef.current = qrcode;

      /**
       * Configure scanner with optimal settings
       */
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

      /**
       * Start scanning with callbacks
       */
      await qrcode.start(
        { facingMode: 'environment' },
        config,
        (decodedText: string) => {
          const trimmedBarcode = decodedText.trim();

          /**
           * Prevent duplicate scans
           */
          if (scannerRef.current !== trimmedBarcode) {
            scannerRef.current = trimmedBarcode;
            setIsScanning(false);

            if (onScanSuccess) {
              onScanSuccess(trimmedBarcode);
            }
          }
        },
        () => {
          // Silently ignore all frame parsing errors
          // IndexSizeError, parse errors are normal during scanning
          // Only actual permission/init errors should be caught
        }
      );

      setIsScanning(true);
      setIsInitialized(true);
      console.log('Scanner initialized successfully');
    } catch (err) {
      const errorMessage = (err as Error)?.message || 'Failed to initialize camera';
      setError(errorMessage);
      console.error('Scanner initialization error:', err);
    }
  }, [onScanSuccess, onScanError]);

  /**
   * Toggle device torch/flashlight if supported
   */
  const toggleTorch = useCallback(async (): Promise<void> => {
    if (!qrcodeRef.current) return;
    try {
      const nextState = !torchOn;
      await qrcodeRef.current.applyVideoConstraints({
        advanced: [{ torch: nextState } as MediaTrackConstraintSet],
      });
      setTorchOn(nextState);
    } catch (err) {
      console.debug('Torch not supported:', err);
    }
  }, [torchOn]);

  /**
   * Stop scanner and cleanup resources
   */
  const stopScanner = useCallback(async (): Promise<void> => {
    if (qrcodeRef.current) {
      try {
        try {
          await qrcodeRef.current.stop();
        } catch (stopErr) {
          // Ignore "not running" errors on stop
          if (!(stopErr as Error).message?.includes('not running')) {
            throw stopErr;
          }
        }
        try {
          await qrcodeRef.current.clear();
        } catch (clearErr) {
          console.debug('Clear error (ignored):', clearErr);
        }
        qrcodeRef.current = null;
        setIsScanning(false);
        setIsInitialized(false);
        setTorchOn(false);
        scannerRef.current = null;
      } catch (err) {
        console.debug('Error stopping scanner (ignored during cleanup):', err);
        qrcodeRef.current = null;
      }
    }
  }, []);

  /**
   * Restart scanner (stop and reinitialize)
   */
  const restartScanner = useCallback(async (): Promise<void> => {
    await stopScanner();
    scannerRef.current = null;
    setIsInitialized(false);
    setError(null);

    /**
     * Small delay to ensure cleanup before reinitializing
     */
    setTimeout(() => {
      initializeScanner();
    }, 100);
  }, [stopScanner, initializeScanner]);

  /**
   * Cleanup on component unmount
   */
  useEffect(() => {
    return () => {
      if (qrcodeRef.current) {
        try {
          qrcodeRef.current
            .stop()
            .then(() => qrcodeRef.current?.clear())
            .catch((err) => {
              console.debug('Cleanup error (ignored):', err);
            });
        } catch (err) {
          // Html5Qrcode.stop() can throw synchronously when scanner
          // isn't in a running/paused state (e.g. double-cleanup races)
          console.debug('Cleanup error (ignored, sync):', err);
        }
      }
    };
  }, []);

  return {
    isInitialized,
    isScanning,
    error,
    torchOn,
    toggleTorch,
    initializeScanner,
    stopScanner,
    restartScanner,
  };
};
