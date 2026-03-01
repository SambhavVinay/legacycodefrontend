"use client";
import { useEffect, useState } from "react";
import { AnimatedNumber } from "./animated-number";

export function AnimatedNumberBasic() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setValue(90);
    }, 1000);
  }, []);

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex flex-row items-center justify-center gap-2 text-2xl">
        <AnimatedNumber
          className="inline-flex items-center font-mono text-2xl font-light text-zinc-800 dark:text-zinc-50"
          springOptions={{
            bounce: 0,
            duration: 2000,
          }}
          value={value}
        />
        <p> days on average</p>
      </div>
    </div>
  );
}
