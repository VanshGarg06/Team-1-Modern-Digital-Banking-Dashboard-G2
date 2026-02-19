import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/contexts/ThemeContext';

interface VantaBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

declare global {
  interface Window {
    VANTA: {
      NET: (config: any) => any;
    };
  }
}

const VantaBackground = ({ children, className = '' }: VantaBackgroundProps) => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const { theme } = useTheme();

  useEffect(() => {
    // Destroy previous effect when theme changes
    if (vantaEffect) {
      vantaEffect.destroy();
      setVantaEffect(null);
    }

    const loadVanta = async () => {
      if (!vantaRef.current) return;

      try {
        const VANTA = await import('vanta/dist/vanta.net.min');
        
        const isDark = theme === 'dark';
        const effect = VANTA.default({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: isDark ? 0xffffff : 0x000000,
          backgroundColor: isDark ? 0x0a0a0a : 0xe5e4e2,
          points: 12.00,
          maxDistance: 20.00,
          spacing: 18.00,
          showDots: true,
        });
        
        setVantaEffect(effect);
      } catch (error) {
        console.error('Error loading Vanta:', error);
      }
    };

    loadVanta();

    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, [theme]);

  return (
    <div ref={vantaRef} className={`fixed inset-0 ${className}`}>
      <div className="relative z-10 h-full w-full overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default VantaBackground;
