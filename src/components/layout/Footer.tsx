import { Link } from 'react-router-dom';
import { Facebook, Twitter, Youtube, Linkedin, Instagram } from 'lucide-react';
import ksLogo from '@/assets/kslogo.png';

const footerLinks = {
  hosting: {
    title: 'Hosting',
    links: ['Web Hosting', 'WordPress Hosting', 'Cloud Hosting', 'VPS Hosting', 'Dedicated Servers', 'Email Hosting'],
  },
  domains: {
    title: 'Domains',
    links: ['Domain Search', 'Domain Transfer', 'Free Domain', 'WHOIS Lookup', 'Domain Pricing'],
  },
  company: {
    title: 'Company',
    links: ['About Us', 'Careers', 'Press', 'Blog', 'Affiliates', 'Contact'],
  },
  support: {
    title: 'Support',
    links: ['Help Center', 'Community', 'Status', 'Report Abuse', 'Terms of Service', 'Privacy Policy'],
  },
};

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img 
                src={ksLogo} 
                alt="Key Secure Foundation" 
                className="h-12 w-12 object-contain"
              />
              <span className="text-xl font-bold">
                <span className="gradient-text-orange">Key Secure</span>
                <span className="text-foreground"> Foundation</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6">
              Premium web hosting trusted by millions worldwide. Fast, secure, and reliable.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {[Facebook, Twitter, Youtube, Linkedin, Instagram].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h4 className="font-semibold text-foreground mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 KSFoundation. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Cookies</a>
            <a href="#" className="hover:text-primary transition-colors">GDPR</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
