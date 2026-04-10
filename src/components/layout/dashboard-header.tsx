'use client';

import { Bell, LogOut, Moon, Sun, User, Search, Menu, ChevronRight, Settings, CheckCircle, AlertTriangle, XCircle, Info, Package, CreditCard, Truck, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/lib/hooks/use-auth';
import { useTheme } from 'next-themes';
import { Badge } from '@/components/ui/badge';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useUnreadCount, useMyNotifications, useMarkAsRead, useMarkAllAsRead } from '@/lib/hooks/use-notifications';
import { NotificationType } from '@/lib/types/notification';
import { formatDistanceToNow } from 'date-fns';

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps = {}) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  
  // Notification hooks
  const { data: unreadCountData } = useUnreadCount();
  const { data: notificationsData } = useMyNotifications({ limit: 5, isRead: false });
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  
  const unreadCount = unreadCountData?.data?.count || 0;
  const recentNotifications = notificationsData?.data?.notifications || [];

  const handleLogout = () => {
    logout();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };
  
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SUCCESS:
        return CheckCircle;
      case NotificationType.ERROR:
        return XCircle;
      case NotificationType.WARNING:
        return AlertTriangle;
      case NotificationType.ORDER_UPDATE:
        return Package;
      case NotificationType.PAYMENT:
        return CreditCard;
      case NotificationType.DELIVERY:
        return Truck;
      case NotificationType.PROMOTION:
        return Gift;
      default:
        return Info;
    }
  };
  
  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SUCCESS:
        return 'text-emerald-500 bg-emerald-500/10';
      case NotificationType.ERROR:
        return 'text-red-500 bg-red-500/10';
      case NotificationType.WARNING:
        return 'text-amber-500 bg-amber-500/10';
      case NotificationType.ORDER_UPDATE:
        return 'text-blue-500 bg-blue-500/10';
      case NotificationType.PAYMENT:
        return 'text-green-500 bg-green-500/10';
      case NotificationType.DELIVERY:
        return 'text-purple-500 bg-purple-500/10';
      case NotificationType.PROMOTION:
        return 'text-pink-500 bg-pink-500/10';
      default:
        return 'text-blue-500 bg-blue-500/10';
    }
  };
  
  const handleMarkAsRead = (id: string) => {
    markAsRead.mutate(id);
  };
  
  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  // Generate breadcrumbs from pathname
  const getBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs = segments.map((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/');
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return { href, label };
    });
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-6 gap-4">
        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Breadcrumbs */}
        <div className="flex-1 flex items-center gap-2 overflow-hidden">
          <nav className="flex items-center gap-1 text-sm" aria-label="Breadcrumb navigation">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center gap-1">
                {index > 0 && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                )}
                <Link
                  href={crumb.href}
                  className={cn(
                    'rounded-md px-2 py-1 transition-colors hover:bg-accent',
                    index === breadcrumbs.length - 1
                      ? 'font-semibold text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {crumb.label}
                </Link>
              </div>
            ))}
          </nav>
        </div>

        {/* Quick Search */}
        <Button 
          variant="outline" 
          className="hidden lg:flex gap-2 w-64 justify-start text-muted-foreground"
          aria-label="Quick search"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <span className="flex-1 text-left">Search...</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative hover:bg-accent"
                aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium"
                    aria-label={`${unreadCount} unread notifications`}
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between px-2 py-2">
                <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-xs"
                    onClick={(e) => {
                      e.preventDefault();
                      handleMarkAllAsRead();
                    }}
                  >
                    Mark all read
                  </Button>
                )}
              </div>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                {recentNotifications.length > 0 ? (
                  recentNotifications.map((notification) => {
                    const Icon = getNotificationIcon(notification.type);
                    const colorClass = getNotificationColor(notification.type);
                    
                    return (
                      <DropdownMenuItem 
                        key={notification.id} 
                        className="flex gap-3 p-3 cursor-pointer"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${colorClass}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </DropdownMenuItem>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Bell className="h-10 w-10 text-muted-foreground/30 mb-2" />
                    <p className="text-sm text-muted-foreground">No new notifications</p>
                  </div>
                )}
              </div>
              <DropdownMenuSeparator />
              <Link href="/admin/notifications">
                <DropdownMenuItem className="justify-center text-sm font-medium cursor-pointer">
                  View all notifications
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="gap-2 hover:bg-accent"
                aria-label="User menu"
              >
                <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                  <AvatarImage src={user?.avatar} alt={`${user?.name || 'User'} profile picture`} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {user?.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:flex flex-col items-start text-left">
                  <span className="text-sm font-medium">{user?.name || 'User'}</span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {user?.role?.replace('_', ' ') || 'User'}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="flex items-center gap-3 p-2">
                <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {user?.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{user?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || 'user@email.com'}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}