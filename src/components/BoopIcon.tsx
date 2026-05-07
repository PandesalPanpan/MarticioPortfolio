import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

type Props = { children: ReactNode; rotation?: number; scale?: number; timing?: number };

export function BoopIcon({ children, rotation = 8, scale = 1.1, timing = 200 }: Props) {
  const [booped, setBooped] = useState(false);
  const reduced = usePrefersReducedMotion();

  function trigger() {
    if (reduced) return;
    setBooped(true);
    window.setTimeout(() => setBooped(false), timing);
  }

  const style = booped
    ? { transform: `scale(${scale}) rotate(${rotation}deg)` }
    : { transform: 'scale(1) rotate(0deg)' };

  return (
    <motion.span
      onMouseEnter={trigger}
      onFocus={trigger}
      style={{ display: 'inline-block', transition: `transform ${timing}ms cubic-bezier(0.16,1,0.3,1)`, ...style }}
    >
      {children}
    </motion.span>
  );
}
