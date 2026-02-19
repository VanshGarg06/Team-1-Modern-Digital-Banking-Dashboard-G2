import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Wallet } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AccountCard } from '@/components/accounts/AccountCard';
import { AccountForm } from '@/components/accounts/AccountForm';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Account } from '@/lib/types';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function Accounts() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAccounts();
    }
  }, [user]);

  const fetchAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAccounts((data || []) as Account[]);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast.error('Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: Partial<Account>) => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      if (editingAccount) {
        const { error } = await supabase
          .from('accounts')
          .update(formData)
          .eq('id', editingAccount.id);

        if (error) throw error;
        toast.success('Account updated successfully');
      } else {
        const { error } = await supabase
          .from('accounts')
          .insert([{ ...formData, user_id: user.id } as any]);

        if (error) throw error;
        toast.success('Account created successfully');
      }

      setShowForm(false);
      setEditingAccount(null);
      fetchAccounts();
    } catch (error) {
      console.error('Error saving account:', error);
      toast.error('Failed to save account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingAccount) return;

    try {
      const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', deletingAccount.id);

      if (error) throw error;
      toast.success('Account deleted successfully');
      setDeletingAccount(null);
      fetchAccounts();
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
    }
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAccount(null);
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Accounts</h1>
            <p className="mt-1 text-muted-foreground">
              Manage your bank accounts and track balances.
            </p>
          </div>
          <Button variant="glow" size="lg" onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-5 w-5" />
            Add Account
          </Button>
        </motion.div>

        {/* Total balance card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <Wallet className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Balance Across All Accounts</p>
              <p className="font-display text-3xl font-bold text-foreground">
                {formatCurrency(totalBalance)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Accounts grid */}
        {accounts.length === 0 && !loading ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card flex flex-col items-center justify-center p-16 text-center"
          >
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
              <Wallet className="h-10 w-10 text-primary" />
            </div>
            <h3 className="mb-2 font-display text-xl font-semibold text-foreground">
              No accounts yet
            </h3>
            <p className="mb-6 max-w-sm text-muted-foreground">
              Add your first bank account to start tracking your finances and manage your money better.
            </p>
            <Button variant="glow" size="lg" onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-5 w-5" />
              Add Your First Account
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {accounts.map((account, index) => (
              <AccountCard
                key={account.id}
                account={account}
                onEdit={handleEdit}
                onDelete={setDeletingAccount}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      {/* Account form modal */}
      <AnimatePresence>
        {showForm && (
          <AccountForm
            account={editingAccount}
            onSubmit={handleSubmit}
            onClose={handleCloseForm}
            isLoading={isSubmitting}
          />
        )}
      </AnimatePresence>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deletingAccount} onOpenChange={() => setDeletingAccount(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingAccount?.account_name}"? This action cannot be undone and will also delete all associated transactions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
