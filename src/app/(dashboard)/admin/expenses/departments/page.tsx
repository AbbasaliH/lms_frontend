'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Building2, Pencil, Trash2, Eye, Search } from 'lucide-react';
import { useDepartments } from '@/lib/hooks/use-expenses';
import { DepartmentFormDialog } from '@/components/expenses/department-form-dialog';
import { DeleteDepartmentDialog } from '@/components/expenses/delete-department-dialog';
import { DepartmentDetailDialog } from '@/components/expenses/department-detail-dialog';
import type { DepartmentFilters, Department } from '@/lib/types/expense';

export default function DepartmentsPage() {
  const [filters, setFilters] = useState<DepartmentFilters>({
    page: 1,
    limit: 10,
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog states
  const [formDialog, setFormDialog] = useState<{
    open: boolean;
    department: Department | null;
  }>({ open: false, department: null });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    department: Department | null;
  }>({ open: false, department: null });

  const [detailDialog, setDetailDialog] = useState<{
    open: boolean;
    departmentId: string | null;
  }>({ open: false, departmentId: null });

  const { data, isLoading } = useDepartments(filters);

  const departments = data?.data?.departments || [];
  const pagination = data?.data?.pagination;

  // Filter departments by search term locally
  const filteredDepartments = searchTerm
    ? departments.filter((dept) =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.headName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : departments;

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleCreateClick = () => {
    setFormDialog({ open: true, department: null });
  };

  const handleEditClick = (department: Department) => {
    setFormDialog({ open: true, department });
  };

  const handleDeleteClick = (department: Department) => {
    setDeleteDialog({ open: true, department });
  };

  const handleViewClick = (departmentId: string) => {
    setDetailDialog({ open: true, departmentId });
  };

  const handleDetailEdit = () => {
    // Close detail dialog and open edit dialog
    const dept = departments.find((d) => d.id === detailDialog.departmentId);
    if (dept) {
      setDetailDialog({ open: false, departmentId: null });
      setFormDialog({ open: true, department: dept });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Department Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage expense departments and their budgets
          </p>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="h-4 w-4 mr-2" />
          Add Department
        </Button>
      </div>

      {/* Departments Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Departments ({pagination?.total || 0})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : filteredDepartments.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchTerm ? 'No departments found' : 'No departments yet'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? 'Try adjusting your search terms'
                  : 'Get started by adding your first department'}
              </p>
              {!searchTerm && (
                <Button onClick={handleCreateClick}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Department
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Head</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center">Expenses</TableHead>
                      <TableHead className="text-center">Budgets</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDepartments.map((dept) => (
                      <TableRow key={dept.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-medium">{dept.name}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {dept.description || '-'}
                        </TableCell>
                        <TableCell>{dept.headName || '-'}</TableCell>
                        <TableCell>
                          {dept.headEmail ? (
                            <div className="text-sm space-y-1">
                              <div className="truncate max-w-[200px]">{dept.headEmail}</div>
                              {dept.headPhone && (
                                <div className="text-muted-foreground">{dept.headPhone}</div>
                              )}
                            </div>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={dept.isActive ? 'default' : 'secondary'}>
                            {dept.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-semibold">{dept.totalExpenses || 0}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-semibold">{dept.totalBudgets || 0}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewClick(dept.id)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditClick(dept)}
                              title="Edit Department"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(dept)}
                              title="Delete Department"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <DepartmentFormDialog
        open={formDialog.open}
        onOpenChange={(open) => setFormDialog({ open, department: null })}
        department={formDialog.department}
      />

      <DeleteDepartmentDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, department: null })}
        department={deleteDialog.department}
      />

      <DepartmentDetailDialog
        open={detailDialog.open}
        onOpenChange={(open) => setDetailDialog({ open, departmentId: null })}
        departmentId={detailDialog.departmentId}
        onEdit={handleDetailEdit}
      />
    </div>
  );
}
