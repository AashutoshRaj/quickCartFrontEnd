import apiClient from './axios';

export const getUserProfile = () => {
  return apiClient.get('/users/profile');
};

export const updateLanguage = (language) => {
  return apiClient.patch('/users/language', { language });
};

export const updateNotifications = (data) => {
  return apiClient.patch('/users/notifications', data);
};

export const addPaymentMethod = (data) => {
  return apiClient.post('/users/payment-methods', data);
};

export const deletePaymentMethod = (paymentMethodId) => {
  return apiClient.delete(`/users/payment-methods/${paymentMethodId}`);
};

export const setDefaultPaymentMethod = (paymentMethodId) => {
  return apiClient.patch(`/users/payment-methods/${paymentMethodId}/default`);
};

export const uploadProfileImage = (formData) => {
  return apiClient.post('/users/profile-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteProfileImage = () => {
  return apiClient.delete('/users/profile-image');
};
