"use client";

import React from "react";
import ShardOfMemory from "./ShardOfMemory";

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between pt-32 pb-12 px-6 md:px-12 lg:px-20 overflow-hidden">
      {/* Top Tagline / Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] font-mono tracking-wider text-neutral-500 uppercase border-b border-neutral-200/80 pb-4">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Available for select projects 2026</span>
        </div>
        <div className="flex items-center gap-6">
          <span>Tokyo, Japan [35.6762° N, 139.6503° E]</span>
          <span className="hidden md:inline text-neutral-400">/</span>
          <span className="hidden md:inline">Portfolio v2</span>
        </div>
      </div>

      {/* Center Grid: Typography & 3D Shard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto py-12">
        {/* Left Typography */}
        <div className="lg:col-span-7 flex flex-col gap-6 z-10">
          <div className="overflow-hidden">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-medium tracking-tight text-neutral-900 leading-[1.08]">
              <span className="block">Web &amp; Interactive</span>
              <span className="block italic font-serif font-normal text-neutral-600">
                Designer based in Tokyo.
              </span>
            </h1>
          </div>

          <p className="text-base sm:text-lg text-neutral-600 max-w-xl font-normal leading-relaxed pt-2">
            Guided through the work by a single shard of memory. Blending spatial computing,
            sensory interaction, and tactile craftsmanship on the web.
          </p>

          <div className="pt-2 text-xs text-neutral-500 leading-relaxed font-sans max-w-lg">
            <span className="text-neutral-700 font-medium">うつつモード — </span>
            1つの記憶のかけらに導かれて作品を巡る。画面奥のクリスタルに触れるか、右上の「DREAM MODE」から3Dの夢へ移行できます。
          </div>
        </div>

        {/* Right 3D Shard of Memory */}
        <div className="lg:col-span-5 h-[340px] sm:h-[420px] lg:h-[480px] w-full relative flex items-center justify-center">
          <div className="absolute inset-0 bg-radial from-neutral-200/40 via-transparent to-transparent rounded-full filter blur-2xl pointer-events-none" />
          <ShardOfMemory />
          <div className="absolute bottom-2 text-center text-[10px] font-mono tracking-widest text-neutral-400 uppercase pointer-events-none">
            [ Drag / Hover to rotate shard ]
          </div>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-neutral-400 pt-6">
        <span>[01 / 03] Selected Works</span>
        <span className="animate-bounce">Scroll Down ↓</span>
      </div>
    </section>
  );
}
