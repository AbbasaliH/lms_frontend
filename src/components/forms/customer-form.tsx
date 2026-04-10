'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerSchema } from '@/lib/schemas/customer-schema';
type CustomerFormData = z.infer<typeof customerSchema>;

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomerTier, CustomerStatus } from '@/lib/types/customer';
import { Loader2 } from 'lucide-react';

type CustomerFormData = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  onSubmit: (data: CustomerFormData) => Promise<void>;
  defaultValues?: Partial<CustomerFormData>;
  isSubmitting: boolean;
  title?: string;
}

export function CustomerForm({ onSubmit, defaultValues, isSubmitting, title = 'Customer Details' }: CustomerFormProps) {
const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      tier: CustomerTier.REGULAR,
      status: CustomerStatus.ACTIVE,
      totalOrders: 0,
      totalSpent: 0,
      loyaltyPoints: 0,
      lifetimePoints: 0,
      creditLimit: 0,
      creditAllowed: false,
      isVerified: false,
      isBusinessCustomer: false,
      isBlacklisted: false,
      joiningDate: new Date(),
      ...defaultValues,
    },
  });


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+91..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="tier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tier</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tier" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={CustomerTier.REGULAR}>Regular</SelectItem>
                      <SelectItem value={CustomerTier.SILVER}>Silver</SelectItem>
                      <SelectItem value={CustomerTier.GOLD}>Gold</SelectItem>
                      <SelectItem value={CustomerTier.PLATINUM}>Platinum</SelectItem>
                      <SelectItem value={CustomerTier.VIP}>VIP</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={CustomerStatus.ACTIVE}>Active</SelectItem>
                      <SelectItem value={CustomerStatus.INACTIVE}>Inactive</SelectItem>
                      <SelectItem value={CustomerStatus.DORMANT}>Dormant</SelectItem>
                      <SelectItem value={CustomerStatus.SUSPENDED}>Suspended</SelectItem>
                      <SelectItem value={CustomerStatus.BLACKLISTED}>Blacklisted</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="preferredPickupTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Pickup</FormLabel>
                    <FormControl>
                      <Input placeholder="09:00 AM - 12:00 PM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferredPaymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <FormControl>
                      <Input placeholder="UPI / Cash" {...field} />
                    </FormControl>
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
                  <FormLabel>Special Instructions</FormLabel>
                  <FormControl>
                    <Input placeholder="Leave at gate if no answer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isSubmitting ? 'Saving...' : 'Save Customer'}
        </Button>
      </form>
    </Form>
  );
}

