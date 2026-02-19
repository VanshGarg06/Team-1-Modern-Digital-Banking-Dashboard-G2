import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon,
  Bell,
  Globe,
  Palette,
  Lock,
  CreditCard,
  Shield,
  Smartphone,
  Mail,
  ChevronRight,
  Moon,
  Sun
} from 'lucide-react';
import AppHeader from '@/components/layout/AppHeader';
import GlassCard from '@/components/ui/GlassCard';
import { useTheme } from '@/contexts/ThemeContext';

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    transactions: true,
    marketing: false,
    security: true,
  });

  const [preferences, setPreferences] = useState({
    language: 'English',
    currency: 'USD',
    timezone: 'UTC-5 (Eastern)',
  });

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

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        checked ? 'bg-foreground' : 'bg-glass-border'
      }`}
    >
      <motion.div
        animate={{ x: checked ? 24 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={`absolute top-1 w-4 h-4 rounded-full ${
          checked ? 'bg-background' : 'bg-muted-foreground'
        }`}
      />
    </button>
  );

  return (
    <div className="min-h-screen">
      <AppHeader title="Settings" subtitle="Manage your app preferences" />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-8 space-y-6 max-w-4xl"
      >
        {/* Notifications */}
        <motion.div variants={itemVariants}>
          <GlassCard>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-glass-bg flex items-center justify-center border border-glass-border">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold font-display">Notifications</h3>
                <p className="text-sm text-muted-foreground">Manage how you receive alerts</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-glass-border">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={notifications.email}
                  onChange={() => setNotifications({ ...notifications, email: !notifications.email })}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-glass-border">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Get alerts on your device</p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={notifications.push}
                  onChange={() => setNotifications({ ...notifications, push: !notifications.push })}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-glass-border">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Transaction Alerts</p>
                    <p className="text-sm text-muted-foreground">Notify on every transaction</p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={notifications.transactions}
                  onChange={() => setNotifications({ ...notifications, transactions: !notifications.transactions })}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Security Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified of suspicious activity</p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={notifications.security}
                  onChange={() => setNotifications({ ...notifications, security: !notifications.security })}
                />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Appearance */}
        <motion.div variants={itemVariants}>
          <GlassCard>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-glass-bg flex items-center justify-center border border-glass-border">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold font-display">Appearance</h3>
                <p className="text-sm text-muted-foreground">Customize your experience</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-glass-border">
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? (
                    <Moon className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Sun className="w-5 h-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium">Theme</p>
                    <p className="text-sm text-muted-foreground">
                      Currently using {theme === 'dark' ? 'Dark' : 'Light'} mode
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark' ? 'bg-foreground text-background' : 'bg-glass-bg hover:bg-glass-hover'
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setTheme('light')}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'light' ? 'bg-foreground text-background' : 'bg-glass-bg hover:bg-glass-hover'
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-glass-border">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Language</p>
                    <p className="text-sm text-muted-foreground">{preferences.language}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Currency</p>
                    <p className="text-sm text-muted-foreground">{preferences.currency}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Privacy & Security */}
        <motion.div variants={itemVariants}>
          <GlassCard>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-glass-bg flex items-center justify-center border border-glass-border">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold font-display">Privacy & Security</h3>
                <p className="text-sm text-muted-foreground">Manage your security settings</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 rounded-xl bg-glass-bg border border-glass-border hover:bg-glass-hover transition-colors">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">Change Password</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>

              <button className="w-full flex items-center justify-between p-4 rounded-xl bg-glass-bg border border-glass-border hover:bg-glass-hover transition-colors">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">Two-Factor Authentication</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>

              <button className="w-full flex items-center justify-between p-4 rounded-xl bg-glass-bg border border-glass-border hover:bg-glass-hover transition-colors">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">Active Sessions</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Data & Privacy */}
        <motion.div variants={itemVariants}>
          <GlassCard>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-glass-bg flex items-center justify-center border border-glass-border">
                <SettingsIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold font-display">Data & Privacy</h3>
                <p className="text-sm text-muted-foreground">Control your data</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 rounded-xl bg-glass-bg border border-glass-border hover:bg-glass-hover transition-colors">
                <span className="font-medium">Download Your Data</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>

              <button className="w-full flex items-center justify-between p-4 rounded-xl bg-glass-bg border border-glass-border hover:bg-glass-hover transition-colors">
                <span className="font-medium">Privacy Policy</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>

              <button className="w-full flex items-center justify-between p-4 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors text-red-500">
                <span className="font-medium">Delete Account</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Settings;
