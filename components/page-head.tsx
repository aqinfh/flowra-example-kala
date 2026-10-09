import type { ReactNode } from "react";

/** Page title set as a ticket header, with an optional one-line lede. */
export function PageHead({ title, lede }: { title: string; lede?: ReactNode }) {
  return (
    <header className="mb-8">
      <h1 className="ticket-head text-4xl sm:text-5xl">{title}</h1>
      {lede && <p className="mt-3 max-w-xl text-lg leading-relaxed text-muted">{lede}</p>}
    </header>
  );
}
