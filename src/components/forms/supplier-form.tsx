'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supplierSchema, type SupplierFormData } from '@/lib/schemas/supplier-schema';
import { SupplierType } from '@/lib/types/supplier';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Building2, User, Mail, Phone, MapPin, FileText, CreditCard, Banknote, Globe } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface SupplierFormProps {
  onSubmit: (data: SupplierFormData) => void | Promise<void>;
  defaultValues?: Partial<SupplierFormData>;
  isSubmitting?: boolean;
  isEdit?: boolean;
}

const COMMON_CATEGORIES = [
  'DETERGENT POWDER',
  'FABRIC SOFTENER',
  'BLEACH',
  'STARCH',
  'STAIN REMOVER',
  'DRY CLEANING CHEMICALS',
  'HANGERS',
  'GARMENT BAGS',
  'LAUNDRY BAGS',
  'PACKAGING MATERIALS',
  'MACHINERY PARTS',
  'MAINTENANCE EQUIPMENT',
];

export function SupplierForm({ onSubmit, defaultValues, isSubmitting, isEdit = false }: SupplierFormProps) {
  const [categoryInput, setCategoryInput] = useState('');
  
  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      companyName: '',
      contactPerson: '',
      email: '',
      phoneNumber: '',
      alternatePhone: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      gstin: '',
      panNumber: '',
      supplierType: undefined,
      categoriesSupplied: [],
      creditLimit: undefined,
      paymentTermsDays: 30,
      bankName: '',
      bankAccountNumber: '',
      bankIFSC: '',
      bankBranch: '',
      accountHolderName: '',
      website: '',
      notes: '',
      ...defaultValues,
    },
  });

  const categories = form.watch('categoriesSupplied') || [];

  const addCategory = (category: string) => {
    const trimmed = category.trim().toUpperCase();
    if (trimmed && !categories.includes(trimmed)) {
      form.setValue('categoriesSupplied', [...categories, trimmed]);
      setCategoryInput('');
    }
  };

  const removeCategory = (category: string) => {
    form.setValue(
      'categoriesSupplied',
      categories.filter((c) => c !== category)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-base">Company Information</CardTitle>
                <CardDescription>Basic details about the supplier company</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Bio Resco" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person*</FormLabel>
                    <FormControl>
                      <Input placeholder="Mr. Mohammad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplierType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier Type*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select supplier type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={SupplierType.MATERIAL}>Material</SelectItem>
                        <SelectItem value={SupplierType.EQUIPMENT}>Equipment</SelectItem>
                        <SelectItem value={SupplierType.CHEMICAL}>Chemical</SelectItem>
                        <SelectItem value={SupplierType.PACKAGING}>Packaging</SelectItem>
                        <SelectItem value={SupplierType.SERVICE}>Service</SelectItem>
                        <SelectItem value={SupplierType.MIXED}>Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="https://www.bioresco.in" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Categories */}
            <FormField
              control={form.control}
              name="categoriesSupplied"
              render={() => (
                <FormItem>
                  <FormLabel>Categories Supplied*</FormLabel>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter category or select from common categories"
                        value={categoryInput}
                        onChange={(e) => setCategoryInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addCategory(categoryInput);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addCategory(categoryInput)}
                        disabled={!categoryInput.trim()}
                      >
                        Add
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {COMMON_CATEGORIES.map((cat) => (
                        <Button
                          key={cat}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addCategory(cat)}
                          disabled={categories.includes(cat)}
                          className="text-xs"
                        >
                          {cat}
                        </Button>
                      ))}
                    </div>

                    {categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-muted/30">
                        {categories.map((category) => (
                          <Badge key={category} variant="secondary" className="gap-1">
                            {category}
                            <X
                              className="h-3 w-3 cursor-pointer hover:text-destructive"
                              onClick={() => removeCategory(category)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-base">Contact Information</CardTitle>
                <CardDescription>How to reach the supplier</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email*</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="bioresco@gmail.com" {...field} />
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

              <FormField
                control={form.control}
                name="alternatePhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternate Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+918765432190" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-base">Address Information</CardTitle>
                <CardDescription>Supplier's physical location</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address*</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Meta, Vadgam" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City*</FormLabel>
                    <FormControl>
                      <Input placeholder="Meta" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State*</FormLabel>
                    <FormControl>
                      <Input placeholder="Gujarat" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code*</FormLabel>
                    <FormControl>
                      <Input placeholder="385520" maxLength={6} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country*</FormLabel>
                    <FormControl>
                      <Input placeholder="India" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tax Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-base">Tax Information</CardTitle>
                <CardDescription>GST and PAN details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="gstin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GSTIN</FormLabel>
                    <FormControl>
                      <Input placeholder="24AIOSD90SDS12Z5" maxLength={15} {...field} />
                    </FormControl>
                    <FormDescription>15-character GST number</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="panNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PAN Number</FormLabel>
                    <FormControl>
                      <Input placeholder="ABCDE1234F" maxLength={10} {...field} />
                    </FormControl>
                    <FormDescription>10-character PAN</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Financial Terms */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-base">Financial Terms</CardTitle>
                <CardDescription>Credit and payment terms</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="creditLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credit Limit (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="100000"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentTermsDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Terms (Days)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="30"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 30)}
                      />
                    </FormControl>
                    <FormDescription>Number of days for payment</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Bank Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Banknote className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-base">Bank Information</CardTitle>
                <CardDescription>Banking details for payments</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name</FormLabel>
                    <FormControl>
                      <Input placeholder="HDFC Bank" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bankBranch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Rajosana" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bankAccountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
                      <Input placeholder="98798789798789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bankIFSC"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IFSC Code</FormLabel>
                    <FormControl>
                      <Input placeholder="HDFC0001234" maxLength={11} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountHolderName"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Account Holder Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Mr. Mohammad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional notes about the supplier..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Internal notes (max 1000 characters)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? 'Update Supplier' : 'Add Supplier')}
          </Button>
        </div>
      </form>
    </Form>
  );
}