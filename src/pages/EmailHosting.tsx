import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Shield, Smartphone, Calendar, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const tiers = [
  { name: 'Email Lite', price: 99, mailbox: '5 GB', accounts: '5 mailboxes' },
  { name: 'Email Pro', price: 249, mailbox: '30 GB', accounts: '25 mailboxes', popular: true },
  { name: 'Email Business', price: 499, mailbox: '100 GB', accounts: 'Unlimited mailboxes' },
];

export default function EmailHosting() {
  return (
    <AppLayout>
      <section className="py-20 text-center container mx-auto px-4">
        <Badge className="mb-4">Professional Email</Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Business Email Hosting</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Branded email at your domain — secure, ad-free, and synced across every device.
        </p>
        <Button size="lg" asChild><Link to="/checkout?amount=249&product=Email+Pro">Get Email Hosting</Link></Button>
      </section>

      <section className="container mx-auto px-4 grid md:grid-cols-4 gap-4 mb-16">
        {[
          { icon: Mail, title: 'Custom Domain', text: 'name@yourbrand.com' },
          { icon: Shield, title: 'Anti-spam', text: 'Enterprise filters' },
          { icon: Smartphone, title: 'Mobile Sync', text: 'iOS, Android, Outlook' },
          { icon: Calendar, title: 'Calendars', text: 'Shared scheduling' },
        ].map((f) => (
          <Card key={f.title}><CardContent className="pt-6 text-center">
            <f.icon className="h-10 w-10 text-primary mx-auto mb-3" />
            <div className="font-semibold">{f.title}</div>
            <p className="text-sm text-muted-foreground">{f.text}</p>
          </CardContent></Card>
        ))}
      </section>

      <section className="container mx-auto px-4 grid md:grid-cols-3 gap-6 pb-16">
        {tiers.map((t) => (
          <Card key={t.name} className={t.popular ? 'border-primary' : ''}>
            <CardHeader><CardTitle>{t.name}</CardTitle>
              <div className="text-3xl font-bold">₹{t.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex gap-2"><Check className="h-4 w-4 text-primary" />{t.mailbox} per mailbox</div>
              <div className="flex gap-2"><Check className="h-4 w-4 text-primary" />{t.accounts}</div>
              <div className="flex gap-2"><Check className="h-4 w-4 text-primary" />Webmail + IMAP/SMTP</div>
              <Button className="w-full mt-4" asChild><Link to={`/checkout?amount=${t.price}&product=${encodeURIComponent(t.name)}`}>Choose</Link></Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </AppLayout>
  );
}
