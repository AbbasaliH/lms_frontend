'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Gift, Star, Target, Trophy } from 'lucide-react';
import { CustomerTierBadge } from './customer-tier-badge';
import type { Customer } from '@/lib/types/customer';

interface LoyaltyDashboardProps {
  customer: Customer;
}

const TIER_THRESHOLDS = {
  REGULAR: 0,
  SILVER: 500,
  GOLD: 2000,
  PLATINUM: 5000,
  VIP: 10000,
};

export function LoyaltyDashboard({ customer }: LoyaltyDashboardProps) {
  const getNextTier = (currentTier: string) => {
    switch (currentTier) {
      case 'REGULAR': return 'SILVER';
      case 'SILVER': return 'GOLD';
      case 'GOLD': return 'PLATINUM';
      case 'PLATINUM': return 'VIP';
      default: return null;
    }
  };

  const nextTier = getNextTier(customer.tier);
  const pointsRequired = nextTier ? TIER_THRESHOLDS[nextTier as keyof typeof TIER_THRESHOLDS] : 0;
  const progress = pointsRequired > 0 ? (customer.lifetimePoints / pointsRequired) * 100 : 100;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Tier</CardTitle>
            <Trophy className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mt-2">
              <CustomerTierBadge tier={customer.tier} className="text-lg py-1 px-3" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Points</CardTitle>
            <Star className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customer.loyaltyPoints}</div>
            <p className="text-xs text-muted-foreground">Ready to redeem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lifetime Points</CardTitle>
            <Target className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customer.lifetimePoints}</div>
            <p className="text-xs text-muted-foreground">Total points earned</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tier Progress</CardTitle>
          <CardDescription>
            Earn more points on every order to unlock the next tier and its exclusive benefits.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span>{customer.lifetimePoints} Points</span>
            {nextTier && <span>{pointsRequired} Points to {nextTier}</span>}
            {!nextTier && <span>Maximum Tier Reached!</span>}
          </div>
          <Progress value={progress} className="h-2" />
          
          <div className="bg-muted/50 p-4 rounded-lg flex items-start gap-4 mt-6">
            <div className="bg-primary/10 p-2 rounded-full">
              <Gift className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold">Redeem Rewards</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Use your available points during checkout to get discounts on your orders. 
                100 points = ₹10 off.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
