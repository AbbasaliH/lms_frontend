import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function CreateOrderCardSkeleton() {
  return (
    <Card className="border-2 animate-in fade-in-50 duration-500">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <Skeleton className="h-11 w-full md:w-36" />
        </div>
      </CardContent>
    </Card>
  );
}
