"use client";

import React, { useEffect, useState, useRef } from "react";
import { getSoundEngine } from "@/lib/soundEngine";

interface RetroModeProps {
  onExit: () => void;
}

export default function RetroMode({ onExit }: RetroModeProps) {
  const [score, setScore] = useState(1280);
  const [playerX, setPlayerX] = useState(50);
  const [dialogue, setDialogue] = useState("DAIKI FUJITA // 8-BIT QUEST MODE INITIALIZED");

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") {
        setPlayerX((x) => Math.max(10, x - 5));
        getSoundEngine().playClick();
      }
      if (e.key === "ArrowRight" || e.key === "d") {
        setPlayerX((x) => Math.min(90, x + 5));
        getSoundEngine().playClick();
      }
      if (e.key === " " || e.key === "Enter") {
        setScore((s) => s + 100);
        getSoundEngine().playShimmer(440);
        setDialogue("MEMORY PIXEL COLLECTED! +100 EXP");
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#0d091a] text-[#86e3ce] font-mono flex flex-col justify-between p-6 sm:p-12 overflow-hidden select-none">
      {/* CRT Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px] z-20" />
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.85)] z-20" />

      {/* Header */}
      <div className="relative z-30 flex items-center justify-between border-b-2 border-[#86e3ce] pb-4">
        <div className="flex items-center gap-4">
          <span className="text-xl animate-pulse">★</span>
          <span className="text-sm sm:text-base font-bold tracking-widest uppercase">
            RETRO_MODE // TOKYO_1989
          </span>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-sm tracking-wider">SCORE: {score.toString().padStart(6, "0")}</span>
          <button
            onClick={() => {
              getSoundEngine().playClick();
              onExit();
            }}
            className="px-3 py-1 bg-[#86e3ce] text-[#0d091a] font-bold text-xs uppercase hover:bg-white transition-colors cursor-pointer"
          >
            [ EXIT ]
          </button>
        </div>
      </div>

      {/* 8-bit Mini Game Field */}
      <div className="relative z-10 my-auto h-[320px] border-2 border-[#86e3ce]/40 rounded bg-[#080512] flex items-center justify-center overflow-hidden">
        {/* Pixel Stars */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#86e3ce_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* 8-bit Shard Target */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
          <div className="w-8 h-8 rotate-45 border-2 border-[#ffdd53] bg-[#ffdd53]/30 shadow-[0_0_15px_#ffdd53]" />
          <span className="text-[10px] text-[#ffdd53] mt-3 uppercase tracking-widest">
            [ SHARD_NODE_01 ]
          </span>
        </div>

        {/* Player Avatar */}
        <div
          className="absolute bottom-10 -translate-x-1/2 transition-all duration-100 flex flex-col items-center"
          style={{ left: `${playerX}%` }}
        >
          <div className="text-2xl">▲</div>
          <div className="w-6 h-3 bg-[#86e3ce] shadow-[0_0_10px_#86e3ce]" />
          <span className="text-[9px] uppercase tracking-wider text-[#86e3ce] mt-1">DF_UNIT</span>
        </div>
      </div>

      {/* Retro Dialogue Box */}
      <div className="relative z-30 border-2 border-[#86e3ce] bg-[#0d091a]/90 p-4 rounded text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="tracking-wide">
          &gt; {dialogue}
        </p>
        <span className="text-[10px] text-[#86e3ce]/60 uppercase tracking-widest shrink-0">
          [ PRESS LEFT/RIGHT TO MOVE, SPACE TO ENGAGE ]
        </span>
      </div>
    </div>
  );
}
