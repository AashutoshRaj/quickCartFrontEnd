import React from 'react';
import { motion } from 'framer-motion';
import { User, CreditCard, Globe, Settings, Bell, ChevronRight, LogOut, Smartphone, ShoppingBag, Search, QrCode } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { signOutUser } from '../utils/firebaseAuth';

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  /**
   * Handle user logout
   * Signs out from Firebase and clears Redux state
   */
  const handleSignOut = async () => {
    try {
      // Sign out from Firebase
      await signOutUser();
    } catch (error) {
      console.error('Error signing out from Firebase:', error);
    } finally {
      // Always clear Redux state even if Firebase signout fails
      dispatch(logout());
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Profile Header */}
      <header className="px-6 pt-12 pb-8 bg-white border-b border-outline/5">
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mb-6 border border-primary/20">
            <User size={48} className="text-primary" strokeWidth={1.5} />
          </div>
          <h1 className="text-on-surface font-poppins font-bold text-3xl tracking-tight">{user?.name || 'QuickCart User'}</h1>
          <p className="text-secondary font-inter text-sm mt-1">{user?.phoneNumber || 'No phone number'}</p>
        </div>
      </header>

      <main className="max-w-md mx-auto">
        {/* Loyalty Balance Card */}
        <div className="mx-6 mt-8 bg-primary p-8 rounded-[2.5rem] shadow-xl shadow-primary/20 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <p className="text-white/70 font-inter text-xs font-bold tracking-[0.2em] uppercase">Loyalty Balance</p>
              <h2 className="text-white font-poppins font-bold text-3xl mt-2">2,450 pts</h2>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl">
              <ShoppingBag size={24} className="text-white" />
            </div>
          </div>
          <p className="text-white/80 font-inter text-[10px] mt-6 bg-white/10 w-fit px-3 py-1 rounded-full">Valid until Dec 2024</p>
        </div>

        {/* Saved Payments */}
        <section className="mt-10">
          <h3 className="px-10 text-secondary font-inter font-bold text-[10px] uppercase tracking-[0.2em] mb-4">Saved Payments</h3>
          <div className="mx-6 bg-white rounded-[2.5rem] shadow-sm border border-outline/5 overflow-hidden">
            <div className="flex items-center justify-between p-6 hover:bg-background transition-colors cursor-pointer border-b border-outline/5">
              <div className="flex items-center gap-4">
                <div className="bg-background p-3 rounded-xl text-on-surface">
                  <CreditCard size={20} />
                </div>
                <div>
                  <p className="text-on-surface font-poppins font-bold text-sm">•••• 8821</p>
                  <p className="text-secondary font-inter text-[10px]">Expires 12/26</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-outline" />
            </div>
            <button className="w-full py-4 text-primary font-inter font-bold text-xs hover:bg-background transition-colors">
              + Add New Payment Method
            </button>
          </div>
        </section>

        {/* Account Settings */}
        <section className="mt-10">
          <h3 className="px-10 text-secondary font-inter font-bold text-[10px] uppercase tracking-[0.2em] mb-4">Account Settings</h3>
          <div className="mx-6 bg-white rounded-[2.5rem] shadow-sm border border-outline/5 overflow-hidden">
            <MenuItem icon={<Globe size={20} />} label="Language" value="English (US)" />
            <MenuItem icon={<Bell size={20} />} label="Notifications" value="Enabled" />
            <MenuItem icon={<Settings size={20} />} label="Security" />
            <MenuItem 
              icon={<LogOut size={20} />} 
              label="Sign Out" 
              color="text-red-500" 
              showChevron={false} 
              onClick={handleSignOut}
            />
          </div>
        </section>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-outline/5 px-8 py-4 flex justify-around items-center z-30">
        <NavItem to="/" icon={<ShoppingBag size={24} />} label="Home" />
        <NavItem to="/history" icon={<Search size={24} />} label="History" />
        <NavItem to="/scanner" icon={<QrCode size={24} />} label="Scan" />
        <NavItem to="/cart" icon={<ShoppingBag size={24} />} label="Cart" />
        <NavItem to="/profile" icon={<User size={24} />} label="Profile" active />
      </nav>
    </div>
  );
}

function MenuItem({ icon, label, value, color = "text-on-surface", showChevron = true, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-6 hover:bg-background transition-colors border-b border-outline/5 last:border-b-0"
    >
      <div className="flex items-center gap-4">
        <div className={`${color} bg-background p-3 rounded-xl`}>
          {icon}
        </div>
        <span className={`font-poppins font-semibold text-sm ${color}`}>{label}</span>
      </div>
      <div className="flex items-center gap-3">
        {value && <span className="text-secondary font-inter text-xs">{value}</span>}
        {showChevron && <ChevronRight size={18} className="text-outline" />}
      </div>
    </button>
  );
}

function NavItem({ to, icon, label, active }) {
  return (
    <Link to={to} className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-primary' : 'text-secondary hover:text-on-surface'}`}>
      {icon}
      <span className={`text-[10px] font-inter font-semibold ${active ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
    </Link>
  );
}

