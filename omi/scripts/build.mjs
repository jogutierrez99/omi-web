import { spawn, spawnSync } from "node:child_process";
import { once } from "node:events";
import { readdir, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const site = require("../src/lib/site.json");
const nextPackage = require.resolve("next/package.json");
const nextCli = join(dirname(nextPackage), require(nextPackage).bin.next);
const sitemapFile = new URL("../public/sitemap.xml", import.meta.url);
const excludedSegments = new Set([
  "api", "admin", "administracion", "private", "privado",
  "auth", "login", "signin", "sign-in", "signup", "sign-up",
]);

async function discoverPages(directory, segments = []) {
  const paths = new Set();
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isFile() && /^page\.(tsx|ts|jsx|js)$/.test(entry.name)) {
      paths.add("/" + segments.join("/"));
    }

    if (!entry.isDirectory() || /^(?:[_.@\[]|\(\.{1,3}\))/.test(entry.name)) continue;

    const group = /^\((.*)\)$/.exec(entry.name);
    const name = group?.[1] ?? entry.name.replace(/^%5f/i, "_");
    if (excludedSegments.has(name.toLowerCase())) continue;

    const childSegments = group ? segments : [...segments, encodeURIComponent(name)];
    for (const path of await discoverPages(join(directory, entry.name), childSegments)) {
      paths.add(path);
    }
  }
  return paths;
}

function htmlAttributes(tag) {
  return Object.fromEntries(
    Array.from(tag.matchAll(/([^\s"'<>/=]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g),
      ([, name, doubleQuoted, singleQuoted, unquoted]) => [
        name.toLowerCase(), doubleQuoted ?? singleQuoted ?? unquoted,
      ]),
  );
}

function blocksIndexing(value = "") {
  return /(?:^|[\s,:])(?:noindex|none)(?=$|[\s,])/i.test(value);
}

async function isIndexable(server, path) {
  const response = await fetch(server + path, {
    redirect: "manual",
    headers: { "User-Agent": "bingbot" },
    signal: AbortSignal.timeout(15_000),
  });
  if (response.status >= 500) {
    throw new Error(`No se pudo verificar ${path}: HTTP ${response.status}`);
  }
  if (response.status !== 200 || !response.headers.get("content-type")?.includes("text/html") ||
    response.headers.has("refresh") || blocksIndexing(response.headers.get("x-robots-tag") ?? "")) {
    await response.body?.cancel();
    return false;
  }

  const head = (await response.text()).split("</head>", 1)[0]
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>|<!--[\s\S]*?-->/gi, "");
  const expected = new URL(path, site.url).href;
  for (const [tag] of head.matchAll(/<(?:meta|link)\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi)) {
    const attributes = htmlAttributes(tag);
    if (attributes["http-equiv"]?.toLowerCase() === "refresh") return false;
    if (/^(robots|[\w-]*bot)$/i.test(attributes.name ?? "") &&
      blocksIndexing(attributes.content)) return false;
    if (attributes.rel?.toLowerCase().split(/\s+/).includes("canonical")) {
      const href = attributes.href?.replaceAll("&amp;", "&").trim();
      if (!href || !URL.canParse(href, expected) || new URL(href, expected).href !== expected) return false;
    }
  }
  return true;
}

function serverAddress(server) {
  return new Promise((resolve, reject) => {
    let output = "";
    const timeout = setTimeout(() => finish(new Error("Next.js no inició a tiempo")), 30_000);

    function finish(error, address) {
      clearTimeout(timeout);
      server.stdout.off("data", readOutput);
      server.off("error", finish);
      server.off("exit", onExit);
      if (error) reject(error);
      else resolve(address);
    }

    function readOutput(chunk) {
      output += chunk;
      const address = output.match(/http:\/\/127\.0\.0\.1:\d+/)?.[0];
      if (address && /Ready in/.test(output)) finish(null, address);
    }

    function onExit(code) {
      finish(new Error(`Next.js terminó antes de poder verificar el sitemap (código ${code})`));
    }

    server.stdout.on("data", readOutput);
    server.once("error", finish);
    server.once("exit", onExit);
  });
}

async function generateSitemap() {
  const paths = await discoverPages(fileURLToPath(new URL("../src/app/", import.meta.url)));
  const server = spawn(process.execPath, [nextCli, "start", "--hostname", "127.0.0.1", "--port", "0"], {
    stdio: ["ignore", "pipe", "inherit"],
    windowsHide: true,
  });
  server.stdout.pipe(process.stdout, { end: false });
  try {
    const address = await serverAddress(server);
    const urls = [];
    for (const path of [...paths].sort()) {
      if (await isIndexable(address, path)) urls.push(new URL(path, site.url).href);
    }
    if (urls.length === 0) throw new Error("El sitemap no contiene páginas indexables");

    // Route segments are percent-encoded before URL creation.
    const entries = urls.map((url) => `  <url><loc>${url}</loc></url>`).join("\n");
    await writeFile(sitemapFile, `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`);
    console.log(`Sitemap generado con ${urls.length} URLs públicas.`);
  } finally {
    if (server.pid && server.exitCode === null && server.signalCode === null) {
      const stopped = once(server, "exit");
      server.kill();
      await stopped;
    }
  }
}

// Remove the previous public asset before Next.js or Vercel snapshots public/.
await rm(sitemapFile, { force: true });
const build = spawnSync(process.execPath, [nextCli, "build", ...process.argv.slice(2)], { stdio: "inherit" });
if (build.error) throw build.error;
if (build.status !== 0) process.exit(build.status ?? 1);
await generateSitemap();
