/**
 * Product Card Component
 * Displays product with image, price, quantity selector, and add to cart button
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Leaf, MapPinned } from 'lucide-react';
import type { ProductCardProps } from '../types/index';

const SOFT_SHADOW = 'shadow-[0_2px_8px_rgba(15,23,42,0.04),0_12px_30px_rgba(15,23,42,0.08)]';

/**
 * ProductCard Component
 *
 * Displays a product card with comprehensive product information,
 * quantity selection, and cart functionality.
 *
 * @param {ProductCardProps} props - Component props
 * @param {Product | null} props.product - Product data to display (null = no render)
 * @param {Function} props.onAddToCart - Callback when adding to cart (receives quantity)
 * @param {boolean} props.isAdding - Loading state while adding to cart
 * @param {Function} props.onScanAnother - Callback to scan another product
 * @returns {React.ReactElement | null} Product card or null if no product
 *
 * @remarks
 * - Shows product image with fallback placeholder
 * - Category badge with green styling
 * - Quantity controls with min/max validation
 * - Disabled state when out of stock
 * - Animated entry and interactions
 * - Feature badges (Organic, Local, etc.)
 *
 * @example
 * <ProductCard
 *   product={{ name: 'Apple', price: 50, stock: 10 }}
 *   onAddToCart={(qty) => addToCart(qty)}
 *   isAdding={false}
 *   onScanAnother={() => resetScanner()}
 * />
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  isAdding = false,
  onScanAnother,
}): React.ReactElement | null => {
  const [quantity, setQuantity] = useState<number>(1);

  /**
   * Return null if no product
   */
  if (!product) return null;

  /**
   * Check if product is out of stock
   */
  const isOutOfStock = product.stock === 0;

  /**
   * Handle add to cart with quantity reset
   */
  const handleAddToCart = (): void => {
    onAddToCart?.(quantity);
    setQuantity(1);
  };

  /**
   * Handle quantity change with validation
   */
  const handleQuantityChange = (value: number): void => {
    const newQuantity = Math.max(1, Math.min(value, product.stock));
    setQuantity(newQuantity);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`w-full max-w-sm mx-auto bg-white rounded-[24px] ${SOFT_SHADOW} overflow-hidden`}
    >
      {/* Main Card Content */}
      <div className="p-6 space-y-5">
        {/* Product Image and Details Row */}
        <div className="flex gap-4">
          {/* Product Image */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex-shrink-0 w-24 h-24 rounded-[18px] overflow-hidden bg-background flex items-center justify-center"
          >
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-primary/10 rounded-full" />
            )}
          </motion.div>

          {/* Product Info */}
          <div className="flex-1 flex flex-col justify-between min-w-0">
            {/* Category Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <span className="inline-block bg-primary/10 text-primary px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                {product.category || 'Product'}
              </span>
            </motion.div>

            {/* Product Name and Price */}
            <div className="space-y-1.5">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-on-surface font-poppins font-bold text-base truncate"
              >
                {product.name}
              </motion.h2>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="flex items-baseline gap-1"
              >
                <span className="text-primary font-poppins font-bold text-2xl">
                  ₹{product.price.toFixed(2)}
                </span>
                <span className="text-secondary font-inter text-xs font-medium">/ unit</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Quantity Selector and Add to Cart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3"
        >
          {/* Quantity Control */}
          <div className="flex items-center bg-background rounded-2xl p-1">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || isOutOfStock}
              className={`p-2 bg-white rounded-xl ${SOFT_SHADOW} hover:scale-105 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-transform duration-150`}
            >
              <Minus size={14} className="text-primary" />
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) =>
                handleQuantityChange(parseInt(e.target.value) || 1)
              }
              disabled={isOutOfStock}
              className="w-9 text-center font-poppins font-bold text-sm bg-transparent text-on-surface focus:outline-none disabled:opacity-50"
              min="1"
              max={product.stock}
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= product.stock || isOutOfStock}
              className={`p-2 bg-white rounded-xl ${SOFT_SHADOW} hover:scale-105 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-transform duration-150`}
            >
              <Plus size={14} className="text-primary" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <motion.button
            whileTap={{ scale: isOutOfStock ? 1 : 0.97 }}
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding}
            className={`flex-1 py-3 rounded-[16px] font-poppins font-bold text-white text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
              isOutOfStock
                ? 'bg-outline/30 text-white/80 cursor-not-allowed'
                : isAdding
                ? 'bg-primary/70'
                : 'bg-gradient-to-br from-primary to-[#FF9F1C] shadow-[0_8px_20px_rgba(255,184,0,0.3)] hover:shadow-[0_10px_24px_rgba(255,184,0,0.4)]'
            }`}
          >
            <ShoppingCart size={16} />
            {isAdding ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </motion.button>
        </motion.div>

        {/* Feature Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="flex flex-wrap gap-3 pt-4 border-t border-outline/10"
        >
          {/* Organic Badge */}
          <div className="flex items-center gap-1.5 text-secondary text-xs">
            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <Leaf size={11} className="text-green-700" />
            </div>
            <span className="font-medium">Organic</span>
          </div>

          {/* Calories Badge */}
          {product.calories != null && (
            <div className="flex items-center gap-1.5 text-secondary text-xs">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-blue-700">i</span>
              </div>
              <span className="font-medium">
                {String(product.calories)}
              </span>
            </div>
          )}

          {/* Local Badge */}
          <div className="flex items-center gap-1.5 text-secondary text-xs">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MapPinned size={11} className="text-primary" />
            </div>
            <span className="font-medium">Local</span>
          </div>
        </motion.div>
      </div>

      {/* Scan Another Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        onClick={onScanAnother}
        className="w-full py-3.5 font-inter font-semibold text-primary active:bg-background transition-colors duration-150 text-sm border-t border-outline/10"
      >
        Scan Another Product
      </motion.button>
    </motion.div>
  );
};
