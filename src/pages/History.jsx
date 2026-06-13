import { motion } from 'framer-motion';
import { ArrowLeft, Search, ChevronRight, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

export default function History() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <header className="p-2 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-20">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-white rounded-full transition-colors">
          <ArrowLeft size={24} className="text-on-surface" />
        </button>
        <h1 className="text-on-surface font-poppins font-bold text-xl">Order History</h1>
        <button className="p-2 hover:bg-white rounded-full transition-colors">
          <Search size={24} className="text-on-surface" />
        </button>
      </header>

      <main className="px-6 space-y-6">
        <HistoryGroup title="Recent Orders">
          <HistoryItem 
            store="FreshMart - Central" 
            date="May 10, 2024" 
            amount="$16.53" 
            items="4 items" 
            status="Completed"
          />
          <HistoryItem 
            store="Organic Oasis" 
            date="May 08, 2024" 
            amount="$42.10" 
            items="12 items" 
            status="Completed"
          />
        </HistoryGroup>

        <HistoryGroup title="April 2024">
          <HistoryItem 
            store="Daily Grocer" 
            date="Apr 28, 2024" 
            amount="$8.40" 
            items="2 items" 
            status="Completed"
          />
          <HistoryItem 
            store="FreshMart - East" 
            date="Apr 22, 2024" 
            amount="$112.50" 
            items="34 items" 
            status="Completed"
          />
        </HistoryGroup>
      </main>
      <BottomNav />
    </div>
  );
}

function HistoryGroup({ title, children }) {
  return (
    <div className="space-y-4">
      <h3 className="text-secondary font-inter font-bold text-xs uppercase tracking-widest ml-2">{title}</h3>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

function HistoryItem({ store, date, amount, items, status }) {
  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      className="bg-white p-5 rounded-[2rem] shadow-sm border border-outline/5 flex items-center gap-4 hover:shadow-md transition-all"
    >
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
        <ShoppingBag className="text-primary" size={28} />
      </div>
      <div className="flex-1">
        <h4 className="text-on-surface font-poppins font-bold text-sm">{store}</h4>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-secondary font-inter text-xs">{date}</span>
          <span className="w-1 h-1 bg-outline/20 rounded-full" />
          <span className="text-secondary font-inter text-xs">{items}</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-primary font-poppins font-bold">{amount}</span>
          <span className="bg-green-100 text-green-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {status}
          </span>
        </div>
      </div>
      <ChevronRight size={20} className="text-outline" />
    </motion.div>
  );
}
