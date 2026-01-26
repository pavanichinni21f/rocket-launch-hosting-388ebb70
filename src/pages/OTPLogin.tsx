import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Loader2, ArrowLeft, Mail, Phone, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import kslogo from '@/assets/kslogo.png';
import AgentsPanel from '@/components/ai/AgentsPanel';

type OTPStep = 'input' | 'verify';
type OTPType = 'email' | 'phone';

export default function OTPLogin() {
  const [step, setStep] = useState<OTPStep>('input');
  const [otpType, setOtpType] = useState<OTPType>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^(\+91)?[6-9]\d{9}$/.test(phone.replace(/\s/g, ''));

  const handleSendOTP = async () => {
    if (otpType === 'email' && !validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (otpType === 'phone' && !validatePhone(phone)) {
      toast.error('Please enter a valid Indian phone number');
      return;
    }

    setIsLoading(true);
    try {
      if (otpType === 'email') {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: `${window.location.origin}/dashboard` }
        });
        if (error) throw error;
        toast.success('OTP sent to your email!');
      } else {
        // Phone OTP - using mock for demo since Twilio needs configuration
        // In production, this would call Supabase phone auth
        toast.success('OTP sent to your phone! (Demo: use 123456)');
      }
      setStep('verify');
      setCountdown(60);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      if (otpType === 'email') {
        const { error } = await supabase.auth.verifyOtp({
          email,
          token: otp,
          type: 'email'
        });
        if (error) throw error;
        toast.success('Logged in successfully!');
        navigate('/dashboard', { replace: true });
      } else {
        // Phone OTP verification - mock for demo
        if (otp === '123456') {
          toast.success('Logged in successfully! (Demo mode)');
          navigate('/dashboard', { replace: true });
        } else {
          throw new Error('Invalid OTP. Demo code is 123456');
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    await handleSendOTP();
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="absolute inset-0 bg-hero-pattern opacity-50" />
      <div className="absolute inset-0 bg-grid-pattern bg-[size:40px_40px] opacity-10" />

      <div className="relative z-10 mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-8">
        <Card className="w-full relative glass-card border-border/50">
          <CardHeader className="text-center space-y-4">
            <Link to="/" className="flex justify-center">
              <img src={kslogo} alt="KSFoundation" className="h-16 w-auto" />
            </Link>
            <CardTitle className="text-2xl font-bold">
              <span className="gradient-text-orange">OTP Login</span>
            </CardTitle>
            <CardDescription>
              Sign in with a one-time password sent to your email or phone
            </CardDescription>
          </CardHeader>

          <CardContent>
            <AnimatePresence mode="wait">
              {step === 'input' ? (
                <motion.div
                  key="input"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <Tabs value={otpType} onValueChange={(v) => setOtpType(v as OTPType)}>
                    <TabsList className="grid w-full grid-cols-2 bg-muted">
                      <TabsTrigger value="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </TabsTrigger>
                      <TabsTrigger value="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="email" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-12"
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="phone" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number (India)</Label>
                        <div className="flex gap-2">
                          <div className="flex items-center px-3 bg-muted rounded-lg border">
                            <span className="text-sm font-medium">+91</span>
                          </div>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="9876543210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            className="h-12 flex-1"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Demo mode: Any valid number works, OTP is 123456
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <Button onClick={handleSendOTP} className="w-full btn-rocket h-12" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    ) : (
                      <Rocket className="h-5 w-5 mr-2" />
                    )}
                    Send OTP
                  </Button>

                  <div className="text-center">
                    <Link to="/auth" className="text-sm text-muted-foreground hover:text-primary">
                      ← Back to regular login
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="verify"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <Button
                    variant="ghost"
                    onClick={() => { setStep('input'); setOtp(''); }}
                    className="mb-4"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>

                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Enter the 6-digit code sent to
                    </p>
                    <p className="font-medium">
                      {otpType === 'email' ? email : `+91 ${phone}`}
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <Button onClick={handleVerifyOTP} className="w-full btn-rocket h-12" disabled={isLoading || otp.length !== 6}>
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    ) : (
                      <Rocket className="h-5 w-5 mr-2" />
                    )}
                    Verify & Sign In
                  </Button>

                  <div className="text-center">
                    <button
                      onClick={handleResendOTP}
                      disabled={countdown > 0}
                      className="text-sm text-muted-foreground hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              By signing in, you agree to our{' '}
              <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            </div>
          </CardContent>
        </Card>

        <div className="hidden md:block">
          <AgentsPanel />
        </div>
      </div>
    </div>
  );
}
