'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useSuperAdminSettings, useUpdateSuperAdminSetting } from '@/lib/hooks/use-admin';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function SuperAdminSettingsPage() {
  const { data: settingsData, isLoading, isError } = useSuperAdminSettings();
  const updateMutation = useUpdateSuperAdminSetting();

  const settings = (settingsData as any)?.data || {};

  const [form, setForm] = useState({
    platformName: '',
    supportEmail: '',
    commissionRate: '',
    newShopRegistrations: true,
    subscriptionSystem: true,
    maintenanceMode: false,
  });

  useEffect(() => {
    if ((settingsData as any)?.data) {
      const s = (settingsData as any).data;
      setForm({
        platformName: s.platformName ?? s.platform_name ?? 'LaundryPro',
        supportEmail: s.supportEmail ?? s.support_email ?? 'support@laundrypro.com',
        commissionRate: String(s.commissionRate ?? s.commission_rate ?? 15),
        newShopRegistrations: s.newShopRegistrations ?? s.new_shop_registrations ?? true,
        subscriptionSystem: s.subscriptionSystem ?? s.subscription_system ?? true,
        maintenanceMode: s.maintenanceMode ?? s.maintenance_mode ?? false,
      });
    }
  }, [settingsData]);

  const handleSave = async () => {
    const keys = [
      { key: 'platformName', value: form.platformName },
      { key: 'supportEmail', value: form.supportEmail },
      { key: 'commissionRate', value: Number(form.commissionRate) },
      { key: 'newShopRegistrations', value: form.newShopRegistrations },
      { key: 'subscriptionSystem', value: form.subscriptionSystem },
      { key: 'maintenanceMode', value: form.maintenanceMode },
    ];

    try {
      await Promise.all(
        keys.map(({ key, value }) =>
          updateMutation.mutateAsync({ key, data: { value } })
        )
      );
      toast.success('All settings saved successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save some settings');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Failed to load settings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Platform-wide settings and configurations
        </p>
      </div>

      <div className="grid gap-6">
        {/* Platform Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Settings</CardTitle>
            <CardDescription>Global platform configurations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="platformName">Platform Name</Label>
              <Input
                id="platformName"
                value={form.platformName}
                onChange={(e) => setForm({ ...form, platformName: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={form.supportEmail}
                onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="commissionRate">Commission Rate (%)</Label>
              <Input
                id="commissionRate"
                type="number"
                value={form.commissionRate}
                onChange={(e) => setForm({ ...form, commissionRate: e.target.value })}
              />
            </div>
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Feature Toggles */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Toggles</CardTitle>
            <CardDescription>Enable or disable platform features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Shop Registrations</Label>
                <p className="text-sm text-muted-foreground">Allow new shops to register</p>
              </div>
              <Switch
                checked={form.newShopRegistrations}
                onCheckedChange={(checked) => setForm({ ...form, newShopRegistrations: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Subscription System</Label>
                <p className="text-sm text-muted-foreground">Enable subscription features</p>
              </div>
              <Switch
                checked={form.subscriptionSystem}
                onCheckedChange={(checked) => setForm({ ...form, subscriptionSystem: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Put platform in maintenance mode</p>
              </div>
              <Switch
                checked={form.maintenanceMode}
                onCheckedChange={(checked) => setForm({ ...form, maintenanceMode: checked })}
              />
            </div>
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
