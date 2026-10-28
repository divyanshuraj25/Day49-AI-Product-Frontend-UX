"use client";
import { useRef, useState, useEffect } from "react";
import DocumentPane from "./DocumentPane";
import Message from "./Message";
import { readEvents } from "@/lib/readStream";
import { SAMPLE_DOC, SUGGESTIONS } from "@/lib/sampleDoc";

let counter = 0;
const uid = () => `m_${Date.now()}_${counter++}`;

export default function Workspace() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [activeChunkId, setActiveChunkId] = useState(null);
  const [mobileTab, setMobileTab] = useState("chat");
  const inputRef = useRef(null);
  const endRef = useRef(null);
  const lastQuestion = useRef("");

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages]);

  const patch = (id, fn) => setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, ...fn(m) } : m)));

  async function ask(question) {
    const q = question.trim();
    if (busy) return;
    lastQuestion.current = q;
    const aid = uid();
    setMessages((ms) => [...ms, ...(q ? [{ id: uid(), role: "user", content: q }] : []), { id: aid, role: "assistant", status: "loading", content: "" }]);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        patch(aid, () => ({ status: "error", errorCode: data?.error?.code || "INTERNAL_ERROR" }));
        return;
      }
      for await (const ev of readEvents(res)) {
        if (ev.type === "token") patch(aid, (m) => ({ status: "streaming", content: m.content + ev.text }));
        else if (ev.type === "sources") patch(aid, () => ({ sources: ev.sources }));
        else if (ev.type === "done") patch(aid, () => ({ status: "done", meta: ev.meta }));
        else if (ev.type === "error") patch(aid, () => ({ status: "error", errorCode: ev.code }));
      }
    } catch {
      patch(aid, () => ({ status: "error", errorCode: "NETWORK_ERROR" }));
    } finally {
      setBusy(false);
    }
  }

  function retry() {
    // drop the failed assistant bubble, resend the same question
    setMessages((ms) => {
      const copy = [...ms];
      copy.pop();
      if (copy.length && copy[copy.length - 1].role === "user") copy.pop();
      return copy;
    });
    setTimeout(() => ask(lastQuestion.current || ""), 0);
  }

  function selectChunk(id) {
    setActiveChunkId(id);
    setMobileTab("doc");
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(input); }
  }

  const chat = (
    <section aria-label="Questions and answers" className="flex h-full flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5" aria-live="polite">
        {messages.length === 0 ? (
          <div className="mx-auto mt-10 max-w-md">
            <h1 className="text-xl font-semibold">Ask about this document</h1>
            <p className="mt-2 text-sm text-slate2">Every answer shows the exact passage it came from, so you can check it yourself. Try one:</p>
            <div className="mt-4 flex flex-col gap-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => ask(s)} className="rounded-lg border border-line bg-white px-3 py-2 text-left text-sm hover:border-teal">{s}</button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <Message key={m.id} msg={m} onSelectChunk={selectChunk} activeChunkId={activeChunkId} onRetry={m.errorCode === "EMPTY_QUERY" ? () => inputRef.current?.focus() : retry} />
          ))
        )}
        <div ref={endRef} />
      </div>
      <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="border-t border-line bg-white p-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={2}
            placeholder="Ask a question about the document…"
            aria-label="Your question"
            className="min-w-0 flex-1 resize-none rounded-lg border border-line px-3 py-2 text-sm"
          />
          <button type="submit" disabled={busy} className="rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-white hover:bg-teal-dark disabled:opacity-50">
            {busy ? "Answering…" : "Ask"}
          </button>
        </div>
        <p className="mt-1.5 text-xs text-slate2">Enter to send · Shift+Enter for a new line</p>
      </form>
    </section>
  );

  return (
    <main className="flex h-screen flex-col">
      <div className="flex border-b border-line bg-white md:hidden">
        {["chat", "doc"].map((t) => (
          <button key={t} onClick={() => setMobileTab(t)} className={`flex-1 py-2.5 text-sm font-medium ${mobileTab === t ? "border-b-2 border-teal text-teal-dark" : "text-slate2"}`}>
            {t === "chat" ? "Questions" : "Document"}
          </button>
        ))}
      </div>
      <div className="grid min-h-0 flex-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className={`${mobileTab === "doc" ? "" : "hidden"} min-h-0 border-r border-line md:block`}>
          <DocumentPane doc={SAMPLE_DOC} activeChunkId={activeChunkId} />
        </div>
        <div className={`${mobileTab === "chat" ? "" : "hidden"} min-h-0 md:block`}>{chat}</div>
      </div>
    </main>
  );
}
