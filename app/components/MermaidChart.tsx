'use client'

import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
})

interface MermaidChartProps {
  chart: string
}

let idCounter = 0

export default function MermaidChart({ chart }: MermaidChartProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || !chart.trim()) return

    const id = `mermaid-${++idCounter}`

    const cleaned = chart
      .replace(/^```mermaid\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim()

    mermaid.render(id, cleaned).then(({ svg }) => {
      if (ref.current) {
        ref.current.innerHTML = svg
      }
    }).catch((err) => {
      if (ref.current) {
        ref.current.innerHTML = `<pre style="color:#f87171">Failed to render diagram:\n${err.message}</pre>`
      }
    })
  }, [chart])

  return <div ref={ref} className="mermaid-container" />
}
