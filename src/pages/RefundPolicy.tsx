import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-5xl font-black mb-4 text-foreground">Refund Policy</h1>
          <p className="text-muted-foreground mb-12">Last Updated: January 26, 2026</p>

          <div className="space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">1. 30-Day Money-Back Guarantee</h2>
              <p className="text-muted-foreground leading-relaxed">
                At Rocket Launch Hosting, we're confident in the quality of our hosting services. We offer a 
                comprehensive 30-day money-back guarantee for all new hosting plan purchases. If you're not 
                completely satisfied with our services, we'll refund your money, no questions asked.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">2. Eligible Services for Refund</h2>
              <p className="text-muted-foreground leading-relaxed">The following services are eligible for refunds within 30 days:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>Shared Hosting Plans (all tiers)</li>
                <li>WordPress Hosting Plans</li>
                <li>Cloud Hosting Plans</li>
                <li>VPS Hosting (first month only)</li>
                <li>Managed Cloud Services</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">3. Non-Refundable Services</h2>
              <p className="text-muted-foreground leading-relaxed">The following services are NOT eligible for refunds:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>Domain registrations and domain renewal services</li>
                <li>SSL certificates and certificate renewals</li>
                <li>Dedicated servers (unless brand new and unused)</li>
                <li>Add-on services and premium add-ons</li>
                <li>Setup fees and installation fees</li>
                <li>Services purchased during promotional periods at 50% or greater discount</li>
                <li>Services used for spamming, illegal activities, or TOS violations</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">4. Refund Request Process</h2>
              <p className="text-muted-foreground leading-relaxed">To request a refund, follow these steps:</p>
              <div className="space-y-3 mt-4">
                <div className="flex gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-semibold">1</div>
                  <p className="text-muted-foreground">Log in to your Rocket Launch Hosting account dashboard</p>
                </div>
                <div className="flex gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-semibold">2</div>
                  <p className="text-muted-foreground">Navigate to Support → Submit a Ticket</p>
                </div>
                <div className="flex gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-semibold">3</div>
                  <p className="text-muted-foreground">Select "Billing" as the department</p>
                </div>
                <div className="flex gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-semibold">4</div>
                  <p className="text-muted-foreground">Choose "Refund Request" as the subject line</p>
                </div>
                <div className="flex gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-semibold">5</div>
                  <p className="text-muted-foreground">Provide a brief reason for your refund request</p>
                </div>
                <div className="flex gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-semibold">6</div>
                  <p className="text-muted-foreground">Our team will respond within 24 hours</p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">5. Refund Processing Timeline</h2>
              <p className="text-muted-foreground leading-relaxed">
                Once your refund request is approved:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>Your refund will be processed within 3-5 business days</li>
                <li>The refund will be credited to your original payment method</li>
                <li>Please allow an additional 3-5 business days for your bank to process the credit</li>
                <li>If you paid via PayPal or other payment gateway, the timeline may vary</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">6. Conditions for Refund Eligibility</h2>
              <p className="text-muted-foreground leading-relaxed">To be eligible for a refund, you must:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>Request the refund within 30 days of the original purchase date</li>
                <li>Not have engaged in abusive behavior or violated our Terms of Service</li>
                <li>Not have used our service for spam, phishing, or illegal activities</li>
                <li>Provide a valid reason for the refund request</li>
                <li>Have a good standing account record</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">7. Partial Refunds</h2>
              <p className="text-muted-foreground leading-relaxed">
                For services actively used beyond the 30-day period or for services upgraded/modified during the 
                guarantee period, we may offer a prorated refund for the unused portion of your subscription at our 
                sole discretion. Each case will be reviewed individually.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">8. Multi-Year Plans</h2>
              <p className="text-muted-foreground leading-relaxed">
                For multi-year plans purchased at discounted rates, refunds are limited to a maximum of 30 days 
                from the purchase date. After 30 days, we cannot refund multi-year subscriptions. We recommend 
                purchasing annual plans to ensure you're satisfied with our service before committing to multi-year terms.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">9. Chargebacks and Disputes</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you file a chargeback with your bank or credit card company without first contacting our support 
                team, your account will be immediately suspended. You may also be responsible for additional 
                administrative fees. We strongly encourage you to reach out to us first to resolve any billing issues 
                before initiating a chargeback.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">10. Account Suspension for Violations</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to refuse refunds and suspend accounts involved in:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>Spamming or phishing activities</li>
                <li>Illegal or prohibited content</li>
                <li>Resource abuse or excessive usage</li>
                <li>Malware or virus distribution</li>
                <li>Repeated refund requests (fraud patterns)</li>
              </ul>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">11. Promotional and Discount Purchases</h2>
              <p className="text-muted-foreground leading-relaxed">
                Services purchased using promotional codes offering 50% or greater discounts are not eligible for 
                refunds. Free trial periods are also non-refundable. If you upgrade from a free trial to a paid plan, 
                the paid plan portion is eligible for refund within 30 days.
              </p>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">12. No Refund for Service Downgrades</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you downgrade your service (e.g., from Premium to Standard), no refund will be issued for the 
                difference. You'll simply pay a lower rate going forward.
              </p>
            </section>

            {/* Section 13 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">13. Data Backup and Deletion</h2>
              <p className="text-muted-foreground leading-relaxed">
                Upon refund approval and account cancellation, all your data and files will be securely deleted within 
                30 days. We are not responsible for data loss after account termination. Please ensure you have backed 
                up all important files before requesting a refund.
              </p>
            </section>

            {/* Section 14 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">14. Modifications to Refund Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Rocket Launch Hosting reserves the right to modify this Refund Policy at any time. Changes will be 
                effective immediately upon posting to our website. Your continued use of our services constitutes 
                acceptance of the updated policy.
              </p>
            </section>

            {/* Section 15 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">15. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about our Refund Policy, please contact us:
              </p>
              <div className="bg-muted/50 p-6 rounded-lg mt-4 space-y-2">
                <p className="text-muted-foreground"><span className="font-semibold">Billing Email:</span> billing@rocklaunchhosting.com</p>
                <p className="text-muted-foreground"><span className="font-semibold">Support:</span> support@rocklaunchhosting.com</p>
                <p className="text-muted-foreground"><span className="font-semibold">Support Portal:</span> https://support.rocklaunchhosting.com</p>
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
