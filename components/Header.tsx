"use client";

import React, { useState, useEffect } from "react";
import LocalClock from "./LocalClock";
import { getSoundEngine } from "@/lib/soundEngine";

interface HeaderProps {
  currentMode: "awake" | "dream" | "retro";
  onToggleMode: (mode: "awake" | "dream" | "retro") => void;
}

export default function Header({ currentMode, onToggleMode }: HeaderProps) {
  const [soundOn, setSoundOn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const engine = getSoundEngine();
    setSoundOn(!engine.getMuted());
  }, []);

  const handleSoundToggle = () => {
    const engine = getSoundEngine();
    const isNowOn = engine.toggleMute();
    setSoundOn(isNowOn);
  };

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    getSoundEngine().playClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 pointer-events-none px-6 md:px-10 py-5 transition-colors duration-500">
      <div className="w-full flex items-center justify-between pointer-events-auto">
        {/* Brand / Name */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              getSoundEngine().playClick();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group flex flex-col text-left focus:outline-none"
          >
            <span className="font-sans text-[13px] font-semibold tracking-wider uppercase text-neutral-900 group-hover:opacity-70 transition-opacity">
              Daiki Fujita
            </span>
            <span className="font-serif italic text-[12px] text-neutral-500 -mt-0.5">
              interactive designer
            </span>
          </button>

          {/* Tokyo Clock (Desktop) */}
          <div className="hidden lg:block border-l border-neutral-300/60 pl-6">
            <LocalClock prefix="Tokyo" timeZone="Asia/Tokyo" />
          </div>
        </div>

        {/* Center / Sound Toggle (Desktop & Tablet) */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={handleSoundToggle}
            className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-700 hover:text-neutral-950 transition-colors focus:outline-none cursor-pointer"
            aria-label="Toggle sound"
          >
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-300 ${soundOn ? "scale-110 text-neutral-900" : "opacity-40"}`}
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              {soundOn ? (
                <>
                  <path d="M2 5.5v5h3l4 3.5V2l-4 3.5H2z" fill="currentColor" />
                  <path d="M12.5 5c.8.8 1.3 1.9 1.3 3s-.5 2.2-1.3 3" />
                  <path d="M14.5 3c1.3 1.3 2 3.1 2 5s-.7 3.7-2 5" />
                </>
              ) : (
                <>
                  <path d="M2 5.5v5h3l4 3.5V2l-4 3.5H2z" />
                  <line x1="1" y1="1" x2="15" y2="15" stroke="currentColor" strokeWidth="1.5" />
                </>
              )}
            </svg>
            <span className="aw-u">{soundOn ? "Sound On" : "Sound Off"}</span>
          </button>
        </div>

        {/* Right Navigation & Mode Toggle */}
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-6 text-[11px] font-semibold uppercase tracking-widest text-neutral-700">
            <button
              onClick={() => scrollTo("work")}
              className="hover:text-neutral-950 transition-colors cursor-pointer focus:outline-none"
            >
              <span className="aw-u">Work</span>
            </button>
            <button
              onClick={() => scrollTo("about")}
              className="hover:text-neutral-950 transition-colors cursor-pointer focus:outline-none"
            >
              <span className="aw-u">About</span>
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="hover:text-neutral-950 transition-colors cursor-pointer focus:outline-none"
            >
              <span className="aw-u">Contact</span>
            </button>
          </nav>

          {/* Dream Mode Switcher Pill */}
          <button
            onClick={() => {
              getSoundEngine().playTransition(currentMode === "awake");
              onToggleMode(currentMode === "awake" ? "dream" : "awake");
            }}
            className={`group relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[11px] font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              currentMode === "dream"
                ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                : "bg-neutral-900 text-white border-neutral-800 hover:bg-neutral-800 shadow-sm"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full transition-transform duration-300 ${
                currentMode === "dream"
                  ? "bg-indigo-500 animate-pulse scale-125"
                  : "bg-emerald-400"
              }`}
            />
            <span>{currentMode === "dream" ? "Awake Mode" : "Dream Mode"}</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => {
              getSoundEngine().playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden flex flex-col items-end gap-1.5 p-1 text-neutral-900 focus:outline-none cursor-pointer"
            aria-label="Open navigation menu"
          >
            <span
              className={`block w-6 h-[1.5px] bg-neutral-900 transition-transform duration-300 ${
                mobileMenuOpen ? "rotate-45 translate-y-[4.5px]" : ""
              }`}
            />
            <span
              className={`block w-4 h-[1.5px] bg-neutral-900 transition-opacity duration-300 ${
                mobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-[1.5px] bg-neutral-900 transition-transform duration-300 ${
                mobileMenuOpen ? "-rotate-45 -translate-y-[4.5px]" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[70px] bg-white/95 backdrop-blur-md border-b border-neutral-200/80 p-8 shadow-xl pointer-events-auto transition-all duration-300">
          <div className="flex flex-col items-start gap-6 text-[14px] font-semibold tracking-wider uppercase text-neutral-900">
            <button onClick={() => scrollTo("work")} className="w-full text-left py-2 border-b border-neutral-100">
              Work
            </button>
            <button onClick={() => scrollTo("about")} className="w-full text-left py-2 border-b border-neutral-100">
              About
            </button>
            <button onClick={() => scrollTo("contact")} className="w-full text-left py-2 border-b border-neutral-100">
              Contact
            </button>
            <div className="pt-2 flex items-center justify-between w-full">
              <LocalClock prefix="Tokyo" timeZone="Asia/Tokyo" />
              <button
                onClick={handleSoundToggle}
                className="text-[12px] uppercase text-neutral-600 font-medium"
              >
                {soundOn ? "Sound On" : "Sound Off"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
