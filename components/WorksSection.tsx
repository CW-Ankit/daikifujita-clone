"use client";

import React, { useState } from "react";
import Image from "next/image";
import { getSoundEngine } from "@/lib/soundEngine";

export interface WorkItem {
  number: string;
  title: string;
  type: string;
  category: string;
  stack: string;
  year: string;
  summary: string;
  summaryJa: string;
  link: string;
  image: string;
  gallery: string[];
}

const WORKS: WorkItem[] = [
  {
    number: "01",
    title: "Portfolio v2",
    type: "Portfolio",
    category: "Web Design / 3D / Motion / Interaction / Game Design / Development",
    stack: "Next.js · React · Three.js / WebGL · Tailwind CSS",
    year: "2026",
    summary:
      "A portfolio to be read two ways — awake, guided through the work by a single shard of memory, or asleep, as a 3D dream you play to win the work back.",
    summaryJa:
      "1つの記憶のかけらに導かれて作品を巡る「うつつモード」と、3Dの夢の中を進んで作品を取り戻す「夢モード」。2つの読み方ができるポートフォリオです。",
    link: "https://daikifujita.com",
    image: "/images/1bkjcB7uulAIeieaHzJp5p1WdYU.jpg",
    gallery: [
      "/images/1bkjcB7uulAIeieaHzJp5p1WdYU.jpg",
      "/images/oZhLWSQiqzCKxPj2uJ2PS8ho3Ws.jpg",
      "/images/x6rr6x1liWTupTGPNU2xHZe8JgM.jpg",
      "/images/611gL5CAewt55d7dmI5W5Gia63o.jpg",
      "/images/JVWQ3agwcwmypTve5a6YLa33s1M.jpg",
      "/images/RBGTeahGd2LLOXochxGjvzC7ajo.jpg",
      "/images/BV6BKgjLy2PZ4S3xtgmOlDR1Jw.jpg",
      "/images/ncNHc7pq0Mvd2ZFyknSiCAqWos0.jpg",
      "/images/kjrYLHZylOUeEqaBysdoNUI5as.jpg",
      "/images/j3y2XlxYnRSo69gK3QQtk6bbM.jpg",
    ],
  },
  {
    number: "02",
    title: "INCEPTURE",
    type: "Gallery Site",
    category: "Concept / Direction / 3D / WebGL / Development",
    stack: "Next.js · Three.js · GLSL Shaders",
    year: "2025",
    summary:
      "An experimental virtual gallery exploring speculative architectural dimensions, sound-reactive installations, and real-time volumetric light.",
    summaryJa:
      "架空の建築空間と音響インスタレーションを巡る実験的バーチャルギャラリーサイト。リアルタイムボリュメトリックライトと音響連動シェーダーを実装。",
    link: "https://incepture.da-san333.com",
    image: "/images/UwSYwpPkghWNn8uZekuo1xu6Vc.png",
    gallery: [
      "/images/UwSYwpPkghWNn8uZekuo1xu6Vc.png",
      "/images/AqPrIAj3C029YwmTUD4sorBUB6c.webp",
      "/images/d4DjqBYN6dgCm8vSLLoRDXPKgUA.webp",
      "/images/LOrMHVuJjNRLpss65RfAjcasSQ.webp",
    ],
  },
  {
    number: "03",
    title: "Portfolio v1",
    type: "Portfolio",
    category: "Design / Motion / Interaction / Frontend",
    stack: "React · Canvas 2D · Web Audio",
    year: "2025",
    summary:
      "First iteration of the digital identity exploring generative patterns, kinetic typography, and tactile cursor physics.",
    summaryJa:
      "生成パターン、キネティックタイポグラフィ、物理挙動を取り入れたファーストエディションポートフォリオ。",
    link: "https://da-san333.com",
    image: "/images/6bqqivg1une0B2aPLSjxvyhqXs.png",
    gallery: [
      "/images/6bqqivg1une0B2aPLSjxvyhqXs.png",
      "/images/ZEMZ4YXib37UdgePmyiuUFkkiE.jpg",
      "/images/fbErcDX5kCXGoYwIdwx9IkXOE.webp",
    ],
  },
];

export default function WorksSection() {
  const [activeModal, setActiveModal] = useState<WorkItem | null>(null);

  const openModal = (work: WorkItem) => {
    getSoundEngine().playClick();
    setActiveModal(work);
  };

  const closeModal = () => {
    getSoundEngine().playClick();
    setActiveModal(null);
  };

  return (
    <section id="work" className="py-24 px-6 md:px-12 lg:px-20 border-t border-neutral-200">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-16">
        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-400 block mb-2">
            Selected Works (2025 — 2026)
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-medium tracking-tight text-neutral-900">
            Work Archive
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-neutral-500 font-mono">
          [ 03 Selected Pieces ]
        </p>
      </div>

      {/* Works List */}
      <div className="flex flex-col divide-y divide-neutral-200">
        {WORKS.map((work) => (
          <article
            key={work.number}
            className="group py-16 first:pt-4 transition-colors duration-300"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Meta details */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full gap-8">
                <div>
                  <div className="flex items-center gap-4 text-xs font-mono text-neutral-400 mb-3">
                    <span>{work.number}</span>
                    <span>/</span>
                    <span>{work.year}</span>
                    <span>—</span>
                    <span>{work.type}</span>
                  </div>

                  <h3
                    onClick={() => openModal(work)}
                    className="text-3xl sm:text-4xl font-sans font-medium text-neutral-900 group-hover:text-neutral-600 transition-colors cursor-pointer"
                  >
                    {work.title}
                  </h3>

                  <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider mt-2 mb-4">
                    {work.category}
                  </p>

                  <p className="text-sm sm:text-base text-neutral-600 leading-relaxed mb-3">
                    {work.summary}
                  </p>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {work.summaryJa}
                  </p>
                </div>

                <div className="flex items-center gap-6 pt-4 border-t border-neutral-100">
                  <button
                    onClick={() => openModal(work)}
                    className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-900 hover:text-neutral-600 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span className="aw-u">View Gallery</span>
                    <span>→</span>
                  </button>

                  <a
                    href={work.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-neutral-700 transition-colors"
                  >
                    Live Site ↗
                  </a>
                </div>
              </div>

              {/* Main Image Banner with Hover Perspective */}
              <div
                onClick={() => openModal(work)}
                className="lg:col-span-7 relative overflow-hidden rounded-sm bg-neutral-100 cursor-pointer aspect-16/10 shadow-sm transition-transform duration-700 ease-out group-hover:scale-[1.01]"
              >
                <Image
                  src={work.image}
                  alt={work.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/10 transition-colors duration-300" />
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Case Study Modal Drawer */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-neutral-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-md shadow-2xl overflow-y-auto p-6 sm:p-10 flex flex-col gap-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-neutral-200 pb-6 sticky top-0 bg-white z-20">
              <div>
                <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-1">
                  {activeModal.number} — {activeModal.type} ({activeModal.year})
                </div>
                <h3 className="text-2xl sm:text-3xl font-sans font-medium text-neutral-900">
                  {activeModal.title}
                </h3>
                <p className="text-xs font-mono text-neutral-500 mt-1">
                  {activeModal.stack}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="p-2 text-neutral-500 hover:text-neutral-900 text-lg font-mono focus:outline-none cursor-pointer"
                aria-label="Close modal"
              >
                ✕ [ESC]
              </button>
            </div>

            {/* Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-neutral-600 leading-relaxed">
              <p>{activeModal.summary}</p>
              <p className="text-xs text-neutral-500">{activeModal.summaryJa}</p>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {activeModal.gallery.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-16/10 rounded-sm overflow-hidden bg-neutral-100 shadow-sm"
                >
                  <Image
                    src={img}
                    alt={`${activeModal.title} shot ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
              <a
                href={activeModal.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono uppercase tracking-wider font-semibold text-neutral-900 hover:opacity-70 transition-opacity"
              >
                Open Project in New Tab ↗
              </a>
              <button
                onClick={closeModal}
                className="text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-neutral-900"
              >
                Close Gallery
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
