import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  Check,
  Zap,
  Shield,
  CreditCard,
  Receipt,
  ArrowRight,
  Crown,
  Rocket,
  Loader2,
  IndianRupee,
  Smartphone,
  QrCode,
} from 'lucide-react';
import { getSubscription, getInvoices, createBillingPortalSession } from '@/services/paymentService';
import { addToCart } from '@/services/cartService';
import { 
  initiateIndianPayment, 
  redirectToPayU, 
  openUPIApp, 
  openGPay,
  type PaymentProvider 
} from '@/services/indianPaymentService';
import { useNavigate } from 'react-router-dom';
import type { Subscription, Invoice } from '@/services/paymentService';

const plans = [
  {
    name: 'Free Trial',
    price: 0,
    description: 'Perfect for getting started',
    features: [
      '1 Hosting Account',
      '1GB Storage',
      '10GB Bandwidth',
      'Free SSL Certificate',
      'Email Support',
    ],
    icon: Rocket,
    popular: false,
    planId: 'free' as const,
  },
  {
    name: 'Starter',
    price: 999,
    description: 'Best for personal projects',
    features: [
      '3 Hosting Accounts',
      '25GB Storage',
      '100GB Bandwidth',
      'Free SSL & CDN',
      '1 Free Domain',
      'Daily Backups',
      'Priority Support',
    ],
    icon: Zap,
    popular: false,
    planId: 'starter' as const,
  },
  {
    name: 'Business',
    price: 1999,
    description: 'For growing businesses',
    features: [
      'Unlimited Hosting Accounts',
      '100GB SSD Storage',
      'Unlimited Bandwidth',
      'Free SSL & CDN',
      '3 Free Domains',
      'Daily Backups',
      'Priority Support',
      'Staging Environment',
      'Advanced Analytics',
    ],
    icon: Crown,
    popular: true,
    planId: 'business' as const,
  },
  {
    name: 'Enterprise',
    price: 19999,
    description: 'For large scale operations',
    features: [
      'Everything in Business',
      '500GB NVMe Storage',
      'Dedicated Resources',
      'Custom Domains',
      'White Label',
      'API Access',
      '24/7 Phone Support',
      'SLA Guarantee',
      'Custom Integrations',
    ],
    icon: Shield,
    popular: false,
    planId: 'enterprise' as const,
  },
];

const paymentMethods: Array<{
  id: PaymentProvider;
  name: string;
  icon: React.ReactNode;
  description: string;
}> = [
  { id: 'payu', name: 'PayU', icon: <CreditCard className="h-5 w-5" />, description: 'Cards, Net Banking, Wallets' },
  { id: 'upi', name: 'UPI', icon: <QrCode className="h-5 w-5" />, description: 'Any UPI App' },
  { id: 'gpay', name: 'Google Pay', icon: <Smartphone className="h-5 w-5" />, description: 'Quick Payment' },
];

export default function Billing() {
  const { user, profile } = useAuth();
  const [searchParams] = useSearchParams();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoiceList, setInvoiceList] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentProvider>('payu');
  const navigate = useNavigate();

  // Check for payment status from URL
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'success') {
      toast.success('Payment successful! Your subscription has been upgraded.');
    } else if (paymentStatus === 'failed') {
      toast.error('Payment failed. Please try again.');
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      loadBillingData();
    }
  }, [user]);

  const loadBillingData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [subRes, invoiceRes] = await Promise.all([
        getSubscription(user.id),
        getInvoices(user.id),
      ]);

      if (subRes.data) {
        setSubscription(subRes.data);
      }
      if (invoiceRes.data) {
        setInvoiceList(invoiceRes.data);
      }
    } catch (error) {
      toast.error('Failed to load billing information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async (plan: typeof plans[0]) => {
    if (!user || !profile) {
      toast.error('You must be logged in to upgrade');
      return;
    }

    if (plan.planId === 'free') {
      toast.info('You are already on the free plan');
      return;
    }

    setIsUpgrading(true);
    
    try {
      const response = await initiateIndianPayment({
        provider: selectedPaymentMethod,
        amount: plan.price,
        productInfo: `${plan.name} Plan - Monthly Subscription`,
        customerName: profile.full_name || user.email?.split('@')[0] || 'Customer',
        email: user.email || '',
        phone: profile.phone || '',
        userId: user.id,
        plan: plan.planId,
      });

      if (!response.success) {
        toast.error(response.error || 'Failed to initiate payment');
        setIsUpgrading(false);
        return;
      }

      // Handle different payment methods
      if (selectedPaymentMethod === 'payu' && response.paymentUrl && response.params) {
        redirectToPayU(response.paymentUrl, response.params);
      } else if (selectedPaymentMethod === 'upi' && response.upiUrl) {
        openUPIApp(response.upiUrl);
        toast.info('Opening UPI app...');
      } else if (selectedPaymentMethod === 'gpay' && response.gpayDeepLink) {
        openGPay(response.gpayDeepLink);
        toast.info('Opening Google Pay...');
      } else if (response.mockMode) {
        // Mock mode - simulate success
        toast.success('Demo payment successful!');
        navigate('/billing?payment=success&mock=true');
      }
    } catch (e) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleManageBilling = async () => {
    if (!user) {
      toast.error('You must be logged in');
      return;
    }

    try {
      const { error, data } = await createBillingPortalSession(user.id);
      if (error || !data?.url) {
        toast.error('Failed to access billing portal');
        return;
      }
      window.location.href = data.url;
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const currentPlan = profile?.subscription_plan || 'free';

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Billing & Plans</h1>
            <p className="text-muted-foreground mt-1">
              Manage your subscription and view billing history
            </p>
          </div>
          
          <div className="flex items-center gap-2 p-1 rounded-lg bg-muted">
            {paymentMethods.map((method) => (
              <Button
                key={method.id}
                variant={selectedPaymentMethod === method.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedPaymentMethod(method.id)}
                className="flex items-center gap-2"
              >
                {method.icon}
                {method.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Current Plan */}
        <Card className="gradient-border">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Plan</p>
                  <p className="text-2xl font-bold capitalize">{currentPlan}</p>
                  {subscription && subscription.cancel_at_period_end && (
                    <p className="text-xs text-destructive mt-1">Canceling on {format(subscription.current_period_end, 'MMM d, yyyy')}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Next billing date</p>
                  <p className="font-medium">
                    {subscription ? format(subscription.current_period_end, 'MMMM d, yyyy') : 'N/A'}
                  </p>
                </div>
                <Button variant="outline" onClick={handleManageBilling}>
                  Manage <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plans */}
        <div id="plans">
          <h2 className="text-2xl font-bold mb-6">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative ${
                  plan.popular ? 'border-primary shadow-lg shadow-primary/20' : ''
                } ${currentPlan === plan.planId ? 'ring-2 ring-success' : ''}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                    Most Popular
                  </Badge>
                )}
                {currentPlan === plan.planId && (
                  <Badge className="absolute -top-3 right-4 bg-success">
                    Current
                  </Badge>
                )}
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto p-3 rounded-full bg-muted w-fit mb-2">
                    <plan.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">₹{plan.price.toLocaleString('en-IN')}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-3 text-left mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-success flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${plan.popular ? 'btn-rocket' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    disabled={currentPlan === plan.planId || isUpgrading}
                    onClick={() => handleUpgrade(plan)}
                  >
                    {isUpgrading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {currentPlan === plan.planId
                      ? 'Current Plan'
                      : plan.price === 0
                      ? 'Get Started'
                      : `Pay ₹${plan.price.toLocaleString('en-IN')}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Method
            </CardTitle>
            <CardDescription>Select your preferred payment method</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                    selectedPaymentMethod === method.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-muted-foreground/50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${selectedPaymentMethod === method.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    {method.icon}
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{method.name}</p>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Billing History
            </CardTitle>
            <CardDescription>View and download your invoices</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : invoiceList.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No invoices yet
              </p>
            ) : (
              <div className="space-y-4">
                {invoiceList.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <Receipt className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{invoice.id}</p>
                        <p className="text-sm text-muted-foreground">{format(invoice.created_at, 'MMM d, yyyy')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">₹{(invoice.amount / 100).toLocaleString('en-IN')}</span>
                      <Badge variant="outline" className={invoice.status === 'paid' ? 'text-success border-success' : 'text-destructive border-destructive'}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </Badge>
                      {invoice.invoice_pdf && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={invoice.invoice_pdf} target="_blank" rel="noopener noreferrer">
                            Download
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}