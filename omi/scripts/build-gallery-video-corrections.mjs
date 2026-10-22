import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(appRoot, "public");
const mediaRoot = path.join(publicRoot, "media", "galeria");
const logoPath = path.join(publicRoot, "images", "brand", "omi-logo.png");

const fallbackFfmpeg = path.join(
  os.homedir(),
  "AppData",
  "Local",
  "Temp",
  "omi-video-tools",
  "node_modules",
  "ffmpeg-static",
  process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg",
);
const ffmpegPath = process.env.FFMPEG_PATH || fallbackFfmpeg;

if (!existsSync(ffmpegPath)) {
  throw new Error(
    `FFmpeg not found at ${ffmpegPath}. Set FFMPEG_PATH to a compatible binary.`,
  );
}

const assets = [
  {
    id: "330cc",
    source: "omi-330cc.mp4",
    output: "omi-330cc-v2.mp4",
    marks: [{ left: 212, top: 639, width: 103, height: 122 }],
  },
  {
    id: "1-5l",
    source: "omi-1-5l.mp4",
    output: "omi-1-5l-v2.mp4",
    marks: [{ left: 207, top: 498, width: 109, height: 130 }],
  },
  {
    id: "5l",
    source: "omi-5l.mp4",
    output: "omi-5l-v2.mp4",
    marks: [{ left: 158, top: 634, width: 136, height: 156 }],
  },
  {
    id: "18l",
    source: "omi-18l.mp4",
    output: "omi-18l-v2.mp4",
    marks: [{ left: 187, top: 634, width: 118, height: 127 }],
  },
  {
    id: "familia",
    source: "omi-familia.mp4",
    output: "omi-familia-v2.mp4",
    marks: [
      { left: 200, top: 503, width: 32, height: 38 },
      { left: 343, top: 358, width: 49, height: 57 },
      { left: 564, top: 389, width: 65, height: 69 },
      { left: 879, top: 363, width: 70, height: 72 },
    ],
  },
];

function run(binary, args, label) {
  const result = spawnSync(binary, args, {
    cwd: appRoot,
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });

  if (result.status !== 0) {
    throw new Error(
      `${label} failed (${result.status ?? "no exit code"})\n${result.stderr || result.stdout}`,
    );
  }
}

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

const { data: officialSymbol, info: officialInfo } = await sharp(logoPath)
  .extract({ left: 21, top: 21, width: 767, height: 749 })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), "omi-gallery-video-"));

try {
  for (const asset of assets) {
    const sourceVideo = path.join(mediaRoot, asset.source);
    const referenceFrame = path.join(temporaryRoot, `${asset.id}-frame-30.png`);

    run(
      ffmpegPath,
      [
        "-y",
        "-hide_banner",
        "-loglevel",
        "error",
        "-i",
        sourceVideo,
        "-vf",
        "select=eq(n\\,30)",
        "-fps_mode",
        "vfr",
        "-frames:v",
        "1",
        referenceFrame,
      ],
      `${asset.id}: reference-frame extraction`,
    );

    const { data: originalPixels, info: sourceInfo } = await sharp(referenceFrame)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const correctedPixels = Buffer.from(originalPixels);
    const editedRegions = [];

    for (const mark of asset.marks) {
      const { data: footprintPixels } = await sharp(officialSymbol, {
        raw: {
          width: officialInfo.width,
          height: officialInfo.height,
          channels: 4,
        },
      })
        .resize(mark.width, mark.height, {
          fit: "fill",
          kernel: sharp.kernel.lanczos3,
        })
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
          correctedPixels[sourceOffset] * 0.2126 +
          correctedPixels[sourceOffset + 1] * 0.7152 +
          correctedPixels[sourceOffset + 2] * 0.0722;
        const isOldDarkInk = correctedPixels[sourceOffset + 3] > 0 && luminance < 105;
        const footprintX = cleanupMark.left + localX - mark.left;
        const footprintY = cleanupMark.top + localY - mark.top;
        const insideFootprint =
          footprintX >= 0 &&
          footprintX < mark.width &&
          footprintY >= 0 &&
          footprintY < mark.height;
        const footprintAlpha = insideFootprint
          ? footprintPixels[(footprintY * mark.width + footprintX) * 4 + 3]
          : 0;
        oldMask[pixel] = footprintAlpha > 2 || isOldDarkInk ? 1 : 0;
      }

      const cleanupMask = dilateMask(oldMask, cleanupMark.width, cleanupMark.height, 2);
      eraseOldSymbol(correctedPixels, sourceInfo, cleanupMark, cleanupMask);
      smoothInpaint(correctedPixels, sourceInfo, cleanupMark, cleanupMask);
      composite(
        correctedPixels,
        sourceInfo,
        footprintPixels,
        { width: mark.width, height: mark.height },
        mark.left,
        mark.top,
      );
    }

    const changedMask = new Uint8Array(sourceInfo.width * sourceInfo.height);
    let changedPixels = 0;
    let outsideChanges = 0;

    for (let y = 0; y < sourceInfo.height; y += 1) {
      for (let x = 0; x < sourceInfo.width; x += 1) {
        const offset = (y * sourceInfo.width + x) * 4;
        let changed = false;
        for (let channel = 0; channel < 4; channel += 1) {
          if (originalPixels[offset + channel] !== correctedPixels[offset + channel]) {
            changed = true;
            break;
          }
        }
        if (!changed) continue;

        const pixel = y * sourceInfo.width + x;
        changedMask[pixel] = 1;
        changedPixels += 1;
        const insideEditedRegion = editedRegions.some(
          (region) =>
            x >= region.left &&
            x < region.left + region.width &&
            y >= region.top &&
            y < region.top + region.height,
        );
        if (!insideEditedRegion) outsideChanges += 1;
      }
    }

    if (outsideChanges !== 0) {
      throw new Error(`${asset.id}: ${outsideChanges} pixels changed outside symbol regions`);
    }

    const haloOne = dilateMask(changedMask, sourceInfo.width, sourceInfo.height, 1);
    const haloTwo = dilateMask(changedMask, sourceInfo.width, sourceInfo.height, 2);
    const overlayPixels = Buffer.alloc(sourceInfo.width * sourceInfo.height * 4);

    for (let pixel = 0; pixel < changedMask.length; pixel += 1) {
      const offset = pixel * 4;
      const alpha = changedMask[pixel]
        ? 255
        : haloOne[pixel]
          ? 160
          : haloTwo[pixel]
            ? 64
            : 0;
      if (alpha === 0) continue;
      overlayPixels[offset] = correctedPixels[offset];
      overlayPixels[offset + 1] = correctedPixels[offset + 1];
      overlayPixels[offset + 2] = correctedPixels[offset + 2];
      overlayPixels[offset + 3] = alpha;
    }

    const overlayPath = path.join(temporaryRoot, `${asset.id}-overlay.png`);
    await sharp(overlayPixels, {
      raw: {
        width: sourceInfo.width,
        height: sourceInfo.height,
        channels: 4,
      },
    })
      .png({ compressionLevel: 9 })
      .toFile(overlayPath);

    const outputVideo = path.join(mediaRoot, asset.output);
    run(
      ffmpegPath,
      [
        "-y",
        "-hide_banner",
        "-loglevel",
        "error",
        "-i",
        sourceVideo,
        "-loop",
        "1",
        "-framerate",
        "30",
        "-i",
        overlayPath,
        "-filter_complex",
        "[0:v]format=rgba[base];[base][1:v]overlay=0:0:shortest=1:format=auto,format=yuv420p[v]",
        "-map",
        "[v]",
        "-an",
        "-t",
        "8",
        "-r",
        "30",
        "-fps_mode",
        "cfr",
        "-c:v",
        "libx264",
        "-preset",
        "slow",
        "-crf",
        "16",
        "-profile:v",
        "high",
        "-level:v",
        "3.1",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        outputVideo,
      ],
      `${asset.id}: corrected-video encoding`,
    );

    console.log(
      `${asset.output}: ${sourceInfo.width}x${sourceInfo.height}; ${changedPixels} corrected pixels; outside changes: 0`,
    );
  }
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
