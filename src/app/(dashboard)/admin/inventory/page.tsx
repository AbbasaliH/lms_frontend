'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  AlertTriangle,
  Package,
  TrendingDown,
  TrendingUp,
  Search,
  Filter,
  MoreHorizontal,
  Loader2,
  PhoneCall,
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
import { AddInventoryDialog } from '@/components/inventory/add-inventory-dialog';
import { inventoryApi } from '@/lib/api/inventory';
import type { ApiInventoryItem } from '@/lib/types/inventory';

const getStatusBadge = (item: ApiInventoryItem) => {
  if (item.status === 'OUT_OF_STOCK' || item.quantity === 0) {
    return (
      <Badge variant="destructive" className="gap-1">
        <AlertTriangle className="h-3 w-3" />
        Out of Stock
      </Badge>
    );
  }

  if (item.status === 'LOW_STOCK' || item.quantity <= item.minimumStock) {
    return (
      <Badge variant="default" className="gap-1 bg-warning text-warning-foreground">
        <TrendingDown className="h-3 w-3" />
        Low Stock
      </Badge>
    );
  }

  if (item.quantity <= item.reorderLevel) {
    return (
      <Badge variant="default" className="gap-1 bg-info text-info-foreground">
        <TrendingUp className="h-3 w-3" />
        Reorder Soon
      </Badge>
    );
  }

  return (
    <Badge variant="default" className="gap-1 bg-success text-success-foreground">
      In Stock
    </Badge>
  );
};

export default function InventoryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['inventory', page, limit],
    queryFn: () => inventoryApi.getInventory(page, limit),
  });

  const filteredItems = data?.data.items.filter((item) =>
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.supplierName.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const stats = {
    totalItems: data?.data.pagination.total || 0,
    lowStockItems: data?.data.items.filter(
      (item) => item.quantity <= item.minimumStock
    ).length || 0,
    outOfStockItems: data?.data.items.filter(
      (item) => item.quantity === 0
    ).length || 0,
    totalValue: data?.data.items.reduce(
      (sum, item) => sum + (item.quantity * item.costPerUnit),
      0
    ) || 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
          <p className="text-muted-foreground">
            Track stock levels and manage supplies
          </p>
        </div>
        <AddInventoryDialog />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">In inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Items need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.outOfStockItems}</div>
            <p className="text-xs text-muted-foreground">Items unavailable</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Inventory worth</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by item name, category, or supplier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Items</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <div className="rounded-md bg-destructive/10 p-4 text-center">
              <p className="text-sm text-destructive">
                {error?.message || 'Failed to load inventory. Please try again.'}
              </p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-12 text-center">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No items found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Get started by adding your first inventory item'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="hidden lg:table-cell">Min Stock</TableHead>
                    <TableHead className="hidden xl:table-cell">Cost/Unit</TableHead>
                    <TableHead className="hidden sm:table-cell">Supplier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{item.itemName}</div>
                          {item.description && (
                            <div className="text-xs text-muted-foreground line-clamp-1">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline">
                          {item.category.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {item.quantity} {item.unit}
                          </div>
                          {item.lastRestockedAt && (
                            <div className="text-xs text-muted-foreground">
                              Restocked {format(new Date(item.lastRestockedAt), 'MMM d')}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {item.minimumStock} {item.unit}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        ₹{item.costPerUnit}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="space-y-1">
                          <div className="text-sm">{item.supplierName}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.supplierContact}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(item)}</TableCell>
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
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Item</DropdownMenuItem>
                            <DropdownMenuItem>Restock</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push('/admin/suppliers')}>
                              <PhoneCall className="mr-2 h-4 w-4" />
                              Contact Supplier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              Delete Item
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {data && data.data.pagination.pages > 1 && (
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">
                Page {page} of {data.data.pagination.pages}
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
                  disabled={page === data.data.pagination.pages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}