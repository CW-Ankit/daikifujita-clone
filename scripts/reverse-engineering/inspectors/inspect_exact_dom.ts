import fs from "node:fs";
import path from "node:path";

const htmlPath = path.resolve(__dirname, "../../raw-extracts/index.html");
const cssOutPath = path.resolve(__dirname, "../../raw-extracts/extracted_css.css");

if (!fs.existsSync(htmlPath)) {
  console.error(`File not found: ${htmlPath}`);
  process.exit(1);
}

const html = fs.readFileSync(htmlPath, "utf-8");

// Extract all style tags
const styleRegex = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
let m;
let styleCount = 0;
let allCss = "";
while ((m = styleRegex.exec(html)) !== null) {
  styleCount++;
  allCss += m[1] + "\n";
}
console.log("Total style tags:", styleCount);
console.log("Total CSS length:", allCss.length);
fs.writeFileSync(cssOutPath, allCss, "utf-8");
console.log(`Saved CSS to ${cssOutPath}`);

// Find main structure inside <div id="main">
const mainIdx = html.indexOf('<div id="main"');
if (mainIdx !== -1) {
  console.log("Found div#main at index:", mainIdx);
  const snippet = html.slice(mainIdx, mainIdx + 4000);
  console.log("Snippet:\n", snippet);
}

// Find all data-framer-name elements
const dataFramerNames = [...html.matchAll(/data-framer-name="([^"]+)"/g)].map((x) => x[1]);
console.log("Unique data-framer-names:", [...new Set(dataFramerNames)]);

// Find all sections or headers
const tags = [...html.matchAll(/<(header|section|footer|nav|main)\b([^>]*)>/gi)].map(
  (x) => `<${x[1]} ${x[2]}>`
);
console.log("Structural tags found:", tags);
