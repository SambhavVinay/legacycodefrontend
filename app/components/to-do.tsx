"use client";
import React from "react";
import { motion } from "framer-motion";
import { Upload, Search, Map, Layout, Code2, CheckCircle2 } from "lucide-react";

type StepProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  stepNumber: number;
  details: string[];
  isLeft: boolean;
};

const TimelineStep: React.FC<StepProps> = ({
  icon: Icon,
  title,
  description,
  stepNumber,
  details,
  isLeft,
}) => {
  return (
    <div className={`relative flex w-full mb-24 justify-center items-center`}>
      {/* The Central Path Connector (Trunk) */}
      <div className="absolute left-1/2 top-0 h-[calc(100%+6rem)] w-px bg-gradient-to-b from-blue-500/50 via-zinc-800 to-transparent -translate-x-1/2 hidden md:block" />

      {/* Content Container */}
      <div
        className={`flex items-center w-full max-w-4xl ${isLeft ? "flex-row-reverse" : "flex-row"}`}
      >
        {/* The Card */}
        <motion.div
          initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className={`w-full md:w-[45%] p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-blue-500/50 transition-all duration-500 group relative`}
        >
          {/* Connecting Branch Line */}
          <div
            className={`absolute top-1/2 ${isLeft ? "-right-4" : "-left-4"} w-4 h-px bg-zinc-700 hidden md:block`}
          />

          <span className="text-[10px] font-mono text-blue-500 uppercase tracking-tighter mb-2 block">
            Phase 0{stepNumber}
          </span>
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed mb-4">
            {description}
          </p>

          <div className="flex flex-wrap gap-2">
            {details.map((detail, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-1 bg-zinc-800 rounded text-zinc-500 border border-zinc-700/50"
              >
                {detail}
              </span>
            ))}
          </div>
        </motion.div>

        {/* The Center Node (Fruit/Joint) */}
        <div className="z-10 flex items-center justify-center w-12 h-12 mx-4 md:mx-8 rounded-full bg-black border-2 border-zinc-800 group-hover:border-blue-500 transition-all shadow-[0_0_20px_rgba(0,0,0,1)]">
          <Icon className="w-5 h-5 text-zinc-500 group-hover:text-blue-400" />
        </div>

        {/* Empty Space for the other side */}
        <div className="hidden md:block w-[45%]" />
      </div>
    </div>
  );
};

const LegacyProcessTimeline = () => {
  const steps = [
    {
      icon: Upload,
      title: "Upload Code",
      description:
        "Drop in your old Python files or messy scripts. We handle the heavy lifting of reading the data.",
      details: ["Secure Upload", "Multi-file Support"],
    },
    {
      icon: Search,
      title: "Find the Logic",
      description:
        "Our AI strips away the junk to find the actual rules that make your business run.",
      details: ["Logic Extraction", "Noise Removal"],
    },
    {
      icon: Map,
      title: "Visual Map",
      description:
        "We turn that logic into a clear map so you can actually see how data moves.",
      details: ["Mermaid Diagrams", "Flow Analysis"],
    },
    {
      icon: Layout,
      title: "New Structure",
      description:
        "We set up a fresh, modern project using today's best practices and clean folders.",
      details: ["FastAPI Setup", "Pydantic Models"],
    },
    {
      icon: Code2,
      title: "Modern Rewrite",
      description:
        "The old logic is filled back into the new structure—clean, fast, and easy to read.",
      details: ["Clean Code", "Type Hinting"],
    },
    {
      icon: CheckCircle2,
      title: "Test & Verify",
      description:
        "Finally, we run tests to prove the new code does exactly what the old code did.",
      details: ["Behavior Parity", "Pytest Suite"],
    },
  ];

  return (
    <section className="bg-black py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-24">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
            Our{" "}
            <span className="text-blue-500 underline decoration-blue-500/20 underline-offset-8">
              Process Tree
            </span>
          </h1>
          <p className="mt-4 text-zinc-500 max-w-md mx-auto">
            From tangled legacy roots to clean, modern architecture.
          </p>
        </div>

        <div className="relative mt-20">
          {steps.map((step, index) => (
            <TimelineStep
              key={index}
              stepNumber={index + 1}
              isLeft={index % 2 === 0}
              {...step}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LegacyProcessTimeline;
