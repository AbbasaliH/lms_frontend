'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { deliveryBoySchema, type DeliveryBoyFormData } from '@/lib/schemas/delivery-boy-schema';
import { VehicleType } from '@/lib/types/delivery-boy';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface DeliveryBoyFormProps {
  onSubmit: (data: DeliveryBoyFormData) => void | Promise<void>;
  defaultValues?: Partial<DeliveryBoyFormData>;
  isSubmitting?: boolean;
  isEdit?: boolean;
}

export function DeliveryBoyForm({ onSubmit, defaultValues, isSubmitting, isEdit = false }: DeliveryBoyFormProps) {
  const form = useForm<DeliveryBoyFormData>({
    resolver: zodResolver(deliveryBoySchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
      gender: undefined,
      villageName: '',
      streetName: '',
      vehicleType: undefined,
      vehicleNumber: '',
      licenseNumber: '',
      aadharNumber: '',
      emergencyContact: '',
      workingHoursStart: '',
      workingHoursEnd: '',
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Rajesh Kumar" {...field} />
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
                    <FormLabel>Email*</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="rajesh@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number*</FormLabel>
                    <FormControl>
                      <Input placeholder="+919876543210" {...field} />
                    </FormControl>
                    <FormDescription>Include country code</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isEdit && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password*</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormDescription>Min. 8 characters</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="villageName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Village/City</FormLabel>
                    <FormControl>
                      <Input placeholder="Rajajinagar" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="streetName"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="4th Block, 8th Main" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="vehicleType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Type*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select vehicle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={VehicleType.BICYCLE}>Bicycle</SelectItem>
                        <SelectItem value={VehicleType.BIKE}>Bike</SelectItem>
                        <SelectItem value={VehicleType.SCOOTER}>Scooter</SelectItem>
                        <SelectItem value={VehicleType.CAR}>Car</SelectItem>
                        <SelectItem value={VehicleType.VAN}>Van</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vehicleNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Number</FormLabel>
                    <FormControl>
                      <Input placeholder="KA01AB1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="licenseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Number</FormLabel>
                    <FormControl>
                      <Input placeholder="KA1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="aadharNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aadhar Number</FormLabel>
                    <FormControl>
                      <Input placeholder="123412341234" maxLength={12} {...field} />
                    </FormControl>
                    <FormDescription>12 digits</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Emergency Contact & Working Hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="emergencyContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+919876543211" {...field} />
                    </FormControl>
                    <FormDescription>Include country code</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="workingHoursStart"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Working Hours Start</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workingHoursEnd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Working Hours End</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? 'Update Delivery Boy' : 'Add Delivery Boy')}
          </Button>
        </div>
      </form>
    </Form>
  );
}