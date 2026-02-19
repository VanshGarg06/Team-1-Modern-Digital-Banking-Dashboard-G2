import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Key, 
  LogOut,
  ChevronRight,
  Check,
  AlertTriangle,
  Edit2,
  Save,
  X,
  Loader2
} from 'lucide-react';
import AppHeader from '@/components/layout/AppHeader';
import GlassCard from '@/components/ui/GlassCard';
import { linkedAccounts } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, loading, signOut, updateProfile, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Local form state
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
  });

  // Sync form data with profile
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  const handleSave = async () => {
    setIsSaving(true);
    await updateProfile({
      full_name: formData.full_name,
      phone: formData.phone,
    });
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const displayEmail = profile?.email || user?.email || '';
  const displayPhone = profile?.phone || 'Not set';
  const avatarInitials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const memberSince = user?.created_at ? formatDate(user.created_at) : 'Unknown';

  return (
    <div className="min-h-screen">
      <AppHeader title="Profile" subtitle="Manage your account settings" />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-8 space-y-6 max-w-4xl"
      >
        {/* Profile Header */}
        <motion.div variants={itemVariants}>
          <GlassCard className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center border border-glass-border">
                <span className="text-3xl font-bold font-display">{avatarInitials}</span>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold font-display">{displayName}</h2>
                <p className="text-muted-foreground mt-1">{displayEmail}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Member since {memberSince}
                </p>
              </div>
              <div className="ml-auto">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="glass-button flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="glass-button-primary flex items-center gap-2"
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        // Reset form data
                        if (profile) {
                          setFormData({
                            full_name: profile.full_name || '',
                            email: profile.email || '',
                            phone: profile.phone || '',
                          });
                        }
                      }}
                      className="glass-button flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Personal Information */}
        <motion.div variants={itemVariants}>
          <GlassCard>
            <h3 className="text-lg font-semibold font-display mb-6">Personal Information</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-glass-border">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Full Name</span>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="glass-input py-1 px-3 w-48 text-right"
                  />
                ) : (
                  <span className="font-medium">{displayName}</span>
                )}
              </div>
              <div className="flex items-center justify-between py-3 border-b border-glass-border">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Email</span>
                </div>
                <span className="font-medium">{displayEmail}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-glass-border">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Phone</span>
                </div>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="glass-input py-1 px-3 w-48 text-right"
                  />
                ) : (
                  <span className="font-medium">{displayPhone}</span>
                )}
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Address</span>
                </div>
                <span className="font-medium text-right text-muted-foreground">Not set</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Linked Accounts Summary */}
        <motion.div variants={itemVariants}>
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold font-display">Linked Accounts</h3>
              <span className="text-sm text-muted-foreground">{linkedAccounts.length} connected</span>
            </div>
            <div className="space-y-3">
              {linkedAccounts.slice(0, 3).map((account) => (
                <Link
                  key={account.id}
                  to={`/accounts/edit?id=${account.id}`}
                  className="flex items-center justify-between p-4 rounded-xl bg-glass-bg border border-glass-border hover:bg-glass-hover transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center border border-glass-border">
                      <span className="font-bold">{account.logo}</span>
                    </div>
                    <div>
                      <p className="font-medium">{account.bankName}</p>
                      <p className="text-sm text-muted-foreground">{account.accountType} • {account.accountNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {account.isPrimary && (
                      <span className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/20">
                        Primary
                      </span>
                    )}
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
            {linkedAccounts.length > 3 && (
              <Link
                to="/accounts"
                className="block w-full mt-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors text-center"
              >
                View all {linkedAccounts.length} accounts
              </Link>
            )}
          </GlassCard>
        </motion.div>

        {/* Security */}
        <motion.div variants={itemVariants}>
          <GlassCard>
            <h3 className="text-lg font-semibold font-display mb-6">Security</h3>
            <div className="space-y-4">
              <Link
                to="/profile/two-factor"
                className="flex items-center justify-between p-4 rounded-xl bg-glass-bg border border-glass-border hover:bg-glass-hover transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Not enabled</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm text-muted-foreground hover:text-foreground">Enable</span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Link>

              <Link
                to="/profile/change-password"
                className="flex items-center justify-between p-4 rounded-xl bg-glass-bg border border-glass-border hover:bg-glass-hover transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-glass-hover flex items-center justify-center">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Password</p>
                    <p className="text-sm text-muted-foreground">Change your password</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground hover:text-foreground">
                    Change
                  </span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Link>

              <div className="flex items-center justify-between p-4 rounded-xl bg-glass-bg border border-glass-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-glass-hover flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Last Login</p>
                    <p className="text-sm text-muted-foreground">
                      {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Unknown'}
                    </p>
                  </div>
                </div>
                <button className="text-sm text-muted-foreground hover:text-foreground">
                  View Activity
                </button>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Logout */}
        <motion.div variants={itemVariants}>
          <GlassCard className="border-red-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="font-medium">Sign Out</p>
                  <p className="text-sm text-muted-foreground">End your current session</p>
                </div>
              </div>
              {!showLogoutConfirm ? (
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  Logout
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="px-4 py-2 rounded-xl bg-glass-bg hover:bg-glass-hover transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Profile;
