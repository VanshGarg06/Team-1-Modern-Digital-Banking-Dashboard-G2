import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Utensils, 
  Car, 
  Home, 
  Plane, 
  Gamepad2, 
  Heart, 
  Briefcase,
  ArrowUpRight,
  ArrowDownLeft,
  MoreHorizontal
} from 'lucide-react';
import { Transaction } from '@/lib/types';
import { format } from 'date-fns';

interface TransactionRowProps {
  transaction: Transaction;
  index: number;
}

const categoryIcons: Record<string, typeof ShoppingCart> = {
  shopping: ShoppingCart,
  food: Utensils,
  transport: Car,
  housing: Home,
  travel: Plane,
  entertainment: Gamepad2,
  health: Heart,
  income: Briefcase,
};

export function TransactionRow({ transaction, index }: TransactionRowProps) {
  const Icon = categoryIcons[transaction.category?.toLowerCase() || ''] || ShoppingCart;
  const isCredit = transaction.txn_type === 'credit';

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="transaction-row flex items-center gap-4 rounded-xl p-4"
    >
      {/* Icon */}
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
        isCredit ? 'bg-success/10' : 'bg-muted'
      }`}>
        <Icon className={`h-5 w-5 ${isCredit ? 'text-success' : 'text-muted-foreground'}`} />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="truncate font-medium text-foreground">{transaction.description}</h4>
        <p className="text-sm text-muted-foreground">
          {transaction.merchant || transaction.category || 'Uncategorized'} • {format(new Date(transaction.txn_date), 'MMM d, yyyy')}
        </p>
      </div>

      {/* Amount */}
      <div className="flex items-center gap-2">
        <span className={`font-display text-lg font-semibold ${
          isCredit ? 'text-success' : 'text-foreground'
        }`}>
          {isCredit ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount), transaction.currency)}
        </span>
        {isCredit ? (
          <ArrowDownLeft className="h-4 w-4 text-success" />
        ) : (
          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
    </motion.div>
  );
}
