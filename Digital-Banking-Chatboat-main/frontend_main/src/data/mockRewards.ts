export type RewardLevel = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface RewardEntry {
  id: string;
  description: string;
  points: number;
  date: string;
  type: 'earned' | 'redeemed';
  category: string;
}

export interface RewardAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
}

const now = new Date();
const daysAgo = (n: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
};

export const mockRewardHistory: RewardEntry[] = [
  { id: 'r-1', description: 'Electricity bill paid on time', points: 50, date: daysAgo(1), type: 'earned', category: 'Bill Payment' },
  { id: 'r-2', description: 'Maintained 25% savings rate', points: 100, date: daysAgo(3), type: 'earned', category: 'Savings' },
  { id: 'r-3', description: 'FinScore above 70', points: 75, date: daysAgo(5), type: 'earned', category: 'FinScore' },
  { id: 'r-4', description: 'Rent paid on time', points: 50, date: daysAgo(7), type: 'earned', category: 'Bill Payment' },
  { id: 'r-5', description: 'Water bill paid on time', points: 30, date: daysAgo(10), type: 'earned', category: 'Bill Payment' },
  { id: 'r-6', description: 'First bank account linked', points: 200, date: daysAgo(30), type: 'earned', category: 'Onboarding' },
  { id: 'r-7', description: 'Redeemed cashback', points: -100, date: daysAgo(12), type: 'redeemed', category: 'Redemption' },
  { id: 'r-8', description: 'SIP investment on time', points: 60, date: daysAgo(14), type: 'earned', category: 'Investment' },
  { id: 'r-9', description: 'Consistent spending - 4 weeks', points: 150, date: daysAgo(20), type: 'earned', category: 'Spending' },
  { id: 'r-10', description: 'Insurance premium paid', points: 40, date: daysAgo(22), type: 'earned', category: 'Bill Payment' },
];

export const mockAchievements: RewardAchievement[] = [
  { id: 'a-1', title: 'First Steps', description: 'Link your first bank account', icon: 'Link2', unlocked: true, unlockedDate: daysAgo(30) },
  { id: 'a-2', title: 'Bill Master', description: 'Pay 5 bills on time', icon: 'CheckCircle', unlocked: true, unlockedDate: daysAgo(5) },
  { id: 'a-3', title: 'Savings Star', description: 'Maintain 20%+ savings rate for a month', icon: 'Star', unlocked: true, unlockedDate: daysAgo(3) },
  { id: 'a-4', title: 'FinScore Pro', description: 'Achieve FinScore above 70', icon: 'Award', unlocked: true, unlockedDate: daysAgo(5) },
  { id: 'a-5', title: 'Budget Guru', description: 'Stay under budget for 3 months', icon: 'Target', unlocked: false },
  { id: 'a-6', title: 'Investor', description: 'Make 10 SIP investments', icon: 'TrendingUp', unlocked: false },
];

export function getRewardLevel(points: number): RewardLevel {
  if (points >= 2000) return 'Platinum';
  if (points >= 1000) return 'Gold';
  if (points >= 500) return 'Silver';
  return 'Bronze';
}

export function getRewardLevelColor(level: RewardLevel): string {
  switch (level) {
    case 'Platinum': return '#E5E4E2';
    case 'Gold': return '#FFD700';
    case 'Silver': return '#C0C0C0';
    case 'Bronze': return '#CD7F32';
  }
}

export function getNextLevelThreshold(points: number): { next: RewardLevel; threshold: number; progress: number } {
  if (points >= 2000) return { next: 'Platinum', threshold: 2000, progress: 100 };
  if (points >= 1000) return { next: 'Platinum', threshold: 2000, progress: ((points - 1000) / 1000) * 100 };
  if (points >= 500) return { next: 'Gold', threshold: 1000, progress: ((points - 500) / 500) * 100 };
  return { next: 'Silver', threshold: 500, progress: (points / 500) * 100 };
}
