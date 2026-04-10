'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SupplierForm } from '@/components/forms/supplier-form';
import { useCreateSupplier } from '@/lib/hooks/use-suppliers';
import type { SupplierFormData } from '@/lib/schemas/supplier-schema';
import { ArrowLeft, Building2 } from 'lucide-react';

export default function CreateSupplierPage() {
  const router = useRouter();
  const createMutation = useCreateSupplier();

  const handleSubmit = async (formData: SupplierFormData) => {
    try {
      await createMutation.mutateAsync({
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
      });
      router.push('/admin/suppliers');
    } catch (error) {
      // Error handled by mutation
    }
  };

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
                Add New Supplier
              </h1>
              <p className="text-muted-foreground mt-1">
                Register a new supplier to your system
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <SupplierForm
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
}