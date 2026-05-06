import { useThemeStore } from '@/theme/themeStore';

export function useTheme() {
  const resolved = useThemeStore((s) => s.resolved);
  const toggle = useThemeStore((s) => s.toggle);
  return { theme: resolved, toggle };
}
