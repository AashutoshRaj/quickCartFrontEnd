/**
 * Bottom Navigation Component
 * Mobile app bottom navigation with cart count badge
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { History, House, QrCode, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../hooks/cart/useCart.ts';
import { PATHS } from '../app/paths';
import type { NavItem, BottomNavItemProps } from '../types/index';

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
  const cart = (data as Record<string, unknown>)?.data?.cart as Record<string, unknown> | undefined;
  const cartCount = Array.isArray(cart?.items)
    ? (cart.items as Array<Record<string, unknown>>).reduce(
        (sum, item) => sum + Number(item?.quantity || 0),
        0
      )
    : Number(cart?.totalItems || 0);

  console.log('cartvalue', cartCount);

  return (
    <nav className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 bg-white/90 backdrop-blur-xl border-t border-outline/10 px-4 py-3 z-30 shadow-[0_-10px_30px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between gap-2">
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
 * Individual navigation item with icon, label, and optional badge.
 *
 * @param {BottomNavItemProps} props - Component props
 * @param {NavItem} props.item - Navigation item configuration
 * @param {boolean} props.active - Whether item is currently active
 * @param {number} props.cartCount - Item count to display in badge (0 = hidden)
 * @returns {React.ReactElement} Styled navigation link
 *
 * @remarks
 * - Featured items (scan) have special styling
 * - Badge shows for cart with quantity > 0
 * - Active state changes text color and icon style
 */
function BottomNavItem({
  item,
  active,
  cartCount = 0,
}: BottomNavItemProps): React.ReactElement {
  const Icon = item.icon;

  /**
   * Base styling for all nav items
   */
  const baseClass =
    'flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 font-inter transition-all';

  /**
   * State-dependent styling
   */
  const stateClass = active
    ? 'text-primary'
    : 'text-secondary hover:text-on-surface';

  /**
   * Icon styling with special handling for featured items
   */
  const iconClass = item.featured
    ? `flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm transition-all ${
        active
          ? 'bg-primary text-white shadow-primary/20'
          : 'bg-primary/10 text-primary'
      }`
    : 'flex h-7 w-7 items-center justify-center';

  return (
    <Link
      to={item.to}
      className={`${baseClass} ${stateClass}`}
      aria-current={active ? 'page' : undefined}
    >
      <span className="relative">
        <span className={iconClass}>
          <Icon
            size={item.featured ? 22 : 21}
            strokeWidth={active ? 2.5 : 2}
          />
        </span>
        {/* Cart badge */}
        {item.to === PATHS.CART && cartCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white text-center">
            {cartCount}
          </span>
        )}
      </span>
      <span
        className={`truncate text-[10px] font-semibold leading-none ${
          active ? 'opacity-100' : 'opacity-60'
        }`}
      >
        {item.label}
      </span>
    </Link>
  );
}
