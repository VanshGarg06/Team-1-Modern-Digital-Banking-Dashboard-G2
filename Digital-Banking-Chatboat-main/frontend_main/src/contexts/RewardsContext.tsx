import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import {
  mockRewardHistory,
  mockAchievements,
  RewardEntry,
  RewardAchievement,
  RewardLevel,
  getRewardLevel,
  getRewardLevelColor,
  getNextLevelThreshold,
} from '@/data/mockRewards';

interface RewardsContextType {
  totalPoints: number;
  level: RewardLevel;
  levelColor: string;
  nextLevel: { next: RewardLevel; threshold: number; progress: number };
  history: RewardEntry[];
  achievements: RewardAchievement[];
  addPoints: (description: string, points: number, category: string) => void;
}

const RewardsContext = createContext<RewardsContextType | undefined>(undefined);

export const useRewards = () => {
  const ctx = useContext(RewardsContext);
  if (!ctx) throw new Error('useRewards must be used within RewardsProvider');
  return ctx;
};

export const RewardsProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useState<RewardEntry[]>(mockRewardHistory);
  const [achievements] = useState<RewardAchievement[]>(mockAchievements);

  const addPoints = useCallback((description: string, points: number, category: string) => {
    const entry: RewardEntry = {
      id: `r-${Date.now()}`,
      description,
      points,
      date: new Date().toISOString().split('T')[0],
      type: 'earned',
      category,
    };
    setHistory(prev => [entry, ...prev]);
  }, []);

  const computed = useMemo(() => {
    const totalPoints = history.reduce((sum, r) => sum + r.points, 0);
    const level = getRewardLevel(totalPoints);
    return {
      totalPoints,
      level,
      levelColor: getRewardLevelColor(level),
      nextLevel: getNextLevelThreshold(totalPoints),
    };
  }, [history]);

  return (
    <RewardsContext.Provider value={{ ...computed, history, achievements, addPoints }}>
      {children}
    </RewardsContext.Provider>
  );
};
