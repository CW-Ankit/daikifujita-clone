import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(__dirname, "../../raw-extracts/extracted_source");
const files = fs.readdirSync(rootDir, { recursive: true }) as string[];
const augiFiles = files.filter((f) => f.includes("augiA20Il.js"));
console.log("Found augiA20Il files:", augiFiles);

for (const af of augiFiles) {
  const code = fs.readFileSync(path.join(rootDir, af), "utf-8");
  console.log(`\n--- ${af} (length: ${code.length}) ---`);
  console.log(code.slice(0, 2000));
}
