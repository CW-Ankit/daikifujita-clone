import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(__dirname, "../..");
const inputPath = path.resolve(__dirname, "../raw-extracts/AwakeTopB_full.js");
const outputPath = path.resolve(projectRoot, "components/AwakeView.jsx");

if (!fs.existsSync(inputPath)) {
  console.error(`Input file not found: ${inputPath}`);
  process.exit(1);
}

let code = fs.readFileSync(inputPath, "utf-8");
console.log("Original code length:", code.length);

// 1. Add "use client"; at the very top
// 2. Remove framer imports and replace with React / Three imports
code = code.replace(
  /import\{addPropertyControls,ControlType,useIsStaticRenderer\}from"framer";/,
  `import * as THREE from "three";
import Lenis from "lenis";
const useIsStaticRenderer = () => false;`
);

// 3. Replace loadThree to use local THREE
code = code.replace(
  /let threePromise=null;function loadThree\(\)\{[\s\S]*?return threePromise;\}/,
  `function loadThree() { return Promise.resolve(THREE); }`
);

// 4. Replace esm(LENIS_URL) to use local Lenis
code = code.replace(
  /esm\(LENIS_URL\)\.then\(m=>\{/,
  `Promise.resolve({ default: Lenis, Lenis }).then(m=>{`
);

// 5. Replace esm convex geometry to import from three
code = code.replace(
  /const\{ConvexGeometry\}=await esm\(`\$\{THREE_URL\}\/examples\/jsm\/geometries\/ConvexGeometry\.js`\);/,
  `const { ConvexGeometry } = await import("three/examples/jsm/geometries/ConvexGeometry.js");`
);

// 6. Point topbIceUrls directly to local public assets
code = code.replace(
  /function topbIceUrls\(\)\{[\s\S]*?return TOPB_ICE;\}/,
  `function topbIceUrls() {
    return {
      n: "/textures/topb_ice_n.webp",
      m: "/textures/topb_ice_m.webp",
      glb: "/models/tb_block.glb",
      bn: "/textures/tb_block_n.webp",
      bm: "/textures/tb_block_m.webp"
    };
  }`
);

// 7. Fix esm loader to resolve GLTFLoader and ConvexGeometry locally
const targetEsm = "const esm=u=>import(/* @vite-ignore */u);";
const replacementEsm = `const esm = async (u) => {
  if (typeof u === "string" && u.includes("GLTFLoader")) {
    return import("three/examples/jsm/loaders/GLTFLoader.js");
  }
  if (typeof u === "string" && u.includes("ConvexGeometry")) {
    return import("three/examples/jsm/geometries/ConvexGeometry.js");
  }
  return { default: Lenis, Lenis };
};`;
code = code.replace(targetEsm, replacementEsm);

// Add "use client"; header
code = `"use client";\n` + code;

fs.writeFileSync(outputPath, code, "utf-8");
console.log(`Generated AwakeView.jsx successfully! Target: ${outputPath} (${code.length} bytes)`);
