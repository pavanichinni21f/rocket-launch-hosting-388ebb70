import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-5xl font-black mb-4 text-foreground">Terms of Service</h1>
          <p className="text-muted-foreground mb-12">Last Updated: January 26, 2026</p>

          <div className="space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">1. Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using Rocket Launch Hosting ("Service", "Platform", "We", "Us", or "Our"), 
                you agree to be bound by these Terms of Service ("Terms"). If you do not agree to abide by the 
                above, please do not use this service.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">2. License to Use</h2>
              <p className="text-muted-foreground leading-relaxed">
                Rocket Launch Hosting grants you a limited, non-exclusive, non-transferable license to use the 
                Service for your personal or business use, subject to these Terms.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">This license does not include the right to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to decompile or reverse engineer any software</li>
                <li>Remove any copyright or other proprietary notations</li>
                <li>Transfer the materials to another person or mirror the materials</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">3. User Accounts</h2>
              <p className="text-muted-foreground leading-relaxed">
                You are responsible for maintaining the confidentiality of your account credentials and are fully 
                responsible for all activities that occur under your account. You agree to notify us immediately 
                of any unauthorized use of your account.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">4. User Responsibilities</h2>
              <p className="text-muted-foreground leading-relaxed">As a user, you agree to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>Maintain the confidentiality of your account information</li>
                <li>Accept responsibility for all activity under your account</li>
                <li>Ensure that all information provided is accurate and current</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not engage in any conduct that restricts or inhibits anyone's use of the Service</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">5. Prohibited Activities</h2>
              <p className="text-muted-foreground leading-relaxed">You may not:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>Upload or transmit viruses or malicious code</li>
                <li>Engage in any unlawful activity</li>
                <li>Infringe upon intellectual property rights</li>
                <li>Harass or abuse other users</li>
                <li>Use the Service for spam, phishing, or illegal purposes</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use automated tools to scrape or collect data</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">6. Intellectual Property Rights</h2>
              <p className="text-muted-foreground leading-relaxed">
                All content, features, and functionality of the Service are owned by Rocket Launch Hosting, its 
                licensors, or other providers of such material and are protected by United States and international 
                copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">7. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground leading-relaxed">
                The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Rocket Launch Hosting makes no 
                warranties, expressed or implied, regarding the Service. We disclaim all warranties including 
                merchantability, fitness for a particular purpose, and non-infringement.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">8. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                In no event shall Rocket Launch Hosting be liable for any indirect, incidental, special, 
                consequential, or punitive damages, including loss of profits, data, or revenue, arising out of 
                your use of the Service.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">9. Third-Party Links</h2>
              <p className="text-muted-foreground leading-relaxed">
                The Service may contain links to third-party websites. We are not responsible for the content, 
                accuracy, or practices of these external sites. Your use of third-party websites is at your own risk 
                and subject to their terms of service.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">10. Payment Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                All payments are due in full at the time of purchase. We accept multiple payment methods including 
                credit cards and digital payment systems. Billing will occur monthly or annually based on your plan.
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">11. Refunds and Cancellations</h2>
              <p className="text-muted-foreground leading-relaxed">
                Please refer to our Refund Policy for detailed information regarding refunds, cancellations, and 
                money-back guarantees. Services are generally non-refundable except as explicitly stated in the 
                Refund Policy.
              </p>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">12. Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                Rocket Launch Hosting may terminate or suspend your account and access to the Service immediately, 
                without prior notice or liability, for any reason whatsoever, including if you breach these Terms.
              </p>
            </section>

            {/* Section 13 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">13. Modifications to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                Rocket Launch Hosting reserves the right to modify these Terms at any time. We will notify you of 
                any material changes via email or through the Service. Your continued use of the Service following 
                such notification constitutes your acceptance of the updated Terms.
              </p>
            </section>

            {/* Section 14 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">14. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms and Conditions are governed by and construed in accordance with the laws of India, 
                and you irrevocably submit to the exclusive jurisdiction of the courts located in India.
              </p>
            </section>

            {/* Section 15 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">15. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-muted/50 p-6 rounded-lg mt-4 space-y-2">
                <p className="text-muted-foreground"><span className="font-semibold">Email:</span> legal@rocklaunchhosting.com</p>
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
