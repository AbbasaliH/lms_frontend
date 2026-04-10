import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating?: number;
  showValue?: boolean;
  size?: number;
}

export function RatingStars({ rating, showValue = true, size = 16 }: RatingStarsProps) {
  if (!rating) {
    return <span className="text-sm text-muted-foreground">No rating</span>;
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-none text-muted-foreground'
          }
        />
      ))}
      {showValue && (
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}