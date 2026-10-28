"use client";
import { SkeletonLoader, TypingIndicator, CompletionMeta } from "./LoadingStates";
import { ErrorView } from "./errors";
import Sources from "./Sources";
import Feedback from "./Feedback";

export default function Message({ msg, onSelectChunk, activeChunkId, onRetry }) {
  if (msg.role === "user") {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-ink px-4 py-2.5 text-sm text-white">{msg.content}</p>
      </div>
    );
  }
  return (
    <div className="max-w-[92%]">
      <div className="rounded-2xl rounded-bl-sm border border-line bg-white px-4 py-3 text-sm leading-relaxed">
        {msg.status === "loading" && <SkeletonLoader />}
        {(msg.status === "streaming" || msg.status === "done") && (
          <p className="whitespace-pre-wrap">
            {msg.content}
            {msg.status === "streaming" && <TypingIndicator />}
          </p>
        )}
        {msg.status === "error" && <ErrorView code={msg.errorCode} onAction={onRetry} />}
        {msg.status === "done" && (
          <>
            <CompletionMeta meta={msg.meta} sourceCount={msg.sources?.length || 0} />
            <Sources sources={msg.sources} onSelect={onSelectChunk} activeChunkId={activeChunkId} />
            <Feedback messageId={msg.id} />
          </>
        )}
      </div>
    </div>
  );
}
