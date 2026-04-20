import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, ArrowRight } from 'lucide-react';

const jobs = [
  { title: 'Senior Backend Engineer', team: 'Platform', location: 'Bangalore / Remote', type: 'Full-time' },
  { title: 'Product Designer', team: 'Design', location: 'Remote (India)', type: 'Full-time' },
  { title: 'DevOps SRE', team: 'Infrastructure', location: 'Bangalore', type: 'Full-time' },
  { title: 'Customer Success Manager', team: 'Support', location: 'Remote', type: 'Full-time' },
  { title: 'Content Marketer', team: 'Marketing', location: 'Remote', type: 'Contract' },
  { title: 'Frontend Engineer (React)', team: 'Platform', location: 'Bangalore / Remote', type: 'Full-time' },
];

export default function Careers() {
  return (
    <AppLayout>
      <section className="py-16 text-center container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-3">Build the future of hosting with us</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">We're a remote-first team building infrastructure trusted by thousands. Competitive pay, real impact.</p>
      </section>

      <section className="container mx-auto px-4 pb-16 max-w-3xl space-y-3">
        {jobs.map((j) => (
          <Card key={j.title}>
            <CardContent className="pt-6 flex flex-wrap items-center gap-3 justify-between">
              <div>
                <div className="font-semibold">{j.title}</div>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1">
                  <Badge variant="secondary">{j.team}</Badge>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{j.location}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{j.type}</span>
                </div>
              </div>
              <Button variant="outline" size="sm">Apply <ArrowRight className="ml-1 h-3 w-3" /></Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </AppLayout>
  );
}
