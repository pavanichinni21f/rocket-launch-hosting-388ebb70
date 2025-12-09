import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import {
  Server,
  Globe,
  Activity,
  Zap,
  Plus,
  ArrowUpRight,
  TrendingUp,
  HardDrive,
  Wifi,
  DollarSign,
  Users,
  ShoppingCart,
  BarChart3,
  Download,
  Calendar,
  Settings,
  RefreshCw,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

interface HostingAccount {
  id: string;
  name: string;
  plan: string;
  domain: string | null;
  server_location: string;
  storage_used_gb: number;
  bandwidth_used_gb: number;
  is_active: boolean;
}

interface DomainRecord {
  id: string;
  domain_name: string;
  status: string;
  expiry_date: string | null;
}

interface KPICard {
  id: string;
  title: string;
  value: string;
  change: number;
  icon: any;
  color: string;
}

interface ChartData {
  name: string;
  value?: number;
  revenue?: number;
  users?: number;
  orders?: number;
}

interface ActivityItem {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
  icon: any;
}

interface Widget {
  id: string;
  title: string;
  component: React.ReactNode;
}

export default function Dashboard() {
  const { profile } = useAuth();
  const [hostingAccounts, setHostingAccounts] = useState<HostingAccount[]>([]);
  const [domains, setDomains] = useState<DomainRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()]);
  const [startDate, endDate] = dateRange;
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Mock data for KPIs
  const kpiData: KPICard[] = [
    {
      id: 'revenue',
      title: 'Revenue',
      value: '$45,231',
      change: 12.5,
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      id: 'users',
      title: 'Users',
      value: '2,350',
      change: 8.2,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      id: 'orders',
      title: 'Orders',
      value: '1,234',
      change: -2.4,
      icon: ShoppingCart,
      color: 'text-purple-600',
    },
    {
      id: 'growth',
      title: 'Growth %',
      value: '23.5%',
      change: 5.1,
      icon: TrendingUp,
      color: 'text-orange-600',
    },
  ];

  // Mock chart data
  const lineChartData: ChartData[] = [
    { name: 'Jan', revenue: 4000, users: 2400, orders: 240 },
    { name: 'Feb', revenue: 3000, users: 1398, orders: 221 },
    { name: 'Mar', revenue: 2000, users: 9800, orders: 229 },
    { name: 'Apr', revenue: 2780, users: 3908, orders: 200 },
    { name: 'May', revenue: 1890, users: 4800, orders: 218 },
    { name: 'Jun', revenue: 2390, users: 3800, orders: 250 },
  ];

  const pieChartData: ChartData[] = [
    { name: 'Desktop', value: 400 },
    { name: 'Mobile', value: 300 },
    { name: 'Tablet', value: 200 },
    { name: 'Other', value: 100 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Mock activities
  useEffect(() => {
    const mockActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'order',
        message: 'New order placed for hosting plan',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        icon: ShoppingCart,
      },
      {
        id: '2',
        type: 'user',
        message: 'New user registered',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        icon: Users,
      },
      {
        id: '3',
        type: 'domain',
        message: 'Domain example.com renewed',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        icon: Globe,
      },
    ];
    setActivities(mockActivities);
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Dashboard Report', 20, 20);
    doc.save('dashboard-report.pdf');
  };

  const exportToCSV = () => {
    const csv = Papa.unparse(lineChartData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'dashboard-data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(lineChartData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Dashboard Data');
    XLSX.writeFile(wb, 'dashboard-data.xlsx');
  };

  useEffect(() => {
    async function fetchData() {
      const [accountsRes, domainsRes] = await Promise.all([
        supabase.from('hosting_accounts').select('*').limit(5),
        supabase.from('domains').select('*').limit(5),
      ]);

      if (accountsRes.data) setHostingAccounts(accountsRes.data);
      if (domainsRes.data) setDomains(domainsRes.data);
      setLoading(false);
    }

    fetchData();
  }, []);

  // Initialize widgets
  useEffect(() => {
    const initialWidgets: Widget[] = [
      {
        id: 'kpi-cards',
        title: 'Key Performance Indicators',
        component: (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiData.map((kpi) => (
              <Card key={kpi.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{kpi.title}</p>
                      <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className={`h-4 w-4 mr-1 ${kpi.change >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                        <span className={`text-sm ${kpi.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {kpi.change >= 0 ? '+' : ''}{kpi.change}%
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg bg-muted ${kpi.color}`}>
                      <kpi.icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ),
      },
      {
        id: 'charts',
        title: 'Analytics Charts',
        component: (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={lineChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        ),
      },
      {
        id: 'activity-feed',
        title: 'Recent Activity',
        component: (
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <activity.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ),
      },
    ];
    setWidgets(initialWidgets);
  }, [activities, kpiData, lineChartData, pieChartData]);

  const SortableWidget = ({ widget }: { widget: Widget }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({ id: widget.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-move">
        <Card className="mb-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{widget.title}</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>{widget.component}</CardContent>
        </Card>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, <span className="gradient-text-orange">{profile?.full_name?.split(' ')[0] || 'User'}</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your hosting accounts
            </p>
          </div>
          <Button className="btn-rocket" asChild>
            <Link to="/dashboard/hosting/new">
              <Plus className="h-4 w-4 mr-2" />
              New Hosting Account
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Link key={stat.title} to={stat.href}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold mt-1 capitalize">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Legacy Hosting Accounts Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Hosting Accounts</CardTitle>
              <CardDescription>Your active hosting services</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard/hosting">
                View All <ArrowUpRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : hostingAccounts.length === 0 ? (
              <div className="text-center py-12">
                <Server className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold">No hosting accounts yet</h3>
                <p className="text-muted-foreground mb-4">Create your first hosting account to get started</p>
                <Button className="btn-rocket" asChild>
                  <Link to="/dashboard/hosting/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Account
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {hostingAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Server className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{account.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {account.domain || 'No domain'} • {account.server_location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={account.is_active ? 'default' : 'secondary'} className="capitalize">
                        {account.plan}
                      </Badge>
                      <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <HardDrive className="h-4 w-4" />
                          {account.storage_used_gb}GB
                        </div>
                        <div className="flex items-center gap-1">
                          <Wifi className="h-4 w-4" />
                          {account.bandwidth_used_gb}GB
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
