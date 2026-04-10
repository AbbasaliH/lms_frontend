import { Badge } from '@/components/ui/badge';
import { 
  PaymentStatus, 
  ApprovalStatus, 
  BudgetStatus,
} from '@/lib/types/expense';
import {
  PAYMENT_STATUS_LABELS,
  APPROVAL_STATUS_LABELS,
  BUDGET_STATUS_LABELS,
  PAYMENT_STATUS_VARIANTS,
  APPROVAL_STATUS_VARIANTS,
  BUDGET_STATUS_VARIANTS,
} from '@/lib/constants/expense';

interface ExpenseStatusBadgeProps {
  status: PaymentStatus | ApprovalStatus | BudgetStatus;
  type: 'payment' | 'approval' | 'budget';
}

export function ExpenseStatusBadge({ status, type }: ExpenseStatusBadgeProps) {
  let label = '';
  let variant: 'default' | 'destructive' | 'outline' | 'secondary' = 'default';

  if (type === 'payment') {
    label = PAYMENT_STATUS_LABELS[status as PaymentStatus];
    variant = PAYMENT_STATUS_VARIANTS[status as PaymentStatus];
  } else if (type === 'approval') {
    label = APPROVAL_STATUS_LABELS[status as ApprovalStatus];
    variant = APPROVAL_STATUS_VARIANTS[status as ApprovalStatus];
  } else {
    label = BUDGET_STATUS_LABELS[status as BudgetStatus];
    variant = BUDGET_STATUS_VARIANTS[status as BudgetStatus];
  }

  return (
    <Badge variant={variant} className="font-medium">
      {label}
    </Badge>
  );
}