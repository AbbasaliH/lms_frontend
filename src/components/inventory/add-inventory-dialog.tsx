'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { addInventorySchema, type AddInventoryFormData } from '@/lib/schemas/inventory-schema';
import { inventoryApi } from '@/lib/api/inventory';

const CATEGORIES = [
  'DETERGENT',
  'SOFTENER',
  'BLEACH',
  'STAIN_REMOVER',
  'PACKAGING',
  'EQUIPMENT',
  'MISCELLANEOUS',
];

const UNITS = [
  'kg',
  'liters',
  'pieces',
  'boxes',
  'bottles',
  'packets',
];

export function AddInventoryDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<AddInventoryFormData>({
    resolver: zodResolver(addInventorySchema),
    defaultValues: {
      itemName: '',
      description: '',
      category: '',
      quantity: 0,
      unit: '',
      minimumStock: 10,
      reorderLevel: 20,
      costPerUnit: 0,
      supplierName: '',
      supplierContact: '',
      location: '',
      notes: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = form;

  const mutation = useMutation({
    mutationFn: inventoryApi.addInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Success', {
        description: 'Inventory item added successfully',
      });
      setOpen(false);
      reset();
    },
    onError: (error: Error) => {
      toast.error('Error', {
        description: error.message || 'Failed to add inventory item',
      });
    },
  });

  const onSubmit = (data: AddInventoryFormData) => {
    mutation.mutate(data);
  };

  const category = watch('category');
  const unit = watch('unit');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Inventory Item</DialogTitle>
          <DialogDescription>
            Add a new item to your inventory. Fill in all required fields.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Item Name */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="itemName">
                Item Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="itemName"
                placeholder="e.g., Detergent Powder"
                {...register('itemName')}
                aria-invalid={!!errors.itemName}
              />
              {errors.itemName && (
                <p className="text-sm text-destructive">{errors.itemName.message}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select value={category} onValueChange={(value) => setValue('category', value)}>
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>

            {/* Unit */}
            <div className="space-y-2">
              <Label htmlFor="unit">
                Unit <span className="text-destructive">*</span>
              </Label>
              <Select value={unit} onValueChange={(value) => setValue('unit', value)}>
                <SelectTrigger id="unit" className="w-full">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.unit && (
                <p className="text-sm text-destructive">{errors.unit.message}</p>
              )}
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity">
                Current Quantity <span className="text-destructive">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                {...register('quantity', { valueAsNumber: true })}
                aria-invalid={!!errors.quantity}
              />
              {errors.quantity && (
                <p className="text-sm text-destructive">{errors.quantity.message}</p>
              )}
            </div>

            {/* Cost Per Unit */}
            <div className="space-y-2">
              <Label htmlFor="costPerUnit">
                Cost Per Unit <span className="text-destructive">*</span>
              </Label>
              <Input
                id="costPerUnit"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                {...register('costPerUnit', { valueAsNumber: true })}
                aria-invalid={!!errors.costPerUnit}
              />
              {errors.costPerUnit && (
                <p className="text-sm text-destructive">{errors.costPerUnit.message}</p>
              )}
            </div>

            {/* Minimum Stock */}
            <div className="space-y-2">
              <Label htmlFor="minimumStock">
                Minimum Stock <span className="text-destructive">*</span>
              </Label>
              <Input
                id="minimumStock"
                type="number"
                min="0"
                placeholder="10"
                {...register('minimumStock', { valueAsNumber: true })}
                aria-invalid={!!errors.minimumStock}
              />
              {errors.minimumStock && (
                <p className="text-sm text-destructive">{errors.minimumStock.message}</p>
              )}
            </div>

            {/* Reorder Level */}
            <div className="space-y-2">
              <Label htmlFor="reorderLevel">
                Reorder Level <span className="text-destructive">*</span>
              </Label>
              <Input
                id="reorderLevel"
                type="number"
                min="0"
                placeholder="20"
                {...register('reorderLevel', { valueAsNumber: true })}
                aria-invalid={!!errors.reorderLevel}
              />
              {errors.reorderLevel && (
                <p className="text-sm text-destructive">{errors.reorderLevel.message}</p>
              )}
            </div>

            {/* Supplier Name */}
            <div className="space-y-2">
              <Label htmlFor="supplierName">
                Supplier Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="supplierName"
                placeholder="e.g., Mr. Mohammad"
                {...register('supplierName')}
                aria-invalid={!!errors.supplierName}
              />
              {errors.supplierName && (
                <p className="text-sm text-destructive">{errors.supplierName.message}</p>
              )}
            </div>

            {/* Supplier Contact */}
            <div className="space-y-2">
              <Label htmlFor="supplierContact">
                Supplier Contact <span className="text-destructive">*</span>
              </Label>
              <Input
                id="supplierContact"
                placeholder="e.g., 5678904321"
                {...register('supplierContact')}
                aria-invalid={!!errors.supplierContact}
              />
              {errors.supplierContact && (
                <p className="text-sm text-destructive">{errors.supplierContact.message}</p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Warehouse A, Shelf 3"
                {...register('location')}
              />
            </div>

            {/* Description */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Additional details about the item..."
                rows={2}
                {...register('description')}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any special notes or instructions..."
                rows={2}
                {...register('notes')}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Item
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}