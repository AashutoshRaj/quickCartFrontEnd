import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadProducts } from '../../api/import/importApi';

export const useImportProducts = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => uploadProducts(formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['importHistory'] });
      qc.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export default useImportProducts;
