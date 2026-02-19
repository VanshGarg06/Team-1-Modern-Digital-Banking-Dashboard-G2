import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { mockBills, MockBill, BillStatus } from '@/data/mockBills';

interface BillsContextType {
  bills: MockBill[];
  upcomingBills: MockBill[];
  overdueBills: MockBill[];
  paidBills: MockBill[];
  markAsPaid: (billId: string) => void;
  totalUpcoming: number;
  totalOverdue: number;
  paidCount: number;
  overdueCount: number;
}

const BillsContext = createContext<BillsContextType | undefined>(undefined);

export const useBills = () => {
  const ctx = useContext(BillsContext);
  if (!ctx) throw new Error('useBills must be used within BillsProvider');
  return ctx;
};

export const BillsProvider = ({ children }: { children: ReactNode }) => {
  const [bills, setBills] = useState<MockBill[]>(mockBills);

  const markAsPaid = useCallback((billId: string) => {
    setBills(prev =>
      prev.map(b => b.id === billId ? { ...b, status: 'paid' as BillStatus } : b)
    );
  }, []);

  const computed = useMemo(() => {
    const upcoming = bills.filter(b => b.status === 'upcoming');
    const overdue = bills.filter(b => b.status === 'overdue');
    const paid = bills.filter(b => b.status === 'paid');
    return {
      upcomingBills: upcoming,
      overdueBills: overdue,
      paidBills: paid,
      totalUpcoming: upcoming.reduce((s, b) => s + b.amount, 0),
      totalOverdue: overdue.reduce((s, b) => s + b.amount, 0),
      paidCount: paid.length,
      overdueCount: overdue.length,
    };
  }, [bills]);

  return (
    <BillsContext.Provider value={{ bills, markAsPaid, ...computed }}>
      {children}
    </BillsContext.Provider>
  );
};
