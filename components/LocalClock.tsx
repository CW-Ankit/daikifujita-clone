"use client";

import React, { useEffect, useState, startTransition } from "react";

interface LocalClockProps {
  timeZone?: string;
  prefix?: string;
  seconds?: boolean;
  color?: string;
  className?: string;
}

function format(date: Date, timeZone: string, seconds: boolean): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: seconds ? "2-digit" : undefined,
      hour12: false,
    }).format(date);
  } catch {
    return date.toTimeString().slice(0, seconds ? 8 : 5);
  }
}

export default function LocalClock({
  timeZone = "Asia/Tokyo",
  prefix = "Tokyo",
  seconds = true,
  className = "",
}: LocalClockProps) {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    startTransition(() => setNow(new Date()));
    const id = window.setInterval(() => {
      startTransition(() => setNow(new Date()));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span
      className={`relative inline-flex items-center gap-2 whitespace-nowrap min-w-max tabular-nums text-[11px] font-semibold tracking-wider uppercase text-neutral-800 ${className}`}
    >
      {prefix && <span>{prefix}</span>}
      <time suppressHydrationWarning>{format(now, timeZone, seconds)}</time>
    </span>
  );
}
