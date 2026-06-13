import { ChevronLeft, Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

export default function Cart() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-52">
      {/* Header */}
      <header className="p-2 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-20">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-white rounded-full transition-colors">
          <ChevronLeft size={24} className="text-on-surface" />
        </button>
        <h1 className="text-on-surface font-poppins font-bold text-xl">My Cart</h1>
        <button className="p-2 hover:bg-white rounded-full transition-colors">
          <Trash2 size={24} className="text-red-500" />
        </button>
      </header>

      <main className="px-6 space-y-4">
        <CartItem name="Organic Bananas" price="$4.99" quantity="1 kg" />
        <CartItem name="Whole Milk" price="$3.50" quantity="1L" />
        <CartItem name="Avocado" price="$2.00" quantity="2 pcs" />
        <CartItem name="Whole Grain Bread" price="$5.25" quantity="1 loaf" />

        {/* Summary */}
        <div className="mt-12 bg-white p-8 rounded-[2rem] shadow-sm border border-outline/5">
          <h3 className="text-on-surface font-poppins font-bold text-lg mb-6">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-secondary font-inter">Subtotal</span>
              <span className="text-on-surface font-inter font-semibold">$15.74</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary font-inter">Tax (5%)</span>
              <span className="text-on-surface font-inter font-semibold">$0.79</span>
            </div>
            <div className="flex justify-between mt-6 pt-6 border-t border-outline/10">
              <span className="text-on-surface font-poppins font-bold text-xl">Total</span>
              <span className="text-primary font-poppins font-bold text-xl">$16.53</span>
            </div>
          </div>
        </div>
      </main>

      {/* Checkout Button */}
      <div className="fixed bottom-[76px] left-1/2 w-full max-w-md -translate-x-1/2 p-4 bg-white/80 backdrop-blur-xl border-t border-outline/5 z-30">
        <div className="max-w-md mx-auto">
          <button className="w-full bg-primary flex items-center justify-center gap-3 py-4 rounded-2xl shadow-xl hover:bg-primary/90 transition-all text-white font-poppins font-bold text-base">
            <CreditCard size={22} />
            Checkout Now
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

function CartItem({ name, price, quantity }) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center bg-white p-5 rounded-[2rem] shadow-sm border border-outline/5 group"
    >
      <div className="w-20 h-20 bg-background rounded-2xl flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
        <div className="w-10 h-10 bg-primary/10 rounded-full" />
      </div>
      <div className="flex-1 ml-5">
        <h4 className="text-on-surface font-poppins font-semibold text-base">{name}</h4>
        <p className="text-secondary font-inter text-xs mt-1">{quantity}</p>
        <p className="text-primary font-poppins font-bold mt-2 text-lg">{price}</p>
      </div>
      <div className="flex items-center bg-background rounded-2xl p-1 shadow-inner">
        <button className="p-2 hover:bg-white rounded-xl transition-colors shadow-sm">
          <Minus size={16} className="text-primary" />
        </button>
        <span className="mx-4 font-poppins font-bold text-on-surface">1</span>
        <button className="p-2 hover:bg-white rounded-xl transition-colors shadow-sm">
          <Plus size={16} className="text-primary" />
        </button>
      </div>
    </motion.div>
  );
}
