"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", textAlign: "center", padding: "4rem 1rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>We couldn&apos;t load content from Flowra right now.</h1>
        <button type="button" onClick={reset} style={{ marginTop: "1.5rem", padding: "0.5rem 1.25rem", borderRadius: 999, border: "1px solid #a3a3a3", background: "transparent" }}>
          Try again
        </button>
        <p style={{ marginTop: "1.5rem", fontSize: "0.875rem" }}>
          {/* Plain anchor on purpose: nothing prefetches it, and it works when the app shell is broken. */}
          Previewing your sandbox? <a href="/preview" style={{ textDecoration: "underline" }}>Exit preview</a>
        </p>
      </body>
    </html>
  );
}
