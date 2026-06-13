import { ChevronLeft, Zap, Camera, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

export default function Scanner() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black relative flex flex-col pb-24">
      {/* Header Overlay */}
      <header className="px-6 py-8 flex items-center justify-between absolute top-0 left-0 right-0 z-20">
        <button 
          onClick={() => navigate(-1)} 
          className="bg-white/10 hover:bg-white/20 p-4 rounded-full backdrop-blur-xl border border-white/20 transition-all"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>
        <h1 className="text-white font-poppins font-bold text-lg">Scan Product</h1>
        <button className="bg-white/10 hover:bg-white/20 p-4 rounded-full backdrop-blur-xl border border-white/20 transition-all">
          <Zap size={24} className="text-white" />
        </button>
      </header>

      {/* Scanner View Mockup */}
      <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Animated Background Pulse */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-[80%] aspect-square bg-primary/20 rounded-full blur-3xl"
          />
        </div>

        <div className="w-80 h-80 relative flex items-center justify-center">
          {/* Corner Guides */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-3xl shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white rounded-tr-3xl shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white rounded-bl-3xl shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-3xl shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            className="text-white flex flex-col items-center gap-4"
          >
            <Camera size={64} />
            <p className="text-xs font-inter tracking-widest uppercase">Initializing Camera...</p>
          </motion.div>

          {/* Scanning Animation Line */}
          <motion.div 
            animate={{ top: ['10%', '90%', '10%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            className="absolute left-4 right-4 h-[2px] bg-primary-container shadow-[0_0_15px_#00c853] z-10"
          />
        </div>

        <div className="mt-12 px-12 text-center space-y-4">
          <p className="text-white/70 font-inter text-sm leading-relaxed">
            Align the product barcode or QR code within the frame to automatically add it to your cart.
          </p>
          <div className="flex items-center justify-center gap-2 text-primary-container">
            <Info size={16} />
            <span className="text-xs font-semibold">Supported: EAN, UPC, QR</span>
          </div>
        </div>
      </main>

      {/* Bottom Action */}
      <footer className="p-6 pb-4 flex justify-center bg-gradient-to-t from-black to-transparent">
        <button className="bg-white/5 hover:bg-white/10 px-10 py-5 rounded-[2rem] border border-white/20 text-white font-poppins font-semibold transition-all backdrop-blur-md">
          Type Barcode Manually
        </button>
      </footer>
      <BottomNav />
    </div>
  );
}
