'use client';

import { useState, useMemo } from 'react';
import { Shirt, Droplets, Wind, Sparkles, AlertCircle, ShoppingBag, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useServices } from '@/lib/hooks/use-services';
import { ServiceCategory, type LaundryService } from '@/lib/types/service';

const getCategoryIcon = (category: ServiceCategory) => {
  switch (category) {
    case ServiceCategory.WASHING: return <Droplets className="h-6 w-6 text-blue-500" />;
    case ServiceCategory.DRY_CLEANING: return <Sparkles className="h-6 w-6 text-purple-500" />;
    case ServiceCategory.DRYING: return <Wind className="h-6 w-6 text-orange-500" />;
    case ServiceCategory.IRONING_AND_PRESS: return <Shirt className="h-6 w-6 text-indigo-500" />;
    case ServiceCategory.STAIN_REMOVAL: return <AlertCircle className="h-6 w-6 text-red-500" />;
    case ServiceCategory.PREMIUM_CARE: return <Sparkles className="h-6 w-6 text-amber-500" />;
    default: return <ShoppingBag className="h-6 w-6 text-slate-500" />;
  }
};

const formatCategoryName = (category: string) => {
  return category.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};

export default function ServicesListingPage() {
  const { data, isLoading, isError } = useServices({ isActive: true });
  const [activeTab, setActiveTab] = useState<string>('ALL');

  const services = data?.data || [];

  const groupedServices = useMemo(() => {
    const groups: Record<string, LaundryService[]> = {};
    services.forEach(service => {
      if (!groups[service.category]) {
        groups[service.category] = [];
      }
      groups[service.category].push(service);
    });
    return groups;
  }, [services]);

  const categories = ['ALL', ...Object.keys(groupedServices).sort()];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Loading amazing services...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold tracking-tight mb-2">Oops! Something went wrong</h2>
        <p className="text-muted-foreground max-w-md">
          We couldn't load our services right now. Please try refreshing the page or check back later.
        </p>
        <Button className="mt-6" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  const displayedServices = activeTab === 'ALL' 
    ? services 
    : groupedServices[activeTab] || [];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* Header Banner */}
      <div className="bg-primary text-primary-foreground py-16 px-4 md:px-8 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" />
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center text-center space-y-4">
          <Badge variant="secondary" className="mb-4 bg-primary-foreground/20 text-primary-foreground border-none hover:bg-primary-foreground/30">
            Premium Laundry & Dry Cleaning
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Our Services & Pricing
          </h1>
          <p className="text-lg md:text-xl max-w-2xl text-primary-foreground/90 font-medium">
            Discover our comprehensive range of garment care services. From everyday wash & fold to premium dry cleaning, we treat every item with the utmost care.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-12 px-4 md:px-8">
        <Tabs defaultValue="ALL" value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col items-center">
          <TabsList className="flex flex-wrap justify-center h-auto bg-transparent gap-2 mb-12">
            {categories.map((category) => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-6 py-2.5 text-sm font-medium transition-all shadow-sm border border-slate-200 dark:border-slate-800 bg-background hover:bg-muted"
              >
                {category === 'ALL' ? 'All Services' : formatCategoryName(category)}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="w-full">
            {displayedServices.length === 0 ? (
              <div className="text-center py-24 bg-card rounded-2xl border shadow-sm">
                <Shirt className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-2xl font-bold tracking-tight mb-2">No Services Found</h3>
                <p className="text-muted-foreground">We don't have any active services in this category yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedServices.map((service) => (
                  <Card key={service.id} className="group overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 border-slate-200/60 dark:border-slate-800/60 hover:border-primary/30">
                    <CardHeader className="pb-4 relative bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-slate-100 dark:border-slate-800">
                      <div className="absolute top-4 right-4 bg-background p-2.5 rounded-full shadow-sm border group-hover:scale-110 transition-transform duration-300">
                        {getCategoryIcon(service.category)}
                      </div>
                      <div className="mb-2">
                        <Badge variant="outline" className="text-xs font-semibold bg-primary/5 text-primary border-primary/20">
                          {formatCategoryName(service.category)}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl leading-tight pt-1">{service.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 flex-grow">
                      <div className="flex items-baseline mb-4">
                        <span className="text-3xl font-bold tracking-tight">₹{service.basePrice.toFixed(2)}</span>
                        {service.pricePerUnit ? (
                          <span className="text-muted-foreground ml-2 font-medium">
                            + ₹{service.pricePerUnit.toFixed(2)}/{service.unitType || 'unit'}
                          </span>
                        ) : null}
                      </div>
                      <CardDescription className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed min-h-[3rem]">
                        {service.description || "Premium quality service for your garments."}
                      </CardDescription>
                      
                      {service.durationHours && (
                        <div className="flex items-center text-xs font-medium text-slate-500 dark:text-slate-400 mt-4 bg-slate-100 dark:bg-slate-800 w-fit px-2.5 py-1 rounded-md">
                          <Wind className="mr-1.5 h-3.5 w-3.5" />
                          {service.durationHours} hours turnaround
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-0 pb-6 px-6">
                      <Button className="w-full font-semibold" variant="outline" onClick={() => {
                        window.location.href = '/admin/orders';
                      }}>
                        View in Dashboard
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Tabs>
      </main>
    </div>
  );
}
