import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Check, AlertCircle, Loader2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Account, TransactionType } from '@/lib/types';
import { toast } from 'sonner';
import { useEffect } from 'react';

interface ParsedTransaction {
  description: string;
  amount: number;
  txn_type: TransactionType;
  txn_date: string;
  category?: string;
  merchant?: string;
}

export default function Import() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedTransaction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAccounts();
    }
  }, [user]);

  const fetchAccounts = async () => {
    const { data } = await supabase
      .from('accounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setAccounts(data as Account[]);
      if (data.length > 0 && !selectedAccount) {
        setSelectedAccount(data[0].id);
      }
    }
  };

  const parseCSV = (text: string): ParsedTransaction[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/"/g, ''));
    const transactions: ParsedTransaction[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      if (values.length < 2) continue;

      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      // Try to find date, description, and amount columns
      const dateValue = row['date'] || row['txn_date'] || row['transaction date'] || row['posted date'] || values[0];
      const description = row['description'] || row['memo'] || row['name'] || values[1];
      const amountStr = row['amount'] || row['value'] || values[2] || '0';
      const category = row['category'] || row['type'] || '';
      const merchant = row['merchant'] || row['payee'] || '';

      // Parse amount
      let amount = parseFloat(amountStr.replace(/[^-0-9.]/g, '')) || 0;
      const txn_type: TransactionType = amount >= 0 ? 'credit' : 'debit';
      amount = Math.abs(amount);

      // Parse date
      let txn_date: string;
      try {
        const parsedDate = new Date(dateValue);
        if (isNaN(parsedDate.getTime())) {
          txn_date = new Date().toISOString();
        } else {
          txn_date = parsedDate.toISOString();
        }
      } catch {
        txn_date = new Date().toISOString();
      }

      if (description && amount > 0) {
        transactions.push({
          description,
          amount,
          txn_type,
          txn_date,
          category: category || undefined,
          merchant: merchant || undefined,
        });
      }
    }

    return transactions;
  };

  const handleFile = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setIsProcessing(true);

    try {
      const text = await uploadedFile.text();
      const parsed = parseCSV(text);
      setParsedData(parsed);

      if (parsed.length === 0) {
        toast.error('No valid transactions found in the CSV file');
      } else {
        toast.success(`Found ${parsed.length} transactions`);
      }
    } catch (error) {
      console.error('Error parsing CSV:', error);
      toast.error('Failed to parse CSV file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv')) {
        handleFile(droppedFile);
      } else {
        toast.error('Please upload a CSV file');
      }
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!selectedAccount || parsedData.length === 0) return;

    setIsImporting(true);

    try {
      const account = accounts.find(a => a.id === selectedAccount);
      const transactionsToInsert = parsedData.map(t => ({
        account_id: selectedAccount,
        description: t.description,
        amount: t.amount,
        txn_type: t.txn_type,
        txn_date: t.txn_date,
        currency: account?.currency || 'USD',
        category: t.category,
        merchant: t.merchant,
      }));

      const { error } = await supabase
        .from('transactions')
        .insert(transactionsToInsert);

      if (error) throw error;

      toast.success(`Successfully imported ${parsedData.length} transactions`);
      setFile(null);
      setParsedData([]);
    } catch (error) {
      console.error('Error importing transactions:', error);
      toast.error('Failed to import transactions');
    } finally {
      setIsImporting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-3xl font-bold text-foreground">Import Transactions</h1>
          <p className="mt-1 text-muted-foreground">
            Upload a CSV file to import your transaction history.
          </p>
        </motion.div>

        {/* Account selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <label className="mb-2 block text-sm font-medium text-foreground">
            Select Target Account
          </label>
          {accounts.length === 0 ? (
            <div className="rounded-lg bg-warning/10 p-4">
              <div className="flex items-center gap-2 text-warning">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm font-medium">No accounts found. Please create an account first.</p>
              </div>
            </div>
          ) : (
            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.account_name} ({account.bank_name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </motion.div>

        {/* File upload area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div
            className={`glass-card relative flex flex-col items-center justify-center p-12 text-center transition-all ${
              dragActive ? 'border-2 border-dashed border-primary bg-primary/5' : ''
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="absolute inset-0 cursor-pointer opacity-0"
              disabled={accounts.length === 0}
            />

            {isProcessing ? (
              <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
            ) : file ? (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                <FileText className="h-6 w-6 text-success" />
              </div>
            ) : (
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Upload className="h-8 w-8 text-primary" />
              </div>
            )}

            {file ? (
              <div className="mt-4">
                <p className="font-medium text-foreground">{file.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {parsedData.length} transactions found
                </p>
              </div>
            ) : (
              <>
                <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                  Drop your CSV file here
                </h3>
                <p className="text-sm text-muted-foreground">
                  or click to browse files
                </p>
              </>
            )}
          </div>
        </motion.div>

        {/* Preview */}
        {parsedData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <h3 className="mb-4 font-display text-lg font-semibold text-foreground">
              Preview ({Math.min(5, parsedData.length)} of {parsedData.length})
            </h3>
            <div className="space-y-3">
              {parsedData.slice(0, 5).map((t, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-muted p-3">
                  <div>
                    <p className="font-medium text-foreground">{t.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(t.txn_date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`font-semibold ${
                    t.txn_type === 'credit' ? 'text-success' : 'text-foreground'
                  }`}>
                    {t.txn_type === 'credit' ? '+' : '-'}{formatCurrency(t.amount)}
                  </span>
                </div>
              ))}
            </div>

            <Button
              variant="glow"
              size="lg"
              className="mt-6 w-full"
              onClick={handleImport}
              disabled={isImporting || !selectedAccount}
            >
              {isImporting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Import {parsedData.length} Transactions
                </>
              )}
            </Button>
          </motion.div>
        )}

        {/* CSV format guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <h3 className="mb-3 font-display text-lg font-semibold text-foreground">
            CSV Format Guide
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Your CSV should include columns for date, description, and amount. Supported column names:
          </p>
          <div className="rounded-lg bg-muted p-4 font-mono text-sm">
            <p className="text-muted-foreground">date, description, amount</p>
            <p className="text-muted-foreground">2024-01-15, "Coffee Shop", -4.50</p>
            <p className="text-muted-foreground">2024-01-14, "Salary Deposit", 3500.00</p>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Positive amounts are treated as income (credit), negative as expenses (debit).
          </p>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
