'use client';

import { useRouter } from 'next/navigation';
import { ExpenseForm } from '@/components/expenses/expense-form';
import { useCreateExpense } from '@/lib/hooks/use-expenses';
import type { ExpenseFormValues } from '@/lib/validations/expense';

export default function NewExpensePage() {
  const router = useRouter();
  const createExpense = useCreateExpense();

  const handleSubmit = async (data: ExpenseFormValues) => {
    try {
      await createExpense.mutateAsync(data as any);
      router.push('/admin/expenses/list');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Expense</h1>
        <p className="text-muted-foreground mt-1">
          Add a new expense record to the system
        </p>
      </div>

      <ExpenseForm
        onSubmit={handleSubmit}
        isLoading={createExpense.isPending}
      />
    </div>
  );
}