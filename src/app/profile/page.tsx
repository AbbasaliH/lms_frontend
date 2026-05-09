'use client';

import { useCustomerProfile } from '@/lib/hooks/use-customers';
import { ProfileEditor } from '@/components/customers/profile-editor';
import { LoyaltyDashboard } from '@/components/customers/loyalty-dashboard';
import { SupportTicketsList } from '@/components/customers/support-tickets-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuthStore } from '@/lib/store/auth-store';
import { Loader2, User, Star, MessageSquare } from 'lucide-react';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const { data, isLoading, isError } = useCustomerProfile(user?.id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Handle case where user is not a customer or profile not found
  if (isError || !(data as any)?.data?.customer) {
    return (
      <div className="container max-w-4xl py-10">
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
            <CardDescription>We couldn't find a customer profile associated with your account. Please contact support.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const customer = (data as any).data.customer;

  return (
    <div className="container max-w-5xl py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
        <p className="text-muted-foreground mt-1">
          Manage your profile, track loyalty points, and view support tickets.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-12 items-center">
          <TabsTrigger value="profile" className="h-10">
            <User className="w-4 h-4 mr-2" />
            Profile Details
          </TabsTrigger>
          <TabsTrigger value="loyalty" className="h-10">
            <Star className="w-4 h-4 mr-2" />
            Loyalty & Rewards
          </TabsTrigger>
          <TabsTrigger value="support" className="h-10">
            <MessageSquare className="w-4 h-4 mr-2" />
            Support Tickets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your contact info and preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-6 border-b">
                <div>
                  <div className="text-sm text-muted-foreground">Name</div>
                  <div className="font-medium">{customer.user?.fullName}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium">{customer.user?.email}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Phone Number</div>
                  <div className="font-medium">{customer.user?.phoneNumber}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Customer ID</div>
                  <div className="font-medium text-muted-foreground">{customer.customerCode}</div>
                </div>
              </div>
              
              <ProfileEditor customer={customer} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loyalty">
          <LoyaltyDashboard customer={customer} />
        </TabsContent>

        <TabsContent value="support">
          <SupportTicketsList customerId={customer.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
