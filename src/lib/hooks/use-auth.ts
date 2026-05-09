// Authentication hook with TanStack Query

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authApi } from '@/lib/api/auth';
import { profileApi } from '@/lib/api/profile';
import { useAuthStore } from '@/lib/store/auth-store';
import type { LoginRequest, RegisterRequest } from '@/lib/types/api';

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
        
        // Navigate after state is set
        router.push(redirectPath);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    },
  });

  const signupMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.signup(data),
    onSuccess: async (data, variables) => {
      if (data.success) {
        toast.success(data.message || 'Account created successfully!');
        
        // If signup returned full user + refreshToken, auto-login immediately
        if (data.data.user && data.data.refreshToken) {
          setAuth(data.data.user, data.data.token, data.data.refreshToken);
          
          const role = data.data.user.role;
          let redirectPath = '/admin';
          
          if (role === 'SUPER_ADMIN') {
            redirectPath = '/super-admin';
          } else if (role === 'ADMIN') {
            redirectPath = '/admin';
          }
          
          router.push(redirectPath);
          return;
        }
        
        // Otherwise auto-login by calling login endpoint
        try {
          const loginData = await authApi.login({
            email: variables.email,
            password: variables.password,
          });
          
          if (loginData.success) {
            setAuth(loginData.data.user, loginData.data.token, loginData.data.refreshToken);
            
            const role = loginData.data.user.role;
            let redirectPath = '/admin';
            
            if (role === 'SUPER_ADMIN') {
              redirectPath = '/super-admin';
            } else if (role === 'ADMIN') {
              redirectPath = '/admin';
            }
            
            router.push(redirectPath);
          }
        } catch (loginError) {
          toast.error('Account created but auto-login failed. Please log in manually.');
        }
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Registration failed. Please try again.');
    },
  });

  const logout = async () => {
    try {
      await authApi.logout();
      clearAuth();
      router.push('/auth');
      toast.success('Logged out successfully');
    } catch (error) {
      // Clear local state even if API call fails
      clearAuth();
      router.push('/auth');
    }
  };

  return {
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    signup: signupMutation.mutate,
    signupAsync: signupMutation.mutateAsync,
    logout,
    user,
    isAuthenticated,
    isLoading: loginMutation.isPending || signupMutation.isPending,
    error: loginMutation.error || signupMutation.error,
  };
};

export const useSendOtp = () => {
  return useMutation({
    mutationFn: (phoneNumber: string) => authApi.sendOtp(phoneNumber),
    onError: (error: Error) => toast.error(error.message || 'Failed to send OTP'),
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: ({ phoneNumber, otp }: { phoneNumber: string; otp: string }) => authApi.verifyOtp(phoneNumber, otp),
    onError: (error: Error) => toast.error(error.message || 'OTP verification failed'),
  });
};

export const useGetMe = () => {
  return useQuery({
    queryKey: ['auth-me'],
    queryFn: () => authApi.getMe(),
    retry: false,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof profileApi.updateMe>[0]) => profileApi.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth-me'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
};
