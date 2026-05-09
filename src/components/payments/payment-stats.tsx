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

  // Compute fallback values from backend data if optional fields are missing
  const totalRevenue = stats.totalRevenue ?? stats.totalAmount ?? 0;
  const totalTransactions = stats.totalTransactions ?? stats.totalPayments ?? 0;
  const avgTransactionValue = stats.averageTransactionValue ?? (stats.totalPayments > 0 ? stats.totalAmount / stats.totalPayments : 0);
  const todayRevenue = stats.todayRevenue ?? totalRevenue;
  const monthRevenue = stats.monthRevenue ?? totalRevenue;
  const pendingPayments = stats.pendingPayments ?? (stats.byStatus?.find((s) => s.status === 'PENDING')?._count?.id ?? 0);
  const failedPayments = stats.failedPayments ?? (stats.byStatus?.find((s) => s.status === 'FAILED')?._count?.id ?? 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Revenue"
        value={`₹${totalRevenue.toLocaleString()}`}
        icon={DollarSign}
        description={`Avg: ₹${avgTransactionValue.toFixed(2)}`}
        variant="default"
      />
      <StatsCard
        title="Today's Revenue"
        value={`₹${todayRevenue.toLocaleString()}`}
        icon={TrendingUp}
        description={`Month: ₹${monthRevenue.toLocaleString()}`}
        variant="success"
      />
      <StatsCard
        title="Total Transactions"
        value={totalTransactions}
        icon={CreditCard}
        description="All time payments"
        variant="default"
      />
      <StatsCard
        title="Pending Payments"
        value={pendingPayments}
        icon={Clock}
        description={`Failed: ${failedPayments}`}
        variant="warning"
      />
    </div>
  );
}
