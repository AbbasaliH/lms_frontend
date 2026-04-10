'use client';

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";


import { DeliveryBoyFilters } from "@/components/delivery-boys/delivery-boy-filters";
import { DeliveryBoyForm } from "@/components/forms/delivery-boy-form";

import { useDeliveryBoys, useCreateDeliveryBoy } from "@/lib/hooks/use-delivery-boys";
import type { DeliveryBoyFilters } from "@/lib/types/delivery-boy";
import { DeliveryBoyListItem } from "@/lib/types/delivery-boy";

export default function DeliveryBoysPage() {
  const [filters, setFilters] = useState<DeliveryBoyFilters>({});
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState(null);

  const { data, isLoading } = useDeliveryBoys(filters, pagination);
  const createMutation = useCreateDeliveryBoy();

  const deliveryBoys = data?.data || [];

  const columns = [/* define columns using DeliveryBoyListItem */ {
    accessorKey: "fullName",
    header: "Name",
  }, {
    accessorKey: "phoneNumber",
    header: "Phone",
  }, {
    accessorKey: "deliveryBoy.vehicleType",
    header: "Vehicle",
  }, {
    accessorKey: "deliveryBoy.status",
    header: "Status",
    cell: ({ row }) => <Badge>{row.original.deliveryBoy.status}</Badge>,
  }, {
    accessorKey: "deliveryBoy.earnings",
    header: "Earnings",
  }];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Delivery Boys</h1>
          <p className="text-muted-foreground">Manage your delivery personnel and assignments.</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Delivery Boy
            </Button>
          </DialogTrigger>
          <DeliveryBoyForm 
            onSubmit={async (data) => {
              await createMutation.mutateAsync(data);
              setShowCreateDialog(false);
            }} 
            isSubmitting={createMutation.isPending}
          />
        </Dialog>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Delivery Boys List</CardTitle>
          <div className="flex gap-2">
            <DeliveryBoyFilters onFiltersChange={setFilters} />
            <Input placeholder="Search delivery boys..." className="w-[200px]" />
          </div>
        </CardHeader>

  <CardContent>
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Earnings</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deliveryBoys.map((deliveryBoy: any) => (
            <TableRow key={deliveryBoy.id}>
              <TableCell>{deliveryBoy.fullName}</TableCell>
              <TableCell>{deliveryBoy.phoneNumber}</TableCell>
              <TableCell>{deliveryBoy.deliveryBoy?.vehicleType}</TableCell>
              <TableCell>
                <Badge variant="default">
                  {deliveryBoy.deliveryBoy?.status}
                </Badge>
              </TableCell>
              <TableCell>₹{deliveryBoy.deliveryBoy?.earnings?.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </CardContent>

      </Card>
    </div>
  );
}
