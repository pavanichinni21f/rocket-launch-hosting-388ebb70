import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import kslogo from '@/assets/kslogo.png';

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');

      if (!token || type !== 'signup') {
        setError('Invalid verification link');
        setIsLoading(false);
        return;
      }

      try {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup'
        });

        if (error) {
          setError(error.message);
          toast.error('Verification failed');
        } else {
          setIsVerified(true);
          toast.success('Email verified successfully!');
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        }
      } catch (err) {
        setError('An unexpected error occurred');
        toast.error('Verification failed');
      }

      setIsLoading(false);
    };

    verifyEmail();
  }, [searchParams, navigate]);

  const handleResendVerification = async () => {
    const email = searchParams.get('email');
    if (!email) {
      toast.error('Email not found');
      return;
    }

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Verification email sent!');
      }
    } catch (err) {
      toast.error('Failed to resend verification email');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-hero-pattern opacity-50" />
      <div className="absolute inset-0 bg-grid-pattern bg-[size:40px_40px] opacity-10" />

      <Card className="w-full max-w-md relative z-10 glass-card border-border/50">
        <CardHeader className="text-center space-y-4">
          <Link to="/" className="flex justify-center">
            <img src={kslogo} alt="KSFoundation" className="h-16 w-auto" />
          </Link>
          <CardTitle className="text-2xl font-bold">
            Email Verification
          </CardTitle>
          <CardDescription>
            {isLoading ? 'Verifying your email...' : 'Please check your email and click the verification link.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-center text-muted-foreground">
                Verifying your email address...
              </p>
            </div>
          ) : isVerified ? (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <p className="text-center text-muted-foreground">
                Your email has been verified successfully! Redirecting to dashboard...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center space-y-4">
              <XCircle className="h-12 w-12 text-red-500" />
              <p className="text-center text-muted-foreground text-red-600">
                {error}
              </p>
              <Button onClick={handleResendVerification} variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Resend verification email
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <Mail className="h-12 w-12 text-primary" />
              <p className="text-center text-muted-foreground">
                We've sent a verification link to your email address. Please click the link to verify your account.
              </p>
              <Button onClick={handleResendVerification} variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Resend verification email
              </Button>
            </div>
          )}

          <div className="text-center text-sm text-muted-foreground">
            <Link to="/auth" className="text-primary hover:underline">
              Back to sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}