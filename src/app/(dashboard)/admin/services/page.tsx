'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
  WashingMachine,
  Search,
  Filter,
  MoreHorizontal,
  Loader2,
  Trash,
  Edit,
  Tag
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ServiceDialog } from '@/components/services/service-dialog';
import { useServices, useDeleteService } from '@/lib/hooks/use-services';
import type { LaundryService } from '@/lib/types/service';

const getCategoryBadge = (category: string) => {
  return <Badge variant="secondary" className="whitespace-nowrap">{category.replace(/_/g, ' ')}</Badge>;
};

const getStatusBadge = (isActive: boolean) => {
  if (isActive) {
    return <Badge className="bg-success text-success-foreground">Active</Badge>;
  }
  return <Badge variant="secondary">Inactive</Badge>;
};

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useServices(
    categoryFilter ? { category: categoryFilter as any } : undefined
  );
  const deleteMutation = useDeleteService();

  // Handle client-side search filtering since there isn't a search param in backend
  const services = (data?.data || []).filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (service.description && service.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const stats = {
    total: data?.data?.length || 0,
    active: data?.data?.filter(s => s.isActive).length || 0,
    inactive: data?.data?.filter(s => !s.isActive).length || 0,
  };

  const handleDelete = () => {
    if (serviceToDelete) {
      deleteMutation.mutate(serviceToDelete, {
        onSuccess: () => setServiceToDelete(null)
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Services Management</h2>
          <p className="text-muted-foreground">
            Manage laundry services, pricing, and categories.
          </p>
        </div>
        <ServiceDialog />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <WashingMachine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Available services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
            <Tag className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently offered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Services</CardTitle>
            <Loader2 className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">Disabled services</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search services by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button 
          variant="outline" 
          className="w-full sm:w-auto"
          onClick={() => setCategoryFilter(undefined)}
        >
          <Filter className="mr-2 h-4 w-4" />
          {categoryFilter ? "Clear Filters" : "Filter"}
        </Button>
      </div>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Services</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <div className="rounded-md bg-destructive/10 p-4 text-center">
              <p className="text-sm text-destructive">
                {error?.message || 'Failed to load services. Please try again.'}
              </p>
            </div>
          ) : services.length === 0 ? (
            <div className="py-12 text-center">
              <WashingMachine className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No services found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Get started by adding your first service'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Pricing</TableHead>
                    <TableHead className="hidden md:table-cell">Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service: LaundryService) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{service.name}</div>
                          {service.description && (
                            <div className="text-xs text-muted-foreground truncate max-w-[250px]">
                              {service.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getCategoryBadge(service.category)}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">₹{service.basePrice.toFixed(2)} Base</div>
                          {service.pricePerUnit ? (
                            <div className="text-xs text-muted-foreground">
                              + ₹{service.pricePerUnit.toFixed(2)} per {service.unitType || 'unit'}
                            </div>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {service.durationHours ? `${service.durationHours} hrs` : '-'}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(service.isActive)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <ServiceDialog 
                              service={service} 
                              trigger={<DropdownMenuItem onSelect={(e) => e.preventDefault()}><Edit className="mr-2 h-4 w-4" /> Edit Service</DropdownMenuItem>}
                            />
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                                  <Trash className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the service
                                    "{service.name}".
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                    onClick={() => {
                                      setServiceToDelete(service.id);
                                      setTimeout(() => handleDelete(), 0);
                                    }}
                                  >
                                    {deleteMutation.isPending && serviceToDelete === service.id ? (
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : null}
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
