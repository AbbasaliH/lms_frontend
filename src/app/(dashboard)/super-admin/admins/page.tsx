'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAdmins, useDeleteAdmin } from '@/lib/hooks/use-admin';
import { Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminsPage() {
  const { data, isLoading, isError } = useAdmins();
  const deleteMutation = useDeleteAdmin();

  const admins = (data as any)?.data?.admins || (data as any)?.data || [];

  const handleDelete = (adminId: string) => {
    if (confirm('Are you sure you want to delete this admin?')) {
      deleteMutation.mutate(adminId, {
        onError: (error: Error) => {
          toast.error(error.message || 'Failed to delete admin');
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Failed to load admins.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admins</h2>
          <p className="text-muted-foreground">
            Manage admin users across all shops
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Admin Users</h3>
        </CardHeader>
        <CardContent>
          {admins.length === 0 ? (
            <p className="text-muted-foreground">No admins found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin: any) => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">{admin.name || admin.fullName || 'N/A'}</TableCell>
                    <TableCell>{admin.email || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{admin.role || 'ADMIN'}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={admin.status === 'active' || admin.status === 'APPROVED' ? 'default' : 'secondary'}>
                        {admin.status || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(admin.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
