'use client';

import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SupplierForm } from '@/components/forms/supplier-form';
import { useSupplier, useUpdateSupplier } from '@/lib/hooks/use-suppliers';
import type { SupplierFormData } from '@/lib/schemas/supplier-schema';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Building2, AlertCircle } from 'lucide-react';

export default function EditSupplierPage() {
  const router = useRouter();
  const params = useParams();
  const supplierId = params.id as string;

  const { data, isLoading, error } = useSupplier(supplierId);
  const updateMutation = useUpdateSupplier();

  const supplier = data?.data;

  const handleSubmit = async (formData: SupplierFormData) => {
    try {
      await updateMutation.mutateAsync({
        id: supplierId,
        data: {
          companyName: formData.companyName,
          contactPerson: formData.contactPerson,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          alternatePhone: formData.alternatePhone || undefined,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          gstin: formData.gstin || undefined,
          panNumber: formData.panNumber || undefined,
          supplierType: formData.supplierType,
          categoriesSupplied: formData.categoriesSupplied,
          creditLimit: formData.creditLimit,
          paymentTermsDays: formData.paymentTermsDays,
          bankName: formData.bankName || undefined,
          bankAccountNumber: formData.bankAccountNumber || undefined,
          bankIFSC: formData.bankIFSC || undefined,
          bankBranch: formData.bankBranch || undefined,
          accountHolderName: formData.accountHolderName || undefined,
          website: formData.website || undefined,
          notes: formData.notes || undefined,
        },
      });
      router.push(`/admin/suppliers/${supplierId}`);
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  if (error || !supplier) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-medium mb-2">Failed to load supplier</h3>
        <p className="text-muted-foreground mb-4">
          {error?.message || 'Supplier not found'}
        </p>
        <Button onClick={() => router.push('/admin/suppliers')}>
          Back to Suppliers
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Building2 className="h-8 w-8 text-primary" />
                Edit Supplier
              </h1>
              <p className="text-muted-foreground mt-1">
                Update supplier: {supplier.companyName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <SupplierForm
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
        isEdit
        defaultValues={{
          companyName: supplier.companyName,
          contactPerson: supplier.contactPerson,
          email: supplier.email,
          phoneNumber: supplier.phoneNumber,
          alternatePhone: supplier.alternatePhone || '',
          address: supplier.address,
          city: supplier.city,
          state: supplier.state,
          postalCode: supplier.postalCode,
          country: supplier.country,
          gstin: supplier.gstin || '',
          panNumber: supplier.panNumber || '',
          supplierType: supplier.supplierType,
          categoriesSupplied: supplier.categoriesSupplied,
          creditLimit: supplier.creditLimit,
          paymentTermsDays: supplier.paymentTermsDays,
          bankName: supplier.bankName || '',
          bankAccountNumber: supplier.bankAccountNumber || '',
          bankIFSC: supplier.bankIFSC || '',
          bankBranch: supplier.bankBranch || '',
          accountHolderName: supplier.accountHolderName || '',
          website: supplier.website || '',
          notes: supplier.notes || '',
        }}
      />
    </div>
  );
}
