import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
interface HealthScoreGaugeProps {
  score: number;
  size?: number;
}

const HealthScoreGauge = ({ score, size = 180 }: HealthScoreGaugeProps) => {
  const { theme } = useTheme();
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;
  const trackColor = theme === 'dark' ? 'hsl(0 0% 20%)' : 'hsl(0 0% 85%)';

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e'; // Green
    if (score >= 60) return '#eab308'; // Yellow
    if (score >= 40) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Average';
    return 'Poor';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative health-gauge" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getScoreColor(score)}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="health-gauge-circle"
          />
        </svg>
        
        {/* Score display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-4xl font-bold font-display"
            style={{ color: getScoreColor(score) }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            / 100
          </span>
        </div>
      </div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-4 text-sm font-medium"
        style={{ color: getScoreColor(score) }}
      >
        {getScoreLabel(score)}
      </motion.p>
    </div>
  );
};

export default HealthScoreGauge;
