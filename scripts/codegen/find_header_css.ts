import fs from "node:fs";
import path from "node:path";

const inputPath = path.resolve(__dirname, "../raw-extracts/extracted_css.css");
const outputPath = path.resolve(__dirname, "../raw-extracts/header_css.css");

if (!fs.existsSync(inputPath)) {
  console.error(`Input file not found: ${inputPath}`);
  process.exit(1);
}

const css = fs.readFileSync(inputPath, "utf-8");

// Find all CSS rules with framer-v72h6k or header
const rules = css.split("}").filter(
  (r) =>
    r.includes("framer-v72h6k") ||
    r.includes("framer-1tfdfxs") ||
    r.includes("framer-18fdd9y") ||
    r.includes("framer-udzvl9") ||
    r.includes("framer-11s7v75") ||
    r.includes("framer-styles-preset-g6nooc") ||
    r.includes("framer-styles-preset-7zvg1x")
);

console.log("Found", rules.length, "header rules");
fs.writeFileSync(outputPath, rules.join("}\n") + "}");
console.log(`Saved header_css.css to ${outputPath}`);
