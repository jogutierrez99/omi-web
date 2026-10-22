import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(appRoot, "public");
const mediaRoot = path.join(publicRoot, "media", "galeria");
const qaRoot = path.join(
  appRoot,
  "docs",
  "ai-kit",
  "evals",
  "gallery-video-correction",
);

const toolsRoot = path.join(
  os.homedir(),
  "AppData",
  "Local",
  "Temp",
  "omi-video-tools",
  "node_modules",
);
const ffmpegPath =
  process.env.FFMPEG_PATH ||
  path.join(toolsRoot, "ffmpeg-static", process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg");
const ffprobePath =
  process.env.FFPROBE_PATH ||
  path.join(
    toolsRoot,
    "ffprobe-static",
    "bin",
    process.platform === "win32" ? "win32" : process.platform,
    process.arch === "x64" ? "x64" : process.arch,
    process.platform === "win32" ? "ffprobe.exe" : "ffprobe",
  );

for (const [label, binary] of [
  ["FFmpeg", ffmpegPath],
  ["FFprobe", ffprobePath],
]) {
  if (!existsSync(binary)) {
    throw new Error(`${label} not found at ${binary}`);
  }
}

const samples = [0, 30, 120, 225];
const assets = [
  {
    id: "330cc",
    original: "omi-330cc.mp4",
    candidate: "omi-330cc-v2.mp4",
    poster: "omi-330cc.webp",
    width: 720,
    height: 1280,
    marks: [{ left: 212, top: 639, width: 103, height: 122 }],
  },
  {
    id: "1-5l",
    original: "omi-1-5l.mp4",
    candidate: "omi-1-5l-v2.mp4",
    poster: "omi-1-5l.webp",
    width: 720,
    height: 1280,
    marks: [{ left: 207, top: 498, width: 109, height: 130 }],
  },
  {
    id: "5l",
    original: "omi-5l.mp4",
    candidate: "omi-5l-v2.mp4",
    poster: "omi-5l.webp",
    width: 720,
    height: 1280,
    marks: [{ left: 158, top: 634, width: 136, height: 156 }],
  },
  {
    id: "18l",
    original: "omi-18l.mp4",
    candidate: "omi-18l-v2.mp4",
    poster: "omi-18l.webp",
    width: 720,
    height: 1280,
    marks: [{ left: 187, top: 634, width: 118, height: 127 }],
  },
  {
    id: "familia",
    original: "omi-familia.mp4",
    candidate: "omi-familia-v2.mp4",
    poster: "omi-familia.webp",
    width: 1280,
    height: 720,
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
  return result.stdout;
}

function parseTopLevelAtoms(file) {
  const buffer = readFileSync(file);
  const atoms = [];
  let offset = 0;
  while (offset + 8 <= buffer.length) {
    let size = buffer.readUInt32BE(offset);
    const type = buffer.toString("ascii", offset + 4, offset + 8);
    if (size === 1) size = Number(buffer.readBigUInt64BE(offset + 8));
    else if (size === 0) size = buffer.length - offset;
    if (size < 8 || offset + size > buffer.length) break;
    atoms.push(type);
    offset += size;
  }
  return atoms;
}

function contains(region, x, y, padding = 0) {
  return (
    x >= region.left - padding &&
    x < region.left + region.width + padding &&
    y >= region.top - padding &&
    y < region.top + region.height + padding
  );
}

function percentileFromHistogram(histogram, count, percentile) {
  const target = Math.ceil(count * percentile);
  let seen = 0;
  for (let value = 0; value < histogram.length; value += 1) {
    seen += histogram[value];
    if (seen >= target) return value;
  }
  return histogram.length - 1;
}

function compareOutside(original, candidate, width, height, marks, padding) {
  const histogram = new Uint32Array(256);
  let count = 0;
  let absolute = 0;
  let squared = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (marks.some((mark) => contains(mark, x, y, padding))) continue;
      const offset = (y * width + x) * 3;
      for (let channel = 0; channel < 3; channel += 1) {
        const difference = Math.abs(original[offset + channel] - candidate[offset + channel]);
        histogram[difference] += 1;
        absolute += difference;
        squared += difference * difference;
        count += 1;
      }
    }
  }

  const mae = absolute / count;
  const rmse = Math.sqrt(squared / count);
  const psnr = rmse === 0 ? Number.POSITIVE_INFINITY : 20 * Math.log10(255 / rmse);
  return {
    mae,
    p99: percentileFromHistogram(histogram, count, 0.99),
    psnr,
  };
}

function compareSeam(original, candidate, width, height, marks) {
  const histogram = new Uint32Array(256);
  let count = 0;
  let absolute = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const inOuter = marks.some((mark) => contains(mark, x, y, 7));
      const inInner = marks.some((mark) => contains(mark, x, y, 3));
      if (!inOuter || inInner) continue;
      const offset = (y * width + x) * 3;
      for (let channel = 0; channel < 3; channel += 1) {
        const difference = Math.abs(original[offset + channel] - candidate[offset + channel]);
        histogram[difference] += 1;
        absolute += difference;
        count += 1;
      }
    }
  }

  return {
    mae: absolute / count,
    p99: percentileFromHistogram(histogram, count, 0.99),
  };
}

function luminance(data, offset) {
  return data[offset] * 0.2126 + data[offset + 1] * 0.7152 + data[offset + 2] * 0.0722;
}

function cropSsim(reference, candidate, frameWidth, mark) {
  const referenceValues = [];
  const candidateValues = [];

  for (let y = mark.top; y < mark.top + mark.height; y += 1) {
    for (let x = mark.left; x < mark.left + mark.width; x += 1) {
      const offset = (y * frameWidth + x) * 3;
      referenceValues.push(luminance(reference, offset));
      candidateValues.push(luminance(candidate, offset));
    }
  }

  const count = referenceValues.length;
  const meanReference = referenceValues.reduce((sum, value) => sum + value, 0) / count;
  const meanCandidate = candidateValues.reduce((sum, value) => sum + value, 0) / count;
  let varianceReference = 0;
  let varianceCandidate = 0;
  let covariance = 0;

  for (let index = 0; index < count; index += 1) {
    const referenceDelta = referenceValues[index] - meanReference;
    const candidateDelta = candidateValues[index] - meanCandidate;
    varianceReference += referenceDelta * referenceDelta;
    varianceCandidate += candidateDelta * candidateDelta;
    covariance += referenceDelta * candidateDelta;
  }

  varianceReference /= Math.max(1, count - 1);
  varianceCandidate /= Math.max(1, count - 1);
  covariance /= Math.max(1, count - 1);
  const c1 = (0.01 * 255) ** 2;
  const c2 = (0.03 * 255) ** 2;
  return (
    ((2 * meanReference * meanCandidate + c1) * (2 * covariance + c2)) /
    ((meanReference ** 2 + meanCandidate ** 2 + c1) *
      (varianceReference + varianceCandidate + c2))
  );
}

function isCyan(data, offset) {
  const red = data[offset];
  const green = data[offset + 1];
  const blue = data[offset + 2];
  return blue >= 120 && green >= 85 && blue - red >= 45 && green - red >= 15;
}

function cyanRetention(reference, candidate, frameWidth, mark) {
  let referenceCyan = 0;
  let retained = 0;
  const zones = {
    left: [0, 0],
    right: [0, 0],
    bottom: [0, 0],
  };

  for (let localY = 0; localY < mark.height; localY += 1) {
    for (let localX = 0; localX < mark.width; localX += 1) {
      const x = mark.left + localX;
      const y = mark.top + localY;
      const offset = (y * frameWidth + x) * 3;
      if (!isCyan(reference, offset)) continue;
      const candidateIsCyan = isCyan(candidate, offset);
      referenceCyan += 1;
      if (candidateIsCyan) retained += 1;

      const zoneNames = [];
      if (localX < mark.width * 0.45) zoneNames.push("left");
      if (localX > mark.width * 0.55) zoneNames.push("right");
      if (localY > mark.height * 0.62) zoneNames.push("bottom");
      for (const zoneName of zoneNames) {
        zones[zoneName][0] += 1;
        if (candidateIsCyan) zones[zoneName][1] += 1;
      }
    }
  }

  return {
    referenceCyan,
    total: referenceCyan ? retained / referenceCyan : 0,
    zones: Object.fromEntries(
      Object.entries(zones).map(([name, [expected, matched]]) => [
        name,
        expected ? matched / expected : 0,
      ]),
    ),
  };
}

async function rawRgb(file) {
  return sharp(file).removeAlpha().raw().toBuffer();
}

async function createTimeline(asset, candidateFrames) {
  const cellWidth = asset.width > asset.height ? 320 : 220;
  const cellHeight = Math.round((cellWidth * asset.height) / asset.width);
  const headingHeight = 34;
  const composites = [];

  for (const [index, frame] of candidateFrames.entries()) {
    const frameBuffer = await sharp(frame).resize({ width: cellWidth }).png().toBuffer();
    const heading = Buffer.from(`
      <svg width="${cellWidth}" height="${headingHeight}">
        <rect width="100%" height="100%" fill="#061643"/>
        <text x="50%" y="23" text-anchor="middle" font-family="Arial" font-size="16" fill="white">frame ${samples[index]}</text>
      </svg>
    `);
    composites.push({ input: heading, left: index * cellWidth, top: 0 });
    composites.push({ input: frameBuffer, left: index * cellWidth, top: headingHeight });
  }

  await sharp({
    create: {
      width: cellWidth * samples.length,
      height: cellHeight + headingHeight,
      channels: 3,
      background: "#edf5fb",
    },
  })
    .composite(composites)
    .png({ compressionLevel: 9 })
    .toFile(path.join(qaRoot, `${asset.id}-timeline.png`));
}

async function createLogoTimeline(asset, candidateFrames) {
  const cell = 220;
  const headingHeight = 30;
  const composites = [];

  for (const [row, mark] of asset.marks.entries()) {
    const padding = 5;
    const extract = {
      left: Math.max(0, mark.left - padding),
      top: Math.max(0, mark.top - padding),
      width:
        Math.min(asset.width, mark.left + mark.width + padding) -
        Math.max(0, mark.left - padding),
      height:
        Math.min(asset.height, mark.top + mark.height + padding) -
        Math.max(0, mark.top - padding),
    };

    for (const [column, frame] of candidateFrames.entries()) {
      const crop = await sharp(frame)
        .extract(extract)
        .resize(cell, cell - headingHeight, {
          fit: "contain",
          background: "#ffffff",
          kernel: sharp.kernel.nearest,
        })
        .png()
        .toBuffer();
      const heading = Buffer.from(`
        <svg width="${cell}" height="${headingHeight}">
          <rect width="100%" height="100%" fill="#061643"/>
          <text x="50%" y="21" text-anchor="middle" font-family="Arial" font-size="15" fill="white">logo ${row + 1} · f${samples[column]}</text>
        </svg>
      `);
      composites.push({ input: heading, left: column * cell, top: row * cell });
      composites.push({ input: crop, left: column * cell, top: row * cell + headingHeight });
    }
  }

  await sharp({
    create: {
      width: cell * samples.length,
      height: cell * asset.marks.length,
      channels: 3,
      background: "#ffffff",
    },
  })
    .composite(composites)
    .png({ compressionLevel: 9 })
    .toFile(path.join(qaRoot, `${asset.id}-logos.png`));
}

await mkdir(qaRoot, { recursive: true });
const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), "omi-gallery-video-qa-"));
const report = [];

try {
  for (const asset of assets) {
    const originalVideo = path.join(mediaRoot, asset.original);
    const candidateVideo = path.join(mediaRoot, asset.candidate);
    const correctedReference = path.join(mediaRoot, asset.poster);

    const probe = JSON.parse(
      run(
        ffprobePath,
        [
          "-v",
          "error",
          "-show_entries",
          "stream=index,codec_name,profile,pix_fmt,width,height,r_frame_rate,avg_frame_rate,duration,nb_frames,codec_type",
          "-show_entries",
          "format=duration,size",
          "-of",
          "json",
          candidateVideo,
        ],
        `${asset.id}: ffprobe`,
      ),
    );

    const videoStreams = probe.streams.filter((stream) => stream.codec_type === "video");
    const audioStreams = probe.streams.filter((stream) => stream.codec_type === "audio");
    const video = videoStreams[0];
    const structuralPass =
      videoStreams.length === 1 &&
      audioStreams.length === 0 &&
      video.codec_name === "h264" &&
      video.profile === "High" &&
      video.pix_fmt === "yuv420p" &&
      video.width === asset.width &&
      video.height === asset.height &&
      video.r_frame_rate === "30/1" &&
      video.avg_frame_rate === "30/1" &&
      Number(video.duration) === 8 &&
      Number(video.nb_frames) === 240 &&
      Number(probe.format.duration) === 8;

    const atoms = parseTopLevelAtoms(candidateVideo);
    const faststartPass = atoms.indexOf("moov") > -1 && atoms.indexOf("moov") < atoms.indexOf("mdat");
    if (!structuralPass || !faststartPass) {
      throw new Error(`${asset.id}: structural video validation failed`);
    }

    const originalFrames = [];
    const candidateFrames = [];
    for (const frame of samples) {
      const originalFrame = path.join(temporaryRoot, `${asset.id}-old-${frame}.png`);
      const candidateFrame = path.join(temporaryRoot, `${asset.id}-new-${frame}.png`);
      for (const [videoPath, outputPath, label] of [
        [originalVideo, originalFrame, "old"],
        [candidateVideo, candidateFrame, "new"],
      ]) {
        run(
          ffmpegPath,
          [
            "-y",
            "-hide_banner",
            "-loglevel",
            "error",
            "-i",
            videoPath,
            "-vf",
            `select=eq(n\\,${frame})`,
            "-fps_mode",
            "vfr",
            "-frames:v",
            "1",
            outputPath,
          ],
          `${asset.id}: ${label} frame ${frame}`,
        );
      }
      originalFrames.push(originalFrame);
      candidateFrames.push(candidateFrame);
    }

    const referencePixels = await rawRgb(correctedReference);
    const frameReports = [];
    for (const [index, frame] of samples.entries()) {
      const originalPixels = await rawRgb(originalFrames[index]);
      const candidatePixels = await rawRgb(candidateFrames[index]);
      const outside = compareOutside(
        originalPixels,
        candidatePixels,
        asset.width,
        asset.height,
        asset.marks,
        8,
      );
      const seam = compareSeam(
        originalPixels,
        candidatePixels,
        asset.width,
        asset.height,
        asset.marks,
      );
      const logos = asset.marks.map((mark) => ({
        ssim: cropSsim(referencePixels, candidatePixels, asset.width, mark),
        cyan: cyanRetention(referencePixels, candidatePixels, asset.width, mark),
      }));

      if (outside.mae > 2.5 || outside.p99 > 12 || outside.psnr < 38) {
        throw new Error(`${asset.id} frame ${frame}: outside-mask quality regression`);
      }
      if (seam.mae > 2.5 || seam.p99 > 12) {
        throw new Error(`${asset.id} frame ${frame}: visible seam risk`);
      }
      for (const [logoIndex, logo] of logos.entries()) {
        if (logo.ssim < 0.94 || logo.cyan.total < 0.55) {
          throw new Error(`${asset.id} frame ${frame} logo ${logoIndex + 1}: logo QA failed`);
        }
      }

      frameReports.push({ frame, outside, seam, logos });
    }

    await createTimeline(asset, candidateFrames);
    await createLogoTimeline(asset, candidateFrames);
    report.push({
      id: asset.id,
      bytes: Number(probe.format.size),
      atoms,
      frames: frameReports,
    });
    console.log(
      `${asset.candidate}: PASS; ${(Number(probe.format.size) / 1024).toFixed(1)} KiB; ` +
        `outside MAE ${Math.max(...frameReports.map((item) => item.outside.mae)).toFixed(3)}; ` +
        `min logo SSIM ${Math.min(...frameReports.flatMap((item) => item.logos.map((logo) => logo.ssim))).toFixed(4)}`,
    );
  }

  const totalBytes = report.reduce((sum, asset) => sum + asset.bytes, 0);
  console.log(`TOTAL: ${(totalBytes / 1024 / 1024).toFixed(2)} MiB`);
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
