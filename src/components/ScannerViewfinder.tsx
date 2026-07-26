/**
 * Scanner Viewfinder Component
 * Check-in style QR/barcode scanner box with corner guides, torch toggle, and status pill
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Flashlight, FlashlightOff, Loader } from 'lucide-react';

interface ScannerViewfinderProps {
  isInitialized: boolean;
  isScanning: boolean;
  isBusy?: boolean;
  statusText: string;
  torchOn: boolean;
  onToggleTorch: () => void;
}

/**
 * ScannerViewfinder Component
 *
 * Renders the camera feed target, green corner guides, animated scan line,
 * a torch toggle button, and a status pill beneath the frame.
 *
 * @remarks
 * - The `scanner-container` div is the mount target for Html5Qrcode and must stay in the DOM
 * - Only one instance should be mounted at a time (one scanning page per route)
 */
export const ScannerViewfinder: React.FC<ScannerViewfinderProps> = ({
  isScanning,
  isBusy = false,
  statusText,
  torchOn,
  onToggleTorch,
}): React.ReactElement => {
  return (
    <div className="flex flex-col items-center gap-5">
      {/* Frame */}
      <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden bg-[#0b1220] border border-white/10 shadow-2xl">
        <div id="scanner-container" className="w-full h-full" />

        {/* Corner Guides */}
        <div className="absolute inset-6 pointer-events-none">
          <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-primary rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-primary rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-primary rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-primary rounded-br-xl" />

          {/* Scan line */}
          <motion.div
            animate={isScanning ? { top: ['8%', '92%', '8%'] } : { top: '50%' }}
            transition={
              isScanning
                ? { duration: 2, repeat: Infinity, ease: 'linear' }
                : { duration: 0.3 }
            }
            className="absolute left-2 right-2 h-0.5 bg-primary shadow-[0_0_12px_var(--color-primary-container)]"
          />
        </div>

        {isBusy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            >
              <Loader size={36} className="text-primary" />
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Torch Toggle */}
      <button
        onClick={onToggleTorch}
        className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all active:scale-95 ${
          torchOn
            ? 'bg-primary border-primary text-white'
            : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
        }`}
        title="Toggle flashlight"
      >
        {torchOn ? <Flashlight size={20} /> : <FlashlightOff size={20} />}
      </button>

      {/* Status Pill */}
      <div className="px-5 py-2 rounded-full bg-white/10 border border-white/10">
        <p className="text-white/80 text-xs font-semibold uppercase tracking-wider text-center">
          {statusText}
        </p>
      </div>
    </div>
  );
};
