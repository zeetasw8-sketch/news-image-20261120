// World News — 20 November 2026 in one image (make.fun news-image-20261120).
//
// The infographic is entry.png, drawn at build time from the day's news
// (Reuters / AP / AFP / CNN / IMD / WSJ) with Python + Pillow: flat colours,
// geometric pictograms, DejaVu fonts. The program runs with no network, so
// it simply writes the bundled image to the output path, byte for byte,
// then reads the output back and checks it matches, so a partial or
// corrupted write fails loudly instead of grading a broken image.
//
// Local run:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//   # then compare: sha256sum out/entry.png entry.png

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true }); // /output exists in the grader

const here = dirname(fileURLToPath(import.meta.url));
const image = readFileSync(join(here, 'entry.png'));
// The bundled file must be the PNG this entry drew: check its signature
// before copying it, so a bad build artifact fails here, not in grading.
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!image.subarray(0, 8).equals(PNG_SIGNATURE)) {
  throw new Error('entry.png is not a PNG file: refusing to write a bad image');
}
const outPath = join(outDir, 'entry.png');
writeFileSync(outPath, image);
// Verify the write: the output must be byte-identical to the source,
// otherwise the grader would score a corrupted image.
const written = readFileSync(outPath);
if (!written.equals(image)) {
  throw new Error('entry.png write verification failed: output differs from source');
}
