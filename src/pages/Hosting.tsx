import { motion } from 'framer-motion';
import { Check, Zap, Shield, Headphones, ArrowRight, Server, Cloud, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const hostingTypes = [
  {
    title: 'Shared Hosting',
    icon: Server,
    description: 'Perfect for personal websites and small businesses',
    price: 999,
    features: [
      'Up to 10 Websites',
      '50 GB SSD Storage',
      'Free SSL Certificate',
      'Daily Backups',
      'cPanel Access',
      '24/7 Support',
    ],
    href: '/pricing',
    popular: false,
  },
  {
    title: 'Cloud Hosting',
    icon: Cloud,
    description: 'Scalable resources for growing businesses',
    price: 2499,
    features: [
      'Unlimited Websites',
      '100 GB NVMe Storage',
      'Auto-scaling Resources',
      'Load Balancing',
      'Staging Environment',
      'Priority Support',
    ],
    href: '/cloud',
    popular: true,
  },
  {
    title: 'VPS Hosting',
    icon: Cpu,
    description: 'Full control with dedicated resources',
    price: 4999,
    features: [
      'Dedicated vCPU Cores',
      '200 GB NVMe Storage',
      'Root Access',
      'Custom OS Options',
      'DDoS Protection',
      '24/7 Expert Support',
    ],
    href: '/vps',
    popular: false,
  },
];

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'NVMe SSDs and global CDN for sub-200ms load times',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'DDoS protection, firewalls, and automated malware scanning',
  },
  {
    icon: Headphones,
    title: '24/7 Expert Support',
    description: 'Real humans ready to help via chat, email, or phone',
  },
];

export default function Hosting() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="container mx-auto px-4 text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4">
              Web Hosting Solutions
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful <span className="gradient-text-orange">Hosting</span> for Every Need
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              From personal blogs to enterprise applications, we have the perfect hosting solution for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pricing">
                <Button size="lg" className="btn-rocket">
                  View All Plans <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline">Talk to Sales</Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Hosting Types */}
        <section className="container mx-auto px-4 mb-20">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {hostingTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`relative h-full ${type.popular ? 'border-2 border-primary shadow-xl shadow-primary/20' : ''}`}>
                  {type.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <type.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{type.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-center mb-6">
                      <span className="text-sm text-muted-foreground">Starting at</span>
                      <div className="text-3xl font-bold">
                        ₹{type.price}<span className="text-sm font-normal text-muted-foreground">/mo</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-3 mb-6">
                      {type.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link to={type.href}>
                      <Button 
                        className={`w-full ${type.popular ? 'btn-rocket' : ''}`}
                        variant={type.popular ? 'default' : 'outline'}
                      >
                        Get Started <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-muted-foreground">Every plan includes these premium features</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-orange-500/10 border-primary/20">
            <CardContent className="py-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Join thousands of satisfied customers with our 30-day money-back guarantee.
              </p>
              <Link to="/pricing">
                <Button size="lg" className="btn-rocket">
                  Choose Your Plan <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
