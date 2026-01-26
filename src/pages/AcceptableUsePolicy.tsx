import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function AcceptableUsePolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-5xl font-black mb-4 text-foreground">Acceptable Use Policy</h1>
          <p className="text-muted-foreground mb-12">Last Updated: January 26, 2026</p>

          <div className="space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">1. Purpose</h2>
              <p className="text-muted-foreground leading-relaxed">
                This Acceptable Use Policy ("Policy") outlines the requirements for users of Rocket Launch Hosting 
                services. This Policy applies to all customers, users, and services provided by Rocket Launch Hosting. 
                By using our services, you agree to comply with this Policy.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">2. Prohibited Activities</h2>
              <p className="text-muted-foreground leading-relaxed">You may NOT use our services for any of the following:</p>
              
              <div className="space-y-4 mt-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Illegal Activities</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Any activity that violates local, state, national, or international law</li>
                    <li>Distribution of child exploitation material</li>
                    <li>Fraud, forgery, or misrepresentation</li>
                    <li>Hacking, cracking, or unauthorized system access</li>
                    <li>Money laundering or financing of illegal activities</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Malicious Activities</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Distribution of malware, viruses, or other malicious code</li>
                    <li>Phishing scams or social engineering attacks</li>
                    <li>Ransomware attacks or distribution</li>
                    <li>Botnets or zombie networks</li>
                    <li>Cryptomining without explicit consent</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Spam and Abuse</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Unsolicited bulk email (spam)</li>
                    <li>Email spoofing or header forging</li>
                    <li>DoS (Denial of Service) attacks</li>
                    <li>DDoS (Distributed Denial of Service) attacks</li>
                    <li>Port scanning or vulnerability scanning without permission</li>
                    <li>Harassment, threats, or abusive behavior</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Intellectual Property Violations</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Copyright infringement</li>
                    <li>Trademark infringement</li>
                    <li>Patent infringement</li>
                    <li>Unauthorized distribution of protected content</li>
                    <li>Piracy or illegal software distribution</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Adult and Obscene Content</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Child sexual abuse material (CSAM)</li>
                    <li>Sexually explicit content involving minors</li>
                    <li>Extreme violence or gore</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Resource Abuse</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Excessive CPU usage affecting other users</li>
                    <li>Unlimited bandwidth consumption</li>
                    <li>Resource hog applications</li>
                    <li>Reselling services without authorization</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">3. Content Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Users are responsible for all content hosted on their accounts. We do not allow:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>Illegal or obscene content</li>
                <li>Content that promotes violence or hatred</li>
                <li>Defamatory or libelous content</li>
                <li>Content that violates privacy rights</li>
                <li>Infringing content</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">4. Security Violations</h2>
              <p className="text-muted-foreground leading-relaxed">You may NOT:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Bypass security measures or firewalls</li>
                <li>Interfere with network operations</li>
                <li>Probe, scan, or test system security without permission</li>
                <li>Disable or interfere with security features</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">5. Compliance Monitoring</h2>
              <p className="text-muted-foreground leading-relaxed">
                Rocket Launch Hosting reserves the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>Monitor compliance with this Policy</li>
                <li>Investigate suspected violations</li>
                <li>Inspect account contents when legally required</li>
                <li>Take immediate action for severe violations</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">6. Consequences of Violations</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you violate this Policy, we may take the following actions:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>Issue a warning or notice</li>
                <li>Suspend your account or service</li>
                <li>Terminate your account without refund</li>
                <li>Delete hosted content</li>
                <li>Report to law enforcement if necessary</li>
                <li>Hold you liable for damages</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">7. Reporting Violations</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you discover a violation of this Policy, please report it immediately to:
              </p>
              <div className="bg-muted/50 p-6 rounded-lg mt-4 space-y-2">
                <p className="text-muted-foreground"><span className="font-semibold">Email:</span> abuse@rocklaunchhosting.com</p>
                <p className="text-muted-foreground"><span className="font-semibold">Phone:</span> +1-800-RLH-ABUSE</p>
                <p className="text-muted-foreground">Provide as much detail as possible including:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
                  <li>Specific URL or IP address</li>
                  <li>Description of violation</li>
                  <li>Evidence or screenshots</li>
                  <li>Date and time of violation</li>
                </ul>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">8. Third-Party Complaints</h2>
              <p className="text-muted-foreground leading-relaxed">
                If we receive a complaint alleging your use of services violates this Policy, we will:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>Investigate the complaint thoroughly</li>
                <li>Contact you with details of the allegation</li>
                <li>Allow you to respond within a reasonable timeframe</li>
                <li>Take appropriate action based on our investigation</li>
              </ul>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">9. No Liability for Enforcement</h2>
              <p className="text-muted-foreground leading-relaxed">
                Rocket Launch Hosting is not liable for any losses, damages, or claims arising from:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>Enforcement of this Policy</li>
                <li>Account suspension or termination</li>
                <li>Content removal or deletion</li>
                <li>Disclosure to law enforcement</li>
              </ul>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">10. Policy Updates</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Policy at any time. Continued use of our services constitutes acceptance of 
                updated policies. We will notify you of material changes via email or through the service.
              </p>
            </section>

            {/* Contact Section */}
            <section>
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about this Acceptable Use Policy:
              </p>
              <div className="bg-muted/50 p-6 rounded-lg mt-4 space-y-2">
                <p className="text-muted-foreground"><span className="font-semibold">Email:</span> compliance@rocklaunchhosting.com</p>
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
