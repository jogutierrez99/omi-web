import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(
  appRoot,
  "public",
  "images",
  "generated",
  "logo-correction-exact",
);

const panels = [
  {
    label: "Referencia oficial",
    source: path.join(appRoot, "public", "images", "brand", "omi-logo.png"),
    extract: { left: 21, top: 21, width: 767, height: 749 },
  },
  {
    label: "Original",
    source: path.join(appRoot, "public", "images", "products", "water-1-5l.png"),
    extract: { left: 396, top: 549, width: 120, height: 143 },
  },
  {
    label: "Corrección anterior",
    source: path.join(
      appRoot,
      "public",
      "images",
      "generated",
      "logo-correction-reviewed",
      "product-1-5l-reviewed.png",
    ),
    extract: { left: 396, top: 549, width: 120, height: 143 },
  },
  {
    label: "Corrección exacta",
    source: path.join(outputRoot, "product-1-5l-exact.png"),
    extract: { left: 396, top: 549, width: 120, height: 143 },
  },
];

const panelWidth = 480;
const panelHeight = 600;
const headingHeight = 64;
const layers = [];

for (const [index, panel] of panels.entries()) {
  const image = await sharp(panel.source)
    .extract(panel.extract)
    .resize(panelWidth, panelHeight - headingHeight, {
      fit: "contain",
      background: "#ffffff",
    })
    .flatten({ background: "#ffffff" })
    .png()
    .toBuffer();

  const heading = Buffer.from(`
    <svg width="${panelWidth}" height="${headingHeight}">
      <rect width="100%" height="100%" fill="#0b1f36"/>
      <text x="50%" y="41" text-anchor="middle"
        font-family="Arial, sans-serif" font-size="24" fill="white">${panel.label}</text>
    </svg>
  `);

  layers.push({ input: heading, left: index * panelWidth, top: 0 });
  layers.push({ input: image, left: index * panelWidth, top: headingHeight });
}

await sharp({
  create: {
    width: panelWidth * panels.length,
    height: panelHeight,
    channels: 3,
    background: "#ffffff",
  },
})
  .composite(layers)
  .png()
  .toFile(path.join(outputRoot, "qa-1-5l-comparison.png"));

const overviewPanels = [
  ["Producto 330 cc", "product-330cc-exact.png"],
  ["Producto 1,5 L", "product-1-5l-exact.png"],
  ["Producto 5 L", "product-5l-exact.png"],
  ["Producto 18 L", "product-18l-exact.png"],
  ["Galería 330 cc", "gallery-330cc-exact.png"],
  ["Galería 1,5 L", "gallery-1-5l-exact.png"],
  ["Galería 5 L", "gallery-5l-exact.png"],
  ["Galería 18 L", "gallery-18l-exact.png"],
  ["Galería familia", "gallery-family-exact.png"],
];
const overviewWidth = 320;
const overviewHeight = 420;
const overviewHeading = 42;
const overviewLayers = [];

for (const [index, [label, filename]] of overviewPanels.entries()) {
  const column = index % 3;
  const row = Math.floor(index / 3);
  const left = column * overviewWidth;
  const top = row * overviewHeight;
  const image = await sharp(path.join(outputRoot, filename))
    .resize(overviewWidth, overviewHeight - overviewHeading, {
      fit: "contain",
      background: "#edf5fb",
    })
    .flatten({ background: "#edf5fb" })
    .png()
    .toBuffer();
  const heading = Buffer.from(`
    <svg width="${overviewWidth}" height="${overviewHeading}">
      <rect width="100%" height="100%" fill="#0b1f36"/>
      <text x="50%" y="28" text-anchor="middle"
        font-family="Arial, sans-serif" font-size="19" fill="white">${label}</text>
    </svg>
  `);

  overviewLayers.push({ input: heading, left, top });
  overviewLayers.push({ input: image, left, top: top + overviewHeading });
}

await sharp({
  create: {
    width: overviewWidth * 3,
    height: overviewHeight * 3,
    channels: 3,
    background: "#edf5fb",
  },
})
  .composite(overviewLayers)
  .png()
  .toFile(path.join(outputRoot, "qa-all-final-overview.png"));
