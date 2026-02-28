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
import MermaidChart from "../components/MermaidChart";
import ManifestViewer from "../components/ManifestViewer";
import FileTreeViewer from "../components/FileTreeViewer";

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
    setExpandedSections({});

    const formData = new FormData();
    if (activeTab === "upload") {
      files.forEach((f) => formData.append("files", f));
    } else {
      const blob = new Blob([pasteCode], { type: "text/plain" });
      formData.append("files", blob, pasteFileName || "snippet.py");
    }

    try {
      const res = await fetch("http://localhost:8000/map-legacy-code", {
        method: "POST",
        body: formData,
      });
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
      const res = await fetch("http://localhost:8000/reconstruct-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          manifest: item.logic_manifest,
          mermaid_code: item.mermaid_code,
        }),
      });
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
    <div className="min-h-screen bg-[#0d0d0f] text-white selection:bg-indigo-500/30">
      <header className="border-b border-white/8 backdrop-blur-md sticky top-0 z-20 bg-[#0d0d0f]/80">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/40 group-hover:bg-indigo-500 transition-colors">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">
              Legacy Archaeologist
            </span>
          </a>
          <a
            href="/"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            ← Quick Convert
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden shadow-2xl">
          <div className="flex border-b border-white/8">
            {(["upload", "paste"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-8 py-4 text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "text-white border-b-2 border-indigo-500 bg-white/[0.02]"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {tab === "upload" ? (
                  <UploadIcon className="w-4 h-4" />
                ) : (
                  <FileCode className="w-4 h-4" />
                )}
                {tab === "upload" ? "Upload Files" : "Paste Code"}
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
                className={`relative rounded-2xl border-2 border-dashed p-16 text-center cursor-pointer transition-all ${
                  dragOver
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-white/10 hover:border-white/20 hover:bg-white/[0.01]"
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
                <UploadIcon className="w-10 h-10 mx-auto mb-4 text-white/20" />
                <p className="text-white/80 font-medium">
                  Drop files here or click to browse
                </p>
                {files.length > 0 && (
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {files.map((f, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs flex items-center gap-2"
                      >
                        {f.name}
                        <Trash2
                          className="w-3 h-3 cursor-pointer hover:text-red-400"
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
                  placeholder="filename.py"
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-64 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
                <textarea
                  value={pasteCode ?? ""}
                  onChange={(e) => setPasteCode(e.target.value)}
                  className="w-full h-80 bg-white/[0.01] border border-white/10 rounded-2xl p-6 font-mono text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="// Paste your legacy logic here..."
                />
              </div>
            )}
            <button
              disabled={!hasInput || loading}
              className="w-full py-4 bg-indigo-600 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/20"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              {loading ? "Analyzing Architecture..." : "Analyze Codebase"}
            </button>
          </form>
        </div>

        {error && (
          <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {results.map((item) => (
          <div
            key={item.filename}
            className="mt-16 space-y-6 animate-in fade-in slide-in-from-bottom-4"
          >
            <div className="flex items-center gap-3 border-l-4 border-indigo-500 pl-4">
              <h2 className="text-2xl font-bold">{item.filename}</h2>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <ResultCard
                title="System Logic Manifest"
                accent="violet"
                icon="🗂️"
                expanded={expandedSections[item.filename]?.manifest ?? true}
                onToggle={() => toggleSection(item.filename, "manifest")}
              >
                <ManifestViewer manifest={item.logic_manifest} />
              </ResultCard>

              <ResultCard
                title="Process Flow Diagram"
                accent="cyan"
                icon={<Cpu className="w-4 h-4" />}
                expanded={expandedSections[item.filename]?.diagram ?? true}
                onToggle={() => toggleSection(item.filename, "diagram")}
              >
                <MermaidChart chart={item.mermaid_code} />
              </ResultCard>

              {reconstructions[item.filename] ? (
                <ResultCard
                  title="Modernized Project Artifacts"
                  accent="emerald"
                  icon={<FileCode className="w-4 h-4" />}
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
                  className="w-full py-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 font-bold transition-all flex items-center justify-center gap-3 group shadow-xl"
                >
                  {reconstructing[item.filename] ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  )}
                  {reconstructing[item.filename]
                    ? "Building Modern Architecture..."
                    : "Reconstruct as Production-Ready FastAPI App"}
                </button>
              )}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

function ResultCard({
  title,
  icon,
  accent,
  expanded,
  onToggle,
  children,
}: any) {
  const borders: Record<string, string> = {
    violet: "border-violet-500/20",
    cyan: "border-cyan-500/20",
    emerald: "border-emerald-500/20",
  };
  return (
    <div
      className={`rounded-2xl border ${borders[accent]} bg-white/[0.02] overflow-hidden`}
    >
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/[0.01]"
      >
        <div className="flex items-center gap-3 font-semibold text-white/80">
          {icon} {title}
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
