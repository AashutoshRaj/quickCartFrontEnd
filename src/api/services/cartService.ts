/**
 * Cart Service
 * Handles shopping cart operations including add, update, remove, and checkout
 */

import apiClient from '../axios.ts';
import type {
  AddToCartRequest,
  AddToCartResponse,
  CartUpdateRequest,
  GetCartResponse,
  CheckoutSessionResponse,
  ApiSuccessResponse
} from '../../types/index';

/**
 * Get active store ID from localStorage
 * Defaults to 'default-store' if not set
 *
 * @returns {string} Active store ID
 * @internal
 */
const getStoreId = (): string => {
  return localStorage.getItem('activeStoreId') || 'default-store';
};

/**
 * Cart service object with async methods for cart management
 */
const cartService = {
  /**
   * Add product to cart
   *
   * @param {Object} params - Add to cart parameters
   * @param {string} params.productId - Product ID
   * @param {number} [params.quantity=1] - Quantity to add (default: 1)
   * @param {string} [params.storeId] - Store ID (uses active store if not provided)
   * @returns {Promise<AddToCartResponse>} Response with cart update
   *
   * @example
   * const response = await cartService.addToCart({
   *   productId: 'prod_123',
   *   quantity: 2
   * });
   */
  addToCart: async (params: {
    productId: string;
    quantity?: number | undefined;
    storeId?: string | undefined;
  }): Promise<AddToCartResponse> => {
    const response = await apiClient.post<AddToCartResponse>('/cart/add', {
      productId: params.productId,
      quantity: params.quantity ?? 1,
      storeId: params.storeId || getStoreId(),
    });
    return response.data;
  },

  /**
   * Get current cart contents
   *
   * @returns {Promise<GetCartResponse>} Cart data with items and total
   *
   * @example
   * const cart = await cartService.getCart();
   */
  getCart: async (): Promise<GetCartResponse> => {
    const response = await apiClient.get<GetCartResponse>('/cart', {
      params: { storeId: getStoreId() },
    });
    return response.data;
  },

  /**
   * Update product quantity in cart
   *
   * @param {Object} params - Update parameters
   * @param {string} params.productId - Product ID to update
   * @param {number} params.quantity - New quantity
   * @returns {Promise<AddToCartResponse>} Updated cart response
   *
   * @example
   * const response = await cartService.updateCart({
   *   productId: 'prod_123',
   *   quantity: 5
   * });
   */
  updateCart: async (params: {
    productId: string;
    quantity: number;
  }): Promise<AddToCartResponse> => {
    const response = await apiClient.patch<AddToCartResponse>(
      `/cart/update/${params.productId}`,
      {
        quantity: params.quantity,
        storeId: getStoreId(),
      }
    );
    return response.data;
  },

  /**
   * Increase product quantity by 1
   *
   * @param {string} productId - Product ID to increase
   * @returns {Promise<AddToCartResponse>} Updated cart response
   *
   * @example
   * const response = await cartService.increaseQuantity('prod_123');
   */
  increaseQuantity: async (productId: string): Promise<AddToCartResponse> => {
    const response = await apiClient.patch<AddToCartResponse>(
      `/cart/quantity/increase/${productId}`,
      { storeId: getStoreId() }
    );
    return response.data;
  },

  /**
   * Decrease product quantity by 1
   *
   * @param {string} productId - Product ID to decrease
   * @returns {Promise<AddToCartResponse>} Updated cart response
   *
   * @example
   * const response = await cartService.decreaseQuantity('prod_123');
   */
  decreaseQuantity: async (productId: string): Promise<AddToCartResponse> => {
    const response = await apiClient.patch<AddToCartResponse>(
      `/cart/quantity/decrease/${productId}`,
      { storeId: getStoreId() }
    );
    return response.data;
  },

  /**
   * Remove product from cart
   *
   * @param {string} productId - Product ID to remove
   * @returns {Promise<AddToCartResponse>} Updated cart response
   *
   * @example
   * const response = await cartService.removeCartItem('prod_123');
   */
  removeCartItem: async (productId: string): Promise<AddToCartResponse> => {
    const response = await apiClient.delete<AddToCartResponse>(
      `/cart/remove/${productId}`,
      { data: { storeId: getStoreId() } }
    );
    return response.data;
  },

  /**
   * Clear entire cart
   *
   * @returns {Promise<AddToCartResponse>} Confirmation response
   *
   * @example
   * const response = await cartService.clearCart();
   */
  clearCart: async (): Promise<AddToCartResponse> => {
    const response = await apiClient.delete<AddToCartResponse>('/cart/clear', {
      data: { storeId: getStoreId() },
    });
    return response.data;
  },

  /**
   * Create checkout session for payment
   *
   * @returns {Promise<CheckoutSessionResponse>} Checkout session with session ID
   *
   * @example
   * const session = await cartService.createCheckoutSession();
   */
  createCheckoutSession: async (): Promise<CheckoutSessionResponse> => {
    const response = await apiClient.post<CheckoutSessionResponse>(
      '/checkout/session',
      { storeId: getStoreId() }
    );
    return response.data;
  },
};

export default cartService;
