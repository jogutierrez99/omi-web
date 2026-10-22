import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(appRoot, "public");
const outputRoot = path.join(publicRoot, "images", "generated", "logo-correction-exact");
const logoPath = path.join(publicRoot, "images", "brand", "omi-logo.png");

const assets = [
  {
    source: ["images", "products", "water-330cc.webp"],
    output: "product-330cc-exact.png",
    marks: [{ left: 118, top: 264, width: 60, height: 67 }],
  },
  {
    source: ["images", "products", "water-1-5l.png"],
    output: "product-1-5l-exact.png",
    marks: [{ left: 396, top: 549, width: 120, height: 143 }],
  },
  {
    source: ["images", "products", "water-5l.png"],
    output: "product-5l-exact.png",
    marks: [{ left: 337, top: 694, width: 152, height: 172 }],
  },
  {
    source: ["images", "products", "water-18l.png"],
    output: "product-18l-exact.png",
    marks: [{ left: 371, top: 693, width: 129, height: 139 }],
  },
  {
    source: ["media", "galeria", "omi-330cc.jpg"],
    output: "gallery-330cc-exact.png",
    marks: [{ left: 212, top: 639, width: 103, height: 122 }],
  },
  {
    source: ["media", "galeria", "omi-1-5l.jpg"],
    output: "gallery-1-5l-exact.png",
    marks: [{ left: 207, top: 498, width: 109, height: 130 }],
  },
  {
    source: ["media", "galeria", "omi-5l.jpg"],
    output: "gallery-5l-exact.png",
    marks: [{ left: 158, top: 634, width: 136, height: 156 }],
  },
  {
    source: ["media", "galeria", "omi-18l.jpg"],
    output: "gallery-18l-exact.png",
    marks: [{ left: 187, top: 634, width: 118, height: 127 }],
  },
  {
    source: ["media", "galeria", "omi-familia.jpg"],
    output: "gallery-family-exact.png",
    marks: [
      { left: 200, top: 503, width: 32, height: 38 },
      { left: 343, top: 358, width: 49, height: 57 },
      { left: 564, top: 389, width: 65, height: 69 },
      { left: 879, top: 363, width: 70, height: 72 },
    ],
  },
];

async function buildOfficialSymbol() {
  const { data, info } = await sharp(logoPath)
    // Complete official symbol, including its antialiased outer edge.
    // Replacing only the cyan pixels leaves the obsolete black geometry visible.
    .extract({ left: 21, top: 21, width: 767, height: 749 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, info };
}

const officialSymbol = await buildOfficialSymbol();
await mkdir(outputRoot, { recursive: true });

function dilateMask(mask, width, height, radius = 2) {
  const dilated = new Uint8Array(mask.length);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!mask[y * width + x]) continue;

      for (let offsetY = -radius; offsetY <= radius; offsetY += 1) {
        for (let offsetX = -radius; offsetX <= radius; offsetX += 1) {
          const targetX = x + offsetX;
          const targetY = y + offsetY;
          if (targetX < 0 || targetX >= width || targetY < 0 || targetY >= height) {
            continue;
          }
          dilated[targetY * width + targetX] = 1;
        }
      }
    }
  }

  return dilated;
}

function sampleBackground(sourcePixels, sourceInfo, mark, mask, localX, localY, direction) {
  const totals = [0, 0, 0, 0];
  let samples = 0;

  for (let yOffset = -2; yOffset <= 2; yOffset += 1) {
    for (let distance = 1; distance <= 5; distance += 1) {
      const x = localX + direction * distance;
      const y = localY + yOffset;
      const globalX = mark.left + x;
      const globalY = mark.top + y;

      if (
        globalX < 0 ||
        globalX >= sourceInfo.width ||
        globalY < 0 ||
        globalY >= sourceInfo.height
      ) {
        continue;
      }

      if (x >= 0 && x < mark.width && y >= 0 && y < mark.height) {
        if (mask[y * mark.width + x]) continue;
      }

      const offset = (globalY * sourceInfo.width + globalX) * 4;
      const luminance =
        sourcePixels[offset] * 0.2126 +
        sourcePixels[offset + 1] * 0.7152 +
        sourcePixels[offset + 2] * 0.0722;
      if (luminance < 45) continue;

      for (let channel = 0; channel < 4; channel += 1) {
        totals[channel] += sourcePixels[offset + channel];
      }
      samples += 1;
    }
  }

  if (samples === 0) return null;
  return totals.map((total) => total / samples);
}

function eraseOldSymbol(sourcePixels, sourceInfo, mark, mask) {
  for (let y = 0; y < mark.height; y += 1) {
    let first = -1;
    let last = -1;

    for (let x = 0; x < mark.width; x += 1) {
      if (!mask[y * mark.width + x]) continue;
      if (first === -1) first = x;
      last = x;
    }

    if (first === -1) continue;

    const leftColor = sampleBackground(
      sourcePixels,
      sourceInfo,
      mark,
      mask,
      first,
      y,
      -1,
    );
    const rightColor = sampleBackground(
      sourcePixels,
      sourceInfo,
      mark,
      mask,
      last,
      y,
      1,
    );
    const fallback = leftColor ?? rightColor;
    if (!fallback) continue;

    for (let x = first; x <= last; x += 1) {
      if (!mask[y * mark.width + x]) continue;

      const progress = last === first ? 0.5 : (x - first) / (last - first);
      const sourceOffset = ((mark.top + y) * sourceInfo.width + mark.left + x) * 4;

      for (let channel = 0; channel < 4; channel += 1) {
        const start = (leftColor ?? fallback)[channel];
        const end = (rightColor ?? fallback)[channel];
        sourcePixels[sourceOffset + channel] = Math.round(
          start + (end - start) * progress,
        );
      }
    }
  }
}

function smoothInpaint(sourcePixels, sourceInfo, mark, mask, iterations = 140) {
  for (let iteration = 0; iteration < iterations; iteration += 1) {
    for (let y = 0; y < mark.height; y += 1) {
      for (let x = 0; x < mark.width; x += 1) {
        if (!mask[y * mark.width + x]) continue;

        const neighbors = [
          [x - 1, y],
          [x + 1, y],
          [x, y - 1],
          [x, y + 1],
        ];
        const totals = [0, 0, 0, 0];
        let count = 0;

        for (const [neighborX, neighborY] of neighbors) {
          const globalX = mark.left + neighborX;
          const globalY = mark.top + neighborY;
          if (
            globalX < 0 ||
            globalX >= sourceInfo.width ||
            globalY < 0 ||
            globalY >= sourceInfo.height
          ) {
            continue;
          }

          const offset = (globalY * sourceInfo.width + globalX) * 4;
          for (let channel = 0; channel < 4; channel += 1) {
            totals[channel] += sourcePixels[offset + channel];
          }
          count += 1;
        }

        if (count === 0) continue;
        const sourceOffset = ((mark.top + y) * sourceInfo.width + mark.left + x) * 4;
        for (let channel = 0; channel < 4; channel += 1) {
          sourcePixels[sourceOffset + channel] = Math.round(totals[channel] / count);
        }
      }
    }
  }
}

function composite(sourcePixels, sourceInfo, overlayPixels, overlayInfo, left, top) {
  for (let y = 0; y < overlayInfo.height; y += 1) {
    for (let x = 0; x < overlayInfo.width; x += 1) {
      const overlayOffset = (y * overlayInfo.width + x) * 4;
      const overlayAlpha = overlayPixels[overlayOffset + 3] / 255;
      if (overlayAlpha === 0) continue;

      const sourceOffset = ((top + y) * sourceInfo.width + left + x) * 4;
      const sourceAlpha = sourcePixels[sourceOffset + 3] / 255;
      const outputAlpha = overlayAlpha + sourceAlpha * (1 - overlayAlpha);

      for (let channel = 0; channel < 3; channel += 1) {
        const overlayValue = overlayPixels[overlayOffset + channel];
        const sourceValue = sourcePixels[sourceOffset + channel];
        sourcePixels[sourceOffset + channel] = Math.round(
          (overlayValue * overlayAlpha + sourceValue * sourceAlpha * (1 - overlayAlpha)) /
            outputAlpha,
        );
      }
      sourcePixels[sourceOffset + 3] = Math.round(outputAlpha * 255);
    }
  }
}

for (const asset of assets) {
  const source = path.join(publicRoot, ...asset.source);
  const { data: sourcePixels, info: sourceInfo } = await sharp(source)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const originalPixels = Buffer.from(sourcePixels);
  const editedRegions = [];

  for (const mark of asset.marks) {
    const { data: oldFootprintPixels } = await sharp(officialSymbol.data, {
      raw: {
        width: officialSymbol.info.width,
        height: officialSymbol.info.height,
        channels: 4,
      },
    })
      .resize(mark.width, mark.height, { fit: "fill", kernel: sharp.kernel.lanczos3 })
      .raw()
      .toBuffer({ resolveWithObject: true });

    const cleanupPadding = Math.max(1, Math.round(mark.width * 0.02));
    const cleanupMark = {
      left: Math.max(0, mark.left - cleanupPadding),
      top: Math.max(0, mark.top - cleanupPadding),
      width:
        Math.min(sourceInfo.width, mark.left + mark.width + cleanupPadding) -
        Math.max(0, mark.left - cleanupPadding),
      height:
        Math.min(sourceInfo.height, mark.top + mark.height + cleanupPadding) -
        Math.max(0, mark.top - cleanupPadding),
    };
    editedRegions.push(cleanupMark);

    const oldMask = new Uint8Array(cleanupMark.width * cleanupMark.height);
    for (let pixel = 0; pixel < oldMask.length; pixel += 1) {
      const localX = pixel % cleanupMark.width;
      const localY = Math.floor(pixel / cleanupMark.width);
      const sourceOffset =
        ((cleanupMark.top + localY) * sourceInfo.width + cleanupMark.left + localX) * 4;
      const luminance =
        sourcePixels[sourceOffset] * 0.2126 +
        sourcePixels[sourceOffset + 1] * 0.7152 +
        sourcePixels[sourceOffset + 2] * 0.0722;
      const isOldDarkInk = sourcePixels[sourceOffset + 3] > 0 && luminance < 105;
      const footprintX = cleanupMark.left + localX - mark.left;
      const footprintY = cleanupMark.top + localY - mark.top;
      const insideFootprint =
        footprintX >= 0 &&
        footprintX < mark.width &&
        footprintY >= 0 &&
        footprintY < mark.height;
      const footprintAlpha = insideFootprint
        ? oldFootprintPixels[(footprintY * mark.width + footprintX) * 4 + 3]
        : 0;
      oldMask[pixel] = footprintAlpha > 2 || isOldDarkInk ? 1 : 0;
    }
    const cleanupMask = dilateMask(oldMask, cleanupMark.width, cleanupMark.height, 2);
    eraseOldSymbol(sourcePixels, sourceInfo, cleanupMark, cleanupMask);
    smoothInpaint(sourcePixels, sourceInfo, cleanupMark, cleanupMask);

    const replacementWidth = mark.width;
    const replacementHeight = mark.height;
    const replacementTop = mark.top;

    const { data: overlayPixels, info: overlayInfo } = await sharp(officialSymbol.data, {
      raw: {
        width: officialSymbol.info.width,
        height: officialSymbol.info.height,
        channels: 4,
      },
    })
      .resize(replacementWidth, replacementHeight, {
        fit: "fill",
        kernel: sharp.kernel.lanczos3,
      })
      .raw()
      .toBuffer({ resolveWithObject: true });

    composite(
      sourcePixels,
      sourceInfo,
      overlayPixels,
      overlayInfo,
      mark.left,
      replacementTop,
    );
  }

  const output = path.join(outputRoot, asset.output);

  let changedOutsideSymbol = 0;
  for (let y = 0; y < sourceInfo.height; y += 1) {
    for (let x = 0; x < sourceInfo.width; x += 1) {
      const insideSymbol = editedRegions.some(
        (mark) =>
          x >= mark.left &&
          x < mark.left + mark.width &&
          y >= mark.top &&
          y < mark.top + mark.height,
      );
      if (insideSymbol) continue;

      const offset = (y * sourceInfo.width + x) * 4;
      for (let channel = 0; channel < 4; channel += 1) {
        if (sourcePixels[offset + channel] !== originalPixels[offset + channel]) {
          changedOutsideSymbol += 1;
          break;
        }
      }
    }
  }

  if (changedOutsideSymbol !== 0) {
    throw new Error(`${asset.output}: ${changedOutsideSymbol} pixels changed outside the symbol`);
  }

  await sharp(sourcePixels, {
    raw: {
      width: sourceInfo.width,
      height: sourceInfo.height,
      channels: 4,
    },
  })
    .png({ compressionLevel: 9 })
    .toFile(output);
  console.log(
    `${output} — ${sourceInfo.width}x${sourceInfo.height}; outside-symbol changes: 0`,
  );
}
