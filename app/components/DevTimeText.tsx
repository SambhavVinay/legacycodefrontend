"use client";
import { useState, useEffect } from "react";
import { TextEffect } from "./text-effect";

export function TextEffectWithExit() {
  // 1. Set the initial state to true so it animates in immediately
  const [trigger, setTrigger] = useState(true);

  // 2. Removed the setInterval logic that was toggling the visibility
  // If you want it to re-trigger once on mount, you can keep the useEffect
  // but remove the interval. Otherwise, you can remove this block entirely.
  useEffect(() => {
    setTrigger(true);
  }, []);

  const blurSlideVariants = {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.03 },
      },
    },
    item: {
      hidden: {
        opacity: 0,
        filter: "blur(10px) brightness(0%)",
        y: 0,
      },
      visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px) brightness(100%)",
        transition: {
          duration: 1.0,
        },
      },
    },
  };

  return (
    <div className="flex flex-col text-2xl font-medium items-center justify-center">
      <TextEffect per="char" variants={blurSlideVariants} trigger={trigger}>
        How long do developers spend
      </TextEffect>
      <TextEffect per="char" variants={blurSlideVariants} trigger={trigger}>
        understanding legacy code?
      </TextEffect>
    </div>
  );
}
