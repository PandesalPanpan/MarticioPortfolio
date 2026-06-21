import { useEffect } from 'react';

/**
 * Warms the lazy `/handmade` chunk once the current page is idle, so switching
 * versions feels instant. Uses requestIdleCallback where available, falling
 * back to a short timeout. Runs once.
 */
export function usePrefetchHandmade() {
  useEffect(() => {
    const prefetch = () => {
      void import('@/routes/Handmade');
    };
    type IdleWindow = Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const w = window as IdleWindow;
    if (typeof w.requestIdleCallback === 'function') {
      const id = w.requestIdleCallback(prefetch, { timeout: 2500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = setTimeout(prefetch, 1500);
    return () => clearTimeout(t);
  }, []);
}
