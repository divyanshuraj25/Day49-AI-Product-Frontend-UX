"use client";
import { useState } from "react";

export default function Feedback({ messageId }) {
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState("");
  const [state, setState] = useState("idle"); // idle | sending | sent | failed

  async function submit(r, c = "") {
    setState("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, rating: r, comment: c }),
      });
      setState(res.ok ? "sent" : "failed");
    } catch {
      setState("failed");
    }
  }

  function choose(r) {
    setRating(r);
    setState("idle");
    if (r === "up") submit("up");
  }

  if (state === "sent") return <p className="mt-3 text-sm text-slate2">Thanks — your feedback was saved.</p>;

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate2">Was this answer right?</span>
        <button onClick={() => choose("up")} aria-pressed={rating === "up"} className={`rounded-md border px-2.5 py-1 ${rating === "up" ? "border-teal bg-teal-soft" : "border-line bg-white hover:bg-mist"}`}>Yes</button>
        <button onClick={() => choose("down")} aria-pressed={rating === "down"} className={`rounded-md border px-2.5 py-1 ${rating === "down" ? "border-danger bg-dangerSoft" : "border-line bg-white hover:bg-mist"}`}>No</button>
      </div>
      {rating === "down" && (
        <div className="mt-2 flex gap-2">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
            placeholder="What was wrong? (optional)"
            className="min-w-0 flex-1 rounded-md border border-line bg-white px-3 py-1.5 text-sm"
          />
          <button onClick={() => submit("down", comment)} disabled={state === "sending"} className="rounded-md bg-ink px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50">
            Send feedback
          </button>
        </div>
      )}
      {state === "failed" && <p className="mt-2 text-sm text-danger">Feedback didn't send. Click again to retry.</p>}
    </div>
  );
}
