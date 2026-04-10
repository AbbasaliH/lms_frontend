'use client';

import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSupplier } from '@/lib/hooks/use-suppliers';
import { StatusBadge } from '@/components/suppliers/supplier-status-badge';
import { RatingStars } from '@/components/suppliers/rating-stars';
import { formatCurrency, formatDate, formatPhoneNumber, formatPercentage } from '@/lib/utils/format';
import {
  ArrowLeft,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  Banknote,
  Edit,
  TrendingUp,
  Package,
  Star,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Link as LinkIcon,
  Globe,
  Receipt,
} from 'lucide-react';

export default function SupplierPerformancePage() {
  const router = useRouter();
  const params = useParams();
  const supplierId = params.id as string;

  const { data, isLoading, error } = useSupplier(supplierId);
  const supplier = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error || !supplier) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-medium mb-2">Failed to load supplier</h3>
        <p className="text-muted-foreground mb-4">
          {error?.message || 'Supplier not found'}
        </p>
        <Button onClick={() => router.push('/admin/suppliers')}>
          Back to Suppliers
        </Button>
      </div>
    );
  }

  const performanceMetrics = [
    {
      label: 'Total Orders',
      value: supplier.totalOrders,
      icon: Package,
      description: `${supplier.completedOrders} completed`,
    },
    {
      label: 'On-Time Delivery',
      value: supplier.onTimeDeliveryRate ? `${supplier.onTimeDeliveryRate}%` : 'N/A',
      icon: Clock,
      description: 'Delivery rate',
    },
    {
      label: 'Quality Rating',
      value: supplier.qualityRating ? `${supplier.qualityRating}%` : 'N/A',
      icon: Star,
      description: 'Quality score',
    },
    {
      label: 'Outstanding Amount',
      value: formatCurrency(supplier.currentOutstanding),
      icon: TrendingUp,
      description: `Limit: ${formatCurrency(supplier.creditLimit)}`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              {supplier.companyName}
            </h1>
            <p className="text-muted-foreground mt-1">
              Supplier Performance & Details
            </p>
          </div>
        </div>
        <Button onClick={() => router.push(`/admin/suppliers/${supplierId}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Supplier
        </Button>
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap gap-2">
        <StatusBadge status={supplier.status} type="status" />
        <StatusBadge status={supplier.verificationStatus} type="verification" />
        <StatusBadge status={supplier.tier} type="tier" />
        <Badge variant="outline">{supplier.supplierType}</Badge>
        {supplier.isBlacklisted && (
          <Badge variant="destructive">Blacklisted</Badge>
        )}
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {performanceMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.label}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {metric.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contracts">
            Contracts ({supplier._count?.contracts || 0})
          </TabsTrigger>
          <TabsTrigger value="orders">
            Purchase Orders ({supplier._count?.purchaseOrders || 0})
          </TabsTrigger>
          <TabsTrigger value="payments">
            Payments ({supplier._count?.payments || 0})
          </TabsTrigger>
          <TabsTrigger value="ratings">
            Ratings ({supplier._count?.ratings || 0})
          </TabsTrigger>
          <TabsTrigger value="inventory">Inventory Links</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Contact Person</p>
                    <p className="text-sm text-muted-foreground">{supplier.contactPerson}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{supplier.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">
                      {formatPhoneNumber(supplier.phoneNumber)}
                    </p>
                    {supplier.alternatePhone && (
                      <p className="text-sm text-muted-foreground">
                        {formatPhoneNumber(supplier.alternatePhone)}
                      </p>
                    )}
                  </div>
                </div>
                {supplier.website && (
                  <div className="flex items-start gap-2">
                    <Globe className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Website</p>
                      <a
                        href={supplier.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {supplier.website}
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">{supplier.address}</p>
                <p className="text-sm">
                  {supplier.city}, {supplier.state} - {supplier.postalCode}
                </p>
                <p className="text-sm font-medium">{supplier.country}</p>
              </CardContent>
            </Card>

            {/* Tax Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Tax Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {supplier.gstin && (
                  <div>
                    <p className="text-sm font-medium">GSTIN</p>
                    <p className="text-sm text-muted-foreground">{supplier.gstin}</p>
                  </div>
                )}
                {supplier.panNumber && (
                  <div>
                    <p className="text-sm font-medium">PAN Number</p>
                    <p className="text-sm text-muted-foreground">{supplier.panNumber}</p>
                  </div>
                )}
                {!supplier.gstin && !supplier.panNumber && (
                  <p className="text-sm text-muted-foreground">No tax information available</p>
                )}
              </CardContent>
            </Card>

            {/* Bank Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Banknote className="h-4 w-4" />
                  Bank Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {supplier.bankName && (
                  <>
                    <div>
                      <p className="text-sm font-medium">Bank Name</p>
                      <p className="text-sm text-muted-foreground">{supplier.bankName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Account Number</p>
                      <p className="text-sm text-muted-foreground">
                        {supplier.bankAccountNumber || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">IFSC Code</p>
                      <p className="text-sm text-muted-foreground">
                        {supplier.bankIFSC || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Branch</p>
                      <p className="text-sm text-muted-foreground">
                        {supplier.bankBranch || 'N/A'}
                      </p>
                    </div>
                  </>
                )}
                {!supplier.bankName && (
                  <p className="text-sm text-muted-foreground">No bank information available</p>
                )}
              </CardContent>
            </Card>

            {/* Financial Terms */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Financial Terms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium">Credit Limit</p>
                    <p className="text-lg font-bold">{formatCurrency(supplier.creditLimit)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Current Outstanding</p>
                    <p className="text-lg font-bold text-destructive">
                      {formatCurrency(supplier.currentOutstanding)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Payment Terms</p>
                    <p className="text-lg font-bold">{supplier.paymentTermsDays} days</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Categories Supplied */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Categories Supplied</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {supplier.categoriesSupplied.map((category) => (
                    <Badge key={category} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            {supplier.notes && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{supplier.notes}</p>
                </CardContent>
              </Card>
            )}

            {/* Approval Information */}
            {supplier.approvedBy && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Approval Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Approved By:</span>
                    <span className="text-sm font-medium">{supplier.approvedBy}</span>
                  </div>
                  {supplier.approvedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Approved At:</span>
                      <span className="text-sm font-medium">
                        {formatDate(supplier.approvedAt)}
                      </span>
                    </div>
                  )}
                  {supplier.lastOrderDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Last Order:</span>
                      <span className="text-sm font-medium">
                        {formatDate(supplier.lastOrderDate)}
                      </span>
                    </div>
                  )}
                  {supplier.lastPaymentDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Last Payment:</span>
                      <span className="text-sm font-medium">
                        {formatDate(supplier.lastPaymentDate)}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Contracts Tab */}
        <TabsContent value="contracts">
          <Card>
            <CardHeader>
              <CardTitle>Contracts</CardTitle>
              <CardDescription>All contracts with this supplier</CardDescription>
            </CardHeader>
            <CardContent>
              {supplier.contracts && supplier.contracts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contract Number</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Auto Renewal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supplier.contracts.map((contract) => (
                      <TableRow key={contract.id}>
                        <TableCell className="font-medium">{contract.contractNumber}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{contract.title}</p>
                            {contract.description && (
                              <p className="text-sm text-muted-foreground">{contract.description}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{formatDate(contract.startDate)}</p>
                            <p className="text-muted-foreground">to {formatDate(contract.endDate)}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{formatCurrency(contract.value)}</TableCell>
                        <TableCell>
                          <StatusBadge status={contract.status} type="contract" />
                        </TableCell>
                        <TableCell>
                          {contract.autoRenewal ? (
                            <Badge variant="outline">
                              Yes ({contract.renewalNoticeDays} days notice)
                            </Badge>
                          ) : (
                            <Badge variant="secondary">No</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No contracts found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Purchase Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Orders</CardTitle>
              <CardDescription>All purchase orders with this supplier</CardDescription>
            </CardHeader>
            <CardContent>
              {supplier.purchaseOrders && supplier.purchaseOrders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order Number</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead>Expected Delivery</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supplier.purchaseOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{formatDate(order.orderDate)}</TableCell>
                        <TableCell>{formatDate(order.expectedDelivery)}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(order.grandTotal)}</TableCell>
                        <TableCell>
                          <StatusBadge status={order.status} type="po" />
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={order.paymentStatus} type="payment" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No purchase orders found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>All payments made to this supplier</CardDescription>
            </CardHeader>
            <CardContent>
              {supplier.payments && supplier.payments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Approved By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supplier.payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{payment.paymentMethod.replace('_', ' ')}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {payment.transactionId || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={payment.status} type="payment" />
                        </TableCell>
                        <TableCell className="text-sm">
                          {payment.approvedBy || 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No payments found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ratings Tab */}
        <TabsContent value="ratings">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Ratings</CardTitle>
              <CardDescription>Performance ratings from purchase orders</CardDescription>
            </CardHeader>
            <CardContent>
              {supplier.ratings && supplier.ratings.length > 0 ? (
                <div className="space-y-4">
                  {supplier.ratings.map((rating) => (
                    <Card key={rating.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <RatingStars rating={rating.rating} size={20} />
                            <p className="text-sm text-muted-foreground mt-1">
                              Rated by {rating.ratedBy} on {formatDate(rating.createdAt)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid gap-3 md:grid-cols-3 mb-4">
                          <div>
                            <p className="text-sm font-medium">Quality</p>
                            <RatingStars rating={rating.qualityRating} size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Delivery</p>
                            <RatingStars rating={rating.deliveryRating} size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Service</p>
                            <RatingStars rating={rating.serviceRating} size={16} />
                          </div>
                        </div>

                        {rating.comment && (
                          <div className="mt-4 p-3 bg-muted/50 rounded-md">
                            <p className="text-sm">{rating.comment}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No ratings found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Links Tab */}
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Links</CardTitle>
              <CardDescription>Inventory items supplied by this supplier</CardDescription>
            </CardHeader>
            <CardContent>
              {supplier.inventoryLinks && supplier.inventoryLinks.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Min Order Qty</TableHead>
                      <TableHead>Lead Time</TableHead>
                      <TableHead>Last Supplied</TableHead>
                      <TableHead>Primary</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supplier.inventoryLinks.map((link) => (
                      <TableRow key={link.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{link.inventory?.itemName || 'N/A'}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{link.inventory?.category || 'N/A'}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{formatCurrency(link.unitPrice)}</TableCell>
                        <TableCell>
                          {link.minimumOrderQty} {link.inventory?.unit || 'units'}
                        </TableCell>
                        <TableCell>{link.leadTimeDays} days</TableCell>
                        <TableCell>
                          {link.lastSuppliedDate ? (
                            <div className="text-sm">
                              <p>{formatDate(link.lastSuppliedDate)}</p>
                              <p className="text-muted-foreground">
                                @ {formatCurrency(link.lastSuppliedPrice || 0)}
                              </p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {link.isPrimary ? (
                            <Badge variant="default">Primary</Badge>
                          ) : (
                            <Badge variant="secondary">Secondary</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <LinkIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No inventory links found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}