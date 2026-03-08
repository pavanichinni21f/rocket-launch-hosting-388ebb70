import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Rocket, Zap, Shield, Clock, ArrowRight, Play } from 'lucide-react';

const HeroSection = () => {
  const [uptimeCount, setUptimeCount] = useState(0);
  const [speedCount, setSpeedCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);

  useEffect(() => {
    const animateCounter = (
      setter: React.Dispatch<React.SetStateAction<number>>,
      target: number,
      duration: number
    ) => {
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          setter(target);
          clearInterval(interval);
        } else {
          setter(Math.floor(current * 10) / 10);
        }
      }, duration / steps);
    };

    const timer = setTimeout(() => {
      animateCounter(setUptimeCount, 99.9, 2000);
      animateCounter(setSpeedCount, 0.3, 2000);
      animateCounter(setCustomersCount, 3, 2000);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-hero-pattern" />
      <div className="absolute inset-0 server-pattern opacity-5" />
      
      {/* Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-accent/15 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            <span className="text-sm font-medium text-primary">
              Trusted by 3M+ Websites Worldwide
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight animate-slide-up">
            <span className="text-foreground">Premium Hosting</span>
            <br />
            <span className="gradient-text-orange">Built for India</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Premium web hosting with blazing-fast servers, enterprise security, and 24/7 expert support. 
            Start building your online empire today.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Button variant="rocket" size="xl" className="group">
              <Rocket className="h-5 w-5 group-hover:animate-rocket-launch" />
              Start Free Trial
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="xl" className="group">
              <Play className="h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="glass-card p-6 rounded-2xl group hover:border-success/50 transition-all duration-300">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-success/10">
                  <Clock className="h-5 w-5 text-success" />
                </div>
                <span className="text-3xl md:text-4xl font-black gradient-text-green">
                  {uptimeCount}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Uptime Guarantee</p>
            </div>

            <div className="glass-card p-6 rounded-2xl group hover:border-primary/50 transition-all duration-300">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <span className="text-3xl md:text-4xl font-black gradient-text-orange">
                  {speedCount}s
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Avg. Load Time</p>
            </div>

            <div className="glass-card p-6 rounded-2xl group hover:border-secondary/50 transition-all duration-300">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <Shield className="h-5 w-5 text-secondary" />
                </div>
                <span className="text-3xl md:text-4xl font-black gradient-text-blue">
                  {customersCount}M+
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Happy Customers</p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 opacity-60">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Trusted by</span>
            <div className="flex items-center gap-8 text-muted-foreground">
              <span className="font-bold text-lg">WordPress</span>
              <span className="font-bold text-lg">Shopify</span>
              <span className="font-bold text-lg">WooCommerce</span>
              <span className="font-bold text-lg">Magento</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-muted-foreground/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
