import fs from "node:fs";
import path from "node:path";

const rawDir = path.resolve(__dirname, "../raw-extracts");
const extractedDir = path.join(rawDir, "extracted_source");
const outInventory = path.resolve(__dirname, "../assets/assets_inventory.json");

if (!fs.existsSync(extractedDir)) {
  console.error(`Extracted source directory not found: ${extractedDir}`);
  process.exit(1);
}

function getAllFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      getAllFiles(p, fileList);
    } else {
      fileList.push(p);
    }
  }
  return fileList;
}

const allFiles = getAllFiles(extractedDir);
console.log("Total extracted files:", allFiles.length);

const allAssets = new Set<string>();
const glbModels = new Set<string>();
const audioFiles = new Set<string>();
const images = new Set<string>();
const fonts = new Set<string>();

for (const f of allFiles) {
  const text = fs.readFileSync(f, "utf-8");
  
  // Find all URLs
  const urlRegex = /https:\/\/[^\s"'`<>]+(?:\.[a-zA-Z0-9]+|\/assets\/[a-zA-Z0-9_-]+)/g;
  let m;
  while ((m = urlRegex.exec(text)) !== null) {
    let u = m[0].replace(/[),;]+$/, "");
    allAssets.add(u);
    if (u.endsWith(".glb") || u.endsWith(".gltf")) glbModels.add(u);
    else if (u.endsWith(".mp3") || u.endsWith(".wav") || u.endsWith(".ogg") || u.endsWith(".m4a")) audioFiles.add(u);
    else if (/\.(png|jpg|jpeg|webp|avif|svg)$/i.test(u) || u.includes("/images/")) images.add(u);
    else if (/\.(woff2|woff|ttf|otf)$/i.test(u) || u.includes("fonts.gstatic.com")) fonts.add(u);
  }
}

console.log("\n--- ASSET SUMMARY ---");
console.log("GLB 3D Models:", Array.from(glbModels));
console.log("Audio Files:", Array.from(audioFiles));
console.log("Images count:", images.size);
console.log("Fonts count:", fonts.size);

// Save summary
fs.writeFileSync(
  outInventory,
  JSON.stringify({
    glbModels: Array.from(glbModels),
    audioFiles: Array.from(audioFiles),
    images: Array.from(images),
    fonts: Array.from(fonts)
  }, null, 2)
);
console.log(`Asset inventory written to ${outInventory}`);
