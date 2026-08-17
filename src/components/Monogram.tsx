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

/**
 * Boxed geometry. The glyph paths span 20x32 around centre (24,24), so at
 * BOX_SCALE the mark plus its stroke stands 32*0.8 + 5 = 30.6 of the 48 box,
 * roughly two thirds, leaving even ~8.7 margins inside the rounded corners.
 * The translate keeps (24,24) fixed: 24 - 24*BOX_SCALE.
 */
const BOX_SCALE = 0.8;
/** Rendered stroke width once BOX_SCALE is applied. */
const BOX_STROKE = 5;
/** Rounded so the attribute reads 4.8 rather than binary-float noise. */
const BOX_OFFSET = Number((24 - 24 * BOX_SCALE).toFixed(4));

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
        // Pre-divided by the boxed scale, so the stroke renders at BOX_STROKE
        // rather than shrinking with the glyph.
        strokeWidth={boxed ? BOX_STROKE / BOX_SCALE : 4}
        strokeLinecap="round"
        strokeLinejoin="round"
        // Inset the glyph so it sits inside the container with even padding.
        transform={boxed ? `translate(${BOX_OFFSET} ${BOX_OFFSET}) scale(${BOX_SCALE})` : undefined}
      >
        {GLYPH}
      </g>
    </svg>
  );
}
