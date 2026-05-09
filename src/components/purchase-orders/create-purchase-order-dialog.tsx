'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Trash2, Loader2 } from 'lucide-react';

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
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useSuppliers, useCreatePurchaseOrder } from '@/lib/hooks/use-suppliers';
import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '@/lib/api/inventory';
import type { CreatePurchaseOrderRequest, PurchaseOrderItem } from '@/lib/types/supplier';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface CreatePurchaseOrderDialogProps {
  children?: React.ReactNode;
}

interface OrderItem extends PurchaseOrderItem {
  id: string;
}

export function CreatePurchaseOrderDialog({ children }: CreatePurchaseOrderDialogProps) {
  const [open, setOpen] = useState(false);
  const [expectedDelivery, setExpectedDelivery] = useState<Date>();
  const [items, setItems] = useState<OrderItem[]>([]);
  const [taxPercent, setTaxPercent] = useState(0);
  const [discount, setDiscount] = useState(0);

  const { data: suppliersData, isLoading: loadingSuppliers } = useSuppliers({ limit: 100 });
  const { data: inventoryData, isLoading: loadingInventory } = useQuery({
    queryKey: ['inventory-all'],
    queryFn: () => inventoryApi.getInventory(1, 1000),
  });

  const createMutation = useCreatePurchaseOrder();

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<{
    supplierId: string;
    deliveryAddress: string;
    paymentTerms: string;
    notes: string;
  }>({
    defaultValues: {
      supplierId: '',
      deliveryAddress: '',
      paymentTerms: '',
      notes: '',
    },
  });

  const supplierId = watch('supplierId');

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = (subtotal * taxPercent) / 100;
  const grandTotal = subtotal + taxAmount - discount;

  const addItem = () => {
    const newItem: OrderItem = {
      id: `temp-${Date.now()}`,
      inventoryId: '',
      itemName: '',
      quantity: 0,
      unitPrice: 0,
      total: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof OrderItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          
          // Auto-fill item name when inventory is selected
          if (field === 'inventoryId' && value) {
            const selectedInventory = inventoryData?.data.items.find(
              (inv) => inv.id === value
            );
            if (selectedInventory) {
              updated.itemName = selectedInventory.itemName;
              updated.unitPrice = selectedInventory.costPerUnit;
            }
          }
          
          // Auto-calculate total
          if (field === 'quantity' || field === 'unitPrice') {
            updated.total = updated.quantity * updated.unitPrice;
          }
          
          return updated;
        }
        return item;
      })
    );
  };

  const onSubmit = async (data: any) => {
    if (!data.supplierId) {
      toast.error('Please select a supplier');
      return;
    }

    if (items.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    if (!expectedDelivery) {
      toast.error('Please select expected delivery date');
      return;
    }

    const orderData: CreatePurchaseOrderRequest = {
      supplierId: data.supplierId,
      expectedDelivery: format(expectedDelivery, 'yyyy-MM-dd'),
      items: items.map((item) => ({
        inventoryId: item.inventoryId,
        itemName: item.itemName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
      })),
      totalAmount: subtotal,
      taxAmount: taxAmount,
      discount: discount,
      deliveryAddress: data.deliveryAddress,
      paymentTerms: data.paymentTerms,
      notes: data.notes,
    };

    try {
      await createMutation.mutateAsync(orderData);
      setOpen(false);
      reset();
      setItems([]);
      setExpectedDelivery(undefined);
      setTaxPercent(0);
      setDiscount(0);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
      setItems([]);
      setExpectedDelivery(undefined);
      setTaxPercent(0);
      setDiscount(0);
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="h-4 w-4" />
            New Order
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Purchase Order</DialogTitle>
          <DialogDescription>
            Create a new purchase order for inventory items from a supplier
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Supplier & Delivery Info */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="supplierId">
                Supplier <span className="text-destructive">*</span>
              </Label>
              <Select
                value={supplierId || ''}
                onValueChange={(value) => {
                  setValue('supplierId', value, { shouldValidate: true });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {loadingSuppliers ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : suppliersData?.data?.suppliers && suppliersData.data.suppliers.length > 0 ? (
                    suppliersData.data.suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.companyName}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
                      No suppliers found
                    </div>
                  )}
                </SelectContent>
              </Select>
              {errors.supplierId && (
                <p className="text-xs text-destructive">Supplier is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedDelivery">
                Expected Delivery <span className="text-destructive">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !expectedDelivery && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expectedDelivery ? (
                      format(expectedDelivery, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={expectedDelivery}
                    onSelect={setExpectedDelivery}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryAddress">
              Delivery Address <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="deliveryAddress"
              {...register('deliveryAddress', { required: true })}
              placeholder="Enter delivery address"
              rows={2}
            />
            {errors.deliveryAddress && (
              <p className="text-xs text-destructive">Delivery address is required</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentTerms">Payment Terms</Label>
            <Input
              id="paymentTerms"
              {...register('paymentTerms')}
              placeholder="e.g., Net 30 days"
            />
          </div>

          <Separator />

          {/* Items Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Order Items</Label>
              <Button type="button" onClick={addItem} size="sm">
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </div>

            {items.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-8">
                  <p className="text-sm text-muted-foreground">
                    No items added. Click "Add Item" to start.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                        <div className="md:col-span-4">
                          <Label className="text-xs">Inventory Item</Label>
                          <Select
                            value={item.inventoryId}
                            onValueChange={(value) =>
                              updateItem(item.id, 'inventoryId', value)
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select item" />
                            </SelectTrigger>
                            <SelectContent>
                              {loadingInventory ? (
                                <div className="flex items-center justify-center py-4">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                              ) : (
                                inventoryData?.data.items.map((inv) => (
                                  <SelectItem key={inv.id} value={inv.id}>
                                    {inv.itemName} ({inv.unit})
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="md:col-span-2">
                          <Label className="text-xs">Quantity</Label>
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            value={item.quantity || ''}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                'quantity',
                                parseFloat(e.target.value) || 0
                              )
                            }
                            placeholder="0"
                            className="mt-1"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <Label className="text-xs">Unit Price (₹)</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice || ''}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                'unitPrice',
                                parseFloat(e.target.value) || 0
                              )
                            }
                            placeholder="0.00"
                            className="mt-1"
                          />
                        </div>

                        <div className="md:col-span-3">
                          <Label className="text-xs">Total (₹)</Label>
                          <Input
                            type="text"
                            value={item.total.toFixed(2)}
                            disabled
                            className="mt-1 bg-muted"
                          />
                        </div>

                        <div className="flex items-end md:col-span-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Totals Section */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Order Summary</Label>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="taxPercent">Tax (%)</Label>
                <Input
                  id="taxPercent"
                  type="number"
                  min="0"
                  step="0.01"
                  value={taxPercent || ''}
                  onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount">Discount (₹)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={discount || ''}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax ({taxPercent}%):</span>
                    <span className="font-medium">₹{taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Discount:</span>
                    <span className="font-medium text-destructive">
                      -₹{discount.toFixed(2)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base font-bold">
                    <span>Grand Total:</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Any additional notes or instructions"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
