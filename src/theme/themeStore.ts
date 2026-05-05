import { create } from 'zustand';

export type ThemePref = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'mp-theme';

function systemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function loadPref(): ThemePref {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'light' || v === 'dark') return v;
  } catch {
    /* ignore */
  }
  return 'system';
}

function resolve(pref: ThemePref): ResolvedTheme {
  return pref === 'system' ? systemTheme() : pref;
}

function applyTheme(resolved: ResolvedTheme) {
  document.documentElement.setAttribute('data-theme', resolved);
}

type ThemeState = {
  pref: ThemePref;
  resolved: ResolvedTheme;
  setPref: (pref: ThemePref) => void;
  toggle: () => void;
};

const initialPref = loadPref();
const initialResolved = resolve(initialPref);
applyTheme(initialResolved);

export const useThemeStore = create<ThemeState>((set, get) => ({
  pref: initialPref,
  resolved: initialResolved,
  setPref: (pref) => {
    try {
      if (pref === 'system') localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, pref);
    } catch {
      /* ignore */
    }
    const resolved = resolve(pref);
    applyTheme(resolved);
    set({ pref, resolved });
  },
  toggle: () => {
    const next: ThemePref = get().resolved === 'dark' ? 'light' : 'dark';
    get().setPref(next);
  },
}));
