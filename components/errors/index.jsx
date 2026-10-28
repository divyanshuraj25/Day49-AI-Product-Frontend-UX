"use client";

function ErrorShell({ title, message, actionLabel, onAction }) {
  return (
    <div role="alert" className="rounded-lg border border-danger/30 bg-dangerSoft p-4 text-sm">
      <p className="font-semibold text-danger">{title}</p>
      <p className="mt-1 text-ink">{message}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="mt-3 rounded-md border border-danger/40 bg-white px-3 py-1.5 font-medium text-danger hover:bg-danger hover:text-white">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function EmptyQueryError({ onAction }) {
  return <ErrorShell title="Your question was empty" message="Type a question about the document, then send it." actionLabel="Write a question" onAction={onAction} />;
}
export function UnauthorizedError({ onAction }) {
  return <ErrorShell title="You're signed out" message="Your session ended, so the document can't be read. Sign in again and your question will still be here." actionLabel="Sign in again" onAction={onAction} />;
}
export function DocumentNotFoundError({ onAction }) {
  return <ErrorShell title="This document is no longer available" message="It may have been moved or deleted. Pick another document to keep asking questions." actionLabel="Choose a document" onAction={onAction} />;
}
export function PayloadTooLargeError({ onAction }) {
  return <ErrorShell title="That question is too long" message="Questions can be up to 1,000 characters. Shorten it or split it into two questions." actionLabel="Edit question" onAction={onAction} />;
}
export function RateLimitedError({ onAction }) {
  return <ErrorShell title="You're asking too fast" message="Too many questions in a short time. Wait about a minute, then try again." actionLabel="Try again" onAction={onAction} />;
}
export function InternalError({ onAction }) {
  return <ErrorShell title="Something broke on our side" message="Your question wasn't lost, but we couldn't answer it. Try again; if it keeps happening, contact support with the time it occurred." actionLabel="Try again" onAction={onAction} />;
}
export function ModelUnavailableError({ onAction }) {
  return <ErrorShell title="The answering service is down for a moment" message="Nothing is wrong with your document or question. Try again in a few minutes." actionLabel="Try again" onAction={onAction} />;
}
export function TimeoutError({ onAction }) {
  return <ErrorShell title="The answer took too long" message="The request timed out. A shorter, more specific question usually answers faster." actionLabel="Try again" onAction={onAction} />;
}
export function NetworkError({ onAction }) {
  return <ErrorShell title="Can't reach the server" message="Check your internet connection, then try again." actionLabel="Try again" onAction={onAction} />;
}

export const ERROR_COMPONENTS = {
  EMPTY_QUERY: EmptyQueryError,
  UNAUTHORIZED: UnauthorizedError,
  DOCUMENT_NOT_FOUND: DocumentNotFoundError,
  PAYLOAD_TOO_LARGE: PayloadTooLargeError,
  RATE_LIMITED: RateLimitedError,
  INTERNAL_ERROR: InternalError,
  MODEL_UNAVAILABLE: ModelUnavailableError,
  TIMEOUT: TimeoutError,
  NETWORK_ERROR: NetworkError,
};

export function ErrorView({ code, onAction }) {
  const Comp = ERROR_COMPONENTS[code] || InternalError;
  return <Comp onAction={onAction} />;
}
