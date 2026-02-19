import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, Target, Calendar, AlertTriangle, Link2, Award, CreditCard, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/layout/AppHeader';
import GlassCard from '@/components/ui/GlassCard';
import HealthScoreGauge from '@/components/dashboard/HealthScoreGauge';
import { useBanking } from '@/contexts/BankingContext';
import { useBills } from '@/contexts/BillsContext';
import { useRewards } from '@/contexts/RewardsContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
} from 'recharts';

const StatCard = ({ title, value, change, icon: Icon, positive }: { title: string; value: string; change?: string; icon: any; positive?: boolean }) => (
  <GlassCard hover className="relative overflow-hidden">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="stat-value mt-2">{value}</p>
        {change && (
          <p className={`text-sm mt-2 flex items-center gap-1 ${positive ? 'text-green-500' : 'text-red-500'}`}>
            {positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {change}
          </p>
        )}
      </div>
      <div className="w-12 h-12 rounded-xl bg-glass-bg flex items-center justify-center">
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </GlassCard>
);

const InsightCard = ({ insight }: { insight: { id: string; title: string; message: string; type: string; icon: string } }) => {
  const icons = { TrendingUp, Target, Calendar };
  const Icon = icons[insight.icon as keyof typeof icons] || AlertTriangle;
  const bgColors = {
    warning: 'from-yellow-500/10 to-transparent border-yellow-500/20',
    success: 'from-green-500/10 to-transparent border-green-500/20',
    info: 'from-blue-500/10 to-transparent border-blue-500/20',
  };
  return (
    <motion.div whileHover={{ scale: 1.02 }} className={`p-4 rounded-xl bg-gradient-to-r ${bgColors[insight.type as keyof typeof bgColors]} border`}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-glass-bg"><Icon className="w-4 h-4" /></div>
        <div>
          <p className="font-medium text-sm">{insight.title}</p>
          <p className="text-xs text-muted-foreground mt-1">{insight.message}</p>
        </div>
      </div>
    </motion.div>
  );
};

const EmptyState = () => {
  const navigate = useNavigate();
  return (
    <GlassCard className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-2xl bg-glass-bg flex items-center justify-center mb-6">
        <Link2 className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold font-display mb-2">No Accounts Linked</h3>
      <p className="text-muted-foreground max-w-md mb-8">Link your bank accounts to see your financial dashboard come alive.</p>
      <button onClick={() => navigate('/link-bank')} className="glass-button-primary flex items-center gap-2">
        <Link2 className="w-4 h-4" /> Link Your First Account
      </button>
    </GlassCard>
  );
};

const Dashboard = () => {
  const { profile } = useAuth();
  const { theme } = useTheme();
  const { formatAmount } = useCurrency();
  const navigate = useNavigate();
  const { dashboardStats, healthScore, healthCategory, monthlyData, categorySpending, incomeBreakdown, earningsProjection, insights, hasAccounts, spendingRate } = useBanking();
  const { upcomingBills, overdueBills } = useBills();
  const { totalPoints, level, levelColor, nextLevel } = useRewards();

  const isDark = theme === 'dark';
  const chartFg = isDark ? '#e5e5e5' : '#262626';
  const chartMuted = '#737373';
  const gridStroke = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  const areaStroke1 = isDark ? '#ffffff' : '#1a1a1a';
  const areaStroke2 = isDark ? '#737373' : '#a3a3a3';
  const pieColors = isDark ? ['#ffffff', '#d4d4d4', '#a3a3a3', '#737373'] : ['#1a1a1a', '#404040', '#737373', '#a3a3a3'];
  const barFill = isDark ? '#ffffff' : '#262626';
  const firstName = profile?.full_name?.split(' ')[0] || 'User';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>{entry.name}: {formatAmount(entry.value, false)}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  const SpendingDirectionIcon = spendingRate.direction === 'up' ? ArrowUpRight : spendingRate.direction === 'down' ? ArrowDownRight : Minus;

  return (
    <div className="min-h-screen">
      <AppHeader title="Dashboard" subtitle={`Welcome back, ${firstName}!`} />
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-8 space-y-8">
        {!hasAccounts ? (
          <motion.div variants={itemVariants}><EmptyState /></motion.div>
        ) : (
          <>
            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Balance" value={formatAmount(dashboardStats.totalBalance)} icon={DollarSign} />
              <StatCard title="Monthly Income" value={formatAmount(dashboardStats.monthlyIncome)} icon={TrendingUp} positive />
              <StatCard title="Monthly Expenses" value={formatAmount(dashboardStats.monthlyExpenses)} icon={TrendingDown} />
              <StatCard title="Savings Rate" value={`${dashboardStats.savingsRate}%`} change={dashboardStats.savingsRate > 20 ? 'Healthy' : 'Needs attention'} icon={PiggyBank} positive={dashboardStats.savingsRate > 20} />
            </motion.div>

            {/* FinScore + Spending Rate + Rewards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* FinScore */}
              <GlassCard className="flex flex-col items-center justify-center">
                <h3 className="text-lg font-semibold font-display mb-4">FinHealth Score</h3>
                <HealthScoreGauge score={healthScore} size={180} />
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  {healthCategory} — {healthScore >= 70 ? 'Your financial health is strong!' : healthScore >= 40 ? 'Room for improvement.' : 'Focus on reducing expenses.'}
                </p>
              </GlassCard>

              {/* Spending Rate */}
              <GlassCard>
                <h3 className="text-lg font-semibold font-display mb-4">Spending Rate</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${spendingRate.direction === 'up' ? 'bg-red-500/20' : spendingRate.direction === 'down' ? 'bg-green-500/20' : 'bg-muted/30'}`}>
                    <SpendingDirectionIcon className={`w-7 h-7 ${spendingRate.direction === 'up' ? 'text-red-400' : spendingRate.direction === 'down' ? 'text-green-400' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-display">{formatAmount(spendingRate.currentMonth, false)}</p>
                    <p className="text-sm text-muted-foreground">this month</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-glass-bg border border-glass-border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">vs last month</span>
                    <span className={`text-sm font-semibold flex items-center gap-1 ${spendingRate.direction === 'up' ? 'text-red-400' : spendingRate.direction === 'down' ? 'text-green-400' : 'text-muted-foreground'}`}>
                      {spendingRate.direction === 'up' ? '↑' : spendingRate.direction === 'down' ? '↓' : '→'} {spendingRate.changePercent}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Previous: {formatAmount(spendingRate.previousMonth, false)}</p>
                </div>
              </GlassCard>

              {/* Rewards */}
              <GlassCard>
                <h3 className="text-lg font-semibold font-display mb-4">Rewards</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${levelColor}20` }}>
                    <Award className="w-7 h-7" style={{ color: levelColor }} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-display">{totalPoints} pts</p>
                    <p className="text-sm font-medium" style={{ color: levelColor }}>{level}</p>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{level}</span>
                    <span>{nextLevel.next}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${nextLevel.progress}%`, backgroundColor: levelColor }} />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{Math.round(nextLevel.threshold - totalPoints)} pts to {nextLevel.next}</p>
              </GlassCard>
            </motion.div>

            {/* Main Charts Row */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <GlassCard className="lg:col-span-2">
                <h3 className="text-lg font-semibold font-display mb-6">Income vs Expenses</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
                      <defs>
                        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={areaStroke1} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={areaStroke1} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={areaStroke2} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={areaStroke2} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                      <XAxis dataKey="month" stroke={chartMuted} fontSize={12} />
                      <YAxis stroke={chartMuted} fontSize={12} tickFormatter={(value) => `₹${value / 1000}k`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="income" stroke={areaStroke1} strokeWidth={2} fill="url(#incomeGradient)" name="Income" />
                      <Area type="monotone" dataKey="expenses" stroke={areaStroke2} strokeWidth={2} fill="url(#expenseGradient)" name="Expenses" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              {/* Upcoming Bills Widget */}
              <GlassCard>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold font-display">Bills Due</h3>
                  <button onClick={() => navigate('/bills')} className="text-xs text-muted-foreground hover:text-foreground transition-colors">View All →</button>
                </div>
                <div className="space-y-3">
                  {overdueBills.slice(0, 2).map(bill => (
                    <div key={bill.id} className="flex items-center justify-between p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                      <div>
                        <p className="text-sm font-medium">{bill.name}</p>
                        <p className="text-xs text-red-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Overdue</p>
                      </div>
                      <p className="font-semibold text-sm">{formatAmount(bill.amount, false)}</p>
                    </div>
                  ))}
                  {upcomingBills.slice(0, 3).map(bill => (
                    <div key={bill.id} className="flex items-center justify-between p-3 rounded-xl bg-glass-bg border border-glass-border">
                      <div>
                        <p className="text-sm font-medium">{bill.name}</p>
                        <p className="text-xs text-muted-foreground">Due {new Date(bill.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                      </div>
                      <p className="font-semibold text-sm">{formatAmount(bill.amount, false)}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Secondary Charts */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassCard>
                <h3 className="text-lg font-semibold font-display mb-6">Savings Progress</h3>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                      <XAxis dataKey="month" stroke={chartMuted} fontSize={12} />
                      <YAxis stroke={chartMuted} fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="savings" fill="#4ade80" radius={[4, 4, 0, 0]} name="Savings" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="text-lg font-semibold font-display mb-6">Category Spending</h3>
                {categorySpending.length > 0 ? (
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categorySpending} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                        <XAxis type="number" stroke={chartMuted} fontSize={12} tickFormatter={(value) => `₹${value / 1000}k`} />
                        <YAxis type="category" dataKey="category" stroke={chartMuted} fontSize={11} width={100} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="amount" fill={barFill} radius={[0, 4, 4, 0]} name="Amount" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No spending data yet.</p>
                )}
              </GlassCard>
            </motion.div>

            {/* Earnings + Insights */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <GlassCard className="lg:col-span-2">
                <h3 className="text-lg font-semibold font-display mb-6">Earnings Projection</h3>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={earningsProjection}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                      <XAxis dataKey="month" stroke={chartMuted} fontSize={12} />
                      <YAxis stroke={chartMuted} fontSize={12} tickFormatter={(value) => `₹${value / 1000}k`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="projected" stroke={chartMuted} strokeWidth={2} strokeDasharray="5 5" dot={false} name="Projected" />
                      <Line type="monotone" dataKey="actual" stroke={chartFg} strokeWidth={2} dot={{ fill: chartFg, strokeWidth: 2 }} name="Actual" connectNulls={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="text-lg font-semibold font-display mb-6">Insights</h3>
                <div className="space-y-4">
                  {insights.map((insight) => (
                    <InsightCard key={insight.id} insight={insight} />
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
