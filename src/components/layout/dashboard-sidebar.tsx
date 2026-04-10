'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Package,
  Truck,
  Warehouse,
  Building2,
  CreditCard,
  DollarSign,
  Repeat,
  MessageSquare,
  Bell,
  Settings,
  Store,
  UserCog,
  TrendingUp,
  BarChart3,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth-store';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const adminNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { title: 'Customers', href: '/admin/customers', icon: Users },
  { title: 'Orders', href: '/admin/orders', icon: Package },
  { title: 'Delivery Boys', href: '/admin/delivery-boys', icon: Truck },
  { title: 'Inventory', href: '/admin/inventory', icon: Warehouse },
  { title: 'Suppliers', href: '/admin/suppliers', icon: Building2 },
  { title: 'Payments', href: '/admin/payments', icon: CreditCard },
  { title: 'Pricing', href: '/admin/pricing', icon: DollarSign },
  { title: 'Subscriptions', href: '/admin/subscriptions', icon: Repeat },
  { title: 'Queries', href: '/admin/queries', icon: MessageSquare },
  { title: 'Notifications', href: '/admin/notifications', icon: Bell },
  { title: 'Settings', href: '/admin/settings', icon: Settings },
];

const superAdminNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/super-admin', icon: LayoutDashboard },
  { title: 'Shops', href: '/super-admin/shops', icon: Store },
  { title: 'Admins', href: '/super-admin/admins', icon: UserCog },
  { title: 'Customers', href: '/super-admin/customers', icon: Users },
  { title: 'Revenue', href: '/super-admin/revenue', icon: TrendingUp },
  { title: 'Analytics', href: '/super-admin/analytics', icon: BarChart3 },
  { title: 'Subscriptions', href: '/super-admin/subscriptions', icon: Repeat },
  { title: 'Settings', href: '/super-admin/settings', icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const role = useAuthStore((state) => state.role);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  const navItems = role === 'super_admin' ? superAdminNavItems : adminNavItems;

  // Fixed active state logic
  const isActiveRoute = (href: string) => {
    // For dashboard routes (base routes), only match exact path
    if (href === '/admin' || href === '/super-admin') {
      return pathname === href;
    }
    // For other routes, match exact path or sub-routes
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <ScrollArea className="h-full px-3 py-4">
      <div className="flex flex-col gap-2">
        {/* Navigation Header */}
        <div className="px-3 py-2">
          <h2 className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Navigation
          </h2>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.href);
            const isHovered = hoveredItem === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={() => setHoveredItem(item.href)}
                onMouseLeave={() => setHoveredItem(null)}
                className={cn(
                  'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  'hover:bg-accent/50',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-primary-foreground/80" />
                )}
                
                {/* Icon */}
                <Icon 
                  className={cn(
                    'h-4 w-4 shrink-0 transition-transform duration-200',
                    isActive && 'scale-110',
                    isHovered && !isActive && 'scale-105'
                  )} 
                />
                
                {/* Title */}
                <span className="flex-1 truncate">{item.title}</span>
                
                {/* Badge */}
                {item.badge && (
                  <span className={cn(
                    'ml-auto rounded-full px-2 py-0.5 text-xs font-semibold',
                    isActive 
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}>
                    {item.badge}
                  </span>
                )}
                
                {/* Chevron indicator on hover */}
                <ChevronRight 
                  className={cn(
                    'h-4 w-4 shrink-0 opacity-0 transition-all duration-200',
                    isHovered && !isActive && 'opacity-60 translate-x-0.5'
                  )} 
                />
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section - Optional */}
        <Separator className="my-4" />
        
        <div className="px-3 pb-2">
          <p className="px-2 text-xs text-muted-foreground">
            {role === 'super_admin' ? 'Super Admin Panel' : 'Admin Panel'}
          </p>
        </div>
      </div>
    </ScrollArea>
  );
}