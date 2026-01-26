import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Rocket, Mail, Lock, User, Smartphone } from 'lucide-react';
import kslogo from '@/assets/kslogo.png';
import AgentsPanel from '@/components/ai/AgentsPanel';
import { GoogleIcon, FacebookIcon, LinkedInIcon, InstagramIcon, AppleIcon, GitHubIcon } from '@/components/auth/SocialIcons';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;
type SocialProvider = 'google' | 'facebook' | 'linkedin_oidc' | 'instagram' | 'apple' | 'github';

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(null);
  const { signIn, signUp, signInWithProvider, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
  });

  const handleLogin = async (data: LoginForm) => {
    setIsLoading(true);
    const { error } = await signIn(data.email, data.password);
    setIsLoading(false);
    if (!error) {
      navigate(from, { replace: true });
    }
  };

  const handleSignup = async (data: SignupForm) => {
    setIsLoading(true);
    const { error } = await signUp(data.email, data.password, data.fullName);
    setIsLoading(false);
    if (!error) {
      navigate(from, { replace: true });
    }
  };

  const handleSocialAuth = async (provider: SocialProvider) => {
    setSocialLoading(provider);
    // Map to supported providers - unsupported ones use mock fallback
    const supportedProviders = ['google', 'apple', 'github'] as const;
    const mappedProvider = supportedProviders.includes(provider as any) 
      ? (provider as 'google' | 'apple' | 'github')
      : 'google'; // Fallback to google for demo
    await signInWithProvider(mappedProvider);
    setSocialLoading(null);
  };

  const socialButtons: Array<{ provider: SocialProvider; icon: React.FC; label: string }> = [
    { provider: 'google', icon: GoogleIcon, label: 'Google' },
    { provider: 'facebook', icon: FacebookIcon, label: 'Facebook' },
    { provider: 'linkedin_oidc', icon: LinkedInIcon, label: 'LinkedIn' },
    { provider: 'instagram', icon: InstagramIcon, label: 'Instagram' },
    { provider: 'apple', icon: AppleIcon, label: 'Apple' },
    { provider: 'github', icon: GitHubIcon, label: 'GitHub' },
  ];

  const SocialButtonsGrid = () => (
    <div className="grid grid-cols-3 gap-2">
      {socialButtons.map(({ provider, icon: Icon, label }) => (
        <Button
          key={provider}
          variant="outline"
          size="sm"
          onClick={() => handleSocialAuth(provider)}
          disabled={socialLoading !== null}
          className="flex items-center justify-center gap-1.5 py-5 border hover:bg-muted/50 transition-colors"
          title={`Sign in with ${label}`}
        >
          {socialLoading === provider ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Icon />
              <span className="text-xs hidden sm:inline">{label}</span>
            </>
          )}
        </Button>
      ))}
    </div>
  );

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
              Welcome to <span className="gradient-text-orange">KSFoundation</span>
            </CardTitle>
            <CardDescription>
              Sign in to manage your hosting accounts
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="login" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-muted">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        {...loginForm.register('email')}
                      />
                    </div>
                    {loginForm.formState.errors.email && (
                      <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        {...loginForm.register('password')}
                      />
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  <Button type="submit" className="w-full btn-rocket" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Rocket className="h-4 w-4 mr-2" />}
                    Sign In
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>

                  <SocialButtonsGrid />

                  <div className="text-center">
                    <Link
                      to="/otp-login"
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Smartphone className="h-4 w-4" />
                      Sign in with OTP instead
                    </Link>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="John Doe"
                        className="pl-10"
                        {...signupForm.register('fullName')}
                      />
                    </div>
                    {signupForm.formState.errors.fullName && (
                      <p className="text-sm text-destructive">{signupForm.formState.errors.fullName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        {...signupForm.register('email')}
                      />
                    </div>
                    {signupForm.formState.errors.email && (
                      <p className="text-sm text-destructive">{signupForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        {...signupForm.register('password')}
                      />
                    </div>
                    {signupForm.formState.errors.password && (
                      <p className="text-sm text-destructive">{signupForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-confirm"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        {...signupForm.register('confirmPassword')}
                      />
                    </div>
                    {signupForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">{signupForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full btn-rocket" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Rocket className="h-4 w-4 mr-2" />}
                    Create Account
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>

                  <SocialButtonsGrid />
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              By signing up, you agree to our{' '}
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
