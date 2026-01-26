import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { CreditCard, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Order {
  id: string;
  user_id: string;
  plan: string;
  amount_cents: number;
  currency: string | null;
  status: string | null;
  billing_cycle: string | null;
  created_at: string | null;
  paid_at: string | null;
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(search.toLowerCase()) ||
    order.plan.toLowerCase().includes(search.toLowerCase()) ||
    order.status?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'paid': return 'bg-green-500/10 text-green-600';
      case 'pending': return 'bg-yellow-500/10 text-yellow-600';
      case 'failed': return 'bg-red-500/10 text-red-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatAmount = (cents: number, currency: string | null) => {
    const amount = cents / 100;
    if (currency === 'INR') return `₹${amount.toLocaleString('en-IN')}`;
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Orders ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Billing</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Paid At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">
                      {order.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {order.plan}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatAmount(order.amount_cents, order.currency)}
                    </TableCell>
                    <TableCell className="capitalize">
                      {order.billing_cycle || 'monthly'}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status || 'unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>
                      {order.paid_at ? new Date(order.paid_at).toLocaleDateString() : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
