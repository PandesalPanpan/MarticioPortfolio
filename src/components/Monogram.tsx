/**
 * Refined brand monogram used as the header logo. Mirrors /public/favicon.svg.
 * Swap this (and the favicon) for a circular photo crop once a headshot exists.
 */
export function Monogram({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      <rect width="48" height="48" rx="11" fill="var(--accent)" />
      <text
        x="50%"
        y="53%"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="'Fraunces Variable', Georgia, serif"
        fontWeight="600"
        fontSize="22"
        letterSpacing="-0.5"
        fill="#fff"
      >
        PM
      </text>
    </svg>
  );
}
