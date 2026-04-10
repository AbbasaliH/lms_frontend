import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar Skeleton */}
      <aside className="hidden md:flex w-72 flex-col border-r bg-card">
        <div className="flex h-16 items-center border-b px-6">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <div className="ml-3 flex-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="mt-1 h-3 w-24" />
          </div>
        </div>
        <div className="flex-1 p-4 space-y-4">
          <Skeleton className="h-9 w-full" />
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center border-b px-6 gap-4">
          <Skeleton className="h-8 w-8 md:hidden" />
          <div className="flex-1 flex gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
          <Skeleton className="hidden lg:flex h-10 w-64" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-32 rounded-full" />
        </header>
        <main className="flex-1 overflow-y-auto bg-muted/20 p-6">
          <div className="space-y-6">
            <Skeleton className="h-10 w-64" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <Skeleton className="h-96" />
          </div>
        </main>
      </div>
    </div>
  );
}
