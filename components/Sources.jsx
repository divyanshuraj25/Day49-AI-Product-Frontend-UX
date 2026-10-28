"use client";
import { useState } from "react";

export default function Sources({ sources, onSelect, activeChunkId }) {
  const [open, setOpen] = useState(false);
  if (!sources?.length) return null;
  return (
    <div className="mt-3 rounded-lg border border-line bg-mist">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium"
      >
        <span>Where this came from ({sources.length})</span>
        <span aria-hidden className={`transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <ul className="space-y-2 border-t border-line p-3">
          {sources.map((s) => (
            <li key={s.chunkId} className={`rounded-md border bg-white p-3 ${activeChunkId === s.chunkId ? "border-teal" : "border-line"}`}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-semibold">{s.documentName} <span className="font-normal text-slate2">— {s.heading}</span></p>
                <div className="flex shrink-0 items-center gap-2" title="How closely this passage matches your question">
                  <div className="h-1.5 w-16 overflow-hidden rounded-full bg-line" aria-hidden>
                    <div className="h-full bg-teal" style={{ width: `${Math.round(s.similarity * 100)}%` }} />
                  </div>
                  <span className="text-xs tabular-nums text-slate2">{Math.round(s.similarity * 100)}% match</span>
                </div>
              </div>
              <p className="mt-2 font-serif text-sm leading-relaxed text-ink">“{s.excerpt}”</p>
              <button onClick={() => onSelect(s.chunkId)} className="mt-2 text-sm font-medium text-teal-dark underline underline-offset-2">
                Show in document
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
