'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Info, 
  Package, 
  CreditCard, 
  Truck, 
  Gift, 
  Bell,
  Trash2,
  Eye 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Notification, NotificationType, NotificationPriority } from '@/lib/types/notification';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'SUCCESS':
      return CheckCircle;
    case 'ERROR':
      return XCircle;
    case 'WARNING':
      return AlertTriangle;
    case 'ORDER_UPDATE':
      return Package;
    case 'PAYMENT':
      return CreditCard;
    case 'DELIVERY':
      return Truck;
    case 'PROMOTION':
      return Gift;
    default:
      return Info;
  }
};

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case 'SUCCESS':
      return 'text-emerald-500 bg-emerald-500/10';
    case 'ERROR':
      return 'text-red-500 bg-red-500/10';
    case 'WARNING':
      return 'text-amber-500 bg-amber-500/10';
    case 'ORDER_UPDATE':
      return 'text-blue-500 bg-blue-500/10';
    case 'PAYMENT':
      return 'text-green-500 bg-green-500/10';
    case 'DELIVERY':
      return 'text-purple-500 bg-purple-500/10';
    case 'PROMOTION':
      return 'text-pink-500 bg-pink-500/10';
    default:
      return 'text-blue-500 bg-blue-500/10';
  }
};

const getPriorityBorderColor = (priority: NotificationPriority) => {
  switch (priority) {
    case 'URGENT':
      return 'border-l-red-500';
    case 'HIGH':
      return 'border-l-orange-500';
    case 'NORMAL':
      return 'border-l-blue-500';
    case 'LOW':
      return 'border-l-gray-400';
    default:
      return 'border-l-gray-300';
  }
};

const getPriorityBadge = (priority: NotificationPriority) => {
  switch (priority) {
    case 'URGENT':
      return <Badge variant="destructive" className="text-xs">Urgent</Badge>;
    case 'HIGH':
      return <Badge className="text-xs bg-orange-500">High</Badge>;
    default:
      return null;
  }
};

export function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
  const Icon = getNotificationIcon(notification.type);
  const colorClass = getNotificationColor(notification.type);
  const borderClass = getPriorityBorderColor(notification.priority);

  return (
    <Card 
      className={cn(
        'border-l-4 transition-opacity',
        borderClass,
        notification.isRead ? 'opacity-60' : ''
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${colorClass}`}>
            <Icon className="h-5 w-5" />
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className={cn(
                    'font-semibold',
                    notification.isRead ? 'text-muted-foreground' : ''
                  )}>
                    {notification.title}
                  </h4>
                  {!notification.isRead && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
                <p className={cn(
                  'text-sm',
                  notification.isRead ? 'text-muted-foreground' : 'text-foreground'
                )}>
                  {notification.message}
                </p>
              </div>
              
              <div className="flex items-start gap-2">
                {getPriorityBadge(notification.priority)}
                {!notification.isRead && <Badge variant="default" className="text-xs">New</Badge>}
              </div>
            </div>
            
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
              </p>
              
              <div className="flex items-center gap-2">
                {!notification.isRead && onMarkAsRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Mark as read
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-destructive hover:text-destructive"
                    onClick={() => onDelete(notification.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
