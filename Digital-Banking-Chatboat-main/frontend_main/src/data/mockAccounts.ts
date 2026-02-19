export interface MockAccount {
  id: string;
  bankName: string;
  accountType: string;
  accountNumber: string;
  balance: number;
  currency: string;
  lastSync: string;
  isPrimary: boolean;
  logo: string;
  color: string;
}

export const mockAccounts: MockAccount[] = [
  {
    id: 'acc-sbi-1',
    bankName: 'State Bank of India',
    accountType: 'Savings',
    accountNumber: '****4521',
    balance: 245800.50,
    currency: 'INR',
    lastSync: new Date().toISOString(),
    isPrimary: true,
    logo: 'SBI',
    color: '#1A4B8C',
  },
  {
    id: 'acc-hdfc-1',
    bankName: 'HDFC Bank',
    accountType: 'Salary',
    accountNumber: '****7832',
    balance: 132450.75,
    currency: 'INR',
    lastSync: new Date().toISOString(),
    isPrimary: false,
    logo: 'H',
    color: '#004B87',
  },
  {
    id: 'acc-icici-1',
    bankName: 'ICICI Bank',
    accountType: 'Credit Card',
    accountNumber: '****9012',
    balance: -18340.00,
    currency: 'INR',
    lastSync: new Date().toISOString(),
    isPrimary: false,
    logo: 'I',
    color: '#F58220',
  },
];
