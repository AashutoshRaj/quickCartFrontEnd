import React from 'react';
import { ChevronLeft, Trash2, Plus, Minus, CreditCard, ShoppingBag, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import type { CartItem as CartItemType, RootState } from '../types/index';
import { formatCurrency } from '../utils/currency.ts';
import BottomNav from '../components/BottomNav.tsx';
import { PATHS } from '../app/paths';
import { useCart } from '../hooks/cart/useCart.ts';
import { useIncreaseQuantity } from '../hooks/cart/useIncreaseQuantity.ts';
import { useDecreaseQuantity } from '../hooks/cart/useDecreaseQuantity.ts';
import { useRemoveCartItem } from '../hooks/cart/useRemoveCartItem.ts';
import { useClearCart } from '../hooks/cart/useClearCart.ts';
import { useCreateCheckoutSession } from '../hooks/cart/useCreateCheckoutSession.ts';

const SOFT_SHADOW = 'shadow-[0_2px_8px_rgba(15,23,42,0.04),0_12px_30px_rgba(15,23,42,0.08)]';
const SOFT_SHADOW_HOVER = 'hover:shadow-[0_4px_12px_rgba(15,23,42,0.06),0_16px_40px_rgba(15,23,42,0.10)]';

interface CartItemProps {
  item: CartItemType & {
    productName?: string;
    productImage?: string;
    subtotal?: number;
  };
  currency: string;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

interface CartData {
  data: {
    cart: {
      items: (CartItemType & {
        productName?: string;
        productImage?: string;
        subtotal?: number;
      })[];
      subtotal?: number;
      tax?: number;
      grandTotal?: number;
    };
  };
}

/**
 * Cart Page Component
 * Displays shopping cart with item management and checkout options
 * Handles item quantity updates, removals, and cart clearing
 *
 * @returns {React.ReactElement} Cart page with order summary
 */
const Cart: React.FC = (): React.ReactElement => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useCart();
  const increaseQuantity = useIncreaseQuantity();
  const decreaseQuantity = useDecreaseQuantity();
  const removeItem = useRemoveCartItem();
  const clearCart = useClearCart();
  const createCheckoutSession = useCreateCheckoutSession();

  const { activeStore } = useSelector((state: RootState) => state.store);
  const currency = activeStore?.currency || 'USD';
  const cart = (data as unknown as CartData)?.data?.cart;
  const items = cart?.items || [];

  const handleClearCart = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    if (items.length === 0) {
      toast.info('Your cart is already empty.');
      return;
    }

    try {
      await clearCart.mutateAsync();
      toast.success('Cart cleared');
    } catch (error) {
      // handled by mutation error toast
    }
  };

  const handleNavigateBack = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    navigate(-1);
  };

  const handleCheckout = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    createCheckoutSession.mutate();
  };

  return (
    <div className="min-h-screen bg-background pb-64">
      <header className="px-5 py-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-xl z-20 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
        <button
          onClick={handleNavigateBack}
          className={`bg-white p-2.5 rounded-full ${SOFT_SHADOW} ${SOFT_SHADOW_HOVER} transition-shadow duration-200`}
        >
          <ChevronLeft size={20} className="text-on-surface" />
        </button>
        <h1 className="text-on-surface font-poppins font-bold text-lg">My Cart</h1>
        <button
          onClick={handleClearCart}
          disabled={items.length === 0}
          className={`bg-white p-2.5 rounded-full ${SOFT_SHADOW} transition-all duration-200 disabled:opacity-40 ${
            items.length ? SOFT_SHADOW_HOVER : ''
          }`}
        >
          <Trash2 size={18} className={`transition-colors duration-200 ${items.length ? 'text-red-500' : 'text-outline'}`} />
        </button>
      </header>

      <main className="px-5 pt-5 space-y-4">
        {isLoading && (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className={`flex items-center bg-white p-5 rounded-[24px] ${SOFT_SHADOW} animate-pulse`}>
                <div className="w-20 h-20 bg-background rounded-2xl" />
                <div className="flex-1 ml-5 space-y-2.5">
                  <div className="h-3.5 bg-background rounded-full w-2/3" />
                  <div className="h-3 bg-background rounded-full w-1/3" />
                  <div className="h-4 bg-background rounded-full w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`bg-white rounded-[24px] p-8 text-center ${SOFT_SHADOW}`}
          >
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-red-500" size={26} />
            </div>
            <p className="text-on-surface font-poppins font-bold text-sm mb-1">Unable to Load Cart</p>
            <p className="text-secondary font-inter text-xs">Please check your connection and try again.</p>
          </motion.div>
        )}

        {!isLoading && !isError && items.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`bg-white rounded-[24px] p-12 text-center ${SOFT_SHADOW}`}
          >
            <div className="w-16 h-16 bg-primary/10 rounded-[20px] flex items-center justify-center mx-auto mb-5">
              <ShoppingBag className="text-primary" size={30} />
            </div>
            <p className="text-on-surface font-poppins font-bold text-lg mb-1.5">Your Cart is Empty</p>
            <p className="text-secondary font-inter text-sm mb-6">Scan a product to start shopping.</p>
            <button
              onClick={() => navigate(PATHS.HOME)}
              className="px-6 py-3 bg-gradient-to-br from-primary to-[#FF9F1C] text-white rounded-[16px] font-inter font-semibold text-sm shadow-[0_8px_20px_rgba(255,184,0,0.3)] hover:shadow-[0_10px_24px_rgba(255,184,0,0.4)] active:scale-95 transition-all duration-200"
            >
              Start Shopping
            </button>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {items.map((item) => (
            <CartItem
              key={item.productId}
              item={item}
              currency={currency}
              onIncrease={() => increaseQuantity.mutate(item.productId)}
              onDecrease={() => decreaseQuantity.mutate(item.productId)}
              onRemove={() => removeItem.mutate(item.productId)}
            />
          ))}
        </AnimatePresence>

        {items.length > 0 && (
          <div className={`mt-8 bg-white p-6 rounded-[24px] ${SOFT_SHADOW}`}>
            <h3 className="text-on-surface font-poppins font-bold text-base mb-5">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-secondary font-inter text-sm">Subtotal</span>
                <span className="text-on-surface font-inter font-semibold text-sm">{formatCurrency(Number(cart?.subtotal || 0), currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary font-inter text-sm">Tax (5%)</span>
                <span className="text-on-surface font-inter font-semibold text-sm">{formatCurrency(Number(cart?.tax || 0), currency)}</span>
              </div>
              <div className="flex justify-between mt-5 pt-5 border-t border-outline/10">
                <span className="text-on-surface font-poppins font-bold text-lg">Total</span>
                <span className="text-primary font-poppins font-bold text-lg">{formatCurrency(Number(cart?.grandTotal || 0), currency)}</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {items.length > 0 && (
        <div className="fixed bottom-[112px] left-1/2 w-full max-w-md -translate-x-1/2 px-5 z-30">
          <motion.button
            whileTap={{ scale: 0.97 }}
            className={`w-full bg-gradient-to-br from-primary to-[#FF9F1C] flex items-center justify-center gap-3 py-4 rounded-[20px] shadow-[0_10px_28px_rgba(255,184,0,0.4)] hover:shadow-[0_14px_34px_rgba(255,184,0,0.5)] transition-all duration-200 text-white font-poppins font-bold text-base disabled:opacity-60 disabled:shadow-none`}
            disabled={items.length === 0 || createCheckoutSession.isPending}
            onClick={handleCheckout}
          >
            <CreditCard size={22} />
            {createCheckoutSession.isPending ? 'Starting Checkout...' : 'Checkout Now'}
          </motion.button>
        </div>
      )}
      <BottomNav />
    </div>
  );
};

/**
 * Cart Item Component
 * Displays individual cart item with quantity controls and remove button
 *
 * @param {CartItemProps} props - Cart item properties
 * @returns {React.ReactElement} Cart item element
 */
const CartItem: React.FC<CartItemProps> = ({ item, currency, onIncrease, onDecrease, onRemove }): React.ReactElement => {
  const handleIncrease = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    onIncrease();
  };

  const handleDecrease = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    onDecrease();
  };

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    onRemove();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex items-center bg-white p-5 rounded-[24px] ${SOFT_SHADOW} ${SOFT_SHADOW_HOVER} transition-shadow duration-200 group`}
    >
      <div className="w-20 h-20 bg-background rounded-[18px] flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
        {item.productImage ? (
          <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-10 h-10 bg-primary/10 rounded-full" />
        )}
      </div>
      <div className="flex-1 ml-5 min-w-0">
        <h4 className="text-on-surface font-poppins font-semibold text-sm truncate">{item.productName}</h4>
        <p className="text-secondary font-inter text-xs mt-1">Qty {item.quantity}</p>
        <p className="text-primary font-poppins font-bold mt-2 text-lg">{formatCurrency(Number(item.price || 0), currency)}</p>
        <p className="text-secondary font-inter text-xs mt-1">Subtotal {formatCurrency(Number(item.subtotal || 0), currency)}</p>
      </div>
      <div className="flex flex-col items-end gap-3 flex-shrink-0">
        <button onClick={handleRemove} className="p-2 hover:bg-red-50 rounded-xl transition-colors duration-200">
          <Trash2 size={16} className="text-red-500" />
        </button>
        <div className="flex items-center bg-background rounded-2xl p-1">
          <button onClick={handleDecrease} className={`p-2 bg-white rounded-xl ${SOFT_SHADOW} hover:scale-105 active:scale-95 transition-transform duration-150`}>
            <Minus size={14} className="text-primary" />
          </button>
          <span className="mx-3.5 font-poppins font-bold text-on-surface text-sm w-4 text-center">{item.quantity}</span>
          <button onClick={handleIncrease} className={`p-2 bg-white rounded-xl ${SOFT_SHADOW} hover:scale-105 active:scale-95 transition-transform duration-150`}>
            <Plus size={14} className="text-primary" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;
