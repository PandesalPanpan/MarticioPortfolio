# Portfolio Website — Design Spec

**Date:** 2026-05-31
**Owner:** Peter Elijah Marticio
**Status:** Approved for implementation planning

## Summary

A personal portfolio website at `marticio.tech` (or chosen domain) targeting recruiters as the primary audience, with secondary appeal to fellow developers and freelance clients. The site ships in **two parallel versions**: an AI-assisted build (this spec) and a from-scratch handwritten build (separate effort, same routes app). Users toggle between them in the header. Both versions share the same content and visual system; they differ only in *how they were built*.

This spec covers the **AI-assisted build only**.

## Goals

- Give recruiters a single-scroll surface that surfaces the CV, featured projects, and contact in one motion.
- Be honest about how each project was built (`AI-Assisted` vs `From Scratch` chips).
- Demonstrate craft: typography, accessibility, micro-interactions, performance.
- Leave a clean structural seam so the handwritten version can slot in at `/handmade` later without affecting the agentic build.
- Make project data trivially editable (`projects.ts` is the source of truth).

## Non-Goals

- No backend, no database, no CMS, no auth, no analytics.
- No blog/writing section in v1.
- No contact form.
- No SSR / SSG framework (Next.js, Remix). A Vite SPA is sufficient.
- No CSS framework (Tailwind, etc.) — keeps the eventual handwritten version comparable.
- No internationalization.

## Audience & Tone

Primary: recruiters and hiring managers. Secondary: developers, freelance clients.

Tone: serious craft, calm typography, quiet confidence. Not playful, not theatrical. Honest about AI usage without being defensive.

## Tech Stack

- **Vite + React 19 + TypeScript** (strict mode) — matches the React version used in MemorizeMate
- **React Router v7** for routing
- **Zustand** for the tiny global state (theme only)
- **Framer Motion** for micro-interactions and page transitions
- **CSS Modules + CSS custom properties** for theming (no Tailwind)
- **Lucide React** for icons
- **Fontsource** packages for self-hosted Google Fonts (Fraunces, Inter, JetBrains Mono)
- **Vitest + React Testing Library + Playwright** for tests (light coverage)

No backend. Deployed as a static build (target host TBD by user — Vercel, Netlify, or self-hosted VPS).

## Routes

- `/` — Home (long-scroll: Hero → Projects → Experience → Education → Contact)
- `/handmade` — Placeholder route. Initial state: "from-scratch version under construction" stub with a GitHub source link. Later: swapped for the actual handwritten build, or fronted with an iframe to a separately hosted static build.
- `/colophon` — Meta page explaining the dual-build experiment.
- `*` — 404 in the same theme.

`/handmade` and `/colophon` are lazy-loaded.

## Folder Layout

```
src/
  routes/
    Home.tsx
    Handmade.tsx
    Colophon.tsx
    NotFound.tsx
  sections/             # Hero, Projects, Experience, Education, Contact
  components/           # Button, Card, Tag, BuildBadge, ThemeToggle, VersionToggle, BoopIcon, ProjectCard, Timeline...
  data/
    projects.ts
    experience.ts
    education.ts
  theme/
    tokens.css          # color/spacing/typography custom properties
    GlobalStyles.tsx
    themeStore.ts       # Zustand store
  hooks/
    useTheme.ts
    usePrefersReducedMotion.ts
  assets/               # monogram svg, favicons, og image, screenshots
  App.tsx
  main.tsx
public/
  cv.pdf
  robots.txt
  sitemap.xml
docs/
  IMAGE-TODO.md         # checklist of assets to add later
  superpowers/specs/    # this spec lives here
```

## Visual System

### Palette (independently designed, not inverted)

**Light:**
- Background `#FAF8F5`
- Surface `#FFFFFF`
- Ink `#1A1A1F`
- Muted `#5C5C66`
- Accent (indigo) `#3B3FE4`
- Highlight (amber) `#F2B441`
- AI-Assisted chip (teal) `#0D9488`
- From Scratch chip (slate) `#475569`

**Dark:**
- Background `#0F1117`
- Surface `#161922`
- Ink `#ECECF2`
- Muted `#9CA0AE`
- Accent (periwinkle) `#8B8FFF`
- Highlight `#F4C26C`
- Chip colors lift by ~15% lightness from light mode.

All colors exposed as CSS custom properties on `:root[data-theme="light|dark"]`.

### Typography

- Headings: **Fraunces** (variable serif)
- Body: **Inter** (variable sans)
- Mono: **JetBrains Mono**
- Type scale: 1.250 minor third
- Max content width: 768px (prose), 1100px (project grid)
- `font-display: swap`; preload only Inter 400 and Fraunces 600

### Spacing & Layout

- 4px base grid, custom properties `--space-1` … `--space-16`
- Section padding: `--space-16` desktop, `--space-12` mobile
- Mobile-first responsive, single breakpoint at 768px for grid changes

### Micro-Interactions

- Theme toggle: animated sun/moon morph (Framer)
- Project cards: subtle lift + accent border on hover, no parallax
- Contact icons: "boop" on hover (quick scale + rotate jiggle)
- Inline links: left-to-right wipe underline
- Section fade-in on first scroll into view (once, then static)
- All animations respect `prefers-reduced-motion`

## Content Architecture

### Header (sticky)
- Left: monogram "PM" → links to `/`
- Right: nav (`Projects`, `Experience`, `Colophon`), theme toggle, version toggle (`Agentic | Handmade` — plain `<Link>` between `/` and `/handmade`)

### Hero
- Fraunces headline: "Peter Elijah Marticio"
- Subhead: "Full-Stack Developer · Computer Engineering @ PUP"
- 2-line tagline from CV profile
- CTAs: `View Projects` (anchor), `Download CV` (`/cv.pdf`), `GitHub`
- Honest one-liner near the version toggle: "This is the AI-assisted build. A from-scratch version is in progress — toggle above."

### Featured Projects (2-col desktop, 1-col mobile)

Cards show: title, one-line blurb, tech chips, build-style badge, links (Live / Code). Cards with extra detail expand in-place (`<button aria-expanded>` pattern).

Order:

| # | Project | Build Style |
|---|---|---|
| 1 | MemorizeMate | AI-Assisted |
| 2 | ClassHub | AI-Assisted |
| 3 | Threaded | AI-Assisted |
| 4 | Thesis-RFID-IMS | From Scratch |
| 5 | binary-speed (CS50) | From Scratch |
| 6 | express-inventory-application | From Scratch |
| 7 | jollibee-clone | From Scratch |
| 8 | odin-knights-travails | From Scratch |

"More on GitHub →" link below the grid.

Muted-text legend below the grid:
> *Projects are labeled by build style. AI-Assisted means I used AI tooling (Claude Code, Copilot) as a pair-programmer — I drove the architecture, made the calls, and reviewed everything. From Scratch means no AI was used. Both are mine.*

### Experience
Vertical timeline. Three entries from CV: Caret Solutions (2026–Present), Meta Core Systems (Mar–Aug 2024), NTEK Systems (Aug–Oct 2023). Role, dates, 2 bullet outcomes each.

### Education
Three side-by-side blocks on desktop, stacked on mobile:
- PUP — Bachelor in Computer Engineering (2021–Present)
- The Odin Project — ongoing, link to TOP profile
- CS50 — completed, link to certificate (TODO)

### Contact
Email, LinkedIn, GitHub — icon + label, all "boopable." No form.

### `/colophon` Page (4 sections)

1. **Why two versions of this site exist** (1 paragraph)
2. **What's on this version (AI-Assisted)** — stack, what AI did, what I did, what I rewrote/threw out (specific examples)
3. **What's on the other version (From Scratch)** — same constraints, no AI, status
4. **What stays the same across both** — shared data, both static, both Lighthouse-budgeted

Footer: "Source code: GitHub →"

### `/handmade` Page
Placeholder: single screen, "From-scratch version under construction" + GitHub link.

## Build-Style Tagging System

### Data shape

```ts
type BuildStyle = 'ai-assisted' | 'from-scratch';

type Project = {
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
```

### BuildBadge component

Small chip, top-right of each card. Mono font, lowercase letter-spacing.
- `AI-Assisted` — teal chip
- `From Scratch` — slate chip

Tooltip on hover:
- *AI-Assisted:* "Built with AI pair-programming. Architecture, decisions, and review by me."
- *From Scratch:* "Written by hand, no AI assistance."

No icons, no warnings. Honest disclosure only.

## State

A single Zustand store for theme preference (`light` | `dark` | `system`), persisted to `localStorage`. Everything else is local component state or static imports.

## Theme Implementation

- `<html data-theme="light|dark">` driven by the Zustand store
- All colors via CSS custom properties; no JS color logic in components
- Inline script in `index.html` reads `localStorage` before paint and sets `data-theme` synchronously to prevent flash-of-wrong-theme
- System preference detected via `matchMedia('(prefers-color-scheme: dark)')`

## Accessibility

- Keyboard navigation: all interactive elements reachable; visible `:focus-visible` rings using the accent color
- Color contrast: WCAG AA body text, AAA headings
- `prefers-reduced-motion` honored throughout (Framer animations and boops degrade to opacity or no-op)
- Semantic landmarks: `<header>`, `<main>`, `<nav>`, `<footer>`, `<section aria-labelledby>`
- Project-card expand uses `<button aria-expanded>` not div+onClick
- Meaningful alt text on content images; `alt=""` on decorative

## Performance Budget

- Lighthouse: 95+ Performance, 100 Accessibility, 100 Best Practices
- Initial JS payload < 150 KB gzipped (lazy-load `/colophon` and `/handmade`)
- Images: WebP, `loading="lazy"`, `decoding="async"`, explicit dimensions
- No analytics, no third-party scripts

## Testing (light)

- **Vitest + RTL:** version toggle, theme toggle persistence, featured projects list renders
- **Playwright:** one smoke test — page loads, theme toggle works, all featured cards present
- No coverage-percentage chase

## Assets

### Bundled (`src/assets/`)
- Monogram "PM" SVG (theme-aware via `currentColor`)
- Favicon set
- OG image 1200×630
- Optional decorative grain SVG

### Static (`public/`)
- `cv.pdf` — copied from user's CV
- `robots.txt`, `sitemap.xml`

### Runtime
- Fonts via fontsource (self-hosted)
- Icons via `lucide-react` (tree-shakable)

### Deferred (`docs/IMAGE-TODO.md` checklist)
- Threaded screenshots (3–4, user-provided)
- MemorizeMate screenshots (3–4, user-provided)
- MemorizeMate live URL (when available)
- CS50 certificate link (if available)
- Optional headshot for hero

No paid assets, no copyrighted imagery, no tracking.

## Repository Hygiene

- Conventional commits (`feat:`, `chore:`, `docs:`)
- Single `main` branch
- README documents local dev, build, and a "fork-this-portfolio" section
- MIT license

## Out of Scope (for this build)

- The from-scratch handwritten version (separate effort by user, slotted in at `/handmade` later)
- Custom domain/DNS setup (user's call)
- Hosting deployment configuration (user's call after build)
- Live screenshots and the MemorizeMate URL (added after implementation; tracked in `docs/IMAGE-TODO.md`)

## Success Criteria

- A recruiter landing on `/` can identify role, top projects, experience, and contact within one scroll
- Lighthouse hits the budget above
- Build-style tags are clear without being preachy
- Switching to `/handmade` requires no code changes beyond replacing the route component
- All project data lives in `projects.ts` and is editable without touching components
