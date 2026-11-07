import fs from "node:fs";
import path from "node:path";

const BASE_URL = "https://framerusercontent.com/sites/5MeOyhWZ1lHds7fz7oT6Xp/";
const OUT_DIR = path.resolve(__dirname, "../raw-extracts/extracted_source");

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const modulesToProcess = [
  "script_main.CbfPLTEo.mjs",
  "C7PQoVFefmyRE-ORYa4jaAZ7D0UEtes5bIGW8O6ok_A.CVB6Kczd.mjs",
  "eOvhi3F3i7QbmLae2fUbSUc2tDsfl1SvkekkyZI-6ug.CKU5fGap.mjs",
  "wIaBBOW9ozw-L8jgaR0XciR0_v6Q7nXb20zdZMNFR5w.MhbzEAQa.mjs",
  "shared-lib.mYWfBDzx.mjs",
  "toplevel-deps.X8yQ2bg4.mjs",
];

async function processModule(modName: string) {
  const mapName = modName + ".map";
  const url = BASE_URL + mapName;
  console.log("Fetching sourcemap:", url);

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`No sourcemap for ${modName} (${res.status})`);
      return;
    }
    const mapData: any = await res.json();
    console.log(`Map loaded for ${modName}, sources:`, mapData.sources?.length);

    if (mapData.sources && mapData.sourcesContent) {
      for (let i = 0; i < mapData.sources.length; i++) {
        let srcPath = mapData.sources[i];
        const content = mapData.sourcesContent[i];
        if (!content) continue;

        // Clean up srcPath
        srcPath = srcPath.replace(/^[./\\]+/, "");
        srcPath = srcPath.replace(/[:*?"<>|]/g, "_");
        const fullPath = path.join(OUT_DIR, srcPath);
        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        fs.writeFileSync(fullPath, content, "utf-8");
        console.log("Extracted:", srcPath);
      }
    }
  } catch (err: any) {
    console.error("Error processing", modName, err.message);
  }
}

async function main() {
  for (const mod of modulesToProcess) {
    await processModule(mod);
  }
}

main().catch(console.error);
