import { useQuery } from '@tanstack/react-query';
import { getImportHistory } from '../../api/import/importApi';

export const useImportHistory = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['importHistory', page, limit],
    queryFn: () => getImportHistory(page, limit),
  });
};

export default useImportHistory;
