import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <section className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">Legal</Badge>
              <h1 className="text-4xl font-bold mb-4">
                Cookie <span className="gradient-text-orange">Policy</span>
              </h1>
              <p className="text-muted-foreground">Last updated: January 2024</p>
            </div>

            <Card>
              <CardContent className="py-8 prose prose-neutral dark:prose-invert max-w-none">
                <h2>What Are Cookies?</h2>
                <p>
                  Cookies are small text files that are placed on your device when you visit our website. 
                  They help us provide you with a better experience and allow certain features to work.
                </p>

                <h2>Types of Cookies We Use</h2>
                
                <h3>Essential Cookies</h3>
                <p>
                  These cookies are necessary for the website to function properly. They enable basic 
                  functions like page navigation, secure area access, and session management.
                </p>

                <h3>Performance Cookies</h3>
                <p>
                  These cookies collect information about how visitors use our website, such as which 
                  pages are visited most often. This data helps us improve our website's performance.
                </p>

                <h3>Functional Cookies</h3>
                <p>
                  These cookies allow the website to remember choices you make (such as your language 
                  preference or theme setting) to provide enhanced features.
                </p>

                <h3>Marketing Cookies</h3>
                <p>
                  These cookies track your online activity to help advertisers deliver more relevant 
                  advertising or to limit how many times you see an ad.
                </p>

                <h2>Managing Cookies</h2>
                <p>
                  You can control and manage cookies in various ways. Most browsers automatically 
                  accept cookies, but you can modify your browser settings to decline cookies if 
                  you prefer.
                </p>

                <h3>Browser Settings</h3>
                <ul>
                  <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
                  <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies</li>
                  <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
                  <li><strong>Edge:</strong> Settings → Cookies and site permissions</li>
                </ul>

                <h2>Third-Party Cookies</h2>
                <p>
                  We may use third-party services that place cookies on your device. These include:
                </p>
                <ul>
                  <li>Google Analytics (analytics)</li>
                  <li>Intercom (customer support)</li>
                  <li>Stripe (payment processing)</li>
                </ul>

                <h2>Your Consent</h2>
                <p>
                  By continuing to use our website, you consent to the use of cookies as described 
                  in this policy. You can withdraw your consent at any time by adjusting your 
                  browser settings.
                </p>

                <h2>Updates to This Policy</h2>
                <p>
                  We may update this Cookie Policy from time to time. Any changes will be posted 
                  on this page with an updated revision date.
                </p>

                <h2>Contact Us</h2>
                <p>
                  If you have any questions about our use of cookies, please contact us at 
                  privacy@ksfoundation.in.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
