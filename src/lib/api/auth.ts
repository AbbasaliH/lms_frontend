// Authentication API Services

import { apiClient } from './client';
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '../types/api';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/auth/login', credentials);
  },

  refreshToken: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    return apiClient.post<RefreshTokenResponse>('/auth/refresh', data);
  },

  logout: async (): Promise<void> => {
    // Call logout endpoint if your API has one
    try {
      await apiClient.post('/auth/logout', {});
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
};