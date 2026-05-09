'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Plus, 
  Star, 
  Eye, 
  Edit, 
  Trash2, 
  MoreVertical,
  CircleDot,
  AlertCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DeliveryBoyForm } from '@/components/forms/delivery-boy-form';
import { DeliveryBoyFilters } from '@/components/delivery-boys/delivery-boy-filters';
import { DeliveryBoyDetailDialog } from '@/components/delivery-boys/delivery-boy-detail-dialog';
import { useDeliveryBoys, useCreateDeliveryBoy, useDeleteDeliveryBoy, useUpdateDeliveryBoyStatus, useUpdateDeliveryBoy } from '@/lib/hooks/use-delivery-boys';
import { VehicleType, DeliveryBoyStatus } from '@/lib/types/delivery-boy';
import type { DeliveryBoyFormData } from '@/lib/schemas/delivery-boy-schema';
import type { ApiDeliveryBoyItem } from '@/lib/types/delivery-boy';

export default function DeliveryBoysPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState<ApiDeliveryBoyItem | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  
  // Filters and pagination
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<DeliveryBoyStatus | 'ALL'>('ALL');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<VehicleType | 'ALL'>('ALL');
  const [availabilityFilter, setAvailabilityFilter] = useState<'ALL' | 'true' | 'false'>('ALL');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Build filters object
  const filters = useMemo(() => {
    const f: any = {};
    if (search) f.search = search;
    if (statusFilter !== 'ALL') f.status = statusFilter;
    if (vehicleTypeFilter !== 'ALL') f.vehicleType = vehicleTypeFilter;
    if (availabilityFilter !== 'ALL') f.isAvailable = availabilityFilter === 'true';
    return f;
  }, [search, statusFilter, vehicleTypeFilter, availabilityFilter]);

  // Fetch delivery boys
  const { data, isLoading, error } = useDeliveryBoys(filters, { page, limit });
  const createMutation = useCreateDeliveryBoy();
  const deleteMutation = useDeleteDeliveryBoy();
  const updateStatusMutation = useUpdateDeliveryBoyStatus();
  const updateMutation = useUpdateDeliveryBoy();

  const handleSubmit = async (formData: DeliveryBoyFormData) => {
    try {
      await createMutation.mutateAsync({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password || 'defaultPass123',
        gender: formData.gender,
        villageName: formData.villageName,
        streetName: formData.streetName,
        vehicleType: formData.vehicleType,
        vehicleNumber: formData.vehicleNumber,
        licenseNumber: formData.licenseNumber,
        aadharNumber: formData.aadharNumber,
        emergencyContact: formData.emergencyContact,
        workingHoursStart: formData.workingHoursStart,
        workingHoursEnd: formData.workingHoursEnd,
      });
      setIsDialogOpen(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleEditSubmit = async (formData: DeliveryBoyFormData) => {
    if (!selectedDeliveryBoy) return;
    try {
      await updateMutation.mutateAsync({
        id: selectedDeliveryBoy.id,
        data: {
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          gender: formData.gender,
          villageName: formData.villageName,
          streetName: formData.streetName,
          vehicleType: formData.vehicleType,
          vehicleNumber: formData.vehicleNumber,
          licenseNumber: formData.licenseNumber,
          aadharNumber: formData.aadharNumber,
          emergencyContact: formData.emergencyContact,
          workingHoursStart: formData.workingHoursStart,
          workingHoursEnd: formData.workingHoursEnd,
        },
      });
      setIsEditDialogOpen(false);
      setSelectedDeliveryBoy(null);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleEditClick = (deliveryBoy: ApiDeliveryBoyItem) => {
    setSelectedDeliveryBoy(deliveryBoy);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this delivery boy?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleStatusChange = async (id: string, status: DeliveryBoyStatus) => {
    await updateStatusMutation.mutateAsync({ id, data: { status } });
  };

  const handleViewDetails = (deliveryBoy: ApiDeliveryBoyItem) => {
    setSelectedDeliveryBoy(deliveryBoy);
    setIsDetailDialogOpen(true);
  };

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setVehicleTypeFilter('ALL');
    setAvailabilityFilter('ALL');
    setPage(1);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'default';
      case 'INACTIVE':
        return 'secondary';
      case 'ON_LEAVE':
        return 'outline';
      case 'SUSPENDED':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Active';
      case 'INACTIVE':
        return 'Inactive';
      case 'ON_LEAVE':
        return 'On Leave';
      case 'SUSPENDED':
        return 'Suspended';
      default:
        return status;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const deliveryBoys = data?.data || [];
  // Since API doesn't return pagination info, we'll calculate it client-side
  const pagination = {
    page,
    limit,
    total: deliveryBoys.length,
    totalPages: Math.ceil(deliveryBoys.length / limit),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Delivery Personnel</h2>
          <p className="text-muted-foreground">
            Manage delivery staff and track their performance
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Delivery Boy
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Delivery Personnel</DialogTitle>
              <DialogDescription>
                Add a new delivery person to your team. Fill in their details and vehicle information.
              </DialogDescription>
            </DialogHeader>
            <DeliveryBoyForm 
              onSubmit={handleSubmit} 
              isSubmitting={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DeliveryBoyFilters
        search={search}
        status={statusFilter}
        vehicleType={vehicleTypeFilter}
        isAvailable={availabilityFilter}
        onSearchChange={setSearch}
        onStatusChange={setStatusFilter}
        onVehicleTypeChange={setVehicleTypeFilter}
        onAvailabilityChange={setAvailabilityFilter}
        onReset={resetFilters}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Delivery Personnel</h3>
            {pagination && (
              <p className="text-sm text-muted-foreground">
                Showing {deliveryBoys.length} of {pagination.total} results
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="flex items-center gap-2 p-4 text-sm text-destructive bg-destructive/10 rounded-md">
              <AlertCircle className="h-4 w-4" />
              <p>Failed to load delivery personnel. Please try again.</p>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-3 w-[150px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : deliveryBoys.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No delivery personnel found.</p>
              <Button variant="link" onClick={resetFilters} className="mt-2">
                Clear filters
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Deliveries</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Earnings</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deliveryBoys.map((deliveryBoy) => (
                      <TableRow key={deliveryBoy.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {getInitials(deliveryBoy.fullName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{deliveryBoy.fullName}</p>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <CircleDot className={`h-2 w-2 ${deliveryBoy.deliveryBoy.isAvailable ? 'text-success fill-success' : 'text-muted-foreground fill-muted-foreground'}`} />
                                <span>{deliveryBoy.deliveryBoy.isAvailable ? 'Available' : 'Unavailable'}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{deliveryBoy.email}</p>
                            <p className="text-muted-foreground">{deliveryBoy.phoneNumber}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{deliveryBoy.deliveryBoy.vehicleType}</p>
                            {deliveryBoy.deliveryBoy.vehicleNumber && (
                              <p className="text-muted-foreground">{deliveryBoy.deliveryBoy.vehicleNumber}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{deliveryBoy.deliveryBoy.totalDeliveries}</p>
                            <p className="text-muted-foreground">
                              {deliveryBoy.deliveryBoy.successfulDeliveries} successful
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {deliveryBoy.deliveryBoy.averageRating ? (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-warning text-warning" />
                              <span className="font-medium">{deliveryBoy.deliveryBoy.averageRating.toFixed(1)}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          ₹{deliveryBoy.deliveryBoy.earnings.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={deliveryBoy.deliveryBoy.status}
                            onValueChange={(value) => handleStatusChange(deliveryBoy.id, value as DeliveryBoyStatus)}
                            disabled={updateStatusMutation.isPending}
                          >
                            <SelectTrigger className="w-[130px]">
                              <Badge variant={getStatusBadgeVariant(deliveryBoy.deliveryBoy.status)}>
                                {getStatusLabel(deliveryBoy.deliveryBoy.status)}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={DeliveryBoyStatus.ACTIVE}>Active</SelectItem>
                              <SelectItem value={DeliveryBoyStatus.INACTIVE}>Inactive</SelectItem>
                              <SelectItem value={DeliveryBoyStatus.ON_LEAVE}>On Leave</SelectItem>
                              <SelectItem value={DeliveryBoyStatus.SUSPENDED}>Suspended</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleViewDetails(deliveryBoy)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditClick(deliveryBoy)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDelete(deliveryBoy.id)}
                                className="text-destructive focus:text-destructive"
                                disabled={deleteMutation.isPending}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Page {pagination.page} of {pagination.totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page === (pagination.totalPages || 1)}
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Delivery Personnel</DialogTitle>
            <DialogDescription>
              Update delivery person details and vehicle information.
            </DialogDescription>
          </DialogHeader>
          {selectedDeliveryBoy && (
            <DeliveryBoyForm
              onSubmit={handleEditSubmit}
              isSubmitting={updateMutation.isPending}
              isEdit
              defaultValues={{
                fullName: selectedDeliveryBoy.fullName,
                email: selectedDeliveryBoy.email,
                phoneNumber: selectedDeliveryBoy.phoneNumber,
                gender: selectedDeliveryBoy.gender as any,
                vehicleType: selectedDeliveryBoy.deliveryBoy.vehicleType,
                vehicleNumber: selectedDeliveryBoy.deliveryBoy.vehicleNumber,
                licenseNumber: selectedDeliveryBoy.deliveryBoy.licenseNumber,
                emergencyContact: undefined,
                workingHoursStart: undefined,
                workingHoursEnd: undefined,
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <DeliveryBoyDetailDialog
        deliveryBoy={selectedDeliveryBoy}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />
    </div>
  );
}