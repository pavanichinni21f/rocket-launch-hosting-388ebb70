import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Server, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const plans = [
  { name: 'Starter Reseller', price: 1499, accounts: 25, storage: '50 GB', bandwidth: '500 GB' },
  { name: 'Pro Reseller', price: 2999, accounts: 100, storage: '200 GB', bandwidth: '2 TB', popular: true },
  { name: 'Enterprise Reseller', price: 5999, accounts: 'Unlimited', storage: '1 TB', bandwidth: '10 TB' },
];

const features = [
  'White-label control panel (WHM/cPanel)',
  'Free SSL for all client accounts',
  'Automated billing & invoicing',
  'Per-account resource limits',
  '24/7 priority technical support',
  'Free migration from other hosts',
];

export default function Resellers() {
  return (
    <AppLayout>
      <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <Badge className="mb-4">For Agencies & Freelancers</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Reseller Hosting</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Launch your own hosting brand. Manage unlimited clients with white-label tools, automated billing, and enterprise infrastructure.
          </p>
          <div className="flex justify-center gap-3">
            <Button size="lg" asChild><Link to="/checkout?amount=2999&product=Pro+Reseller">Start Reselling</Link></Button>
            <Button size="lg" variant="outline" asChild><Link to="/contact">Talk to Sales</Link></Button>
          </div>
        </div>
      </section>

      <section className="py-16 container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className={p.popular ? 'border-primary shadow-lg relative' : ''}>
                {p.popular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>}
                <CardHeader>
                  <CardTitle>{p.name}</CardTitle>
                  <div className="text-3xl font-bold">₹{p.price.toLocaleString('en-IN')}<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm"><Users className="h-4 w-4 text-primary" />{p.accounts} client accounts</div>
                  <div className="flex items-center gap-2 text-sm"><Server className="h-4 w-4 text-primary" />{p.storage} SSD storage</div>
                  <div className="flex items-center gap-2 text-sm"><TrendingUp className="h-4 w-4 text-primary" />{p.bandwidth} bandwidth</div>
                  <Button className="w-full mt-4" asChild>
                    <Link to={`/checkout?amount=${p.price}&product=${encodeURIComponent(p.name)}`}>Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-8">Everything you need to scale</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-2"><Check className="h-5 w-5 text-primary shrink-0" /><span>{f}</span></div>
            ))}
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
