"use client";

import { Rail, Ticket } from "@/components/ticket";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-md py-10">
      <Rail />
      <Ticket as="div" className="mt-2 text-center">
        <h1 className="ticket-head text-xl leading-tight">We couldn&apos;t load content from Flowra right now.</h1>
        <button
          type="button" onClick={reset}
          className="mt-6 rounded-[3px] border border-ink px-5 py-3 text-[0.8125rem] font-semibold tracking-[0.06em] uppercase hover:bg-ink hover:text-paper"
        >
          Try again
        </button>
      </Ticket>
    </div>
  );
}
