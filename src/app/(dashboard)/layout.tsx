'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { AdvancedSidebar } from '@/components/layout/advanced-sidebar';
import { Sheet, SheetContent } from '@/components/ui/sheet';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, role } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Wait for hydration to complete before checking auth
    if (!isHydrated) return;

    // Add a delay to allow state to settle after login and persist to localStorage
    const checkAuth = setTimeout(() => {
      // Check if user is authenticated
      if (!isAuthenticated || !user) {
        router.push('/auth');
        return;
      }

      // Role-based access control
      const isAdminRoute = pathname.startsWith('/admin');
      const isSuperAdminRoute = pathname.startsWith('/super-admin');

      // Redirect based on role and current path
      if (role === 'super_admin' && isAdminRoute && !isSuperAdminRoute) {
        // Super admin trying to access admin-only routes - redirect to super-admin
        router.push('/super-admin');
      } else if (role === 'admin' && isSuperAdminRoute) {
        // Admin trying to access super-admin routes - redirect to admin
        router.push('/admin');
      } else if (role !== 'admin' && role !== 'super_admin') {
        // Other roles shouldn't be here - redirect to login
        router.push('/auth');
      }
    }, 300);

    return () => clearTimeout(checkAuth);
  }, [isAuthenticated, user, role, pathname, router, isHydrated]);

  // Show loading state during hydration or if not authenticated
  if (!isHydrated || !isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex h-full flex-col">
            {/* Sidebar Header */}
            <div className="flex h-16 items-center justify-between border-b px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    <line x1="10" x2="10" y1="11" y2="17" />
                    <line x1="14" x2="14" y1="11" y2="17" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg font-bold tracking-tight">LaundryPro</h1>
                  <p className="text-xs text-muted-foreground">Management Suite</p>
                </div>
              </div>
            </div>
            
            {/* Sidebar Content */}
            <div className="flex-1 overflow-hidden">
              <AdvancedSidebar />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col border-r bg-card shadow-sm">
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" x2="10" y1="11" y2="17" />
                <line x1="14" x2="14" y1="11" y2="17" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">LaundryPro</h1>
              <p className="text-xs text-muted-foreground">Management Suite</p>
            </div>
          </div>
        </div>
        
        {/* Sidebar Content */}
        <div className="flex-1 overflow-hidden">
          <AdvancedSidebar />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-muted/20 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}