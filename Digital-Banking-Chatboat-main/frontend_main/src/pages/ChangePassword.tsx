import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  Shield,
  AlertTriangle
} from 'lucide-react';
import AppHeader from '@/components/layout/AppHeader';
import GlassCard from '@/components/ui/GlassCard';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const passwordRequirements = [
    { label: 'At least 8 characters', met: newPassword.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(newPassword) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(newPassword) },
    { label: 'Contains number', met: /[0-9]/.test(newPassword) },
    { label: 'Contains special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) },
  ];

  const allRequirementsMet = passwordRequirements.every(r => r.met);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!allRequirementsMet) {
      setError('Please meet all password requirements');
      return;
    }
    
    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setSuccess(true);
    
    setTimeout(() => {
      navigate('/profile');
    }, 2000);
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

  if (success) {
    return (
      <div className="min-h-screen">
        <AppHeader title="Change Password" subtitle="Update your account password" />
        <div className="p-8 max-w-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <GlassCard className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
              >
                <Check className="w-10 h-10 text-green-400" />
              </motion.div>
              <h2 className="text-2xl font-bold font-display">Password Updated!</h2>
              <p className="text-muted-foreground mt-2">
                Your password has been successfully changed. Redirecting to profile...
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AppHeader title="Change Password" subtitle="Update your account password" />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-8 max-w-xl"
      >
        {/* Back Button */}
        <motion.div variants={itemVariants}>
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Profile
          </button>
        </motion.div>

        {/* Security Notice */}
        <motion.div variants={itemVariants}>
          <GlassCard className="mb-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium">Security Tip</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose a strong password that you don't use on other websites. 
                  Your password should be at least 8 characters and include a mix of letters, numbers, and symbols.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Form */}
        <motion.div variants={itemVariants}>
          <GlassCard>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    className="w-full px-12 py-4 bg-glass-bg border border-glass-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Create a new password"
                    className="w-full px-12 py-4 bg-glass-bg border border-glass-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password Requirements */}
                {newPassword.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 space-y-2"
                  >
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        {req.met ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <X className="w-4 h-4 text-red-400" />
                        )}
                        <span className={req.met ? 'text-green-400' : 'text-muted-foreground'}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className="w-full px-12 py-4 bg-glass-bg border border-glass-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {confirmPassword.length > 0 && !passwordsMatch && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <X className="w-4 h-4" />
                    Passwords do not match
                  </p>
                )}
                {passwordsMatch && (
                  <p className="text-green-400 text-sm mt-2 flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    Passwords match
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || !allRequirementsMet || !passwordsMatch}
                className="w-full py-4 bg-gradient-to-r from-foreground to-muted-foreground text-background font-semibold rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full mx-auto"
                  />
                ) : (
                  'Update Password'
                )}
              </button>
            </form>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ChangePassword;
