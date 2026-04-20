import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, ShieldCheck, Globe, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const certs = [
  { name: 'Domain Validation (DV)', price: 0, desc: 'Free auto-renewing SSL via Let\'s Encrypt', best: 'Personal sites & blogs' },
  { name: 'Organization Validation (OV)', price: 1999, desc: 'Verified business identity', best: 'Business websites', popular: true },
  { name: 'Extended Validation (EV)', price: 4999, desc: 'Highest trust, green-bar legacy', best: 'E-commerce & banking' },
  { name: 'Wildcard SSL', price: 3499, desc: 'Cover unlimited subdomains', best: 'SaaS & multi-tenant apps' },
];

export default function SSL() {
  return (
    <AppLayout>
      <section className="py-20 text-center container mx-auto px-4">
        <Badge className="mb-4"><Lock className="h-3 w-3 mr-1" />HTTPS by default</Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">SSL Certificates</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Encrypt every byte. Boost SEO. Earn customer trust with industry-trusted certificates.
        </p>
      </section>

      <section className="container mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-4 gap-5 pb-16">
        {certs.map((c) => (
          <Card key={c.name} className={c.popular ? 'border-primary shadow-lg' : ''}>
            <CardHeader>
              <ShieldCheck className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">{c.name}</CardTitle>
              <div className="text-2xl font-bold">{c.price === 0 ? 'Free' : `₹${c.price}/yr`}</div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">{c.desc}</p>
              <div className="flex items-center gap-1 text-xs"><Globe className="h-3 w-3" />Best for: {c.best}</div>
              <Button className="w-full mt-3" asChild>
                <Link to={c.price === 0 ? '/dashboard' : `/checkout?amount=${c.price}&product=${encodeURIComponent(c.name)}`}>
                  {c.price === 0 ? 'Activate Free' : 'Get Certificate'}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">Why SSL matters</h2>
          <ul className="space-y-2">
            {['Boosts Google search rankings', 'Required for PCI compliance', 'Prevents man-in-the-middle attacks', 'Required for HTTP/2 and HTTP/3'].map((x) => (
              <li key={x} className="flex gap-2"><Check className="h-5 w-5 text-primary" />{x}</li>
            ))}
          </ul>
        </div>
      </section>
    </AppLayout>
  );
}
