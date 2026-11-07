import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(__dirname, "../..");
const targetDir = path.join(projectRoot, "public");

const glbUrls = [
  { url: "https://framerusercontent.com/assets/Ubm5c8hW7LOGySZX7BlP0JaScU.glb", name: "models/tb_block.glb" },
  { url: "https://framerusercontent.com/assets/naJEGxt6ZlYOHR1eVRMZevXElV4.glb", name: "models/dream_model.glb" },
  { url: "https://framerusercontent.com/assets/w2IsrWZMwUxvIw30nhl4vGIi2a8.glb", name: "models/figure.glb" },
];

const textureUrls = [
  { url: "https://framerusercontent.com/assets/oWNvEJc2bgGrWSkrUcybtAPRlAM.webp", name: "textures/topb_ice_n.webp" },
  { url: "https://framerusercontent.com/assets/aZdnPA8rRlTXGf63IeKxXTxwh84.webp", name: "textures/topb_ice_m.webp" },
  { url: "https://framerusercontent.com/assets/QhARDtDqQNVTkt1Y6qdyGYh18.webp", name: "textures/tb_block_n.webp" },
  { url: "https://framerusercontent.com/assets/IfFTDt8Qu4cF0K9XbVivhEikAc.webp", name: "textures/tb_block_m.webp" },
];

// All images from assets_inventory
const inventoryPath = path.join(__dirname, "assets_inventory.json");
const inventory = JSON.parse(fs.readFileSync(inventoryPath, "utf-8"));

const imageUrls: { url: string; name: string }[] = [];
for (const u of inventory.images) {
  const filename = path.basename(new URL(u).pathname);
  imageUrls.push({ url: u, name: `images/${filename}` });
}

// Additional gallery images identified in AwakeTopB.js
const galleryIds = [
  "1bkjcB7uulAIeieaHzJp5p1WdYU",
  "oZhLWSQiqzCKxPj2uJ2PS8ho3Ws",
  "x6rr6x1liWTupTGPNU2xHZe8JgM",
  "611gL5CAewt55d7dmI5W5Gia63o",
  "JVWQ3agwcwmypTve5a6YLa33s1M",
  "RBGTeahGd2LLOXochxGjvzC7ajo",
  "BV6BKgjLy2PZ4S3xtgmOlDR1Jw",
  "ncNHc7pq0Mvd2ZFyknSiCAqWos0",
  "kjrYLHZylOUeEqaBysdoNUI5as",
  "j3y2XlxYnRSo69gK3QQtk6bbM",
  "UwSYwpPkghWNn8uZekuo1xu6Vc",
  "6bqqivg1une0B2aPLSjxvyhqXs",
  "ZEMZ4YXib37UdgePmyiuUFkkiE",
  "eVYj6CNzGc62XpZaIv01nduVWdE",
  "roLES6HVvAZ1b2iqx3qK2NkfU",
  "MgHTWMPbFXn5g22t0c6RJPZlpAQ",
];

for (const id of galleryIds) {
  imageUrls.push({
    url: `https://framerusercontent.com/images/${id}.jpg`,
    name: `images/${id}.jpg`,
  });
}

async function downloadFile(url: string, relativePath: string) {
  const dest = path.join(targetDir, relativePath);
  fs.mkdirSync(path.dirname(dest), { recursive: true });

  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
    console.log(`Already exists: ${relativePath}`);
    return;
  }

  console.log(`Downloading: ${url} -> ${relativePath}`);
  try {
    const res = await fetch(url);
    if (!res.ok) {
      if (url.endsWith(".jpg")) {
        const pngUrl = url.replace(/\.jpg$/, ".png");
        const resPng = await fetch(pngUrl);
        if (resPng.ok) {
          const buf = Buffer.from(await resPng.arrayBuffer());
          const pngDest = dest.replace(/\.jpg$/, ".png");
          fs.writeFileSync(pngDest, buf);
          console.log(`Saved PNG fallback: ${pngDest}`);
          return;
        }
      }
      console.error(`Failed ${url}: HTTP ${res.status}`);
      return;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log(`Saved: ${relativePath} (${buf.length} bytes)`);
  } catch (err: any) {
    console.error(`Error downloading ${url}:`, err.message);
  }
}

async function main() {
  console.log("Downloading 3D models...");
  for (const m of glbUrls) await downloadFile(m.url, m.name);

  console.log("Downloading textures...");
  for (const t of textureUrls) await downloadFile(t.url, t.name);

  console.log("Downloading images...");
  for (const img of imageUrls) await downloadFile(img.url, img.name);

  console.log("All asset download checks completed!");
}

main().catch(console.error);
