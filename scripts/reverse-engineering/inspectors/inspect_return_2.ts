import fs from "node:fs";
import path from "node:path";

const codePath = path.resolve(__dirname, "../../raw-extracts/AwakeTopB_component.js");
if (!fs.existsSync(codePath)) {
  console.error(`File not found: ${codePath}`);
  process.exit(1);
}

const code = fs.readFileSync(codePath, "utf-8");

const returnIdx = code.indexOf("return /*#__PURE__*/");
const secondHalf = code.slice(returnIdx + 8000, returnIdx + 20000);
console.log("--- SECOND HALF SNIPPET ---\n", secondHalf);
