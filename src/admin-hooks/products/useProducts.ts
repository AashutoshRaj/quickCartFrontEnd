import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../../api/products/productApi';

export const useProducts = (
  page = 1,
  limit = 20,
  search = '',
  category = '',
  status = '',
  sortBy = 'createdDate',
  sortOrder = 'desc'
) => {
  return useQuery({
    queryKey: ['products', page, limit, search, category, status, sortBy, sortOrder],
    queryFn: () => getProducts(page, limit, search, category, status, sortBy, sortOrder),
  });
};

export default useProducts;
