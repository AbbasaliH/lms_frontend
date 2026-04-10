'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, 
  Users, 
  Truck, 
  Package, 
  Settings,
  FileText,
  DollarSign,
  Bell
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const actions = [
  {
    title: 'New Order',
    description: 'Create a new laundry order',
    icon: Plus,
    href: '/admin/orders',
    iconBg: 'bg-blue-50 dark:bg-blue-950',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    title: 'Add Customer',
    description: 'Register a new customer',
    icon: Users,
    href: '/admin/customers',
    iconBg: 'bg-blue-50 dark:bg-blue-950',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    title: 'Delivery Boy',
    description: 'Manage delivery personnel',
    icon: Truck,
    href: '/admin/delivery-boys',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    title: 'Inventory',
    description: 'Check stock levels',
    icon: Package,
    href: '/admin/inventory',
    iconBg: 'bg-purple-50 dark:bg-purple-950',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    title: 'Expenses',
    description: 'Record an expense',
    icon: DollarSign,
    href: '/admin/expenses/new',
    iconBg: 'bg-amber-50 dark:bg-amber-950',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    title: 'Reports',
    description: 'View analytics',
    icon: FileText,
    href: '/admin/analytics',
    iconBg: 'bg-cyan-50 dark:bg-cyan-950',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
  },
  {
    title: 'Notifications',
    description: 'Check alerts',
    icon: Bell,
    href: '/admin/notifications',
    iconBg: 'bg-rose-50 dark:bg-rose-950',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
  {
    title: 'Settings',
    description: 'System configuration',
    icon: Settings,
    href: '/admin/settings',
    iconBg: 'bg-slate-50 dark:bg-slate-950',
    iconColor: 'text-slate-600 dark:text-slate-400',
  },
];

export function QuickActions() {
  return (
    <Card className="animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
        <CardDescription className="text-sm">Frequently used operations</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((action) => (
            <Link 
              key={action.title} 
              href={action.href}
              className="group block"
            >
              <div className="flex flex-col items-center gap-3 rounded-lg border bg-card p-4 transition-all hover:bg-accent hover:shadow-md hover:border-primary/20">
                <div className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110',
                  action.iconBg
                )}>
                  <action.icon className={cn('h-6 w-6', action.iconColor)} />
                </div>
                <div className="flex flex-col items-center gap-0.5 text-center">
                  <h3 className="text-sm font-semibold leading-tight">{action.title}</h3>
                  <p className="text-xs text-muted-foreground leading-tight">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
