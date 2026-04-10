'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useProfitLoss } from '@/lib/hooks/use-finance';
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react';

export function ProfitLossCard() {
  const { data, isLoading } = useProfitLoss();

  const plData = data?.data;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profit & Loss Statement</CardTitle>
          <CardDescription>Comprehensive revenue and expense breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!plData) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit & Loss Statement</CardTitle>
        <CardDescription>Comprehensive revenue and expense breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Revenue Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              <h3 className="text-lg font-semibold">Revenue</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Laundry Services</span>
                <span className="font-medium">₹{plData.revenue.laundryServices.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Dry Cleaning</span>
                <span className="font-medium">₹{plData.revenue.dryCleaningServices.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ironing Services</span>
                <span className="font-medium">₹{plData.revenue.ironingServices.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Additional Services</span>
                <span className="font-medium">₹{plData.revenue.additionalServices.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total Revenue</span>
                <span className="text-success">₹{plData.revenue.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Expenses Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-destructive" />
              <h3 className="text-lg font-semibold">Expenses</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Materials</span>
                <span className="font-medium">₹{plData.expenses.materials.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Detergents</span>
                <span className="font-medium">₹{plData.expenses.detergents.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Labor & Wages</span>
                <span className="font-medium">₹{plData.expenses.labor.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Utilities</span>
                <span className="font-medium">₹{plData.expenses.utilities.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Marketing</span>
                <span className="font-medium">₹{plData.expenses.marketing.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rent</span>
                <span className="font-medium">₹{plData.expenses.rent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Maintenance</span>
                <span className="font-medium">₹{plData.expenses.maintenance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Other</span>
                <span className="font-medium">₹{plData.expenses.other.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total Expenses</span>
                <span className="text-destructive">₹{plData.expenses.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <Separator className="my-6" />
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Gross Profit</span>
            <span className="font-semibold">₹{plData.grossProfit.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Operating Income</span>
            <span className="font-semibold">₹{plData.operatingIncome.toLocaleString()}</span>
          </div>
          <Separator />
          <div className="rounded-lg bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className="text-2xl font-bold text-success">
                  ₹{plData.netProfit.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Profit Margin</p>
                <p className="text-2xl font-bold text-success">
                  {plData.profitMargin.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
