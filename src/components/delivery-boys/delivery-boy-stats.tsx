'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Star, TrendingUp, DollarSign } from 'lucide-react';

interface DeliveryBoyStatsProps {
  totalDeliveries: number;
  successfulDeliveries: number;
  averageRating: number;
  earnings: number;
}

export function DeliveryBoyStats({
  totalDeliveries,
  successfulDeliveries,
  averageRating,
  earnings,
}: DeliveryBoyStatsProps) {
  const successRate = totalDeliveries > 0 
    ? ((successfulDeliveries / totalDeliveries) * 100).toFixed(1) 
    : '0';

  const stats = [
    {
      title: 'Total Deliveries',
      value: totalDeliveries.toString(),
      icon: Package,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Success Rate',
      value: `${successRate}%`,
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Average Rating',
      value: averageRating ? averageRating.toFixed(1) : 'N/A',
      icon: Star,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Total Earnings',
      value: `₹${earnings.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}