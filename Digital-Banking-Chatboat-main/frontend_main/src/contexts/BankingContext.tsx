import { createContext, useContext, useState, useMemo, ReactNode, useCallback } from 'react';
import { mockAccounts, MockAccount } from '@/data/mockAccounts';
import { allMockTransactions, generateTransactions, MockTransaction } from '@/data/mockTransactions';

export type BankAccount = MockAccount;
export type Transaction = MockTransaction;

interface MonthlyDataPoint {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

interface CategorySpendingItem {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

interface IncomeBreakdownItem {
  name: string;
  value: number;
  percentage: number;
}

interface EarningsProjectionItem {
  month: string;
  projected: number;
  actual: number | null;
}

interface InsightCard {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'success' | 'info';
  icon: string;
}

interface DashboardStats {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
}

interface MonthlyReport {
  month: string;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
}

interface SpendingRate {
  currentMonth: number;
  previousMonth: number;
  changePercent: number;
  direction: 'up' | 'down' | 'flat';
}

interface BankingContextType {
  accounts: BankAccount[];
  transactions: Transaction[];
  dashboardStats: DashboardStats;
  healthScore: number;
  healthCategory: string;
  monthlyData: MonthlyDataPoint[];
  categorySpending: CategorySpendingItem[];
  incomeBreakdown: IncomeBreakdownItem[];
  earningsProjection: EarningsProjectionItem[];
  insights: InsightCard[];
  monthlyReports: MonthlyReport[];
  spendingRate: SpendingRate;
  addAccount: (bankName: string, bankLogo: string, accountType: string) => void;
  removeAccount: (accountId: string) => void;
  hasAccounts: boolean;
}

const BankingContext = createContext<BankingContextType | undefined>(undefined);

export const useBanking = () => {
  const context = useContext(BankingContext);
  if (!context) throw new Error('useBanking must be used within a BankingProvider');
  return context;
};

const computeHealthScore = (
  monthlyIncome: number,
  monthlyExpenses: number,
  transactions: Transaction[],
  spendingStability: number
): { score: number; category: string } => {
  if (monthlyIncome === 0) return { score: 0, category: 'Poor' };

  // Income vs Expense ratio (25 pts)
  const expenseRatio = monthlyExpenses / monthlyIncome;
  let ratioScore = expenseRatio <= 0.5 ? 25 : expenseRatio <= 0.7 ? 20 : expenseRatio <= 0.85 ? 14 : expenseRatio <= 1.0 ? 7 : 0;

  // Savings percentage (25 pts)
  const savingsRate = ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100;
  let savingsScore = savingsRate >= 30 ? 25 : savingsRate >= 20 ? 20 : savingsRate >= 10 ? 14 : savingsRate >= 0 ? 7 : 0;

  // Bill payment consistency (25 pts)
  const utilityTxns = transactions.filter(t =>
    t.type === 'debit' && ['Utilities', 'Insurance', 'Housing', 'Loan'].includes(t.category)
  );
  const uniqueMonths = new Set(utilityTxns.map(t => t.date.substring(0, 7)));
  const consistencyScore = Math.min(25, Math.round(uniqueMonths.size * 8.3));

  // Spending stability (25 pts)
  const stabilityScore = Math.min(25, Math.round(spendingStability * 25));

  const score = Math.min(100, Math.round(ratioScore + savingsScore + consistencyScore + stabilityScore));

  let category: string;
  if (score >= 80) category = 'Excellent';
  else if (score >= 60) category = 'Good';
  else if (score >= 40) category = 'Average';
  else category = 'Poor';

  return { score, category };
};

export const BankingProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with mock data
  const [accounts, setAccounts] = useState<BankAccount[]>(mockAccounts);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>(allMockTransactions);

  const addAccount = useCallback((bankName: string, bankLogo: string, accountType: string) => {
    const newAccount: BankAccount = {
      id: `acc-${Date.now()}`,
      bankName,
      accountType,
      accountNumber: `****${Math.floor(1000 + Math.random() * 9000)}`,
      balance: Math.round((50000 + Math.random() * 500000) * 100) / 100,
      currency: 'INR',
      lastSync: new Date().toISOString(),
      isPrimary: accounts.length === 0,
      logo: bankLogo,
      color: '#666666',
    };
    const newTxns = generateTransactions(bankName);
    setAccounts(prev => [...prev, newAccount]);
    setAllTransactions(prev => [...prev, ...newTxns]);
  }, [accounts.length]);

  const removeAccount = useCallback((accountId: string) => {
    setAccounts(prev => {
      const account = prev.find(a => a.id === accountId);
      if (account) {
        setAllTransactions(txns => txns.filter(t => t.account !== account.bankName));
      }
      return prev.filter(a => a.id !== accountId);
    });
  }, []);

  const computed = useMemo(() => {
    const now = new Date();
    const currentMonth = now.toISOString().substring(0, 7);
    const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonth = prevMonthDate.toISOString().substring(0, 7);

    const monthTxns = allTransactions.filter(t => t.date.startsWith(currentMonth));
    const prevMonthTxns = allTransactions.filter(t => t.date.startsWith(prevMonth));

    const monthlyIncome = monthTxns.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
    const monthlyExpenses = monthTxns.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
    const prevExpenses = prevMonthTxns.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);

    const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
    const savingsRate = monthlyIncome > 0 ? Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 1000) / 10 : 0;

    // Spending rate
    const changePercent = prevExpenses > 0 ? Math.round(((monthlyExpenses - prevExpenses) / prevExpenses) * 1000) / 10 : 0;
    const spendingRate: SpendingRate = {
      currentMonth: Math.round(monthlyExpenses),
      previousMonth: Math.round(prevExpenses),
      changePercent: Math.abs(changePercent),
      direction: changePercent > 1 ? 'up' : changePercent < -1 ? 'down' : 'flat',
    };

    // Spending stability (0-1, lower variance = higher stability)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData: MonthlyDataPoint[] = [];
    const expenseValues: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const mTxns = allTransactions.filter(t => t.date.startsWith(key));
      const inc = mTxns.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
      const exp = mTxns.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
      monthlyData.push({ month: monthNames[d.getMonth()], income: Math.round(inc), expenses: Math.round(exp), savings: Math.round(inc - exp) });
      if (exp > 0) expenseValues.push(exp);
    }

    const avgExpense = expenseValues.length > 0 ? expenseValues.reduce((a, b) => a + b, 0) / expenseValues.length : 0;
    const variance = expenseValues.length > 1 ? expenseValues.reduce((s, v) => s + Math.pow(v - avgExpense, 2), 0) / expenseValues.length : 0;
    const cv = avgExpense > 0 ? Math.sqrt(variance) / avgExpense : 0;
    const spendingStability = Math.max(0, 1 - cv);

    const dashboardStats: DashboardStats = {
      totalBalance,
      monthlyIncome: Math.round(monthlyIncome * 100) / 100,
      monthlyExpenses: Math.round(monthlyExpenses * 100) / 100,
      savingsRate,
    };

    // Monthly reports
    const monthlyReports: MonthlyReport[] = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const mTxns = allTransactions.filter(t => t.date.startsWith(key));
      const inc = mTxns.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
      const exp = mTxns.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
      monthlyReports.push({
        month: d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
        totalIncome: Math.round(inc),
        totalExpenses: Math.round(exp),
        netSavings: Math.round(inc - exp),
      });
    }

    // Category spending
    const catMap = new Map<string, number>();
    const debitTxns = monthTxns.filter(t => t.type === 'debit');
    debitTxns.forEach(t => catMap.set(t.category, (catMap.get(t.category) || 0) + t.amount));
    const totalSpending = Array.from(catMap.values()).reduce((s, v) => s + v, 0);
    const colors = ['#f5f5f5', '#d4d4d4', '#a3a3a3', '#737373', '#525252', '#404040', '#262626'];
    const categorySpending: CategorySpendingItem[] = Array.from(catMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([cat, amount], i) => ({
        category: cat,
        amount: Math.round(amount),
        percentage: totalSpending > 0 ? Math.round((amount / totalSpending) * 100) : 0,
        color: colors[i % colors.length],
      }));

    // Income breakdown
    const incomeMap = new Map<string, number>();
    const creditTxns = monthTxns.filter(t => t.type === 'credit');
    creditTxns.forEach(t => {
      const key = t.description.includes('Salary') ? 'Salary'
        : t.description.includes('Freelance') ? 'Freelance'
        : t.description.includes('Dividend') || t.description.includes('Interest') || t.description.includes('FD') ? 'Investments'
        : 'Other';
      incomeMap.set(key, (incomeMap.get(key) || 0) + t.amount);
    });
    const incomeBreakdown: IncomeBreakdownItem[] = Array.from(incomeMap.entries())
      .map(([name, value]) => ({
        name,
        value: Math.round(value),
        percentage: monthlyIncome > 0 ? Math.round((value / monthlyIncome) * 100) : 0,
      }))
      .sort((a, b) => b.value - a.value);

    // Earnings projection
    const earningsProjection: EarningsProjectionItem[] = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - 2 + i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const mTxns = allTransactions.filter(t => t.date.startsWith(key));
      const actual = mTxns.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
      const projected = monthlyIncome > 0 ? Math.round(monthlyIncome * (0.95 + i * 0.03)) : Math.round(50000 + i * 5000);
      earningsProjection.push({
        month: monthNames[d.getMonth()],
        projected,
        actual: d <= now ? Math.round(actual) || null : null,
      });
    }

    const { score: healthScore, category: healthCategory } = computeHealthScore(monthlyIncome, monthlyExpenses, allTransactions, spendingStability);

    // Dynamic insights
    const insights: InsightCard[] = [];
    if (monthlyExpenses > monthlyIncome * 0.8) {
      insights.push({ id: '1', title: 'Spending Alert', message: `Your spending is ${Math.round((monthlyExpenses / monthlyIncome) * 100)}% of your income.`, type: 'warning', icon: 'TrendingUp' });
    }
    if (savingsRate >= 20) {
      insights.push({ id: '2', title: 'Great Savings!', message: `You're saving ${savingsRate}% of your income. Keep it up!`, type: 'success', icon: 'Target' });
    } else if (savingsRate > 0) {
      insights.push({ id: '2', title: 'Savings Goal', message: `Your savings rate is ${savingsRate}%. Aim for at least 20%.`, type: 'info', icon: 'Target' });
    }
    if (spendingRate.direction === 'up') {
      insights.push({ id: '3', title: 'Spending Up', message: `Monthly spending increased by ${spendingRate.changePercent}% vs last month.`, type: 'warning', icon: 'TrendingUp' });
    }
    if (insights.length === 0) {
      insights.push({ id: '1', title: 'Get Started', message: 'Link a bank account to see personalized insights.', type: 'info', icon: 'Target' });
    }

    return { dashboardStats, healthScore, healthCategory, monthlyData, categorySpending, incomeBreakdown, earningsProjection, insights, monthlyReports, spendingRate };
  }, [accounts, allTransactions]);

  return (
    <BankingContext.Provider
      value={{
        accounts,
        transactions: allTransactions,
        ...computed,
        addAccount,
        removeAccount,
        hasAccounts: accounts.length > 0,
      }}
    >
      {children}
    </BankingContext.Provider>
  );
};
