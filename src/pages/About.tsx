import { motion } from 'framer-motion';
import { Users, Award, Globe, Heart, Target, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const stats = [
  { value: '10M+', label: 'Websites Hosted' },
  { value: '150+', label: 'Countries Served' },
  { value: '50+', label: 'Team Members' },
  { value: '10+', label: 'Years Experience' },
];

const values = [
  {
    icon: Target,
    title: 'Customer First',
    description: 'Every decision we make starts with asking how it benefits our customers.',
  },
  {
    icon: Sparkles,
    title: 'Innovation',
    description: 'We constantly push boundaries to deliver cutting-edge hosting solutions.',
  },
  {
    icon: Heart,
    title: 'Reliability',
    description: 'We treat your website like our own, ensuring 99.9% uptime guarantee.',
  },
];

const team = [
  { name: 'Rajesh Kumar', role: 'CEO & Founder', avatar: '👨‍💼' },
  { name: 'Priya Sharma', role: 'CTO', avatar: '👩‍💻' },
  { name: 'Amit Patel', role: 'Head of Support', avatar: '👨‍🔧' },
  { name: 'Sneha Reddy', role: 'Lead Engineer', avatar: '👩‍🔬' },
];

export default function About() {
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
              About Us
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Powering the Web <span className="gradient-text-orange">Since 2014</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're on a mission to make web hosting simple, reliable, and accessible for everyone in India and beyond.
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

        {/* Story */}
        <section className="container mx-auto px-4 mb-20">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="py-12 px-8">
                <h2 className="text-2xl font-bold mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    KSFoundation started in 2014 with a simple belief: web hosting should be fast, secure, and affordable for everyone. What began as a small team of passionate developers has grown into India's trusted hosting platform.
                  </p>
                  <p>
                    Over the years, we've helped millions of businesses, bloggers, and developers bring their ideas online. From simple personal blogs to complex e-commerce platforms, we've been there every step of the way.
                  </p>
                  <p>
                    Today, we operate data centers across multiple regions, serve customers in 150+ countries, and continue to innovate with the latest technologies to deliver the best hosting experience possible.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Values */}
        <section className="container mx-auto px-4 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full text-center">
                  <CardContent className="pt-8">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="container mx-auto px-4 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground">The people behind KSFoundation</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl mb-3">{member.avatar}</div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-orange-500/10 border-primary/20">
            <CardContent className="py-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Join Our Growing Family
              </h2>
              <p className="text-muted-foreground mb-6">
                Start your journey with KSFoundation today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/pricing">
                  <Button className="btn-rocket">Get Started</Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline">Contact Us</Button>
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
