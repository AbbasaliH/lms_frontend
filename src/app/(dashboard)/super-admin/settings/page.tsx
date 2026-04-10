'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

export default function SuperAdminSettingsPage() {
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
              <Input id="platformName" defaultValue="LaundryPro" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input id="supportEmail" type="email" defaultValue="support@laundrypro.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="commissionRate">Commission Rate (%)</Label>
              <Input id="commissionRate" type="number" defaultValue="15" />
            </div>
            <Button>Save Changes</Button>
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
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Subscription System</Label>
                <p className="text-sm text-muted-foreground">Enable subscription features</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Put platform in maintenance mode</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}