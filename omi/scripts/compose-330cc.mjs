import sharp from "sharp";
import { fileURLToPath } from "node:url";

const source = fileURLToPath(new URL("../public/images/products/water-300cc.webp", import.meta.url));
const destination = fileURLToPath(new URL("../public/images/products/water-330cc.webp", import.meta.url));

const labelPatch = await sharp(source)
  .extract({ left: 225, top: 218, width: 88, height: 24 })
  .resize(88, 38, { fit: "fill" })
  .toBuffer();

const capacityLabel = Buffer.from(`
  <svg width="88" height="38" xmlns="http://www.w3.org/2000/svg">
    <text x="7" y="25" fill="#080808" font-family="Arial, sans-serif" font-size="18" font-weight="700">330 cc</text>
  </svg>
`);

await sharp(source)
  .composite([
    { input: labelPatch, left: 225, top: 238 },
    { input: capacityLabel, left: 225, top: 238 },
  ])
  .webp({ quality: 96, alphaQuality: 100, lossless: true })
  .toFile(destination);

console.log(destination);
