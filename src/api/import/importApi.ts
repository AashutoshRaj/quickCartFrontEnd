import api from '../axios.ts';

export const uploadProducts = async (formData: FormData) => {
  const response = await api.post('/imports/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getImportHistory = async (page = 1, limit = 10) => {
  const response = await api.get(`/imports`, {
    params: { page, limit },
  });
  return response.data;
};

export const getImportById = async (id: string) => {
  const response = await api.get(`/imports/${id}`);
  return response.data;
};
