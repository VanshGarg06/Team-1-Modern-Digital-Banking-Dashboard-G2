export interface MockTransaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'credit' | 'debit';
  account: string;
  balance?: number;
  currency: string;
}

const creditTemplates = [
  { desc: 'Salary Credit - NEFT', cat: 'Income', min: 35000, max: 120000 },
  { desc: 'Freelance Payment - UPI', cat: 'Income', min: 5000, max: 50000 },
  { desc: 'Dividend Credit', cat: 'Income', min: 500, max: 5000 },
  { desc: 'Refund - Flipkart', cat: 'Shopping', min: 200, max: 3000 },
  { desc: 'Interest Credit', cat: 'Income', min: 100, max: 2000 },
  { desc: 'FD Maturity Credit', cat: 'Income', min: 10000, max: 100000 },
  { desc: 'Cashback - PhonePe', cat: 'Income', min: 50, max: 500 },
];

const debitTemplates = [
  { desc: 'Hotstar Subscription', cat: 'Entertainment', min: 149, max: 1499 },
  { desc: 'BigBasket Grocery', cat: 'Food & Dining', min: 500, max: 5000 },
  { desc: 'Electricity Bill - BESCOM', cat: 'Utilities', min: 800, max: 3000 },
  { desc: 'Amazon India Purchase', cat: 'Shopping', min: 300, max: 15000 },
  { desc: 'Petrol - HP', cat: 'Transportation', min: 500, max: 3000 },
  { desc: 'Swiggy Order', cat: 'Food & Dining', min: 200, max: 1500 },
  { desc: 'Gym Membership - Cult', cat: 'Health & Fitness', min: 1000, max: 3000 },
  { desc: 'Chai Point', cat: 'Food & Dining', min: 50, max: 300 },
  { desc: 'Jio Recharge', cat: 'Utilities', min: 239, max: 999 },
  { desc: 'Uber India Ride', cat: 'Transportation', min: 100, max: 800 },
  { desc: 'Spotify India', cat: 'Entertainment', min: 119, max: 179 },
  { desc: 'Rent Payment - NEFT', cat: 'Housing', min: 8000, max: 35000 },
  { desc: 'Health Insurance - HDFC', cat: 'Insurance', min: 1500, max: 5000 },
  { desc: 'Water Bill - BWSSB', cat: 'Utilities', min: 200, max: 800 },
  { desc: 'SIP Investment - Zerodha', cat: 'Investment', min: 2000, max: 25000 },
  { desc: 'Myntra Purchase', cat: 'Shopping', min: 500, max: 5000 },
];

// Seeded random for consistency
let seed = 42;
function seededRandom() {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
}

export function generateTransactions(bankName: string, months = 3): MockTransaction[] {
  const now = new Date();
  const txns: MockTransaction[] = [];
  let runningBalance = 50000 + seededRandom() * 200000;

  for (let dayOffset = 0; dayOffset < months * 30; dayOffset++) {
    const date = new Date(now);
    date.setDate(date.getDate() - dayOffset);
    const dateStr = date.toISOString().split('T')[0];
    const txnCount = Math.floor(seededRandom() * 3) + 1;

    for (let t = 0; t < txnCount; t++) {
      const isCredit = seededRandom() < 0.25;
      const pool = isCredit ? creditTemplates : debitTemplates;
      const template = pool[Math.floor(seededRandom() * pool.length)];
      const amount = Math.round((template.min + seededRandom() * (template.max - template.min)) * 100) / 100;

      if (isCredit) runningBalance += amount;
      else runningBalance -= amount;

      txns.push({
        id: `${bankName}-${dayOffset}-${t}`,
        date: dateStr,
        description: template.desc,
        category: template.cat,
        amount,
        type: isCredit ? 'credit' : 'debit',
        account: bankName,
        balance: Math.round(runningBalance * 100) / 100,
        currency: 'INR',
      });
    }
  }

  return txns;
}

// Pre-generated transactions for default accounts
export const allMockTransactions: MockTransaction[] = [
  ...generateTransactions('State Bank of India'),
  ...generateTransactions('HDFC Bank'),
  ...generateTransactions('ICICI Bank'),
];
