import apiClient from '../axios';

const getStoreId = () => {
  return localStorage.getItem('activeStoreId') || 'default-store';
};

const cartService = {
  addToCart: async ({ productId, quantity = 1, storeId = getStoreId() }) => {
    const response = await apiClient.post('/cart/add', { productId, quantity, storeId });
    return response.data;
  },
  getCart: async () => {
    const response = await apiClient.get('/cart', { params: { storeId: getStoreId() } });
    return response.data;
  },
  updateCart: async ({ productId, quantity }) => {
    const response = await apiClient.patch(`/cart/update/${productId}`, { quantity, storeId: getStoreId() });
    return response.data;
  },
  increaseQuantity: async (productId) => {
    const response = await apiClient.patch(`/cart/quantity/increase/${productId}`, { storeId: getStoreId() });
    return response.data;
  },
  decreaseQuantity: async (productId) => {
    const response = await apiClient.patch(`/cart/quantity/decrease/${productId}`, { storeId: getStoreId() });
    return response.data;
  },
  removeCartItem: async (productId) => {
    const response = await apiClient.delete(`/cart/remove/${productId}`, { data: { storeId: getStoreId() } });
    return response.data;
  },
  clearCart: async () => {
    const response = await apiClient.delete('/cart/clear', { data: { storeId: getStoreId() } });
    return response.data;
  },
  createCheckoutSession: async () => {
    const response = await apiClient.post('/checkout/session', { storeId: getStoreId() });
    return response.data;
  },
};

export default cartService;
