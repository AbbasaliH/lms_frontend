'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Loader2, Edit, AlignLeft, DollarSign, Clock, Hash } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { serviceSchema, type ServiceFormData } from '@/lib/schemas/service-schema';
import { useCreateService, useUpdateService } from '@/lib/hooks/use-services';
import { ServiceCategory, type LaundryService } from '@/lib/types/service';

interface ServiceDialogProps {
  service?: LaundryService;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ServiceDialog({ service, trigger, open: controlledOpen, onOpenChange }: ServiceDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isEditing = !!service;
  
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setOpen = onOpenChange || setUncontrolledOpen;

  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      description: '',
      category: ServiceCategory.WASHING,
      basePrice: 0,
      pricePerUnit: 0,
      unitType: '',
      isActive: true,
      durationHours: 24,
      iconUrl: '',
      taxRate: 0,
    },
  });

  useEffect(() => {
    if (service && open) {
      form.reset({
        name: service.name,
        description: service.description || '',
        category: service.category,
        basePrice: service.basePrice,
        pricePerUnit: service.pricePerUnit || 0,
        unitType: service.unitType || '',
        isActive: service.isActive,
        durationHours: service.durationHours || 24,
        iconUrl: service.iconUrl || '',
        taxRate: service.taxRate || 0,
      });
    } else if (!open && !service) {
      form.reset();
    }
  }, [service, open, form]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const onSubmit = (data: ServiceFormData) => {
    const cleanedData = {
      ...data,
      description: data.description || undefined,
      pricePerUnit: data.pricePerUnit || undefined,
      unitType: data.unitType || undefined,
      durationHours: data.durationHours || undefined,
      iconUrl: data.iconUrl || undefined,
    };

    if (isEditing) {
      updateMutation.mutate(
        { id: service.id, data: cleanedData },
        {
          onSuccess: () => setOpen(false),
        }
      );
    } else {
      createMutation.mutate(cleanedData as any, {
        onSuccess: () => setOpen(false),
      });
    }
  };

  const category = watch('category');
  const isActive = watch('isActive');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      {!trigger && !controlledOpen && (
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Service' : 'Add New Service'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the details of the existing service.'
              : 'Create a new laundry service and set its pricing.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">
                  Service Name <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <AlignLeft className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="e.g., Standard Wash & Fold"
                    className="pl-10"
                    {...register('name')}
                  />
                </div>
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select value={category} onValueChange={(value) => setValue('category', value as ServiceCategory)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ServiceCategory).map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="basePrice">
                  Base Price <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="basePrice"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-10"
                    {...register('basePrice', { valueAsNumber: true })}
                  />
                </div>
                {errors.basePrice && <p className="text-sm text-destructive">{errors.basePrice.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricePerUnit">Price Per Unit</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="pricePerUnit"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-10"
                    {...register('pricePerUnit', { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitType">Unit Type</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="unitType"
                    placeholder="e.g., kg, piece"
                    className="pl-10"
                    {...register('unitType')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="durationHours">Duration (Hours)</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="durationHours"
                    type="number"
                    min="1"
                    placeholder="24"
                    className="pl-10"
                    {...register('durationHours', { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the service..."
                  rows={3}
                  {...register('description')}
                />
              </div>

              <div className="flex items-center justify-between space-x-2 sm:col-span-2 pt-4 border-t">
                <div className="space-y-0.5">
                  <Label htmlFor="isActive">Active Status</Label>
                  <p className="text-sm text-muted-foreground">
                    Inactive services won't be shown to customers.
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={(checked) => setValue('isActive', checked)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  {isEditing ? <Edit className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                  {isEditing ? 'Update Service' : 'Create Service'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
