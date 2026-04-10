'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockSubscriptionPlans } from '@/lib/mock-data';
import { Plus, Check } from 'lucide-react';

export default function SubscriptionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Subscriptions</h2>
          <p className="text-muted-foreground">
            Manage subscription plans and active subscriptions
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Plan
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockSubscriptionPlans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/{plan.duration} days</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-success-green mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full" variant="outline">
                Edit Plan
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}