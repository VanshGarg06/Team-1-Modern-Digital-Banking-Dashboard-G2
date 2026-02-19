// Mock data for the banking application

export const currentUser = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'JD',
  phone: '+1 (555) 123-4567',
  address: '123 Main Street, New York, NY 10001',
  memberSince: '2022-03-15',
  twoFactorEnabled: true,
  lastLogin: '2024-01-15T10:30:00Z',
};

export const linkedAccounts = [
  {
    id: '1',
    bankName: 'Chase Bank',
    accountType: 'Checking',
    accountNumber: '****4521',
    balance: 12450.89,
    currency: 'USD',
    lastSync: '2024-01-15T08:00:00Z',
    isPrimary: true,
    logo: 'C',
  },
  {
    id: '2',
    bankName: 'Bank of America',
    accountType: 'Savings',
    accountNumber: '****7832',
    balance: 45230.50,
    currency: 'USD',
    lastSync: '2024-01-15T08:00:00Z',
    isPrimary: false,
    logo: 'B',
  },
  {
    id: '3',
    bankName: 'Wells Fargo',
    accountType: 'Credit Card',
    accountNumber: '****9012',
    balance: -2340.67,
    currency: 'USD',
    lastSync: '2024-01-14T20:00:00Z',
    isPrimary: false,
    logo: 'W',
  },
  {
    id: '4',
    bankName: 'Capital One',
    accountType: 'Investment',
    accountNumber: '****3456',
    balance: 78900.25,
    currency: 'USD',
    lastSync: '2024-01-15T06:00:00Z',
    isPrimary: false,
    logo: 'C',
  },
];

export const transactions = [
  { id: '1', date: '2024-01-15', description: 'Salary Deposit', category: 'Income', amount: 5500.00, type: 'credit', account: 'Chase Bank' },
  { id: '2', date: '2024-01-14', description: 'Netflix Subscription', category: 'Entertainment', amount: 15.99, type: 'debit', account: 'Chase Bank' },
  { id: '3', date: '2024-01-14', description: 'Grocery Store', category: 'Food & Dining', amount: 156.78, type: 'debit', account: 'Chase Bank' },
  { id: '4', date: '2024-01-13', description: 'Electric Bill', category: 'Utilities', amount: 124.50, type: 'debit', account: 'Bank of America' },
  { id: '5', date: '2024-01-13', description: 'Freelance Payment', category: 'Income', amount: 1200.00, type: 'credit', account: 'Chase Bank' },
  { id: '6', date: '2024-01-12', description: 'Amazon Purchase', category: 'Shopping', amount: 89.99, type: 'debit', account: 'Wells Fargo' },
  { id: '7', date: '2024-01-12', description: 'Gas Station', category: 'Transportation', amount: 45.00, type: 'debit', account: 'Chase Bank' },
  { id: '8', date: '2024-01-11', description: 'Restaurant Dinner', category: 'Food & Dining', amount: 78.50, type: 'debit', account: 'Wells Fargo' },
  { id: '9', date: '2024-01-11', description: 'Investment Dividend', category: 'Income', amount: 250.00, type: 'credit', account: 'Capital One' },
  { id: '10', date: '2024-01-10', description: 'Gym Membership', category: 'Health & Fitness', amount: 49.99, type: 'debit', account: 'Chase Bank' },
  { id: '11', date: '2024-01-10', description: 'Coffee Shop', category: 'Food & Dining', amount: 12.50, type: 'debit', account: 'Chase Bank' },
  { id: '12', date: '2024-01-09', description: 'Phone Bill', category: 'Utilities', amount: 85.00, type: 'debit', account: 'Bank of America' },
  { id: '13', date: '2024-01-08', description: 'Refund - Returns', category: 'Shopping', amount: 45.99, type: 'credit', account: 'Wells Fargo' },
  { id: '14', date: '2024-01-08', description: 'Uber Ride', category: 'Transportation', amount: 23.45, type: 'debit', account: 'Chase Bank' },
  { id: '15', date: '2024-01-07', description: 'Spotify Premium', category: 'Entertainment', amount: 9.99, type: 'debit', account: 'Chase Bank' },
];

export const incomeBreakdown = [
  { name: 'Salary', value: 5500, percentage: 73 },
  { name: 'Freelance', value: 1200, percentage: 16 },
  { name: 'Investments', value: 450, percentage: 6 },
  { name: 'Other', value: 350, percentage: 5 },
];

export const categorySpending = [
  { category: 'Food & Dining', amount: 580, percentage: 28, color: '#f5f5f5' },
  { category: 'Shopping', amount: 420, percentage: 20, color: '#d4d4d4' },
  { category: 'Transportation', amount: 280, percentage: 14, color: '#a3a3a3' },
  { category: 'Entertainment', amount: 220, percentage: 11, color: '#737373' },
  { category: 'Utilities', amount: 350, percentage: 17, color: '#525252' },
  { category: 'Health & Fitness', amount: 200, percentage: 10, color: '#404040' },
];

export const monthlyData = [
  { month: 'Jul', income: 6800, expenses: 4200, savings: 2600 },
  { month: 'Aug', income: 7100, expenses: 4500, savings: 2600 },
  { month: 'Sep', income: 6500, expenses: 4100, savings: 2400 },
  { month: 'Oct', income: 7200, expenses: 4800, savings: 2400 },
  { month: 'Nov', income: 7500, expenses: 5200, savings: 2300 },
  { month: 'Dec', income: 8200, expenses: 6100, savings: 2100 },
  { month: 'Jan', income: 7500, expenses: 4800, savings: 2700 },
];

export const earningsProjection = [
  { month: 'Jan', projected: 7200, actual: 7500 },
  { month: 'Feb', projected: 7400, actual: 7100 },
  { month: 'Mar', projected: 7600, actual: null },
  { month: 'Apr', projected: 7800, actual: null },
  { month: 'May', projected: 8000, actual: null },
  { month: 'Jun', projected: 8200, actual: null },
];

export const insightCards = [
  {
    id: '1',
    title: 'Spending Alert',
    message: 'You\'ve spent 15% more on dining this month compared to last month.',
    type: 'warning',
    icon: 'TrendingUp',
  },
  {
    id: '2',
    title: 'Savings Goal',
    message: 'You\'re on track to reach your $10,000 savings goal by March!',
    type: 'success',
    icon: 'Target',
  },
  {
    id: '3',
    title: 'Bill Reminder',
    message: 'Your rent payment of $1,500 is due in 3 days.',
    type: 'info',
    icon: 'Calendar',
  },
];

export const supportedBanks = [
  { id: '1', name: 'State Bank of India', logo: 'SBI', color: '#1A4B8C' },
  { id: '2', name: 'HDFC Bank', logo: 'H', color: '#004B87' },
  { id: '3', name: 'ICICI Bank', logo: 'I', color: '#F58220' },
  { id: '4', name: 'Axis Bank', logo: 'A', color: '#97144D' },
  { id: '5', name: 'Kotak Mahindra Bank', logo: 'K', color: '#ED1C24' },
  { id: '6', name: 'Punjab National Bank', logo: 'PNB', color: '#003580' },
  { id: '7', name: 'Bank of Baroda', logo: 'BOB', color: '#F47920' },
  { id: '8', name: 'IndusInd Bank', logo: 'IB', color: '#6A1D5F' },
];

export const monthlyReports = [
  { month: 'January 2024', totalIncome: 7500, totalExpenses: 4800, netSavings: 2700 },
  { month: 'December 2023', totalIncome: 8200, totalExpenses: 6100, netSavings: 2100 },
  { month: 'November 2023', totalIncome: 7500, totalExpenses: 5200, netSavings: 2300 },
  { month: 'October 2023', totalIncome: 7200, totalExpenses: 4800, netSavings: 2400 },
  { month: 'September 2023', totalIncome: 6500, totalExpenses: 4100, netSavings: 2400 },
  { month: 'August 2023', totalIncome: 7100, totalExpenses: 4500, netSavings: 2600 },
];

export const financialHealthScore = 76;

export const dashboardStats = {
  totalBalance: 134241.97,
  monthlyIncome: 7500.00,
  monthlyExpenses: 4823.45,
  savingsRate: 35.7,
};
