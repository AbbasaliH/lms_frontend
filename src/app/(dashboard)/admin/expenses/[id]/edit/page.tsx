'use client';

import { useRouter, useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { ExpenseForm } from '@/components/expenses/expense-form';
import { useExpense, useUpdateExpense } from '@/lib/hooks/use-expenses';
import type { ExpenseFormValues } from '@/lib/validations/expense';

export default function EditExpensePage() {
  const router = useRouter();
  const params = useParams();
  const expenseId = params.id as string;

  const { data, isLoading } = useExpense(expenseId);
  const updateExpense = useUpdateExpense();

  const expense = data?.data;

  const handleSubmit = async (formData: ExpenseFormValues) => {
    try {
      await updateExpense.mutateAsync({
        id: expenseId,
        data: formData as any,
      });
      router.push(`/admin/expenses/${expenseId}`);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-64 mt-2" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Expense not found</h2>
        <p className="text-muted-foreground mt-2">
          The expense you're looking for doesn't exist
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Expense</h1>
        <p className="text-muted-foreground mt-1">
          Update expense details: {expense.expenseNumber}
        </p>
      </div>

      <ExpenseForm
        expense={expense}
        onSubmit={handleSubmit}
        isLoading={updateExpense.isPending}
      />
    </div>
  );
}