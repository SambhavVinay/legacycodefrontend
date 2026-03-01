"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { TextEffect } from "./text-effect";
import { AnimatedNumber } from "./animated-number";

// --- Types ---
interface Specification {
  label: string;
  value: string;
}

interface Feature {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  specs: Specification[];
  description: string;
}

// --- Data ---
const features: Feature[] = [
  {
    id: "step-1-ingestion",
    title: "Code Ingestion",
    subtitle: "Legacy Source Upload",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    specs: [
      { label: "Input", value: "Python / Script" },
      { label: "Process", value: "Concurrent Read" },
      { label: "Security", value: "Byte-Stream" },
      { label: "Encoder", value: "UTF-8 / Raw" },
    ],
    description:
      "Send your legacy files through our secure portal. We read and prepare multiple files simultaneously for analysis.",
  },
  {
    id: "step-2-archaeology",
    title: "Logic Extraction",
    subtitle: "The Archaeology Phase",
    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop&q=80",
    specs: [
      { label: "Engine", value: "Gemini 3 Flash" },
      { label: "Focus", value: "Pure Logic" },
      { label: "Output", value: "JSON Manifest" },
      { label: "Side-Effects", value: "Isolated" },
    ],
    description:
      "We strip away years of messy boilerplate code to find the core business rules that actually run your system.",
  },
  {
    id: "step-3-mapping",
    title: "Visual Mapping",
    subtitle: "Architectural Clarity",
    image: "/mermaid02.png",
    specs: [
      { label: "Diagram", value: "Mermaid.js" },
      { label: "Grouping", value: "Logical Nodes" },
      { label: "Flow", value: "Data-Centric" },
      { label: "Export", value: "SVG / Live" },
    ],
    description:
      "The extracted logic is turned into a visual flowchart, showing exactly how data moves through your legacy architecture.",
  },
  {
    id: "step-4-reconstruction",
    title: "Modern Architect",
    subtitle: "FastAPI Generation",
    image: "/arc.png",
    specs: [
      { label: "Framework", value: "FastAPI" },
      { label: "Validation", value: "Pydantic V2" },
      { label: "Testing", value: "Pytest Suite" },
      { label: "Standard", value: "Clean-Code" },
    ],
    description:
      "Finally, your logic is rebuilt into a modern, production-ready Python service with 100% behavioral parity.",
  },
];

export default function LegacyCodeVisualizer() {
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [trigger, setTrigger] = useState(true);
  const [numberValue, setNumberValue] = useState(0);

  // Derived state for the layout shift
  const isInteracting = hoveredCardIndex !== null || isLocked;

  useEffect(() => {
    setTrigger(true);
    const timer = setTimeout(() => setNumberValue(90), 1000);
    return () => clearTimeout(timer);
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
      hidden: { opacity: 0, filter: "blur(10px) brightness(0%)", y: 0 },
      visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px) brightness(100%)",
        transition: { duration: 1.0 },
      },
    },
  };

  return (
    <div className="w-full min-h-screen bg-neutral-50 dark:bg-black p-8 flex items-center justify-center overflow-hidden">
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className={cn(
          "flex w-full max-w-7xl gap-6 items-center justify-center",
          isInteracting ? "flex-col" : "flex-row",
        )}
      >
        {/* HEADER SECTION */}
        <motion.div
          layout
          className="flex flex-col items-center justify-center gap-4 shrink-0"
        >
          <motion.div
            layout
            className="flex flex-col text-2xl md:text-3xl font-medium items-center justify-center text-center tracking-tight"
          >
            <TextEffect
              per="char"
              variants={blurSlideVariants}
              trigger={trigger}
            >
              How long do developers spend
            </TextEffect>
            <TextEffect
              per="char"
              variants={blurSlideVariants}
              trigger={trigger}
            >
              understanding legacy code?
            </TextEffect>
          </motion.div>

          <motion.div
            layout
            className="flex items-center justify-center gap-3 text-2xl"
          >
            <AnimatedNumber
              className="inline-flex items-center font-mono text-3xl font-light text-zinc-800 dark:text-zinc-50"
              springOptions={{ bounce: 0, duration: 2000 }}
              value={numberValue}
            />
            <p className="text-zinc-800 dark:text-zinc-50 font-light italic opacity-80">
              days on average
            </p>
          </motion.div>

          {/* DYNAMIC INSTRUCTION TEXT */}
          <div className="h-8 flex items-center justify-center">
            <AnimatePresence>
              {isInteracting && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-blue-500/10 border border-blue-500/20 px-4 py-1 rounded-full shadow-sm"
                >
                  <p className="text-blue-500 text-xs font-mono tracking-tighter uppercase font-bold">
                    Here is how to use our application
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* INTERACTIVE CARD STACK SECTION */}
        <motion.div
          layout
          className="relative flex items-center justify-center w-full min-h-[600px] outline-none"
          onMouseLeave={() => setHoveredCardIndex(null)}
        >
          <div
            className="relative flex items-center justify-center w-full"
            onClick={() => setIsLocked(!isLocked)}
          >
            {features.map((feature, index) => {
              const totalCards = features.length;
              const isHoveringAny = hoveredCardIndex !== null || isLocked;

              const baseSpacing = 160;
              const totalWidth = (totalCards - 1) * baseSpacing;
              let xPos = index * baseSpacing - totalWidth / 2;

              const hoverOffset = 180;
              if (hoveredCardIndex !== null) {
                if (index < hoveredCardIndex) xPos -= hoverOffset;
                else if (index > hoveredCardIndex) xPos += hoverOffset;
              }

              const stackedX = index * 12 - totalCards * 6;
              const stackedY = index * 10;
              const stackedRotate = index * 2;

              return (
                <motion.div
                  key={feature.id}
                  layout
                  onMouseEnter={() => setHoveredCardIndex(index)}
                  animate={{
                    x: isHoveringAny ? xPos : stackedX,
                    y: isHoveringAny
                      ? hoveredCardIndex === index
                        ? -40
                        : 0
                      : stackedY,
                    rotate: isHoveringAny
                      ? (index - (totalCards - 1) / 2) * 2
                      : stackedRotate,
                    scale: hoveredCardIndex === index ? 1.05 : 1,
                    zIndex:
                      hoveredCardIndex === index
                        ? 50
                        : 10 + (totalCards - index),
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 220,
                    damping: 28,
                    mass: 0.8,
                  }}
                  className={cn(
                    "absolute w-[340px] rounded-[2rem] p-6 shadow-2xl transition-colors duration-300",
                    "bg-white dark:bg-zinc-900",
                    "border border-zinc-100 dark:border-zinc-800",
                    hoveredCardIndex === index
                      ? "border-blue-500/40"
                      : "border-zinc-100 dark:border-zinc-800",
                    "backdrop-blur-xl cursor-pointer select-none",
                  )}
                  style={{ left: "50%", marginLeft: "-170px" }}
                >
                  <div className="relative z-10 h-full flex flex-col">
                    {/* Header Specs Grid */}
                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 border-b border-zinc-100 dark:border-zinc-800 pb-5 mb-5">
                      {feature.specs.map((spec) => (
                        <div
                          key={spec.label}
                          className="flex flex-col text-[10px]"
                        >
                          <span className="text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-bold">
                            {spec.label}
                          </span>
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Feature Image */}
                    <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-5">
                      <motion.img
                        src={feature.image}
                        alt={feature.title}
                        className="h-full w-full object-cover"
                        animate={{
                          scale: hoveredCardIndex === index ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                        Step 0{index + 1}
                      </div>
                      <h3 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white leading-none">
                        {feature.title}
                      </h3>
                      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        {feature.subtitle}
                      </p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed line-clamp-3">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
