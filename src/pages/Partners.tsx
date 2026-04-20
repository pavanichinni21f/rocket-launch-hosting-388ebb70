import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Handshake } from 'lucide-react';

const partners = [
  { name: 'CloudFlare', tier: 'Strategic' },
  { name: 'Let\'s Encrypt', tier: 'Infrastructure' },
  { name: 'WordPress.org', tier: 'Technology' },
  { name: 'cPanel', tier: 'Technology' },
  { name: 'CodeGuard', tier: 'Backup' },
  { name: 'SiteLock', tier: 'Security' },
  { name: 'Razorpay', tier: 'Payments' },
  { name: 'Google Cloud', tier: 'Infrastructure' },
];

const press = [
  { source: 'YourStory', date: 'Mar 2025', headline: 'KSFoundation crosses 25k customers with India-first hosting' },
  { source: 'Inc42', date: 'Jan 2025', headline: 'Bangalore startup challenges global hosts with UPI-native checkout' },
  { source: 'TechCrunch India', date: 'Nov 2024', headline: 'KSFoundation launches edge network spanning 12 Indian cities' },
];

export default function Partners() {
  return (
    <AppLayout>
      <section className="py-16 text-center container mx-auto px-4">
        <Handshake className="h-12 w-12 mx-auto text-primary mb-3" />
        <h1 className="text-4xl font-bold mb-3">Partners & Press</h1>
        <p className="text-muted-foreground">Trusted by global infrastructure leaders. Featured in leading publications.</p>
      </section>

      <section className="container mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Award className="h-5 w-5" />Our Partners</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {partners.map((p) => (
            <Card key={p.name}><CardContent className="pt-6 text-center">
              <div className="font-semibold">{p.name}</div>
              <Badge variant="outline" className="mt-2 text-xs">{p.tier}</Badge>
            </CardContent></Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold mb-4">In the Press</h2>
        <div className="space-y-3">
          {press.map((p) => (
            <Card key={p.headline}><CardContent className="pt-6">
              <div className="flex flex-wrap justify-between items-start gap-2">
                <div className="font-medium">{p.headline}</div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">{p.source} · {p.date}</div>
              </div>
            </CardContent></Card>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
