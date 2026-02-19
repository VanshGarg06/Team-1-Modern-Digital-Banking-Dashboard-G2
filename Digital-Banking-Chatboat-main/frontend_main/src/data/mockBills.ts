export type BillStatus = 'upcoming' | 'overdue' | 'paid';

export interface MockBill {
  id: string;
  name: string;
  category: string;
  amount: number;
  dueDate: string;
  status: BillStatus;
  payee: string;
  recurring: boolean;
  icon: string;
}

const now = new Date();
const fmt = (d: Date) => d.toISOString().split('T')[0];
const daysAgo = (n: number) => { const d = new Date(now); d.setDate(d.getDate() - n); return fmt(d); };
const daysFromNow = (n: number) => { const d = new Date(now); d.setDate(d.getDate() + n); return fmt(d); };

export const mockBills: MockBill[] = [
  {
    id: 'bill-1',
    name: 'Electricity Bill',
    category: 'Utilities',
    amount: 2450,
    dueDate: daysFromNow(3),
    status: 'upcoming',
    payee: 'BESCOM',
    recurring: true,
    icon: 'Zap',
  },
  {
    id: 'bill-2',
    name: 'Rent Payment',
    category: 'Housing',
    amount: 25000,
    dueDate: daysFromNow(5),
    status: 'upcoming',
    payee: 'Landlord - NEFT',
    recurring: true,
    icon: 'Home',
  },
  {
    id: 'bill-3',
    name: 'Internet Bill',
    category: 'Utilities',
    amount: 1199,
    dueDate: daysAgo(2),
    status: 'overdue',
    payee: 'ACT Fibernet',
    recurring: true,
    icon: 'Wifi',
  },
  {
    id: 'bill-4',
    name: 'Mobile Recharge',
    category: 'Utilities',
    amount: 719,
    dueDate: daysFromNow(10),
    status: 'upcoming',
    payee: 'Jio',
    recurring: true,
    icon: 'Smartphone',
  },
  {
    id: 'bill-5',
    name: 'Health Insurance',
    category: 'Insurance',
    amount: 3500,
    dueDate: daysAgo(5),
    status: 'overdue',
    payee: 'HDFC Ergo',
    recurring: true,
    icon: 'Heart',
  },
  {
    id: 'bill-6',
    name: 'SIP Investment',
    category: 'Investment',
    amount: 10000,
    dueDate: daysFromNow(7),
    status: 'upcoming',
    payee: 'Zerodha - Mutual Fund',
    recurring: true,
    icon: 'TrendingUp',
  },
  {
    id: 'bill-7',
    name: 'Water Bill',
    category: 'Utilities',
    amount: 450,
    dueDate: daysAgo(15),
    status: 'paid',
    payee: 'BWSSB',
    recurring: true,
    icon: 'Droplets',
  },
  {
    id: 'bill-8',
    name: 'Netflix Subscription',
    category: 'Entertainment',
    amount: 649,
    dueDate: daysAgo(10),
    status: 'paid',
    payee: 'Netflix India',
    recurring: true,
    icon: 'Tv',
  },
  {
    id: 'bill-9',
    name: 'Gym Membership',
    category: 'Health & Fitness',
    amount: 2000,
    dueDate: daysAgo(8),
    status: 'paid',
    payee: 'Cult.fit',
    recurring: true,
    icon: 'Dumbbell',
  },
  {
    id: 'bill-10',
    name: 'Car EMI',
    category: 'Loan',
    amount: 15800,
    dueDate: daysFromNow(12),
    status: 'upcoming',
    payee: 'HDFC Bank Auto Loan',
    recurring: true,
    icon: 'Car',
  },
];
