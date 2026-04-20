import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const items = [
  { name: 'Aanya Sharma', role: 'Founder, Bloom Labs', text: 'Migrated from AWS in a weekend. Page loads dropped from 2.4s to 380ms.', stars: 5 },
  { name: 'Rohan Mehta', role: 'CTO, ShopFlex', text: 'Best UPI checkout flow I\'ve seen on a hosting platform. Truly built for India.', stars: 5 },
  { name: 'Priya Nair', role: 'Designer, Studio Mint', text: 'Dashboard is a joy to use. Felt like 21st.dev meets cPanel.', stars: 5 },
  { name: 'Karthik Iyer', role: 'Engineer, FinPulse', text: 'Their support team fixed my Nginx config in 7 minutes via chat. Unmatched.', stars: 5 },
  { name: 'Saanvi Rao', role: 'CEO, Verdant', text: 'WordPress with 99.99% uptime for 14 months running. Zero downtime billing.', stars: 5 },
  { name: 'Aditya Verma', role: 'Lead Dev, ZapKart', text: 'Auto-scaling kicked in during Diwali traffic spike. Site never blinked.', stars: 5 },
];

export default function Testimonials() {
  return (
    <AppLayout>
      <section className="py-16 text-center container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-3">What our customers say</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">Loved by 25,000+ developers, agencies, and businesses across India.</p>
      </section>

      <section className="container mx-auto px-4 pb-16 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((t, i) => (
          <motion.div key={t.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className="h-full">
              <CardContent className="pt-6 space-y-3">
                <div className="flex">{Array.from({ length: t.stars }).map((_, j) => <Star key={j} className="h-4 w-4 fill-primary text-primary" />)}</div>
                <p className="text-sm">"{t.text}"</p>
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Avatar className="h-9 w-9"><AvatarFallback>{t.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback></Avatar>
                  <div><div className="font-semibold text-sm">{t.name}</div><div className="text-xs text-muted-foreground">{t.role}</div></div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>
    </AppLayout>
  );
}
