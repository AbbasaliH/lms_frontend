'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockShops } from '@/lib/mock-data';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';

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
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Shop
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">All Shops</h3>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shop Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockShops.map((shop) => (
                <TableRow key={shop.id}>
                  <TableCell className="font-medium">{shop.name}</TableCell>
                  <TableCell>{shop.address}</TableCell>
                  <TableCell>{shop.phone}</TableCell>
                  <TableCell>
                    <Badge variant={shop.status === 'active' ? 'default' : 'secondary'}>
                      {shop.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={shop.subscriptionStatus === 'active' ? 'default' : 'secondary'}>
                      {shop.subscriptionStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>${shop.revenue.toLocaleString()}</TableCell>
                  <TableCell>{format(shop.createdAt, 'MMM dd, yyyy')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}