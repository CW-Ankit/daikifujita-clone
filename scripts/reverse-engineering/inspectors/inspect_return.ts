import fs from "node:fs";
import path from "node:path";

const codePath = path.resolve(__dirname, "../../raw-extracts/AwakeTopB_component.js");
if (!fs.existsSync(codePath)) {
  console.error(`File not found: ${codePath}`);
  process.exit(1);
}

const code = fs.readFileSync(codePath, "utf-8");

// Find the return statement inside this component
const returnIdx = code.indexOf("return /*#__PURE__*/");
console.log("Return starts at:", returnIdx);

if (returnIdx !== -1) {
  const returnSnippet = code.slice(returnIdx, returnIdx + 8000);
  console.log("--- RETURN SNIPPET ---\n", returnSnippet);
} else {
  const anyReturn = [...code.matchAll(/\breturn\s+([^;]+);/g)];
  console.log("Found returns:", anyReturn.length);
  for (let i = Math.max(0, anyReturn.length - 10); i < anyReturn.length; i++) {
    console.log(`Return ${i}:`, anyReturn[i][0].slice(0, 200));
  }
}
