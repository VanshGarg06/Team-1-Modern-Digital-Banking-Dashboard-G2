import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED';

interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  locale: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  AED: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', locale: 'ar-AE' },
};

interface ExchangeRates {
  [key: string]: number;
}

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  rates: ExchangeRates;
  ratesLoading: boolean;
  formatAmount: (amount: number, showConversion?: boolean) => string;
  convertAmount: (amount: number, from?: CurrencyCode, to?: CurrencyCode) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

// Fallback rates (INR base)
const FALLBACK_RATES: ExchangeRates = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
  AED: 0.044,
};

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('preferred_currency');
    return (saved as CurrencyCode) || 'INR';
  });
  const [rates, setRates] = useState<ExchangeRates>(FALLBACK_RATES);
  const [ratesLoading, setRatesLoading] = useState(false);

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyState(code);
    localStorage.setItem('preferred_currency', code);
  }, []);

  // Fetch exchange rates
  useEffect(() => {
    const fetchRates = async () => {
      setRatesLoading(true);
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/INR');
        if (res.ok) {
          const data = await res.json();
          setRates({
            INR: 1,
            USD: data.rates.USD || FALLBACK_RATES.USD,
            EUR: data.rates.EUR || FALLBACK_RATES.EUR,
            GBP: data.rates.GBP || FALLBACK_RATES.GBP,
            AED: data.rates.AED || FALLBACK_RATES.AED,
          });
        }
      } catch (err) {
        console.warn('Failed to fetch exchange rates, using fallback:', err);
      } finally {
        setRatesLoading(false);
      }
    };
    fetchRates();
    // Refresh every 6 hours
    const interval = setInterval(fetchRates, 6 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const convertAmount = useCallback((amount: number, from: CurrencyCode = 'INR', to?: CurrencyCode) => {
    const target = to || currency;
    if (from === target) return amount;
    // Convert from source to INR first, then to target
    const inINR = from === 'INR' ? amount : amount / (rates[from] || 1);
    return inINR * (rates[target] || 1);
  }, [currency, rates]);

  const formatAmount = useCallback((amount: number, showConversion = true) => {
    const info = CURRENCIES[currency];
    const converted = convertAmount(amount, 'INR', currency);
    
    const formatted = new Intl.NumberFormat(info.locale, {
      style: 'currency',
      currency: info.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(converted);

    if (!showConversion || currency === 'INR') return formatted;

    // Also show INR original
    const inrFormatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

    return `${formatted} (≈ ${inrFormatted})`;
  }, [currency, convertAmount]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, ratesLoading, formatAmount, convertAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
};
