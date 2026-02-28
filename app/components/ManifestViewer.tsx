'use client'

import { useMemo } from 'react'
import { AlertCircle, ChevronRight } from 'lucide-react'

interface FunctionEntry {
  function?: string
  name?: string
  inputs?: string[] | string
  logic?: string
  rules?: string
  side_effects?: string[] | string
  output?: string
  outputs?: string
  [key: string]: unknown
}

function extractJson(raw: string): string {
  // Strip markdown fences
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fenced) return fenced[1].trim()
  // Find first [ or {
  const start = raw.search(/[\[{]/)
  if (start !== -1) return raw.slice(start)
  return raw
}

function normalizeArray(val: unknown): string[] {
  if (!val) return []
  if (Array.isArray(val)) return val.map(String)
  if (typeof val === 'string') return val.split(/[,;]\s*/).filter(Boolean)
  return [String(val)]
}

const ACCENT_COLORS: Record<string, string> = {
  inputs:       'border-blue-500/30 bg-blue-500/5 text-blue-300',
  logic:        'border-violet-500/30 bg-violet-500/5 text-violet-300',
  rules:        'border-violet-500/30 bg-violet-500/5 text-violet-300',
  side_effects: 'border-amber-500/30 bg-amber-500/5 text-amber-300',
  output:       'border-emerald-500/30 bg-emerald-500/5 text-emerald-300',
  outputs:      'border-emerald-500/30 bg-emerald-500/5 text-emerald-300',
}

const LABELS: Record<string, string> = {
  inputs: 'Inputs',
  logic: 'Logic / Rules',
  rules: 'Rules',
  side_effects: 'Side Effects',
  output: 'Output',
  outputs: 'Output',
}

function FunctionCard({ entry, index }: { entry: FunctionEntry; index: number }) {
  const name = entry.function ?? entry.name ?? `Function ${index + 1}`
  const sections = Object.entries(entry).filter(
    ([k]) => k !== 'function' && k !== 'name' && LABELS[k]
  )

  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3.5 bg-white/[0.03] border-b border-white/8">
        <div className="w-6 h-6 rounded-md bg-indigo-500/20 flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-indigo-400">{index + 1}</span>
        </div>
        <code className="text-sm font-semibold text-white/90 font-mono">{String(name)}</code>
      </div>

      {/* Sections */}
      <div className="p-4 grid gap-3">
        {sections.map(([key, val]) => {
          const color = ACCENT_COLORS[key] ?? 'border-white/10 bg-white/[0.02] text-white/60'
          const label = LABELS[key] ?? key
          const isArray = Array.isArray(val) || (typeof val === 'string' && val.includes(','))
          const items = normalizeArray(val)

          return (
            <div key={key} className={`rounded-lg border px-4 py-3 ${color}`}>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">{label}</p>
              {isArray && items.length > 1 ? (
                <ul className="space-y-1">
                  {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs">
                      <ChevronRight className="w-3 h-3 mt-0.5 opacity-50 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs leading-relaxed whitespace-pre-wrap">{String(val)}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function ManifestViewer({ manifest }: { manifest: string }) {
  const parsed = useMemo<FunctionEntry[] | null>(() => {
    try {
      const cleaned = extractJson(manifest)
      const data = JSON.parse(cleaned)
      if (Array.isArray(data)) return data as FunctionEntry[]
      if (data && typeof data === 'object') {
        // maybe wrapped: { functions: [...] }
        const inner = Object.values(data).find(Array.isArray) as FunctionEntry[] | undefined
        return inner ?? null
      }
    } catch {
      /* fall through */
    }
    return null
  }, [manifest])

  if (!parsed) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-amber-400/70">
          <AlertCircle className="w-3.5 h-3.5" />
          Could not parse as structured JSON — showing raw output
        </div>
        <pre className="text-xs text-white/60 whitespace-pre-wrap break-words leading-relaxed font-mono bg-white/[0.02] rounded-xl p-4 border border-white/8">
          {manifest}
        </pre>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-white/30">{parsed.length} function{parsed.length !== 1 ? 's' : ''} extracted</p>
      {parsed.map((entry, i) => (
        <FunctionCard key={i} entry={entry} index={i} />
      ))}
    </div>
  )
}
