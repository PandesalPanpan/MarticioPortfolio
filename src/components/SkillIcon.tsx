import {
  siTypescript, siJavascript, siPhp, siDart, siHtml5, siCss, siReact, siLaravel,
  siNodedotjs, siFlutter, siFilament, siDocker, siGithub, siNginx, siPostgresql,
  siSupabase, siPrisma, type SimpleIcon,
} from 'simple-icons';
import { Database, Server, Workflow, type LucideIcon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

type IconDef = { kind: 'si'; icon: SimpleIcon } | { kind: 'lucide'; Comp: LucideIcon };

/** Maps each skill label to a brand logo (simple-icons) or a generic fallback. */
const ICONS: Record<string, IconDef> = {
  TypeScript: { kind: 'si', icon: siTypescript },
  'JavaScript (ES6+)': { kind: 'si', icon: siJavascript },
  PHP: { kind: 'si', icon: siPhp },
  Dart: { kind: 'si', icon: siDart },
  SQL: { kind: 'lucide', Comp: Database },
  HTML: { kind: 'si', icon: siHtml5 },
  CSS: { kind: 'si', icon: siCss },
  React: { kind: 'si', icon: siReact },
  Laravel: { kind: 'si', icon: siLaravel },
  'Node.js / Express': { kind: 'si', icon: siNodedotjs },
  Flutter: { kind: 'si', icon: siFlutter },
  Filament: { kind: 'si', icon: siFilament },
  Docker: { kind: 'si', icon: siDocker },
  VPS: { kind: 'lucide', Comp: Server },
  'Git & GitHub': { kind: 'si', icon: siGithub },
  Nginx: { kind: 'si', icon: siNginx },
  'CI/CD': { kind: 'lucide', Comp: Workflow },
  PostgreSQL: { kind: 'si', icon: siPostgresql },
  Supabase: { kind: 'si', icon: siSupabase },
  Prisma: { kind: 'si', icon: siPrisma },
  IndexedDB: { kind: 'lucide', Comp: Database },
};

/** Relative luminance (0..1) of a hex color, for legibility clamping. */
function luminance(hex: string): number {
  const n = parseInt(hex, 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function SkillIcon({ name, size = 14 }: { name: string; size?: number }) {
  const { theme } = useTheme();
  const def = ICONS[name];
  if (!def) return null;

  if (def.kind === 'lucide') {
    const { Comp } = def;
    return <Comp size={size} aria-hidden="true" />;
  }

  // Brand color, but fall back to the text color when the logo would be
  // near-invisible against the chip (very dark in dark mode, very light in light mode).
  const lum = luminance(def.icon.hex);
  const tooDark = theme === 'dark' && lum < 0.2;
  const tooLight = theme === 'light' && lum > 0.85;
  const fill = tooDark || tooLight ? 'currentColor' : `#${def.icon.hex}`;

  return (
    <svg
      role="img"
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      style={{ flexShrink: 0 }}
    >
      <path d={def.icon.path} />
    </svg>
  );
}
