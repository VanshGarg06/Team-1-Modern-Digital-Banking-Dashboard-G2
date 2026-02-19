import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Building2, Lock, Shield, Check, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/layout/AppHeader';
import GlassCard from '@/components/ui/GlassCard';
import { supportedBanks } from '@/data/mockData';
import { useBanking } from '@/contexts/BankingContext';
import { toast } from '@/hooks/use-toast';

type Step = 'select' | 'credentials' | 'verify' | 'success';

const LinkBank = () => {
  const navigate = useNavigate();
  const { addAccount } = useBanking();
  const [step, setStep] = useState<Step>('select');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBank, setSelectedBank] = useState<typeof supportedBanks[0] | null>(null);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const filteredBanks = supportedBanks.filter((bank) =>
    bank.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBankSelect = (bank: typeof supportedBanks[0]) => {
    setSelectedBank(bank);
    setStep('credentials');
  };

  const handleCredentialsSubmit = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setStep('verify');
  };

  const handleVerify = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (selectedBank) {
      const accountTypes = ['Checking', 'Savings', 'Credit Card', 'Investment'];
      const accountType = accountTypes[Math.floor(Math.random() * 2)]; // Mostly Checking/Savings
      addAccount(selectedBank.name, selectedBank.logo, accountType);
      toast({
        title: 'Account Linked!',
        description: `${selectedBank.name} has been connected. Your dashboard will now show live data.`,
      });
    }
    
    setIsLoading(false);
    setStep('success');
  };

  const handleBack = () => {
    if (step === 'credentials') setStep('select');
    if (step === 'verify') setStep('credentials');
  };

  const containerVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="min-h-screen">
      <AppHeader title="Link Bank Account" subtitle="Securely connect your financial institution" />
      
      <div className="p-8">
        {/* Progress Steps */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {['Select Bank', 'Credentials', 'Verify', 'Complete'].map((label, index) => {
              const stepIndex = ['select', 'credentials', 'verify', 'success'].indexOf(step);
              const isActive = index <= stepIndex;
              const isCurrent = index === stepIndex;
              
              return (
                <div key={label} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isActive 
                        ? 'bg-primary/10 border-primary/50 text-foreground' 
                        : 'border-glass-border text-muted-foreground'
                    } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}>
                      {index < stepIndex ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <span className={`text-xs mt-2 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {label}
                    </span>
                  </div>
                  {index < 3 && (
                    <div className={`w-16 md:w-24 h-0.5 mx-2 ${
                      index < stepIndex ? 'bg-primary/50' : 'bg-glass-border'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Select Bank */}
          {step === 'select' && (
            <motion.div
              key="select"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-2xl mx-auto"
            >
              <GlassCard>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold font-display mb-2">Choose Your Bank</h2>
                  <p className="text-muted-foreground">Select your financial institution from the list below</p>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search banks..."
                    className="glass-input pl-11"
                  />
                </div>

                {/* Banks Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {filteredBanks.map((bank) => (
                    <motion.button
                      key={bank.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleBankSelect(bank)}
                      className="glass-card-hover p-4 flex flex-col items-center gap-3"
                    >
                      <div className="w-12 h-12 rounded-xl bg-glass-bg flex items-center justify-center border border-glass-border">
                        <span className="text-lg font-bold">{bank.logo}</span>
                      </div>
                      <span className="text-sm font-medium text-center">{bank.name}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Security Notice */}
                <div className="mt-8 p-4 rounded-xl bg-glass-bg border border-glass-border flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Bank-Level Security</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your credentials are encrypted and never stored. We use secure OAuth connections where available.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Step 2: Credentials */}
          {step === 'credentials' && selectedBank && (
            <motion.div
              key="credentials"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-md mx-auto"
            >
              <GlassCard>
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-glass-bg flex items-center justify-center border border-glass-border mx-auto mb-4">
                    <span className="text-2xl font-bold">{selectedBank.logo}</span>
                  </div>
                  <h2 className="text-xl font-semibold font-display">Connect to {selectedBank.name}</h2>
                  <p className="text-muted-foreground mt-2">Enter your online banking credentials</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Username</label>
                    <input
                      type="text"
                      value={credentials.username}
                      onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                      placeholder="Enter your username"
                      className="glass-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={credentials.password}
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        placeholder="Enter your password"
                        className="glass-input pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleCredentialsSubmit}
                    disabled={isLoading || !credentials.username || !credentials.password}
                    className="glass-button-primary w-full flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                      />
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="w-4 h-4" />
                  Secured with 256-bit encryption
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Step 3: Verify */}
          {step === 'verify' && (
            <motion.div
              key="verify"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-md mx-auto"
            >
              <GlassCard className="text-center">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <div className="w-16 h-16 rounded-2xl bg-glass-bg flex items-center justify-center border border-glass-border mx-auto mb-6">
                  <Shield className="w-8 h-8" />
                </div>
                
                <h2 className="text-xl font-semibold font-display mb-2">Verification Required</h2>
                <p className="text-muted-foreground mb-8">
                  We've sent a verification code to your registered phone number ending in ***4567
                </p>

                <div className="mb-8">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit code"
                    className="glass-input text-center text-2xl tracking-widest"
                    maxLength={6}
                  />
                </div>

                <button
                  onClick={handleVerify}
                  disabled={isLoading || verificationCode.length !== 6}
                  className="glass-button-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                    />
                  ) : (
                    <>
                      Verify & Connect
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-sm text-muted-foreground mt-6">
                  Didn't receive the code?{' '}
                  <button className="text-foreground hover:underline">Resend</button>
                </p>
              </GlassCard>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <motion.div
              key="success"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-md mx-auto"
            >
              <GlassCard className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
                >
                  <Check className="w-10 h-10 text-green-500" />
                </motion.div>

                <h2 className="text-2xl font-semibold font-display mb-2">Account Linked!</h2>
                <p className="text-muted-foreground mb-8">
                  Your {selectedBank?.name} account has been successfully connected to Vault. Your dashboard will update with real-time data.
                </p>

                <div className="glass-card p-4 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-glass-bg flex items-center justify-center border border-glass-border">
                      <span className="text-lg font-bold">{selectedBank?.logo}</span>
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{selectedBank?.name}</p>
                      <p className="text-sm text-muted-foreground">Connected</p>
                    </div>
                    <Check className="w-5 h-5 text-green-500 ml-auto" />
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="glass-button-primary w-full"
                  >
                    View Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/accounts')}
                    className="glass-button w-full"
                  >
                    View Accounts
                  </button>
                  <button
                    onClick={() => {
                      setStep('select');
                      setSelectedBank(null);
                      setCredentials({ username: '', password: '' });
                      setVerificationCode('');
                    }}
                    className="glass-button w-full"
                  >
                    Link Another Account
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LinkBank;
