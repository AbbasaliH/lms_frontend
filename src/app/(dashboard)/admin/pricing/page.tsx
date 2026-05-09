'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
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
import { useServices, useCreateService } from '@/lib/hooks/use-services';
import { ServiceCategory } from '@/lib/types/service';
import { toast } from 'sonner';

const categoryLabels: Record<string, string> = {
  [ServiceCategory.WASHING]: 'Washing',
  [ServiceCategory.DRY_CLEANING]: 'Dry Cleaning',
  [ServiceCategory.DRYING]: 'Drying',
  [ServiceCategory.IRONING_AND_PRESS]: 'Ironing',
  [ServiceCategory.FOLDING]: 'Folding',
  [ServiceCategory.STAIN_REMOVAL]: 'Stain Removal',
  [ServiceCategory.PREMIUM_CARE]: 'Premium Care',
  [ServiceCategory.OTHER]: 'Other',
};

export default function PricingPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data, isLoading } = useServices();
  const createService = useCreateService();

  const services = data?.data || [];

  const handleSubmit = async (formData: PricingItemFormData) => {
    try {
      // Map PricingItemFormData to CreateLaundryServiceRequest
      const categoryMap: Record<string, ServiceCategory> = {
        Basic: ServiceCategory.WASHING,
        Premium: ServiceCategory.PREMIUM_CARE,
        Express: ServiceCategory.DRY_CLEANING,
      };

      await createService.mutateAsync({
        name: formData.serviceType,
        description: formData.description,
        category: categoryMap[formData.category] || ServiceCategory.OTHER,
        basePrice: formData.basePrice,
        pricePerUnit: formData.seasonalPrice,
        unitType: formData.unit,
        isActive: true,
        taxRate: 0,
      });
      setIsDialogOpen(false);
    } catch (error) {
      // Error handled by mutation
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
            <PricingForm onSubmit={handleSubmit} isSubmitting={createService.isPending} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Service Pricing</h3>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pricing records found. Add your first service pricing above.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Base Price</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{categoryLabels[item.category] || item.category}</TableCell>
                    <TableCell>${item.basePrice.toFixed(2)}</TableCell>
                    <TableCell>{item.unitType || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={item.isActive ? 'default' : 'secondary'}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </Badge>
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