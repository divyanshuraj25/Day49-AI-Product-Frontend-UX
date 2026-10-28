"use client";
import { useEffect, useRef } from "react";

export default function DocumentPane({ doc, activeChunkId }) {
  const refs = useRef({});
  useEffect(() => {
    if (activeChunkId && refs.current[activeChunkId]) {
      refs.current[activeChunkId].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeChunkId]);

  return (
    <section aria-label="Document" className="flex h-full flex-col bg-sheet">
      <header className="border-b border-line px-6 py-3">
        <h2 className="text-sm font-semibold">{doc.name}</h2>
        <p className="text-xs text-slate2">{doc.chunks.length} sections · highlighted text is what the answer used</p>
      </header>
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <article className="mx-auto max-w-[62ch] font-serif">
          {doc.chunks.map((c) => (
            <div
              key={c.id}
              ref={(el) => (refs.current[c.id] = el)}
              className={`mb-5 rounded-md px-3 py-2 transition-colors ${activeChunkId === c.id ? "bg-mark" : ""}`}
            >
              <h3 className="mb-1 text-base font-semibold">{c.heading}</h3>
              <p className="text-[15px] leading-7">{c.text}</p>
            </div>
          ))}
        </article>
      </div>
    </section>
  );
}
