import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(__dirname, "../../raw-extracts/extracted_source");
const outFull = path.resolve(__dirname, "../../raw-extracts/AwakeTopB_full.js");
const files = fs.readdirSync(rootDir, { recursive: true }) as string[];
const awakeFile = files.find((f) => f.includes("AwakeTopB.js"));

if (!awakeFile) {
  console.error("AwakeTopB.js not found in extracted_source");
  process.exit(1);
}

const content = fs.readFileSync(path.join(rootDir, awakeFile), "utf-8");
console.log("AwakeTopB length:", content.length);

const fnMatch = content.indexOf("export default function");
console.log("Export default index:", fnMatch);

// Save the full file for inspection
fs.writeFileSync(outFull, content, "utf-8");
console.log(`Saved AwakeTopB_full.js to ${outFull}`);
