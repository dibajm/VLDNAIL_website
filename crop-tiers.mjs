/**
 * Crop tier example images into individual nail photos.
 *
 * HOW TO USE:
 *   1. Save each tier image from the chat to your Desktop:
 *        tier1.png  (Tier 1 example image)
 *        tier2.png  (Tier 2 example image)
 *        tier3.png  (Tier 3 example image)
 *        tier4.png  (Tier 4 example image)
 *
 *   2. Open a terminal in this folder and run:
 *        node crop-tiers.mjs
 *
 *   3. 24 cropped images will appear in:
 *        frontend/VLDNAIL/src/assets/gallery/
 */

import { createRequire } from "module";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Install sharp if needed
try {
  createRequire(import.meta.url)("sharp");
} catch {
  console.log("Installing sharp...");
  execSync("npm install sharp", { cwd: __dirname, stdio: "inherit" });
}

const { default: sharp } = await import("sharp");

// ─── Crop coordinates (original 1728×2304 image) ────────────────────────────
// These divide the 3×2 grid of photos inside each tier collage image.
// Adjust slightly if the crops look off after running.
const ROWS = [
  { y: 400, h: 560 },   // row 1
  { y: 1040, h: 560 },  // row 2
];
const COLS = [
  { x: 58,   w: 492 },  // col 1
  { x: 622,  w: 492 },  // col 2
  { x: 1186, w: 492 },  // col 3
];

const desktopPath = path.join(
  process.env.USERPROFILE || process.env.HOME || "",
  "Desktop"
);

const outDir = path.join(
  __dirname,
  "frontend",
  "VLDNAIL",
  "src",
  "assets",
  "gallery"
);

fs.mkdirSync(outDir, { recursive: true });

const tiers = [1, 2, 3, 4];

for (const tier of tiers) {
  const srcPath = path.join(desktopPath, `tier${tier}.png`);
  if (!fs.existsSync(srcPath)) {
    console.warn(`⚠  ${srcPath} not found — skipping tier ${tier}`);
    continue;
  }

  let photoIndex = 1;
  for (const row of ROWS) {
    for (const col of COLS) {
      const outName = `tier${tier}-${photoIndex}.jpg`;
      const outPath = path.join(outDir, outName);

      await sharp(srcPath)
        .extract({ left: col.x, top: row.y, width: col.w, height: row.h })
        .jpeg({ quality: 90 })
        .toFile(outPath);

      console.log(`✓  ${outName}`);
      photoIndex++;
    }
  }
}

console.log("\n✅ Done! Images saved to frontend/VLDNAIL/src/assets/gallery/");
