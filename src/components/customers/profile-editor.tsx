'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useUpdateCustomer } from '@/lib/hooks/use-customers';
import { Loader2, Save } from 'lucide-react';
import type { Customer } from '@/lib/types/customer';

interface ProfileEditorProps {
  customer: Customer;
}

export function ProfileEditor({ customer }: ProfileEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const mutation = useUpdateCustomer();

  const form = useForm({
    defaultValues: {
      preferredPickupTime: customer.preferredPickupTime || '',
      preferredDeliveryTime: customer.preferredDeliveryTime || '',
      specialInstructions: customer.specialInstructions || '',
      preferredPaymentMethod: customer.preferredPaymentMethod || '',
      companyName: customer.companyName || '',
      gstin: customer.gstin || '',
      businessType: customer.businessType || '',
    },
  });

  const onSubmit = (data: any) => {
    mutation.mutate(
      { id: customer.id, data },
      {
        onSuccess: () => setIsEditing(false),
      }
    );
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Preferences</h3>
        <Button 
          type="button" 
          variant={isEditing ? 'outline' : 'default'} 
          onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Preferred Pickup Time</Label>
          <Input 
            {...form.register('preferredPickupTime')} 
            disabled={!isEditing} 
            placeholder="e.g. 09:00 AM - 11:00 AM" 
          />
        </div>
        <div className="space-y-2">
          <Label>Preferred Delivery Time</Label>
          <Input 
            {...form.register('preferredDeliveryTime')} 
            disabled={!isEditing} 
            placeholder="e.g. 05:00 PM - 07:00 PM" 
          />
        </div>
        <div className="space-y-2">
          <Label>Preferred Payment Method</Label>
          <Input 
            {...form.register('preferredPaymentMethod')} 
            disabled={!isEditing} 
            placeholder="e.g. Cash, Card, UPI" 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Special Instructions</Label>
        <Textarea 
          {...form.register('specialInstructions')} 
          disabled={!isEditing} 
          placeholder="Any special handling or delivery instructions..." 
        />
      </div>

      {customer.isBusinessCustomer && (
        <>
          <h3 className="text-lg font-semibold pt-4 border-t">Business Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input {...form.register('companyName')} disabled={!isEditing} />
            </div>
            <div className="space-y-2">
              <Label>GSTIN</Label>
              <Input {...form.register('gstin')} disabled={!isEditing} />
            </div>
            <div className="space-y-2">
              <Label>Business Type</Label>
              <Input {...form.register('businessType')} disabled={!isEditing} />
            </div>
          </div>
        </>
      )}

      {isEditing && (
        <div className="flex justify-end pt-4 border-t">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      )}
    </form>
  );
}
