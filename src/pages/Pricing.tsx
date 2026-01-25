import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Zap, Shield, Headphones, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for personal projects and small websites',
    monthlyPrice: 999,
    yearlyPrice: 9990,
    features: [
      '10 GB SSD Storage',
      '100 GB Bandwidth',
      'Free SSL Certificate',
      '1 Website',
      'Email Support',
      'Daily Backups',
      'cPanel Access',
    ],
    popular: false,
    color: 'border-border',
  },
  {
    name: 'Business',
    description: 'Ideal for growing businesses and e-commerce',
    monthlyPrice: 2499,
    yearlyPrice: 24990,
    features: [
      '50 GB SSD Storage',
      'Unlimited Bandwidth',
      'Free SSL Certificate',
      'Unlimited Websites',
      'Priority Support',
      'Daily Backups',
      'cPanel Access',
      'Free Domain',
      'Staging Environment',
    ],
    popular: true,
    color: 'border-primary',
  },
  {
    name: 'Enterprise',
    description: 'For large-scale applications and high traffic',
    monthlyPrice: 4999,
    yearlyPrice: 49990,
    features: [
      '200 GB NVMe Storage',
      'Unlimited Bandwidth',
      'Free SSL Certificate',
      'Unlimited Websites',
      '24/7 Dedicated Support',
      'Real-time Backups',
      'Advanced cPanel',
      'Free Domain',
      'Staging Environment',
      'DDoS Protection',
      'Custom Firewall',
    ],
    popular: false,
    color: 'border-border',
  },
];

const features = [
  { icon: Zap, title: 'Lightning Fast', description: 'NVMe SSDs and optimized servers for blazing speed' },
  { icon: Shield, title: '99.9% Uptime', description: 'Enterprise-grade infrastructure with redundancy' },
  { icon: Headphones, title: '24/7 Support', description: 'Expert support team available round the clock' },
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4">
              <Star className="h-3 w-3 mr-1" /> Trusted by 10,000+ customers
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, Transparent <span className="gradient-text-orange">Pricing</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Choose the perfect plan for your needs. All plans include free SSL, daily backups, and 30-day money-back guarantee.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={`text-sm ${!isYearly ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                Monthly
              </span>
              <Switch checked={isYearly} onCheckedChange={setIsYearly} />
              <span className={`text-sm ${isYearly ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                Yearly
                <Badge variant="secondary" className="ml-2 bg-green-500/10 text-green-600">
                  Save 20%
                </Badge>
              </span>
            </div>
          </motion.div>
        </section>

        {/* Pricing Cards */}
        <section className="container mx-auto px-4 mb-20">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`relative h-full ${plan.color} ${plan.popular ? 'border-2 shadow-xl shadow-primary/20' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-center mb-6">
                      <span className="text-4xl font-bold">
                        ₹{isYearly ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice}
                      </span>
                      <span className="text-muted-foreground">/mo</span>
                      {isYearly && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Billed ₹{plan.yearlyPrice.toLocaleString('en-IN')} yearly
                        </p>
                      )}
                    </div>
                    
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link to="/auth">
                      <Button 
                        className={`w-full ${plan.popular ? 'btn-rocket' : ''}`}
                        variant={plan.popular ? 'default' : 'outline'}
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
        <section className="container mx-auto px-4 text-center">
          <Card className="max-w-3xl mx-auto bg-gradient-to-r from-primary/10 to-orange-500/10 border-primary/20">
            <CardContent className="py-12">
              <h2 className="text-2xl font-bold mb-4">Not sure which plan is right for you?</h2>
              <p className="text-muted-foreground mb-6">
                Our experts are here to help you choose the perfect hosting solution.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button variant="outline">Talk to Sales</Button>
                </Link>
                <Link to="/support">
                  <Button className="btn-rocket">Get Free Consultation</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
