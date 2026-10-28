export const runtime = "nodejs";
const store = (globalThis.__feedback ||= []);

export async function POST(req) {
  const b = await req.json().catch(() => null);
  if (!b || !b.messageId || !["up", "down"].includes(b.rating)) {
    return Response.json({ error: { code: "EMPTY_QUERY" } }, { status: 400 });
  }
  store.push({ messageId: b.messageId, rating: b.rating, comment: (b.comment || "").slice(0, 500), at: new Date().toISOString() });
  return Response.json({ ok: true, count: store.length });
}

export async function GET() {
  return Response.json({ feedback: store });
}
