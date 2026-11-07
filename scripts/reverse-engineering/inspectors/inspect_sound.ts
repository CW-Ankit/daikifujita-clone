import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(__dirname, "../../raw-extracts");
const extractedDir = path.join(rootDir, "extracted_source");

function findInFiles(term: string) {
  if (!fs.existsSync(extractedDir)) {
    console.error(`Directory not found: ${extractedDir}`);
    return;
  }
  const files = fs.readdirSync(extractedDir, { recursive: true }) as string[];
  for (const f of files) {
    const full = path.join(extractedDir, f);
    if (!fs.statSync(full).isFile() || !full.endsWith(".js")) continue;
    const content = fs.readFileSync(full, "utf-8");
    if (content.includes(term)) {
      console.log(`Found "${term}" in ${f}`);
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(term)) {
          console.log(`L${i + 1}: ${lines[i].slice(0, 150)}`);
        }
      }
    }
  }
}

findInFiles("AudioContext");
findInFiles("SOUND_KEY");
findInFiles("dreamshift:sound");
