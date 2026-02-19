-- Create enum types for the banking system
CREATE TYPE public.account_type AS ENUM ('savings', 'checking', 'credit_card', 'loan', 'investment');
CREATE TYPE public.transaction_type AS ENUM ('debit', 'credit');

-- Create profiles table for user data
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create accounts table
CREATE TABLE public.accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    bank_name TEXT NOT NULL,
    account_type account_type NOT NULL DEFAULT 'checking',
    account_name TEXT NOT NULL,
    masked_account TEXT,
    currency CHAR(3) NOT NULL DEFAULT 'USD',
    balance NUMERIC(15,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transactions table
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    category TEXT,
    amount NUMERIC(15,2) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'USD',
    txn_type transaction_type NOT NULL,
    merchant TEXT,
    txn_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    posted_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Accounts RLS policies
CREATE POLICY "Users can view own accounts" ON public.accounts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own accounts" ON public.accounts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own accounts" ON public.accounts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own accounts" ON public.accounts
    FOR DELETE USING (auth.uid() = user_id);

-- Transactions RLS policies (users can only access transactions from their accounts)
CREATE POLICY "Users can view transactions from own accounts" ON public.transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.accounts 
            WHERE accounts.id = transactions.account_id 
            AND accounts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create transactions for own accounts" ON public.transactions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.accounts 
            WHERE accounts.id = transactions.account_id 
            AND accounts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update transactions from own accounts" ON public.transactions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.accounts 
            WHERE accounts.id = transactions.account_id 
            AND accounts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete transactions from own accounts" ON public.transactions
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.accounts 
            WHERE accounts.id = transactions.account_id 
            AND accounts.user_id = auth.uid()
        )
    );

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at
    BEFORE UPDATE ON public.accounts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();