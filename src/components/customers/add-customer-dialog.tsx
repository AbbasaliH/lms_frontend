'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Loader2, User, Mail, Phone, MapPin, Lock } from 'lucide-react';

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
import { addCustomerSchema, type AddCustomerFormData } from '@/lib/schemas/customer-schema';
import { CustomerTier } from '@/lib/types/customer';
import { useCreateCustomer } from '@/lib/hooks/use-customers';
import { authApi } from '@/lib/api/auth';
import { toast } from 'sonner';

const TIERS = ['REGULAR', 'SILVER', 'GOLD', 'PLATINUM'];
const GENDERS = ['MALE', 'FEMALE', 'OTHER'];
const ACQUISITION_SOURCES = ['WEBSITE', 'MOBILE_APP', 'WALK_IN', 'REFERRAL', 'SOCIAL_MEDIA', 'OTHER'];

export function AddCustomerDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mutation = useCreateCustomer();

  const form = useForm<AddCustomerFormData>({
    resolver: zodResolver(addCustomerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
      gender: 'MALE',
      villageName: '',
      streetName: '',
      tier: CustomerTier.REGULAR,
      specialInstructions: '',
      acquisitionSource: undefined,
      creditLimit: 0,
      creditAllowed: false,
      isBusinessCustomer: false,
      companyName: '',
      gstin: '',
      businessType: '',
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

  const onSubmit = async (data: AddCustomerFormData) => {
    setIsSubmitting(true);
    try {
      // Step 1: Create user account silently (no auto-login side effects)
      const signupResult = await authApi.signupSilently({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
        gender: data.gender,
        villageName: data.villageName || undefined,
        streetName: data.streetName || undefined,
      });

      if (!signupResult.success) {
        toast.error(signupResult.message || 'Failed to create user account');
        setIsSubmitting(false);
        return;
      }

      // Support both backend response shapes: { data: { id } } or { data: { user: { id } } }
      const userId = signupResult.data.id || signupResult.data.user?.id;

      if (!userId) {
        toast.error('User created but no user ID returned from server');
        setIsSubmitting(false);
        return;
      }

      // Step 2: Create customer profile linked to the new user
      const customerData = {
        userId,
        tier: data.tier,
        specialInstructions: data.specialInstructions || undefined,
        acquisitionSource: data.acquisitionSource || undefined,
        creditLimit: data.creditLimit,
        creditAllowed: data.creditAllowed,
        isBusinessCustomer: data.isBusinessCustomer,
        companyName: data.companyName || undefined,
        gstin: data.gstin || undefined,
        businessType: data.businessType || undefined,
        notes: data.notes || undefined,
      };

      mutation.mutate(customerData, {
        onSuccess: () => {
          toast.success('Customer created successfully');
          setOpen(false);
          reset();
          setIsSubmitting(false);
        },
        onError: (error: any) => {
          toast.error(error.message || 'Failed to create customer profile');
          setIsSubmitting(false);
        },
      });
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred');
      setIsSubmitting(false);
    }
  };

  const gender = watch('gender');
  const tier = watch('tier');
  const acquisitionSource = watch('acquisitionSource');
  const isBusinessCustomer = watch('isBusinessCustomer');
  const creditAllowed = watch('creditAllowed');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogDescription>
            Create a new customer account with their basic information and preferences.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Full Name */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="fullName">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  placeholder="e.g., John Doe"
                  {...register('fullName')}
                  aria-invalid={!!errors.fullName}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g., john@example.com"
                    className="pl-10"
                    {...register('email')}
                    aria-invalid={!!errors.email}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="e.g., +1234567890"
                    className="pl-10"
                    {...register('phoneNumber')}
                    aria-invalid={!!errors.phoneNumber}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min. 6 characters"
                    className="pl-10"
                    {...register('password')}
                    aria-invalid={!!errors.password}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label htmlFor="gender">
                  Gender <span className="text-destructive">*</span>
                </Label>
                <Select value={gender} onValueChange={(value) => setValue('gender', value as any)}>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDERS.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g.charAt(0) + g.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-destructive">{errors.gender.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Address Information
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Street Name */}
              <div className="space-y-2">
                <Label htmlFor="streetName">Street Address</Label>
                <Input
                  id="streetName"
                  placeholder="e.g., 123 Main Street"
                  {...register('streetName')}
                />
              </div>

              {/* Village/City Name */}
              <div className="space-y-2">
                <Label htmlFor="villageName">Village/City</Label>
                <Input
                  id="villageName"
                  placeholder="e.g., Springfield"
                  {...register('villageName')}
                />
              </div>
            </div>
          </div>

          {/* Customer Profile */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Customer Profile</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Tier */}
              <div className="space-y-2">
                <Label htmlFor="tier">
                  Customer Tier <span className="text-destructive">*</span>
                </Label>
                <Select value={tier} onValueChange={(value) => setValue('tier', value as any)}>
                  <SelectTrigger id="tier">
                    <SelectValue placeholder="Select tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIERS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Acquisition Source */}
              <div className="space-y-2">
                <Label htmlFor="acquisitionSource">How did they find us?</Label>
                <Select value={acquisitionSource} onValueChange={(value) => setValue('acquisitionSource', value as any)}>
                  <SelectTrigger id="acquisitionSource">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACQUISITION_SOURCES.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source.replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Special Instructions */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="specialInstructions">Special Instructions</Label>
                <Textarea
                  id="specialInstructions"
                  placeholder="Any special handling or delivery instructions..."
                  rows={2}
                  {...register('specialInstructions')}
                />
              </div>
            </div>
          </div>

          {/* Credit Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Credit Settings</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Credit Allowed */}
              <div className="flex items-center justify-between space-x-2 sm:col-span-2">
                <div className="space-y-0.5">
                  <Label htmlFor="creditAllowed">Allow Credit</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable credit facility for this customer
                  </p>
                </div>
                <Switch
                  id="creditAllowed"
                  checked={creditAllowed}
                  onCheckedChange={(checked) => setValue('creditAllowed', checked)}
                />
              </div>

              {/* Credit Limit */}
              {creditAllowed && (
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="creditLimit">Credit Limit</Label>
                  <Input
                    id="creditLimit"
                    type="number"
                    min="0"
                    step="100"
                    placeholder="0"
                    {...register('creditLimit', { valueAsNumber: true })}
                  />
                  <p className="text-sm text-muted-foreground">
                    Maximum credit amount allowed for this customer
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Business Information */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Business Information</h3>
              <div className="flex items-center space-x-2">
                <Label htmlFor="isBusinessCustomer" className="text-sm font-normal">
                  Business Customer
                </Label>
                <Switch
                  id="isBusinessCustomer"
                  checked={isBusinessCustomer}
                  onCheckedChange={(checked) => setValue('isBusinessCustomer', checked)}
                />
              </div>
            </div>

            {isBusinessCustomer && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Company Name */}
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="e.g., ABC Corporation"
                    {...register('companyName')}
                  />
                </div>

                {/* Business Type */}
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Input
                    id="businessType"
                    placeholder="e.g., Retail, Hospitality"
                    {...register('businessType')}
                  />
                </div>

                {/* GSTIN */}
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="gstin">GSTIN</Label>
                  <Input
                    id="gstin"
                    placeholder="e.g., 22AAAAA0000A1Z5"
                    {...register('gstin')}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes about the customer..."
              rows={3}
              {...register('notes')}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                reset();
              }}
              disabled={isSubmitting || mutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || mutation.isPending}>
              {isSubmitting || mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Customer
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
