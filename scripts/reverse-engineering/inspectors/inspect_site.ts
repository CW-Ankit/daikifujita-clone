import fs from "node:fs";
import path from "node:path";

async function main() {
  const url = "https://daikifujita.com/";
  console.log("Fetching", url);
  const res = await fetch(url);
  const html = await res.text();

  const outDir = path.resolve(__dirname, "../../raw-extracts");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(path.join(outDir, "index.html"), html, "utf-8");
  console.log("Saved index.html (length: " + html.length + ")");

  // Extract script tags, stylesheets, and meta
  const scriptRegex = /<script\b[^>]*src="([^"]+)"[^>]*>/gi;
  const scriptMatches: string[] = [];
  let m;
  while ((m = scriptRegex.exec(html)) !== null) {
    scriptMatches.push(m[1]);
  }

  const linkRegex = /<link\b[^>]*href="([^"]+)"[^>]*>/gi;
  const linkMatches: string[] = [];
  while ((m = linkRegex.exec(html)) !== null) {
    linkMatches.push(m[1]);
  }

  // Look for inline script containing routes or chunks or framer data
  const inlineScripts: string[] = [];
  const inlineRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  while ((m = inlineRegex.exec(html)) !== null) {
    if (m[1].trim().length > 0) {
      inlineScripts.push(m[1]);
    }
  }

  console.log("Found scripts:", scriptMatches.length);
  console.log("Found links:", linkMatches.length);
  console.log("Found inline scripts:", inlineScripts.length);

  fs.writeFileSync(
    path.join(outDir, "manifest.json"),
    JSON.stringify(
      {
        scripts: scriptMatches,
        links: linkMatches,
        inlineScriptsCount: inlineScripts.length,
      },
      null,
      2
    )
  );

  const inlineDir = path.join(outDir, "inline_scripts");
  fs.mkdirSync(inlineDir, { recursive: true });
  for (let i = 0; i < inlineScripts.length; i++) {
    fs.writeFileSync(path.join(inlineDir, `inline_${i}.js`), inlineScripts[i]);
  }
}

main().catch(console.error);
