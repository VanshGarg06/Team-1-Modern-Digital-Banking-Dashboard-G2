import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Building2,
  CreditCard,
  Edit2,
  Save,
  Trash2,
  AlertTriangle,
  Check,
  RefreshCw
} from 'lucide-react';
import AppHeader from '@/components/layout/AppHeader';
import GlassCard from '@/components/ui/GlassCard';
import { linkedAccounts } from '@/data/mockData';

const EditAccount = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accountId = searchParams.get('id') || linkedAccounts[0]?.id;
  
  const account = linkedAccounts.find(a => a.id === accountId) || linkedAccounts[0];
  
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [accountData, setAccountData] = useState({
    nickname: account?.bankName || '',
    isPrimary: account?.isPrimary || false,
    notificationsEnabled: true,
    lowBalanceAlert: 100,
    autoSync: true,
  });

  const handleSave = () => {
    setIsEditing(false);
    // Simulate save
  };

  const handleSync = async () => {
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSyncing(false);
  };

  const handleDelete = () => {
    // Simulate delete
    navigate('/accounts');
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

  if (!account) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassCard className="text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold">Account Not Found</h2>
          <p className="text-muted-foreground mt-2">The account you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/accounts')}
            className="glass-button mt-4"
          >
            Back to Accounts
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AppHeader 
        title="Edit Account" 
        subtitle={`Manage ${account.bankName}`} 
      />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-8 space-y-6 max-w-4xl"
      >
        {/* Back Button */}
        <motion.div variants={itemVariants}>
          <button
            onClick={() => navigate('/accounts')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Accounts
          </button>
        </motion.div>

        {/* Account Header */}
        <motion.div variants={itemVariants}>
          <GlassCard className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center border border-glass-border">
                <span className="text-2xl font-bold">{account.logo}</span>
              </div>
              <div className="text-center md:text-left flex-1">
                <h2 className="text-2xl font-bold font-display">{account.bankName}</h2>
                <p className="text-muted-foreground mt-1">{account.accountType} • {account.accountNumber}</p>
                <div className="flex items-center gap-3 mt-3 justify-center md:justify-start">
                  {account.isPrimary && (
                    <span className="text-xs px-3 py-1 rounded-full bg-foreground/10 border border-foreground/20">
                      Primary Account
                    </span>
                  )}
                  <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">
                    Connected
                  </span>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-3xl font-bold font-display">
                  ${account.balance.toLocaleString()}
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Account Settings */}
        <motion.div variants={itemVariants}>
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold font-display">Account Settings</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="glass-button flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSave}
                    className="glass-button-primary flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="glass-button"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-glass-border">
                <div>
                  <p className="font-medium">Account Nickname</p>
                  <p className="text-sm text-muted-foreground">Custom name for this account</p>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={accountData.nickname}
                    onChange={(e) => setAccountData({ ...accountData, nickname: e.target.value })}
                    className="glass-input py-2 px-3 w-48"
                  />
                ) : (
                  <span className="text-muted-foreground">{accountData.nickname}</span>
                )}
              </div>

              <div className="flex items-center justify-between py-3 border-b border-glass-border">
                <div>
                  <p className="font-medium">Set as Primary</p>
                  <p className="text-sm text-muted-foreground">Use for default transactions</p>
                </div>
                <button
                  onClick={() => isEditing && setAccountData({ ...accountData, isPrimary: !accountData.isPrimary })}
                  disabled={!isEditing}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    accountData.isPrimary ? 'bg-foreground' : 'bg-glass-border'
                  } ${!isEditing && 'opacity-50 cursor-not-allowed'}`}
                >
                  <motion.div
                    animate={{ x: accountData.isPrimary ? 24 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className={`absolute top-1 w-4 h-4 rounded-full ${
                      accountData.isPrimary ? 'bg-background' : 'bg-muted-foreground'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-glass-border">
                <div>
                  <p className="font-medium">Low Balance Alert</p>
                  <p className="text-sm text-muted-foreground">Alert when balance falls below</p>
                </div>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">$</span>
                    <input
                      type="number"
                      value={accountData.lowBalanceAlert}
                      onChange={(e) => setAccountData({ ...accountData, lowBalanceAlert: parseInt(e.target.value) })}
                      className="glass-input py-2 px-3 w-24"
                    />
                  </div>
                ) : (
                  <span className="text-muted-foreground">${accountData.lowBalanceAlert}</span>
                )}
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Auto-Sync Transactions</p>
                  <p className="text-sm text-muted-foreground">Automatically sync daily</p>
                </div>
                <button
                  onClick={() => isEditing && setAccountData({ ...accountData, autoSync: !accountData.autoSync })}
                  disabled={!isEditing}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    accountData.autoSync ? 'bg-foreground' : 'bg-glass-border'
                  } ${!isEditing && 'opacity-50 cursor-not-allowed'}`}
                >
                  <motion.div
                    animate={{ x: accountData.autoSync ? 24 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className={`absolute top-1 w-4 h-4 rounded-full ${
                      accountData.autoSync ? 'bg-background' : 'bg-muted-foreground'
                    }`}
                  />
                </button>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Actions */}
        <motion.div variants={itemVariants}>
          <GlassCard>
            <h3 className="text-lg font-semibold font-display mb-6">Actions</h3>
            
            <div className="space-y-3">
              <button
                onClick={handleSync}
                disabled={isSyncing}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-glass-bg border border-glass-border hover:bg-glass-hover transition-colors"
              >
                <div className="flex items-center gap-3">
                  <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <div className="text-left">
                    <p className="font-medium">Sync Now</p>
                    <p className="text-sm text-muted-foreground">Last synced 2 hours ago</p>
                  </div>
                </div>
                {isSyncing ? (
                  <span className="text-sm text-muted-foreground">Syncing...</span>
                ) : (
                  <Check className="w-5 h-5 text-green-400" />
                )}
              </button>

              <button className="w-full flex items-center justify-between p-4 rounded-xl bg-glass-bg border border-glass-border hover:bg-glass-hover transition-colors">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium">View Transactions</p>
                    <p className="text-sm text-muted-foreground">See all transactions for this account</p>
                  </div>
                </div>
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Danger Zone */}
        <motion.div variants={itemVariants}>
          <GlassCard className="border-red-500/20">
            <h3 className="text-lg font-semibold font-display mb-6 text-red-400">Danger Zone</h3>
            
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="font-medium text-red-400">Unlink This Account</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    This will remove the connection between your DB Digital Banking account and {account.bankName}. 
                    Your transaction history will be preserved, but no new data will be synced.
                  </p>
                  
                  {!showDeleteConfirm ? (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="mt-4 px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Unlink Account
                    </button>
                  ) : (
                    <div className="mt-4 flex items-center gap-2">
                      <button
                        onClick={handleDelete}
                        className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
                      >
                        Confirm Unlink
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-4 py-2 rounded-xl bg-glass-bg hover:bg-glass-hover transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EditAccount;
