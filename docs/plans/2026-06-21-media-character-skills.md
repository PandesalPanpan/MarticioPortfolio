# Plan — Project Media, SVG Character, Skills, Tooltips

Branch: `feat/media-character-skills` → merge to `main` after green tests.
Docker: build + tag `pandesalpanpan/marticioportfolio:1.3.0` (+ `latest`), push.

## Decisions (from grilling)
- **Media:** Threaded + MemorizeMate now; per-project + extensible. Each project may have a
  signature **video** (poster → click → plays in Lightbox) and/or a **screenshot gallery**
  (thumbs → Lightbox). Poster + click-to-play, reduced-motion safe.
- **Character:** hand-coded SVG, black hair, idle blink + interactive wave/boop, reduced-motion
  safe. Head doubles as the header brand mark (replaces "PM").
- **Skills:** grouped Tag chips (Languages / Frameworks / Infra / Data).
- **Tooltips:** curated jargon glossary, site-wide; dotted underline + accessible themed tooltip
  (hover + keyboard focus).
- **Layout:** Hero → Experience → Skills → Projects → Education → Certifications → Contact.
  Nav reordered + Skills item. "Colophon" kept. Prefetch `/handmade` after load.
- **Hero copy:** Caret IMS + Odin explained; Résumé = prominent CTA, CV = subtle.
- **Tests:** full Playwright coverage of all new features.

## Asset map (copied into `public/media/<id>/`)
- threaded/feed.webm (signature) + poster feed.png; gallery: shop/streak/throwbacks.png
- memorizemate/study.mp4 (signature, from clips/09-study.mp4) + poster study.png
  (presentation/shots/desktop-study-front.png); gallery: home/decks/stats/generate.png

## Files
- NEW: `src/data/skills.ts`, `src/data/glossary.ts`, `src/sections/Skills.tsx(+css)`,
  `src/components/Term.tsx(+css)`, `src/components/Avatar.tsx(+css)`,
  `src/components/ProjectMedia.tsx(+css)`, `src/hooks/usePrefetchHandmade.ts`,
  `e2e/features.spec.ts`
- EDIT: `src/data/types.ts` (media/gallery), `src/data/projects.ts`,
  `src/components/Lightbox.tsx(+css)` (video), `src/components/ProjectCard.tsx`,
  `src/components/Header.tsx` (mark + nav), `src/sections/Hero.tsx(+css)`,
  `src/sections/Experience.tsx` (glossary), `src/routes/Home.tsx` (order), `src/App.tsx` (prefetch),
  `docker-compose.yml` (1.3.0)
