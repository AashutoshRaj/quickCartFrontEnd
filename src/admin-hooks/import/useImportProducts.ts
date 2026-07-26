import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { uploadProducts } from '../../api/import/importApi';

export const useImportProducts = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => uploadProducts(formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['importHistory'] });
      qc.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Import failed';
      toast.error(message);
    },
  });
};

export default useImportProducts;
