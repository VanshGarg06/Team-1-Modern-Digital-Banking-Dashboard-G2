import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, ArrowLeftRight, Plus } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { AccountCard } from '@/components/accounts/AccountCard';
import { TransactionRow } from '@/components/transactions/TransactionRow';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Account, Transaction } from '@/lib/types';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch accounts
      const { data: accountsData } = await supabase
        .from('accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (accountsData) {
        setAccounts(accountsData as Account[]);

        // Fetch recent transactions for all accounts
        if (accountsData.length > 0) {
          const accountIds = accountsData.map(a => a.id);
          const { data: transactionsData } = await supabase
            .from('transactions')
            .select('*')
            .in('account_id', accountIds)
            .order('txn_date', { ascending: false })
            .limit(5);

          if (transactionsData) {
            setTransactions(transactionsData as Transaction[]);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);
  const income = transactions
    .filter(t => t.txn_type === 'credit')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const expenses = transactions
    .filter(t => t.txn_type === 'debit')
    .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="mt-1 text-muted-foreground">Welcome back! Here's your financial overview.</p>
          </div>
          <Link to="/accounts">
            <Button variant="glow" size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Add Account
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Balance"
            value={formatCurrency(totalBalance)}
            icon={Wallet}
            index={0}
          />
          <StatsCard
            title="Income (Recent)"
            value={formatCurrency(income)}
            change="+12.5%"
            changeType="positive"
            icon={TrendingUp}
            index={1}
          />
          <StatsCard
            title="Expenses (Recent)"
            value={formatCurrency(expenses)}
            change="-8.2%"
            changeType="negative"
            icon={TrendingDown}
            index={2}
          />
          <StatsCard
            title="Transactions"
            value={transactions.length.toString()}
            icon={ArrowLeftRight}
            index={3}
          />
        </div>

        {/* Accounts section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-foreground">Your Accounts</h2>
            <Link to="/accounts" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </div>

          {accounts.length === 0 ? (
            <div className="glass-card flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Wallet className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold text-foreground">No accounts yet</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Add your first bank account to start tracking your finances.
              </p>
              <Link to="/accounts">
                <Button variant="glow">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Account
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {accounts.slice(0, 3).map((account, index) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  index={index}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-foreground">Recent Transactions</h2>
            <Link to="/transactions" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </div>

          {transactions.length === 0 ? (
            <div className="glass-card flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <ArrowLeftRight className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold text-foreground">No transactions yet</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Import a CSV file to add your transactions.
              </p>
              <Link to="/import">
                <Button variant="outline">Import Transactions</Button>
              </Link>
            </div>
          ) : (
            <div className="glass-card divide-y divide-border">
              {transactions.map((transaction, index) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  index={index}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
