import { ERROR_STATUS } from "@/lib/errorCodes";
import { SAMPLE_DOC } from "@/lib/sampleDoc";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const enc = new TextEncoder();
const STOP = new Set("the a an is are of to in on for and or do i my me what how when who can be it this that at with".split(" "));

function fail(code) {
  const status = ERROR_STATUS[code] ?? 500;
  return Response.json({ error: { code: ERROR_STATUS[code] ? code : "INTERNAL_ERROR" } }, { status });
}

function retrieve(question) {
  const words = question.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w && !STOP.has(w));
  return SAMPLE_DOC.chunks
    .map((c) => {
      const hay = (c.heading + " " + c.text).toLowerCase();
      const hits = words.filter((w) => hay.includes(w)).length;
      return { chunk: c, hits, score: hits ? Math.min(0.97, 0.42 + hits * 0.17) : 0 };
    })
    .filter((r) => r.hits > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);
}

export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { return fail("EMPTY_QUERY"); }
  const question = (body?.question || "").trim();
  if (!question) return fail("EMPTY_QUERY");
  if (question.length > 1000) return fail("PAYLOAD_TOO_LARGE");

  // Dev helper: type "/err RATE_LIMITED" to preview any error component.
  const m = question.match(/^\/err\s+([A-Za-z_]+)/);
  if (m) return fail(m[1].toUpperCase());

  const started = Date.now();
  const hits = retrieve(question);
  const answer = hits.length
    ? hits.map((h) => h.chunk.text).join(" ")
    : "I couldn't find anything about that in this document. Try asking about hours, equipment, security or leave.";

  const stream = new ReadableStream({
    async start(controller) {
      const send = (o) => controller.enqueue(enc.encode(JSON.stringify(o) + "\n"));
      try {
        await sleep(900); // simulated retrieval + model latency, so the skeleton is visible
        const tokens = answer.split(/(\s+)/).filter(Boolean);
        for (const t of tokens) {
          send({ type: "token", text: t });
          await sleep(28);
        }
        send({
          type: "sources",
          sources: hits.map((h) => ({
            chunkId: h.chunk.id,
            documentName: SAMPLE_DOC.name,
            heading: h.chunk.heading,
            excerpt: h.chunk.text,
            similarity: Number(h.score.toFixed(2)),
          })),
        });
        send({ type: "done", meta: { latencyMs: Date.now() - started, tokens: tokens.length, model: "demo-rag-1" } });
      } catch {
        send({ type: "error", code: "INTERNAL_ERROR" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-cache, no-transform" },
  });
}
