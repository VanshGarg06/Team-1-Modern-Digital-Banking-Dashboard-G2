import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  hover?: boolean;
  glow?: boolean;
  className?: string;
}

const GlassCard = ({ 
  children, 
  hover = false, 
  glow = false,
  className = '',
  ...props 
}: GlassCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        hover ? 'glass-card-hover' : 'glass-card',
        glow && 'animate-glow',
        'p-6',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
