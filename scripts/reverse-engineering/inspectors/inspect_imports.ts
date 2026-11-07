import fs from "node:fs";
import path from "node:path";

const codePath = path.resolve(__dirname, "../../raw-extracts/AwakeTopB_full.js");
if (!fs.existsSync(codePath)) {
  console.error(`File not found: ${codePath}`);
  process.exit(1);
}

const code = fs.readFileSync(codePath, "utf-8");

// Find all import statements
const importMatches = [...code.matchAll(/^import\s+[\s\S]*?;/gm)].map((m) => m[0]);
console.log("Imports in AwakeTopB_full.js:\n", importMatches);

// Find dynamic imports
const dynamicImports = [...code.matchAll(/import\s*\(\s*([^)]+)\s*\)/g)].map((m) => m[0]);
console.log("Dynamic imports:\n", dynamicImports);
