// Reads a fetch() Response body (ReadableStream) of newline-delimited JSON
// and yields one parsed event at a time.
export async function* readEvents(response) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let nl;
      while ((nl = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, nl).trim();
        buffer = buffer.slice(nl + 1);
        if (line) yield JSON.parse(line);
      }
    }
    const rest = buffer.trim();
    if (rest) yield JSON.parse(rest);
  } finally {
    reader.releaseLock();
  }
}
