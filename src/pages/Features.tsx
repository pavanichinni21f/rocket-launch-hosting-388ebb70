import { motion } from 'framer-motion';
import { 
  Zap, Shield, Globe, Clock, Server, Lock, 
  RefreshCw, Headphones, Database, Code, 
  BarChart, Settings 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast Performance',
    description: 'NVMe SSD storage and optimized servers deliver page load times under 200ms.',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
  {
    icon: Shield,
    title: 'Advanced Security',
    description: 'Free SSL certificates, DDoS protection, and automated malware scanning.',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: Globe,
    title: 'Global CDN',
    description: '200+ edge locations worldwide for fastest content delivery to your users.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Clock,
    title: '99.9% Uptime Guarantee',
    description: 'Enterprise-grade infrastructure with redundant systems and failover.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: Server,
    title: 'Scalable Infrastructure',
    description: 'Easily scale resources up or down based on your traffic needs.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    icon: Lock,
    title: 'Free SSL Certificates',
    description: 'Automatic SSL provisioning and renewal for all your domains.',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  {
    icon: RefreshCw,
    title: 'Daily Backups',
    description: 'Automated daily backups with one-click restore functionality.',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
  },
  {
    icon: Headphones,
    title: '24/7 Expert Support',
    description: 'Round-the-clock support from hosting experts via chat, email, and phone.',
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
  },
  {
    icon: Database,
    title: 'Managed Databases',
    description: 'MySQL, PostgreSQL, and Redis with automatic optimization.',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
  },
  {
    icon: Code,
    title: 'Developer Tools',
    description: 'SSH access, Git deployment, staging environments, and CLI tools.',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  {
    icon: BarChart,
    title: 'Real-time Analytics',
    description: 'Comprehensive metrics dashboard for traffic, performance, and errors.',
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/10',
  },
  {
    icon: Settings,
    title: 'Easy Management',
    description: 'Intuitive control panel with one-click installers for popular apps.',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
];

const stats = [
  { value: '99.9%', label: 'Uptime Guarantee' },
  { value: '<200ms', label: 'Average Response' },
  { value: '10M+', label: 'Websites Hosted' },
  { value: '24/7', label: 'Expert Support' },
];

export default function Features() {
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
              Enterprise-Grade Hosting
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful <span className="gradient-text-orange">Features</span> for Modern Websites
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Everything you need to build, deploy, and scale your web applications with confidence.
            </p>
          </motion.div>
        </section>

        {/* Stats */}
        <section className="container mx-auto px-4 mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text-orange mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 mb-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-orange-500/10 border-primary/20">
            <CardContent className="py-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Experience the Difference?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Join thousands of satisfied customers who trust us with their web hosting needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/pricing">
                  <Button className="btn-rocket">View Plans</Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline">Contact Sales</Button>
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
