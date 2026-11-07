"use client";

import React, { useEffect, useRef, useState } from "react";
import { getSoundEngine } from "@/lib/soundEngine";

const PRE_INK = "#f4f2ee";
const PRE_PAPER = "#0b0b0c";

const PRE_CSS = `
.ds-pre {
  font-weight: 500;
  font-size: 16px;
  line-height: 1.3;
  color: ${PRE_INK};
  font-family: "Inter Tight", "Noto Sans JP", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  user-select: none;
  -webkit-user-select: none;
}
@media (max-width: 640px) {
  .ds-pre {
    font-size: 14px;
  }
}
.ds-pm {
  display: block;
  height: 1.3em;
  clip-path: inset(0 -30% 0 -30%);
}
.ds-pr {
  display: block;
  height: 1.3em;
  clip-path: inset(0 -30% 0 -30%);
  transform: translateY(100%);
  transition: transform 0.8s cubic-bezier(0.215, 0.61, 0.355, 1);
}
.ds-pr.is-in {
  transform: translateY(0);
}
.ds-pr.is-out {
  transform: translateY(100%);
  transition: transform 1.15s cubic-bezier(0.9, 0.05, 0.6, 0.85);
}
.ds-pr.is-up {
  transform: translateY(-100%);
  transition: transform 0.6s cubic-bezier(0.65, 0, 0.35, 1);
}
.ds-pl {
  display: block;
  position: relative;
  white-space: nowrap;
}
.ds-pl > span {
  display: block;
  height: 1.3em;
}
.ds-pl > span + span {
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
}
.ds-pcount {
  font-variant-numeric: tabular-nums;
  letter-spacing: 0;
}
.ds-penter {
  appearance: none;
  -webkit-appearance: none;
  background: none;
  border: 0;
  border-radius: 0;
  margin: 0;
  padding: 14px 18px;
  color: inherit;
  font: inherit;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  outline: none;
}
.ds-penter:focus-visible .ds-pm {
  outline: 1px solid rgba(244, 242, 238, 0.4);
  outline-offset: 6px;
}
.ds-pword {
  display: inline-block;
  margin: 0 0.3em;
}
@media (prefers-reduced-motion: reduce) {
  .ds-pr,
  .ds-pr.is-out,
  .ds-pr.is-up {
    transition-duration: 0.01s;
  }
}
`;

const prePad = (n: number) =>
  String(Math.max(0, Math.min(999, Math.round(n)))).padStart(3, "0");

interface PreloaderProps {
  onDone: () => void;
  prep?: () => Promise<void>;
}

export default function Preloader({ onDone, prep }: PreloaderProps) {
  const [count, setCount] = useState(0);
  const [cntOut, setCntOut] = useState(false);
  const [enterIn, setEnterIn] = useState(false);
  const [entered, setEntered] = useState(false);
  const [lifting, setLifting] = useState(false);
  const [faceIn, setFaceIn] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cntRef = useRef<HTMLDivElement>(null);
  const enterRef = useRef<HTMLDivElement>(null);
  const rollRef = useRef<HTMLSpanElement>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const pressRef = useRef<() => void>(() => {});
  const rollAn = useRef<Animation | null>(null);
  const away = useRef(true);
  const awayT = useRef<number | null>(null);
  const travel = useRef(0);

  // Lock scroll while preloader is active
  useEffect(() => {
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, []);

  // Fade in the counter initially
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setFaceIn(true);
    }, 120);
    return () => window.clearTimeout(timer);
  }, []);

  // Place counter across the track
  const placeCount = () => {
    const tr = trackRef.current;
    const c = cntRef.current;
    if (!tr || !c) return;
    travel.current = Math.max(0, tr.clientWidth - c.offsetWidth);
    const n = Math.min(1, count / 100);
    c.style.transform = `translate3d(${((1 - Math.pow(1 - n, 3)) * travel.current).toFixed(1)}px,-50%,0)`;
  };

  useEffect(placeCount, [count, faceIn]);

  useEffect(() => {
    window.addEventListener("resize", placeCount);
    return () => window.removeEventListener("resize", placeCount);
  }, []);

  // Main tick loop
  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let ready = !prep;
    if (prep) {
      const cap = new Promise((r) => setTimeout(r, 12000));
      const go = new Promise((r) => setTimeout(r, reduce ? 0 : 350)).then(() => prep());
      Promise.race([go.catch(() => {}), cap]).then(() => (ready = true));
    }

    const t0 = performance.now();
    const MIN = reduce ? 400 : 1800;
    const io = (x: number) =>
      x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

    let raf = 0;
    let last = -1;
    let readyK = 0;
    let lastSet = 0;
    let shown = false;
    let pressed = false;
    const timers: number[] = [];

    const LIFT = reduce ? 450 : 960;
    const DELAY = reduce ? 0 : 0.065;
    const ease = (x: number) =>
      x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    const riseAt = (p: number, u: number) => ease((p - u * DELAY) / (1 - DELAY)) * 1.04;

    const liftFrames = () => {
      const W = Math.max(1, window.innerWidth);
      const H = Math.max(1, window.innerHeight);
      const K = 36;
      const sheet: Keyframe[] = [];
      const mid: Keyframe[] = [];
      for (let i = 0; i <= K; i++) {
        const p = i / K;
        const rl = H * riseAt(p, 0);
        const rr = H * riseAt(p, 1);
        sheet.push({
          transform: `translate3d(0,${(-rl).toFixed(2)}px,0) skewY(${Math.atan((rl - rr) / W).toFixed(5)}rad)`,
        });
        mid.push({
          transform: `translate3d(0,${(-H * riseAt(p, 0.5)).toFixed(2)}px,0)`,
        });
      }
      return { sheet, mid };
    };

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      doneRef.current();
    };

    const lift = () => {
      const root = rootRef.current;
      const sh = sheetRef.current;
      if (root) root.style.pointerEvents = "none";
      if (!root || !sh || typeof sh.animate !== "function") return finish();
      const fr = liftFrames();
      sh.style.display = "block";
      const an = sh.animate(fr.sheet, { duration: LIFT, fill: "forwards" });
      enterRef.current?.animate?.(fr.mid, { duration: LIFT, fill: "forwards" });
      root.style.background = "transparent";
      setLifting(true);
      an.finished.then(finish, finish);
      timers.push(window.setTimeout(finish, LIFT + 600));
    };

    const press = () => {
      if (!shown || pressed) return;
      pressed = true;
      try {
        getSoundEngine().playClick();
      } catch {}
      window.dispatchEvent(new CustomEvent("ds:enter"));
      setEntered(true);
      timers.push(
        window.setTimeout(() => window.dispatchEvent(new CustomEvent("ds:reveal")), reduce ? 0 : 80)
      );
      timers.push(window.setTimeout(lift, reduce ? 0 : 260));
    };

    pressRef.current = press;

    const onKey = (e: KeyboardEvent) => {
      if (shown && !pressed && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        press();
      }
    };

    window.addEventListener("keydown", onKey);

    const tick = (now: number) => {
      const el = now - t0;
      readyK = Math.min(1, readyK + (ready ? 0.045 : 0));
      const tk = io(Math.min(1, el / MIN));
      const k = ready
        ? Math.max(Math.min(tk, 0.9), readyK)
        : Math.min(0.9, tk * 0.86 + (1 - Math.exp(-Math.max(0, el - MIN) / 2600)) * 0.04);
      const c = Math.min(100, Math.round(k * 100));

      if (c !== last && (now - lastSet > 90 || c === 100)) {
        last = c;
        lastSet = now;
        setCount(c);
      }

      if (ready && el > MIN && last >= 100) {
        timers.push(window.setTimeout(() => setCntOut(true), reduce ? 0 : 280));
        timers.push(
          window.setTimeout(() => {
            shown = true;
            setEnterIn(true);
          }, reduce ? 0 : 900)
        );
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [prep]);

  const onOver = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    if (awayT.current) window.clearTimeout(awayT.current);
    if (!away.current) return;
    away.current = false;
    const el = rollRef.current;
    if (!el || entered || typeof el.animate !== "function") return;
    rollAn.current?.cancel();
    rollAn.current = el.animate(
      [
        { transform: "translateY(0)" },
        { transform: "translateY(-100%)" },
      ],
      { duration: 400, easing: "cubic-bezier(.215,.61,.355,1)", fill: "forwards" }
    );
  };

  const onOut = () => {
    if (awayT.current) window.clearTimeout(awayT.current);
    awayT.current = window.setTimeout(() => {
      away.current = true;
      const el = rollRef.current;
      if (!el || entered || typeof el.animate !== "function") return;
      rollAn.current?.cancel();
      rollAn.current = el.animate(
        [
          { transform: "translateY(-100%)" },
          { transform: "translateY(0)" },
        ],
        { duration: 320, easing: "cubic-bezier(.215,.61,.355,1)", fill: "forwards" }
      );
    }, 120);
  };

  const M = "clamp(20px, 2.8vw, 48px)";
  const live = enterIn && !entered;
  const word = (
    <>
      [<span className="ds-pword">Enter</span>]
    </>
  );

  return (
    <div
      ref={rootRef}
      className="ds-pre"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "auto",
        background: lifting ? "transparent" : PRE_PAPER,
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: PRE_CSS }} />

      {/* Skewed lifting curtain */}
      <div
        ref={sheetRef}
        style={{
          position: "absolute",
          left: 0,
          top: "-100%",
          width: "100%",
          height: "200%",
          background: PRE_PAPER,
          transformOrigin: "0 100%",
          willChange: "transform",
          display: lifting ? "block" : "none",
        }}
      />

      {/* Counter track along vertical center */}
      <div
        ref={trackRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          left: M,
          right: M,
          top: "50%",
          height: 0,
        }}
      >
        <div
          ref={cntRef}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            transform: "translate3d(0,-50%,0)",
            transition: "transform .6s cubic-bezier(.19,1,.22,1)",
            willChange: "transform",
          }}
        >
          <span className="ds-pm">
            <span className={"ds-pr" + (faceIn && !cntOut ? " is-in" : "") + (cntOut ? " is-out" : "")}>
              <span className="ds-pl">
                <span className="ds-pcount">{prePad(count)}</span>
              </span>
            </span>
          </span>
        </div>
      </div>

      {/* Enter button */}
      <div
        ref={enterRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          pointerEvents: "none",
        }}
      >
        <button
          type="button"
          className="ds-penter"
          aria-label="Enter"
          tabIndex={live ? 0 : -1}
          onClick={() => pressRef.current()}
          onPointerEnter={onOver}
          onPointerLeave={onOut}
          style={{ pointerEvents: live ? "auto" : "none" }}
        >
          <span className="ds-pm">
            <span className={"ds-pr" + (live ? " is-in" : "") + (entered ? " is-up" : "")}>
              <span className="ds-pl" ref={rollRef}>
                <span>{word}</span>
                <span aria-hidden="true">{word}</span>
              </span>
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
