import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Home, Car, GraduationCap, Heart, Shield, Receipt, PiggyBank, Wallet } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const formatCurrency = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

function SIPCalculator() {
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const months = years * 12;
  const r = rate / 100 / 12;
  const futureValue = r > 0 ? monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r) : monthly * months;
  const invested = monthly * months;
  const returns = futureValue - invested;

  const chartData = Array.from({ length: years }, (_, i) => {
    const m = (i + 1) * 12;
    const fv = r > 0 ? monthly * ((Math.pow(1 + r, m) - 1) / r) * (1 + r) : monthly * m;
    return { year: `Y${i + 1}`, invested: monthly * m, value: Math.round(fv) };
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2"><Label>Monthly Investment ($)</Label><Input type="number" value={monthly} onChange={e => setMonthly(+e.target.value)} /></div>
        <div className="space-y-2"><Label>Expected Return (% p.a.)</Label><Input type="number" step="0.1" value={rate} onChange={e => setRate(+e.target.value)} /></div>
        <div className="space-y-2"><Label>Time Period (years)</Label><Input type="number" value={years} onChange={e => setYears(+e.target.value)} /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-card p-4"><p className="text-sm text-muted-foreground">Invested</p><p className="font-display text-xl font-bold text-foreground">{formatCurrency(invested)}</p></div>
        <div className="glass-card p-4"><p className="text-sm text-muted-foreground">Est. Returns</p><p className="font-display text-xl font-bold text-green-400">{formatCurrency(returns)}</p></div>
        <div className="glass-card p-4"><p className="text-sm text-muted-foreground">Total Value</p><p className="font-display text-xl font-bold text-primary">{formatCurrency(futureValue)}</p></div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, color: 'hsl(var(--foreground))' }} formatter={(v: number) => formatCurrency(v)} />
            <Area type="monotone" dataKey="invested" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground) / 0.2)" />
            <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function LumpsumCalculator() {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(10);
  const [years, setYears] = useState(10);
  const fv = principal * Math.pow(1 + rate / 100, years);
  const chartData = Array.from({ length: years }, (_, i) => ({ year: `Y${i+1}`, value: Math.round(principal * Math.pow(1 + rate/100, i+1)) }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2"><Label>Investment ($)</Label><Input type="number" value={principal} onChange={e => setPrincipal(+e.target.value)} /></div>
        <div className="space-y-2"><Label>Expected Return (% p.a.)</Label><Input type="number" step="0.1" value={rate} onChange={e => setRate(+e.target.value)} /></div>
        <div className="space-y-2"><Label>Time (years)</Label><Input type="number" value={years} onChange={e => setYears(+e.target.value)} /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="glass-card p-4"><p className="text-sm text-muted-foreground">Invested</p><p className="font-display text-xl font-bold text-foreground">{formatCurrency(principal)}</p></div>
        <div className="glass-card p-4"><p className="text-sm text-muted-foreground">Future Value</p><p className="font-display text-xl font-bold text-primary">{formatCurrency(fv)}</p></div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} /><YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} /><Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, color: 'hsl(var(--foreground))' }} formatter={(v: number) => formatCurrency(v)} /><Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" /></AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function LoanCalculator({ title, icon: Icon }: { title: string; icon: any }) {
  const [principal, setPrincipal] = useState(title.includes('Car') ? 30000 : 300000);
  const [rate, setRate] = useState(title.includes('Car') ? 6 : 7);
  const [years, setYears] = useState(title.includes('Car') ? 5 : 30);
  const r = rate / 100 / 12;
  const n = years * 12;
  const emi = r > 0 ? principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : principal / n;
  const totalPayment = emi * n;
  const totalInterest = totalPayment - principal;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2"><Label>Loan Amount ($)</Label><Input type="number" value={principal} onChange={e => setPrincipal(+e.target.value)} /></div>
        <div className="space-y-2"><Label>Interest Rate (% p.a.)</Label><Input type="number" step="0.1" value={rate} onChange={e => setRate(+e.target.value)} /></div>
        <div className="space-y-2"><Label>Tenure (years)</Label><Input type="number" value={years} onChange={e => setYears(+e.target.value)} /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-card p-4"><p className="text-sm text-muted-foreground">Monthly EMI</p><p className="font-display text-xl font-bold text-primary">{formatCurrency(emi)}</p></div>
        <div className="glass-card p-4"><p className="text-sm text-muted-foreground">Total Interest</p><p className="font-display text-xl font-bold text-destructive">{formatCurrency(totalInterest)}</p></div>
        <div className="glass-card p-4"><p className="text-sm text-muted-foreground">Total Payment</p><p className="font-display text-xl font-bold text-foreground">{formatCurrency(totalPayment)}</p></div>
      </div>
    </div>
  );
}

function RetirementCalculator() {
  const [age, setAge] = useState(30);
  const [retireAge, setRetireAge] = useState(60);
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(8);
  const years = retireAge - age;
  const r = rate / 100 / 12;
  const n = years * 12;
  const corpus = r > 0 ? monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : monthly * n;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2"><Label>Current Age</Label><Input type="number" value={age} onChange={e => setAge(+e.target.value)} /></div>
        <div className="space-y-2"><Label>Retirement Age</Label><Input type="number" value={retireAge} onChange={e => setRetireAge(+e.target.value)} /></div>
        <div className="space-y-2"><Label>Monthly Savings ($)</Label><Input type="number" value={monthly} onChange={e => setMonthly(+e.target.value)} /></div>
        <div className="space-y-2"><Label>Expected Return (%)</Label><Input type="number" step="0.1" value={rate} onChange={e => setRate(+e.target.value)} /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="glass-card p-4"><p className="text-sm text-muted-foreground">Years to Retirement</p><p className="font-display text-xl font-bold text-foreground">{years} years</p></div>
        <div className="glass-card p-4"><p className="text-sm text-muted-foreground">Estimated Corpus</p><p className="font-display text-xl font-bold text-primary">{formatCurrency(corpus)}</p></div>
      </div>
    </div>
  );
}

function InsuranceCalculator() {
  const [income, setIncome] = useState(60000);
  const [age, setAge] = useState(30);
  const [dependents, setDependents] = useState(2);
  const [liabilities, setLiabilities] = useState(50000);
  const multiplier = age < 35 ? 15 : age < 45 ? 12 : 8;
  const coverage = (income * multiplier) + liabilities + (dependents * 100000);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2"><Label>Annual Income ($)</Label><Input type="number" value={income} onChange={e => setIncome(+e.target.value)} /></div>
        <div className="space-y-2"><Label>Age</Label><Input type="number" value={age} onChange={e => setAge(+e.target.value)} /></div>
        <div className="space-y-2"><Label>Dependents</Label><Input type="number" value={dependents} onChange={e => setDependents(+e.target.value)} /></div>
        <div className="space-y-2"><Label>Liabilities ($)</Label><Input type="number" value={liabilities} onChange={e => setLiabilities(+e.target.value)} /></div>
      </div>
      <div className="glass-card p-6">
        <p className="text-sm text-muted-foreground">Recommended Coverage</p>
        <p className="font-display text-3xl font-bold text-primary">{formatCurrency(coverage)}</p>
        <p className="mt-2 text-sm text-muted-foreground">Based on {multiplier}x income multiplier + liabilities + $100K per dependent</p>
      </div>
    </div>
  );
}

function TaxCalculator() {
  const [income, setIncome] = useState(85000);
  const [deductions, setDeductions] = useState(13850);
  const taxable = Math.max(0, income - deductions);
  // Simplified US brackets
  const brackets = [
    { min: 0, max: 11000, rate: 0.10 },
    { min: 11000, max: 44725, rate: 0.12 },
    { min: 44725, max: 95375, rate: 0.22 },
    { min: 95375, max: 182100, rate: 0.24 },
    { min: 182100, max: 231250, rate: 0.32 },
    { min: 231250, max: 578125, rate: 0.35 },
    { min: 578125, max: Infinity, rate: 0.37 },
  ];
  let tax = 0;
  for (const b of brackets) {
    if (taxable > b.min) {
      tax += (Math.min(taxable, b.max) - b.min) * b.rate;
    }
  }
  const effectiveRate = income > 0 ? (tax / income) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label>Annual Income ($)</Label><Input type="number" value={income} onChange={e => setIncome(+e.target.value)} /></div>
        <div className="space-y-2"><Label>Deductions ($)</Label><Input type="number" value={deductions} onChange={e => setDeductions(+e.target.value)} /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-card p-4"><p className="text-sm text-muted-foreground">Taxable Income</p><p className="font-display text-xl font-bold text-foreground">{formatCurrency(taxable)}</p></div>
        <div className="glass-card p-4"><p className="text-sm text-muted-foreground">Est. Tax</p><p className="font-display text-xl font-bold text-destructive">{formatCurrency(tax)}</p></div>
        <div className="glass-card p-4"><p className="text-sm text-muted-foreground">Effective Rate</p><p className="font-display text-xl font-bold text-primary">{effectiveRate.toFixed(1)}%</p></div>
      </div>
    </div>
  );
}

function PlanningCalculator({ title, defaultAmount, defaultYears, inflationDefault }: { title: string; defaultAmount: number; defaultYears: number; inflationDefault: number }) {
  const [currentCost, setCurrentCost] = useState(defaultAmount);
  const [years, setYears] = useState(defaultYears);
  const [inflation, setInflation] = useState(inflationDefault);
  const futureCost = currentCost * Math.pow(1 + inflation / 100, years);
  const monthlySavings = futureCost / (years * 12);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2"><Label>Current Est. Cost ($)</Label><Input type="number" value={currentCost} onChange={e => setCurrentCost(+e.target.value)} /></div>
        <div className="space-y-2"><Label>Years Away</Label><Input type="number" value={years} onChange={e => setYears(+e.target.value)} /></div>
        <div className="space-y-2"><Label>Inflation (%)</Label><Input type="number" step="0.1" value={inflation} onChange={e => setInflation(+e.target.value)} /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-card p-4"><p className="text-sm text-muted-foreground">Future Cost</p><p className="font-display text-xl font-bold text-primary">{formatCurrency(futureCost)}</p></div>
        <div className="glass-card p-4"><p className="text-sm text-muted-foreground">Monthly Savings Needed</p><p className="font-display text-xl font-bold text-foreground">{formatCurrency(monthlySavings)}</p></div>
        <div className="glass-card p-4"><p className="text-sm text-muted-foreground">Total to Save</p><p className="font-display text-xl font-bold text-green-400">{formatCurrency(futureCost)}</p></div>
      </div>
    </div>
  );
}

const calculators = [
  { id: 'sip', label: 'SIP', icon: TrendingUp },
  { id: 'lumpsum', label: 'Lumpsum', icon: PiggyBank },
  { id: 'retirement', label: 'Retirement', icon: Wallet },
  { id: 'insurance', label: 'Insurance', icon: Shield },
  { id: 'tax', label: 'Tax', icon: Receipt },
  { id: 'home-loan', label: 'Home Loan', icon: Home },
  { id: 'car-loan', label: 'Car Loan', icon: Car },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'marriage', label: 'Marriage', icon: Heart },
];

export default function Calculators() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-foreground">Financial Calculators</h1>
          <p className="mt-1 text-muted-foreground">Plan your finances with powerful calculators and visualizations.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Tabs defaultValue="sip" className="space-y-6">
            <TabsList className="flex flex-wrap h-auto gap-1 bg-muted p-1">
              {calculators.map(c => (
                <TabsTrigger key={c.id} value={c.id} className="flex items-center gap-1.5 text-xs sm:text-sm">
                  <c.icon className="h-4 w-4" />{c.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="glass-card p-6">
              <TabsContent value="sip"><SIPCalculator /></TabsContent>
              <TabsContent value="lumpsum"><LumpsumCalculator /></TabsContent>
              <TabsContent value="retirement"><RetirementCalculator /></TabsContent>
              <TabsContent value="insurance"><InsuranceCalculator /></TabsContent>
              <TabsContent value="tax"><TaxCalculator /></TabsContent>
              <TabsContent value="home-loan"><LoanCalculator title="Home Loan" icon={Home} /></TabsContent>
              <TabsContent value="car-loan"><LoanCalculator title="Car Loan" icon={Car} /></TabsContent>
              <TabsContent value="education"><PlanningCalculator title="Education" defaultAmount={100000} defaultYears={10} inflationDefault={5} /></TabsContent>
              <TabsContent value="marriage"><PlanningCalculator title="Marriage" defaultAmount={50000} defaultYears={5} inflationDefault={6} /></TabsContent>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
