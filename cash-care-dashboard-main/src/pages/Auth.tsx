import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Mail, Lock, User, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export default function Auth() {
  const { user, loading, signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Password reset link sent! Check your email.');
          setIsForgotPassword(false);
        }
      } else if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Welcome back!');
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Account created successfully!');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30">
            <Wallet className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">FinFlow</h1>
          <p className="mt-2 text-muted-foreground">Your personal banking dashboard</p>
        </motion.div>

        {/* Auth card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8"
        >
          {isForgotPassword ? (
            <>
              <button onClick={() => setIsForgotPassword(false)} className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to Sign In
              </button>
              <h2 className="mb-2 font-display text-xl font-bold text-foreground">Reset Password</h2>
              <p className="mb-6 text-sm text-muted-foreground">Enter your email and we'll send you a reset link.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                  </div>
                </div>
                <Button type="submit" variant="glow" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : (<>Send Reset Link <ArrowRight className="ml-2 h-5 w-5" /></>)}
                </Button>
              </form>
            </>
          ) : (
            <>
              {/* Toggle tabs */}
              <div className="mb-6 flex rounded-lg bg-muted p-1">
                <button className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${isLogin ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`} onClick={() => setIsLogin(true)}>Sign In</button>
                <button className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${!isLogin ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`} onClick={() => setIsLogin(false)}>Sign Up</button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div key="fullName" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-2 overflow-hidden">
                      <Label htmlFor="fullName">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input id="fullName" type="text" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} className="pl-10" required={!isLogin} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {isLogin && (
                      <button type="button" onClick={() => setIsForgotPassword(true)} className="text-xs text-primary hover:underline">Forgot password?</button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required minLength={6} />
                  </div>
                </div>

                <Button type="submit" variant="glow" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : (<>{isLogin ? 'Sign In' : 'Create Account'} <ArrowRight className="ml-2 h-5 w-5" /></>)}
                </Button>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
