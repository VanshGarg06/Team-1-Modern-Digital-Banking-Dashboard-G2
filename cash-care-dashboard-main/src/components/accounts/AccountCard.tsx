import { motion } from 'framer-motion';
import { CreditCard, Wallet, PiggyBank, TrendingUp, Building2, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Account, AccountType } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface AccountCardProps {
  account: Account;
  onEdit: (account: Account) => void;
  onDelete: (account: Account) => void;
  index: number;
}

const accountIcons: Record<AccountType, typeof Wallet> = {
  checking: Wallet,
  savings: PiggyBank,
  credit_card: CreditCard,
  investment: TrendingUp,
  loan: Building2,
};

const accountGradients: Record<AccountType, string> = {
  checking: 'account-card-checking',
  savings: 'account-card-savings',
  credit_card: 'account-card-credit',
  investment: 'account-card-investment',
  loan: 'account-card-loan',
};

export function AccountCard({ account, onEdit, onDelete, index }: AccountCardProps) {
  const Icon = accountIcons[account.account_type] || Wallet;
  const gradientClass = accountGradients[account.account_type] || 'account-card-checking';

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative overflow-hidden rounded-2xl p-6 ${gradientClass}`}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border-4 border-current" />
        <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full border-4 border-current" />
      </div>

      <div className="relative">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/80">{account.bank_name}</p>
              <h3 className="font-display text-lg font-semibold text-white">
                {account.account_name}
              </h3>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white/80 hover:bg-white/10 hover:text-white">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(account)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(account)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Account number */}
        {account.masked_account && (
          <p className="mb-4 font-mono text-sm text-white/60">
            •••• •••• •••• {account.masked_account}
          </p>
        )}

        {/* Balance */}
        <div>
          <p className="text-sm text-white/60">Current Balance</p>
          <p className="font-display text-3xl font-bold text-white">
            {formatCurrency(account.balance, account.currency)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
