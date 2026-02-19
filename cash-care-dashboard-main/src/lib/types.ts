export type AccountType = 'savings' | 'checking' | 'credit_card' | 'loan' | 'investment';
export type TransactionType = 'debit' | 'credit';

export interface Account {
  id: string;
  user_id: string;
  bank_name: string;
  account_type: AccountType;
  account_name: string;
  masked_account: string | null;
  currency: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  account_id: string;
  description: string;
  category: string | null;
  amount: number;
  currency: string;
  txn_type: TransactionType;
  merchant: string | null;
  txn_date: string;
  posted_date: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CSVTransaction {
  date: string;
  description: string;
  amount: string;
  type?: string;
  category?: string;
  merchant?: string;
}
