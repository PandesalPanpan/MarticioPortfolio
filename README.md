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
