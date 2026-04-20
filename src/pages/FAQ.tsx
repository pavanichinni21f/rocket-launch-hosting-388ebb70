import AppLayout from '@/components/layout/AppLayout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  { q: 'How quickly is my hosting account provisioned?', a: 'Instantly — your control panel is ready within 60 seconds of payment confirmation.' },
  { q: 'Do you offer a money-back guarantee?', a: 'Yes — 30-day money-back guarantee on all hosting plans, no questions asked.' },
  { q: 'Which payment methods are accepted?', a: 'UPI, Google Pay, PayU (cards & netbanking). All processed via secure Indian gateways.' },
  { q: 'Can I migrate my existing website for free?', a: 'Absolutely. Our migration team handles the entire move within 24 hours at no cost.' },
  { q: 'Is SSL really free?', a: 'Yes. Auto-renewing Let\'s Encrypt SSL is included on every plan, including the free tier.' },
  { q: 'Do you support WordPress, Laravel, and Node.js?', a: 'All three plus Python, Ruby, Go, and static sites. One-click installers available.' },
  { q: 'Where are your data centers located?', a: 'Mumbai, Bangalore, Singapore, Frankfurt, and Dallas — pick the one closest to your audience.' },
  { q: 'How do I contact support?', a: '24/7 live chat in-dashboard, email at support@ksfoundation.com, or open a ticket.' },
  { q: 'Can I upgrade or downgrade later?', a: 'Anytime. Pro-rated billing means you only pay for what you use.' },
  { q: 'Do you offer GST invoices?', a: 'Yes — full GST-compliant invoices are auto-generated for every payment.' },
];

export default function FAQ() {
  const [q, setQ] = useState('');
  const filtered = faqs.filter((f) => f.q.toLowerCase().includes(q.toLowerCase()));
  return (
    <AppLayout>
      <section className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold text-center mb-3">Frequently Asked Questions</h1>
        <p className="text-center text-muted-foreground mb-8">Everything you need to know about KSFoundation Hosting.</p>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search FAQs..." className="pl-9 h-11" />
        </div>
        <Accordion type="single" collapsible className="space-y-2">
          {filtered.map((f, i) => (
            <AccordionItem key={i} value={`f${i}`} className="border rounded-lg px-4">
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </AppLayout>
  );
}
