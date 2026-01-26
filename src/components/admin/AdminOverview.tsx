import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Users, CreditCard, Server, Ticket, TrendingUp, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  activeHosting: number;
  openTickets: number;
  recentActivity: number;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          { count: userCount },
          { data: orders },
          { count: hostingCount },
          { count: ticketCount },
          { count: activityCount }
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('orders').select('amount_cents, status'),
          supabase.from('hosting_accounts').select('*', { count: 'exact', head: true }).eq('is_active', true),
          supabase.from('support_tickets').select('*', { count: 'exact', head: true }).eq('status', 'open'),
          supabase.from('activity_log').select('*', { count: 'exact', head: true })
        ]);

        const paidOrders = orders?.filter(o => o.status === 'paid') || [];
        const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.amount_cents || 0), 0) / 100;

        setStats({
          totalUsers: userCount || 0,
          totalOrders: orders?.length || 0,
          totalRevenue,
          activeHosting: hostingCount || 0,
          openTickets: ticketCount || 0,
          recentActivity: activityCount || 0
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Users', value: stats?.totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Total Orders', value: stats?.totalOrders, icon: CreditCard, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Revenue (₹)', value: stats?.totalRevenue?.toLocaleString('en-IN'), icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: 'Active Hosting', value: stats?.activeHosting, icon: Server, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Open Tickets', value: stats?.openTickets, icon: Ticket, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { title: 'Activity Logs', value: stats?.recentActivity, icon: Activity, color: 'text-pink-500', bg: 'bg-pink-500/10' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">{stat.value ?? 0}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left px-4 py-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              📧 Send bulk notification
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              🔄 Sync payment status
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              📊 Export user data
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              🛡️ Run security audit
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current platform health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: 'API Gateway', status: 'operational' },
              { name: 'Database', status: 'operational' },
              { name: 'Payment Gateway', status: 'operational' },
              { name: 'Email Service', status: 'operational' },
              { name: 'CDN', status: 'operational' }
            ].map((service) => (
              <div key={service.name} className="flex items-center justify-between">
                <span className="text-sm">{service.name}</span>
                <span className="flex items-center gap-2 text-sm">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-green-600 dark:text-green-400">Operational</span>
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
