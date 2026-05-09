// Profile API Services

import { apiClient } from './client';

export const profileApi = {
  getMe: async () => {
    return apiClient.get('/profile/me');
  },

  updateMe: async (data: {
    name?: string;
    phone?: string;
    email?: string;
    shopName?: string;
    address?: string;
    shopPhone?: string;
    notificationPreferences?: {
      email?: boolean;
      sms?: boolean;
      orderUpdates?: boolean;
    };
  }) => {
    return apiClient.put('/profile/me', data);
  },
};
