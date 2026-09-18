// src/pages/AuthPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import {
  DEMO_INVALID_MESSAGE,
  findDemoCredential,
} from '@/lib/demoAuth';
import { ShieldCheck, Sparkles, Users, KeyRound } from 'lucide-react';
import brandLogoWhite from '@/assets/logo/logo-primary-white.png';
import brandLogo from '@/assets/logo/logo-primary.png';

export default function AuthPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, authReady, signIn, signUp, resetPassword } = useAuth();

  // Support redirect via location.state.from (Navigate state) or query param ?redirect=/path
  const params = new URLSearchParams(location.search);
  const redirectParam = params.get('redirect');
  const redirectTo = location.state?.from ?? redirectParam ?? '/portal';

  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);

  // login form
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // signup form
  const [name, setName] = useState('');
  const [signEmail, setSignEmail] = useState('');
  const [signPassword, setSignPassword] = useState('');

  useEffect(() => {
    if (authReady && user) navigate(redirectTo, { replace: true });
  }, [authReady, user, navigate, redirectTo]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    const username = loginUsername.trim();
    if (!username || !loginPassword) {
      toast({
        title: 'Missing login details',
        description: 'Please enter the demo username and password.',
        variant: 'destructive',
      });
      return;
    }

    const demoMatch = findDemoCredential(username, loginPassword);
    if (!demoMatch) {
      toast({
        title: 'Login failed',
        description: DEMO_INVALID_MESSAGE,
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      await signIn(username, loginPassword);
      toast({
        title: 'Demo access granted',
        description: `Signed in to the ${demoMatch.role} demo portal.`,
      });
      navigate(demoMatch.redirect, { replace: true });
    } catch (err) {
      toast({
        title: 'Login failed',
        description: humanizeAuthError(err),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const trimmedName = name.trim();
    const trimmedEmail = signEmail.trim();

    try {
      await signUp(trimmedEmail, signPassword, trimmedName);

      toast({
        title: 'Account created!',
        description: 'You are now signed in.',
      });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast({
        title: 'Sign up failed',
        description: humanizeAuthError(err),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    toast({
      title: 'Demo login only',
      description: 'Use the demo username and password provided above.',
    });
  };

  const trustPoints = [
    { icon: ShieldCheck, text: 'Background-checked, insured cleaning pros' },
    { icon: Sparkles, text: 'Transparent, upfront estimates every time' },
    { icon: Users, text: 'Trusted across Jacksonville & Duval County' },
  ];

  return (
    <div className="min-h-[90vh] grid grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Brand panel */}
      <div className="hidden lg:flex flex-col justify-between bg-navy-900 text-white p-10 xl:p-14 relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 20%, hsl(203 64% 43% / 0.35), transparent 55%)',
          }}
          aria-hidden="true"
        />
        <Link to="/" className="relative flex items-center gap-3">
          <img src={brandLogoWhite} alt="CleanPro Demo" className="h-12 w-auto" />
        </Link>

        <div className="relative">
          <h2 className="font-display text-3xl xl:text-4xl font-bold leading-tight mb-4">
            Your home, your account, your schedule.
          </h2>
          <p className="text-white/70 text-sm xl:text-base mb-8 max-w-md">
            Sign in to manage bookings, view invoices, and message your cleaning
            team — or create an account to book your first visit.
          </p>
          <ul className="space-y-4">
            {trustPoints.map((point) => (
              <li key={point.text} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-md bg-white/10 flex items-center justify-center">
                  <point.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm text-white/80 pt-1.5">{point.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/40">
          Demo product for portfolio purposes — no real accounts are created.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-4 sm:px-6 py-12 md:py-16">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Mobile brand mark */}
          <div className="flex lg:hidden justify-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2">
              <img src={brandLogo} alt="CleanPro Demo" className="h-10 w-auto" />
            </Link>
          </div>

          {/* Demo credentials panel — kept prominent and easy to find */}
          <div className="mb-6 rounded-xl border-2 border-primary bg-accent p-4 text-sm text-accent-foreground">
            <p className="font-bold mb-2 flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-primary" />
              Demo Access Credentials
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg bg-card p-3 border border-border">
                <p className="font-semibold text-foreground mb-1">Client Portal</p>
                <p>Username: <code className="bg-secondary px-1 rounded">clientdemo</code></p>
                <p>Password: <code className="bg-secondary px-1 rounded">demo123</code></p>
              </div>
              <div className="rounded-lg bg-card p-3 border border-border">
                <p className="font-semibold text-foreground mb-1">Admin Portal</p>
                <p>Username: <code className="bg-secondary px-1 rounded">admindemo</code></p>
                <p>Password: <code className="bg-secondary px-1 rounded">demo123</code></p>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground italic">
              This website is a demonstration environment. No real accounts, bookings, payments, or administrative actions are performed.
            </p>
          </div>

          <div className="text-center mb-6">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              Log in or create your account
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              <span className="font-medium text-foreground">Returning customers:</span> Sign in.{' '}
              <span className="font-medium text-foreground">New customers:</span> Create your
              account to book.
            </p>
          </div>

          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup">
                Create Account
              </TabsTrigger>
            </TabsList>

            {/* LOGIN */}
            <TabsContent value="login">
              <Card className="shadow-card border-border bg-card">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-display font-bold text-foreground">
                    Welcome back
                  </CardTitle>
                  <CardDescription>
                    Access your bookings and account details.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin} autoComplete="on">
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-username">Username</Label>
                      <Input
                        id="login-username"
                        name="username"
                        type="text"
                        value={loginUsername}
                        onChange={(e) => setLoginUsername(e.target.value)}
                        placeholder="Username"
                        required
                        autoComplete="username"
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        name="password"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Password"
                        required
                        autoComplete="current-password"
                        className="bg-background"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot password?
                      </button>
                      <button
                        type="button"
                        onClick={() => setTab('signup')}
                        className="text-sm text-muted-foreground hover:underline"
                      >
                        New customer? Create your account
                      </button>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-semibold"
                    >
                      {loading ? 'Please wait…' : 'Sign In'}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            {/* SIGNUP */}
            <TabsContent value="signup">
              <Card className="shadow-card border-border bg-card">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-display font-bold text-foreground">
                    Create Account
                  </CardTitle>
                  <CardDescription>
                    Join to easily manage your bookings.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSignup} autoComplete="on">
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input
                        id="signup-name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Doe"
                        required
                        autoComplete="name"
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        value={signEmail}
                        onChange={(e) => setSignEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        autoComplete="email"
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        name="password"
                        type="password"
                        value={signPassword}
                        onChange={(e) => setSignPassword(e.target.value)}
                        placeholder="Create a password"
                        required
                        minLength={6}
                        autoComplete="new-password"
                        className="bg-background"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-semibold"
                    >
                      {loading ? 'Please wait…' : 'Create Account'}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>

          <p className="text-center text-sm text-muted-foreground mt-6">
            By continuing you agree to our{' '}
            <Link to="/terms-of-service" className="underline hover:text-foreground">
              Terms
            </Link>{' '}
            and{' '}
            <Link to="/privacy-policy" className="underline hover:text-foreground">
              Privacy Policy
            </Link>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function humanizeAuthError(err) {
  const code = String(err?.code || '').replace('auth/', '');
  switch (code) {
    case 'invalid-credential':
    case 'wrong-password':
    case 'invalid-demo-credentials':
      return DEMO_INVALID_MESSAGE;
    case 'user-not-found':
      return 'No account found with that email.';
    case 'email-already-in-use':
      return 'That email is already registered.';
    case 'weak-password':
      return 'Password should be at least 6 characters.';
    default:
      return err?.message || 'Something went wrong.';
  }
}
