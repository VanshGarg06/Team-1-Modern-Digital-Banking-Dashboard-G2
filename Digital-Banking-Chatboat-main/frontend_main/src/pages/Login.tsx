import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Shield, Building2, Phone, User } from 'lucide-react';
import VantaBackground from '@/components/VantaBackground';
import { useAuth } from '@/contexts/AuthContext';

type AuthTab = 'login' | 'signup';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    const { error } = await signIn(loginEmail, loginPassword);
    
    if (error) {
      setIsLoading(false);
      setErrorMessage(error.message);
      return;
    }
    
    setSuccessMessage('Login successful! Redirecting to your dashboard...');
    setShowSuccess(true);
    
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (signupPassword !== signupConfirm) {
      setErrorMessage('Passwords do not match');
      return;
    }
    
    if (!acceptTerms) {
      setErrorMessage('Please accept the terms and conditions');
      return;
    }
    
    setIsLoading(true);
    
    const { error } = await signUp(signupEmail, signupPassword, signupName, signupPhone);
    
    if (error) {
      setIsLoading(false);
      setErrorMessage(error.message);
      return;
    }
    
    setSuccessMessage('Account created successfully! Please check your email to verify your account, then log in.');
    setShowSuccess(true);
    
    // Reset form and switch to login tab
    setTimeout(() => {
      setIsLoading(false);
      setActiveTab('login');
      setShowSuccess(false);
      setSignupName('');
      setSignupEmail('');
      setSignupPhone('');
      setSignupPassword('');
      setSignupConfirm('');
      setAcceptTerms(false);
    }, 3000);
  };

  return (
    <VantaBackground>
      <div className="min-h-screen flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-glass-border px-5 py-5">
          <div className="container max-w-6xl mx-auto flex justify-between items-center">
            <a href="#" className="flex items-center gap-2 text-2xl font-bold text-foreground hover:-translate-y-0.5 transition-transform">
              <Building2 className="w-8 h-8 text-foreground" />
              <span className="flex flex-col leading-none">
                <span className="text-2xl font-bold">DB</span>
                <span className="text-sm font-medium text-muted-foreground tracking-wider">Digital Banking</span>
              </span>
            </a>
            <nav className="hidden md:flex gap-8">
              {['Home', 'About', 'Services', 'Contact'].map((item, i) => (
                <a
                  key={item}
                  href="#"
                  className={`font-medium transition-colors hover:text-foreground ${
                    i === 0 ? 'text-foreground relative after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-foreground after:to-muted-foreground after:rounded' : 'text-muted-foreground'
                  }`}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-5 py-10">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-secondary/95 rounded-2xl border border-glass-border overflow-hidden shadow-2xl"
            >
              {/* Tabs */}
              <div className="flex border-b border-glass-border">
                <button
                  onClick={() => { setActiveTab('login'); setErrorMessage(''); }}
                  className={`flex-1 py-4 text-center font-medium transition-all ${
                    activeTab === 'login'
                      ? 'bg-glass-hover text-foreground border-b-2 border-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-glass-bg'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => { setActiveTab('signup'); setErrorMessage(''); }}
                  className={`flex-1 py-4 text-center font-medium transition-all ${
                    activeTab === 'signup'
                      ? 'bg-glass-hover text-foreground border-b-2 border-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-glass-bg'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'login' ? (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Login Header */}
                    <div className="px-8 py-8 bg-gradient-to-r from-white/5 to-transparent border-b border-glass-border text-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-foreground to-muted-foreground" />
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                        Welcome to DB Digital Banking
                      </h2>
                      <p className="text-muted-foreground text-sm mt-2">
                        Sign in to access your secure digital banking dashboard
                      </p>
                    </div>

                    {/* Login Form */}
                    <div className="p-8">
                      <AnimatePresence>
                        {showSuccess && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-6 p-4 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 flex items-center gap-3"
                          >
                            <Shield className="w-5 h-5" />
                            {successMessage}
                          </motion.div>
                        )}
                        {errorMessage && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 flex items-center gap-3"
                          >
                            <Shield className="w-5 h-5" />
                            {errorMessage}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground" />
                            <input
                              type="email"
                              value={loginEmail}
                              onChange={(e) => setLoginEmail(e.target.value)}
                              placeholder="Enter your email address"
                              className="w-full px-12 py-4 bg-background/80 border border-glass-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground focus:ring-2 focus:ring-white/10 transition-all"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                            Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground" />
                            <input
                              type={showLoginPassword ? 'text' : 'password'}
                              value={loginPassword}
                              onChange={(e) => setLoginPassword(e.target.value)}
                              placeholder="Enter your password"
                              className="w-full px-12 py-4 bg-background/80 border border-glass-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground focus:ring-2 focus:ring-white/10 transition-all"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowLoginPassword(!showLoginPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              className="w-4 h-4 accent-foreground cursor-pointer"
                            />
                            <span className="text-sm text-muted-foreground">Remember me</span>
                          </label>
                          <Link
                            to="/forgot-password"
                            className="text-sm text-foreground hover:text-muted-foreground font-medium transition-colors"
                          >
                            Forgot password?
                          </Link>
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full py-4 bg-gradient-to-r from-foreground to-muted-foreground text-background font-semibold rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full mx-auto"
                            />
                          ) : (
                            'Sign In to DB Banking'
                          )}
                        </button>
                      </form>

                      <div className="mt-6 p-4 rounded-xl bg-glass-bg border border-glass-border flex items-center gap-3">
                        <Shield className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        <p className="text-xs text-muted-foreground">
                          DB Digital Banking uses advanced encryption to protect your financial data.
                        </p>
                      </div>

                      <p className="text-center mt-6 text-muted-foreground text-sm">
                        Don't have a DB Digital Banking account?{' '}
                        <button
                          onClick={() => setActiveTab('signup')}
                          className="text-foreground hover:underline font-medium"
                        >
                          Sign up here
                        </button>
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="signup"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Signup Header */}
                    <div className="px-8 py-8 bg-gradient-to-r from-white/5 to-transparent border-b border-glass-border text-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-foreground to-muted-foreground" />
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                        Create DB Digital Banking Account
                      </h2>
                      <p className="text-muted-foreground text-sm mt-2">
                        Join DB Digital Banking for a secure and modern banking experience
                      </p>
                    </div>

                    {/* Signup Form */}
                    <div className="p-8">
                      <AnimatePresence>
                        {showSuccess && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-6 p-4 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 flex items-center gap-3"
                          >
                            <Shield className="w-5 h-5" />
                            {successMessage}
                          </motion.div>
                        )}
                        {errorMessage && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 flex items-center gap-3"
                          >
                            <Shield className="w-5 h-5" />
                            {errorMessage}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <form onSubmit={handleSignup} className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                            Full Name
                          </label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground" />
                            <input
                              type="text"
                              value={signupName}
                              onChange={(e) => setSignupName(e.target.value)}
                              placeholder="Enter your full name"
                              className="w-full px-12 py-4 bg-background/80 border border-glass-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground focus:ring-2 focus:ring-white/10 transition-all"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground" />
                            <input
                              type="email"
                              value={signupEmail}
                              onChange={(e) => setSignupEmail(e.target.value)}
                              placeholder="Enter your email address"
                              className="w-full px-12 py-4 bg-background/80 border border-glass-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground focus:ring-2 focus:ring-white/10 transition-all"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                            Phone Number
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground" />
                            <input
                              type="tel"
                              value={signupPhone}
                              onChange={(e) => setSignupPhone(e.target.value)}
                              placeholder="Enter your phone number"
                              className="w-full px-12 py-4 bg-background/80 border border-glass-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground focus:ring-2 focus:ring-white/10 transition-all"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                            Create Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground" />
                            <input
                              type={showSignupPassword ? 'text' : 'password'}
                              value={signupPassword}
                              onChange={(e) => setSignupPassword(e.target.value)}
                              placeholder="Create a strong password"
                              className="w-full px-12 py-4 bg-background/80 border border-glass-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground focus:ring-2 focus:ring-white/10 transition-all"
                              required
                              minLength={6}
                            />
                            <button
                              type="button"
                              onClick={() => setShowSignupPassword(!showSignupPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showSignupPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground" />
                            <input
                              type={showSignupPassword ? 'text' : 'password'}
                              value={signupConfirm}
                              onChange={(e) => setSignupConfirm(e.target.value)}
                              placeholder="Confirm your password"
                              className="w-full px-12 py-4 bg-background/80 border border-glass-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground focus:ring-2 focus:ring-white/10 transition-all"
                              required
                            />
                          </div>
                        </div>

                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={acceptTerms}
                            onChange={(e) => setAcceptTerms(e.target.checked)}
                            className="w-4 h-4 mt-1 accent-foreground cursor-pointer"
                          />
                          <span className="text-sm text-muted-foreground">
                            I agree to the{' '}
                            <a href="#" className="text-foreground hover:underline">Terms of Service</a>
                            {' '}and{' '}
                            <a href="#" className="text-foreground hover:underline">Privacy Policy</a>
                          </span>
                        </label>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full py-4 bg-gradient-to-r from-foreground to-muted-foreground text-background font-semibold rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full mx-auto"
                            />
                          ) : (
                            'Create DB Banking Account'
                          )}
                        </button>
                      </form>

                      <p className="text-center mt-6 text-muted-foreground text-sm">
                        Already have an account?{' '}
                        <button
                          onClick={() => setActiveTab('login')}
                          className="text-foreground hover:underline font-medium"
                        >
                          Sign in here
                        </button>
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-glass-border px-5 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} DB Digital Banking. All rights reserved.
          </p>
        </footer>
      </div>
    </VantaBackground>
  );
};

export default Login;
