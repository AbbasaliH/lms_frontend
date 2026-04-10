'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function AdminsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admins</h2>
          <p className="text-muted-foreground">
            Manage admin users across all shops
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Admin
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Admin Users</h3>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Admin management coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}