import fs from "node:fs";
import path from "node:path";

const inputPath = path.resolve(__dirname, "../raw-extracts/AwakeTopB_full.js");
const outputPath = path.resolve(__dirname, "../raw-extracts/AwakeTopB_component.js");

if (!fs.existsSync(inputPath)) {
  console.error(`Input file not found: ${inputPath}`);
  process.exit(1);
}

const code = fs.readFileSync(inputPath, "utf-8");
const idx = code.indexOf("export default function AwakeTopB");
console.log("AwakeTopB starts at character:", idx);

// Extract the component code
const funcCode = code.slice(idx);
fs.writeFileSync(outputPath, funcCode, "utf-8");
console.log("Saved AwakeTopB_component.js (length:", funcCode.length, ")");
