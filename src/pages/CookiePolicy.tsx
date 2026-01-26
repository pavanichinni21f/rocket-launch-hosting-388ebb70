import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-5xl font-black mb-4 text-foreground">Cookie Policy</h1>
          <p className="text-muted-foreground mb-12">Last Updated: January 26, 2026</p>

          <div className="space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">1. What Are Cookies?</h2>
              <p className="text-muted-foreground leading-relaxed">
                Cookies are small text files that are placed on your device (computer, tablet, or smartphone) 
                when you visit our website. They help us provide you with a better experience and allow certain 
                features to work properly. Cookies contain small amounts of information, typically including a 
                unique identifier.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">2. Types of Cookies We Use</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Session Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    These temporary cookies are deleted when you close your browser. They help us manage your 
                    session and keep you logged in while browsing our site.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Persistent Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    These cookies remain on your device for a specified period. They help us remember your 
                    preferences and settings across multiple visits.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Essential Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    These cookies are strictly necessary for the website to function properly. They enable basic 
                    functions like page navigation, secure area access, session management, and form submission.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Performance Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    These cookies collect information about how visitors use our website, such as which pages are 
                    visited most often, time spent on pages, and error messages. This data helps us improve our 
                    website's performance and user experience.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Functional Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    These cookies allow the website to remember choices you make to provide personalized features, 
                    such as your language preference, theme setting, dashboard preferences, or other customizations.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Analytics Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We use Google Analytics cookies to understand how users interact with our site, track 
                    conversions, and improve our marketing efforts. These cookies are anonymous and do not 
                    identify you personally.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Marketing Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    These cookies track your online activity to help advertisers deliver more relevant advertising 
                    or to limit how many times you see a specific ad. They may also track if you came from an ad 
                    campaign.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">3. Specific Cookies Used</h2>
              <div className="bg-muted/50 p-6 rounded-lg space-y-3">
                <div>
                  <p className="font-semibold text-foreground">Session Cookie</p>
                  <p className="text-sm text-muted-foreground">Name: SESSIONID | Purpose: User session management | Expires: When browser closes</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Authentication Cookie</p>
                  <p className="text-sm text-muted-foreground">Name: auth_token | Purpose: User authentication | Expires: 30 days</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Preference Cookie</p>
                  <p className="text-sm text-muted-foreground">Name: user_preferences | Purpose: Theme, language, settings | Expires: 1 year</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Google Analytics</p>
                  <p className="text-sm text-muted-foreground">Name: _ga, _gid | Purpose: Analytics tracking | Expires: 2 years</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Stripe Cookie</p>
                  <p className="text-sm text-muted-foreground">Name: __stripe_* | Purpose: Payment processing | Expires: Various</p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">4. Third-Party Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use third-party services that may place cookies on your device. These third parties have their 
                own cookie policies and privacy practices:
              </p>
              <div className="space-y-3 mt-4">
                <div>
                  <p className="font-semibold text-foreground">Google Analytics</p>
                  <p className="text-muted-foreground text-sm">Purpose: Website analytics | Privacy: https://policies.google.com/privacy</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Stripe</p>
                  <p className="text-muted-foreground text-sm">Purpose: Payment processing | Privacy: https://stripe.com/privacy</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Razorpay</p>
                  <p className="text-muted-foreground text-sm">Purpose: Payment gateway | Privacy: https://razorpay.com/privacy</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Intercom</p>
                  <p className="text-muted-foreground text-sm">Purpose: Customer support chat | Privacy: https://www.intercom.com/privacy</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Sentry</p>
                  <p className="text-muted-foreground text-sm">Purpose: Error tracking | Privacy: https://sentry.io/privacy/</p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">5. Managing Your Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                You have full control over cookies. Most browsers allow you to refuse cookies and alert you when 
                a cookie is being placed on your device. Here's how to manage cookies in popular browsers:
              </p>
              
              <div className="space-y-4 mt-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Google Chrome</h3>
                  <ol className="list-decimal list-inside text-muted-foreground space-y-1">
                    <li>Click the menu icon (three dots)</li>
                    <li>Select "Settings"</li>
                    <li>Click "Privacy and security"</li>
                    <li>Select "Cookies and other site data"</li>
                    <li>Choose your preference</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Mozilla Firefox</h3>
                  <ol className="list-decimal list-inside text-muted-foreground space-y-1">
                    <li>Click the menu button (hamburger icon)</li>
                    <li>Select "Settings"</li>
                    <li>Go to "Privacy & Security"</li>
                    <li>Scroll to "Cookies and Site Data"</li>
                    <li>Choose your preference</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Apple Safari</h3>
                  <ol className="list-decimal list-inside text-muted-foreground space-y-1">
                    <li>Click "Safari" in the menu</li>
                    <li>Select "Preferences"</li>
                    <li>Go to the "Privacy" tab</li>
                    <li>Choose your cookie preference</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Microsoft Edge</h3>
                  <ol className="list-decimal list-inside text-muted-foreground space-y-1">
                    <li>Click the menu button (three dots)</li>
                    <li>Select "Settings"</li>
                    <li>Click "Privacy, search, and services"</li>
                    <li>Choose your cookie preference</li>
                  </ol>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">6. Impact of Disabling Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                Please note that if you disable cookies, some features of our website may not function properly:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>You may not be able to log in to your account</li>
                <li>Your shopping cart may not work</li>
                <li>Your preferences and settings won't be saved</li>
                <li>Some interactive features may be unavailable</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">7. Do Not Track Signals</h2>
              <p className="text-muted-foreground leading-relaxed">
                Some browsers include a "Do Not Track" feature. When enabled, this feature sends a signal to 
                websites asking them not to track your activity. Currently, there is no industry standard for 
                recognizing Do Not Track signals, and we do not respond to them. However, you can still manage 
                cookies and tracking through your browser settings.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">8. Local Storage and Similar Technologies</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may also use local storage, web beacons, and similar technologies to store information about 
                your preferences and activities. These work similarly to cookies and can be managed through your 
                browser settings.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">9. Cookie Consent</h2>
              <p className="text-muted-foreground leading-relaxed">
                By continuing to use our website without disabling cookies, you consent to our use of cookies as 
                described in this policy. You can withdraw your consent at any time by adjusting your browser 
                settings or by contacting us.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">10. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our practices, technology, 
                or legal requirements. Any changes will be effective immediately upon posting on this page. Your 
                continued use of our website following such notification constitutes your acceptance of the updated 
                policy.
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">11. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about our use of cookies or this Cookie Policy, please contact us:
              </p>
              <div className="bg-muted/50 p-6 rounded-lg mt-4 space-y-2">
                <p className="text-muted-foreground"><span className="font-semibold">Email:</span> privacy@rocklaunchhosting.com</p>
                <p className="text-muted-foreground"><span className="font-semibold">Support:</span> support@rocklaunchhosting.com</p>
                <p className="text-muted-foreground"><span className="font-semibold">Address:</span> KS Foundation, India</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
