import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Loader2, RefreshCw } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Account, Transaction } from '@/lib/types';
import { toast } from 'sonner';

interface AIInsight {
  title: string;
  description: string;
  type: 'info' | 'warning' | 'success';
  icon: 'trend' | 'alert' | 'tip';
}

export default function AIInsights() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const { data: acc } = await supabase.from('accounts').select('*');
      const accs = (acc || []) as Account[];
      setAccounts(accs);

      if (accs.length > 0) {
        const { data: txns } = await supabase
          .from('transactions')
          .select('*')
          .in('account_id', accs.map(a => a.id))
          .order('txn_date', { ascending: false })
          .limit(100);
        setTransactions((txns || []) as Transaction[]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const analyzeFinances = async () => {
    setAnalyzing(true);
    try {
      const totalBalance = accounts.reduce((s, a) => s + Number(a.balance), 0);
      const debits = transactions.filter(t => t.txn_type === 'debit');
      const credits = transactions.filter(t => t.txn_type === 'credit');
      const totalExpenses = debits.reduce((s, t) => s + Math.abs(Number(t.amount)), 0);
      const totalIncome = credits.reduce((s, t) => s + Number(t.amount), 0);

      const summary = `User has ${accounts.length} accounts with total balance $${totalBalance.toFixed(2)}. Recent ${transactions.length} transactions: income $${totalIncome.toFixed(2)}, expenses $${totalExpenses.toFixed(2)}. Top expense categories: ${getTopCategories(debits)}. Account types: ${accounts.map(a => a.account_type).join(', ')}.`;

      const { data, error } = await supabase.functions.invoke('ai-financial-insights', {
        body: { summary },
      });

      if (error) throw error;

      if (data?.insights) {
        setInsights(data.insights);
      }
    } catch (e: any) {
      console.error(e);
      toast.error('Failed to generate insights');
      // Fallback local insights
      generateLocalInsights();
    } finally {
      setAnalyzing(false);
    }
  };

  const getTopCategories = (txns: Transaction[]) => {
    const cats: Record<string, number> = {};
    txns.forEach(t => {
      const c = t.category || 'Uncategorized';
      cats[c] = (cats[c] || 0) + Math.abs(Number(t.amount));
    });
    return Object.entries(cats).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, v]) => `${k}: $${v.toFixed(0)}`).join(', ') || 'None';
  };

  const generateLocalInsights = () => {
    const totalBalance = accounts.reduce((s, a) => s + Number(a.balance), 0);
    const debits = transactions.filter(t => t.txn_type === 'debit');
    const credits = transactions.filter(t => t.txn_type === 'credit');
    const totalExpenses = debits.reduce((s, t) => s + Math.abs(Number(t.amount)), 0);
    const totalIncome = credits.reduce((s, t) => s + Number(t.amount), 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;

    const localInsights: AIInsight[] = [];

    if (savingsRate < 20 && totalIncome > 0) {
      localInsights.push({ title: 'Low Savings Rate', description: `Your savings rate is ${savingsRate.toFixed(1)}%. Aim for at least 20% to build a healthy financial buffer.`, type: 'warning', icon: 'alert' });
    } else if (totalIncome > 0) {
      localInsights.push({ title: 'Healthy Savings Rate', description: `Great! Your savings rate is ${savingsRate.toFixed(1)}%. Keep up the good work!`, type: 'success', icon: 'trend' });
    }

    if (accounts.length === 1) {
      localInsights.push({ title: 'Diversify Accounts', description: 'Consider opening a savings or investment account to grow your wealth beyond a single account.', type: 'info', icon: 'tip' });
    }

    if (totalBalance < totalExpenses * 3 && totalExpenses > 0) {
      localInsights.push({ title: 'Emergency Fund Alert', description: `Your balance covers only ${(totalBalance / totalExpenses).toFixed(1)} months of expenses. Build a 3-6 month emergency fund.`, type: 'warning', icon: 'alert' });
    }

    if (transactions.length === 0) {
      localInsights.push({ title: 'Import Transactions', description: 'Import your transaction history to get personalized AI-powered financial insights.', type: 'info', icon: 'tip' });
    }

    setInsights(localInsights.length > 0 ? localInsights : [
      { title: 'Getting Started', description: 'Add accounts and import transactions to receive AI-powered financial insights tailored to your spending patterns.', type: 'info', icon: 'tip' },
    ]);
  };

  useEffect(() => {
    if (!loading && accounts.length >= 0) {
      generateLocalInsights();
    }
  }, [loading, accounts, transactions]);

  const iconMap = {
    trend: TrendingUp,
    alert: AlertTriangle,
    tip: Lightbulb,
  };

  const colorMap = {
    info: 'text-primary',
    warning: 'text-yellow-400',
    success: 'text-green-400',
  };

  const bgMap = {
    info: 'bg-primary/10',
    warning: 'bg-yellow-400/10',
    success: 'bg-green-400/10',
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-3">
              <Brain className="h-8 w-8 text-primary" />
              AI Financial Intelligence
            </h1>
            <p className="mt-1 text-muted-foreground">Analyze your financial behavior with AI-powered insights and risk prediction.</p>
          </div>
          <Button variant="glow" onClick={analyzeFinances} disabled={analyzing}>
            {analyzing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <RefreshCw className="mr-2 h-5 w-5" />}
            {analyzing ? 'Analyzing...' : 'Deep Analysis'}
          </Button>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid gap-6 sm:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
            <p className="text-sm text-muted-foreground">Risk Score</p>
            <p className="font-display text-3xl font-bold text-primary">
              {transactions.length > 0 ? 'Medium' : 'N/A'}
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6">
            <p className="text-sm text-muted-foreground">Financial Health</p>
            <p className="font-display text-3xl font-bold text-green-400">
              {accounts.length > 0 ? 'Good' : 'N/A'}
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
            <p className="text-sm text-muted-foreground">Insights Generated</p>
            <p className="font-display text-3xl font-bold text-foreground">{insights.length}</p>
          </motion.div>
        </div>

        {/* Insights */}
        <div className="space-y-4">
          {insights.map((insight, i) => {
            const Icon = iconMap[insight.icon];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="glass-card flex items-start gap-4 p-6"
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${bgMap[insight.type]}`}>
                  <Icon className={`h-6 w-6 ${colorMap[insight.type]}`} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{insight.title}</h3>
                  <p className="mt-1 text-muted-foreground">{insight.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
