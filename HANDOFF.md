# Handoff — SaaS-style "Hire me" redesign

**Branch:** `feat/hire-me-saas-redesign` (branched from `main`)
**Commit:** `d51e3e2` — feat(home): reframe portfolio as a SaaS-style "hire me" landing
**Status:** ✅ build clean · ✅ lint clean · ✅ 17/17 e2e · ✅ 5/5 unit

---

## What changed & why

The old home page read like a résumé: uniform stacked sections, LinkedIn-voice
copy, no CTA. This reframes the **Agentic** home page (`/`) as a client-facing
landing page positioning Peter as a service — inspired by
[otomatesystems.com](https://otomatesystems.com) (numbered service pillars,
metrics-as-proof, low-pressure closing CTA).

The `/handmade` route and the Agentic⇄Handmade version toggle are untouched.

### New page order (`src/routes/Home.tsx`)
`Hero → Services → Proof → Projects → Experience → Skills → WhyMe → Education → Certifications → FinalCta → Contact`

### New files
| File | Purpose |
|------|---------|
| `src/sections/Services.tsx` + `.module.css` | "What I can build for you" — 3 numbered pillars (01 web apps, 02 inventory/POS, 03 deploy/self-host) |
| `src/data/services.ts` | Content for the Services pillars |
| `src/sections/Proof.tsx` + `.module.css` | Full-bleed tinted band: production metrics + employer trust line + OSS link |
| `src/sections/WhyMe.tsx` + `.module.css` | "Why work with me" — 4 trust points |
| `src/sections/FinalCta.tsx` + `.module.css` | Closing "Let's turn it into software that ships" + Hire me / résumé |

### Modified
- **`src/sections/Hero.tsx` / `.module.css`** — value-prop headline ("I build
  software that **runs your business.**"), radial gradient atmosphere layer,
  animated availability badge, name kicker, trust stats, gradient portrait ring,
  **Hire me** primary CTA. Glossary `<Term>` for IMS/VPS preserved.
- **`src/theme/tokens.css`** — added atmosphere system: `--accent-2`,
  `--gradient-brand`, `--glow-1/2`, `--surface-2`, `--border-strong`,
  `--shadow-lg`, `--accent-ink`, `--grid-line` (light + dark).
- **`src/components/Header.tsx` / `.module.css`** — gradient **Hire me** button;
  nav relabelled Services / Work / Why me / Colophon.
- **`e2e/features.spec.ts`, `e2e/smoke.spec.ts`** — updated assertions to the new
  layout (section order, value-prop h1 + name still present, résumé label). The
  OSS link and VPS/IMS glossary assertions were *preserved* by moving those
  elements into the new design rather than deleting the tests.

---

## How to run / verify

```bash
npm run dev            # local dev at :5173
npm run build          # tsc -b + vite build (inlines CSS)
npm test               # vitest unit (5 tests)
npm run test:e2e       # playwright e2e (17 tests) — builds+previews on :4173
```

> ⚠️ Windows note: `vite preview` locks `dist/`. If a rebuild fails with
> `ENOENT dist/index.html` or `Permission denied`, kill stray preview servers:
> `Get-CimInstance Win32_Process -Filter "Name='node.exe'" | ? { $_.CommandLine -match 'preview|4173' } | % { Stop-Process $_.ProcessId -Force }`

---

## Design decisions worth knowing
- **Aesthetic: Linear/Vercel-grade restraint.** First pass leaned on a
  purple→violet gradient + radial glow blobs + heavy em-dash copy, which read as
  generic "AI slop." That was fully reverted. The current look is
  **near-monochrome**: flat colour, no gradients, no glow layers, hairline
  borders, whitespace over decoration, confident Fraunces display type with
  tightened letter-spacing. Reference: linear.app.
- **One accent, tiny doses.** `--accent` (deep indigo `#3538cd` / light
  `#9ea1f0` in dark) is used only for links, the active version toggle, and the
  monogram. Numerals and stats are flat `--ink`.
- **Buttons are solid ink**, not coloured — `background: var(--ink)`,
  `color: var(--on-ink)` (the Vercel move). Secondary = hairline border.
- **No em dashes** anywhere in copy (commas / periods / colons instead).
- **Value prop is the `<h1>`**, not the name — the name lives in a mono kicker
  line just above it (identity/SEO preserved, asserted in smoke test).
- CTAs point to `mailto:petermarticio@gmail.com?subject=Let's build something`.
- **Contact icon fix:** the hand-drawn GitHub/LinkedIn SVGs ignored lucide's
  `size` prop (no width/height) and collapsed; they now map `size`→width/height.
- Metrics in Hero/Proof are sourced from real experience
  (`src/data/experience.ts`): POS 300–500 daily txns, 1,000+ items, 30% faster
  checkout, 500+ txns monitored.

## Open follow-ups (optional)
- Metric claims are honest but rounded — confirm exact figures before publishing.
- Consider a real contact form (currently mailto) if you want lead capture.
- `og.png` / meta description still describe the old framing — update for the
  new "hire me" positioning before sharing.
- Delete this `HANDOFF.md` once merged.
