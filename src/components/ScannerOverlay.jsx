import { motion } from 'framer-motion';

/**
 * ScannerOverlay - Professional scanner overlay with animated guidance
 * Shows corner guides and scanning line animation
 */
export const ScannerOverlay = ({ isScanning = false, scannedBarcode = null }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Pulsing Background Effect */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
      />

      {/* Scanner Frame */}
      <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
        {/* Corner Guides with Glow Effect */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-lg shadow-[0_0_20px_rgba(255,255,255,0.6)]" />
        <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white rounded-tr-lg shadow-[0_0_20px_rgba(255,255,255,0.6)]" />
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white rounded-bl-lg shadow-[0_0_20px_rgba(255,255,255,0.6)]" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-lg shadow-[0_0_20px_rgba(255,255,255,0.6)]" />

        {/* Scanner Status Indicator */}
        {isScanning ? (
          <>
            {/* Animated Scanning Line */}
            <motion.div
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute left-4 right-4 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent shadow-[0_0_20px_#22c55e]"
            />
            {/* Scanning Status */}
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute bottom-8 text-white/70 text-xs font-semibold tracking-widest uppercase"
            >
              Scanning...
            </motion.div>
          </>
        ) : scannedBarcode ? (
          <>
            {/* Success Flash */}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-green-400/30 rounded-lg"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-green-400 text-center"
            >
              <div className="text-2xl mb-2">✓</div>
              <p className="text-xs font-semibold uppercase">Product Found!</p>
            </motion.div>
          </>
        ) : (
          <>
            {/* Idle State - Pulsing Circle */}
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 rounded-full border-2 border-white/50"
            />
            <div className="text-white/60 text-center absolute bottom-8">
              <p className="text-xs font-semibold uppercase">Ready to Scan</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
