// Renders the certificate PDFs in /public to compact WebP images committed under
// src/assets/certs. Run once after replacing a source PDF:
//   node scripts/gen-cert-images.mjs
// The browser only ever loads the static WebP files — pdf-to-img and sharp stay
// dev dependencies and never ship to the client.
import { pdf } from 'pdf-to-img';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'src', 'assets', 'certs');

const certs = [
  { id: 'cs50', src: join(root, 'public', 'cs50certificate.pdf') },
  { id: 'tesda', src: join(root, 'public', 'NC_marticio.pdf') },
];

async function firstPage(path, scale) {
  const doc = await pdf(path, { scale });
  for await (const page of doc) return page; // first page only
  throw new Error(`No pages rendered for ${path}`);
}

await mkdir(outDir, { recursive: true });
for (const { id, src } of certs) {
  const png = await firstPage(src, 2.5);
  const full = await sharp(png).webp({ quality: 82 }).toFile(join(outDir, `${id}.webp`));
  const thumb = await sharp(png)
    .resize({ width: 640, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(join(outDir, `${id}-thumb.webp`));
  console.log(`✓ ${id}: ${Math.round(full.size / 1024)} KB full, ${Math.round(thumb.size / 1024)} KB thumb`);
}
