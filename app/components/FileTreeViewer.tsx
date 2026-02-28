"use client";

import { useState, useMemo, useEffect } from "react";
import JSZip from "jszip";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import python from "react-syntax-highlighter/dist/esm/languages/hljs/python";
import typescript from "react-syntax-highlighter/dist/esm/languages/hljs/typescript";
import javascript from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import java from "react-syntax-highlighter/dist/esm/languages/hljs/java";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import {
  FileCode,
  FileText,
  Copy,
  Check,
  Download,
  ListTree,
} from "lucide-react";

SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("java", java);

interface ProjectFile {
  name: string;
  path: string;
  content: string;
  language: string;
}

function detectLang(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    py: "python",
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    java: "java",
    cs: "csharp",
    go: "go",
    rb: "ruby",
    php: "php",
    cpp: "cpp",
    c: "c",
    json: "json",
    yaml: "yaml",
    yml: "yaml",
    toml: "toml",
    txt: "text",
    md: "markdown",
    sh: "bash",
  };
  return map[ext] ?? "text";
}

function extractFilesSequentially(
  scaffold: string,
  logic: string,
  tests: string,
): ProjectFile[] {
  const combinedText = `${scaffold}\n\n${logic}\n\n${tests}`;
  const files: ProjectFile[] = [];

  /**
   * Enhanced Regex:
   * 1. Looks for a filename pattern (e.g., app/main.py) in bold, headers, or backticks.
   * 2. Allows for some descriptive text or colons between the name and the code block.
   * 3. Captures the code block and its language hint.
   */
  const blockRegex =
    /(?:(?:^|\n)(?:\*\*|###|`|File: )?([a-zA-Z0-9._\-/ ]+\.[a-z]{1,4})(?:\*\*|`|:)?.*?\n)?\s*```(\w*)\n([\s\S]*?)```/gm;

  let m;
  let fileCount = 1;

  while ((m = blockRegex.exec(combinedText)) !== null) {
    let rawName = m[1]?.trim();
    const langHint = m[2]?.trim();
    const content = m[3].trim();

    if (content) {
      // If no name found, try to infer from common patterns or use index
      if (!rawName) {
        if (content.includes("import ") || content.includes("def "))
          rawName = `module_${fileCount++}.py`;
        else if (content.includes("class ") && content.includes("extends"))
          rawName = `component_${fileCount++}.tsx`;
        else rawName = `artifact_${fileCount++}.txt`;
      }

      files.push({
        name: rawName.split("/").pop() || rawName,
        path: rawName,
        content: content,
        language: langHint || detectLang(rawName),
      });
    }
  }

  // 1. Ensure requirements.txt
  if (!files.find((f) => f.name.toLowerCase().includes("requirements"))) {
    files.push({
      name: "requirements.txt",
      path: "requirements.txt",
      content: "fastapi\nuvicorn[standard]\npydantic\npython-dotenv\npytest",
      language: "text",
    });
  }

  // 2. Generate project_structure.txt for the user
  const structureContent =
    "PROJECT ARCHITECTURE OVERVIEW\n" +
    "=============================\n\n" +
    files.map((f) => `[FILE] ${f.path}`).join("\n");

  files.unshift({
    name: "project_structure.txt",
    path: "project_structure.txt",
    content: structureContent,
    language: "text",
  });

  return files;
}

async function downloadZip(files: ProjectFile[], projectName: string) {
  const zip = new JSZip();
  files.forEach((f) => zip.file(f.path, f.content));
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${projectName}.zip`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function FileTreeViewer({
  scaffold,
  logic,
  tests,
}: {
  scaffold: string;
  logic: string;
  tests: string;
}) {
  const files = useMemo(
    () => extractFilesSequentially(scaffold, logic, tests),
    [scaffold, logic, tests],
  );
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    setSelectedIdx(0);
  }, [files]);

  const activeFile = files[selectedIdx];

  const handleDownload = async () => {
    setDownloading(true);
    await downloadZip(files, "reconstructed-app");
    setDownloading(false);
  };

  return (
    <div className="rounded-xl border border-white/8 overflow-hidden bg-[#0e0e10] flex min-h-[550px] h-[550px]">
      <div className="w-64 border-r border-white/8 flex flex-col shrink-0 bg-[#0a0a0c]">
        <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between bg-white/[0.02]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/25">
            Project Files
          </p>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="text-white/30 hover:text-emerald-400"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {files.map((file, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-left text-xs transition-colors rounded-lg group ${
                selectedIdx === idx
                  ? "bg-indigo-500/20 text-white"
                  : "text-white/50 hover:bg-white/[0.04]"
              }`}
            >
              {file.name === "project_structure.txt" ? (
                <ListTree className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <FileIcon name={file.name} />
              )}
              <span className="truncate font-mono">{file.name}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {activeFile ? (
          <>
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/8 bg-white/[0.02]">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileIcon name={activeFile.name} />
                <span className="text-xs font-mono text-white/70 truncate">
                  {activeFile.path}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <CopyButton text={activeFile.content} />
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 text-xs text-white/30 hover:text-emerald-400"
                >
                  <Download className="w-3.5 h-3.5" />
                  ZIP
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-[#0d0d0f]">
              <SyntaxHighlighter
                language={activeFile.language}
                style={atomOneDark}
                showLineNumbers
                customStyle={{
                  margin: 0,
                  padding: "1.25rem",
                  background: "transparent",
                  fontSize: "0.75rem",
                }}
              >
                {activeFile.content}
              </SyntaxHighlighter>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-white/20 text-sm">
            No files detected
          </div>
        )}
      </div>
    </div>
  );
}

function FileIcon({ name }: { name: string }) {
  const ext = name.split(".").pop()?.toLowerCase();
  const codeExts = [
    "py",
    "js",
    "ts",
    "tsx",
    "jsx",
    "java",
    "cs",
    "go",
    "rb",
    "cpp",
    "c",
  ];
  return codeExts.includes(ext || "") ? (
    <FileCode className="w-4 h-4 text-indigo-400/80" />
  ) : (
    <FileText className="w-4 h-4 text-white/40" />
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/70"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-emerald-400" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
