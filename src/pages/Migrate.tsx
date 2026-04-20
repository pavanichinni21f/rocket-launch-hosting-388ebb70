import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Check, Move } from 'lucide-react';
import { toast } from 'sonner';

export default function Migrate() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Migration request received. Our team will reach out within 24 hours.');
  };

  return (
    <AppLayout>
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Free Website Migration</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Move from any host to KSFoundation in under 24 hours. Zero downtime. Zero cost. Handled by experts.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">How it works</h2>
          {[
            'Submit your current hosting details below',
            'Our team verifies access and creates a migration plan',
            'We move files, databases, emails, and DNS',
            'You verify staging — we go live with TTL switch',
          ].map((s, i) => (
            <div key={s} className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center font-semibold">{i + 1}</div>
              <p className="pt-1">{s}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader><CardTitle><Move className="h-5 w-5 inline mr-2" />Request Migration</CardTitle></CardHeader>
          <CardContent>
            {submitted ? (
              <div className="text-center py-8 space-y-2">
                <div className="h-14 w-14 mx-auto rounded-full bg-primary/10 grid place-items-center"><Check className="h-7 w-7 text-primary" /></div>
                <h3 className="font-bold">Request received!</h3>
                <p className="text-sm text-muted-foreground">We'll email you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-3">
                <div><Label>Your name</Label><Input required /></div>
                <div><Label>Email</Label><Input type="email" required /></div>
                <div><Label>Current host</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {['GoDaddy', 'Bluehost', 'Hostinger', 'SiteGround', 'AWS', 'Other'].map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Website URL</Label><Input type="url" placeholder="https://" required /></div>
                <div><Label>Notes</Label><Textarea rows={3} /></div>
                <Button type="submit" className="w-full">Submit <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </form>
            )}
          </CardContent>
        </Card>
      </section>
    </AppLayout>
  );
}
