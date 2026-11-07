"use client";

import React, { useState, useEffect } from "react";
import AwakeView from "@/components/AwakeView";
import DreamShift from "@/components/DreamShift";
import RetroMode from "@/components/RetroMode";
import LocalClock from "@/components/LocalClock";
import Preloader from "@/components/Preloader";
import { getSoundEngine } from "@/lib/soundEngine";

export default function Home() {
  const [mode, setMode] = useState<"awake" | "dream" | "retro">("awake");
  const [mounted, setMounted] = useState(false);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    setMounted(true);

    const handleHash = () => {
      if (window.location.hash === "#dream-mode") {
        setMode("dream");
      } else if (mode === "dream" && window.location.hash !== "#dream-mode") {
        setMode("awake");
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (mode !== "awake") {
          window.location.hash = "#top";
          setMode("awake");
        }
      }
      if ((e.shiftKey && (e.key === "R" || e.key === "r")) || e.key === "8") {
        getSoundEngine().playClick();
        setMode((prev) => (prev === "retro" ? "awake" : "retro"));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("hashchange", handleHash);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mode]);

  return (
    <main className="relative min-h-screen bg-[#ECEAE4] text-[#121212] selection:bg-[#121212] selection:text-white">
      {/* Loading Screen / Preloader with Enter Button */}
      {booting && (
        <Preloader onDone={() => setBooting(false)} />
      )}

      {/* Fixed Site Header matching original Framer component structure */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between pointer-events-none px-6 md:px-10 py-4.5 text-white"
        style={{ mixBlendMode: "difference" }}
        data-framer-name="Header"
      >
        {/* Identity */}
        <div data-framer-name="Identity" className="pointer-events-auto">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="font-sans text-[11px] font-semibold tracking-wider uppercase text-white hover:opacity-70 transition-opacity"
          >
            Daiki Fujita
          </a>
        </div>

        {/* Navigation */}
        <nav
          data-framer-name="Navigation"
          className="hidden sm:flex items-center gap-6 pointer-events-auto font-sans text-[11px] font-semibold tracking-wider uppercase text-white"
        >
          <a href="#work" className="hover:opacity-70 transition-opacity">
            Work
          </a>
          <a href="#about" className="hover:opacity-70 transition-opacity">
            About
          </a>
        </nav>

        {/* Local Tokyo Time */}
        <div data-framer-name="Local Time" className="hidden lg:flex items-center pointer-events-auto">
          <LocalClock prefix="Tokyo" timeZone="Asia/Tokyo" className="text-white!" />
        </div>

        {/* Contact / Right */}
        <div data-framer-name="Contact" className="flex items-center gap-4 pointer-events-auto">
          <a
            href="#contact"
            className="font-sans text-[11px] font-semibold tracking-wider uppercase text-white hover:opacity-70 transition-opacity"
          >
            Contact
          </a>

          {/* Quick Dream Mode Trigger Pill */}
          <a
            href="#dream-mode"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = "#dream-mode";
              setMode("dream");
            }}
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-white/40 text-[10px] font-sans font-semibold tracking-wider uppercase text-white hover:bg-white hover:text-black transition-all"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>Dream</span>
          </a>
        </div>
      </header>

      {/* AWAKE MODE (Exact Reconstructed View with 3D Shard, Sticky Horizontal Works, Pinned Dream & Recognition) */}
      <div className={`transition-opacity duration-700 ${mode === "awake" ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        {mounted && <AwakeView />}
      </div>

      {/* DREAM MODE (Full-screen 3D Cosmos Exploration Experience) */}
      {mode === "dream" && (
        <DreamShift
          onExit={() => {
            window.location.hash = "#top";
            setMode("awake");
          }}
        />
      )}

      {/* RETRO MODE (8-bit CRT Arcade Easter Egg) */}
      {mode === "retro" && (
        <RetroMode
          onExit={() => {
            setMode("awake");
          }}
        />
      )}

      {/* Bottom Floating Pill for 8-Bit Retro Mode */}
      <div className="fixed bottom-4 left-4 z-40">
        <button
          onClick={() => {
            getSoundEngine().playClick();
            setMode("retro");
          }}
          className="text-[9px] font-mono tracking-widest text-neutral-500 hover:text-neutral-900 bg-white/60 backdrop-blur-sm border border-neutral-300/80 px-2.5 py-1 rounded-full uppercase transition-all shadow-xs"
          title="Press Shift+R or click for 8-bit mode"
        >
          [ 8-BIT MODE ]
        </button>
      </div>
    </main>
  );
}
