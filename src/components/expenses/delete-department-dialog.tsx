'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteDepartment } from '@/lib/hooks/use-expenses';
import type { Department } from '@/lib/types/expense';

interface DeleteDepartmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
}

export function DeleteDepartmentDialog({
  open,
  onOpenChange,
  department,
}: DeleteDepartmentDialogProps) {
  const deleteDepartment = useDeleteDepartment();

  const handleDelete = async () => {
    if (!department) return;

    try {
      await deleteDepartment.mutateAsync(department.id);
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Department</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{department?.name}</strong>? This action
            cannot be undone.
            {(department?.totalExpenses ?? 0) > 0 && (
              <span className="block mt-2 text-destructive font-medium">
                Warning: This department has {department?.totalExpenses} associated expense(s).
              </span>
            )}
            {(department?.totalBudgets ?? 0) > 0 && (
              <span className="block mt-2 text-destructive font-medium">
                Warning: This department has {department?.totalBudgets} associated budget(s).
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteDepartment.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteDepartment.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteDepartment.isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
