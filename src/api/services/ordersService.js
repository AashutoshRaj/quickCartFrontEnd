import apiClient from '../axios';

const ordersService = {
  getOrders: async (params = {}) => {
    const response = await apiClient.get('/orders', { params });
    return response.data.data;
  },

  getOrderById: async (orderId) => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data.data;
  },

  downloadInvoice: async (orderId) => {
    const response = await apiClient.get(`/orders/${orderId}/invoice`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default ordersService;
