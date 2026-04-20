import AppLayout from '@/components/layout/AppLayout';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

const sections: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: 'Hosting',
    links: [
      { label: 'Shared Hosting', to: '/hosting' },
      { label: 'WordPress Hosting', to: '/wordpress' },
      { label: 'VPS Hosting', to: '/vps' },
      { label: 'Cloud Hosting', to: '/cloud' },
      { label: 'Reseller Hosting', to: '/resellers' },
      { label: 'Email Hosting', to: '/email' },
    ],
  },
  {
    title: 'Products',
    links: [
      { label: 'Domains', to: '/domains' },
      { label: 'SSL Certificates', to: '/ssl' },
      { label: 'CDN', to: '/cdn' },
      { label: 'Security', to: '/security' },
      { label: 'Migration', to: '/migrate' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', to: '/blog' },
      { label: 'Knowledge Base', to: '/kb' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Status', to: '/status' },
      { label: 'Testimonials', to: '/testimonials' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Careers', to: '/careers' },
      { label: 'Partners & Press', to: '/partners' },
      { label: 'Affiliate', to: '/affiliate' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign In', to: '/auth' },
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'Billing', to: '/billing' },
      { label: 'Profile', to: '/profile' },
      { label: 'Settings', to: '/settings' },
      { label: 'Support', to: '/support' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
      { label: 'Refund Policy', to: '/refund-policy' },
      { label: 'Cookie Policy', to: '/cookie-policy' },
      { label: 'Acceptable Use', to: '/acceptable-use-policy' },
    ],
  },
];

export default function Sitemap() {
  return (
    <AppLayout>
      <section className="container mx-auto px-4 py-12 max-w-5xl">
        <h1 className="text-4xl font-bold mb-2">Sitemap</h1>
        <p className="text-muted-foreground mb-8">Every page on KSFoundation, in one place.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sections.map((s) => (
            <Card key={s.title}>
              <CardContent className="pt-6">
                <h2 className="font-semibold mb-3">{s.title}</h2>
                <ul className="space-y-1.5 text-sm">
                  {s.links.map((l) => (
                    <li key={l.to}><Link to={l.to} className="text-muted-foreground hover:text-primary transition-colors">{l.label}</Link></li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
