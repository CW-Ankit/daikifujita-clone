import fs from "node:fs";
import path from "node:path";

const codePath = path.resolve(__dirname, "../../raw-extracts/AwakeTopB_full.js");
if (!fs.existsSync(codePath)) {
  console.error(`File not found: ${codePath}`);
  process.exit(1);
}

const code = fs.readFileSync(codePath, "utf-8");

// Find occurrences of THREE
const threeMatches = [...code.matchAll(/THREE\.[a-zA-Z0-9_]+/g)].map((m) => m[0]);
console.log("THREE usages:", [...new Set(threeMatches)]);

// Find occurrences of canvasRef or similar
const canvasIdx = code.indexOf("canvasRef");
console.log("canvasRef index:", canvasIdx);
if (canvasIdx !== -1) {
  console.log(code.slice(canvasIdx - 200, canvasIdx + 2000));
}
