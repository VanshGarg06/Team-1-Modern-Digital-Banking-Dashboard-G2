import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Search, Filter, Upload } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TransactionRow } from '@/components/transactions/TransactionRow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Account, Transaction } from '@/lib/types';
import { Link } from 'react-router-dom';

export default function Transactions() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

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

        // Fetch all transactions
        if (accountsData.length > 0) {
          const accountIds = accountsData.map(a => a.id);
          const { data: transactionsData } = await supabase
            .from('transactions')
            .select('*')
            .in('account_id', accountIds)
            .order('txn_date', { ascending: false });

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

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.merchant?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.category?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesAccount = selectedAccount === 'all' || t.account_id === selectedAccount;
    const matchesType = selectedType === 'all' || t.txn_type === selectedType;

    return matchesSearch && matchesAccount && matchesType;
  });

  const totalIncome = filteredTransactions
    .filter(t => t.txn_type === 'credit')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = filteredTransactions
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
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Transactions</h1>
            <p className="mt-1 text-muted-foreground">
              View and manage all your transactions.
            </p>
          </div>
          <Link to="/import">
            <Button variant="glow" size="lg">
              <Upload className="mr-2 h-5 w-5" />
              Import CSV
            </Button>
          </Link>
        </motion.div>

        {/* Summary cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 sm:grid-cols-3"
        >
          <div className="glass-card p-4">
            <p className="text-sm text-muted-foreground">Total Transactions</p>
            <p className="font-display text-2xl font-bold text-foreground">
              {filteredTransactions.length}
            </p>
          </div>
          <div className="glass-card p-4">
            <p className="text-sm text-muted-foreground">Total Income</p>
            <p className="font-display text-2xl font-bold text-success">
              {formatCurrency(totalIncome)}
            </p>
          </div>
          <div className="glass-card p-4">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="font-display text-2xl font-bold text-destructive">
              {formatCurrency(totalExpenses)}
            </p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedAccount} onValueChange={setSelectedAccount}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Accounts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.account_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="credit">Income</SelectItem>
              <SelectItem value="debit">Expense</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Transactions list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {filteredTransactions.length === 0 ? (
            <div className="glass-card flex flex-col items-center justify-center p-16 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
                <ArrowLeftRight className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mb-2 font-display text-xl font-semibold text-foreground">
                {transactions.length === 0 ? 'No transactions yet' : 'No matching transactions'}
              </h3>
              <p className="mb-6 max-w-sm text-muted-foreground">
                {transactions.length === 0
                  ? 'Import a CSV file to add your transaction history.'
                  : 'Try adjusting your filters or search query.'}
              </p>
              {transactions.length === 0 && (
                <Link to="/import">
                  <Button variant="glow">
                    <Upload className="mr-2 h-5 w-5" />
                    Import Transactions
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="glass-card divide-y divide-border">
              {filteredTransactions.map((transaction, index) => (
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
