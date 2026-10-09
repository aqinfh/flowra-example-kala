import Link from "next/link";
import { Rail, Ticket } from "@/components/ticket";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-10">
      <Rail />
      <Ticket as="div" tilt={1} className="mt-2 text-center">
        <h1 className="ticket-head text-3xl">Not on the rail</h1>
        <p className="mt-3 text-muted">We couldn&apos;t find what you were looking for.</p>
        <p className="mt-4 font-mono text-xs text-faint">404</p>
        <Link href="/" className="mt-6 inline-block rounded-[3px] bg-ink px-5 py-3 text-[0.8125rem] font-semibold tracking-[0.06em] text-paper uppercase hover:bg-ink-hover">
          Back to the homepage
        </Link>
      </Ticket>
    </div>
  );
}
