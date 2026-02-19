import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, RefreshCw, Eye, EyeOff, ChevronRight, CreditCard, Building2, TrendingUp, Trash2, Link2 } from 'lucide-react';
import AppHeader from '@/components/layout/AppHeader';
import GlassCard from '@/components/ui/GlassCard';
import { useBanking, BankAccount } from '@/contexts/BankingContext';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const AccountCard = ({ 
  account, 
  isSelected, 
  onSelect,
  onRemove,
  showBalance,
}: { 
  account: BankAccount;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  showBalance: boolean;
}) => {
  const accountTypeIcons = {
    'Checking': Building2,
    'Savings': Building2,
    'Credit Card': CreditCard,
    'Investment': TrendingUp,
  };
  
  const Icon = accountTypeIcons[account.accountType as keyof typeof accountTypeIcons] || Building2;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`glass-card-hover p-6 cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-primary/30' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-glass-bg flex items-center justify-center border border-glass-border">
            <span className="text-xl font-bold font-display">{account.logo}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{account.bankName}</h3>
              {account.isPrimary && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                  Primary
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {account.accountType} • {account.accountNumber}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {isSelected && <Check className="w-5 h-5 text-green-500" />}
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Balance</p>
          <p className={`text-2xl font-bold font-display mt-1 ${
            account.balance < 0 ? 'text-red-500' : ''
          }`}>
            {showBalance ? formatCurrency(account.balance) : '••••••'}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Last synced</p>
            <p className="text-sm mt-1">{formatDate(account.lastSync)}</p>
          </div>
          <Icon className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </motion.div>
  );
};

const Accounts = () => {
  const navigate = useNavigate();
  const { accounts, removeAccount } = useBanking();
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [showBalances, setShowBalances] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const handleSync = async () => {
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSyncing(false);
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
      <AppHeader title="Accounts" subtitle="Manage your linked bank accounts" />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-8 space-y-8"
      >
        {/* Summary Card */}
        <motion.div variants={itemVariants}>
          <GlassCard className="relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Balance Across All Accounts</p>
                <p className="stat-value mt-2">
                  {showBalances ? formatCurrency(totalBalance) : '••••••••'}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {accounts.length} linked account{accounts.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowBalances(!showBalances)}
                  className="glass-button flex items-center gap-2"
                >
                  {showBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showBalances ? 'Hide' : 'Show'} Balances
                </button>
                {accounts.length > 0 && (
                  <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="glass-button-primary flex items-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'Syncing...' : 'Sync All'}
                  </button>
                )}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Accounts Grid */}
        <motion.div variants={itemVariants}>
          <h2 className="text-lg font-semibold font-display mb-4">Linked Accounts</h2>
          {accounts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {accounts.map((account) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  isSelected={selectedAccount === account.id}
                  onSelect={() => setSelectedAccount(account.id)}
                  onRemove={() => removeAccount(account.id)}
                  showBalance={showBalances}
                />
              ))}
            </div>
          ) : (
            <GlassCard className="flex flex-col items-center justify-center py-12 text-center">
              <Link2 className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold font-display mb-2">No Accounts Linked</h3>
              <p className="text-muted-foreground mb-6">Link a bank account to get started.</p>
              <button
                onClick={() => navigate('/link-bank')}
                className="glass-button-primary"
              >
                Link Bank Account
              </button>
            </GlassCard>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <h2 className="text-lg font-semibold font-display mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlassCard hover className="cursor-pointer" onClick={() => navigate('/link-bank')}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-glass-bg flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Add New Account</p>
                  <p className="text-sm text-muted-foreground">Link another bank</p>
                </div>
              </div>
            </GlassCard>
            <GlassCard hover className="cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-glass-bg flex items-center justify-center">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Reconnect Account</p>
                  <p className="text-sm text-muted-foreground">Fix sync issues</p>
                </div>
              </div>
            </GlassCard>
            <GlassCard hover className="cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-glass-bg flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Set Primary</p>
                  <p className="text-sm text-muted-foreground">Change default account</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Accounts;
