import { Link } from 'react-router-dom';
import { MapPin, Bell, Search, ShoppingBag, ChevronRight, Menu, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import BottomNav from '../components/BottomNav';

export default function Home() {
 const { user } = useSelector((state) => state.auth);

  return (
    <div className="h-full  bg-background pb-30 px-[15px]">
      {/* Header */}
      <header className="flex justify-between items-center fixed left-0  p-3 w-full top-0 bg-background/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          {/* <div className="bg-primary/10 p-2 rounded-xl">
            <Menu className="text-primary" size={24} />
          </div> */}
          <div>
            <p className="text-secondary font-inter text-xs">Hello,{user?.name}</p>
            <div className="flex items-center gap-1">
              <MapPin size={16} className="text-primary" />
              <h1 className="text-on-surface font-poppins font-semibold text-base">FreshMart - Central</h1>
            </div>
          </div>
        </div>
        <button className="bg-white p-3 rounded-full shadow-sm hover:shadow-md transition-shadow">
          <Bell size={20} className="text-on-surface" />
        </button>
      </header>

      <main className="max-w-2xl mx-auto">
{/* Search Bar */}
        <div className="mt-10 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
          <input 
            type="text" 
            placeholder="Search for products or stores..."
            className="w-full bg-white pl-12 pr-6 py-4 rounded-2xl shadow-sm border border-outline/10 focus:outline-none focus:ring-2 focus:ring-primary/20 font-inter transition-all"
          />
        </div>

        {/* Active Session Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-primary p-4 rounded-[10px] shadow-xl relative overflow-hidden flex gap-2 items-center"
        >
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/30 rounded-full blur-3xl" />
          <div className="flex justify-between items-start relative z-10 basis-[60%] shrink-0 grow-0">
            <div>
              <span className="text-white/70 font-inter text-[10px] font-bold tracking-[0.2em] uppercase">Active Session</span>
              <h2 className="text-white font-poppins font-bold text-2xl mt-2">Ready to Scan</h2>
            </div>
         
          </div>
          {/* <p className="text-white/90 font-inter mt-6 text-sm leading-relaxed max-w-[80%]">
            You are currently at FreshMart - Central. Start adding items to your cart by scanning their barcodes.
          </p> */}
          <Link to="/scanner" className="block w-full bg-white  py-1 px-2 rounded-[10px] font-poppins font-normal text-center text-primary hover:bg-white/90 transition-colors shadow-lg flex items-center  gap-2 justify-center">
          <div className="bg-primary/20 p-3 rounded-full">          
             
           <QrCode size={15} className="text-primary"/>  
            </div>
            Scan Item
          </Link>
        </motion.div>

        

        {/* Nearby Stores */}
        <section className="mt-12">
          <div className=" flex justify-between items-center mb-6">
            <h3 className="text-on-surface font-poppins font-bold text-xl">Nearby Stores</h3>
            <button className="text-primary font-inter font-semibold hover:underline text-sm">See All</button>
          </div>
          <div className="flex gap-4 overflow-x-auto  pb-4 scrollbar-hide">
            <StoreCard name="FreshMart" distance="0.2 km" color="bg-primary/10" iconColor="text-primary" />
            <StoreCard name="Organic Oasis" distance="1.5 km" color="bg-secondary/10" iconColor="text-secondary" />
            <StoreCard name="Daily Grocer" distance="2.1 km" color="bg-primary-container/10" iconColor="text-primary-container" />
          </div>
        </section>

        {/* Flash Sale */}
        <section className=" mt-10">
          <div className="bg-[#0d1b2a] p-4 rounded-[10px] shadow-sm border border-outline/5 relative overflow-hidden group hover:shadow-md transition-all">
            {/* <div className="absolute top-0 right-0 bg-primary-container px-6 py-2 rounded-bl-2xl">
              <span className="text-white font-bold text-xs">20% OFF</span>
            </div> */}
            <p className="text-white font-inter font-bold text-xs tracking-widest uppercase">Flash Sale</p>
            <h3 className="text-white font-poppins font-bold text-2xl mt-2">Fresh Berries</h3>
            <p className="text-white font-inter mt-3 text-sm leading-relaxed">
             Get 20% off all berries today.
            </p>
            <button className="mt-6 flex items-center gap-2 text-primary font-inter font-bold group-hover:gap-3 transition-all">
              View Deal
              <ChevronRight size={18} />
            </button>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

function StoreCard({ name, distance, color, iconColor }) {
  return (
    <motion.button 
      whileTap={{ scale: 0.95 }}
      className="flex-shrink-0 w-44 bg-white p-5 rounded-[10px] shadow-sm border border-outline/5 hover:border-primary/20 transition-all text-left"
    >
      <div className={`w-full aspect-square rounded-2xl mb-4 flex items-center justify-center ${color}`}>
        <ShoppingBag className={iconColor} size={32} />
      </div>
      <h4 className="text-on-surface font-poppins font-semibold text-sm">{name}</h4>
      <p className="text-secondary font-inter text-xs mt-1">{distance} away</p>
    </motion.button>
  );
}

