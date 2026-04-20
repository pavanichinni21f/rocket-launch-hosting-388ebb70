import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const articles = [
  { cat: 'Getting Started', items: ['Account setup', 'Connect a domain', 'Install WordPress', 'Add a team member'] },
  { cat: 'Billing', items: ['Update payment method', 'Download invoice', 'Cancel subscription', 'Upgrade plan'] },
  { cat: 'Domains & DNS', items: ['Point A record', 'Configure MX records', 'Enable DNSSEC', 'Transfer a domain'] },
  { cat: 'Email', items: ['Create mailbox', 'Setup IMAP', 'SPF & DKIM', 'Email forwarding'] },
  { cat: 'Security', items: ['Enable 2FA', 'Recover account', 'SSH key access', 'Reset SSL'] },
  { cat: 'Performance', items: ['Enable CDN', 'Object caching', 'Image optimization', 'Database tuning'] },
];

export default function KnowledgeBase() {
  const [q, setQ] = useState('');
  const filtered = articles
    .map((g) => ({ ...g, items: g.items.filter((i) => i.toLowerCase().includes(q.toLowerCase())) }))
    .filter((g) => g.items.length);

  return (
    <AppLayout>
      <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold mb-3">Knowledge Base</h1>
          <p className="text-muted-foreground mb-6">Search hundreds of guides written by our engineers.</p>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search guides..." className="pl-9 h-12" />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((g) => (
          <Card key={g.cat}>
            <CardContent className="pt-6">
              <Badge className="mb-3">{g.cat}</Badge>
              <ul className="space-y-2">
                {g.items.map((i) => (
                  <li key={i}><Link to="/support" className="text-sm hover:text-primary transition-colors">→ {i}</Link></li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
        {!filtered.length && <p className="col-span-full text-center text-muted-foreground py-8">No articles match "{q}"</p>}
      </section>
    </AppLayout>
  );
}
