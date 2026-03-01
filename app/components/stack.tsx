"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

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
    image:
      "https://images.unsplash.com/photo-1551288049-bbda4865cda1?w=800&auto=format&fit=crop&q=80",
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
    image:
      "https://images.unsplash.com/photo-1503387762-592dea58ef21?w=800&auto=format&fit=crop&q=80",
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

export default function CardStackExample() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  return (
    <div
      className="relative flex items-center justify-center w-full min-h-[650px] py-10 outline-none"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <div
        className="relative flex items-center justify-center w-full max-w-6xl"
        onClick={() => setIsLocked(!isLocked)}
      >
        {features.map((feature, index) => {
          const totalCards = features.length;
          const isHoveringAny = hoveredIndex !== null || isLocked;

          // 1. Base Spread Calculation
          const baseSpacing = 160;
          const totalWidth = (totalCards - 1) * baseSpacing;
          let xPos = index * baseSpacing - totalWidth / 2;

          // 2. "Slide Aside" Logic
          const hoverOffset = 180;
          if (hoveredIndex !== null) {
            if (index < hoveredIndex) {
              xPos -= hoverOffset;
            } else if (index > hoveredIndex) {
              xPos += hoverOffset;
            }
          }

          // 3. Stacked (Initial) Positions
          const stackedX = index * 12 - totalCards * 6;
          const stackedY = index * 10;
          const stackedRotate = index * 2;

          return (
            <motion.div
              key={feature.id}
              onMouseEnter={() => setHoveredIndex(index)}
              animate={{
                x: isHoveringAny ? xPos : stackedX,
                y: isHoveringAny
                  ? hoveredIndex === index
                    ? -50
                    : 0
                  : stackedY,
                rotate: isHoveringAny
                  ? (index - (totalCards - 1) / 2) * 2
                  : stackedRotate,
                scale: hoveredIndex === index ? 1.05 : 1,
                zIndex: hoveredIndex === index ? 50 : 10 + (totalCards - index),
              }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 28,
                mass: 0.8,
              }}
              className={cn(
                "absolute w-[340px] rounded-3xl p-6",
                "bg-white dark:bg-neutral-900",
                "border border-neutral-100 dark:border-neutral-800",
                "shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]",
                "backdrop-blur-xl cursor-pointer",
              )}
              style={{
                left: "50%",
                marginLeft: "-170px",
              }}
            >
              <div className="relative z-10 h-full flex flex-col">
                {/* Header Specs Grid */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-4">
                  {feature.specs.map((spec) => (
                    <div key={spec.label} className="flex flex-col text-[10px]">
                      <span className="text-neutral-400 dark:text-neutral-500 uppercase tracking-widest font-semibold">
                        {spec.label}
                      </span>
                      <span className="font-bold text-neutral-900 dark:text-neutral-100 truncate">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Feature Image */}
                <div className="aspect-[16/10] w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800 mb-4">
                  <motion.img
                    src={feature.image}
                    alt={feature.title}
                    className="h-full w-full object-cover"
                    animate={{ scale: hoveredIndex === index ? 1.15 : 1 }}
                    transition={{ duration: 0.6 }}
                  />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <div className="inline-block px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tighter">
                    Step 0{index + 1}
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                    {feature.subtitle}
                  </p>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
