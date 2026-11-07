import fs from "node:fs";
import path from "node:path";

const cssPath = path.resolve(__dirname, "../../raw-extracts/awake_css_blocks.txt");
if (!fs.existsSync(cssPath)) {
  console.error(`File not found: ${cssPath}`);
  process.exit(1);
}

const css = fs.readFileSync(cssPath, "utf-8");

console.log("CSS length:", css.length);
// Print classes in CSS
const classMatches = [...css.matchAll(/\.([a-zA-Z0-9_-]+)\s*\{/g)].map((m) => m[1]);
console.log("Classes found:", [...new Set(classMatches)]);

// Print first 4000 characters of CSS
console.log("\n--- CSS FIRST 4000 CHARS ---");
console.log(css.slice(0, 4000));
