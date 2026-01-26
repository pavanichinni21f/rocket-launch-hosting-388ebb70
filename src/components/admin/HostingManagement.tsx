import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Server, Globe, HardDrive } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface HostingAccount {
  id: string;
  name: string;
  owner_id: string;
  domain: string | null;
  plan: string | null;
  is_active: boolean | null;
  storage_used_gb: number | null;
  bandwidth_used_gb: number | null;
  server_location: string | null;
  created_at: string | null;
}

export default function HostingManagement() {
  const [accounts, setAccounts] = useState<HostingAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const { data, error } = await supabase
          .from('hosting_accounts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAccounts(data || []);
      } catch (error) {
        console.error('Error fetching hosting accounts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAccounts();
  }, []);

  const getPlanLimits = (plan: string | null) => {
    switch (plan) {
      case 'starter': return { storage: 10, bandwidth: 100 };
      case 'business': return { storage: 50, bandwidth: 500 };
      case 'enterprise': return { storage: 200, bandwidth: 2000 };
      default: return { storage: 5, bandwidth: 50 };
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Hosting Accounts ({accounts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Storage</TableHead>
                  <TableHead>Bandwidth</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => {
                  const limits = getPlanLimits(account.plan);
                  const storagePercent = ((account.storage_used_gb || 0) / limits.storage) * 100;
                  const bandwidthPercent = ((account.bandwidth_used_gb || 0) / limits.bandwidth) * 100;

                  return (
                    <TableRow key={account.id}>
                      <TableCell>
                        <div className="font-medium">{account.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {account.id.slice(0, 8)}...
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          <span className="text-sm">{account.domain || 'Not set'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {account.plan || 'free'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="w-24">
                          <div className="flex items-center gap-1 text-xs mb-1">
                            <HardDrive className="h-3 w-3" />
                            {account.storage_used_gb?.toFixed(1) || 0}/{limits.storage} GB
                          </div>
                          <Progress value={storagePercent} className="h-1" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="w-24">
                          <div className="text-xs mb-1">
                            {account.bandwidth_used_gb?.toFixed(1) || 0}/{limits.bandwidth} GB
                          </div>
                          <Progress value={bandwidthPercent} className="h-1" />
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {account.server_location || 'us-east'}
                      </TableCell>
                      <TableCell>
                        <Badge className={account.is_active ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}>
                          {account.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
