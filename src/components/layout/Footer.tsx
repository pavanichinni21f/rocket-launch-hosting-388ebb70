import { Link } from 'react-router-dom';
import { Facebook, Twitter, Youtube, Linkedin, Instagram } from 'lucide-react';
import ksLogo from '@/assets/kslogo.png';

const footerLinks = {
  hosting: {
    title: 'Hosting',
    links: [
      { label: 'Web Hosting', href: '/hosting' },
      { label: 'WordPress Hosting', href: '/wordpress' },
      { label: 'Cloud Hosting', href: '/cloud' },
      { label: 'VPS Hosting', href: '/vps' },
      { label: 'Reseller Hosting', href: '/resellers' },
      { label: 'Email Hosting', href: '/email' },
    ],
  },
  products: {
    title: 'Products',
    links: [
      { label: 'Domains', href: '/domains' },
      { label: 'SSL Certificates', href: '/ssl' },
      { label: 'Global CDN', href: '/cdn' },
      { label: 'Security', href: '/security' },
      { label: 'Free Migration', href: '/migrate' },
    ],
  },
  resources: {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Knowledge Base', href: '/kb' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Testimonials', href: '/testimonials' },
      { label: 'Status', href: '/status' },
      { label: 'Sitemap', href: '/sitemap' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Partners & Press', href: '/partners' },
      { label: 'Contact', href: '/contact' },
      { label: 'Affiliate', href: '/affiliate' },
    ],
  },
  support: {
    title: 'Support & Legal',
    links: [
      { label: 'Help Center', href: '/support' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Refund Policy', href: '/refund-policy' },
      { label: 'Cookie Policy', href: '/cookie-policy' },
      { label: 'Acceptable Use', href: '/acceptable-use-policy' },
    ],
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
                alt="KSFoundation" 
                className="h-12 w-12 object-contain"
              />
              <span className="text-xl font-bold">
                <span className="gradient-text-orange">KS</span>
                <span className="text-foreground">Foundation</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6">
              Premium web hosting trusted by businesses across India. Fast, secure, and reliable infrastructure.
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
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} KSFoundation. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link to="/cookie-policy" className="hover:text-primary transition-colors">Cookies</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">GDPR</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
