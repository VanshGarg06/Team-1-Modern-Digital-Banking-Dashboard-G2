import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowLeftRight, 
  Upload,
  Calculator,
  Brain,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Wallet, label: 'Accounts', path: '/accounts' },
  { icon: ArrowLeftRight, label: 'Transactions', path: '/transactions' },
  { icon: Upload, label: 'Import CSV', path: '/import' },
  { icon: Calculator, label: 'Calculators', path: '/calculators' },
  { icon: Brain, label: 'AI Insights', path: '/ai-insights' },
];

export function Sidebar() {
  const location = useLocation();
  const { signOut, user } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Wallet className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              FinFlow
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  className={`nav-link flex items-center gap-3 ${isActive ? 'active' : ''}`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      className="absolute left-0 top-0 h-full w-1 rounded-r-full bg-primary"
                      layoutId="activeTab"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-border p-4">
          <div className="mb-4 flex items-center gap-3 rounded-lg bg-muted p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-foreground">
                {user?.email}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
            onClick={signOut}
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  );
}
