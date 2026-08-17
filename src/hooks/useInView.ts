import { useEffect, useRef, useState } from 'react';

/**
 * Fires once when the element first scrolls into view, then stops observing.
 * Used for the fade-and-rise reveal; callers that respect reduced motion
 * should skip the transition rather than the observer, so content still shows.
 */
export function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Without IntersectionObserver (jsdom, very old browsers) reveal immediately
    // rather than leaving the page permanently blank.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setInView(true);
          io.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08, ...options },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [options]);

  return { ref, inView };
}
