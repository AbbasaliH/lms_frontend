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
import { Loader2, Plus, Trash2, Calendar } from 'lucide-react';
import { mockDeliveryBoys } from '@/lib/mock-data';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useCustomers } from '@/lib/hooks/use-customers';

interface OrderFormProps {
  onSubmit: (data: OrderFormData) => void | Promise<void>;
  defaultValues?: Partial<OrderFormData>;
  isSubmitting?: boolean;
}

const serviceTypes = [
  { value: 'Wash & Fold', price: 10 },
  { value: 'Dry Cleaning', price: 20 },
  { value: 'Ironing', price: 3 },
  { value: 'Shoe Cleaning', price: 15 },
  { value: 'Curtain Cleaning', price: 25 },
];

export function OrderForm({ onSubmit, defaultValues, isSubmitting }: OrderFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();

  // Fetch customers from API
  const { data: customersData, isLoading: isLoadingCustomers } = useCustomers({
    limit: 100,
    status: 'ACTIVE',
  });

  const customers = (customersData as any)?.data?.customers || [];

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerId: '',
      items: [{ serviceType: '', quantity: 1, price: 0, notes: '' }],
      paymentMethod: undefined,
      assignedTo: '',
      specialInstructions: '',
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const calculateTotal = () => {
    const items = form.watch('items');
    return items.reduce((sum, item) => sum + (item.quantity * item.price || 0), 0);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingCustomers}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingCustomers ? "Loading customers..." : "Select customer"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {customers.map((customer: any) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.user.fullName}
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
            name="deliveryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <Calendar className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <input
                      type="date"
                      className="p-3 w-full"
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        field.onChange(date);
                        setSelectedDate(date);
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                    name={`items.${index}.serviceType`}
                    render={({ field }) => (
                      <FormItem className="sm:col-span-6">
                        <FormLabel className="text-sm font-medium">Service Type</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            const service = serviceTypes.find((s) => s.value === value);
                            if (service) {
                              form.setValue(`items.${index}.price`, service.price);
                            }
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Select service" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {serviceTypes.map((service) => (
                              <SelectItem key={service.value} value={service.value}>
                                {service.value} (₹{service.price})
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
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel className="text-sm font-medium">Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="1"
                            className="h-10"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`items.${index}.price`}
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel className="text-sm font-medium">Price (₹)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0"
                            className="h-10"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`items.${index}.notes`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between text-sm font-medium">
                        <span>Notes</span>
                        <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Special instructions for this item" 
                          className="h-10"
                          {...field} 
                        />
                      </FormControl>
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
                append({ serviceType: '', quantity: 1, price: 0, notes: '' })
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Another Item
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payment & Delivery Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="wallet">Wallet</SelectItem>
                        <SelectItem value="online">Online Payment</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      <span className="truncate mr-2">Assign to Delivery Personnel</span>
                      <span className="text-xs text-muted-foreground font-normal shrink-0">(Optional)</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select delivery personnel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {mockDeliveryBoys.map((db) => (
                          <SelectItem key={db.id} value={db.id}>
                            {db.name} - {db.vehicleType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">
                      Leave unassigned to assign later
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                    Add any specific requirements or notes for this order
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

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