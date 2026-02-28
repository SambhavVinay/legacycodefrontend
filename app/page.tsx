"use client";

import { useState } from "react";
import {
  Code2,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  Zap,
  Terminal,
} from "lucide-react";

// --- Sub-Components (Keep the main file clean) ---

const FeatureCard = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <div className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 hover:bg-white/[0.04] hover:border-indigo-500/30 transition-all duration-300">
    <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="font-semibold text-sm mb-1.5 text-white/90">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

export default function Home() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white selection:bg-indigo-500/30 font-sans">
      {/* --- Navigation --- */}
      <header className="border-b border-white/5 backdrop-blur-md sticky top-0 z-50 bg-[#0d0d0f]/80">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/40">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold tracking-tight text-sm uppercase">
              Legacy<span className="text-indigo-400">Archaeologist</span>
            </span>
          </div>
          <nav className="hidden md:flex gap-6 text-xs font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">
              Methodology
            </a>
            <a href="#docs" className="hover:text-white transition-colors">
              Documentation
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* --- Hero Section --- */}
        <section className="relative pt-32 pb-20 px-6 flex flex-col items-center text-center">
          {/* Animated Background Blobs */}
          <div className="absolute inset-0 overflow-hidden -z-10">
            <div className="absolute -top-24 left-1/4 w-96 h-96 bg-indigo-700/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute top-0 right-1/4 w-80 h-80 bg-violet-700/10 rounded-full blur-[120px] animate-pulse delay-700" />
          </div>

          <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-tight">
              Resurrect your{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-400 bg-clip-text text-transparent">
                legacy code
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Automated Python 2 to 3 migration using
              <span className="text-indigo-300 font-mono mx-2 underline underline-offset-4 decoration-indigo-500/30">
                Logic Manifest Extraction
              </span>
              to ensure zero semantic drift.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
                Start Analysis
              </button>
              <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-bold transition-all">
                View Sample
              </button>
            </div>
          </div>
        </section>

        {/* --- Features Grid --- */}
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Terminal className="w-5 h-5 text-indigo-400" />}
              title="Manifest-First"
              desc="We extract a declarative logic manifest before writing a single line of Python 3."
            />
            <FeatureCard
              icon={<Sparkles className="w-5 h-5 text-violet-400" />}
              title="AI Reconstruction"
              desc="Utilizing GPT-4o to rebuild idiomatic structures based strictly on the extracted manifest."
            />
            <FeatureCard
              icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />}
              title="Test Scaffolded"
              desc="Automatic generation of PyTest stubs to verify logic parity immediately."
            />
          </div>
        </section>

        {/* --- Collapsible Technical Details --- */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all"
          >
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold">Deep Dive: How it works</span>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-white/40 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>

          {isExpanded && (
            <div className="p-8 border-x border-b border-white/5 bg-white/[0.01] rounded-b-2xl animate-in slide-in-from-top-2 duration-300">
              <div className="grid md:grid-cols-2 gap-8 text-sm text-slate-400">
                <div className="space-y-4">
                  <h4 className="text-white font-medium">1. Static Analysis</h4>
                  <p>
                    We parse the AST of your legacy Python 2 files to identify
                    deprecated print statements, integer division, and removed
                    standard libraries.
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-white font-medium">2. Logic Mapping</h4>
                  <p>
                    Our engine creates a Mermaid diagram of your function
                    dependencies to visualize the migration path.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="py-10 text-center text-xs text-slate-600 border-t border-white/5">
        &copy; {new Date().getFullYear()} LegacyArchaeologist. Built for the
        future of old code.
      </footer>
    </div>
  );
}
