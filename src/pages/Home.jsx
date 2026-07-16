import { Link } from 'react-router-dom';
import { MapPin, Bell, Search, ShoppingBag, ChevronRight, Plus, MapPin as Marker, ScanQrCode } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import BottomNav from '../components/BottomNav';

const categories = [
  { id: 1, name: 'Veggies', emoji: '🥒', bg: 'bg-green-100' },
  { id: 2, name: 'Fruits', emoji: '🍎', bg: 'bg-red-100' },
  { id: 3, name: 'Meat', emoji: '🍗', bg: 'bg-orange-100' },
  { id: 4, name: 'Dairy', emoji: '🥛', bg: 'bg-purple-100' },
  { id: 5, name: 'Bakery', emoji: '🧁', bg: 'bg-yellow-100' },
  { id: 6, name: 'Drinks', emoji: '🥤', bg: 'bg-blue-100' },
];

const deals = [
  { id: 1, name: 'Fresh Oranges', price: 3.99, originalPrice: 5.99, discount: -25, image: '🍊', bg: 'bg-yellow-50' },
  { id: 2, name: 'Red Apples', price: 4.49, originalPrice: 6.49, discount: -30, image: '🍎', bg: 'bg-red-50' },
];

export default function Home() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="h-full bg-background pb-32 px-[15px]">
      {/* Header */}
      <header className="flex justify-between items-center fixed left-0 p-3 w-full top-0 bg-background/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-secondary font-inter text-xs">Hello, {user?.name || 'Seema'}</p>
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
        <div className="mt-[30px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
          <input
            type="text"
            placeholder="Search for products or stores..."
            className="w-full bg-white pl-12 pr-6 py-4 rounded-[10px] shadow-sm border border-outline/10 focus:outline-none focus:ring-2 focus:ring-primary/20 font-inter transition-all"
          />
        </div>

        {/* Active Session Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-primary p-5 rounded-[10px] shadow-xl relative overflow-hidden"
        >
          <div className="flex justify-between items-center gap-4">
            <div>
              <span className="text-white/70 font-inter text-[10px] font-bold tracking-[0.2em] uppercase">Active Session</span>
              <h2 className="text-white font-poppins font-bold text-2xl mt-1">Ready to Scan</h2>
              <p className="text-white/80 font-inter text-xs mt-1">Tap to start scanning items</p>
            </div>
            <Link to="/scanner" className="flex-shrink-0 bg-white p-4 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="text-2xl"><ScanQrCode /></div>
            </Link>
          </div>
        </motion.div>

        {/* Categories Section */}
        <section className="mt-8 hidden">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-on-surface font-poppins font-bold text-lg">Categories</h3>
            <button className="text-primary font-inter font-semibold text-sm hover:underline">See All</button>
          </div>
          <div className="grid grid-cols-6 gap-3">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className={`w-16 h-16 ${cat.bg} rounded-full flex items-center justify-center text-2xl shadow-sm hover:shadow-md transition-shadow`}>
                  {cat.emoji}
                </div>
                <p className="text-on-surface font-inter text-xs font-medium text-center">{cat.name}</p>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Nearby Stores */}
        <section className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-on-surface font-poppins font-bold text-lg">Nearby Stores</h3>
            <button className="text-primary font-inter font-semibold text-sm hover:underline">See All</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            <StoreCard name="FreshMart" distance="0.2 km" status="Open" statusColor="bg-green-100 text-green-700" />
            <StoreCard name="Organic Oasis" distance="1.5 km" status="Open" statusColor="bg-green-100 text-green-700" />
            <StoreCard name="Green Basket" distance="2.1 km" status="Busy" statusColor="bg-orange-100 text-orange-700" />
          </div>
        </section>

        {/* Flash Sale Banner */}
        <section className="mt-10">
          <div className="bg-[#0d1b2a] p-6 rounded-[10px] shadow-lg relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex gap-2 mb-3">
                  <span className="bg-red-800 text-white px-3 py-1 rounded text-xs font-bold">🔥 FLASH SALE</span>
                  <span className="bg-red-800 text-white px-3 py-1 rounded text-xs font-bold">Ends in 04:23:15</span>
                </div>
                <h3 className="text-white font-poppins font-bold text-2xl mb-2">Fresh Berries 🫐</h3>
                <p className="text-white font-inter text-sm">Get 20% off all berries today. Limited stock!</p>
                <button className="mt-4 flex items-center gap-2 text-white font-inter font-bold hover:opacity-90 transition-opacity">
                  View Deal
                  <ChevronRight size={18} />
                </button>
              </div>
              <div className="text-5xl flex-shrink-0">🍇</div>
            </div>
          </div>
        </section>

        {/* Today's Deals */}
        <section className="mt-10 mb-4 hidden">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-on-surface font-poppins font-bold text-lg">Today's Deals</h3>
            <button className="text-primary font-inter font-semibold text-sm hover:underline">See All</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {deals.map((deal) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${deal.bg} rounded-[10px] p-4 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">{deal.discount}%</div>
                <div className="flex flex-col h-full">
                  <div className="text-5xl text-center my-4">{deal.image}</div>
                  <h4 className="text-on-surface font-poppins font-semibold text-sm mt-2">{deal.name}</h4>
                  <div className="flex items-center gap-2 mt-3 mb-4">
                    <span className="text-on-surface font-poppins font-bold text-lg">${deal.price}</span>
                    <span className="text-secondary font-inter text-xs line-through">${deal.originalPrice}</span>
                  </div>
                  <button className="mt-auto bg-primary text-white rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors font-inter font-semibold text-sm">
                    <Plus size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

function StoreCard({ name, distance, status, statusColor }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className="flex-shrink-0 w-40 bg-white p-4 rounded-[10px] shadow-sm border border-outline/5 hover:border-primary/20 hover:shadow-md transition-all text-left"
    >
      <div className="w-full aspect-square rounded-2xl mb-3 flex items-center justify-center bg-primary/10">
        <ShoppingBag className="text-primary" size={28} />
      </div>
      <h4 className="text-on-surface font-poppins font-semibold text-sm">{name}</h4>
      <div className="flex items-center gap-1 mt-2">
        <Marker size={14} className="text-secondary" />
        <p className="text-secondary font-inter text-xs">{distance} away</p>
      </div>
      <div className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-2 ${statusColor}`}>
        {status}
      </div>
    </motion.button>
  );
}

