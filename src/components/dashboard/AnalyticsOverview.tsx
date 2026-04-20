import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
  Bar, BarChart,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, Users, CreditCard, Server, Activity } from 'lucide-react';

const stats = [
  { label: 'Active Users', value: 12480, icon: Users, suffix: '', delta: '+12.4%' },
  { label: 'MRR (₹)', value: 184500, icon: CreditCard, suffix: '', delta: '+8.1%', prefix: '₹' },
  { label: 'Hosting Accounts', value: 3274, icon: Server, suffix: '', delta: '+3.6%' },
  { label: 'Uptime (%)', value: 99.98, icon: Activity, suffix: '%', delta: 'SLA met', decimals: 2 },
];

const traffic = Array.from({ length: 12 }, (_, i) => ({
  m: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
  visits: 2400 + Math.round(Math.sin(i / 1.6) * 800 + Math.random() * 400),
  signups: 240 + Math.round(Math.cos(i / 2) * 80 + Math.random() * 60),
}));

const revenue = Array.from({ length: 8 }, (_, i) => ({
  w: `W${i + 1}`,
  rev: 12000 + Math.round(Math.random() * 9000),
}));

export default function AnalyticsOverview() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {s.prefix}<CountUp end={s.value} duration={1.6} decimals={s.decimals ?? 0} separator="," />{s.suffix}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-primary" />{s.delta}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Traffic Overview</CardTitle></CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={traffic}>
                <defs>
                  <linearGradient id="v" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="m" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                <Area type="monotone" dataKey="visits" stroke="hsl(var(--primary))" fill="url(#v)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Weekly Revenue</CardTitle></CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="w" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                <Bar dataKey="rev" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
