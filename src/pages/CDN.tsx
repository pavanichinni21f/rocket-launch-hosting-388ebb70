import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe2, Zap, Shield, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const pops = ['Mumbai', 'Bangalore', 'Singapore', 'Tokyo', 'Frankfurt', 'Amsterdam', 'New York', 'Dallas', 'São Paulo', 'Sydney', 'Dubai', 'London'];

export default function CDN() {
  return (
    <AppLayout>
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background text-center">
        <div className="container mx-auto px-4">
          <Badge className="mb-4">200+ Edge Locations</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Global CDN</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Cache static assets at the edge. Cut load times by 60%+ and absorb traffic spikes effortlessly.
          </p>
          <Button size="lg" asChild><Link to="/checkout?amount=499&product=CDN+Plan">Enable CDN — ₹499/mo</Link></Button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 grid md:grid-cols-4 gap-4">
        {[
          { icon: Zap, t: 'Sub-50ms TTFB', d: 'Globally' },
          { icon: Shield, t: 'DDoS Mitigation', d: 'L3/L4/L7 included' },
          { icon: Globe2, t: '12+ POPs in India', d: 'India-first delivery' },
          { icon: BarChart3, t: 'Real-time analytics', d: 'Per-asset cache hit rate' },
        ].map((x) => (
          <Card key={x.t}><CardContent className="pt-6 text-center">
            <x.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="font-semibold">{x.t}</div>
            <p className="text-sm text-muted-foreground">{x.d}</p>
          </CardContent></Card>
        ))}
      </section>

      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold mb-4 text-center">Edge Network</h2>
        <div className="flex flex-wrap justify-center gap-2">
          {pops.map((p) => <Badge key={p} variant="outline" className="text-sm py-1.5 px-3">{p}</Badge>)}
        </div>
      </section>
    </AppLayout>
  );
}
