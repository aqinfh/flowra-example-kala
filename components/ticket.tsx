import type { ReactNode } from "react";

/** The steel rail tickets hang from. Purely decorative. */
export function Rail({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`rail ${className}`} />;
}

/**
 * A thermal-paper ticket. `tilt` hangs it slightly off true (in degrees) so a
 * row of tickets looks clipped by hand; it straightens on hover and focus.
 * Reading tickets (detail pages, articles) hang straight. `print` replays the
 * printer once when the ticket first appears.
 */
export function Ticket({
  children,
  tilt = 0,
  clip = true,
  print = false,
  className = "",
  as: Tag = "article",
}: {
  children: ReactNode;
  tilt?: number;
  clip?: boolean;
  print?: boolean;
  className?: string;
  as?: "article" | "div" | "section" | "li";
}) {
  return (
    <Tag
      className={`ticket-hang relative ${className}`}
      style={{ ["--tilt" as string]: `${tilt}deg` }}
    >
      {clip && (
        // The clip bites into the top of the paper, so the ticket reads as held.
        <span aria-hidden className="clip absolute top-[-6px] left-1/2 z-10 -translate-x-1/2" />
      )}
      <div className={`ticket px-5 pt-7 pb-6 sm:px-6 ${print ? "print-out" : ""}`}>{children}</div>
    </Tag>
  );
}

/**
 * One ticket line: label, a dotted leader, value. `stack` puts the value under
 * the label on narrow screens instead of squeezing a stub leader between them.
 */
export function LineItem({
  label,
  value,
  strong = false,
  stack = false,
}: {
  label: ReactNode;
  value: ReactNode;
  strong?: boolean;
  stack?: boolean;
}) {
  return (
    <div
      className={`font-mono text-[0.8125rem] ${
        stack ? "flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2" : "flex items-baseline gap-2"
      }`}
    >
      <span className={strong ? "font-semibold text-ink" : "text-muted"}>{label}</span>
      <span aria-hidden className={`leader ${stack ? "hidden sm:block" : ""}`} />
      <span className="text-ink">{value}</span>
    </div>
  );
}

/** A small caption printed at the top of a ticket (category, place). */
export function TicketMeta({ children }: { children: ReactNode }) {
  return <p className="text-[0.6875rem] font-semibold tracking-[0.08em] text-faint uppercase">{children}</p>;
}

/** Ticket title: the printer's wide caps, at card size. */
export function TicketTitle({
  as: Tag = "h3",
  children,
  className = "",
}: {
  as?: "h1" | "h2" | "h3";
  children: ReactNode;
  className?: string;
}) {
  return <Tag className={`ticket-head text-[1.0625rem] leading-tight ${className}`}>{children}</Tag>;
}

/** Tilts that read as hand-clipped without looking random on every render. */
export const TILTS = [-1.2, 0.8, -0.5, 1.1, -0.9, 0.6];
export const tiltAt = (i: number) => TILTS[i % TILTS.length];
