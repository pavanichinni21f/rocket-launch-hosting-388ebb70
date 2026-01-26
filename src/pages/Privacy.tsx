import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-5xl font-black mb-4 text-foreground">Privacy Policy</h1>
          <p className="text-muted-foreground mb-12">Last Updated: January 26, 2026</p>

          <div className="space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Rocket Launch Hosting ("we", "us", "our", or "Company") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you 
                visit our website and use our services.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">2. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed font-semibold">We collect information in several ways:</p>
              <div className="space-y-4 mt-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Information You Provide:</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Name, email address, and phone number</li>
                    <li>Account login credentials</li>
                    <li>Billing and payment information</li>
                    <li>Communication preferences</li>
                    <li>Support requests and feedback</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Information Automatically Collected:</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>IP address and device information</li>
                    <li>Browser type and version</li>
                    <li>Operating system</li>
                    <li>Referring/exit pages and URLs</li>
                    <li>Clickstream data and pages visited</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">3. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed">We use the information we collect to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process your payments and send billing information</li>
                <li>Send transactional and promotional emails</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Analyze usage patterns and trends</li>
                <li>Detect and prevent fraudulent transactions</li>
                <li>Comply with legal obligations</li>
                <li>Personalize your experience</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">4. Data Sharing and Disclosure</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may share your information with third parties in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li><span className="font-semibold">Service Providers:</span> With vendors who assist in our operations</li>
                <li><span className="font-semibold">Payment Processors:</span> With payment gateways to process transactions</li>
                <li><span className="font-semibold">Legal Requirements:</span> When required by law or to protect our rights</li>
                <li><span className="font-semibold">Business Transfers:</span> In case of merger, acquisition, or sale</li>
                <li><span className="font-semibold">Analytics Providers:</span> With services like Google Analytics</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">5. Cookies and Tracking Technologies</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies, web beacons, and similar tracking technologies to enhance your experience and 
                analyze usage patterns. You can control cookie settings through your browser preferences.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We use the following types of cookies:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li><span className="font-semibold">Essential Cookies:</span> Required for basic functionality</li>
                <li><span className="font-semibold">Analytics Cookies:</span> For understanding user behavior</li>
                <li><span className="font-semibold">Marketing Cookies:</span> For targeted advertising</li>
                <li><span className="font-semibold">Preference Cookies:</span> For remembering your preferences</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">6. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction. However, no method 
                of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Security measures include:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>SSL/TLS encryption for data in transit</li>
                <li>Password hashing and salting</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication</li>
                <li>Data backup and disaster recovery</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">7. Your Rights and Choices</h2>
              <p className="text-muted-foreground leading-relaxed">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li><span className="font-semibold">Right to Access:</span> Request a copy of your personal data</li>
                <li><span className="font-semibold">Right to Rectification:</span> Correct inaccurate information</li>
                <li><span className="font-semibold">Right to Erasure:</span> Request deletion of your data</li>
                <li><span className="font-semibold">Right to Restrict Processing:</span> Limit how we use your data</li>
                <li><span className="font-semibold">Right to Portability:</span> Receive data in a portable format</li>
                <li><span className="font-semibold">Right to Opt-Out:</span> Decline marketing communications</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">8. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our Service is not directed to children under the age of 13. We do not knowingly collect personal 
                information from children under 13. If we discover that a child under 13 has provided us with personal 
                information, we will take steps to delete such information and terminate the child's account.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">9. Third-Party Links</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our Service may contain links to third-party websites. We are not responsible for the privacy 
                practices of these external sites. We encourage you to review their privacy policies before 
                providing any personal information.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">10. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal information for as long as necessary to provide our services, comply with 
                legal obligations, and resolve disputes. The retention period may vary depending on the context of 
                processing and our legal obligations.
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">11. International Data Transfers</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your information may be transferred to, stored in, and processed in countries other than your country 
                of residence. These countries may have data protection laws that differ from your home country. By 
                using our Service, you consent to the transfer of your information to countries outside your country 
                of residence.
              </p>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">12. California Privacy Rights (CCPA)</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you are a California resident, you have specific rights under the California Consumer Privacy Act. 
                Please contact us at privacy@rocklaunchhosting.com for more information about your California privacy rights.
              </p>
            </section>

            {/* Section 13 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">13. GDPR Compliance</h2>
              <p className="text-muted-foreground leading-relaxed">
                For EU residents, we comply with the General Data Protection Regulation (GDPR). We process personal 
                data on the basis of legitimate interests, contractual necessity, or explicit consent. You have the 
                right to lodge a complaint with your local data protection authority.
              </p>
            </section>

            {/* Section 14 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">14. Changes to Privacy Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, 
                legal requirements, and other factors. We will notify you of material changes by email or through 
                prominent notice on our website.
              </p>
            </section>

            {/* Section 15 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">15. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about this Privacy Policy or our privacy practices, please contact us at:
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
