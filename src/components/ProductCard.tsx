/**
 * Product Card Component
 * Displays product with image, price, quantity selector, and add to cart button
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import type { ProductCardProps } from '../types/index';

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
      transition={{ duration: 0.3 }}
      className="w-full max-w-sm mx-auto bg-white rounded-3xl shadow-xl overflow-hidden"
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
            className="flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200"
          >
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400 text-xs">No Image</span>
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <div className="flex-1 flex flex-col justify-between">
            {/* Category Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <span className="inline-block bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {product.category || 'Product'}
              </span>
            </motion.div>

            {/* Product Name and Price */}
            <div className="space-y-1.5">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg font-bold text-gray-900"
              >
                {product.name}
              </motion.h2>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="flex items-baseline gap-1"
              >
                <span className="text-2xl font-bold text-gray-900">
                  ₹{product.price.toFixed(2)}
                </span>
                <span className="text-gray-600 text-xs font-medium">/ unit</span>
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
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1.5">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || isOutOfStock}
              className="text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-90"
            >
              <Minus size={16} />
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) =>
                handleQuantityChange(parseInt(e.target.value) || 1)
              }
              disabled={isOutOfStock}
              className="w-8 text-center font-bold text-sm bg-transparent text-gray-900 focus:outline-none disabled:opacity-50"
              min="1"
              max={product.stock}
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= product.stock || isOutOfStock}
              className="text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-90"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Add to Cart Button */}
          <motion.button
            whileHover={{ scale: isOutOfStock ? 1 : 1.05 }}
            whileTap={{ scale: isOutOfStock ? 1 : 0.95 }}
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding}
            className={`flex-1 py-2.5 rounded-xl font-bold text-white text-sm uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${
              isOutOfStock
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : isAdding
                ? 'bg-green-400'
                : 'bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg active:scale-95'
            }`}
          >
            <ShoppingCart size={16} />
            {isAdding ? 'Adding...' : isOutOfStock ? 'Out Stock' : 'Add to Cart'}
          </motion.button>
        </motion.div>

        {/* Feature Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="flex flex-wrap gap-2.5 pt-4 border-t border-gray-200"
        >
          {/* Organic Badge */}
          <div className="flex items-center gap-1.5 text-xs text-gray-700">
            <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-green-700">✓</span>
            </div>
            <span className="font-medium">Organic</span>
          </div>

          {/* Calories Badge */}
          {(product as Record<string, unknown>)?.calories && (
            <div className="flex items-center gap-1.5 text-xs text-gray-700">
              <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-blue-700">ℹ</span>
              </div>
              <span className="font-medium">
                {(product as Record<string, unknown>).calories}
              </span>
            </div>
          )}

          {/* Local Badge */}
          <div className="flex items-center gap-1.5 text-xs text-gray-700">
            <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-purple-700">◉</span>
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
        className="w-full py-3 font-semibold text-green-700 bg-green-50/50 hover:bg-green-50 transition-colors uppercase tracking-wide text-xs border-t border-gray-200"
      >
        Scan Another Product
      </motion.button>
    </motion.div>
  );
};
