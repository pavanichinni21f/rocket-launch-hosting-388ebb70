import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, Smartphone, QrCode, Wallet } from 'lucide-react';
import { PaymentProvider, getAvailablePaymentMethods, PLAN_PRICING } from '@/services/indianPaymentService';

interface PaymentMethodSelectorProps {
  selectedPlan: 'starter' | 'business' | 'enterprise';
  billingCycle: 'monthly' | 'yearly';
  onPaymentInitiate: (provider: PaymentProvider, phone: string) => void;
  isLoading: boolean;
}

export function PaymentMethodSelector({
  selectedPlan,
  billingCycle,
  onPaymentInitiate,
  isLoading,
}: PaymentMethodSelectorProps) {
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('upi');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const paymentMethods = getAvailablePaymentMethods();
  const price = PLAN_PRICING[selectedPlan][billingCycle];
  const savings = billingCycle === 'yearly' 
    ? (PLAN_PRICING[selectedPlan].monthly * 12) - PLAN_PRICING[selectedPlan].yearly 
    : 0;

  const validatePhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setPhoneError('Please enter a valid 10-digit phone number');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleSubmit = () => {
    if (!validatePhone(phone)) return;
    onPaymentInitiate(selectedProvider, phone);
  };

  const getProviderIcon = (providerId: PaymentProvider) => {
    switch (providerId) {
      case 'payu':
        return <CreditCard className="h-5 w-5" />;
      case 'upi':
        return <QrCode className="h-5 w-5" />;
      case 'gpay':
        return <Wallet className="h-5 w-5" />;
      case 'cashfree':
        return <Smartphone className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Choose Payment Method
        </CardTitle>
        <CardDescription>
          Select your preferred payment option
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Order Summary */}
        <div className="p-4 bg-muted rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium capitalize">{selectedPlan} Plan</span>
            <Badge variant="outline">{billingCycle}</Badge>
          </div>
          <div className="flex justify-between items-center text-2xl font-bold">
            <span>Total</span>
            <span className="text-primary">₹{price.toLocaleString('en-IN')}</span>
          </div>
          {savings > 0 && (
            <p className="text-sm text-green-600">
              You save ₹{savings.toLocaleString('en-IN')} with yearly billing!
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter 10-digit mobile number"
            value={phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 10);
              setPhone(value);
              if (value.length === 10) validatePhone(value);
            }}
            className={phoneError ? 'border-destructive' : ''}
          />
          {phoneError && (
            <p className="text-sm text-destructive">{phoneError}</p>
          )}
        </div>

        {/* Payment Methods */}
        <RadioGroup
          value={selectedProvider}
          onValueChange={(value) => setSelectedProvider(value as PaymentProvider)}
          className="space-y-3"
        >
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedProvider === method.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedProvider(method.id)}
            >
              <RadioGroupItem value={method.id} id={method.id} />
              <div className="flex items-center gap-3 flex-1">
                <div className="text-2xl">{method.icon}</div>
                <div>
                  <Label htmlFor={method.id} className="font-medium cursor-pointer">
                    {method.name}
                  </Label>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </div>
              </div>
              {getProviderIcon(method.id)}
            </div>
          ))}
        </RadioGroup>

        {/* Pay Button */}
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !phone || phone.length !== 10}
          className="w-full btn-rocket"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Pay ₹{price.toLocaleString('en-IN')}
            </>
          )}
        </Button>

        {/* Security Notice */}
        <p className="text-xs text-center text-muted-foreground">
          🔒 Secured by 256-bit SSL encryption. Your payment information is safe.
        </p>
      </CardContent>
    </Card>
  );
}

export default PaymentMethodSelector;
