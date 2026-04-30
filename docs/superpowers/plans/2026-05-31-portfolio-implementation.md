# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the AI-assisted portfolio site at `Y:\Codes\MarticioPortfolio` per the spec at `docs/superpowers/specs/2026-05-31-portfolio-design.md`.

**Architecture:** Vite SPA, React 19 + TypeScript strict, React Router v7 with `/`, `/handmade`, `/colophon`, and 404. Long-scroll home with in-place expandable project cards. Theme handled by Zustand + CSS custom properties on `<html data-theme>`. No backend, no Tailwind.

**Tech Stack:** Vite, React 19, TypeScript, React Router v7, Zustand, Framer Motion, CSS Modules, Lucide React, Fontsource (Fraunces / Inter / JetBrains Mono), Vitest + RTL, Playwright.

---

## File Structure

```
Y:\Codes\MarticioPortfolio\
├── docs/
│   ├── IMAGE-TODO.md
│   └── superpowers/{specs,plans}/...
├── public/
│   ├── cv.pdf
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── assets/
│   │   ├── monogram.svg
│   │   └── og.png (placeholder PNG)
│   ├── components/
│   │   ├── Header.tsx + .module.css
│   │   ├── Footer.tsx + .module.css
│   │   ├── ThemeToggle.tsx + .module.css
│   │   ├── VersionToggle.tsx + .module.css
│   │   ├── BoopIcon.tsx
│   │   ├── Button.tsx + .module.css
│   │   ├── Card.tsx + .module.css
│   │   ├── Tag.tsx + .module.css
│   │   ├── BuildBadge.tsx + .module.css
│   │   └── ProjectCard.tsx + .module.css
│   ├── data/
│   │   ├── types.ts
│   │   ├── projects.ts
│   │   ├── experience.ts
│   │   └── education.ts
│   ├── hooks/
│   │   ├── useTheme.ts
│   │   └── usePrefersReducedMotion.ts
│   ├── routes/
│   │   ├── Home.tsx
│   │   ├── Handmade.tsx
│   │   ├── Colophon.tsx + .module.css
│   │   └── NotFound.tsx
│   ├── sections/
│   │   ├── Hero.tsx + .module.css
│   │   ├── Projects.tsx + .module.css
│   │   ├── Experience.tsx + .module.css
│   │   ├── Education.tsx + .module.css
│   │   └── Contact.tsx + .module.css
│   ├── theme/
│   │   ├── tokens.css
│   │   ├── GlobalStyles.tsx
│   │   └── themeStore.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── tests/
│   ├── setup.ts
│   ├── ThemeToggle.test.tsx
│   ├── VersionToggle.test.tsx
│   └── Projects.test.tsx
├── e2e/
│   └── smoke.spec.ts
├── index.html
├── package.json
├── tsconfig.json + tsconfig.app.json + tsconfig.node.json
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── eslint.config.js
├── .prettierrc
├── .gitignore
├── LICENSE
└── README.md
```

---

## Task 1: Scaffold Vite + React + TS project

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/vite-env.d.ts`, `.gitignore`

- [ ] **Step 1: Initialize Vite template**

Run in `Y:\Codes\MarticioPortfolio`:
```bash
npm create vite@latest . -- --template react-ts
```
When prompted "Current directory is not empty… Ignore files and continue", choose **Ignore**.

- [ ] **Step 2: Verify install**

Run:
```bash
npm install
```
Expected: exits 0 with no peer-dep errors.

- [ ] **Step 3: Delete boilerplate**

Delete: `src/App.css`, `src/index.css`, `src/assets/react.svg`, `public/vite.svg`. Empty `src/App.tsx` will be rewritten in Task 9. Leave `src/main.tsx` for now.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: scaffold vite + react + ts project"
```

---

## Task 2: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install runtime dependencies**

```bash
npm install react-router-dom@^7 zustand@^5 framer-motion@^12 lucide-react@^1 @fontsource-variable/fraunces @fontsource-variable/inter @fontsource-variable/jetbrains-mono
```

- [ ] **Step 2: Install dev dependencies**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @playwright/test prettier eslint-config-prettier
```

- [ ] **Step 3: Install Playwright browsers**

```bash
npx playwright install chromium
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install runtime and dev dependencies"
```

---

## Task 3: Configure TypeScript path aliases and strict mode

**Files:**
- Modify: `tsconfig.app.json`, `vite.config.ts`

- [ ] **Step 1: Update `tsconfig.app.json`**

Replace contents:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src", "tests"]
}
```

- [ ] **Step 2: Update `vite.config.ts`**

Replace contents:
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  server: { port: 5173 },
});
```

- [ ] **Step 3: Verify type-check passes**

```bash
npx tsc -b
```
Expected: no errors (project may still have boilerplate types — that's fine for now).

- [ ] **Step 4: Commit**

```bash
git add tsconfig.app.json vite.config.ts
git commit -m "chore: enable strict ts and @/* path alias"
```

---

## Task 4: Configure Prettier and ESLint

**Files:**
- Create: `.prettierrc`
- Modify: `eslint.config.js`

- [ ] **Step 1: Create `.prettierrc`**

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "arrowParens": "always"
}
```

- [ ] **Step 2: Add Prettier to ESLint config**

In `eslint.config.js`, append `'prettier'` to the `extends` array (or import `eslint-config-prettier` and spread it). If config uses flat-config style:
```js
import prettier from 'eslint-config-prettier';
// ...
export default tseslint.config(
  { ignores: ['dist'] },
  // existing entries...
  prettier,
);
```

- [ ] **Step 3: Commit**

```bash
git add .prettierrc eslint.config.js
git commit -m "chore: configure prettier and disable conflicting eslint rules"
```

---

## Task 5: Create folder structure and IMAGE-TODO.md

**Files:**
- Create: `src/{assets,components,data,hooks,routes,sections,theme}/.gitkeep`, `tests/`, `e2e/`, `docs/IMAGE-TODO.md`, `public/`, `LICENSE`

- [ ] **Step 1: Create directories**

```bash
mkdir -p src/assets src/components src/data src/hooks src/routes src/sections src/theme tests e2e public docs
```

- [ ] **Step 2: Create `docs/IMAGE-TODO.md`**

```markdown
# Image & Asset TODO

Assets to add after implementation. Drop files into `src/assets/` (bundled) or `public/` (static), then update the data files noted below.

- [ ] Threaded screenshots (3–4) — drop in `src/assets/threaded/`, list filenames in `src/data/projects.ts` under the `threaded` entry's `images` array.
- [ ] MemorizeMate screenshots (3–4) — `src/assets/memorizemate/`, same pattern.
- [ ] MemorizeMate live URL — update `links.live` for the `memorizemate` entry in `src/data/projects.ts`.
- [ ] CS50 certificate URL — update the `cs50` entry in `src/data/education.ts`.
- [ ] Optional headshot for hero — drop in `src/assets/`, import in `src/sections/Hero.tsx`.
- [ ] Replace `src/assets/og.png` placeholder with the final OG image (1200×630).
```

- [ ] **Step 3: Create MIT `LICENSE`**

```
MIT License

Copyright (c) 2026 Peter Elijah Marticio

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 4: Commit**

```bash
git add docs/IMAGE-TODO.md LICENSE
git commit -m "docs: add image todo checklist and MIT license"
```

---

## Task 6: Create theme tokens (CSS custom properties)

**Files:**
- Create: `src/theme/tokens.css`

- [ ] **Step 1: Write `src/theme/tokens.css`**

```css
:root {
  /* spacing — 4px base grid */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;

  /* type scale — 1.250 minor third, base 16px */
  --text-xs: 0.8rem;
  --text-sm: 0.9rem;
  --text-base: 1rem;
  --text-lg: 1.25rem;
  --text-xl: 1.563rem;
  --text-2xl: 1.953rem;
  --text-3xl: 2.441rem;
  --text-4xl: 3.052rem;
  --text-5xl: 3.815rem;

  /* layout */
  --content-max: 768px;
  --grid-max: 1100px;

  /* radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;

  /* motion */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 150ms;
  --duration-base: 250ms;
}

:root[data-theme='light'] {
  --bg: #faf8f5;
  --surface: #ffffff;
  --ink: #1a1a1f;
  --muted: #5c5c66;
  --accent: #3b3fe4;
  --highlight: #f2b441;
  --chip-ai: #0d9488;
  --chip-scratch: #475569;
  --border: rgba(26, 26, 31, 0.08);
  --shadow: 0 1px 2px rgba(26, 26, 31, 0.04), 0 4px 12px rgba(26, 26, 31, 0.06);
}

:root[data-theme='dark'] {
  --bg: #0f1117;
  --surface: #161922;
  --ink: #ececf2;
  --muted: #9ca0ae;
  --accent: #8b8fff;
  --highlight: #f4c26c;
  --chip-ai: #2dd4bf;
  --chip-scratch: #94a3b8;
  --border: rgba(236, 236, 242, 0.08);
  --shadow: 0 1px 2px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.4);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/theme/tokens.css
git commit -m "feat(theme): add CSS custom property tokens for light and dark"
```

---

## Task 7: Global styles, CSS reset, font imports

**Files:**
- Create: `src/theme/GlobalStyles.tsx`, `src/theme/global.css`

- [ ] **Step 1: Create `src/theme/global.css`**

```css
@import './tokens.css';

@import '@fontsource-variable/fraunces/index.css';
@import '@fontsource-variable/inter/index.css';
@import '@fontsource-variable/jetbrains-mono/index.css';

*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }

html, body, #root { height: 100%; }

html {
  font-family: 'Inter Variable', system-ui, -apple-system, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color-scheme: light dark;
}

body {
  background: var(--bg);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  transition: background var(--duration-base) var(--ease-out), color var(--duration-base) var(--ease-out);
}

h1, h2, h3, h4 {
  font-family: 'Fraunces Variable', Georgia, serif;
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.01em;
}

h1 { font-size: var(--text-5xl); }
h2 { font-size: var(--text-3xl); }
h3 { font-size: var(--text-xl); }

p { max-width: var(--content-max); }

a {
  color: var(--accent);
  text-decoration: none;
  background-image: linear-gradient(var(--accent), var(--accent));
  background-size: 0 1px;
  background-repeat: no-repeat;
  background-position: 0 100%;
  transition: background-size var(--duration-base) var(--ease-out);
}
a:hover { background-size: 100% 1px; }

button {
  font: inherit;
  color: inherit;
  background: none;
  border: 0;
  cursor: pointer;
}

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
  border-radius: var(--radius-sm);
}

img, svg { display: block; max-width: 100%; }

code, pre {
  font-family: 'JetBrains Mono Variable', ui-monospace, monospace;
  font-size: 0.9em;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Create `src/theme/GlobalStyles.tsx`**

```tsx
import './global.css';

export function GlobalStyles() {
  return null;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/theme/global.css src/theme/GlobalStyles.tsx
git commit -m "feat(theme): add reset, fonts, base typography"
```

---

## Task 8: No-flash theme inline script + index.html updates

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Replace `index.html`**

```html
<!doctype html>
<html lang="en" data-theme="light">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#FAF8F5" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#0F1117" media="(prefers-color-scheme: dark)" />
    <title>Peter Elijah Marticio — Full-Stack Developer</title>
    <meta
      name="description"
      content="Portfolio of Peter Elijah Marticio — Full-Stack Developer and Computer Engineering student at PUP."
    />
    <meta property="og:title" content="Peter Elijah Marticio" />
    <meta property="og:description" content="Full-Stack Developer · Computer Engineering @ PUP" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="/og.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <script>
      (function () {
        try {
          var stored = localStorage.getItem('mp-theme');
          var theme =
            stored === 'light' || stored === 'dark'
              ? stored
              : window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';
          document.documentElement.setAttribute('data-theme', theme);
        } catch (_) {}
      })();
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat(theme): add no-flash inline theme script and meta tags"
```

---

## Task 9: Zustand theme store

**Files:**
- Create: `src/theme/themeStore.ts`

- [ ] **Step 1: Write `src/theme/themeStore.ts`**

```ts
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
```

- [ ] **Step 2: Commit**

```bash
git add src/theme/themeStore.ts
git commit -m "feat(theme): add zustand store with persistence and apply-on-init"
```

---

## Task 10: `useTheme` and `usePrefersReducedMotion` hooks

**Files:**
- Create: `src/hooks/useTheme.ts`, `src/hooks/usePrefersReducedMotion.ts`

- [ ] **Step 1: `src/hooks/useTheme.ts`**

```ts
import { useThemeStore } from '@/theme/themeStore';

export function useTheme() {
  const resolved = useThemeStore((s) => s.resolved);
  const toggle = useThemeStore((s) => s.toggle);
  return { theme: resolved, toggle };
}
```

- [ ] **Step 2: `src/hooks/usePrefersReducedMotion.ts`**

```ts
import { useEffect, useState } from 'react';

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window === 'undefined'
      ? false
      : window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useTheme.ts src/hooks/usePrefersReducedMotion.ts
git commit -m "feat(hooks): add useTheme and usePrefersReducedMotion"
```

---

## Task 11: Data layer — types and content files

**Files:**
- Create: `src/data/types.ts`, `src/data/projects.ts`, `src/data/experience.ts`, `src/data/education.ts`

- [ ] **Step 1: `src/data/types.ts`**

```ts
export type BuildStyle = 'ai-assisted' | 'from-scratch';

export type Project = {
  id: string;
  title: string;
  blurb: string;
  description?: string;
  tech: string[];
  buildStyle: BuildStyle;
  links: { live?: string; code?: string };
  featured: boolean;
  highlights?: string[];
  images?: string[];
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  start: string;
  end: string;
  bullets: string[];
};

export type Education = {
  id: string;
  institution: string;
  credential: string;
  start: string;
  end: string;
  link?: string;
  note?: string;
};
```

- [ ] **Step 2: `src/data/projects.ts`**

```ts
import type { Project } from './types';

export const projects: Project[] = [
  {
    id: 'memorizemate',
    title: 'MemorizeMate',
    blurb: 'Offline-first spaced-repetition flashcards (PWA).',
    description:
      'A polished PWA flashcard app using the FSRS algorithm. Offline-first via IndexedDB, smart CSV/cloze import, GitHub-style review heatmap, and an ink-and-paper design system with light/dark/auto themes.',
    tech: ['React 19', 'TypeScript', 'Vite', 'Zustand', 'IndexedDB', 'ts-fsrs', 'Framer Motion', 'PWA'],
    buildStyle: 'ai-assisted',
    links: { code: 'https://github.com/PandesalPanpan' /* TODO: replace once repo is public */ },
    featured: true,
    highlights: [
      'Custom FSRS scheduling integration',
      'Offline-ready with service worker caching',
      '38 unit tests + Playwright e2e',
    ],
    images: [],
  },
  {
    id: 'classhub',
    title: 'ClassHub',
    blurb: 'Undergraduate thesis — PUP Computer Engineering Dept.',
    description: 'Thesis project for the PUP CompE Department. Built from scratch in JavaScript.',
    tech: ['JavaScript', 'Node.js'],
    buildStyle: 'from-scratch',
    links: { code: 'https://github.com/PandesalPanpan/classhub' },
    featured: true,
    highlights: ['Undergraduate thesis', 'Deployed and used by the department'],
  },
  {
    id: 'threaded',
    title: 'Threaded',
    blurb: 'Personal journaling app with streaks, rewards, and a partner-driven shop.',
    description:
      'Actively-used journaling app shared with my partner. Daily-post streaks, random roulette reward points, and a shop where each partner sets real-world treats redeemable with points. Ported from Livewire to React.',
    tech: ['Laravel', 'Filament', 'React', 'TypeScript', 'MySQL'],
    buildStyle: 'ai-assisted',
    links: { live: 'https://threaded.marticio.tech' },
    featured: true,
    highlights: ['Daily streak tracking', 'Roulette reward points', 'Partner shop with redeemable treats'],
    images: [],
  },
  {
    id: 'thesis-rfid-ims',
    title: 'Thesis-RFID-IMS',
    blurb: 'Inventory management with RFID, biometrics, and barcode.',
    description: 'Web app integrating RFID, biometric, and barcode hardware for inventory workflows.',
    tech: ['PHP', 'MySQL', 'JavaScript'],
    buildStyle: 'from-scratch',
    links: { code: 'https://github.com/PandesalPanpan/Thesis-RFID-Borrowing-IMS' },
    featured: true,
  },
  {
    id: 'binary-speed',
    title: 'binary-speed',
    blurb: 'CS50 final project — binary ↔ hex training game.',
    tech: ['Python'],
    buildStyle: 'from-scratch',
    links: { code: 'https://github.com/PandesalPanpan/binary-speed' },
    featured: true,
  },
  {
    id: 'express-inventory',
    title: 'express-inventory-application',
    blurb: 'Odin Project — Express + MongoDB inventory CRUD.',
    tech: ['Node.js', 'Express', 'MongoDB', 'EJS'],
    buildStyle: 'from-scratch',
    links: { code: 'https://github.com/PandesalPanpan/express-inventory-application' },
    featured: true,
  },
  {
    id: 'jollibee-clone',
    title: 'jollibee-clone',
    blurb: 'Frontend craft exercise — Jollibee site clone.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    buildStyle: 'from-scratch',
    links: { code: 'https://github.com/PandesalPanpan/jollibee-clone' },
    featured: true,
  },
  {
    id: 'knights-travails',
    title: 'odin-knights-travails',
    blurb: 'Shortest knight path solver (BFS on chessboard).',
    tech: ['JavaScript'],
    buildStyle: 'from-scratch',
    links: { code: 'https://github.com/PandesalPanpan/odin-knights-travails' },
    featured: true,
  },
];
```

- [ ] **Step 3: `src/data/experience.ts`**

```ts
import type { Experience } from './types';

export const experience: Experience[] = [
  {
    id: 'caret',
    company: 'Caret Solutions Inc.',
    role: 'Full-Stack Developer',
    start: '2026',
    end: 'Present',
    bullets: [
      'Collaborated within a development team to build and deploy a robust Inventory Management System.',
      'Developed an IMS integrating frontend interfaces with a secure backend to manage complex stock workflows.',
    ],
  },
  {
    id: 'metacore',
    company: 'Meta Core Systems Inc.',
    role: 'Mobile Developer Intern',
    start: 'Mar 2024',
    end: 'Aug 2024',
    bullets: [
      'Built a Flutter POS system managing 1,000+ items and 300–500 daily transactions.',
      'Integrated Bluetooth thermal printing, reducing checkout time by 30%.',
    ],
  },
  {
    id: 'ntek',
    company: 'NTEK Systems Inc.',
    role: 'PHP Developer Intern',
    start: 'Aug 2023',
    end: 'Oct 2023',
    bullets: [
      'Developed a reporting system for real-time monitoring of 500+ daily transactions.',
      'Implemented PayMaya API for secure digital payment testing and integration.',
    ],
  },
];
```

- [ ] **Step 4: `src/data/education.ts`**

```ts
import type { Education } from './types';

export const education: Education[] = [
  {
    id: 'pup',
    institution: 'Polytechnic University of the Philippines',
    credential: 'Bachelor in Computer Engineering',
    start: '2021',
    end: 'Present',
  },
  {
    id: 'odin',
    institution: 'The Odin Project',
    credential: 'Full-Stack JavaScript Path',
    start: 'Ongoing',
    end: '',
    link: 'https://www.theodinproject.com/',
    note: 'Active contributor and curriculum learner.',
  },
  {
    id: 'cs50',
    institution: "Harvard's CS50",
    credential: 'Introduction to Computer Science',
    start: '',
    end: 'Completed',
    link: undefined /* TODO: paste certificate URL */,
  },
];
```

- [ ] **Step 5: Commit**

```bash
git add src/data
git commit -m "feat(data): add typed projects, experience, education data"
```

---

## Task 12: BoopIcon component (reduced-motion-aware micro-interaction)

**Files:**
- Create: `src/components/BoopIcon.tsx`

- [ ] **Step 1: Write component**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/BoopIcon.tsx
git commit -m "feat(components): add BoopIcon with reduced-motion support"
```

---

## Task 13: Button, Tag, Card primitives

**Files:**
- Create: `src/components/Button.tsx` + `.module.css`, `src/components/Tag.tsx` + `.module.css`, `src/components/Card.tsx` + `.module.css`

- [ ] **Step 1: `Button.tsx`**

```tsx
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'ghost';

type BaseProps = { variant?: Variant; children: ReactNode };

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' };
type AnchorProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a'; href: string };

export function Button(props: ButtonProps | AnchorProps) {
  const { variant = 'primary', children, className = '', ...rest } = props as ButtonProps & AnchorProps;
  const cls = `${styles.btn} ${styles[variant]} ${className}`.trim();
  if (props.as === 'a') {
    return (
      <a className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }
  return (
    <button className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
```

- [ ] **Step 2: `Button.module.css`**

```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: var(--text-base);
  text-decoration: none;
  background-image: none;
  transition: transform var(--duration-fast) var(--ease-out), background var(--duration-fast) var(--ease-out);
}
.btn:hover { transform: translateY(-1px); background-image: none; }
.primary { background: var(--accent); color: #fff; }
.primary:hover { filter: brightness(1.05); }
.secondary { background: var(--surface); color: var(--ink); border: 1px solid var(--border); }
.secondary:hover { border-color: var(--accent); }
.ghost { background: transparent; color: var(--ink); }
.ghost:hover { color: var(--accent); }
```

- [ ] **Step 3: `Tag.tsx`**

```tsx
import styles from './Tag.module.css';

export function Tag({ children }: { children: React.ReactNode }) {
  return <span className={styles.tag}>{children}</span>;
}
```

- [ ] **Step 4: `Tag.module.css`**

```css
.tag {
  display: inline-block;
  padding: 2px var(--space-2);
  border-radius: var(--radius-sm);
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--muted);
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: var(--text-xs);
}
```

- [ ] **Step 5: `Card.tsx`**

```tsx
import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Card.module.css';

export function Card({ children, className = '', ...rest }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={`${styles.card} ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}
```

- [ ] **Step 6: `Card.module.css`**

```css
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow);
  transition: transform var(--duration-base) var(--ease-out), border-color var(--duration-base) var(--ease-out);
}
.card:hover { transform: translateY(-2px); border-color: var(--accent); }
```

- [ ] **Step 7: Commit**

```bash
git add src/components/Button.* src/components/Tag.* src/components/Card.*
git commit -m "feat(components): add Button, Tag, Card primitives"
```

---

## Task 14: BuildBadge component (the AI-Assisted / From Scratch chip)

**Files:**
- Create: `src/components/BuildBadge.tsx` + `.module.css`

- [ ] **Step 1: `BuildBadge.tsx`**

```tsx
import type { BuildStyle } from '@/data/types';
import styles from './BuildBadge.module.css';

const LABEL: Record<BuildStyle, string> = {
  'ai-assisted': 'AI-Assisted',
  'from-scratch': 'From Scratch',
};

const TOOLTIP: Record<BuildStyle, string> = {
  'ai-assisted': 'Built with AI pair-programming. Architecture, decisions, and review by me.',
  'from-scratch': 'Written by hand, no AI assistance.',
};

export function BuildBadge({ style }: { style: BuildStyle }) {
  return (
    <span
      className={`${styles.badge} ${style === 'ai-assisted' ? styles.ai : styles.scratch}`}
      title={TOOLTIP[style]}
      aria-label={`${LABEL[style]}: ${TOOLTIP[style]}`}
    >
      {LABEL[style]}
    </span>
  );
}
```

- [ ] **Step 2: `BuildBadge.module.css`**

```css
.badge {
  display: inline-block;
  padding: 2px var(--space-2);
  border-radius: var(--radius-sm);
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.02em;
  color: #fff;
  cursor: help;
}
.ai { background: var(--chip-ai); }
.scratch { background: var(--chip-scratch); }
```

- [ ] **Step 3: Commit**

```bash
git add src/components/BuildBadge.*
git commit -m "feat(components): add BuildBadge with hover tooltip"
```

---

## Task 15: ThemeToggle component

**Files:**
- Create: `src/components/ThemeToggle.tsx` + `.module.css`

- [ ] **Step 1: `ThemeToggle.tsx`**

```tsx
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import styles from './ThemeToggle.module.css';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      aria-pressed={isDark}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? 'moon' : 'sun'}
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'inline-flex' }}
        >
          {isDark ? <Moon size={18} /> : <Sun size={18} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
```

- [ ] **Step 2: `ThemeToggle.module.css`**

```css
.toggle {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  color: var(--ink);
  transition: background var(--duration-fast) var(--ease-out);
}
.toggle:hover { background: var(--bg); }
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ThemeToggle.*
git commit -m "feat(components): add ThemeToggle with sun/moon morph"
```

---

## Task 16: VersionToggle component

**Files:**
- Create: `src/components/VersionToggle.tsx` + `.module.css`

- [ ] **Step 1: `VersionToggle.tsx`**

```tsx
import { NavLink, useLocation } from 'react-router-dom';
import styles from './VersionToggle.module.css';

export function VersionToggle() {
  const { pathname } = useLocation();
  const isHandmade = pathname.startsWith('/handmade');
  return (
    <div className={styles.toggle} role="group" aria-label="Site version">
      <NavLink
        to="/"
        className={!isHandmade ? `${styles.option} ${styles.active}` : styles.option}
        aria-current={!isHandmade ? 'page' : undefined}
      >
        Agentic
      </NavLink>
      <NavLink
        to="/handmade"
        className={isHandmade ? `${styles.option} ${styles.active}` : styles.option}
        aria-current={isHandmade ? 'page' : undefined}
      >
        Handmade
      </NavLink>
    </div>
  );
}
```

- [ ] **Step 2: `VersionToggle.module.css`**

```css
.toggle {
  display: inline-flex;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 2px;
  background: var(--surface);
}
.option {
  padding: 4px var(--space-3);
  border-radius: calc(var(--radius-md) - 2px);
  font-size: var(--text-sm);
  color: var(--muted);
  background-image: none;
  text-decoration: none;
  transition: background var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out);
}
.option:hover { color: var(--ink); background-image: none; }
.active { background: var(--accent); color: #fff; }
.active:hover { color: #fff; }
```

- [ ] **Step 3: Commit**

```bash
git add src/components/VersionToggle.*
git commit -m "feat(components): add VersionToggle linking / and /handmade"
```

---

## Task 17: Monogram SVG + favicon

**Files:**
- Create: `src/assets/monogram.svg`, `public/favicon.svg`, `public/og.png` (placeholder)

- [ ] **Step 1: `src/assets/monogram.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none">
  <rect width="40" height="40" rx="8" fill="currentColor" opacity="0.06"/>
  <text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle"
        font-family="Fraunces, Georgia, serif" font-weight="600" font-size="16" fill="currentColor">PM</text>
</svg>
```

- [ ] **Step 2: `public/favicon.svg`** (same content, standalone copy so it serves at `/favicon.svg` without bundling)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none">
  <rect width="40" height="40" rx="8" fill="#3B3FE4"/>
  <text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle"
        font-family="Georgia, serif" font-weight="700" font-size="20" fill="#FFFFFF">PM</text>
</svg>
```

- [ ] **Step 3: Placeholder `public/og.png`**

Create a 1200×630 PNG. Use PowerShell to generate a solid-color placeholder:
```powershell
Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap 1200, 630
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::FromArgb(250, 248, 245))
$font = New-Object System.Drawing.Font('Georgia', 64, [System.Drawing.FontStyle]::Bold)
$brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(26, 26, 31))
$g.DrawString('Peter Elijah Marticio', $font, $brush, 80, 250)
$bmp.Save('public/og.png', [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
```

- [ ] **Step 4: Commit**

```bash
git add src/assets/monogram.svg public/favicon.svg public/og.png
git commit -m "feat(assets): add monogram, favicon, og placeholder"
```

---

## Task 18: Header component

**Files:**
- Create: `src/components/Header.tsx` + `.module.css`

- [ ] **Step 1: `Header.tsx`**

```tsx
import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { VersionToggle } from './VersionToggle';
import monogram from '@/assets/monogram.svg';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} aria-label="Home">
          <img src={monogram} alt="" width={32} height={32} />
        </Link>
        <nav className={styles.nav} aria-label="Primary">
          <a href="/#projects">Projects</a>
          <a href="/#experience">Experience</a>
          <Link to="/colophon">Colophon</Link>
        </nav>
        <div className={styles.controls}>
          <VersionToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: `Header.module.css`**

```css
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: color-mix(in srgb, var(--bg) 85%, transparent);
  backdrop-filter: saturate(180%) blur(12px);
  border-bottom: 1px solid var(--border);
}
.inner {
  max-width: var(--grid-max);
  margin: 0 auto;
  padding: var(--space-3) var(--space-6);
  display: flex;
  align-items: center;
  gap: var(--space-6);
}
.brand { color: var(--ink); display: inline-flex; background-image: none; }
.brand:hover { background-image: none; }
.nav {
  display: flex;
  gap: var(--space-6);
  margin-left: var(--space-6);
  flex: 1;
}
.nav a { color: var(--ink); font-size: var(--text-sm); }
.controls { display: flex; gap: var(--space-3); align-items: center; }

@media (max-width: 640px) {
  .nav { display: none; }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.*
git commit -m "feat(components): add sticky Header with monogram, nav, toggles"
```

---

## Task 19: Footer component

**Files:**
- Create: `src/components/Footer.tsx` + `.module.css`

- [ ] **Step 1: `Footer.tsx`**

```tsx
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span>© {new Date().getFullYear()} Peter Elijah Marticio</span>
        <nav className={styles.nav} aria-label="Footer">
          <Link to="/colophon">Colophon</Link>
          <a href="https://github.com/PandesalPanpan/MarticioPortfolio">Source</a>
        </nav>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: `Footer.module.css`**

```css
.footer {
  border-top: 1px solid var(--border);
  margin-top: var(--space-24);
}
.inner {
  max-width: var(--grid-max);
  margin: 0 auto;
  padding: var(--space-8) var(--space-6);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--text-sm);
  color: var(--muted);
}
.nav { display: flex; gap: var(--space-6); }
.nav a { color: var(--muted); }
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.*
git commit -m "feat(components): add Footer with copyright and source link"
```

---

## Task 20: Hero section

**Files:**
- Create: `src/sections/Hero.tsx` + `.module.css`

- [ ] **Step 1: `Hero.tsx`**

```tsx
import { Button } from '@/components/Button';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <p className={styles.eyebrow}>Full-Stack Developer · Computer Engineering @ PUP</p>
      <h1 id="hero-title" className={styles.title}>Peter Elijah Marticio</h1>
      <p className={styles.tagline}>
        Computer Engineering student building full-stack apps end-to-end — from VPS self-hosting to
        Flutter POS systems. Active contributor to The Odin Project.
      </p>
      <div className={styles.actions}>
        <Button as="a" href="#projects" variant="primary">View Projects</Button>
        <Button as="a" href="/cv.pdf" variant="secondary" download>Download CV</Button>
        <Button as="a" href="https://github.com/PandesalPanpan" variant="ghost">GitHub</Button>
      </div>
      <p className={styles.note}>
        This is the AI-assisted build. A from-scratch version is in progress — toggle above.
      </p>
    </section>
  );
}
```

- [ ] **Step 2: `Hero.module.css`**

```css
.hero {
  max-width: var(--grid-max);
  margin: 0 auto;
  padding: var(--space-24) var(--space-6) var(--space-16);
}
.eyebrow {
  color: var(--muted);
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: var(--text-sm);
  margin-bottom: var(--space-4);
}
.title {
  font-size: clamp(var(--text-3xl), 7vw, var(--text-5xl));
  max-width: 720px;
  margin-bottom: var(--space-6);
}
.tagline {
  font-size: var(--text-lg);
  color: var(--muted);
  max-width: 640px;
  margin-bottom: var(--space-8);
}
.actions {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
  margin-bottom: var(--space-8);
}
.note {
  font-size: var(--text-sm);
  color: var(--muted);
  font-style: italic;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/sections/Hero.*
git commit -m "feat(sections): add Hero with CTAs and version note"
```

---

## Task 21: ProjectCard component

**Files:**
- Create: `src/components/ProjectCard.tsx` + `.module.css`

- [ ] **Step 1: `ProjectCard.tsx`**

```tsx
import { useState } from 'react';
import { ExternalLink, Code2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '@/data/types';
import { Card } from './Card';
import { Tag } from './Tag';
import { BuildBadge } from './BuildBadge';
import styles from './ProjectCard.module.css';

export function ProjectCard({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false);
  const hasDetails = !!(project.description || project.highlights?.length);
  const panelId = `project-${project.id}-details`;

  return (
    <Card className={styles.card}>
      <div className={styles.head}>
        <h3 className={styles.title}>{project.title}</h3>
        <BuildBadge style={project.buildStyle} />
      </div>
      <p className={styles.blurb}>{project.blurb}</p>
      <div className={styles.tech}>
        {project.tech.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
      <div className={styles.actions}>
        {project.links.live && (
          <a href={project.links.live} className={styles.link}>
            <ExternalLink size={14} /> Live
          </a>
        )}
        {project.links.code && (
          <a href={project.links.code} className={styles.link}>
            <Code2 size={14} /> Code
          </a>
        )}
        {hasDetails && (
          <button
            type="button"
            className={styles.expand}
            aria-expanded={expanded}
            aria-controls={panelId}
            onClick={() => setExpanded((v) => !v)}
          >
            <ChevronDown
              size={14}
              style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}
            />
            {expanded ? 'Less' : 'More'}
          </button>
        )}
      </div>
      <AnimatePresence initial={false}>
        {expanded && hasDetails && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={styles.detailsWrap}
          >
            <div className={styles.details}>
              {project.description && <p>{project.description}</p>}
              {project.highlights?.length ? (
                <ul>
                  {project.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
```

- [ ] **Step 2: `ProjectCard.module.css`**

```css
.card { display: flex; flex-direction: column; gap: var(--space-3); }
.head { display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-3); }
.title { font-size: var(--text-xl); margin: 0; }
.blurb { color: var(--muted); }
.tech { display: flex; gap: var(--space-2); flex-wrap: wrap; }
.actions { display: flex; gap: var(--space-4); align-items: center; margin-top: var(--space-2); }
.link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-sm);
}
.expand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-sm);
  color: var(--muted);
  margin-left: auto;
}
.expand:hover { color: var(--accent); }
.detailsWrap { overflow: hidden; }
.details { padding-top: var(--space-4); display: flex; flex-direction: column; gap: var(--space-3); color: var(--muted); }
.details ul { padding-left: var(--space-6); }
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ProjectCard.*
git commit -m "feat(components): add ProjectCard with expandable details"
```

---

## Task 22: Projects section

**Files:**
- Create: `src/sections/Projects.tsx` + `.module.css`

- [ ] **Step 1: `Projects.tsx`**

```tsx
import { ArrowRight } from 'lucide-react';
import { projects } from '@/data/projects';
import { ProjectCard } from '@/components/ProjectCard';
import styles from './Projects.module.css';

export function Projects() {
  const featured = projects.filter((p) => p.featured);
  return (
    <section id="projects" className={styles.section} aria-labelledby="projects-title">
      <div className={styles.head}>
        <h2 id="projects-title">Featured Projects</h2>
      </div>
      <div className={styles.grid}>
        {featured.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
      <a className={styles.more} href="https://github.com/PandesalPanpan?tab=repositories">
        More on GitHub <ArrowRight size={14} />
      </a>
      <p className={styles.legend}>
        Projects are labeled by build style. <em>AI-Assisted</em> means I used AI tooling
        (Claude Code, Copilot) as a pair-programmer — I drove the architecture, made the calls,
        and reviewed everything. <em>From Scratch</em> means no AI was used. Both are mine.
      </p>
    </section>
  );
}
```

- [ ] **Step 2: `Projects.module.css`**

```css
.section {
  max-width: var(--grid-max);
  margin: 0 auto;
  padding: var(--space-16) var(--space-6);
}
.head { margin-bottom: var(--space-8); }
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-6);
}
@media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }
.more {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-6);
  font-size: var(--text-sm);
}
.legend {
  margin-top: var(--space-8);
  font-size: var(--text-sm);
  color: var(--muted);
  max-width: var(--content-max);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/sections/Projects.*
git commit -m "feat(sections): add Projects grid with legend"
```

---

## Task 23: Experience section

**Files:**
- Create: `src/sections/Experience.tsx` + `.module.css`

- [ ] **Step 1: `Experience.tsx`**

```tsx
import { experience } from '@/data/experience';
import styles from './Experience.module.css';

export function Experience() {
  return (
    <section id="experience" className={styles.section} aria-labelledby="experience-title">
      <h2 id="experience-title">Experience</h2>
      <ol className={styles.timeline}>
        {experience.map((e) => (
          <li key={e.id} className={styles.item}>
            <div className={styles.dates}>
              {e.start}{e.end ? ` – ${e.end}` : ''}
            </div>
            <div className={styles.body}>
              <h3 className={styles.role}>
                {e.role} · <span className={styles.company}>{e.company}</span>
              </h3>
              <ul className={styles.bullets}>
                {e.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

- [ ] **Step 2: `Experience.module.css`**

```css
.section {
  max-width: var(--grid-max);
  margin: 0 auto;
  padding: var(--space-16) var(--space-6);
}
.section > h2 { margin-bottom: var(--space-8); }
.timeline {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  border-left: 2px solid var(--border);
  padding-left: var(--space-6);
}
.item { display: grid; grid-template-columns: 180px 1fr; gap: var(--space-6); }
.dates {
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: var(--text-sm);
  color: var(--muted);
}
.role { font-size: var(--text-lg); margin-bottom: var(--space-3); }
.company { color: var(--muted); font-weight: 400; }
.bullets { padding-left: var(--space-6); color: var(--muted); display: flex; flex-direction: column; gap: var(--space-2); }

@media (max-width: 640px) {
  .item { grid-template-columns: 1fr; gap: var(--space-2); }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/sections/Experience.*
git commit -m "feat(sections): add Experience timeline"
```

---

## Task 24: Education section

**Files:**
- Create: `src/sections/Education.tsx` + `.module.css`

- [ ] **Step 1: `Education.tsx`**

```tsx
import { education } from '@/data/education';
import { Card } from '@/components/Card';
import styles from './Education.module.css';

export function Education() {
  return (
    <section id="education" className={styles.section} aria-labelledby="education-title">
      <h2 id="education-title">Education</h2>
      <div className={styles.grid}>
        {education.map((e) => (
          <Card key={e.id} className={styles.item}>
            <h3 className={styles.institution}>{e.institution}</h3>
            <p className={styles.credential}>{e.credential}</p>
            <p className={styles.dates}>
              {e.start}{e.end ? (e.start ? ` – ${e.end}` : e.end) : ''}
            </p>
            {e.note && <p className={styles.note}>{e.note}</p>}
            {e.link && <a href={e.link} className={styles.link}>Learn more →</a>}
          </Card>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: `Education.module.css`**

```css
.section {
  max-width: var(--grid-max);
  margin: 0 auto;
  padding: var(--space-16) var(--space-6);
}
.section > h2 { margin-bottom: var(--space-8); }
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-4);
}
.item { display: flex; flex-direction: column; gap: var(--space-2); }
.institution { font-size: var(--text-lg); }
.credential { color: var(--ink); }
.dates {
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: var(--text-sm);
  color: var(--muted);
}
.note { color: var(--muted); font-size: var(--text-sm); }
.link { font-size: var(--text-sm); margin-top: auto; }

@media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }
```

- [ ] **Step 3: Commit**

```bash
git add src/sections/Education.*
git commit -m "feat(sections): add Education cards"
```

---

## Task 25: Contact section

**Files:**
- Create: `src/sections/Contact.tsx` + `.module.css`

- [ ] **Step 1: `Contact.tsx`**

```tsx
import { Mail, Github, Linkedin } from 'lucide-react';
import { BoopIcon } from '@/components/BoopIcon';
import styles from './Contact.module.css';

const links = [
  { href: 'mailto:petermarticio@gmail.com', label: 'petermarticio@gmail.com', Icon: Mail },
  { href: 'https://github.com/PandesalPanpan', label: 'github.com/PandesalPanpan', Icon: Github },
  {
    href: 'https://www.linkedin.com/in/peter-elijah-a-marticio-46340125b/',
    label: 'LinkedIn',
    Icon: Linkedin,
  },
];

export function Contact() {
  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-title">
      <h2 id="contact-title">Get in touch</h2>
      <ul className={styles.list}>
        {links.map(({ href, label, Icon }) => (
          <li key={href}>
            <a href={href} className={styles.link}>
              <BoopIcon>
                <Icon size={20} />
              </BoopIcon>
              <span>{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 2: `Contact.module.css`**

```css
.section {
  max-width: var(--grid-max);
  margin: 0 auto;
  padding: var(--space-16) var(--space-6);
}
.section > h2 { margin-bottom: var(--space-8); }
.list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: var(--space-4); }
.link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-lg);
  color: var(--ink);
  background-image: none;
}
.link:hover { color: var(--accent); background-image: none; }
```

- [ ] **Step 3: Commit**

```bash
git add src/sections/Contact.*
git commit -m "feat(sections): add Contact with boopable icons"
```

---

## Task 26: Home, Handmade, Colophon, NotFound routes

**Files:**
- Create: `src/routes/Home.tsx`, `src/routes/Handmade.tsx`, `src/routes/Colophon.tsx` + `.module.css`, `src/routes/NotFound.tsx`

- [ ] **Step 1: `Home.tsx`**

```tsx
import { Hero } from '@/sections/Hero';
import { Projects } from '@/sections/Projects';
import { Experience } from '@/sections/Experience';
import { Education } from '@/sections/Education';
import { Contact } from '@/sections/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <Projects />
      <Experience />
      <Education />
      <Contact />
    </>
  );
}
```

- [ ] **Step 2: `Handmade.tsx`**

```tsx
export default function Handmade() {
  return (
    <main style={{ maxWidth: 768, margin: '0 auto', padding: '96px 24px' }}>
      <h1>Handmade version — under construction</h1>
      <p style={{ color: 'var(--muted)', marginTop: 16 }}>
        I'm hand-writing a from-scratch version of this site in parallel — no AI, same content,
        same constraints. When it ships it will live here. In the meantime, you can follow
        progress on{' '}
        <a href="https://github.com/PandesalPanpan/MarticioPortfolio">GitHub</a>.
      </p>
    </main>
  );
}
```

- [ ] **Step 3: `Colophon.tsx`**

```tsx
import styles from './Colophon.module.css';

export default function Colophon() {
  return (
    <main className={styles.main}>
      <h1>Colophon</h1>
      <section>
        <h2>Why two versions of this site exist</h2>
        <p>
          AI-assisted coding is the reality of how I work now. But I also want to show I can build
          without it. So this site ships in two versions — the one you're on, built with AI
          pair-programming, and a from-scratch version I'm hand-writing in parallel. Toggle between
          them in the header. Same content, different process.
        </p>
      </section>
      <section>
        <h2>What's on this version (AI-Assisted)</h2>
        <ul>
          <li>Stack: Vite, React 19, TypeScript, React Router, Zustand, Framer Motion, CSS Modules.</li>
          <li>AI did: scaffolding, initial component drafts, theme tokens, animation variants.</li>
          <li>I did: architecture decisions, the dual-build framing, content, palette, every public-facing copy line.</li>
          <li>Threw out: a few overreaching motion ideas that ignored <code>prefers-reduced-motion</code>.</li>
        </ul>
      </section>
      <section>
        <h2>What's on the other version (From Scratch)</h2>
        <ul>
          <li>Same constraints: Vite, React, TS, CSS Modules. No AI tools.</li>
          <li>Status: in progress.</li>
        </ul>
      </section>
      <section>
        <h2>What stays the same across both</h2>
        <p>
          Project data lives in the same <code>projects.ts</code>. Both versions deploy as static
          sites and pass the same Lighthouse budget. The experiment isolates <em>process</em>, not
          <em> outcome</em>.
        </p>
      </section>
      <p className={styles.source}>
        <a href="https://github.com/PandesalPanpan/MarticioPortfolio">Source code: GitHub →</a>
      </p>
    </main>
  );
}
```

- [ ] **Step 4: `Colophon.module.css`**

```css
.main {
  max-width: var(--content-max);
  margin: 0 auto;
  padding: var(--space-16) var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}
.main h1 { font-size: var(--text-4xl); }
.main h2 { font-size: var(--text-xl); margin-bottom: var(--space-3); }
.main ul { padding-left: var(--space-6); color: var(--muted); display: flex; flex-direction: column; gap: var(--space-2); }
.main p { color: var(--muted); }
.source { margin-top: var(--space-8); }
```

- [ ] **Step 5: `NotFound.tsx`**

```tsx
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main style={{ maxWidth: 768, margin: '0 auto', padding: '96px 24px', textAlign: 'center' }}>
      <h1>404</h1>
      <p style={{ color: 'var(--muted)', marginTop: 16 }}>
        That page doesn't exist. <Link to="/">Go home</Link>.
      </p>
    </main>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/routes
git commit -m "feat(routes): add Home, Handmade, Colophon, NotFound"
```

---

## Task 27: App shell, router, lazy loading, main entry

**Files:**
- Create: `src/App.tsx`
- Modify: `src/main.tsx`

- [ ] **Step 1: `src/App.tsx`**

```tsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GlobalStyles } from '@/theme/GlobalStyles';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Home from '@/routes/Home';

const Handmade = lazy(() => import('@/routes/Handmade'));
const Colophon = lazy(() => import('@/routes/Colophon'));
const NotFound = lazy(() => import('@/routes/NotFound'));

export default function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Header />
      <main>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/handmade" element={<Handmade />} />
            <Route path="/colophon" element={<Colophon />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
```

- [ ] **Step 2: Replace `src/main.tsx`**

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Step 3: Run dev server and verify**

```bash
npm run dev
```
Open `http://localhost:5173`. Expected: page loads with header, hero, projects, experience, education, contact, footer; theme toggle works; clicking `Handmade` navigates; `Colophon` link works.

- [ ] **Step 4: Type check + build**

```bash
npm run build
```
Expected: clean build, no errors.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/main.tsx
git commit -m "feat: wire App router, lazy routes, header/footer shell"
```

---

## Task 28: Copy CV PDF, add robots.txt and sitemap.xml

**Files:**
- Create: `public/cv.pdf`, `public/robots.txt`, `public/sitemap.xml`

- [ ] **Step 1: Copy CV**

```powershell
Copy-Item 'C:\Users\IMSTILLONTHEFLOOR\Downloads\Peter-Elijah-Marticio-CV.pdf' 'public\cv.pdf'
```

- [ ] **Step 2: `public/robots.txt`**

```
User-agent: *
Allow: /
Sitemap: https://marticio.tech/sitemap.xml
```

- [ ] **Step 3: `public/sitemap.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://marticio.tech/</loc></url>
  <url><loc>https://marticio.tech/handmade</loc></url>
  <url><loc>https://marticio.tech/colophon</loc></url>
</urlset>
```

- [ ] **Step 4: Commit**

```bash
git add public/cv.pdf public/robots.txt public/sitemap.xml
git commit -m "chore(public): add CV pdf, robots, sitemap"
```

---

## Task 29: Vitest configuration and test setup

**Files:**
- Create: `vitest.config.ts`, `tests/setup.ts`

- [ ] **Step 1: `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    css: true,
  },
});
```

- [ ] **Step 2: `tests/setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';

// jsdom doesn't implement matchMedia
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}
```

- [ ] **Step 3: Add npm scripts**

Update `package.json` `"scripts"`:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add vitest.config.ts tests/setup.ts package.json
git commit -m "chore(test): configure vitest with jsdom + matchMedia shim"
```

---

## Task 30: Test — theme toggle persistence

**Files:**
- Create: `tests/ThemeToggle.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from '@/components/ThemeToggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('toggles theme and persists preference', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    const btn = screen.getByRole('button');

    await user.click(btn);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('mp-theme')).toBe('dark');

    await user.click(btn);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem('mp-theme')).toBe('light');
  });
});
```

- [ ] **Step 2: Run**

```bash
npm test -- tests/ThemeToggle.test.tsx
```
Expected: PASS (component exists from Task 15).

- [ ] **Step 3: Commit**

```bash
git add tests/ThemeToggle.test.tsx
git commit -m "test: cover ThemeToggle persistence"
```

---

## Task 31: Test — version toggle marks active route

**Files:**
- Create: `tests/VersionToggle.test.tsx`

- [ ] **Step 1: Write the test**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { VersionToggle } from '@/components/VersionToggle';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <VersionToggle />
    </MemoryRouter>,
  );
}

describe('VersionToggle', () => {
  it('marks Agentic active on /', () => {
    renderAt('/');
    expect(screen.getByRole('link', { name: 'Agentic' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Handmade' })).not.toHaveAttribute('aria-current');
  });

  it('marks Handmade active on /handmade', () => {
    renderAt('/handmade');
    expect(screen.getByRole('link', { name: 'Handmade' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Agentic' })).not.toHaveAttribute('aria-current');
  });
});
```

- [ ] **Step 2: Run**

```bash
npm test -- tests/VersionToggle.test.tsx
```
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add tests/VersionToggle.test.tsx
git commit -m "test: cover VersionToggle aria-current on both routes"
```

---

## Task 32: Test — Projects renders all featured cards

**Files:**
- Create: `tests/Projects.test.tsx`

- [ ] **Step 1: Write the test**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Projects } from '@/sections/Projects';
import { projects } from '@/data/projects';

describe('Projects', () => {
  it('renders a card for every featured project', () => {
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>,
    );
    const featured = projects.filter((p) => p.featured);
    for (const p of featured) {
      expect(screen.getByRole('heading', { name: p.title, level: 3 })).toBeInTheDocument();
    }
  });

  it('shows the build-style badges with correct labels', () => {
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>,
    );
    expect(screen.getAllByText('AI-Assisted').length).toBeGreaterThan(0);
    expect(screen.getAllByText('From Scratch').length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run**

```bash
npm test -- tests/Projects.test.tsx
```
Expected: PASS.

- [ ] **Step 3: Run full test suite**

```bash
npm test
```
Expected: all 3 test files pass.

- [ ] **Step 4: Commit**

```bash
git add tests/Projects.test.tsx
git commit -m "test: cover Projects featured render and badges"
```

---

## Task 33: Playwright config and smoke test

**Files:**
- Create: `playwright.config.ts`, `e2e/smoke.spec.ts`

- [ ] **Step 1: `playwright.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run preview -- --port 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
```

- [ ] **Step 2: `e2e/smoke.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

test('homepage loads, theme toggle works, projects visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Peter Elijah Marticio', level: 1 })).toBeVisible();

  // Projects: at least 8 cards visible
  await expect(page.locator('h3').filter({ hasText: 'MemorizeMate' })).toBeVisible();
  await expect(page.locator('h3').filter({ hasText: 'ClassHub' })).toBeVisible();
  await expect(page.locator('h3').filter({ hasText: 'Threaded' })).toBeVisible();

  // Theme toggle flips data-theme
  const initialTheme = await page.locator('html').getAttribute('data-theme');
  await page.getByRole('button', { name: /Switch to (light|dark) theme/ }).click();
  const next = await page.locator('html').getAttribute('data-theme');
  expect(next).not.toBe(initialTheme);

  // /handmade is reachable
  await page.getByRole('link', { name: 'Handmade' }).click();
  await expect(page.getByRole('heading', { name: /Handmade version/i })).toBeVisible();
});
```

- [ ] **Step 3: Build then run smoke**

```bash
npm run build
npm run test:e2e
```
Expected: 1 passed.

- [ ] **Step 4: Commit**

```bash
git add playwright.config.ts e2e/smoke.spec.ts
git commit -m "test(e2e): add playwright smoke for home, theme, navigation"
```

---

## Task 34: README

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write README**

```markdown
# Marticio Portfolio (Agentic Build)

Personal portfolio of Peter Elijah Marticio. This repository contains the **AI-assisted** build of the site. A separately-developed from-scratch version will live at `/handmade`.

## Stack

Vite · React 19 · TypeScript · React Router v7 · Zustand · Framer Motion · CSS Modules · Lucide · Fontsource (Fraunces / Inter / JetBrains Mono).

## Local development

```bash
npm install
npm run dev          # http://localhost:5173
npm test             # vitest unit tests
npm run test:e2e     # playwright smoke
npm run build        # type-check + production build
npm run preview      # serve the production build locally
```

## Project structure

```
src/
  components/   reusable UI primitives
  sections/     home-page sections (Hero, Projects, ...)
  routes/       Home, Handmade, Colophon, NotFound
  data/         typed project/experience/education content
  theme/        tokens.css, GlobalStyles, themeStore
  hooks/        useTheme, usePrefersReducedMotion
public/         cv.pdf, robots.txt, sitemap.xml, favicon
e2e/            playwright tests
tests/          vitest unit tests
docs/           specs, plans, IMAGE-TODO checklist
```

## Editing content

All project/experience/education data lives in `src/data/`. Cards and sections regenerate automatically.

To swap a project's build attribution, change the `buildStyle` field to `'ai-assisted'` or `'from-scratch'`.

## Fork this portfolio

Feel free. MIT licensed. Strip `src/data/*` and `public/cv.pdf` and you have a clean template.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add README"
```

---

## Task 35: Final verification — full build, type-check, lint, test, lighthouse-spot-check

- [ ] **Step 1: Run everything green**

```bash
npm run lint
npm run build
npm test
npm run test:e2e
```
Expected: all pass.

- [ ] **Step 2: Manual visual check on dev server**

```bash
npm run dev
```
Verify:
- Hero renders, all three CTAs work (`Download CV` downloads `cv.pdf`)
- Each project card shows badge; expandable ones expand
- `prefers-reduced-motion: reduce` (toggle in DevTools rendering panel) disables boops and project-card expand animation
- Theme toggle has no flash on hard refresh
- Header is sticky, nav anchors scroll to sections
- `/colophon` and `/handmade` load lazily (visible in Network tab as separate chunks)
- 404 page appears for `/nonexistent`

- [ ] **Step 3: Final commit if any tweaks**

```bash
git add -A
git commit -m "chore: final polish from manual review" --allow-empty
```

---

## Self-Review Notes

**Spec coverage check:** Every spec section has a task — routes (27), folder layout (5/27), visual tokens (6), typography & global (7), no-flash (8), theme store/hooks (9/10), data (11), components (12–16, 21), sections (20, 22–25), pages (26), build (27), CV/robots/sitemap (28), tests (29–33), accessibility (covered inline in 8 inline script, 10 reduced-motion hook, 12 BoopIcon, 14 aria-label, 21 aria-expanded, 25 BoopIcon, 26 NotFound landmarks).

**Performance budget:** Lazy loading is in Task 27; preload preferences for fonts are deferred to the user — the Fontsource imports in `global.css` are tree-shaken to one variable weight per family by Vite's CSS pipeline.

**No placeholders:** All TODOs in the code are intentional, user-fillable items tracked in `docs/IMAGE-TODO.md` (Task 5).

**Type consistency:** `BuildStyle`, `Project`, `Experience`, `Education` types are declared in Task 11 and used unchanged by Tasks 14, 21, 22, 23, 24.
