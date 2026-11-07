import fs from "node:fs";
import path from "node:path";

const inputPath = path.resolve(__dirname, "../raw-extracts/AwakeTopB_full.js");
const outCssPath = path.resolve(__dirname, "../raw-extracts/awake_css_blocks.txt");

if (!fs.existsSync(inputPath)) {
  console.error(`Input file not found: ${inputPath}`);
  process.exit(1);
}

const code = fs.readFileSync(inputPath, "utf-8");

// Find the return statement of AwakeTopB
const fnIdx = code.indexOf("export default function AwakeTopB");
const returnIdx = code.indexOf("return", fnIdx);
console.log("Return starts at:", returnIdx);

// Look at the returned JSX structure
const jsxSnippet = code.slice(returnIdx, returnIdx + 10000);
console.log("JSX snippet:\n", jsxSnippet);

// Find all CSS in AwakeTopB
const cssMatches = [...code.matchAll(/const [a-zA-Z0-9_]*CSS\s*=\s*`([\s\S]*?)`;/g)].map(
  (m) => m[0]
);
console.log("CSS declarations count:", cssMatches.length);
fs.writeFileSync(outCssPath, cssMatches.join("\n\n/* --- NEW BLOCK --- */\n\n"));
console.log(`Saved CSS declarations to ${outCssPath}`);
