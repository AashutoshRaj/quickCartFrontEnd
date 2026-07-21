import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../../api/products/productApi';

export const useProducts = (page = 1, limit = 20, search = '') => {
  return useQuery({
    queryKey: ['products', page, limit, search],
    queryFn: () => getProducts(page, limit, search),
  });
};

export default useProducts;
