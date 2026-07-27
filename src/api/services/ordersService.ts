/**
 * Orders Service
 * Handles order retrieval and invoice management
 */

import apiClient from '../axios.ts';
import type {
  GetOrdersParams,
  GetOrdersResponse,
  GetOrderByIdResponse,
  OrdersListResult,
  OrderDetails,
} from '../../types/index';

/**
 * Orders service object with async methods for order management
 */
const ordersService = {
  /**
   * Get all orders for the authenticated user
   *
   * @param {Object} [params] - Query parameters for filtering/pagination
   * @param {number} [params.page] - Page number for pagination
   * @param {number} [params.limit] - Items per page
   * @param {string} [params.status] - Filter by order status
   * @returns {Promise<OrdersListResult>} Orders for the page plus total page count
   *
   * @example
   * const orders = await ordersService.getOrders({ page: 1, limit: 10 });
   */
  getOrders: async (params: GetOrdersParams = {}): Promise<OrdersListResult> => {
    const response = await apiClient.get<GetOrdersResponse>('/orders', { params });
    return response.data.data ?? { orders: [], totalPages: 1 };
  },

  /**
   * Get a specific order by ID
   *
   * @param {string} orderId - Order ID to retrieve
   * @returns {Promise<Object>} Order details object
   *
   * @example
   * const order = await ordersService.getOrderById('order_123');
   */
  getOrderById: async (orderId: string): Promise<OrderDetails> => {
    const response = await apiClient.get<GetOrderByIdResponse>(`/orders/${orderId}`);
    return response.data.data;
  },

  /**
   * Download invoice for an order as a PDF blob
   *
   * @param {string} orderId - Order ID for invoice
   * @returns {Promise<Blob>} PDF invoice file as blob
   *
   * @remarks
   * - Returns response data as blob for file download
   * - Can be used with URL.createObjectURL() for download
   *
   * @example
   * const invoiceBlob = await ordersService.downloadInvoice('order_123');
   * const url = URL.createObjectURL(invoiceBlob);
   * // Use url for download or viewing
   */
  downloadInvoice: async (orderId: string): Promise<Blob> => {
    const response = await apiClient.get<Blob>(`/orders/${orderId}/invoice`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default ordersService;
