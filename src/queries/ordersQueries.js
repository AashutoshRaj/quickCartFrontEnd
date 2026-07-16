import { useQuery, useMutation } from '@tanstack/react-query';
import ordersService from '../api/services/ordersService';

export const useOrders = (params = {}) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => ordersService.getOrders(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useOrderDetails = (orderId) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => ordersService.getOrderById(orderId),
    enabled: !!orderId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useDownloadInvoice = () => {
  return useMutation({
    mutationFn: (orderId) => ordersService.downloadInvoice(orderId),
    onSuccess: (data, orderId) => {
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error('Invoice download error:', error);
    },
  });
};
