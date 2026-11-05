"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WorksSection from "@/components/WorksSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import SmoothScroll from "@/components/SmoothScroll";
import DreamShift from "@/components/DreamShift";
import RetroMode from "@/components/RetroMode";
import { getSoundEngine } from "@/lib/soundEngine";

export default function Home() {
  const [mode, setMode] = useState<"awake" | "dream" | "retro">("awake");

  // Easter egg: Listen for 'R' key for Retro Mode or 'ESC' to return
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (mode !== "awake") {
          getSoundEngine().playTransition(false);
          setMode("awake");
        }
      }
      if ((e.shiftKey && (e.key === "R" || e.key === "r")) || e.key === "8") {
        getSoundEngine().playClick();
        setMode((prev) => (prev === "retro" ? "awake" : "retro"));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode]);

  return (
    <main className="relative min-h-screen selection:bg-neutral-900 selection:text-white">
      {/* AWAKE MODE (Default Editorial & WebGL Shard Experience) */}
      <div className={`transition-opacity duration-700 ${mode === "awake" ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <SmoothScroll>
          <Header currentMode={mode} onToggleMode={(m) => setMode(m)} />
          <Hero />
          <WorksSection />
          <AboutSection />
          <ContactSection />
        </SmoothScroll>

        {/* Floating Subtle Easter Egg Button for Retro Mode */}
        <div className="fixed bottom-4 left-4 z-30">
          <button
            onClick={() => {
              getSoundEngine().playClick();
              setMode("retro");
            }}
            className="text-[9px] font-mono tracking-widest text-neutral-400 hover:text-neutral-900 bg-white/70 backdrop-blur-sm border border-neutral-200/80 px-2.5 py-1 rounded-full uppercase transition-all shadow-xs"
            title="Press Shift+R or click for 8-bit mode"
          >
            [ 8-BIT MODE ]
          </button>
        </div>
      </div>

      {/* DREAM MODE (Full 3D Three.js Game/Cosmic Space Experience) */}
      {mode === "dream" && <DreamShift onExit={() => setMode("awake")} />}

      {/* RETRO MODE (8-bit Arcade & CRT Chiptune Experience) */}
      {mode === "retro" && <RetroMode onExit={() => setMode("awake")} />}
    </main>
  );
}
