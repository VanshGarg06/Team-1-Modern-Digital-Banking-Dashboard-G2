import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Calendar,
  ChevronDown,
  X
} from 'lucide-react';
import AppHeader from '@/components/layout/AppHeader';
import GlassCard from '@/components/ui/GlassCard';
import { useBanking, Transaction } from '@/contexts/BankingContext';
import { useCurrency } from '@/contexts/CurrencyContext';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

type FilterType = 'all' | 'credit' | 'debit';

const TransactionRow = ({ transaction, formatAmount }: { transaction: Transaction; formatAmount: (n: number, s?: boolean) => string }) => {
  const isCredit = transaction.type === 'credit';
  
  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-glass-border hover:bg-glass-hover transition-colors"
    >
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isCredit ? 'bg-green-500/20' : 'bg-muted/30'
          }`}>
            {isCredit ? (
              <ArrowDownLeft className="w-5 h-5 text-green-400" />
            ) : (
              <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="font-medium">{transaction.description}</p>
            <p className="text-sm text-muted-foreground">{transaction.category}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 text-muted-foreground">
        {formatDate(transaction.date)}
      </td>
      <td className="py-4 px-4 text-muted-foreground">
        {transaction.account}
      </td>
      <td className="py-4 px-4 text-right text-muted-foreground">
        {isCredit ? '' : formatAmount(transaction.amount, false)}
      </td>
      <td className="py-4 px-4 text-right text-muted-foreground">
        {isCredit ? formatAmount(transaction.amount, false) : ''}
      </td>
      <td className="py-4 px-4 text-right font-medium">
        {transaction.balance !== undefined ? formatAmount(transaction.balance, false) : '-'}
      </td>
      <td className="py-4 px-4 text-center text-xs text-muted-foreground">
        {transaction.currency}
      </td>
    </motion.tr>
  );
};

const Transactions = () => {
  const { transactions, accounts, hasAccounts } = useBanking();
  const { formatAmount } = useCurrency();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const categories = useMemo(() => {
    const cats = [...new Set(transactions.map(t => t.category))];
    return ['all', ...cats];
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              t.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || t.type === filterType;
        const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
        const matchesAccount = selectedAccount === 'all' || t.account === selectedAccount;
        return matchesSearch && matchesType && matchesCategory && matchesAccount;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchQuery, filterType, selectedCategory, selectedAccount]);

  const totalCredits = filteredTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalDebits = filteredTransactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const downloadCSV = (type: 'all' | 'credit' | 'debit') => {
    let data = filteredTransactions;
    if (type !== 'all') {
      data = filteredTransactions.filter(t => t.type === type);
    }

    const headers = ['Date', 'Description', 'Category', 'Account', 'Debit', 'Credit', 'Balance', 'Currency'];
    const csvContent = [
      headers.join(','),
      ...data.map(t => [
        t.date,
        `"${t.description}"`,
        t.category,
        t.account,
        t.type === 'debit' ? t.amount : '',
        t.type === 'credit' ? t.amount : '',
        t.balance || '',
        t.currency,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${type}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  if (!hasAccounts) {
    return (
      <div className="min-h-screen">
        <AppHeader title="Transactions" subtitle="View and manage your transaction history" />
        <div className="p-8">
          <GlassCard className="flex flex-col items-center justify-center py-16 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold font-display mb-2">No Transactions Yet</h3>
            <p className="text-muted-foreground max-w-md">
              Link a bank account to see your transactions here with full debit, credit, and balance details.
            </p>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AppHeader title="Transactions" subtitle="View and manage your transaction history" />
      
      <div className="p-8 space-y-6">
        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <GlassCard className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Credits</p>
              <p className="text-2xl font-bold font-display text-green-400 mt-1">
                +{formatAmount(totalCredits)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <ArrowDownLeft className="w-6 h-6 text-green-400" />
            </div>
          </GlassCard>
          
          <GlassCard className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Debits</p>
              <p className="text-2xl font-bold font-display mt-1">
                -{formatAmount(totalDebits)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-muted/30 flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6" />
            </div>
          </GlassCard>
          
          <GlassCard className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Net Flow</p>
              <p className={`text-2xl font-bold font-display mt-1 ${
                totalCredits - totalDebits >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {totalCredits - totalDebits >= 0 ? '+' : ''}{formatAmount(totalCredits - totalDebits)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-glass-bg flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </GlassCard>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search transactions..."
                  className="glass-input pl-11 w-full"
                />
              </div>

              <div className="flex items-center gap-2">
                {(['all', 'credit', 'debit'] as FilterType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      filterType === type
                        ? 'bg-primary/10 border border-primary/20'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="glass-button flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              <div className="relative group">
                <button className="glass-button flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute right-0 mt-2 w-48 glass-card p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <button
                    onClick={() => downloadCSV('all')}
                    className="w-full px-4 py-2 text-left text-sm rounded-lg hover:bg-glass-hover transition-colors"
                  >
                    All Transactions
                  </button>
                  <button
                    onClick={() => downloadCSV('credit')}
                    className="w-full px-4 py-2 text-left text-sm rounded-lg hover:bg-glass-hover transition-colors"
                  >
                    Credits Only
                  </button>
                  <button
                    onClick={() => downloadCSV('debit')}
                    className="w-full px-4 py-2 text-left text-sm rounded-lg hover:bg-glass-hover transition-colors"
                  >
                    Debits Only
                  </button>
                </div>
              </div>
            </div>

            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 pt-4 border-t border-glass-border"
              >
                <div className="flex flex-wrap gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="glass-input pr-8 appearance-none cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat} className="bg-background">
                          {cat === 'all' ? 'All Categories' : cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Account</label>
                    <select
                      value={selectedAccount}
                      onChange={(e) => setSelectedAccount(e.target.value)}
                      className="glass-input pr-8 appearance-none cursor-pointer"
                    >
                      <option value="all" className="bg-background">All Accounts</option>
                      {accounts.map((acc) => (
                        <option key={acc.id} value={acc.bankName} className="bg-background">
                          {acc.bankName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterType('all');
                      setSelectedCategory('all');
                      setSelectedAccount('all');
                    }}
                    className="self-end glass-button flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Clear Filters
                  </button>
                </div>
              </motion.div>
            )}
          </GlassCard>
        </motion.div>

        {/* Transactions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-glass-border bg-glass-bg">
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Description</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Account</th>
                    <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Debit</th>
                    <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Credit</th>
                    <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Balance</th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">Currency</th>
                  </tr>
                </thead>
                <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.slice(0, 50).map((transaction) => (
                      <TransactionRow key={transaction.id} transaction={transaction} formatAmount={formatAmount} />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-muted-foreground">
                        No transactions found matching your filters.
                      </td>
                    </tr>
                  )}
                </motion.tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Transactions;
