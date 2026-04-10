import { StatsCard } from '@/components/dashboard/stats-card';
import {
  DollarSign,
  CreditCard,
  Clock,
  XCircle,
  TrendingUp,
  RefreshCcw,
} from 'lucide-react';
import type { PaymentStatsData } from '@/lib/types/payment';

interface PaymentStatsProps {
  stats: PaymentStatsData | undefined;
}

export function PaymentStats({ stats }: PaymentStatsProps) {
  if (!stats) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Revenue"
        value={`$${stats.totalRevenue.toLocaleString()}`}
        icon={DollarSign}
        description={`Avg: $${stats.averageTransactionValue.toFixed(2)}`}
        variant="default"
      />
      <StatsCard
        title="Today's Revenue"
        value={`$${stats.todayRevenue.toLocaleString()}`}
        icon={TrendingUp}
        description={`Month: $${stats.monthRevenue.toLocaleString()}`}
        variant="success"
      />
      <StatsCard
        title="Total Transactions"
        value={stats.totalTransactions}
        icon={CreditCard}
        description="All time payments"
        variant="default"
      />
      <StatsCard
        title="Pending Payments"
        value={stats.pendingPayments}
        icon={Clock}
        description={`Failed: ${stats.failedPayments}`}
        variant="warning"
      />
    </div>
  );
}
