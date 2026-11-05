"use client";

import React from "react";

const HONORS = [
  { year: "2026", award: "FWA of the Day", org: "The FWA" },
  { year: "2026", award: "Site of the Day & Special Kudos", org: "CSS Design Awards" },
  { year: "2026", award: "Site of the Day", org: "CSS Winner" },
  { year: "2026", award: "Featured Project", org: "Muzli Picks" },
  { year: "2025", award: "Nominee", org: "Awwwards" },
];

const CAPABILITIES = [
  "Art Direction & Visual Identity",
  "Interactive Web Design & Prototyping",
  "Creative Development (Three.js / WebGL / GLSL)",
  "Spatial & 3D Web Experiences",
  "Kinetic Typography & Motion Design",
  "Procedural Web Audio & Sound Design",
];

export default function AboutSection() {
  return (
    <section id="about" className="py-24 px-6 md:px-12 lg:px-20 border-t border-neutral-200">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column: Heading & Bio */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-400">
            About / Philosophy
          </span>

          <h2 className="text-3xl sm:text-4xl font-sans font-medium tracking-tight text-neutral-900 leading-tight">
            Crafting tactile digital experiences that bridge code, space, and memory.
          </h2>

          <div className="flex flex-col gap-4 text-sm sm:text-base text-neutral-600 leading-relaxed font-normal pt-2">
            <p>
              I am a web and interactive designer based in Tokyo. I explore the tangible threshold where code, narrative, and sensory feedback meet — creating websites that feel alive, physical, and memorable.
            </p>
            <p className="text-xs text-neutral-500 font-sans leading-relaxed">
              東京を拠点に、Webデザイン・インタラクションデザイン・3D演出・クリエイティブコーディングを手がけています。デジタルの画面に手触りと記憶を宿すような体験設計を探求しています。
            </p>
          </div>
        </div>

        {/* Right Column: Capabilities & Honors */}
        <div className="lg:col-span-7 flex flex-col gap-12">
          {/* Capabilities */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-6 border-b border-neutral-200 pb-2">
              Capabilities &amp; Disciplines
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CAPABILITIES.map((cap, i) => (
                <li key={i} className="text-sm font-sans text-neutral-800 flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                  <span>{cap}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Honors & Recognition */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-6 border-b border-neutral-200 pb-2">
              Recognition &amp; Accolades
            </h3>
            <div className="flex flex-col divide-y divide-neutral-100">
              {HONORS.map((h, i) => (
                <div key={i} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-neutral-400">{h.year}</span>
                    <span className="font-medium text-neutral-900">{h.award}</span>
                  </div>
                  <span className="text-neutral-500 font-mono text-xs">{h.org}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
