import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  Link2, 
  ArrowLeftRight, 
  BarChart3, 
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Settings,
  Calculator,
  Receipt
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getInitials, getAvatarColor } from '@/lib/avatar';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Wallet, label: 'Accounts', path: '/accounts' },
  { icon: Link2, label: 'Link Bank', path: '/link-bank' },
  { icon: ArrowLeftRight, label: 'Transactions', path: '/transactions' },
  { icon: BarChart3, label: 'Reports', path: '/reports' },
  { icon: Receipt, label: 'Bills', path: '/bills' },
  { icon: Calculator, label: 'Calculators', path: '/calculators' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const initials = getInitials(profile?.full_name);
  const avatarColor = getAvatarColor(profile?.full_name);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen z-40 glass-card border-r border-glass-border flex flex-col"
      style={{ borderRadius: 0 }}
    >
      {/* Logo */}
      <div className="p-6 border-b border-glass-border">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ backgroundColor: avatarColor }}
          >
            {initials}
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="text-xl font-semibold font-display whitespace-nowrap overflow-hidden"
              >
                DB Banking
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-secondary border border-glass-border flex items-center justify-center hover:bg-accent transition-colors"
      >
        {isCollapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>

      {/* Logout */}
      <div className="p-4 border-t border-glass-border">
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-muted-foreground hover:text-destructive"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="whitespace-nowrap overflow-hidden"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
};

export default AppSidebar;
