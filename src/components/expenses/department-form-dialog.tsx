'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useCreateDepartment, useUpdateDepartment } from '@/lib/hooks/use-expenses';
import type { Department } from '@/lib/types/expense';

const departmentFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  description: z.string().optional(),
  headName: z.string().optional(),
  headEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  headPhone: z
    .string()
    .regex(/^[0-9]{10}$/, 'Phone must be 10 digits')
    .optional()
    .or(z.literal('')),
  isActive: z.boolean(),
});

type DepartmentFormValues = z.infer<typeof departmentFormSchema>;

interface DepartmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department?: Department | null;
}

export function DepartmentFormDialog({
  open,
  onOpenChange,
  department,
}: DepartmentFormDialogProps) {
  const isEditing = !!department;
  const createDepartment = useCreateDepartment();
  const updateDepartment = useUpdateDepartment();

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      name: '',
      description: '',
      headName: '',
      headEmail: '',
      headPhone: '',
      isActive: true,
    },
  });

  // Reset form when dialog opens/closes or department changes
  useEffect(() => {
    if (open && department) {
      form.reset({
        name: department.name,
        description: department.description || '',
        headName: department.headName || '',
        headEmail: department.headEmail || '',
        headPhone: department.headPhone || '',
        isActive: department.isActive,
      });
    } else if (open && !department) {
      form.reset({
        name: '',
        description: '',
        headName: '',
        headEmail: '',
        headPhone: '',
        isActive: true,
      });
    }
  }, [open, department, form]);

  const onSubmit = async (data: DepartmentFormValues) => {
    try {
      if (isEditing) {
        await updateDepartment.mutateAsync({
          id: department.id,
          data,
        });
      } else {
        await createDepartment.mutateAsync(data);
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Error saving department:', error);
    }
  };

  const isLoading = createDepartment.isPending || updateDepartment.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Department' : 'Create Department'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the department information below.'
              : 'Fill in the details to create a new department.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Department Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Operations, Finance" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the department's responsibilities..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Optional department description</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Department Head Details */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-medium">Department Head Information</h3>

              <FormField
                control={form.control}
                name="headName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Head Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="headEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Head Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="headPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Head Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="9876543210" maxLength={10} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Status */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>
                      Inactive departments will be hidden from selection lists
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (isEditing ? 'Updating...' : 'Creating...') : isEditing ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
