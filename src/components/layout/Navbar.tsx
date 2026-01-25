import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown, Globe, MessageCircle } from 'lucide-react';
import ksLogo from '@/assets/kslogo.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    {
      label: 'Hosting',
      hasDropdown: true,
      href: '#',
      submenu: [
        { label: 'Web Hosting', href: '/hosting' },
        { label: 'WordPress Hosting', href: '/wordpress' },
        { label: 'Cloud Hosting', href: '/cloud' },
        { label: 'VPS Hosting', href: '/vps' },
      ]
    },
    {
      label: 'Domains',
      hasDropdown: false,
      href: '/domains'
    },
    {
      label: 'Features',
      hasDropdown: false,
      href: '/features'
    },
    {
      label: 'Pricing',
      hasDropdown: false,
      href: '/pricing'
    },
    {
      label: 'Company',
      hasDropdown: true,
      href: '#',
      submenu: [
        { label: 'About Us', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contact', href: '/contact' },
        { label: 'Status', href: '/status' },
      ]
    }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={ksLogo} alt="Rocket Launchpad" className="h-20 w-26 object-contain" />
            <span className="text-xl lg:text-2xl font-bold hidden sm:block">
              <span className="gradient-text-orange">​</span>
              <span className="text-foreground"></span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <div key={link.label} className="relative group">
                <Link 
                  to={link.href} 
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown className="h-4 w-4" />}
                </Link>
                
                {/* Desktop Dropdown */}
                {link.hasDropdown && link.submenu && (
                  <div className="absolute left-0 mt-0 w-48 bg-background/95 backdrop-blur-xl border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {link.submenu.map(item => (
                      <Link
                        key={item.label}
                        to={item.href}
                        className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Globe className="h-4 w-4" />
              <span>EN</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <MessageCircle className="h-4 w-4" />
              <span>24/7 Support</span>
            </button>
            <Link to="/auth">
              <Button variant="ghost" size="sm">
                Log In
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="rocket" size="sm">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2 text-foreground" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-background/98 backdrop-blur-xl border-t border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-2">
              {navLinks.map(link => (
                <div key={link.label}>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                    className="w-full flex items-center justify-between px-4 py-3 text-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    <span>{link.label}</span>
                    {link.hasDropdown && (
                      <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === link.label ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                  
                  {/* Mobile Dropdown */}
                  {link.hasDropdown && link.submenu && openDropdown === link.label && (
                    <div className="bg-muted/30 rounded-lg ml-4">
                      {link.submenu.map(item => (
                        <Link
                          key={item.label}
                          to={item.href}
                          className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setOpenDropdown(null);
                          }}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <hr className="my-2 border-border" />
              <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  Log In
                </Button>
              </Link>
              <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="rocket" className="w-full justify-start">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;>
                <Button variant="rocket" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>}
    </nav>;
};
export default Navbar;