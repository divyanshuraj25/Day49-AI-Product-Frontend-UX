// State 1: before the first token arrives
export function SkeletonLoader() {
  return (
    <div role="status" aria-label="Finding the answer" className="space-y-2.5 py-1">
      <div className="h-3 w-11/12 animate-pulse rounded bg-line" />
      <div className="h-3 w-full animate-pulse rounded bg-line" />
      <div className="h-3 w-2/3 animate-pulse rounded bg-line" />
      <p className="pt-1 text-xs text-slate2">Searching the document…</p>
    </div>
  );
}

// State 2: while tokens stream in
export function TypingIndicator() {
  return (
    <span aria-label="Writing answer" className="ml-1 inline-flex items-center gap-1 align-middle">
      <span className="dot h-1.5 w-1.5 rounded-full bg-teal" />
      <span className="dot h-1.5 w-1.5 rounded-full bg-teal" />
      <span className="dot h-1.5 w-1.5 rounded-full bg-teal" />
    </span>
  );
}

// State 3: completion metadata
export function CompletionMeta({ meta, sourceCount }) {
  if (!meta) return null;
  return (
    <p className="mt-3 text-xs text-slate2">
      Answered in {(meta.latencyMs / 1000).toFixed(1)}s from {sourceCount} {sourceCount === 1 ? "passage" : "passages"} · {meta.tokens} tokens · {meta.model}
    </p>
  );
}
