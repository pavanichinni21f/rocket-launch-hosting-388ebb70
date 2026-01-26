import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Users, ShoppingCart, Server, Ticket, Activity, BarChart3, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminOverview from '@/components/admin/AdminOverview';
import UserManagement from '@/components/admin/UserManagement';
import OrdersManagement from '@/components/admin/OrdersManagement';
import HostingManagement from '@/components/admin/HostingManagement';
import TicketsManagement from '@/components/admin/TicketsManagement';
import SystemLogs from '@/components/admin/SystemLogs';

export default function Admin() {
  const { user, profile, hasRole } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user has admin role
    if (!user) {
      setIsAuthorized(false);
      return;
    }

    // Verify admin role
    const isAdmin = hasRole('admin') || hasRole('owner');
    setIsAuthorized(isAdmin);

    if (!isAdmin) {
      // Redirect non-admin users
      const redirectTimer = setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 3000);
      return () => clearTimeout(redirectTimer);
    }
  }, [user, hasRole, navigate]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'hosting', label: 'Hosting', icon: Server },
    { id: 'tickets', label: 'Tickets', icon: Ticket },
    { id: 'logs', label: 'Logs', icon: Activity },
  ];

  // Authorization check
  if (isAuthorized === null) {
    return (
      <DashboardLayout>
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Verifying permissions...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isAuthorized) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-bold">Access Denied - Admin Only</p>
                <p>You do not have permission to access the admin dashboard. Only administrators and owners can view this page.</p>
                <p className="text-sm">Redirecting to dashboard in 3 seconds...</p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                  className="mt-4"
                >
                  Go to Dashboard Now
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Manage users, orders, hosting accounts, and system settings
            </p>
          </div>
        </div>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Admin Session</CardTitle>
            <CardDescription>
              Logged in as: {profile?.email || user?.email || 'Unknown'} (Admin)
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/50 p-1 h-auto flex-wrap">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 data-[state=active]:bg-background"
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <AdminOverview />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <OrdersManagement />
          </TabsContent>

          <TabsContent value="hosting" className="mt-6">
            <HostingManagement />
          </TabsContent>

          <TabsContent value="tickets" className="mt-6">
            <TicketsManagement />
          </TabsContent>

          <TabsContent value="logs" className="mt-6">
            <SystemLogs />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
