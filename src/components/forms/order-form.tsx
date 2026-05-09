'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { orderSchema, type OrderFormData } from '@/lib/schemas/order-schema';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useCustomers } from '@/lib/hooks/use-customers';
import { useProducts } from '@/lib/hooks/use-products';

interface OrderFormProps {
  onSubmit: (data: OrderFormData) => void | Promise<void>;
  defaultValues?: Partial<OrderFormData>;
  isSubmitting?: boolean;
}

export function OrderForm({ onSubmit, defaultValues, isSubmitting }: OrderFormProps) {
  // Fetch customers from API
  const { data: customersData, isLoading: isLoadingCustomers } = useCustomers({
    limit: 100,
    status: 'ACTIVE',
  });

  const customers = (customersData as any)?.data?.customers || [];

  // Fetch active products from API
  const { data: productsData, isLoading: isLoadingProducts } = useProducts({
    isActive: true,
    limit: 100,
  });

  const products = (productsData as any)?.data || [];

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      userId: '',
      productId: '',
      addressId: '',
      items: [{ productId: '', clothType: '', quantity: 1, unitPrice: 0, addOns: [] }],
      totalAmount: 0,
      specialInstructions: '',
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const selectedProductId = form.watch('productId');
  const selectedProduct = products.find((p: any) => p.id === selectedProductId);

  const calculateTotal = () => {
    const items = form.watch('items');
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice || 0), 0);
  };

  // Auto-update totalAmount when items change
  const handleItemChange = () => {
    const total = calculateTotal();
    form.setValue('totalAmount', total);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Customer & Product */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingCustomers}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingCustomers ? 'Loading customers...' : 'Select customer'} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {customers.map((customer: any) => (
                      <SelectItem key={customer.id} value={customer.userId || customer.id}>
                        {customer.user?.fullName || customer.fullName || 'Unknown'}
                      </SelectItem>
                    ))}
                    {customers.length === 0 && !isLoadingCustomers && (
                      <SelectItem value="no-customers" disabled>
                        No active customers found
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="productId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product / Service</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingProducts}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingProducts ? 'Loading products...' : 'Select product'} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {products.map((product: any) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} — ₹{product.price}
                      </SelectItem>
                    ))}
                    {products.length === 0 && !isLoadingProducts && (
                      <SelectItem value="no-products" disabled>
                        No active products found
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormDescription className="text-xs">
                  {selectedProduct?.description || 'Select a service/product for this order'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="addressId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter address ID (optional)" {...field} />
              </FormControl>
              <FormDescription className="text-xs">Optional delivery address reference</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Order Items */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Order Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-4 p-5 rounded-lg border bg-card">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">Item {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="h-8 px-2 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-12">
                  <FormField
                    control={form.control}
                    name={`items.${index}.productId`}
                    render={({ field }) => (
                      <FormItem className="sm:col-span-4">
                        <FormLabel className="text-sm font-medium">Product</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            const product = products.find((p: any) => p.id === value);
                            if (product) {
                              form.setValue(`items.${index}.unitPrice`, product.price);
                              handleItemChange();
                            }
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {products.map((product: any) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`items.${index}.clothType`}
                    render={({ field }) => (
                      <FormItem className="sm:col-span-4">
                        <FormLabel className="text-sm font-medium">Cloth Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Select cloth type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {(selectedProduct?.clothTypes || []).length > 0 ? (
                              selectedProduct.clothTypes.map((type: string) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))
                            ) : (
                              ['Shirt', 'Pant', 'T-Shirt', 'Suit', 'Dress', 'Saree', 'Curtain', 'Bed Sheet', 'Blanket', 'Jacket', 'Other'].map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel className="text-sm font-medium">Qty</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="1"
                            className="h-10"
                            {...field}
                            onChange={(e) => {
                              field.onChange(parseFloat(e.target.value) || 1);
                              handleItemChange();
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`items.${index}.unitPrice`}
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel className="text-sm font-medium">Price (₹)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0"
                            className="h-10"
                            {...field}
                            onChange={(e) => {
                              field.onChange(parseFloat(e.target.value) || 0);
                              handleItemChange();
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`items.${index}.addOns`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Add-ons</FormLabel>
                      <div className="flex flex-wrap gap-2">
                        {(selectedProduct?.addOns || []).length > 0 ? (
                          selectedProduct.addOns.map((addon: string) => (
                            <Button
                              key={addon}
                              type="button"
                              variant={field.value?.includes(addon) ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => {
                                const current = field.value || [];
                                const updated = current.includes(addon)
                                  ? current.filter((a: string) => a !== addon)
                                  : [...current, addon];
                                field.onChange(updated);
                              }}
                            >
                              {addon}
                            </Button>
                          ))
                        ) : (
                          ['Starch', 'Softener', 'Anti-Bacterial', 'Express Delivery', 'Premium Packaging'].map((addon) => (
                            <Button
                              key={addon}
                              type="button"
                              variant={field.value?.includes(addon) ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => {
                                const current = field.value || [];
                                const updated = current.includes(addon)
                                  ? current.filter((a: string) => a !== addon)
                                  : [...current, addon];
                                field.onChange(updated);
                              }}
                            >
                              {addon}
                            </Button>
                          ))
                        )}
                      </div>
                      <FormDescription className="text-xs">Click to toggle add-ons</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              className="w-full h-10 border-dashed"
              onClick={() =>
                append({ productId: '', clothType: '', quantity: 1, unitPrice: 0, addOns: [] })
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Another Item
            </Button>
          </CardContent>
        </Card>

        {/* Special Instructions */}
        <FormField
          control={form.control}
          name="specialInstructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center justify-between">
                <span>Special Instructions</span>
                <span className="text-xs text-muted-foreground font-normal shrink-0">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any special instructions for this order"
                  className="resize-none min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-xs">
                e.g. Deliver before 6pm, Handle with care, etc.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Total */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
          <span className="text-base font-semibold">Total Amount:</span>
          <span className="text-2xl font-bold">₹{calculateTotal().toFixed(2)}</span>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Creating Order...' : 'Create Order'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
