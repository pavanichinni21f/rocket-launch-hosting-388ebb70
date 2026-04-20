import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Check, Copy, Loader2, ShieldCheck, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

const UPI_VPA = '8884162999-4@ybl';
const PAYEE_NAME = 'KSFoundation';

const refSchema = z.string().regex(/^[A-Za-z0-9]{8,20}$/, 'Enter the 8-20 char UTR/Ref ID from your UPI app');

interface Props { amount: number; productInfo: string; onSuccess?: (ref: string) => void; }

export default function UPICheckout({ amount, productInfo, onSuccess }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [refId, setRefId] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(600);

  const upiUrl = `upi://pay?pa=${encodeURIComponent(UPI_VPA)}&pn=${encodeURIComponent(
    PAYEE_NAME,
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent(productInfo)}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiUrl)}`;

  useEffect(() => {
    if (step !== 2) return;
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [step]);

  const copy = (v: string, label: string) => {
    navigator.clipboard.writeText(v);
    toast.success(`${label} copied`);
  };

  const submitRef = async () => {
    const parsed = refSchema.safeParse(refId.trim());
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setVerifying(true);
    // Simulated verification (replace with edge function call to verify_payment)
    await new Promise((r) => setTimeout(r, 1800));
    setVerifying(false);
    setVerified(true);
    setStep(3);
    onSuccess?.(refId.trim());
    toast.success('Payment verified successfully');
  };

  const fmtTimer = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')}`;

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Secure UPI Checkout</CardTitle>
          <Badge variant="outline" className="gap-1"><ShieldCheck className="h-3 w-3" />Encrypted</Badge>
        </div>
        <div className="flex items-center gap-2 mt-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex items-center gap-2 flex-1">
              <div
                className={`h-8 w-8 rounded-full grid place-items-center text-xs font-semibold transition-colors ${
                  step >= n ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                {step > n ? <Check className="h-4 w-4" /> : n}
              </div>
              {n < 3 && <div className={`h-0.5 flex-1 ${step > n ? 'bg-primary' : 'bg-muted'}`} />}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="space-y-4">
              <div className="rounded-lg border p-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Item</span><span className="font-medium">{productInfo}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Pay To</span><span className="font-medium">{PAYEE_NAME}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="text-2xl font-bold">₹{amount.toLocaleString('en-IN')}</span></div>
              </div>
              <Button className="w-full" size="lg" onClick={() => setStep(2)}>
                <Smartphone className="mr-2 h-4 w-4" />Continue to Pay
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-lg border p-4 grid place-items-center">
                  <img src={qrSrc} alt="UPI QR" className="rounded" />
                  <p className="text-xs text-muted-foreground mt-2">Scan with any UPI app</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">UPI ID</Label>
                    <div className="flex gap-2 mt-1">
                      <Input readOnly value={UPI_VPA} />
                      <Button variant="outline" size="icon" onClick={() => copy(UPI_VPA, 'UPI ID')}><Copy className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Amount</Label>
                    <div className="flex gap-2 mt-1">
                      <Input readOnly value={`₹${amount}`} />
                      <Button variant="outline" size="icon" onClick={() => copy(String(amount), 'Amount')}><Copy className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <Button asChild variant="default" className="w-full">
                    <a href={upiUrl}>Open UPI App</a>
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">Time remaining: <span className="font-mono">{fmtTimer}</span></p>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <Label htmlFor="ref">Step 3: Enter UPI Reference / UTR after paying</Label>
                <div className="flex gap-2">
                  <Input id="ref" placeholder="e.g. 412345678901" value={refId} onChange={(e) => setRefId(e.target.value)} />
                  <Button onClick={submitRef} disabled={verifying}>
                    {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">You'll find this in your UPI app's transaction history.</p>
              </div>
            </motion.div>
          )}

          {step === 3 && verified && (
            <motion.div key="s3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-3">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} className="mx-auto h-16 w-16 rounded-full bg-primary/10 grid place-items-center">
                <Check className="h-8 w-8 text-primary" />
              </motion.div>
              <h3 className="text-xl font-bold">Payment Verified</h3>
              <p className="text-muted-foreground text-sm">Reference: <span className="font-mono">{refId}</span></p>
              <p className="text-muted-foreground text-sm">An invoice has been sent to your email.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
