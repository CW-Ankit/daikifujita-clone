---
name: interactive-portfolio-reconstruction
description: Master guide and methodology for reverse-engineering, analyzing, and faithfully reconstructing high-end interactive portfolios, WebGL/Three.js experiences, and Framer/Webflow sites with Next.js, React 19, and Tailwind CSS.
metadata:
  version: "1.0.0"
  author: "DeepMind Agentic Team"
---

# Interactive Portfolio Reconstruction Skill

This skill captures the end-to-end engineering methodology for deconstructing and rebuilding award-winning creative portfolio websites (such as `daikifujita.com`), combining procedural audio, 3D WebGL graphics, and tactile editorial typography.

## 1. Target Intelligence & Reverse Engineering

### 1.1 Server & Bundle Discovery
1. **Analyze Response Headers**:
   ```bash
   curl.exe -I <target-url>
   ```
   Inspect `Server`, `Framer-Site-Id`, `Server-Timing`, and asset CDNs (`framerusercontent.com`, `esm.sh`, `unpkg.com`).
2. **Sourcemap Discovery**:
   Check if production sourcemaps are exposed:
   * Target `.mjs` or `.js` bundles often append `//# sourceMappingURL=<filename>.mjs.map`.
   * Directly test fetching the `.map` file with `fetch()`. If HTTP 200 is returned, `mapData.sourcesContent` contains the unminified original source files, component names, and comments.

### 1.2 Asset Extraction
* **3D Models**: Look for `.glb` / `.gltf` references in chunks. Draco-compressed models can be extracted and loaded via Three.js `GLTFLoader` and `DRACOLoader`.
* **Textures**: Extract normal maps (`*_n.webp`), roughness/metallic maps (`*_m.webp`), and displacement maps.
* **Images**: Scrape all high-res photography and case study screenshots into `public/images/`.

---

## 2. Dual-Reality Architecture

High-end portfolios often employ dual-mode or multi-mode experiences:
1. **Awake Mode (Editorial / Narrative View)**:
   * Smooth inertia scrolling powered by **Lenis**.
   * Interactive WebGL canvas component ("Shard of Memory") anchored in the viewport that reacts to mouse coordinates and scroll velocity.
   * Typographic styling combining modern sans-serifs (`Inter Tight`), editorial serifs (`Instrument Serif`), and monospaced technical labels (`DM Mono`).
   * Responsive case study modal drawers.
2. **Dream Mode (Interactive 3D Game / Canvas)**:
   * Full-screen WebGL overlay using **Three.js**.
   * Orbit/Flight camera navigation with mouse and keyboard (WASD / Arrow keys).
   * Procedural particle systems (cosmic stardust, glowing embers) using `BufferGeometry` and `PointsMaterial`.
   * Proximity collision detection: collecting 3D nodes updates HUD counters and triggers light flares.
3. **Retro / Easter Egg Mode**:
   * CRT scanline overlays and 8-bit styling.
   * Chiptune audio synthesis.

---

## 3. Procedural Web Audio Engine (Zero-Asset Audio)

Rather than loading heavy `.mp3` or `.wav` files, use the native **Web Audio API** for real-time procedural synthesis:
* **Algorithmic Reverb**: Generate a stereo impulse response buffer using exponential noise decay:
  ```ts
  const length = Math.floor(rate * duration);
  const impulse = ctx.createBuffer(2, length, rate);
  for (let i = 0; i < length; i++) {
    const d = Math.pow(1 - i / length, decay);
    left[i] = (Math.random() * 2 - 1) * d;
    right[i] = (Math.random() * 2 - 1) * d;
  }
  ```
* **Ambient Drone**: Detuned sine and triangle oscillators routed through a resonant lowpass filter.
* **Tactile Clicks**: Fast pitch-sweeping sine bursts (800 Hz -> 120 Hz) with exponential amplitude decay.
* **Crystal Shimmers**: High-pitch sinusoidal chords routed through the algorithmic convolver reverb.

---

## 4. Modern Next.js 16 + React 19 + Tailwind v4 Stack

* **Next.js 16 App Router**: Turbopack / Webpack hybrid build configuration.
* **React 19**: Leverages `startTransition` for low-priority state updates like clocks and particle counts.
* **Tailwind CSS v4**: Streamlined CSS-first configuration using `@import "tailwindcss";` and custom CSS variable tokens.
* **Three.js**: Direct WebGL control for optimal frame rates and memory footprint.
