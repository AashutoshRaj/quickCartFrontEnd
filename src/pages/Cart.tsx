import React from 'react';
import { ChevronLeft, Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { CartItem as CartItemType } from '../types/index';
import BottomNav from '../components/BottomNav.tsx';
import { useCart } from '../hooks/cart/useCart.ts';
import { useIncreaseQuantity } from '../hooks/cart/useIncreaseQuantity.ts';
import { useDecreaseQuantity } from '../hooks/cart/useDecreaseQuantity.ts';
import { useRemoveCartItem } from '../hooks/cart/useRemoveCartItem.ts';
import { useClearCart } from '../hooks/cart/useClearCart.ts';
import { useCreateCheckoutSession } from '../hooks/cart/useCreateCheckoutSession.ts';

interface CartItemProps {
  item: CartItemType & {
    productName?: string;
    productImage?: string;
    subtotal?: number;
  };
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

  const cart = (data as CartData)?.data?.cart;
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
    <div className="min-h-screen bg-background pb-52">
      <header className="p-2 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-20">
        <button onClick={handleNavigateBack} className="p-2 -ml-2 hover:bg-white rounded-full transition-colors">
          <ChevronLeft size={24} className="text-on-surface" />
        </button>
        <h1 className="text-on-surface font-poppins font-bold text-xl">My Cart</h1>
        <button onClick={handleClearCart} className="p-2 hover:bg-white rounded-full transition-colors" disabled={items.length === 0}>
          <Trash2 size={24} className={`transition-colors ${items.length ? 'text-red-500' : 'text-gray-300'}`} />
        </button>
      </header>

      <main className="px-6 space-y-4">
        {isLoading && <p className="text-center text-sm text-secondary py-8">Loading cart...</p>}
        {isError && <p className="text-center text-sm text-red-500 py-8">Unable to load your cart.</p>}
        {!isLoading && items.length === 0 && (
          <div className="rounded-[2rem] border border-dashed border-outline/20 bg-white p-8 text-center text-secondary">
            Your cart is empty. Scan a product to start shopping.
          </div>
        )}
        {items.map((item) => (
          <CartItem
            key={item.productId}
            item={item}
            onIncrease={() => increaseQuantity.mutate(item.productId)}
            onDecrease={() => decreaseQuantity.mutate(item.productId)}
            onRemove={() => removeItem.mutate(item.productId)}
          />
        ))}

        <div className="mt-12 bg-white p-8 rounded-[2rem] shadow-sm border border-outline/5">
          <h3 className="text-on-surface font-poppins font-bold text-lg mb-6">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-secondary font-inter">Subtotal</span>
              <span className="text-on-surface font-inter font-semibold">₹{Number(cart?.subtotal || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary font-inter">Tax (5%)</span>
              <span className="text-on-surface font-inter font-semibold">₹{Number(cart?.tax || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between mt-6 pt-6 border-t border-outline/10">
              <span className="text-on-surface font-poppins font-bold text-xl">Total</span>
              <span className="text-primary font-poppins font-bold text-xl">₹{Number(cart?.grandTotal || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-[76px] left-1/2 w-full max-w-md -translate-x-1/2 p-4 bg-white/80 backdrop-blur-xl border-t border-outline/5 z-30">
        <div className="max-w-md mx-auto">
          <button
            className="w-full bg-primary flex items-center justify-center gap-3 py-4 rounded-2xl shadow-xl hover:bg-primary/90 transition-all text-white font-poppins font-bold text-base disabled:opacity-70"
            disabled={items.length === 0 || createCheckoutSession.isPending}
            onClick={handleCheckout}
          >
            <CreditCard size={22} />
            {createCheckoutSession.isPending ? 'Starting Checkout...' : 'Checkout Now'}
          </button>
        </div>
      </div>
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
const CartItem: React.FC<CartItemProps> = ({ item, onIncrease, onDecrease, onRemove }): React.ReactElement => {
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center bg-white p-5 rounded-[2rem] shadow-sm border border-outline/5 group"
    >
      <div className="w-20 h-20 bg-background rounded-2xl flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
        {item.productImage ? (
          <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-10 h-10 bg-primary/10 rounded-full" />
        )}
      </div>
      <div className="flex-1 ml-5">
        <h4 className="text-on-surface font-poppins font-semibold text-base">{item.productName}</h4>
        <p className="text-secondary font-inter text-xs mt-1">Qty {item.quantity}</p>
        <p className="text-primary font-poppins font-bold mt-2 text-lg">₹{Number(item.price || 0).toFixed(2)}</p>
        <p className="text-secondary font-inter text-xs mt-1">Subtotal ₹{Number(item.subtotal || 0).toFixed(2)}</p>
      </div>
      <div className="flex flex-col items-end gap-3">
        <button onClick={handleRemove} className="p-2 hover:bg-red-50 rounded-xl transition-colors">
          <Trash2 size={16} className="text-red-500" />
        </button>
        <div className="flex items-center bg-background rounded-2xl p-1 shadow-inner">
          <button onClick={handleDecrease} className="p-2 hover:bg-white rounded-xl transition-colors shadow-sm">
            <Minus size={16} className="text-primary" />
          </button>
          <span className="mx-4 font-poppins font-bold text-on-surface">{item.quantity}</span>
          <button onClick={handleIncrease} className="p-2 hover:bg-white rounded-xl transition-colors shadow-sm">
            <Plus size={16} className="text-primary" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;
