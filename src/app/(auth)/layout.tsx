'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, role } = useAuthStore();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Wait for hydration to complete before checking auth
    if (!isHydrated) return;

    // If user is already authenticated, redirect to their dashboard
    if (isAuthenticated) {
      const redirectPath = role === 'super_admin' ? '/super-admin' : '/admin';
      router.push(redirectPath);
    }
  }, [isAuthenticated, role, router, isHydrated]);

  // Show loading during hydration
  if (!isHydrated) {
    return null;
  }

  // If authenticated, don't render auth page (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
