import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(__dirname, "../../raw-extracts/extracted_source");
const files = fs.readdirSync(rootDir, { recursive: true }) as string[];
const awakeFile = files.find((f) => f.includes("AwakeTopB.js"));
console.log("Awake file:", awakeFile);

if (!awakeFile) {
  console.error("AwakeTopB.js not found in extracted_source");
  process.exit(1);
}

const content = fs.readFileSync(path.join(rootDir, awakeFile), "utf-8");
console.log("Length:", content.length);
console.log("Lines:", content.split("\n").length);

// Print the first 60 lines
console.log("--- First 60 lines ---");
console.log(content.split("\n").slice(0, 60).join("\n"));
