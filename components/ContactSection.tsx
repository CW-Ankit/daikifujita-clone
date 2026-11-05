"use client";

import React from "react";
import LocalClock from "./LocalClock";
import { getSoundEngine } from "@/lib/soundEngine";

export default function ContactSection() {
  const socials = [
    { name: "X (Twitter)", href: "https://x.com/da_san333" },
    { name: "GitHub", href: "https://github.com" },
    { name: "ReadCV", href: "https://read.cv" },
    { name: "Instagram", href: "https://instagram.com" },
  ];

  return (
    <footer id="contact" className="py-24 px-6 md:px-12 lg:px-20 border-t border-neutral-200 bg-neutral-900 text-white transition-colors duration-500">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        {/* Top Prompt */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-400">
              Get in Touch / Contact
            </span>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-medium tracking-tight text-white leading-tight">
              Have an idea or project in mind?{" "}
              <span className="font-serif italic font-normal text-neutral-400 block sm:inline">
                Let&apos;s create something remarkable.
              </span>
            </h2>

            <div className="pt-4">
              <a
                href="mailto:hello@daikifujita.com"
                onClick={() => getSoundEngine().playClick()}
                className="text-2xl sm:text-3xl lg:text-4xl font-mono text-neutral-200 hover:text-white transition-colors underline decoration-neutral-600 underline-offset-8 hover:decoration-white"
              >
                hello@daikifujita.com ↗
              </a>
            </div>
          </div>

          {/* Right info */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:border-l lg:border-neutral-800 lg:pl-10">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 block mb-2">
                Location &amp; Time
              </span>
              <p className="text-sm text-neutral-300 mb-2">Tokyo, Japan</p>
              <div className="text-white">
                <LocalClock prefix="Tokyo Local Time:" className="text-white!" />
              </div>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 block mb-2">
                Status
              </span>
              <div className="flex items-center gap-2 text-sm text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Taking select Q1/Q2 2026 inquiries</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="border-t border-neutral-800 pt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs font-mono text-neutral-400">
          <div className="flex flex-wrap items-center gap-6">
            {socials.map((s, idx) => (
              <a
                key={idx}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => getSoundEngine().playClick()}
                className="hover:text-white transition-colors uppercase tracking-wider"
              >
                {s.name} ↗
              </a>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-neutral-500">
            <span>© 2026 Daiki Fujita. All rights reserved.</span>
            <span className="hidden sm:inline">·</span>
            <span>Cloned with precision</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
