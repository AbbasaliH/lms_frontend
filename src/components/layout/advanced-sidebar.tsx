'use client';

import { useState, useMemo } from 'react';
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
  ChevronDown,
  Search,
  CircleHelp,
  Command,
  LogOut,
  ShoppingCart,
  ClipboardList,
  Briefcase,
  FileText,
  Target,
  Zap,
  Receipt,
  Wallet,
  PieChart,
  FolderKanban,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  shortcut?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
  defaultOpen?: boolean;
}

// Admin Navigation Structure
const adminNavSections: NavSection[] = [
  {
    title: 'Overview',
    defaultOpen: true,
    items: [
      { title: 'Dashboard', href: '/admin', icon: LayoutDashboard, shortcut: 'D' },
      { title: 'Analytics', href: '/admin/analytics', icon: BarChart3, shortcut: 'A' },
    ],
  },
  {
    title: 'Customer Management',
    defaultOpen: true,
    items: [
      { title: 'Customers', href: '/admin/customers', icon: Users, shortcut: 'C' },
      { title: 'Orders', href: '/admin/orders', icon: Package, shortcut: 'O' },
      { title: 'Queries', href: '/admin/queries', icon: MessageSquare, badge: '3' },
    ],
  },
  {
    title: 'Operations',
    defaultOpen: true,
    items: [
      { title: 'Delivery Boys', href: '/admin/delivery-boys', icon: Truck },
      { title: 'Inventory', href: '/admin/inventory', icon: Warehouse },
      { title: 'Suppliers', href: '/admin/suppliers', icon: Building2 },
      { title: 'Items Order', href: '/admin/items-orders', icon: ShoppingCart },
      { title: 'Pricing', href: '/admin/pricing', icon: DollarSign },
    ],
  },
  {
    title: 'Expense Management',
    defaultOpen: true,
    items: [
      { title: 'Dashboard', href: '/admin/expenses', icon: Receipt, shortcut: 'E' },
      { title: 'All Expenses', href: '/admin/expenses/list', icon: ClipboardList },
      { title: 'Budgets', href: '/admin/expenses/budgets', icon: Wallet },
      { title: 'Departments', href: '/admin/expenses/departments', icon: FolderKanban },
      { title: 'Reports', href: '/admin/expenses/reports', icon: PieChart },
    ],
  },
  {
    title: 'Finance',
    defaultOpen: false,
    items: [
      { title: 'Dashboard', href: '/admin/finance', icon: TrendingUp, shortcut: 'F' },
      { title: 'Payments', href: '/admin/payments', icon: CreditCard },
      { title: 'Subscriptions', href: '/admin/subscriptions', icon: Repeat },
    ],
  },
  {
    title: 'System',
    defaultOpen: false,
    items: [
      { title: 'Notifications', href: '/admin/notifications', icon: Bell, badge: '5' },
      { title: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
];

// Super Admin Navigation Structure
const superAdminNavSections: NavSection[] = [
  {
    title: 'Overview',
    defaultOpen: true,
    items: [
      { title: 'Dashboard', href: '/super-admin', icon: LayoutDashboard, shortcut: 'D' },
      { title: 'Analytics', href: '/super-admin/analytics', icon: BarChart3, shortcut: 'A' },
    ],
  },
  {
    title: 'Business Management',
    defaultOpen: true,
    items: [
      { title: 'Shops', href: '/super-admin/shops', icon: Store, shortcut: 'S' },
      { title: 'Admins', href: '/super-admin/admins', icon: UserCog },
      { title: 'Customers', href: '/super-admin/customers', icon: Users },
    ],
  },
  {
    title: 'Finance & Growth',
    defaultOpen: true,
    items: [
      { title: 'Revenue', href: '/super-admin/revenue', icon: TrendingUp },
      { title: 'Subscriptions', href: '/super-admin/subscriptions', icon: Repeat },
    ],
  },
  {
    title: 'System',
    defaultOpen: false,
    items: [
      { title: 'Settings', href: '/super-admin/settings', icon: Settings },
    ],
  },
];

interface CollapsibleSectionProps {
  section: NavSection;
  pathname: string;
  isSearching: boolean;
  searchQuery: string;
}

function CollapsibleSection({ section, pathname, isSearching, searchQuery }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(section.defaultOpen ?? false);

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!searchQuery) return section.items;
    return section.items.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [section.items, searchQuery]);

  // Auto-expand if searching and has matching items
  const shouldShow = !isSearching || filteredItems.length > 0;
  const shouldExpand = isSearching && filteredItems.length > 0;

  if (!shouldShow) return null;

  const isActiveRoute = (href: string) => {
    if (href === '/admin' || href === '/super-admin') {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <div className="mb-4">
      {/* Section Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors',
          'text-muted-foreground hover:text-foreground hover:bg-accent/50'
        )}
        aria-expanded={isOpen || shouldExpand}
        aria-label={`${section.title} section`}
      >
        <span>{section.title}</span>
        <ChevronDown
          className={cn(
            'h-3 w-3 transition-transform duration-200',
            (isOpen || shouldExpand) && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>

      {/* Section Items */}
      {(isOpen || shouldExpand) && (
        <nav className="mt-1 flex flex-col gap-0.5">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.href);

            return (
              <TooltipProvider key={item.href} delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                        'hover:bg-accent/60',
                        isActive
                          ? 'bg-primary/10 text-primary shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                      )}

                      {/* Icon */}
                      <Icon
                        className={cn(
                          'h-4 w-4 shrink-0 transition-all duration-200',
                          isActive && 'text-primary scale-110'
                        )}
                      />

                      {/* Title */}
                      <span className="flex-1 truncate">{item.title}</span>

                      {/* Badge or Shortcut */}
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className={cn(
                            'h-5 min-w-5 px-1.5 text-xs',
                            isActive && 'bg-primary/20 text-primary border-primary/30'
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}

                      {item.shortcut && !item.badge && (
                        <kbd
                          className={cn(
                            'hidden h-5 min-w-5 items-center justify-center rounded border px-1.5 text-xs font-medium xl:inline-flex',
                            isActive
                              ? 'border-primary/30 bg-primary/10 text-primary'
                              : 'border-border bg-muted text-muted-foreground'
                          )}
                        >
                          {item.shortcut}
                        </kbd>
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="flex items-center gap-2">
                    <span>{item.title}</span>
                    {item.shortcut && (
                      <kbd className="ml-auto text-xs">
                        <Command className="mr-1 inline h-3 w-3" />
                        {item.shortcut}
                      </kbd>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </nav>
      )}
    </div>
  );
}

export function AdvancedSidebar() {
  const pathname = usePathname();
  const { user, role, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  const navSections = role === 'super_admin' ? superAdminNavSections : adminNavSections;

  const isSearching = searchQuery.length > 0;

  // Get user initials
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get role display
  const getRoleDisplay = () => {
    if (role === 'super_admin') return 'Super Admin';
    if (role === 'admin') return 'Admin';
    return 'User';
  };

  return (
    <div className="flex h-full max-h-screen flex-col overflow-hidden">
      {/* Search Bar */}
      <div className="shrink-0 p-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            type="text"
            placeholder="Search navigation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pl-9 pr-4 text-sm bg-accent/50 border-border/50"
            aria-label="Search navigation"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <kbd className="text-xs">Esc</kbd>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sections */}
      <ScrollArea className="flex-1 overflow-auto px-3">
        <div className="pb-4 pt-2">
          {navSections.map((section) => (
            <CollapsibleSection
              key={section.title}
              section={section}
              pathname={pathname}
              isSearching={isSearching}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      </ScrollArea>

      <Separator className="shrink-0" />

      {/* Quick Actions */}
      <div className="shrink-0 p-3">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  onClick={() => window.open('/help', '_blank')}
                  aria-label="Help and support"
                >
                  <CircleHelp className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Help & Support</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  onClick={() => {
                    // Add keyboard shortcuts modal logic
                  }}
                  aria-label="Keyboard shortcuts"
                >
                  <Command className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Keyboard Shortcuts</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex-1" />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => logout()}
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <Separator className="shrink-0" />

      {/* User Profile Section */}
      <div className="shrink-0 p-3">
        <div className="flex items-center gap-3 rounded-lg bg-accent/50 p-3">
          <Avatar className="h-9 w-9 ring-2 ring-primary/20">
            <AvatarImage src={user?.avatar} alt={`${user?.name || 'User'} profile picture`} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">{user?.name || 'User'}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Badge variant="outline" className="h-4 px-1.5 text-xs font-medium">
                {getRoleDisplay()}
              </Badge>
              {user?.shopId && (
                <span className="text-xs text-muted-foreground">Shop #{user.shopId}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}