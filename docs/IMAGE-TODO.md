# Image & Asset TODO

Assets to add after implementation. Drop files into `src/assets/` (bundled) or `public/` (static), then update the data files noted below.

- [ ] Threaded screenshots (3–4) — drop in `src/assets/threaded/`, list filenames in `src/data/projects.ts` under the `threaded` entry's `images` array.
- [ ] MemorizeMate screenshots (3–4) — `src/assets/memorizemate/`, same pattern.
- [x] MemorizeMate live URL — set to `https://memorizemate.marticio.com` in `src/data/projects.ts`.
- [x] CS50 certificate — now in `src/data/certifications.ts` (lightbox). Source PDF: `public/cs50certificate.pdf`.
- [x] TESDA NC II certificate — in `src/data/certifications.ts`. Source PDF: `public/NC_marticio.pdf`.

Certificate images (thumb + full WebP) are generated from the source PDFs with
`npm run gen:certs` and committed under `src/assets/certs/`. Re-run that after
replacing a PDF in `public/`.
- [ ] Optional headshot for hero — drop in `src/assets/`, import in `src/sections/Hero.tsx`.
- [ ] Replace `src/assets/og.png` placeholder with the final OG image (1200×630).
