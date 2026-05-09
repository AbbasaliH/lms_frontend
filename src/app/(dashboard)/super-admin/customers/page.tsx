'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useCustomers, useDeleteCustomer } from '@/lib/hooks/use-customers';
import { AddCustomerDialog } from '@/components/customers/add-customer-dialog';
import { Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function SuperAdminCustomersPage() {
  const { data, isLoading, isError } = useCustomers();
  const deleteMutation = useDeleteCustomer();

  const customers = (data as any)?.data?.customers || [];

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      deleteMutation.mutate(id, {
        onError: (error: Error) => {
          toast.error(error.message || 'Failed to delete customer');
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Failed to load customers.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">
            Platform-wide customer analytics and management
          </p>
        </div>
        <AddCustomerDialog />
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">All Customers</h3>
        </CardHeader>
        <CardContent>
          {customers.length === 0 ? (
            <p className="text-muted-foreground">No customers found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Total Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer: any) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      {customer.user?.fullName || customer.name || 'N/A'}
                    </TableCell>
                    <TableCell>{customer.user?.email || customer.email || 'N/A'}</TableCell>
                    <TableCell>{customer.totalOrders ?? 0}</TableCell>
                    <TableCell>${(customer.totalSpent ?? 0).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={customer.status === 'ACTIVE' || customer.status === 'active' ? 'default' : 'destructive'}>
                        {customer.status || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(customer.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
