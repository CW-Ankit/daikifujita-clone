"use client";

import React from "react";
import Link from "next/link";
import ShardOfMemory from "@/components/ShardOfMemory";
import LocalClock from "@/components/LocalClock";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111111] flex flex-col justify-between p-6 sm:p-12 selection:bg-neutral-900 selection:text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <Link href="/" className="font-sans text-[13px] font-semibold tracking-wider uppercase text-neutral-900 hover:opacity-70 transition-opacity">
          Daiki Fujita
        </Link>
        <LocalClock prefix="Tokyo" timeZone="Asia/Tokyo" />
      </div>

      {/* Main Void */}
      <div className="my-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center max-w-5xl mx-auto py-12">
        <div className="md:col-span-7 flex flex-col gap-6">
          <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
            [ ERROR 404 // MEMORY SHARD UNLOCATED ]
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-medium text-neutral-900 leading-tight">
            Lost in the threshold of dreams.
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
            The page or fragment you are seeking has vanished from this waking reality. Follow the shard back to the waking world.
          </p>

          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-neutral-900 text-white font-mono text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-sm"
            >
              <span>← Return to Reality</span>
            </Link>
          </div>
        </div>

        <div className="md:col-span-5 h-[320px] sm:h-[380px] relative flex items-center justify-center">
          <ShardOfMemory />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-neutral-200 pt-4 flex items-center justify-between text-[11px] font-mono text-neutral-400 uppercase">
        <span>© 2026 Daiki Fujita</span>
        <span>Tokyo, Japan</span>
      </div>
    </div>
  );
}
