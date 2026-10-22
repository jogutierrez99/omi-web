import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const candidatesRoot = path.join(
  appRoot,
  "public",
  "images",
  "generated",
  "logo-correction-exact",
);

const assets = [
  {
    candidate: "product-330cc-exact.png",
    destination: ["images", "products", "water-330cc.webp"],
    width: 400,
    height: 600,
  },
  {
    candidate: "product-1-5l-exact.png",
    destination: ["images", "products", "water-1-5l.webp"],
    width: 600,
    height: 750,
  },
  {
    candidate: "product-5l-exact.png",
    destination: ["images", "products", "water-5l.webp"],
    width: 700,
    height: 875,
  },
  {
    candidate: "product-18l-exact.png",
    destination: ["images", "products", "water-18l.webp"],
    width: 900,
    height: 1125,
  },
  {
    candidate: "gallery-330cc-exact.png",
    destination: ["media", "galeria", "omi-330cc.webp"],
    width: 720,
    height: 1280,
  },
  {
    candidate: "gallery-1-5l-exact.png",
    destination: ["media", "galeria", "omi-1-5l.webp"],
    width: 720,
    height: 1280,
  },
  {
    candidate: "gallery-5l-exact.png",
    destination: ["media", "galeria", "omi-5l.webp"],
    width: 720,
    height: 1280,
  },
  {
    candidate: "gallery-18l-exact.png",
    destination: ["media", "galeria", "omi-18l.webp"],
    width: 720,
    height: 1280,
  },
  {
    candidate: "gallery-family-exact.png",
    destination: ["media", "galeria", "omi-familia.webp"],
    width: 1280,
    height: 720,
  },
];

function visiblePixelsMatch(expected, actual) {
  for (let offset = 0; offset < expected.length; offset += 4) {
    if (expected[offset + 3] !== actual[offset + 3]) return false;
    if (expected[offset + 3] === 0) continue;

    for (let channel = 0; channel < 3; channel += 1) {
      if (expected[offset + channel] !== actual[offset + channel]) return false;
    }
  }
  return true;
}

for (const asset of assets) {
  const source = path.join(candidatesRoot, asset.candidate);
  const destination = path.join(appRoot, "public", ...asset.destination);
  const expected = await sharp(source)
    .resize(asset.width, asset.height, {
      fit: "fill",
      kernel: sharp.kernel.lanczos3,
    })
    .ensureAlpha()
    .raw()
    .toBuffer();

  await sharp(source)
    .resize(asset.width, asset.height, {
      fit: "fill",
      kernel: sharp.kernel.lanczos3,
    })
    .webp({ lossless: true, effort: 6, alphaQuality: 100 })
    .toFile(destination);

  const { data: actual, info } = await sharp(destination)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  if (info.width !== asset.width || info.height !== asset.height) {
    throw new Error(
      `${destination}: expected ${asset.width}x${asset.height}, got ${info.width}x${info.height}`,
    );
  }
  if (!visiblePixelsMatch(expected, actual)) {
    throw new Error(`${destination}: lossless pixel verification failed`);
  }

  console.log(`${destination} — ${info.width}x${info.height}; lossless pixel check: PASS`);
}
