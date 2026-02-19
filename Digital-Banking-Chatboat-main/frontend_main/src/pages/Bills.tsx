import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Zap, Home, Wifi, Smartphone, Heart, TrendingUp, Droplets, Tv, Dumbbell, Car,
  CheckCircle, AlertTriangle, Clock, CreditCard, Filter
} from 'lucide-react';
import AppHeader from '@/components/layout/AppHeader';
import GlassCard from '@/components/ui/GlassCard';
import { useBills } from '@/contexts/BillsContext';
import { useRewards } from '@/contexts/RewardsContext';
import { useCurrency } from '@/contexts/CurrencyContext';

const iconMap: Record<string, any> = {
  Zap, Home, Wifi, Smartphone, Heart, TrendingUp, Droplets, Tv, Dumbbell, Car,
};

type TabType = 'upcoming' | 'overdue' | 'paid' | 'all';

const Bills = () => {
  const { bills, upcomingBills, overdueBills, paidBills, markAsPaid, totalUpcoming, totalOverdue } = useBills();
  const { addPoints } = useRewards();
  const { formatAmount } = useCurrency();
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const handlePayBill = (billId: string, billName: string, amount: number) => {
    markAsPaid(billId);
    addPoints(`${billName} paid on time`, 50, 'Bill Payment');
  };

  const displayBills = activeTab === 'all' ? bills
    : activeTab === 'upcoming' ? upcomingBills
    : activeTab === 'overdue' ? overdueBills
    : paidBills;

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const statusConfig = {
    upcoming: { color: 'text-blue-400', bg: 'bg-blue-500/20', icon: Clock, label: 'Upcoming' },
    overdue: { color: 'text-red-400', bg: 'bg-red-500/20', icon: AlertTriangle, label: 'Overdue' },
    paid: { color: 'text-green-400', bg: 'bg-green-500/20', icon: CheckCircle, label: 'Paid' },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen">
      <AppHeader title="Bills" subtitle="Manage your bills and payments" />

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-8 space-y-6">
        {/* Summary */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassCard className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Upcoming</p>
              <p className="text-2xl font-bold font-display text-blue-400 mt-1">{formatAmount(totalUpcoming)}</p>
              <p className="text-xs text-muted-foreground mt-1">{upcomingBills.length} bills</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
          </GlassCard>

          <GlassCard className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overdue</p>
              <p className="text-2xl font-bold font-display text-red-400 mt-1">{formatAmount(totalOverdue)}</p>
              <p className="text-xs text-muted-foreground mt-1">{overdueBills.length} bills</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
          </GlassCard>

          <GlassCard className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Paid This Month</p>
              <p className="text-2xl font-bold font-display text-green-400 mt-1">{paidBills.length}</p>
              <p className="text-xs text-muted-foreground mt-1">bills cleared</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </GlassCard>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <GlassCard>
            <div className="flex items-center gap-2 mb-6">
              {(['all', 'upcoming', 'overdue', 'paid'] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === tab ? 'bg-primary/10 border border-primary/20' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Bills List */}
            <div className="space-y-3">
              {displayBills.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No bills in this category.</p>
              ) : (
                displayBills.map((bill) => {
                  const config = statusConfig[bill.status];
                  const Icon = iconMap[bill.icon] || CreditCard;
                  const StatusIcon = config.icon;

                  return (
                    <motion.div
                      key={bill.id}
                      variants={itemVariants}
                      className="flex items-center gap-4 p-4 rounded-xl bg-glass-bg border border-glass-border hover:bg-glass-hover transition-colors"
                    >
                      <div className={`w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-6 h-6 ${config.color}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{bill.name}</p>
                          {bill.recurring && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">Recurring</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{bill.payee}</p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold font-display">{formatAmount(bill.amount, false)}</p>
                        <p className="text-xs text-muted-foreground">Due {formatDate(bill.dueDate)}</p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`flex items-center gap-1 text-xs ${config.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {config.label}
                        </span>
                        {bill.status !== 'paid' && (
                          <button
                            onClick={() => handlePayBill(bill.id, bill.name, bill.amount)}
                            className="glass-button-primary text-xs px-3 py-1.5"
                          >
                            Pay Now
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Bills;
