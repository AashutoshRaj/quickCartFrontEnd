import api from '../axios.ts';

export const getProducts = async (
  page = 1,
  limit = 20,
  search = '',
  category = '',
  status = '',
  sortBy = 'createdDate',
  sortOrder = 'desc'
) => {
  const response = await api.get('/products', {
    params: { page, limit, search, category, status, sortBy, sortOrder },
  });
  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (data: any) => {
  const response = await api.post('/products', data);
  return response.data;
};

export const updateProduct = async (id: string, data: any) => {
  const response = await api.patch(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};
