"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatedCardBackgroundHover } from "./components/features";
import { DialogCustomVariantsTransition } from "./components/waitlist";
import LegacyCodeVisualizer from "./components/deck";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
          >
            <motion.h1
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-white text-[10px] sm:text-xs uppercase tracking-[0.5em] mb-4 font-light opacity-70"
            >
              Legacy Code Visualizer
            </motion.h1>

            <div className="relative w-32 h-[1px] bg-white/10 overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: [0.65, 0, 0.35, 1],
                }}
                className="w-full h-full bg-white"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={!isLoading ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
        className="bg-black text-white"
      >
        <section className="max-w-7xl mx-auto py-20 px-6">
          <div className="flex flex-col items-center justify-center">
            <div className="w-full">
              <LegacyCodeVisualizer />
            </div>

            {/* --- START ANALYZING BUTTON --- */}
            <div className="mt-16 flex flex-col items-center gap-6">
              <Link href="/analyser">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative flex items-center gap-3 bg-[#fcfcfc] text-black px-10 py-4 rounded-full transition-all duration-300 overflow-hidden border border-white/10"
                >
                  {/* Applied Light Italic Here */}
                  <span className="text-[13px] italic font-bold tracking-[0.15em] relative z-10">
                    Start Analyzing
                  </span>

                  <motion.div
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    className="relative z-10"
                  >
                    <ArrowRight size={15} strokeWidth={1.5} />
                  </motion.div>

                  {/* Subtle Shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </motion.button>
              </Link>

              {/* Secondary Status Message in Light Italic */}
            </div>
            {/* ------------------------------ */}

            <div className="w-full space-y-20 flex flex-col items-center mt-32">
              <AnimatedCardBackgroundHover />
              <DialogCustomVariantsTransition />
            </div>
          </div>
        </section>
      </motion.main>
    </>
  );
}
