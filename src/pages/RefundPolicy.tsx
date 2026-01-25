import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function RefundPolicy() {
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
                Refund <span className="gradient-text-orange">Policy</span>
              </h1>
              <p className="text-muted-foreground">Last updated: January 2024</p>
            </div>

            <Card>
              <CardContent className="py-8 prose prose-neutral dark:prose-invert max-w-none">
                <h2>30-Day Money-Back Guarantee</h2>
                <p>
                  At KSFoundation, we're confident in the quality of our services. That's why we offer a 
                  30-day money-back guarantee on all new hosting plans.
                </p>

                <h2>Eligible Services</h2>
                <ul>
                  <li>Shared Hosting Plans</li>
                  <li>WordPress Hosting Plans</li>
                  <li>Cloud Hosting Plans</li>
                  <li>VPS Hosting (First month only)</li>
                </ul>

                <h2>Non-Refundable Services</h2>
                <ul>
                  <li>Domain registrations and renewals</li>
                  <li>SSL certificates</li>
                  <li>Dedicated servers</li>
                  <li>Add-on services and upgrades</li>
                  <li>Setup fees (if applicable)</li>
                </ul>

                <h2>How to Request a Refund</h2>
                <ol>
                  <li>Log in to your KSFoundation account</li>
                  <li>Navigate to Support → New Ticket</li>
                  <li>Select "Billing" as the department</li>
                  <li>Choose "Refund Request" as the subject</li>
                  <li>Provide your reason for cancellation</li>
                </ol>

                <h2>Processing Time</h2>
                <p>
                  Refunds are typically processed within 5-7 business days. The refund will be 
                  credited to the original payment method used for the purchase.
                </p>

                <h2>Partial Refunds</h2>
                <p>
                  For services used beyond the 30-day period, we may offer a prorated refund 
                  for the unused portion of your subscription at our discretion.
                </p>

                <h2>Chargebacks</h2>
                <p>
                  If you file a chargeback with your bank without first contacting us, your account 
                  will be suspended and you may be responsible for additional fees. We encourage 
                  you to reach out to our support team first.
                </p>

                <h2>Contact Us</h2>
                <p>
                  If you have any questions about our refund policy, please contact our billing 
                  department at billing@ksfoundation.in or through the support portal.
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
