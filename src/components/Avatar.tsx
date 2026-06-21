import { LazyMotion, domAnimation, m } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import styles from './Avatar.module.css';

/**
 * Hand-coded SVG character (black hair). Idle blink + a wave on hover/tap
 * ("boop"). Fully reduced-motion safe — when reduced motion is requested the
 * character renders as a static pose with no animation.
 *
 * Palette uses theme tokens where it reads well in both themes; skin/hair are
 * fixed so the character stays recognizable across light/dark.
 */
const SKIN = '#e7b48c';
const SKIN_SHADOW = '#d89e72';
const HAIR = '#15151a';

export function Avatar({ size = 240 }: { size?: number }) {
  const reduced = usePrefersReducedMotion();

  return (
    <LazyMotion features={domAnimation}>
      <m.svg
        viewBox="0 0 200 210"
        width={size}
        height={size}
        className={styles.avatar}
        role="img"
        aria-label="Illustrated avatar of Peter waving"
        initial="rest"
        whileHover="wave"
        whileTap="wave"
      >
        {/* shoulders / shirt */}
        <path d="M40 210 Q40 158 100 158 Q160 158 160 210 Z" fill="var(--accent)" />
        <path d="M86 150 h28 v18 q-14 10 -28 0 Z" fill={SKIN_SHADOW} />

        {/* waving arm — pivots at the shoulder */}
        <m.g
          style={{ transformBox: 'fill-box', transformOrigin: '20% 90%' }}
          variants={{
            rest: { rotate: 0 },
            wave: reduced
              ? { rotate: 0 }
              : { rotate: [0, 16, -6, 14, -4, 0], transition: { duration: 1.1, ease: 'easeInOut' } },
          }}
        >
          <path d="M150 196 Q150 150 132 132" stroke="var(--accent)" strokeWidth="16" strokeLinecap="round" fill="none" />
          <circle cx="130" cy="126" r="12" fill={SKIN} />
        </m.g>

        {/* head */}
        <ellipse cx="100" cy="92" rx="46" ry="50" fill={SKIN} />
        <ellipse cx="54" cy="96" rx="7" ry="9" fill={SKIN} />
        <ellipse cx="146" cy="96" rx="7" ry="9" fill={SKIN} />

        {/* hair — black */}
        <path
          d="M54 92 Q48 36 100 34 Q152 36 146 92 Q150 70 138 58 Q142 74 132 70
             Q120 50 100 52 Q80 50 68 70 Q58 74 62 58 Q50 70 54 92 Z"
          fill={HAIR}
        />

        {/* eyebrows */}
        <path d="M74 78 q10 -6 20 0" stroke={HAIR} strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M106 78 q10 -6 20 0" stroke={HAIR} strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* eyes — blink by squashing vertically */}
        <m.g
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          variants={{ rest: {}, wave: {} }}
          animate={
            reduced
              ? undefined
              : { scaleY: [1, 1, 0.1, 1, 1], transition: { duration: 5, times: [0, 0.9, 0.94, 0.98, 1], repeat: Infinity, repeatDelay: 0.5 } }
          }
        >
          <circle cx="84" cy="90" r="5" fill={HAIR} />
          <circle cx="116" cy="90" r="5" fill={HAIR} />
        </m.g>

        {/* cheeks + smile */}
        <circle cx="72" cy="104" r="6" fill="#f0a98f" opacity="0.5" />
        <circle cx="128" cy="104" r="6" fill="#f0a98f" opacity="0.5" />
        <path d="M86 110 q14 12 28 0" stroke={HAIR} strokeWidth="3" strokeLinecap="round" fill="none" />
      </m.svg>
    </LazyMotion>
  );
}

/** Compact head-only version used as the header brand mark. */
export function AvatarMark({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true" className={styles.mark}>
      <rect width="48" height="48" rx="10" fill="currentColor" opacity="0.06" />
      <g>
        <ellipse cx="24" cy="26" rx="14" ry="15" fill={SKIN} />
        <path
          d="M10 26 Q8 9 24 8 Q40 9 38 26 Q39 18 33 14 Q35 21 30 19
             Q26 12 24 13 Q22 12 18 19 Q13 21 15 14 Q9 18 10 26 Z"
          fill={HAIR}
        />
        <circle cx="19" cy="26" r="1.8" fill={HAIR} />
        <circle cx="29" cy="26" r="1.8" fill={HAIR} />
        <path d="M20 31 q4 3 8 0" stroke={HAIR} strokeWidth="1.6" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}
