# Paper Trail — Day 49 Frontend Sprint

Document Q&A assistant: document on the left, chat on the right, every answer cites the passage it used.

## Run
```bash
npm install
npm run dev     # http://localhost:3000
```

## Task checklist
| Requirement | Where |
|---|---|
| Layout built for the use case (document beside chat) | `components/Workspace.jsx`, `DocumentPane.jsx` |
| Streaming via Fetch ReadableStream | `lib/readStream.js`, `Workspace.jsx` → `ask()`, `app/api/chat/route.js` |
| 3 loading states (skeleton / typing / completion) | `components/LoadingStates.jsx` |
| Named error component per error code | `components/errors/index.jsx` |
| Collapsible citations (doc name, excerpt, similarity) | `components/Sources.jsx` |
| Feedback wired to feedback endpoint | `components/Feedback.jsx` → `app/api/feedback/route.js` |
| Friction log + 3 fixes | `FRICTION_LOG.md` |

## Preview every error component
Send a message like `/err RATE_LIMITED`, `/err TIMEOUT`, `/err MODEL_UNAVAILABLE`, etc.
Sending an empty message triggers `EMPTY_QUERY`. Stopping the server triggers `NETWORK_ERROR`.

## Connect your real backend (Day 45)
1. `lib/errorCodes.js` and `components/errors/index.jsx`: make codes match your Day 45 API.
2. `app/api/chat/route.js`: replace `retrieve()` and the fake token loop with your real RAG/LLM stream.
   Keep the event format: `{type:"token"}`, `{type:"sources"}`, `{type:"done"}` as newline-delimited JSON.
3. `lib/sampleDoc.js`: replace with your real document(s).
