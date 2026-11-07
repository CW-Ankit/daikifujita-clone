import fs from "node:fs";
import path from "node:path";

const htmlPath = path.resolve(__dirname, "../raw-extracts/index.html");
if (!fs.existsSync(htmlPath)) {
  console.error(`File not found: ${htmlPath}`);
  process.exit(1);
}

const html = fs.readFileSync(htmlPath, "utf-8");
console.log("HTML length:", html.length);

// Extract title
const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
console.log("Title:", titleMatch ? titleMatch[1] : "None");

// Extract meta tags
const metaMatches = [...html.matchAll(/<meta\b([^>]*)>/gi)].map((m) => m[1]);
console.log("Meta tags count:", metaMatches.length);

// Find all image URLs (png, jpg, webp, svg, avif)
const imgRegex = /https:\/\/framerusercontent\.com\/images\/[a-zA-Z0-9_-]+\.(?:png|jpg|jpeg|webp|avif|svg)/gi;
const images = [...new Set(html.match(imgRegex) || [])];
console.log("Total unique images found in HTML:", images.length);
console.log("Sample Images:", images.slice(0, 10));

// Find all audio/video URLs
const mediaRegex = /https:\/\/framerusercontent\.com\/assets\/[a-zA-Z0-9._-]+/gi;
const media = [...new Set(html.match(mediaRegex) || [])];
console.log("Media assets:", media);

// Look for data-framer or custom components
const framerNameMatches = [...new Set([...html.matchAll(/data-framer-name="([^"]+)"/g)].map((m) => m[1]))];
console.log("Framer component names:", framerNameMatches);

// Look for routes
const routeMatches = [...new Set([...html.matchAll(/\/sites\/5MeOyhWZ1lHds7fz7oT6Xp\/[^"'\s]+/g)].map((m) => m[0]))];
console.log("Site bundle paths:", routeMatches.length);
