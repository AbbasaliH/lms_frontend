'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CustomerForm } from '@/components/forms/customer-form';
import { useCustomers, useCreateCustomer } from '@/lib/hooks/use-customers';
import { CustomerTier, CustomerStatus } from '@/lib/types/customer';

export default function CustomersPage() {
  const [filters, setFilters] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const { data, isLoading } = useCustomers(filters);
  const createMutation = useCreateCustomer();

  const customers = data?.data || [];

  const getTierVariant = (tier: CustomerTier) => {
    switch (tier) {
      case CustomerTier.VIP:
      case CustomerTier.PLATINUM:
        return 'default';
      case CustomerTier.GOLD:
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage customer relationships and loyalty</p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            {/* Customer Form Here */}
            <CustomerForm
              onSubmit={async (data) => {
                await createMutation.mutateAsync(data);
                setShowDialog(false);
              }}
              isSubmitting={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Total Spend</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer: any) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.customerCode}</TableCell>
                    <TableCell>{customer.fullName}</TableCell>
                    <TableCell>
                      <Badge variant={getTierVariant(customer.tier)}>
                        {customer.tier}
                      </Badge>
                    </TableCell>
                    <TableCell>₹{customer.totalSpent?.toLocaleString()}</TableCell>
                    <TableCell>{customer.totalOrders}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{customer.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

