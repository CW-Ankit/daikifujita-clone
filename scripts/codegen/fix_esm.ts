import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(__dirname, "../..");
const targetFile = path.resolve(projectRoot, "components/AwakeView.jsx");

if (!fs.existsSync(targetFile)) {
  console.error(`File not found: ${targetFile}`);
  process.exit(1);
}

let c = fs.readFileSync(targetFile, "utf-8");

const target = "const esm=u=>import(/* @vite-ignore */u);";
const replacement = `const esm = async (u) => {
  if (typeof u === "string" && u.includes("GLTFLoader")) {
    return import("three/examples/jsm/loaders/GLTFLoader.js");
  }
  if (typeof u === "string" && u.includes("ConvexGeometry")) {
    return import("three/examples/jsm/geometries/ConvexGeometry.js");
  }
  return { default: Lenis, Lenis };
};`;

if (c.includes(target)) {
  c = c.replace(target, replacement);
  fs.writeFileSync(targetFile, c, "utf-8");
  console.log("Successfully replaced esm definition in AwakeView.jsx!");
} else {
  console.log("Target pattern already replaced or not found in AwakeView.jsx.");
}
