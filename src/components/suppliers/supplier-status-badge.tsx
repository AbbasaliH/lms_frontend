import { Badge } from '@/components/ui/badge';
import { SupplierStatus, VerificationStatus, SupplierTier, PurchaseOrderStatus, PaymentStatus, ContractStatus } from '@/lib/types/supplier';

interface StatusBadgeProps {
  status: SupplierStatus | VerificationStatus | SupplierTier | PurchaseOrderStatus | PaymentStatus | ContractStatus;
  type?: 'status' | 'verification' | 'tier' | 'po' | 'payment' | 'contract';
}

const getStatusVariant = (
  status: string,
  type: string
): 'default' | 'secondary' | 'destructive' | 'outline' => {
  if (type === 'status') {
    switch (status) {
      case 'ACTIVE':
        return 'default';
      case 'PENDING':
        return 'secondary';
      case 'INACTIVE':
        return 'outline';
      case 'SUSPENDED':
      case 'BLACKLISTED':
        return 'destructive';
      default:
        return 'outline';
    }
  }

  if (type === 'verification') {
    switch (status) {
      case 'VERIFIED':
        return 'default';
      case 'UNVERIFIED':
        return 'secondary';
      case 'REJECTED':
        return 'destructive';
      default:
        return 'outline';
    }
  }

  if (type === 'tier') {
    switch (status) {
      case 'PREMIUM':
        return 'default';
      case 'STANDARD':
        return 'secondary';
      case 'BASIC':
        return 'outline';
      default:
        return 'outline';
    }
  }

  if (type === 'po') {
    switch (status) {
      case 'APPROVED':
      case 'COMPLETED':
        return 'default';
      case 'PENDING':
      case 'ORDERED':
        return 'secondary';
      case 'REJECTED':
      case 'CANCELLED':
        return 'destructive';
      default:
        return 'outline';
    }
  }

  if (type === 'payment') {
    switch (status) {
      case 'PAID':
      case 'APPROVED':
        return 'default';
      case 'PENDING':
      case 'UNPAID':
        return 'secondary';
      case 'OVERDUE':
      case 'REJECTED':
        return 'destructive';
      default:
        return 'outline';
    }
  }

  if (type === 'contract') {
    switch (status) {
      case 'ACTIVE':
        return 'default';
      case 'DRAFT':
        return 'secondary';
      case 'EXPIRED':
      case 'TERMINATED':
        return 'destructive';
      case 'RENEWED':
        return 'outline';
      default:
        return 'outline';
    }
  }

  return 'outline';
};

const formatStatusText = (status: string): string => {
  return status
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

export function StatusBadge({ status, type = 'status' }: StatusBadgeProps) {
  const variant = getStatusVariant(status, type);
  const text = formatStatusText(status);

  return <Badge variant={variant}>{text}</Badge>;
}