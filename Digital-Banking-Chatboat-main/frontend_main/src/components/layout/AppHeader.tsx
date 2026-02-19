import { Bell, Search, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency, CURRENCIES, CurrencyCode } from '@/contexts/CurrencyContext';
import { getInitials, getAvatarColor } from '@/lib/avatar';
import { useState, useRef, useEffect } from 'react';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
}

const AppHeader = ({ title, subtitle }: AppHeaderProps) => {
  const { profile } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const initials = getInitials(profile?.full_name);
  const avatarColor = getAvatarColor(profile?.full_name);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowCurrencyDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="glass-card border-b border-glass-border px-8 py-4 flex items-center justify-between" style={{ borderRadius: 0 }}>
      <div>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-semibold font-display"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-muted-foreground mt-1"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="glass-input pl-10 pr-4 py-2 w-64 text-sm"
          />
        </div>

        {/* Currency Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
            className="px-3 py-2 rounded-xl bg-glass-bg hover:bg-glass-hover border border-glass-border transition-colors text-sm font-medium flex items-center gap-1.5"
          >
            <span>{CURRENCIES[currency].symbol}</span>
            <span className="hidden sm:inline">{currency}</span>
          </button>
          {showCurrencyDropdown && (
            <div className="absolute right-0 mt-2 w-52 glass-card p-2 z-50">
              {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                <button
                  key={code}
                  onClick={() => { setCurrency(code); setShowCurrencyDropdown(false); }}
                  className={`w-full px-4 py-2.5 text-left text-sm rounded-lg transition-colors flex items-center gap-3 ${
                    currency === code ? 'bg-primary/10 text-foreground' : 'hover:bg-glass-hover text-muted-foreground'
                  }`}
                >
                  <span className="text-lg w-6">{CURRENCIES[code].symbol}</span>
                  <div>
                    <p className="font-medium">{code}</p>
                    <p className="text-xs text-muted-foreground">{CURRENCIES[code].name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl bg-glass-bg hover:bg-glass-hover border border-glass-border transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </button>

        {/* User Avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center border border-glass-border text-white font-semibold text-sm"
          style={{ backgroundColor: avatarColor }}
        >
          {initials}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
