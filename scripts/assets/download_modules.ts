import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve(__dirname, "../raw-extracts/modules");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const visited = new Set<string>();
const toDownload = ["https://framerusercontent.com/sites/5MeOyhWZ1lHds7fz7oT6Xp/script_main.CbfPLTEo.mjs"];

async function download(url: string) {
  if (visited.has(url)) return;
  visited.add(url);

  console.log("Fetching module:", url);
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error("Failed to fetch", url, res.status);
      return;
    }
    const code = await res.text();
    const parsed = new URL(url);
    const filename = path.basename(parsed.pathname) || "index.js";
    fs.writeFileSync(path.join(outDir, filename), code, "utf-8");

    // find imports: import ... from "..." or from '...' or import("...")
    const importRegex = /(?:from\s+['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\))/g;
    let m;
    while ((m = importRegex.exec(code)) !== null) {
      const imp = m[1] || m[2];
      if (!imp) continue;
      let targetUrl = imp;
      if (imp.startsWith(".")) {
        targetUrl = new URL(imp, url).href;
      } else if (imp.startsWith("/")) {
        targetUrl = new URL(imp, parsed.origin).href;
      }
      if (targetUrl.startsWith("http")) {
        toDownload.push(targetUrl);
      }
    }
  } catch (err: any) {
    console.error("Error fetching", url, err.message);
  }
}

async function main() {
  while (toDownload.length > 0) {
    const next = toDownload.shift()!;
    await download(next);
  }
  console.log("Downloaded", visited.size, "modules.");
}

main().catch(console.error);
