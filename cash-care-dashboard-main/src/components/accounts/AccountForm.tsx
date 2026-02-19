import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Account, AccountType } from '@/lib/types';

interface AccountFormProps {
  account?: Account | null;
  onSubmit: (data: Partial<Account>) => void;
  onClose: () => void;
  isLoading?: boolean;
}

const accountTypes: { value: AccountType; label: string }[] = [
  { value: 'checking', label: 'Checking Account' },
  { value: 'savings', label: 'Savings Account' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'investment', label: 'Investment Account' },
  { value: 'loan', label: 'Loan' },
];

const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR'];

export function AccountForm({ account, onSubmit, onClose, isLoading }: AccountFormProps) {
  const [formData, setFormData] = useState({
    bank_name: '',
    account_name: '',
    account_type: 'checking' as AccountType,
    masked_account: '',
    currency: 'USD',
    balance: 0,
  });

  useEffect(() => {
    if (account) {
      setFormData({
        bank_name: account.bank_name,
        account_name: account.account_name,
        account_type: account.account_type,
        masked_account: account.masked_account || '',
        currency: account.currency,
        balance: account.balance,
      });
    }
  }, [account]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass-card w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-foreground">
            {account ? 'Edit Account' : 'Add New Account'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="bank_name">Bank Name</Label>
              <Input
                id="bank_name"
                value={formData.bank_name}
                onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                placeholder="Chase, Bank of America..."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account_name">Account Name</Label>
              <Input
                id="account_name"
                value={formData.account_name}
                onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                placeholder="Primary Checking"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="account_type">Account Type</Label>
              <Select
                value={formData.account_type}
                onValueChange={(value: AccountType) => setFormData({ ...formData, account_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {accountTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr} value={curr}>
                      {curr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="masked_account">Last 4 Digits (Optional)</Label>
              <Input
                id="masked_account"
                value={formData.masked_account}
                onChange={(e) => setFormData({ ...formData, masked_account: e.target.value.slice(0, 4) })}
                placeholder="1234"
                maxLength={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="balance">Current Balance</Label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                value={formData.balance}
                onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="glow" className="flex-1" disabled={isLoading}>
              {isLoading ? 'Saving...' : account ? 'Update Account' : 'Add Account'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
