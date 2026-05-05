import { Badge } from '@/components/ui/badge';
import { CustomerTier } from '@/lib/types/customer';

interface CustomerTierBadgeProps {
  tier: CustomerTier | string;
  className?: string;
}

export function CustomerTierBadge({ tier, className }: CustomerTierBadgeProps) {
  const getBadgeVariant = (t: string) => {
    switch (t) {
      case 'VIP':
      case 'PLATINUM':
      case 'GOLD':
        return 'default';
      case 'SILVER':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getColorClass = (t: string) => {
    switch (t) {
      case 'VIP':
        return 'bg-purple-600 text-white hover:bg-purple-700';
      case 'PLATINUM':
        return 'bg-slate-800 text-white hover:bg-slate-900 dark:bg-slate-200 dark:text-slate-900';
      case 'GOLD':
        return 'bg-yellow-500 text-white hover:bg-yellow-600';
      case 'SILVER':
        return 'bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-100';
      default:
        return '';
    }
  };

  return (
    <Badge 
      variant={getBadgeVariant(tier)} 
      className={`${getColorClass(tier)} ${className || ''}`}
    >
      {tier}
    </Badge>
  );
}
