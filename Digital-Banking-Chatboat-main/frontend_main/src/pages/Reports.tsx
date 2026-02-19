import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  PieChart as PieChartIcon,
  BarChart3,
  FileText,
  ChevronDown
} from 'lucide-react';
import AppHeader from '@/components/layout/AppHeader';
import GlassCard from '@/components/ui/GlassCard';
import { useBanking } from '@/contexts/BankingContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Reports = () => {
  const { monthlyData, categorySpending, incomeBreakdown, monthlyReports, hasAccounts } = useBanking();
  const { formatAmount } = useCurrency();
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const isDark = theme === 'dark';
  const chartMuted = '#737373';
  const gridStroke = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  const areaStroke1 = isDark ? '#ffffff' : '#1a1a1a';
  const areaStroke2 = isDark ? '#737373' : '#a3a3a3';
  const barFill = isDark ? '#ffffff' : '#262626';

  const totalIncome = monthlyData.reduce((sum, m) => sum + m.income, 0);
  const totalExpenses = monthlyData.reduce((sum, m) => sum + m.expenses, 0);
  const totalSavings = monthlyData.reduce((sum, m) => sum + m.savings, 0);
  const avgSavingsRate = totalIncome > 0 ? ((totalSavings / totalIncome) * 100).toFixed(1) : '0.0';

  const topSpendingCategory = categorySpending.length > 0
    ? categorySpending.reduce((max, cat) => cat.amount > max.amount ? cat : max, categorySpending[0])
    : null;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatAmount(entry.value, false)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const downloadReport = (type: string) => {
    const reportData = {
      period: selectedPeriod,
      summary: { totalIncome, totalExpenses, totalSavings, avgSavingsRate },
      monthlyData,
      categorySpending,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-report-${type}.json`;
    a.click();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (!hasAccounts) {
    return (
      <div className="min-h-screen">
        <AppHeader title="Reports" subtitle="Detailed financial analytics and insights" />
        <div className="p-8">
          <GlassCard className="flex flex-col items-center justify-center py-16 text-center">
            <BarChart3 className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold font-display mb-2">No Report Data</h3>
            <p className="text-muted-foreground max-w-md">
              Link a bank account to generate financial reports with income trends, spending insights, and more.
            </p>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AppHeader title="Reports" subtitle="Detailed financial analytics and insights" />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-8 space-y-6"
      >
        {/* Controls */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            {(['monthly', 'yearly'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-primary/10 border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>

          <div className="relative group">
            <button className="glass-button flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
              <ChevronDown className="w-4 h-4" />
            </button>
            <div className="absolute right-0 mt-2 w-56 glass-card p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button onClick={() => downloadReport('summary')} className="w-full px-4 py-2 text-left text-sm rounded-lg hover:bg-glass-hover transition-colors flex items-center gap-2">
                <FileText className="w-4 h-4" /> Summary Report
              </button>
              <button onClick={() => downloadReport('detailed')} className="w-full px-4 py-2 text-left text-sm rounded-lg hover:bg-glass-hover transition-colors flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> Detailed Analytics
              </button>
              <button onClick={() => downloadReport('spending')} className="w-full px-4 py-2 text-left text-sm rounded-lg hover:bg-glass-hover transition-colors flex items-center gap-2">
                <PieChartIcon className="w-4 h-4" /> Spending Breakdown
              </button>
            </div>
          </div>
        </motion.div>

        {/* Summary Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <GlassCard>
            <p className="text-sm text-muted-foreground">Total Income</p>
            <p className="text-2xl font-bold font-display text-green-400 mt-2">{formatAmount(totalIncome)}</p>
            <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-400" /> From linked accounts
            </p>
          </GlassCard>
          <GlassCard>
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-2xl font-bold font-display mt-2">{formatAmount(totalExpenses)}</p>
            <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
              <TrendingDown className="w-4 h-4 text-muted-foreground" /> Across all categories
            </p>
          </GlassCard>
          <GlassCard>
            <p className="text-sm text-muted-foreground">Total Savings</p>
            <p className="text-2xl font-bold font-display mt-2">{formatAmount(totalSavings)}</p>
            <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-400" /> Net income - expenses
            </p>
          </GlassCard>
          <GlassCard>
            <p className="text-sm text-muted-foreground">Avg Savings Rate</p>
            <p className="text-2xl font-bold font-display mt-2">{avgSavingsRate}%</p>
            <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-400" /> {Number(avgSavingsRate) >= 20 ? 'Healthy' : 'Needs improvement'}
            </p>
          </GlassCard>
        </motion.div>

        {/* Main Charts */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold font-display">Financial Trend</h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: areaStroke1 }} />
                  <span className="text-muted-foreground">Income</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: areaStroke2 }} />
                  <span className="text-muted-foreground">Expenses</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-muted-foreground">Savings</span>
                </div>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="rIncomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={areaStroke1} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={areaStroke1} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="rExpenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={areaStroke2} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={areaStroke2} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="rSavingsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis dataKey="month" stroke={chartMuted} fontSize={12} />
                  <YAxis stroke={chartMuted} fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="income" stroke={areaStroke1} strokeWidth={2} fill="url(#rIncomeGrad)" name="Income" />
                  <Area type="monotone" dataKey="expenses" stroke={areaStroke2} strokeWidth={2} fill="url(#rExpenseGrad)" name="Expenses" />
                  <Area type="monotone" dataKey="savings" stroke="#4ade80" strokeWidth={2} fill="url(#rSavingsGrad)" name="Savings" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Spending Insights */}
          <GlassCard>
            <h3 className="text-lg font-semibold font-display mb-6">Spending Insights</h3>
            {topSpendingCategory ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-glass-bg border border-glass-border">
                  <p className="text-sm text-muted-foreground">Top Spending Category</p>
                  <p className="text-lg font-semibold mt-1">{topSpendingCategory.category}</p>
                  <p className="text-2xl font-bold font-display mt-2">{formatAmount(topSpendingCategory.amount)}</p>
                  <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-foreground rounded-full" style={{ width: `${topSpendingCategory.percentage}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{topSpendingCategory.percentage}% of total spending</p>
                </div>
                <div className="space-y-3">
                  {categorySpending.slice(0, 4).map((cat, index) => (
                    <div key={cat.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{index + 1}.</span>
                        <span className="text-sm">{cat.category}</span>
                      </div>
                      <span className="text-sm font-medium">{formatAmount(cat.amount, false)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No spending data yet.</p>
            )}
          </GlassCard>
        </motion.div>

        {/* Secondary Charts */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard>
            <h3 className="text-lg font-semibold font-display mb-6">Expense Distribution</h3>
            {categorySpending.length > 0 ? (
              <>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categorySpending} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={3} dataKey="amount" nameKey="category">
                        {categorySpending.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {categorySpending.map((cat) => (
                    <div key={cat.category} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="text-xs text-muted-foreground truncate">{cat.category}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-center py-8">No data available.</p>
            )}
          </GlassCard>

          <GlassCard>
            <h3 className="text-lg font-semibold font-display mb-6">Income Sources</h3>
            {incomeBreakdown.length > 0 ? (
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incomeBreakdown} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                    <XAxis type="number" stroke={chartMuted} fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
                    <YAxis type="category" dataKey="name" stroke={chartMuted} fontSize={12} width={80} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill={barFill} radius={[0, 4, 4, 0]} name="Amount" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No income data.</p>
            )}
          </GlassCard>
        </motion.div>

        {/* Monthly Reports Table */}
        <motion.div variants={itemVariants}>
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold font-display">Monthly Summary</h3>
              <button onClick={() => downloadReport('all')} className="glass-button flex items-center gap-2 text-sm">
                <Download className="w-4 h-4" /> Export All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-glass-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Month</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Income</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Expenses</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Net Savings</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyReports.map((report) => (
                    <tr key={report.month} className="border-b border-glass-border hover:bg-glass-hover transition-colors">
                      <td className="py-4 px-4 font-medium">{report.month}</td>
                      <td className="py-4 px-4 text-right text-green-400">{formatAmount(report.totalIncome, false)}</td>
                      <td className="py-4 px-4 text-right">{formatAmount(report.totalExpenses, false)}</td>
                      <td className={`py-4 px-4 text-right font-medium ${report.netSavings >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatAmount(report.netSavings, false)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Reports;
