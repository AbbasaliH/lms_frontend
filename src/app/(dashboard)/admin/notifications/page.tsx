'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useMyNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
} from '@/lib/hooks/use-notifications';
import { NotificationItem } from '@/components/notifications/notification-item';
import { NotificationFilters } from '@/components/notifications/notification-filters';
import { NotificationStats } from '@/components/notifications/notification-stats';
import { NotificationType, NotificationPriority } from '@/lib/types/notification';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function NotificationsPage() {
  const [currentTab, setCurrentTab] = useState<'all' | 'unread' | 'read'>('all');
  const [filters, setFilters] = useState<{
    isRead?: boolean;
    type?: NotificationType;
    priority?: NotificationPriority;
    page?: number;
    limit?: number;
  }>({
    page: 1,
    limit: 20,
  });

  // Determine filters based on current tab
  const getFiltersForTab = () => {
    const baseFilters = {
      ...filters,
      page: filters.page || 1,
      limit: filters.limit || 20,
    };

    if (currentTab === 'unread') {
      return { ...baseFilters, isRead: false };
    } else if (currentTab === 'read') {
      return { ...baseFilters, isRead: true };
    }
    
    // For 'all' tab, only include isRead if explicitly set in filters
    return baseFilters;
  };

  const { data, isLoading, refetch } = useMyNotifications(getFiltersForTab());
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const deleteNotification = useDeleteNotification();

  const notifications = data?.data?.notifications || [];
  const pagination = data?.data?.pagination;
  const hasUnread = notifications.some((n) => !n.isRead);

  const handleFilterChange = (newFilters: any) => {
    setFilters({
      ...newFilters,
      page: 1, // Reset to first page when filters change
      limit: filters.limit,
    });
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  const handleDelete = (id: string) => {
    deleteNotification.mutate(id);
  };

  const handlePageChange = (newPage: number) => {
    setFilters({
      ...filters,
      page: newPage,
    });
  };

  const handleTabChange = (value: string) => {
    setCurrentTab(value as 'all' | 'unread' | 'read');
    setFilters({
      type: filters.type,
      priority: filters.priority,
      page: 1,
      limit: filters.limit,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground">
            Manage and view all your notifications
          </p>
        </div>
        {hasUnread && (
          <Button
            onClick={handleMarkAllAsRead}
            disabled={markAllAsRead.isPending}
          >
            {markAllAsRead.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Marking...
              </>
            ) : (
              <>
                <CheckCheck className="mr-2 h-4 w-4" />
                Mark all as read
              </>
            )}
          </Button>
        )}
      </div>

      {/* Statistics */}
      <NotificationStats />

      {/* Tabs and Filters */}
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
          </TabsList>

          <NotificationFilters
            filters={{
              type: filters.type,
              priority: filters.priority,
            }}
            onFilterChange={handleFilterChange}
          />
        </div>

        <TabsContent value={currentTab} className="mt-6 space-y-4">
          {/* Notifications List */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : notifications.length > 0 ? (
            <>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between border-t pt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                    {pagination.total} notifications
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                        .filter((page) => {
                          // Show first page, last page, current page, and pages around current
                          return (
                            page === 1 ||
                            page === pagination.totalPages ||
                            Math.abs(page - pagination.page) <= 1
                          );
                        })
                        .map((page, index, array) => {
                          // Add ellipsis if there's a gap
                          const showEllipsis = index > 0 && page - array[index - 1] > 1;
                          return (
                            <div key={page} className="flex items-center">
                              {showEllipsis && (
                                <span className="px-2 text-muted-foreground">...</span>
                              )}
                              <Button
                                variant={page === pagination.page ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handlePageChange(page)}
                              >
                                {page}
                              </Button>
                            </div>
                          );
                        })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={!pagination.hasMore}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-semibold mb-1">No notifications</h3>
                <p className="text-sm text-muted-foreground text-center">
                  {currentTab === 'unread'
                    ? "You're all caught up! No unread notifications."
                    : currentTab === 'read'
                    ? 'No read notifications to show.'
                    : 'You have no notifications yet.'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
