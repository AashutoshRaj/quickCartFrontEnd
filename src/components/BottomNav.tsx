/**
 * Bottom Navigation Component
 * Mobile app bottom navigation with cart count badge
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { History, House, QrCode, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../hooks/cart/useCart.ts';
import { PATHS } from '../app/paths';
import type { NavItem, BottomNavItemProps } from '../types/index';

interface CartData {
  data?: {
    cart?: {
      items?: Array<{ quantity?: number }>;
      totalItems?: number;
    };
  };
}

/**
 * Navigation items configuration
 */
const navItems: NavItem[] = [
  { to: PATHS.HOME, label: 'Home', icon: House },
  { to: PATHS.HISTORY, label: 'History', icon: History },
  { to: PATHS.SCANNER, label: 'Scan', icon: QrCode, featured: true },
  { to: PATHS.CART, label: 'Cart', icon: ShoppingCart },
  { to: PATHS.PROFILE, label: 'Profile', icon: User },
];

/**
 * BottomNav Component
 *
 * Displays bottom navigation bar with active route highlighting
 * and cart item count badge.
 *
 * @returns {React.ReactElement} Bottom navigation bar
 *
 * @remarks
 * - Shows current location highlight
 * - Displays cart badge with total quantity
 * - Features prominent scan button (center)
 * - Uses React Router for navigation
 *
 * @example
 * <BottomNav />
 */
export default function BottomNav(): React.ReactElement {
  const { pathname } = useLocation();
  const { data } = useCart();

  /**
   * Calculate total cart item quantity
   */
  const cart = (data as unknown as CartData)?.data?.cart;
  const cartCount = Array.isArray(cart?.items)
    ? cart.items.reduce((sum, item) => sum + Number(item?.quantity || 0), 0)
    : Number(cart?.totalItems || 0);

  console.log('cartvalue', cartCount);

  return (
    <nav className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 px-4 pb-4 z-30">
      <div className="relative flex items-center justify-between bg-white rounded-full px-2 shadow-[0_2px_8px_rgba(15,23,42,0.06),0_16px_36px_rgba(15,23,42,0.14)]">
        {navItems.map((item) => (
          <BottomNavItem
            key={item.to}
            item={item}
            active={pathname === item.to}
            cartCount={item.to === PATHS.CART ? cartCount : 0}
          />
        ))}
      </div>
    </nav>
  );
}

/**
 * BottomNavItem Component
 *
 * Individual navigation item with icon and optional badge.
 * Active item pops above the bar as a floating circular bubble
 * that slides smoothly between positions.
 *
 * @param {BottomNavItemProps} props - Component props
 * @param {NavItem} props.item - Navigation item configuration
 * @param {boolean} props.active - Whether item is currently active
 * @param {number} props.cartCount - Item count to display in badge (0 = hidden)
 * @returns {React.ReactElement} Styled navigation link
 */
function BottomNavItem({
  item,
  active,
  cartCount = 0,
}: BottomNavItemProps): React.ReactElement {
  const Icon = item.icon;
  const showBadge = item.to === PATHS.CART && cartCount > 0;

  return (
    <Link
      to={item.to}
      className="relative flex flex-1 h-16 items-center justify-center"
      aria-current={active ? 'page' : undefined}
      aria-label={item.label}
    >
      {active ? (
        <motion.span
          layoutId="bottom-nav-bubble"
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          className="absolute -top-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-[0_10px_24px_rgba(255,184,0,0.45)]"
        >
          <Icon size={22} strokeWidth={2.3} className="text-white" />
          {showBadge && (
            <span className="absolute -top-1 -right-1 min-w-[18px] rounded-full bg-on-surface px-1 py-0.5 text-[10px] font-bold text-white text-center leading-none ring-2 ring-white">
              {cartCount}
            </span>
          )}
        </motion.span>
      ) : (
        <span className="relative flex items-center justify-center text-secondary/60">
          <Icon size={21} strokeWidth={1.8} />
          {showBadge && (
            <span className="absolute -top-1.5 -right-2 min-w-[16px] rounded-full bg-primary px-1 py-0.5 text-[9px] font-bold text-white text-center leading-none">
              {cartCount}
            </span>
          )}
        </span>
      )}
    </Link>
  );
}
