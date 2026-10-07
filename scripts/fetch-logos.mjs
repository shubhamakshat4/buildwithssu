#!/usr/bin/env node
/**
 * npm run logos
 * Downloads each company's icon (via Google's favicon service) into
 * public/logos/<slug>.png and writes src/data/logos.generated.json listing
 * the ones that succeeded. Commit both — the site never hot-links logos.
 * Re-run after adding companies to src/data/companies.ts.
 * To use a hand-picked logo instead, drop public/logos/<slug>.png (or .svg) in
 * and add it to the JSON manually.
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(
  path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1")),
  "..",
);
const src = fs.readFileSync(path.join(root, "src/data/companies.ts"), "utf8");

// Light parse of the COMPANY_DOMAINS object literal.
const domains = {};
for (const m of src.matchAll(/^\s*(?:"([^"]+)"|([A-Za-z0-9_$]+)):\s*"([^"]+)",/gm)) {
  domains[m[1] ?? m[2]] = m[3];
}

const slug = (name) =>
  name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const outDir = path.join(root, "public/logos");
fs.mkdirSync(outDir, { recursive: true });

/** Returns { w, ext } for PNG / JPEG / WebP / ICO, or w = 0 if unrecognised. */
function inspect(buf) {
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47)
    return { w: buf.readUInt32BE(16), ext: "png" };
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    // walk JPEG segments to the SOF marker
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) return { w: 0, ext: "jpg" };
      const marker = buf[i + 1];
      const len = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xc3) return { w: buf.readUInt16BE(i + 7), ext: "jpg" };
      i += 2 + len;
    }
    return { w: 0, ext: "jpg" };
  }
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP")
    return { w: 64, ext: "webp" }; // size not parsed; gstatic only returns WebP for real icons
  if (buf.length > 22 && buf.readUInt32BE(0) === 0x00000100) {
    let w = 0;
    for (let k = 0; k < buf.readUInt16LE(4); k++) w = Math.max(w, buf[6 + 16 * k] || 256);
    return { w, ext: "ico" };
  }
  return { w: 0, ext: "bin" };
}

const manifest = {};
const failed = [];
const entries = Object.entries(domains);

// Sequential on purpose — the favicon service throttles bursts.
for (const [name, domain] of entries) {
  await (async () => {
    const s = slug(name);
    const host = domain.split(".").length > 2 ? domain : `www.${domain}`;
    const candidates = [
      ...[`https://${host}`, `https://${domain}`, `http://${domain}`].map(
        (u) =>
          `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=128&url=${encodeURIComponent(u)}`,
      ),
      `https://${host}/apple-touch-icon.png`,
      `https://${domain}/apple-touch-icon.png`,
      `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    ];
    let best = null;
    for (const url of candidates) {
      try {
        const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(15000) });
        const buf = Buffer.from(await res.arrayBuffer());
        const { w, ext } = inspect(buf);
        if (res.ok && w >= 32 && (!best || w > best.w)) best = { buf, w, ext };
        if (best?.w >= 64) break;
      } catch {
        /* try next */
      }
    }
    if (best) {
      fs.writeFileSync(path.join(outDir, `${s}.${best.ext}`), best.buf);
      manifest[s] = { src: `/logos/${s}.${best.ext}`, size: best.w };
    } else {
      failed.push(`${name} (${domain})`);
    }
  })();
  await new Promise((r) => setTimeout(r, 150));
}

// Last resort: official brand marks from simple-icons (CC0), rendered as SVG files.
const SIMPLE_ICON_FALLBACK = { "Axis Bank": "axisbank", BigBasket: "bigbasket", "TCS iON": "tata" };
const si = await import("simple-icons");
const bySlug = new Map(
  Object.values(si)
    .filter((x) => x?.slug)
    .map((i) => [i.slug, i]),
);
for (const [name, iconSlug] of Object.entries(SIMPLE_ICON_FALLBACK)) {
  const s = slug(name);
  const icon = bySlug.get(iconSlug);
  if (manifest[s] || !icon) continue;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 -3 30 30"><path fill="#${icon.hex}" d="${icon.path}"/></svg>\n`;
  fs.writeFileSync(path.join(outDir, `${s}.svg`), svg);
  manifest[s] = { src: `/logos/${s}.svg`, size: 128 };
  const i = failed.findIndex((f) => f.startsWith(`${name} (`));
  if (i >= 0) failed.splice(i, 1);
}

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(
  path.join(root, "src/data/logos.generated.json"),
  JSON.stringify(sorted, null, 2) + "\n",
);
console.log(
  `✓ ${Object.keys(manifest).length} logos saved to public/logos (${entries.length} companies)`,
);
if (failed.length) console.log("✗ monogram fallback for:\n  " + failed.join("\n  "));
