# Project Scripts & Reverse Engineering Toolkit

This directory contains the organized suite of scripts, utilities, and raw data extracts used to reverse-engineer, analyze, extract assets, and generate components for the `daikifujita.com` clone.

---

## Directory Structure

```
scripts/
├── assets/                       # Asset downloading, validation, and inventory
│   ├── assets_inventory.json     # Manifest of all extracted media, 3D GLBs, audio, fonts
│   ├── download_all_assets.ts    # Downloads GLBs, textures, and images into /public
│   ├── download_modules.ts       # Scrapes & downloads Framer JS bundles and dependencies
│   └── verify_assets.js          # Scans codebase to verify referenced assets exist in /public
│
├── codegen/                      # Code generation and AST / string transforms
│   ├── generate_awake_view.ts    # Transforms raw Framer Awake module into React AwakeView.jsx
│   ├── extract_awake_func.ts     # Extracts pure AwakeTopB component function
│   ├── find_header_css.ts        # Isolates Framer navigation/header CSS classes
│   └── fix_esm.ts                # Modifies dynamic ESM imports for Next.js bundler compatibility
│
├── reverse-engineering/          # Bundle analysis, sourcemap unpacking, and DOM inspection
│   ├── analyze_awake.ts          # Inspects AwakeTopB JSX structure and CSS definitions
│   ├── analyze_project.ts        # Parses extracted source files to build assets inventory
│   ├── parse_html.ts             # Parses HTML for meta tags, media links, and Framer component names
│   ├── unpack_sourcemaps.ts      # Unpacks sourcemap files into clean source code
│   └── inspectors/               # Specialized targeted audit tools
│       ├── inspect_augi.ts       # Inspects custom cursor component implementation
│       ├── inspect_awake.ts      # Audits Awake layout, shaders, and animations
│       ├── inspect_awake_full.ts # Full module inspection & extractor
│       ├── inspect_css_details.ts# Extracts CSS selectors and rule blocks
│       ├── inspect_exact_dom.ts  # Dumps exact DOM elements for pixel-perfect fidelity
│       ├── inspect_imports.ts    # Audits ESM and dynamic imports
│       ├── inspect_return.ts     # Extracts top-half JSX render tree
│       ├── inspect_return_2.ts   # Extracts lower-half JSX render tree
│       ├── inspect_site.ts       # Scrapes live site metadata and scripts
│       ├── inspect_sound.ts      # Scans codebase for Web Audio synthesizers & sound triggers
│       └── inspect_three_awake.ts# Audits Three.js canvas setup in Awake view
│
└── raw-extracts/                 # Preserved raw dumps and unpacked original assets
    ├── index.html                # Raw HTML from daikifujita.com
    ├── manifest.json             # Manifest of scripts & stylesheets
    ├── extracted_css.css         # Extracted stylesheet rules
    ├── header_css.css            # Header-specific CSS declarations
    ├── awake_css_blocks.txt      # Awake-specific styled component CSS
    ├── AwakeTopB_component.js    # Unpacked AwakeTopB component body
    ├── AwakeTopB_full.js         # Complete AwakeTopB Framer module
    ├── inline_scripts/           # Inline scripts extracted from target HTML
    ├── modules/                  # Downloaded core bundle scripts
    └── extracted_source/         # Unpacked source files from original sourcemaps
```

---

## Usage

### 1. Verify Asset Integrity
Check that all images, textures, and 3D GLB models referenced in the codebase exist in `/public`:
```bash
bun run verify:assets
# or
node scripts/assets/verify_assets.js
```

### 2. Download Missing Assets
Download all GLB models, textures, and gallery images directly to `public/`:
```bash
bun scripts/assets/download_all_assets.ts
```

### 3. Regenerate AwakeView Component
To re-run the Framer-to-React component transformer:
```bash
bun scripts/codegen/generate_awake_view.ts
```

### 4. Run Site Inspection / Analysis
Inspect DOM, audio, or canvas setup:
```bash
bun scripts/reverse-engineering/inspectors/inspect_sound.ts
bun scripts/reverse-engineering/inspectors/inspect_three_awake.ts
```
