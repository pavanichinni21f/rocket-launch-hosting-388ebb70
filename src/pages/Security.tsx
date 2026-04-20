import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Eye, AlertTriangle, FileCheck, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  { icon: Shield, t: 'Web Application Firewall', d: 'Blocks OWASP Top 10 attacks in real time.' },
  { icon: Lock, t: 'DDoS Protection', d: 'Always-on mitigation up to 10 Tbps capacity.' },
  { icon: Eye, t: '24/7 SOC Monitoring', d: 'Human + ML threat hunting around the clock.' },
  { icon: AlertTriangle, t: 'Malware Scanning', d: 'Daily scans with one-click cleanup.' },
  { icon: FileCheck, t: 'Compliance Ready', d: 'PCI DSS, ISO 27001, SOC 2, GDPR aligned.' },
  { icon: Activity, t: 'Audit Logs', d: 'Tamper-evident logs retained 12 months.' },
];

export default function Security() {
  return (
    <AppLayout>
      <section className="py-20 text-center container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Security First</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          Defense-in-depth across network, application, and data layers — included on every plan.
        </p>
        <Button size="lg" asChild><Link to="/contact">Request Security Audit</Link></Button>
      </section>

      <section className="container mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-3 gap-5 pb-16">
        {features.map((f) => (
          <Card key={f.t}>
            <CardHeader>
              <f.icon className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">{f.t}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{f.d}</CardContent>
          </Card>
        ))}
      </section>
    </AppLayout>
  );
}
