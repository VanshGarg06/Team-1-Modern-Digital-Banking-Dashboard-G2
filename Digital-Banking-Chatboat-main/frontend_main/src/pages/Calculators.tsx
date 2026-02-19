import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, PiggyBank, IndianRupee } from 'lucide-react';
import AppHeader from '@/components/layout/AppHeader';
import GlassCard from '@/components/ui/GlassCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Slider } from '@/components/ui/slider';

type CalculatorMode = 'sip' | 'lumpsum';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const Calculators = () => {
  const [mode, setMode] = useState<CalculatorMode>('sip');
  
  // SIP inputs
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  
  // Lumpsum inputs
  const [totalInvestment, setTotalInvestment] = useState(100000);

  const sipCalculation = useMemo(() => {
    const P = monthlyInvestment;
    const i = expectedReturn / 12 / 100; // Monthly interest rate
    const n = timePeriod * 12; // Total months
    
    // SIP Formula: M = P * [(1+i)^n - 1] / i * (1+i)
    const futureValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const investedAmount = P * n;
    const estimatedReturns = futureValue - investedAmount;
    
    return {
      investedAmount,
      estimatedReturns,
      totalValue: futureValue,
    };
  }, [monthlyInvestment, expectedReturn, timePeriod]);

  const lumpsumCalculation = useMemo(() => {
    const P = totalInvestment;
    const r = expectedReturn / 100; // Annual interest rate
    const n = timePeriod;
    
    // Lumpsum Formula: A = P * (1 + r)^n
    const futureValue = P * Math.pow(1 + r, n);
    const estimatedReturns = futureValue - P;
    
    return {
      investedAmount: P,
      estimatedReturns,
      totalValue: futureValue,
    };
  }, [totalInvestment, expectedReturn, timePeriod]);

  const calculation = mode === 'sip' ? sipCalculation : lumpsumCalculation;

  const chartData = [
    { name: 'Invested Amount', value: calculation.investedAmount, color: 'hsl(0, 0%, 55%)' },
    { name: 'Est. Returns', value: calculation.estimatedReturns, color: 'hsl(0, 0%, 95%)' },
  ];

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
      <AppHeader title="Investment Calculators" subtitle="Plan your investments with SIP & Lumpsum calculators" />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-8 space-y-6 max-w-6xl"
      >
        {/* Mode Toggle */}
        <motion.div variants={itemVariants}>
          <GlassCard className="p-2">
            <div className="flex">
              <button
                onClick={() => setMode('sip')}
                className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                  mode === 'sip'
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground hover:bg-glass-hover'
                }`}
              >
                <TrendingUp className="w-5 h-5" />
                SIP Calculator
              </button>
              <button
                onClick={() => setMode('lumpsum')}
                className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                  mode === 'lumpsum'
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground hover:bg-glass-hover'
                }`}
              >
                <PiggyBank className="w-5 h-5" />
                Lumpsum Calculator
              </button>
            </div>
          </GlassCard>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Controls */}
          <motion.div variants={itemVariants}>
            <GlassCard>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center">
                  <Calculator className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold font-display">
                  {mode === 'sip' ? 'SIP Investment' : 'Lumpsum Investment'}
                </h3>
              </div>

              <div className="space-y-8">
                {/* Investment Amount */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-muted-foreground">
                      {mode === 'sip' ? 'Monthly Investment' : 'Total Investment'}
                    </label>
                    <div className="flex items-center gap-1 text-lg font-semibold">
                      <IndianRupee className="w-4 h-4" />
                      {mode === 'sip' 
                        ? monthlyInvestment.toLocaleString('en-IN')
                        : totalInvestment.toLocaleString('en-IN')
                      }
                    </div>
                  </div>
                  <Slider
                    value={[mode === 'sip' ? monthlyInvestment : totalInvestment]}
                    onValueChange={(value) => {
                      if (mode === 'sip') {
                        setMonthlyInvestment(value[0]);
                      } else {
                        setTotalInvestment(value[0]);
                      }
                    }}
                    min={mode === 'sip' ? 500 : 10000}
                    max={mode === 'sip' ? 100000 : 10000000}
                    step={mode === 'sip' ? 500 : 10000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>{mode === 'sip' ? '₹500' : '₹10K'}</span>
                    <span>{mode === 'sip' ? '₹1L' : '₹1Cr'}</span>
                  </div>
                </div>

                {/* Expected Return Rate */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-muted-foreground">Expected Return Rate (p.a.)</label>
                    <span className="text-lg font-semibold">{expectedReturn}%</span>
                  </div>
                  <Slider
                    value={[expectedReturn]}
                    onValueChange={(value) => setExpectedReturn(value[0])}
                    min={1}
                    max={30}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>1%</span>
                    <span>30%</span>
                  </div>
                </div>

                {/* Time Period */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-muted-foreground">Time Period</label>
                    <span className="text-lg font-semibold">{timePeriod} years</span>
                  </div>
                  <Slider
                    value={[timePeriod]}
                    onValueChange={(value) => setTimePeriod(value[0])}
                    min={1}
                    max={40}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>1 yr</span>
                    <span>40 yrs</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Chart and Results */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Doughnut Chart */}
            <GlassCard>
              <h3 className="text-lg font-semibold font-display mb-4 text-center">Investment Breakdown</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        background: 'hsl(0 0% 10%)',
                        border: '1px solid hsl(0 0% 20%)',
                        borderRadius: '12px',
                        padding: '12px',
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value) => <span className="text-muted-foreground text-sm">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Result Summary */}
            <GlassCard>
              <h3 className="text-lg font-semibold font-display mb-6">Investment Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-glass-border">
                  <span className="text-muted-foreground">Invested Amount</span>
                  <span className="font-semibold">{formatCurrency(calculation.investedAmount)}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-glass-border">
                  <span className="text-muted-foreground">Est. Returns</span>
                  <span className="font-semibold text-green-400">
                    +{formatCurrency(calculation.estimatedReturns)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-foreground font-medium">Total Value</span>
                  <span className="text-2xl font-bold text-gradient">
                    {formatCurrency(calculation.totalValue)}
                  </span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Info Card */}
        <motion.div variants={itemVariants}>
          <GlassCard className="bg-glass-bg">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">How it works</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {mode === 'sip' ? (
                    <>
                      <strong>SIP (Systematic Investment Plan)</strong> allows you to invest a fixed amount regularly. 
                      The calculator uses the formula: M = P × [(1+i)^n - 1] / i × (1+i), where P is the monthly investment, 
                      i is the monthly interest rate, and n is the total number of months.
                    </>
                  ) : (
                    <>
                      <strong>Lumpsum Investment</strong> involves investing a one-time amount for a specific period. 
                      The calculator uses the compound interest formula: A = P × (1 + r)^n, where P is the principal amount, 
                      r is the annual interest rate, and n is the number of years.
                    </>
                  )}
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Calculators;
