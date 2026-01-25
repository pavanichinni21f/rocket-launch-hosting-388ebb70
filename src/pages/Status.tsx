import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Clock, Server, Database, Globe, Shield, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const services = [
  { name: 'Web Hosting', status: 'operational', uptime: 99.99, icon: Server },
  { name: 'Database Servers', status: 'operational', uptime: 99.98, icon: Database },
  { name: 'CDN Network', status: 'operational', uptime: 99.99, icon: Globe },
  { name: 'DNS Services', status: 'operational', uptime: 100, icon: Globe },
  { name: 'SSL Services', status: 'operational', uptime: 99.99, icon: Shield },
  { name: 'Email Services', status: 'operational', uptime: 99.95, icon: Mail },
];

const incidents = [
  {
    date: '2024-01-10',
    title: 'Scheduled Maintenance',
    description: 'Completed database optimization for improved performance.',
    status: 'resolved',
  },
  {
    date: '2024-01-05',
    title: 'CDN Edge Update',
    description: 'Rolling update to edge servers for new security patches.',
    status: 'resolved',
  },
];

const uptimeHistory = [
  { day: 'Mon', uptime: 100 },
  { day: 'Tue', uptime: 100 },
  { day: 'Wed', uptime: 99.98 },
  { day: 'Thu', uptime: 100 },
  { day: 'Fri', uptime: 100 },
  { day: 'Sat', uptime: 100 },
  { day: 'Sun', uptime: 100 },
];

export default function Status() {
  const allOperational = services.every(s => s.status === 'operational');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="container mx-auto px-4 text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4">
              System Status
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Service <span className="gradient-text-orange">Status</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real-time status of all KSFoundation services and infrastructure.
            </p>
          </motion.div>
        </section>

        {/* Overall Status */}
        <section className="container mx-auto px-4 mb-12">
          <Card className={`max-w-4xl mx-auto ${allOperational ? 'border-green-500' : 'border-yellow-500'}`}>
            <CardContent className="py-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                {allOperational ? (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                ) : (
                  <AlertCircle className="h-8 w-8 text-yellow-500" />
                )}
                <h2 className="text-2xl font-bold">
                  {allOperational ? 'All Systems Operational' : 'Some Systems Degraded'}
                </h2>
              </div>
              <p className="text-muted-foreground">
                Last updated: {new Date().toLocaleString('en-IN')}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Services */}
        <section className="container mx-auto px-4 mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-6">Services</h2>
            <div className="space-y-4">
              {services.map((service, index) => (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <service.icon className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">{service.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">
                            {service.uptime}% uptime
                          </span>
                          <Badge 
                            variant={service.status === 'operational' ? 'default' : 'secondary'}
                            className={service.status === 'operational' ? 'bg-green-500' : 'bg-yellow-500'}
                          >
                            {service.status === 'operational' ? 'Operational' : 'Degraded'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Uptime History */}
        <section className="container mx-auto px-4 mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-6">7-Day Uptime History</h2>
            <Card>
              <CardContent className="py-6">
                <div className="flex justify-between items-end h-32 gap-2">
                  {uptimeHistory.map((day, index) => (
                    <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                      <div 
                        className="w-full bg-green-500 rounded-t"
                        style={{ height: `${(day.uptime - 99) * 100}%`, minHeight: '10%' }}
                      />
                      <span className="text-xs text-muted-foreground">{day.day}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                  <span>Average: 99.99% uptime</span>
                  <span>Last 7 days</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Recent Incidents */}
        <section className="container mx-auto px-4 mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-6">Recent Incidents</h2>
            <div className="space-y-4">
              {incidents.map((incident, index) => (
                <motion.div
                  key={incident.date}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{incident.title}</h3>
                            <Badge variant="outline" className="text-green-600">
                              {incident.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{incident.description}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(incident.date).toLocaleDateString('en-IN')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Subscribe */}
        <section className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-orange-500/10 border-primary/20">
            <CardContent className="py-12 text-center">
              <h2 className="text-2xl font-bold mb-4">Get Status Updates</h2>
              <p className="text-muted-foreground mb-6">
                Subscribe to receive notifications about service status and maintenance windows.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg border bg-background"
                />
                <Badge className="px-6 py-2 cursor-pointer hover:opacity-90">Subscribe</Badge>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
