import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { IProduct } from '../types/index';
import { toast } from 'sonner';

interface ProductListResponse {
  data: IProduct[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

interface ImportResult {
  total: number;
  success: number;
  duplicates: number;
  failed: number;
  errors: Array<{
    row: number;
    field: string;
    value: unknown;
    error: string;
  }>;
  skipped: Array<{
    row: number;
    reason: string;
    data: unknown;
  }>;
}

const API_BASE = '/api/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const useProducts = (
  page: number = 1,
  limit: number = 20,
  search: string = '',
  category: string = '',
  status: string = ''
) => {
  return useQuery({
    queryKey: ['products', page, limit, search, category, status],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', limit.toString());
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (status) params.set('status', status);

      const response = await fetch(`${API_BASE}/products?${params}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json() as Promise<ProductListResponse>;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useProductById = (id: string) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      return response.json();
    },
    enabled: !!id,
  });
};

export const useImportProducts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const headers: Record<string, string> = {};

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE}/imports/upload`, {
        method: 'POST',
        body: formData,
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Import failed');
      }

      return response.json() as Promise<{ data: ImportResult }>;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      if (data.data.success > 0) {
        toast.success(`Successfully imported ${data.data.success} products!`);
      }
      if (data.data.duplicates > 0) {
        toast.info(`Skipped ${data.data.duplicates} duplicate products`);
      }
      if (data.data.failed > 0) {
        toast.warning(`${data.data.failed} records failed validation`);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Import failed');
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData: any) => {
      const response = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error('Failed to create product');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create product');
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update product');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update product');
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error('Failed to delete product');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete product');
    },
  });
};
