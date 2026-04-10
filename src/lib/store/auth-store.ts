import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '@/lib/types/schema';
import type { ApiUser } from '@/lib/types/api';

interface AuthState {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  login: (user: ApiUser, token: string, refreshToken: string) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateUser: (user: Partial<User>) => void;
  updateTokens: (token: string, refreshToken: string) => void;
}

// Helper function to convert API user to internal User type
const convertApiUserToUser = (apiUser: ApiUser): User => {
  // Map API role to internal role format
  const roleMap: Record<ApiUser['role'], UserRole> = {
    'ADMIN': 'admin',
    'SUPER_ADMIN': 'super_admin',
    'CUSTOMER': 'customer',
    'DELIVERY_BOY': 'delivery_boy',
  };

  return {
    id: apiUser.id,
    email: apiUser.email,
    name: apiUser.fullName,
    role: roleMap[apiUser.role],
    phone: apiUser.phoneNumber,
    avatar: apiUser.profileImage || undefined,
    shopId: undefined, // Will be set separately if needed
  };
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      isAuthenticated: false,
      token: null,
      refreshToken: null,
      login: (apiUser, token, refreshToken) => {
        const user = convertApiUserToUser(apiUser);
        set({
          user,
          role: user.role,
          isAuthenticated: true,
          token,
          refreshToken,
        });
      },
      logout: () =>
        set({
          user: null,
          role: null,
          isAuthenticated: false,
          token: null,
          refreshToken: null,
        }),
      switchRole: (role) =>
        set((state) => ({
          role,
          user: state.user ? { ...state.user, role } : null,
        })),
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
      updateTokens: (token, refreshToken) =>
        set({
          token,
          refreshToken,
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
);