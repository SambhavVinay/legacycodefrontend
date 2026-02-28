"use client";

import { useState, useRef } from "react";
import {
  Code2,
  Upload as UploadIcon,
  FileCode,
  Loader2,
  Sparkles,
  ChevronDown,
  Trash2,
  Cpu,
} from "lucide-react";
import MermaidChart from "./components/MermaidChart";
import ManifestViewer from "./components/ManifestViewer";
import FileTreeViewer from "./components/FileTreeViewer";

interface FileMappingResult {
  filename: string;
  logic_manifest: string;
  mermaid_code: string;
}

interface MappingResponse {
  results: FileMappingResult[];
}

interface ReconstructResponse {
  scaffold: string;
  logic: string;
  tests: string;
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white selection:bg-indigo-500/30">
      <header className="border-b border-white/8 backdrop-blur-md sticky top-0 z-20 bg-[#0d0d0f]/80">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/40">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold tracking-tight text-sm">
              Legacy<span className="text-indigo-400">Archaeologist</span>
            </span>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-28 pb-20 px-6 flex flex-col items-center text-center">
        {/* Background blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-indigo-700 rounded-full mix-blend-multiply filter blur-[120px] opacity-25 animate-blob" />
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-violet-700 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute top-40 left-1/2 w-72 h-72 bg-blue-700 rounded-full mix-blend-multiply filter blur-[100px] opacity-15 animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 space-y-7 max-w-3xl mx-auto animate-fade-up">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] text-balance">
            Bring your{" "}
            <span className="animate-shimmer bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-400 bg-clip-text text-transparent">
              legacy code
            </span>
            <br />
            into the present.
          </h1>

          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Paste old Python 2 code and receive clean, idiomatic{" "}
            <code className="text-indigo-300 font-mono text-sm bg-indigo-500/10 px-1.5 py-0.5 rounded">
              Python 3
            </code>{" "}
            — with zero logic loss.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1 animate-fade-up delay-200">
            <a
              href="/analyser"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            >
              Start converting
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 mt-20 flex items-center gap-12 md:gap-20 animate-fade-up delay-300">
          <Stat value="4" label="Languages" />
          <div className="w-px h-10 bg-white/10" />
          <Stat value="100%" label="Logic preserved" />
          <div className="w-px h-10 bg-white/10" />
          <Stat value="&lt;30s" label="Per file" />
        </div>

        {/* Gradient fade */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#0a0a0b] to-transparent" />
      </section>

      {/* ── Feature pills ───────────────────────────────────────── */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-white/[0.05]">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: <Code2 className="w-5 h-5 text-indigo-400" />,
              title: "Manifest-first",
              desc: "Every refactor is grounded in an extracted logic manifest — not a guess.",
            },
            {
              icon: <Sparkles className="w-5 h-5 text-violet-400" />,
              title: "AI reconstructed",
              desc: "GPT-4o rebuilds idiomatic Python from the manifest, ensuring correctness.",
            },
            {
              icon: <Zap className="w-5 h-5 text-sky-400" />,
              title: "Test scaffolded",
              desc: "Unit-test stubs are generated alongside every converted module.",
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-white/[0.05] flex items-center justify-center mb-4">
                {icon}
              </div>
              <h3 className="font-semibold text-sm mb-1.5">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-white/20 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>
      {expanded && (
        <div className="p-6 pt-0 border-t border-white/5 mt-4">{children}</div>
      )}
    </div>
  );
}
