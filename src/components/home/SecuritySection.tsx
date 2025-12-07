import { Shield, Lock, Eye, Server, Fingerprint, AlertTriangle } from 'lucide-react';
import ksLogo from '@/assets/kslogo.png';

const securityFeatures = [
  {
    icon: Shield,
    title: 'DDoS Protection',
    description: 'Enterprise-grade DDoS mitigation with 10+ Tbps capacity',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    icon: Lock,
    title: 'SSL/TLS Encryption',
    description: 'Free SSL certificates with automatic renewal',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Eye,
    title: '24/7 Monitoring',
    description: 'Real-time threat detection and instant alerts',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
  },
  {
    icon: Server,
    title: 'Isolated Containers',
    description: 'Each account runs in its own secure container',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    icon: Fingerprint,
    title: 'Two-Factor Auth',
    description: 'Secure your account with 2FA authentication',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
  },
  {
    icon: AlertTriangle,
    title: 'Malware Scanner',
    description: 'Automated malware detection and removal',
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
  },
];

const SecuritySection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background with shields spreading animation */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* Centered Logo */}
          <img
            src={ksLogo}
            alt="Key Secure Foundation"
            className="w-32 h-32 object-contain opacity-20 animate-pulse"
          />
          
          {/* Spreading security shields */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-success/20 rounded-full animate-ping"
              style={{
                width: `${150 + i * 80}px`,
                height: `${150 + i * 80}px`,
                animationDuration: `${2 + i * 0.5}s`,
                animationDelay: `${i * 0.2}s`,
              }}
            >
              {/* Shield icons at cardinal points */}
              {i % 2 === 0 && (
                <>
                  <Shield className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-success/40" />
                  <Shield className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-6 w-6 text-success/40" />
                  <Shield className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 h-6 w-6 text-success/40" />
                  <Shield className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-6 w-6 text-success/40" />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-6">
            <Shield className="h-4 w-4 text-success" />
            <span className="text-sm font-medium text-success">Enterprise Security</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Your Data is <span className="gradient-text-green">Protected</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Multi-layered security infrastructure to keep your websites and applications safe
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {securityFeatures.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card p-6 rounded-2xl hover:border-success/50 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`inline-flex p-3 rounded-xl ${feature.bgColor} mb-4`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Security Certifications */}
        <div className="mt-12 flex flex-wrap justify-center gap-8">
          {['SOC 2', 'ISO 27001', 'GDPR', 'PCI DSS'].map((cert) => (
            <div
              key={cert}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/30 border border-border"
            >
              <Shield className="h-4 w-4 text-success" />
              <span className="text-sm font-semibold">{cert}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
