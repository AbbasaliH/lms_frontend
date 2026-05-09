'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Store } from 'lucide-react';

export default function ShopsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Shops</h2>
          <p className="text-muted-foreground">
            Manage all shops across the platform
          </p>
        </div>
        <Button disabled>
          <Plus className="mr-2 h-4 w-4" />
          Add Shop
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">All Shops</h3>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Store className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <p className="text-muted-foreground font-medium">Shop management is not yet available.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Backend API endpoints for shop CRUD operations have not been implemented.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
