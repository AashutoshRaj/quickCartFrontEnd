import { useQuery } from '@tanstack/react-query';
import cartService from '../../api/services/cartService';

export const useCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: () => cartService.getCart(),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};
