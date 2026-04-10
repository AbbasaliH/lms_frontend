'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockPricingItems } from '@/lib/mock-data';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PricingForm } from '@/components/forms/pricing-form';
import type { PricingItemFormData } from '@/lib/schemas/pricing-schema';
import { toast } from 'sonner';

export default function PricingPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: PricingItemFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Form data:', data);
      toast.success('Pricing added successfully!');
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Failed to add pricing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pricing</h2>
          <p className="text-muted-foreground">
            Manage service pricing and rates
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Pricing
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Service Pricing</DialogTitle>
              <DialogDescription>
                Configure pricing for a new service. Set base price and optional seasonal rates.
              </DialogDescription>
            </DialogHeader>
            <PricingForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Service Pricing</h3>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Base Price</TableHead>
                <TableHead>Min. Quantity</TableHead>
                <TableHead>Seasonal Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPricingItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.serviceType}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>${item.basePrice}</TableCell>
                  <TableCell>{item.minQuantity || '-'}</TableCell>
                  <TableCell>{item.seasonalPrice ? `$${item.seasonalPrice}` : '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}