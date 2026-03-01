"use client";

import { useState, useRef, useEffect } from "react";
import {
  Code2,
  Upload as UploadIcon,
  FileCode,
  Loader2,
  Sparkles,
  ChevronDown,
  Trash2,
  Cpu,
  Terminal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Mock imports - ensure these components exist in your project
import MermaidChart from "../components/MermaidChart";
import ManifestViewer from "../components/ManifestViewer";
import FileTreeViewer from "../components/FileTreeViewer";

/** * --- AITextLoading Component ---
 * Sophisticated monochrome loading state
 */
interface AITextLoadingProps {
  texts?: string[];
  className?: string;
  interval?: number;
}

function AITextLoading({
  texts = [
    "INITIATING_SCAN...",
    "DECONSTRUCTING_LOGIC...",
    "MAPPING_DEPENDENCIES...",
    "EXTRACTING_MANIFEST...",
    "FINALIZING_RESTORATION...",
  ],
  className,
  interval = 3000,
}: AITextLoadingProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, interval);
    return () => clearInterval(timer);
  }, [interval, texts.length]);

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        className="relative px-4 py-2 w-full text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTextIndex}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className={cn(
              "font-mono text-xl md:text-2xl tracking-widest text-white/90 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]",
              className,
            )}
          >
            {texts[currentTextIndex]}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/** * --- Main Page Component ---
 */
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

const FILE_ACCEPT = ".py,.js,.ts,.java,.cs,.cpp,.c,.rb,.go,.php,.txt,.jsx,.tsx";

export default function Analyser() {
  const [activeTab, setActiveTab] = useState<"upload" | "paste">("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [pasteCode, setPasteCode] = useState("");
  const [pasteFileName, setPasteFileName] = useState("snippet.py");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<FileMappingResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [reconstructions, setReconstructions] = useState<
    Record<string, ReconstructResponse>
  >({});
  const [reconstructing, setReconstructing] = useState<Record<string, boolean>>(
    {},
  );
  const [dragOver, setDragOver] = useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, Record<string, boolean>>
  >({});
  const inputRef = useRef<HTMLInputElement>(null);

  const isAnyTaskRunning =
    loading || Object.values(reconstructing).some(Boolean);
  const hasInput =
    activeTab === "upload" ? files.length > 0 : pasteCode.trim().length > 0;

  const toggleSection = (filename: string, section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [filename]: { ...prev[filename], [section]: !prev[filename]?.[section] },
    }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files);
    if (dropped.length) setFiles((prev) => [...prev, ...dropped]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasInput) return;
    setLoading(true);
    setError(null);
    setResults([]);
    setReconstructions({});

    const formData = new FormData();
    if (activeTab === "upload") {
      files.forEach((f) => formData.append("files", f));
    } else {
      const blob = new Blob([pasteCode], { type: "text/plain" });
      formData.append("files", blob, pasteFileName || "snippet.py");
    }

    try {
      const res = await fetch(
        "https://ijgwqdiuyweofdd-legacycoderestoration.hf.space/map-legacy-code",
        {
          method: "POST",
          body: formData,
        },
      );
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data: MappingResponse = await res.json();
      setResults(data.results);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleReconstruct = async (item: FileMappingResult) => {
    setReconstructing((prev) => ({ ...prev, [item.filename]: true }));
    setError(null);
    try {
      const res = await fetch(
        "https://ijgwqdiuyweofdd-legacycoderestoration.hf.space/reconstruct-code",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            manifest: item.logic_manifest,
            mermaid_code: item.mermaid_code,
          }),
        },
      );
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data: ReconstructResponse = await res.json();
      setReconstructions((prev) => ({ ...prev, [item.filename]: data }));
      setExpandedSections((prev) => ({
        ...prev,
        [item.filename]: { ...prev[item.filename], recon: true },
      }));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setReconstructing((prev) => ({ ...prev, [item.filename]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 relative overflow-x-hidden">
      {/* GLOW EFFECTS */}
      <div className="fixed top-1/4 -left-20 w-64 h-96 bg-white/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="fixed bottom-1/4 -right-20 w-64 h-96 bg-white/5 blur-[120px] pointer-events-none rounded-full" />

      {/* FULL SCREEN OVERLAY */}
      <AnimatePresence>
        {isAnyTaskRunning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
          >
            <div className="flex flex-col items-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-white/20 blur-2xl animate-pulse rounded-full" />
                <Loader2 className="w-12 h-12 text-white animate-spin relative z-10" />
              </div>
              <AITextLoading
                texts={
                  loading
                    ? undefined
                    : [
                        "GENERATING_ASSETS...",
                        "RESTRUCTURING...",
                        "OPTIMIZING...",
                        "POLISHING...",
                      ]
                }
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main
        className={cn(
          "max-w-5xl mx-auto px-6 py-16 transition-all duration-700",
          isAnyTaskRunning
            ? "blur-xl scale-[0.95] opacity-50"
            : "blur-0 scale-100 opacity-100",
        )}
      >
        <div className="rounded-xl border border-white/10 bg-[#050505] overflow-hidden shadow-[0_0_50px_-12px_rgba(255,255,255,0.05)]">
          <div className="flex bg-neutral-900/30">
            {(["upload", "paste"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-8 py-4 text-xs font-bold tracking-widest uppercase transition-all ${
                  activeTab === tab
                    ? "text-white bg-white/5 border-b border-white"
                    : "text-white/30 hover:text-white/60"
                }`}
              >
                {tab === "upload" ? "Files" : "Source"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {activeTab === "upload" ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`relative rounded-lg border border-dashed p-16 text-center cursor-pointer transition-all ${
                  dragOver
                    ? "border-white bg-white/5"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                <input
                  key={fileInputKey}
                  ref={inputRef}
                  type="file"
                  multiple
                  accept={FILE_ACCEPT}
                  className="hidden"
                  onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
                />
                <UploadIcon className="w-8 h-8 mx-auto mb-4 text-white/20" />
                <p className="text-white/40 text-sm font-mono tracking-tighter italic">
                  DRAG_AND_DROP_ASSETS
                </p>
                {files.length > 0 && (
                  <div className="mt-8 flex flex-wrap justify-center gap-2">
                    {files.map((f, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-white/5 border border-white/10 rounded font-mono text-[10px] text-white/60 flex items-center gap-2 uppercase tracking-tighter"
                      >
                        {f.name}
                        <Trash2
                          className="w-3 h-3 cursor-pointer hover:text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFiles((prev) => {
                              const next = prev.filter((_, j) => j !== i);
                              if (next.length === 0)
                                setFileInputKey((k) => k + 1);
                              return next;
                            });
                          }}
                        />
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  value={pasteFileName ?? ""}
                  onChange={(e) => setPasteFileName(e.target.value)}
                  placeholder="module_name.py"
                  className="bg-black border border-white/10 rounded px-4 py-2 text-xs font-mono w-full focus:border-white outline-none transition-colors"
                />
                <textarea
                  value={pasteCode ?? ""}
                  onChange={(e) => setPasteCode(e.target.value)}
                  className="w-full h-80 bg-black border border-white/10 rounded-lg p-6 font-mono text-sm outline-none focus:border-white transition-colors"
                  placeholder="// Paste raw logic here..."
                />
              </div>
            )}
            <button
              disabled={!hasInput || loading}
              className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.3em] text-xs hover:bg-neutral-200 transition-all disabled:opacity-20 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
              ) : (
                "EXECUTE_ANALYSIS"
              )}
            </button>
          </form>
        </div>

        {error && (
          <div className="mt-8 p-4 border border-white/20 bg-white/5 font-mono text-[11px] text-white/70 uppercase">
            [!] Error: {error}
          </div>
        )}

        {results.map((item) => (
          <div
            key={item.filename}
            className="mt-24 space-y-12 animate-in fade-in duration-1000"
          >
            <div className="flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-white/10" />
              <h2 className="text-sm font-mono tracking-[0.5em] text-white/40 uppercase">
                {item.filename}
              </h2>
              <div className="h-[1px] flex-1 bg-white/10" />
            </div>

            <div className="grid grid-cols-1 gap-8">
              <ResultCard
                title="LOGIC_MANIFEST"
                accent="white"
                icon={<FileCode className="w-4 h-4" />}
                expanded={expandedSections[item.filename]?.manifest ?? true}
                onToggle={() => toggleSection(item.filename, "manifest")}
              >
                <ManifestViewer manifest={item.logic_manifest} />
              </ResultCard>

              <ResultCard
                title="ARCHITECTURAL_FLOW"
                accent="white"
                icon={<Cpu className="w-4 h-4" />}
                expanded={expandedSections[item.filename]?.diagram ?? true}
                onToggle={() => toggleSection(item.filename, "diagram")}
              >
                <MermaidChart chart={item.mermaid_code} />
              </ResultCard>

              {reconstructions[item.filename] ? (
                <ResultCard
                  title="MODERNIZED_OUTPUT"
                  accent="white"
                  icon={<Sparkles className="w-4 h-4" />}
                  expanded={expandedSections[item.filename]?.recon ?? true}
                  onToggle={() => toggleSection(item.filename, "recon")}
                >
                  <FileTreeViewer
                    scaffold={reconstructions[item.filename].scaffold ?? ""}
                    logic={reconstructions[item.filename].logic ?? ""}
                    tests={reconstructions[item.filename].tests ?? ""}
                  />
                </ResultCard>
              ) : (
                <button
                  onClick={() => handleReconstruct(item)}
                  disabled={reconstructing[item.filename]}
                  className="w-full py-12 border border-white/10 bg-neutral-900/20 hover:bg-white hover:text-black text-white font-bold uppercase tracking-[0.4em] text-[10px] transition-all flex items-center justify-center gap-3 group"
                >
                  {reconstructing[item.filename] ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "RECONSTRUCT_SYSTEM_ARCHITECTURE"
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

function ResultCard({ title, icon, expanded, onToggle, children }: any) {
  return (
    <div className="rounded border border-white/5 bg-black overflow-hidden hover:border-white/20 transition-colors">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between bg-neutral-900/20"
      >
        <div className="flex items-center gap-4 font-mono text-[11px] tracking-[0.3em] text-white/60">
          {icon} {title}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-white/20 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/5 p-6"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
