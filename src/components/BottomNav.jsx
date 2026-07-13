import { Link, useLocation } from 'react-router-dom';
import { History, House, QrCode, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../hooks/cart/useCart';

const navItems = [
  { to: '/', label: 'Home', icon: House },
  { to: '/history', label: 'History', icon: History },
  { to: '/scanner', label: 'Scan', icon: QrCode, featured: true },
  { to: '/cart', label: 'Cart', icon: ShoppingCart },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const { data } = useCart();
  const cart = data?.data?.cart;
  const cartCount = Array.isArray(cart?.items)
    ? cart.items.reduce((sum, item) => sum + Number(item?.quantity || 0), 0)
    : Number(cart?.totalItems || 0);
  console.log("cartvalue", cartCount);
  return (
    <nav className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 bg-white/90 backdrop-blur-xl border-t border-outline/10 px-4 py-3 z-30 shadow-[0_-10px_30px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between gap-2">
        {navItems.map((item) => (
          <BottomNavItem key={item.to} item={item} active={pathname === item.to} cartCount={item.to === '/cart' ? cartCount : 0} />
        ))}
      </div>
    </nav>
  );
}

function BottomNavItem({ item, active, cartCount = 0 }) {
  const Icon = item.icon;
  const baseClass = 'flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 font-inter transition-all';
  const stateClass = active ? 'text-primary' : 'text-secondary hover:text-on-surface';
  const iconClass = item.featured
    ? `flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm transition-all ${
        active ? 'bg-primary text-white shadow-primary/20' : 'bg-primary/10 text-primary'
      }`
    : 'flex h-7 w-7 items-center justify-center';

  return (
    <Link to={item.to} className={`${baseClass} ${stateClass}`} aria-current={active ? 'page' : undefined}>
      <span className="relative">
        <span className={iconClass}>
          <Icon size={item.featured ? 22 : 21} strokeWidth={active ? 2.5 : 2} />
        </span>
        {item.to === '/cart' && cartCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white text-center">
            {cartCount}
          </span>
        )}
      </span>
      <span className={`truncate text-[10px] font-semibold leading-none ${active ? 'opacity-100' : 'opacity-60'}`}>
        {item.label}
      </span>
    </Link>
  );
}
