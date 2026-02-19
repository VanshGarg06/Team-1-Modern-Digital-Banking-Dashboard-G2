import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell,
  ArrowDownLeft,
  ArrowUpRight,
  AlertTriangle,
  Shield,
  CheckCircle,
  Clock,
  Filter,
  Trash2,
  Check,
  X
} from 'lucide-react';
import AppHeader from '@/components/layout/AppHeader';
import GlassCard from '@/components/ui/GlassCard';

interface Notification {
  id: string;
  type: 'credit' | 'debit' | 'security' | 'alert' | 'info';
  title: string;
  message: string;
  amount?: number;
  timestamp: Date;
  read: boolean;
  from?: string;
  to?: string;
}

// Generate mock notifications
const generateNotifications = (): Notification[] => {
  const now = new Date();
  return [
    {
      id: '1',
      type: 'credit',
      title: 'Payment Received',
      message: 'You received a direct deposit',
      amount: 3500.00,
      from: 'Employer Corp',
      timestamp: new Date(now.getTime() - 1000 * 60 * 5),
      read: false,
    },
    {
      id: '2',
      type: 'debit',
      title: 'Payment Sent',
      message: 'Transfer to external account',
      amount: 250.00,
      to: 'Savings Account',
      timestamp: new Date(now.getTime() - 1000 * 60 * 30),
      read: false,
    },
    {
      id: '3',
      type: 'security',
      title: 'New Device Login',
      message: 'Your account was accessed from a new device in New York, NY',
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 2),
      read: true,
    },
    {
      id: '4',
      type: 'alert',
      title: 'Low Balance Warning',
      message: 'Your Checking Account balance is below $500',
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 5),
      read: true,
    },
    {
      id: '5',
      type: 'credit',
      title: 'Refund Processed',
      message: 'Refund from Amazon.com',
      amount: 49.99,
      from: 'Amazon.com',
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24),
      read: true,
    },
    {
      id: '6',
      type: 'debit',
      title: 'Bill Payment',
      message: 'Automatic payment processed',
      amount: 150.00,
      to: 'Electric Company',
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2),
      read: true,
    },
    {
      id: '7',
      type: 'info',
      title: 'Statement Available',
      message: 'Your January 2024 statement is ready to view',
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3),
      read: true,
    },
    {
      id: '8',
      type: 'security',
      title: 'Password Changed',
      message: 'Your account password was successfully updated',
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5),
      read: true,
    },
  ];
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'transactions' | 'security'>('all');

  useEffect(() => {
    setNotifications(generateNotifications());
    
    // Simulate real-time notifications
    const interval = setInterval(() => {
      const shouldAddNew = Math.random() > 0.7;
      if (shouldAddNew) {
        const newNotif: Notification = {
          id: Date.now().toString(),
          type: Math.random() > 0.5 ? 'credit' : 'debit',
          title: Math.random() > 0.5 ? 'Payment Received' : 'Payment Sent',
          message: Math.random() > 0.5 ? 'New transaction detected' : 'Automatic payment processed',
          amount: Math.floor(Math.random() * 500) + 50,
          timestamp: new Date(),
          read: false,
          from: Math.random() > 0.5 ? 'External Account' : undefined,
          to: Math.random() > 0.5 ? 'Vendor' : undefined,
        };
        setNotifications(prev => [newNotif, ...prev]);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'credit':
        return <ArrowDownLeft className="w-5 h-5 text-green-400" />;
      case 'debit':
        return <ArrowUpRight className="w-5 h-5 text-red-400" />;
      case 'security':
        return <Shield className="w-5 h-5 text-blue-400" />;
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getIconBg = (type: Notification['type']) => {
    switch (type) {
      case 'credit':
        return 'bg-green-500/20';
      case 'debit':
        return 'bg-red-500/20';
      case 'security':
        return 'bg-blue-500/20';
      case 'alert':
        return 'bg-yellow-500/20';
      default:
        return 'bg-glass-bg';
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'transactions') return n.type === 'credit' || n.type === 'debit';
    if (filter === 'security') return n.type === 'security' || n.type === 'alert';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  return (
    <div className="min-h-screen">
      <AppHeader title="Notifications" subtitle={`${unreadCount} unread notifications`} />
      
      <div className="p-8 max-w-4xl">
        {/* Filter Bar */}
        <GlassCard className="mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <div className="flex gap-2">
                {(['all', 'unread', 'transactions', 'security'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      filter === f
                        ? 'bg-foreground text-background'
                        : 'bg-glass-bg hover:bg-glass-hover text-muted-foreground'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                    {f === 'unread' && unreadCount > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-background text-foreground">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <CheckCircle className="w-4 h-4" />
                Mark all as read
              </button>
            )}
          </div>
        </GlassCard>

        {/* Notifications List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          <AnimatePresence>
            {filteredNotifications.length === 0 ? (
              <motion.div
                variants={itemVariants}
                className="text-center py-12"
              >
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No notifications to show</p>
              </motion.div>
            ) : (
              filteredNotifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  variants={itemVariants}
                  exit="exit"
                  layout
                >
                  <GlassCard
                    className={`transition-all ${
                      !notification.read ? 'border-foreground/20 bg-foreground/5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl ${getIconBg(notification.type)} flex items-center justify-center flex-shrink-0`}>
                        {getIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-medium flex items-center gap-2">
                              {notification.title}
                              {!notification.read && (
                                <span className="w-2 h-2 rounded-full bg-blue-400" />
                              )}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            {notification.from && (
                              <p className="text-sm text-muted-foreground">
                                From: {notification.from}
                              </p>
                            )}
                            {notification.to && (
                              <p className="text-sm text-muted-foreground">
                                To: {notification.to}
                              </p>
                            )}
                          </div>
                          
                          {notification.amount && (
                            <span className={`text-lg font-bold ${
                              notification.type === 'credit' ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {notification.type === 'credit' ? '+' : '-'}${notification.amount.toFixed(2)}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(notification.timestamp)}
                          </span>
                          
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1.5 rounded-lg hover:bg-glass-hover transition-colors text-muted-foreground hover:text-foreground"
                                title="Mark as read"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors text-muted-foreground hover:text-red-400"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Notifications;
