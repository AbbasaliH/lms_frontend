'use client';

import { useState } from 'react';
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  MapPin,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  BarChart3,
  History,
  AlertCircle,
  Boxes,
  PackageX,
  ArrowRightLeft,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  useInventoryItems,
  useInventoryAnalytics,
  useLowStockItems,
  useExpiredItems,
  useNearExpiryItems,
  useReorderSuggestions,
  useInventoryAlerts,
} from '@/lib/hooks/use-laundry-inventory';
import { 
  LaundryInventoryCategory,
  StockStatus,
  type InventoryFilters,
} from '@/lib/types/laundry-inventory';
import {
  CATEGORY_GROUPS,
  CATEGORY_LABELS,
  STATUS_INFO,
  formatCurrency,
  formatQuantity,
  getCategoryGroup,
} from '@/lib/constants/laundry-inventory';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

export default function LaundryInventoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [filters, setFilters] = useState<InventoryFilters>({
    page: 1,
    limit: 20,
    sortBy: 'itemName',
    sortOrder: 'asc',
  });

  // Fetch data
  const { data: inventoryData, isLoading } = useInventoryItems(filters);
  const { data: analyticsData } = useInventoryAnalytics();
  const { data: lowStockData } = useLowStockItems();
  const { data: expiredData } = useExpiredItems();
  const { data: nearExpiryData } = useNearExpiryItems(30);
  const { data: reorderData } = useReorderSuggestions();
  const { data: alertsData } = useInventoryAlerts({ isResolved: false });

  const analytics = analyticsData?.data;
  const items = inventoryData?.data?.items || [];
  const lowStockItems = lowStockData?.data || [];
  const expiredItems = expiredData?.data || [];
  const nearExpiryItems = nearExpiryData?.data || [];
  const reorderSuggestions = reorderData?.data || [];
  const activeAlerts = alertsData?.data?.items || [];

  // Filter items based on search and filters
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplierName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === '' || item.category === categoryFilter;
    const matchesStatus = statusFilter === '' || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleApplyFilters = () => {
    setFilters({
      ...filters,
      search: searchQuery || undefined,
      category: categoryFilter ? (categoryFilter as LaundryInventoryCategory) : undefined,
      status: statusFilter ? (statusFilter as StockStatus) : undefined,
      page: 1,
    });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setStatusFilter('');
    setFilters({
      page: 1,
      limit: 20,
      sortBy: 'itemName',
      sortOrder: 'asc',
    });
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Laundry Inventory Management</h1>
          <p className="text-muted-foreground mt-1">
            Advanced inventory tracking for all laundry supplies and materials
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {formatCurrency(analytics?.totalValue || 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across {analytics?.totalItems || 0} items
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{activeAlerts.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {analytics?.criticalAlerts || 0} critical
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <TrendingDown className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{lowStockItems.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {analytics?.outOfStockItems || 0} out of stock
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reorder Required</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{reorderSuggestions.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Items need reordering
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Button variant="outline" className="justify-start">
              <Boxes className="mr-2 h-4 w-4" />
              Record Usage
            </Button>
            <Button variant="outline" className="justify-start">
              <PackageX className="mr-2 h-4 w-4" />
              Record Wastage
            </Button>
            <Button variant="outline" className="justify-start">
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              Stock Transfer
            </Button>
            <Button variant="outline" className="justify-start">
              <History className="mr-2 h-4 w-4" />
              View Transactions
            </Button>
            <Button variant="outline" className="justify-start">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics Report
            </Button>
            <Button variant="outline" className="justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              Usage Trends
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Expiry Alerts</CardTitle>
            <CardDescription>Items expiring soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Expired</span>
                <Badge variant="destructive">{expiredItems.length}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Expiring in 30 days</span>
                <Badge variant="outline">{nearExpiryItems.length}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="all-items" className="w-full">
        <TabsList>
          <TabsTrigger value="all-items">All Items</TabsTrigger>
          <TabsTrigger value="low-stock">
            Low Stock ({lowStockItems.length})
          </TabsTrigger>
          <TabsTrigger value="reorder">
            Reorder ({reorderSuggestions.length})
          </TabsTrigger>
          <TabsTrigger value="expiry">
            Expiry ({nearExpiryItems.length + expiredItems.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all-items" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {Object.entries(CATEGORY_GROUPS).map(([group, categories]) => (
                      <div key={group}>
                        <SelectItem value={group} disabled className="font-semibold">
                          {group}
                        </SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category} className="pl-6">
                            {CATEGORY_LABELS[category]}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    {Object.entries(STATUS_INFO).map(([status, info]) => (
                      <SelectItem key={status} value={status}>
                        {info.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button onClick={handleApplyFilters} size="sm" className="flex-1">
                    <Filter className="mr-2 h-4 w-4" />
                    Apply
                  </Button>
                  <Button
                    onClick={handleClearFilters}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Inventory Items</CardTitle>
              <CardDescription>
                Showing {filteredItems.length} of {items.length} items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 9 }).map((_, j) => (
                          <TableCell key={j}>
                            <Skeleton className="h-4 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground">
                        No items found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.itemName}</div>
                            <div className="text-xs text-muted-foreground">
                              {item.supplierName}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {CATEGORY_LABELS[item.category]}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {getCategoryGroup(item.category)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatQuantity(item.quantity, item.unit)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Min: {item.minimumStock}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3" />
                            {item.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={STATUS_INFO[item.status].variant}>
                            {STATUS_INFO[item.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatCurrency(item.quantity * item.costPerUnit, item.currency)}
                        </TableCell>
                        <TableCell>
                          {item.expiryDate ? (
                            <div className="text-sm">
                              {format(new Date(item.expiryDate), 'MMM dd, yyyy')}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Item</DropdownMenuItem>
                              <DropdownMenuItem>Record Usage</DropdownMenuItem>
                              <DropdownMenuItem>Receive Stock</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                Delete Item
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="low-stock">
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Items</CardTitle>
              <CardDescription>
                Items that need immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{item.itemName}</div>
                      <div className="text-sm text-muted-foreground">
                        {CATEGORY_LABELS[item.category]} • {item.location}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-destructive">
                        {formatQuantity(item.quantity, item.unit)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Min: {item.minimumStock}
                      </div>
                    </div>
                    <Button size="sm" className="ml-4">
                      Reorder
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reorder">
          <Card>
            <CardHeader>
              <CardTitle>Reorder Suggestions</CardTitle>
              <CardDescription>
                Items that have reached their reorder point
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reorderSuggestions.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{item.itemName}</div>
                      <div className="text-sm text-muted-foreground">
                        Supplier: {item.supplierName}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        Suggested: {item.reorderQuantity} {item.unit}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Lead time: {item.leadTimeDays || 7} days
                      </div>
                    </div>
                    <Button size="sm" className="ml-4">
                      Create PO
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expiry">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Expired Items</CardTitle>
                <CardDescription>Items that have already expired</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expiredItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No expired items</p>
                  ) : (
                    expiredItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between border-b pb-4 last:border-0"
                      >
                        <div className="flex-1">
                          <div className="font-medium">{item.itemName}</div>
                          <div className="text-sm text-muted-foreground">
                            Batch: {item.batchNumber || 'N/A'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-destructive">
                            {item.expiryDate &&
                              format(new Date(item.expiryDate), 'MMM dd, yyyy')}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Qty: {formatQuantity(item.quantity, item.unit)}
                          </div>
                        </div>
                        <Button size="sm" variant="destructive" className="ml-4">
                          Record Wastage
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expiring Soon</CardTitle>
                <CardDescription>Items expiring within 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {nearExpiryItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No items expiring soon
                    </p>
                  ) : (
                    nearExpiryItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between border-b pb-4 last:border-0"
                      >
                        <div className="flex-1">
                          <div className="font-medium">{item.itemName}</div>
                          <div className="text-sm text-muted-foreground">
                            Batch: {item.batchNumber || 'N/A'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-warning">
                            {item.expiryDate &&
                              format(new Date(item.expiryDate), 'MMM dd, yyyy')}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Qty: {formatQuantity(item.quantity, item.unit)}
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="ml-4">
                          Use First
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
