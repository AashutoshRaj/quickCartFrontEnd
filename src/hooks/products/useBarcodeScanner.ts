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
        (error: Error) => {
          /**
           * Silently handle scanning errors (camera frame issues)
           * These are expected during normal scanning on poor/empty frames
           * Only report actual initialization/permission errors
           */
          const msg = (error?.message || '').toLowerCase();
          const isFrameError = msg.includes('not found') ||
                              msg.includes('indexsize') ||
                              msg.includes('parse error') ||
                              msg.includes('qr code');

          if (onScanError && error && !isFrameError) {
            onScanError(error);
          }
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
        scannerRef.current = null;
      } catch (err) {
        console.error('Error stopping scanner:', err);
        // Force cleanup even if stop fails
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
        qrcodeRef.current
          .stop()
          .then(() => qrcodeRef.current?.clear())
          .catch((err) => {
            // Ignore "not running" errors
            if (!(err as Error).message?.includes('not running')) {
              console.error('Cleanup error:', err);
            }
          });
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
