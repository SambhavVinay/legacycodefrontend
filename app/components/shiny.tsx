"use client";

import { useEffect, useState } from "react";
import { AnimatedNumber } from "./animated-number";
import { BorderTrail } from "./border-trail";

export function BorderTrailBadge() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setValue(90);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    /* The Badge Container */
    <div className="relative flex flex-row items-center gap-1.5 overflow-hidden rounded-full bg-zinc-100/80 px-4 py-2 text font-medium text-zinc-900 backdrop-blur-sm dark:bg-zinc-800/80 dark:text-white border border-zinc-950/10 dark:border-zinc-50/20">
      {/* The Beam Animation - Now constrained to the pill shape */}
      <BorderTrail
        className="bg-linear-to-l from-blue-200 via-blue-500 to-blue-200 dark:from-blue-400 dark:via-blue-500 dark:to-blue-700"
        size={40} // Reduced size to fit the smaller badge better
      />

      <AnimatedNumber
        className="font-mono font-bold"
        springOptions={{
          bounce: 0,
          duration: 2000,
        }}
        value={value}
      />
      <span className="relative z-10">days on average</span>
    </div>
  );
}
