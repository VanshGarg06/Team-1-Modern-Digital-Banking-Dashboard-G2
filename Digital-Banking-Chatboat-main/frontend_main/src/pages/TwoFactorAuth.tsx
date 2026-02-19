import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Shield,
  Smartphone,
  Mail,
  Key,
  Check,
  Copy,
  AlertTriangle,
  QrCode,
  RefreshCw
} from 'lucide-react';
import AppHeader from '@/components/layout/AppHeader';
import GlassCard from '@/components/ui/GlassCard';

type TwoFAMethod = 'authenticator' | 'sms' | 'email';

const TwoFactorAuth = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'choose' | 'setup' | 'verify' | 'complete'>('choose');
  const [method, setMethod] = useState<TwoFAMethod | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [backupCodes] = useState([
    'ABCD-1234-EFGH',
    'IJKL-5678-MNOP',
    'QRST-9012-UVWX',
    'YZAB-3456-CDEF',
    'GHIJ-7890-KLMN',
    'OPQR-1357-STUV',
    'WXYZ-2468-ABCD',
    'EFGH-0246-IJKL',
  ]);
  const [copiedCode, setCopiedCode] = useState(false);

  // Mock secret key for authenticator app
  const secretKey = 'JBSWY3DPEHPK3PXP';

  const handleMethodSelect = (m: TwoFAMethod) => {
    setMethod(m);
    setStep('setup');
  };

  const handleSendCode = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep('verify');
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate verification (accept any 6-digit code for demo)
    if (verificationCode.length === 6) {
      setIsLoading(false);
      setStep('complete');
    } else {
      setIsLoading(false);
      setError('Invalid verification code. Please try again.');
    }
  };

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen">
      <AppHeader title="Two-Factor Authentication" subtitle="Add an extra layer of security" />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-8 max-w-xl"
      >
        {/* Back Button */}
        <motion.div variants={itemVariants}>
          <button
            onClick={() => step === 'choose' ? navigate('/profile') : setStep('choose')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            {step === 'choose' ? 'Back to Profile' : 'Back'}
          </button>
        </motion.div>

        {/* Step: Choose Method */}
        {step === 'choose' && (
          <>
            <motion.div variants={itemVariants}>
              <GlassCard className="mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Why Enable 2FA?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Two-factor authentication adds an extra layer of security to your account. 
                      Even if someone knows your password, they won't be able to access your account without the second factor.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-semibold font-display mb-4">Choose a Method</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleMethodSelect('authenticator')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-glass-bg border border-glass-border hover:bg-glass-hover transition-colors text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Authenticator App</p>
                    <p className="text-sm text-muted-foreground">
                      Use Google Authenticator, Authy, or similar apps
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
                    Recommended
                  </span>
                </button>

                <button
                  onClick={() => handleMethodSelect('sms')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-glass-bg border border-glass-border hover:bg-glass-hover transition-colors text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">SMS Verification</p>
                    <p className="text-sm text-muted-foreground">
                      Receive codes via text message
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => handleMethodSelect('email')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-glass-bg border border-glass-border hover:bg-glass-hover transition-colors text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Email Verification</p>
                    <p className="text-sm text-muted-foreground">
                      Receive codes via email
                    </p>
                  </div>
                </button>
              </div>
            </motion.div>
          </>
        )}

        {/* Step: Setup */}
        {step === 'setup' && method === 'authenticator' && (
          <motion.div variants={itemVariants}>
            <GlassCard>
              <h3 className="text-lg font-semibold font-display mb-4">Set Up Authenticator App</h3>
              
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-glass-bg border border-glass-border">
                  <p className="text-sm text-muted-foreground mb-4">
                    1. Download an authenticator app like Google Authenticator or Authy
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    2. Scan the QR code below or enter the secret key manually
                  </p>
                </div>

                {/* QR Code Placeholder */}
                <div className="flex justify-center">
                  <div className="w-48 h-48 rounded-xl bg-white p-4 flex items-center justify-center">
                    <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0id2hpdGUiLz48cmVjdCB4PSIzMiIgeT0iMzIiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIvPjxyZWN0IHg9IjQ4IiB5PSIzMiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2Ii8+PHJlY3QgeD0iNjQiIHk9IjMyIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiLz48cmVjdCB4PSI4MCIgeT0iMzIiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIvPjxyZWN0IHg9Ijk2IiB5PSIzMiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2Ii8+PHJlY3QgeD0iMTYwIiB5PSIzMiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2Ii8+PHJlY3QgeD0iMTc2IiB5PSIzMiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2Ii8+PHJlY3QgeD0iMTkyIiB5PSIzMiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2Ii8+PHJlY3QgeD0iMjA4IiB5PSIzMiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2Ii8+PHJlY3QgeD0iMjI0IiB5PSIzMiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2Ii8+PC9zdmc+')] bg-cover" />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-glass-bg border border-glass-border">
                  <p className="text-sm text-muted-foreground mb-2">Secret Key (Manual Entry)</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 font-mono text-lg tracking-wider">{secretKey}</code>
                    <button
                      onClick={() => navigator.clipboard.writeText(secretKey)}
                      className="p-2 rounded-lg hover:bg-glass-hover transition-colors"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSendCode}
                  className="w-full py-4 bg-gradient-to-r from-foreground to-muted-foreground text-background font-semibold rounded-xl hover:-translate-y-0.5 transition-all"
                >
                  I've Set Up My Authenticator
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {step === 'setup' && (method === 'sms' || method === 'email') && (
          <motion.div variants={itemVariants}>
            <GlassCard>
              <h3 className="text-lg font-semibold font-display mb-4">
                {method === 'sms' ? 'SMS Verification' : 'Email Verification'}
              </h3>
              
              <div className="space-y-6">
                <p className="text-muted-foreground">
                  We'll send a verification code to your {method === 'sms' ? 'phone' : 'email'}:
                </p>
                
                <div className="p-4 rounded-xl bg-glass-bg border border-glass-border text-center">
                  <p className="font-medium">
                    {method === 'sms' ? '+1 (555) ***-**42' : 'j***@example.com'}
                  </p>
                </div>

                <button
                  onClick={handleSendCode}
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-foreground to-muted-foreground text-background font-semibold rounded-xl hover:-translate-y-0.5 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full mx-auto"
                    />
                  ) : (
                    `Send Verification Code`
                  )}
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Step: Verify */}
        {step === 'verify' && (
          <motion.div variants={itemVariants}>
            <GlassCard>
              <h3 className="text-lg font-semibold font-display mb-4">Enter Verification Code</h3>
              
              <form onSubmit={handleVerify} className="space-y-6">
                {error && (
                  <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <p className="text-muted-foreground">
                  {method === 'authenticator' 
                    ? 'Enter the 6-digit code from your authenticator app'
                    : `Enter the 6-digit code we sent to your ${method}`}
                </p>

                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-full px-12 py-4 bg-glass-bg border border-glass-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground transition-all text-center text-2xl tracking-widest font-mono"
                    maxLength={6}
                    required
                  />
                </div>

                {method !== 'authenticator' && (
                  <button
                    type="button"
                    className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Resend Code
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isLoading || verificationCode.length !== 6}
                  className="w-full py-4 bg-gradient-to-r from-foreground to-muted-foreground text-background font-semibold rounded-xl hover:-translate-y-0.5 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full mx-auto"
                    />
                  ) : (
                    'Verify & Enable 2FA'
                  )}
                </button>
              </form>
            </GlassCard>
          </motion.div>
        )}

        {/* Step: Complete */}
        {step === 'complete' && (
          <>
            <motion.div variants={itemVariants}>
              <GlassCard className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
                >
                  <Check className="w-10 h-10 text-green-400" />
                </motion.div>
                <h2 className="text-2xl font-bold font-display">2FA Enabled!</h2>
                <p className="text-muted-foreground mt-2">
                  Your account is now protected with two-factor authentication.
                </p>
              </GlassCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <GlassCard>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold font-display">Backup Codes</h3>
                  <button
                    onClick={copyBackupCodes}
                    className="glass-button flex items-center gap-2"
                  >
                    {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedCode ? 'Copied!' : 'Copy All'}
                  </button>
                </div>
                
                <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      Save these backup codes in a secure place. You can use each code once to sign in if you lose access to your authenticator.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {backupCodes.map((code, index) => (
                    <div
                      key={index}
                      className="p-2 rounded-lg bg-glass-bg border border-glass-border text-center font-mono text-sm"
                    >
                      {code}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate('/profile')}
                  className="w-full mt-6 py-4 bg-gradient-to-r from-foreground to-muted-foreground text-background font-semibold rounded-xl hover:-translate-y-0.5 transition-all"
                >
                  Done
                </button>
              </GlassCard>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default TwoFactorAuth;
