import { Link } from 'react-router-dom';
import { Linkedin, Facebook, Instagram, Mail, MessageCircle } from 'lucide-react';
import gsLogo from '@/assets/gslogo.png';

const socials = [
  { Icon: MessageCircle, href: 'https://wa.me/', label: 'WhatsApp' },
  { Icon: Linkedin, href: 'https://www.linkedin.com/in/praveenkumarkanneganti/', label: 'LinkedIn' },
  { Icon: Facebook, href: 'https://www.facebook.com/pranu21m', label: 'Facebook' },
  { Icon: Instagram, href: 'https://www.instagram.com/pk_uxui_architect/', label: 'Instagram' },
];

const Footer = () => {
  return (
    <footer className="bg-[#0A2540] text-white border-t border-white/10">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src={gsLogo} alt="GUIDESOFT IT SOLUTIONS" className="h-12 w-12 object-contain" />
              <span className="text-xl font-bold tracking-tight">GUIDESOFT IT SOLUTIONS</span>
            </Link>
            <p className="text-sm text-white/70 max-w-md">
              Enterprise-grade AI Assistant delivering intelligent, secure, and always-on
              conversational experiences for modern businesses.
            </p>
            <a
              href="mailto:info@guideitsol.com"
              className="inline-flex items-center gap-2 mt-4 text-sm text-white/90 hover:text-white transition-colors"
            >
              <Mail className="h-4 w-4" /> info@guideitsol.com
            </a>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/about" className="hover:text-white">About</Link></li>
              <li><Link to="/features" className="hover:text-white">Features</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              <li><a href="https://www.guideitsol.com" target="_blank" rel="noreferrer" className="hover:text-white">guideitsol.com</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/privacy" className="hover:text-white">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-white">Terms</Link></li>
              <li><Link to="/cookie-policy" className="hover:text-white">Cookies</Link></li>
            </ul>
            <div className="flex gap-3 mt-5">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center space-y-2">
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} GUIDESOFT IT SOLUTIONS. All rights reserved.
          </p>
          <p className="text-sm text-white/80">
            Designed &amp; Developed by{' '}
            <a
              href="https://praveenuxui.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white hover:underline"
            >
              Praveen UX/UI
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
