/**
 * Brand monogram: a PM ligature where the P and the M share one vertical stem.
 *
 * Drawn as geometry rather than <text> on purpose. The previous version set
 * "PM" in Fraunces, so it silently fell back to Georgia before the webfont
 * loaded and rendered differently anywhere fonts are not available (favicon,
 * OG image, print). Paths look identical everywhere.
 *
 * `boxed` puts the mark in a filled rounded square. That reads well in a
 * browser tab strip, where the container separates the icon from its
 * neighbours, but it costs roughly 40% of the glyph size and turns to mush at
 * the 32px the header uses. So the header takes the bare mark and only the
 * favicon is boxed. Keep /public/favicon.svg in sync with these paths.
 */

/** One source of truth for the letterforms. Drawn to fill the 48px viewBox. */
const GLYPH = (
  <>
    {/* Shared stem: the P's stem and the M's left leg are one line. */}
    <path d="M14 8 V40" />
    {/* P bowl: exact semicircle, so it stays true at small sizes. */}
    <path d="M14 8 H23 a6.5 6.5 0 0 1 0 13 H14" />
    {/* M: branches off the stem below the bowl. The gap under the bowl is what
        stops the two letters reading as a single "B". */}
    <path d="M14 25 L24 40 L34 25 V40" />
  </>
);

export function Monogram({ size = 32, boxed = false }: { size?: number; boxed?: boolean }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      {boxed && <rect width="48" height="48" rx="11" fill="var(--ink)" />}
      <g
        fill="none"
        stroke={boxed ? 'var(--on-ink)' : 'currentColor'}
        // Pre-divided by the boxed scale, so the stroke reads the same weight
        // in both variants rather than thinning to 2.4.
        strokeWidth={boxed ? 20 / 3 : 4}
        strokeLinecap="round"
        strokeLinejoin="round"
        // Shrink the glyph to sit inside the container with even padding.
        transform={boxed ? 'translate(9.6 9.6) scale(0.6)' : undefined}
      >
        {GLYPH}
      </g>
    </svg>
  );
}
