import { StatsCard } from '@/components/dashboard/stats-card';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  TrendingUp,
  XCircle,
  Package,
} from 'lucide-react';
import type { ApiOrder } from '@/lib/types/api';

interface OrderStatsProps {
  orders: ApiOrder[];
}

export function OrderStats({ orders }: OrderStatsProps) {
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'PENDING').length,
    processing: orders.filter((o) => o.status === 'PROCESSING').length,
    ready: orders.filter((o) => o.status === 'READY').length,
    delivered: orders.filter((o) => o.status === 'DELIVERED').length,
    cancelled: orders.filter((o) => o.status === 'CANCELLED').length,
  };

  const totalRevenue = orders
    .filter((o) => o.status === 'DELIVERED')
    .reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Orders"
        value={stats.total}
        icon={ShoppingBag}
        description="All time orders"
        variant="default"
      />
      <StatsCard
        title="Pending"
        value={stats.pending}
        icon={Clock}
        description="Awaiting processing"
        variant="warning"
      />
      <StatsCard
        title="In Progress"
        value={stats.processing + stats.ready}
        icon={Package}
        description="Being processed"
        variant="default"
      />
      <StatsCard
        title="Delivered"
        value={stats.delivered}
        icon={CheckCircle2}
        description={`$${totalRevenue.toFixed(2)} revenue`}
        variant="success"
      />
    </div>
  );
}
