// Authentication hook with TanStack Query

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/auth-store';
import type { LoginRequest } from '@/lib/types/api';

export const useAuth = () => {
  const router = useRouter();
  const { login: setAuth, logout: clearAuth, user, isAuthenticated } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (data) => {
      if (data.success) {
        // Set auth state first
        setAuth(data.data.user, data.data.token, data.data.refreshToken);
        
        // Redirect based on user role (API returns uppercase roles)
        const role = data.data.user.role;
        let redirectPath = '/admin'; // Default to admin
        
        if (role === 'SUPER_ADMIN') {
          redirectPath = '/super-admin';
        } else if (role === 'ADMIN') {
          redirectPath = '/admin';
        }
        
        // Show success toast
        toast.success(data.message || 'Login successful!');
        
        // Use router.push with a longer delay to ensure state is persisted
        // This prevents race condition with localStorage persistence
        setTimeout(() => {
          router.push(redirectPath);
        }, 500);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    },
  });

  const logout = async () => {
    try {
      await authApi.logout();
      clearAuth();
      router.push('/auth');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local state even if API call fails
      clearAuth();
      router.push('/auth');
    }
  };

  return {
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    logout,
    user,
    isAuthenticated,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
  };
};