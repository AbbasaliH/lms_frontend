import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CustomerTierBadge } from './customer-tier-badge';
import type { ApiCustomer } from '@/lib/types/customer';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Edit, Eye, ShieldAlert } from 'lucide-react';

interface CustomerCardProps {
  customer: ApiCustomer;
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
  onBlacklist?: (id: string) => void;
}

export function CustomerCard({ customer, onEdit, onView, onBlacklist }: CustomerCardProps) {
  const initials = customer.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <Avatar className="h-12 w-12">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <CardTitle className="text-base flex items-center justify-between">
            <span className="truncate">{customer.fullName}</span>
            <CustomerTierBadge tier={customer.tier} />
          </CardTitle>
          <div className="text-sm text-muted-foreground flex justify-between">
            <span>{customer.customerCode}</span>
            <span>{customer.status}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4 text-center text-sm">
          <div className="space-y-1">
            <div className="text-muted-foreground">Orders</div>
            <div className="font-medium">{customer.totalOrders}</div>
          </div>
          <div className="space-y-1 border-x px-2">
            <div className="text-muted-foreground">Spent</div>
            <div className="font-medium">₹{customer.totalSpent.toFixed(0)}</div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground">Points</div>
            <div className="font-medium">{customer.loyaltyPoints}</div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t">
          {onView && (
            <Button variant="ghost" size="sm" onClick={() => onView(customer.id)}>
              <Eye className="h-4 w-4 mr-1" /> View
            </Button>
          )}
          {onEdit && (
            <Button variant="ghost" size="sm" onClick={() => onEdit(customer.id)}>
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          )}
          {onBlacklist && (
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => onBlacklist(customer.id)}>
              <ShieldAlert className="h-4 w-4 mr-1" /> Blacklist
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
