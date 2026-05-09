// Authentication API Services

import { apiClient } from './client';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '../types/api';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/auth/login', credentials);
  },

  signup: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return apiClient.post<RegisterResponse>('/auth/signup', data);
  },

  /**
   * Create a user account from the admin panel without triggering auto-login.
   * Uses raw fetch with credentials: 'omit' so the browser does not store
   * any session cookies / tokens returned by the signup endpoint.
   */
  signupSilently: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://your-api-domain.com/api/v1';
    const authStorage = typeof window !== 'undefined' ? localStorage.getItem('auth-storage') : null;
    const token = authStorage ? JSON.parse(authStorage)?.state?.token : null;

    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'omit',
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || result.error || 'Signup failed');
    }

    return result;
  },

  sendOtp: async (phoneNumber: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.post<{ success: boolean; message: string }>('/auth/send-otp', { phoneNumber });
  },

  verifyOtp: async (phoneNumber: string, otp: string): Promise<{ success: boolean; message: string; data?: { token: string } }> => {
    return apiClient.post<{ success: boolean; message: string; data?: { token: string } }>('/auth/verify-otp', { phoneNumber, otp });
  },

  getMe: async (): Promise<{ success: boolean; data: import('../types/api').ApiUser }> => {
    return apiClient.get<{ success: boolean; data: import('../types/api').ApiUser }>('/auth/me');
  },

  refreshToken: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    return apiClient.post<RefreshTokenResponse>('/auth/refresh', data);
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout', {});
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
};