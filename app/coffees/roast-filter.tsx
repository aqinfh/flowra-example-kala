"use client";

import { useState } from "react";
import { CoffeeCard } from "@/components/coffee-card";
import { Rail, tiltAt } from "@/components/ticket";
import type { ShopCoffee } from "@/lib/flowra";

const ROASTS = ["All", "Light", "Medium", "Dark"] as const;

export function RoastFilter({ coffees }: { coffees: ShopCoffee[] }) {
  const [roast, setRoast] = useState<(typeof ROASTS)[number]>("All");
  const shown = roast === "All" ? coffees : coffees.filter((c) => c.roast === roast);
  const count = shown.length === 1 ? "1 coffee shown" : `${shown.length} coffees shown`;
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Filter by roast" className="flex flex-wrap gap-2">
          {ROASTS.map((r) => (
            <button
              key={r} type="button" onClick={() => setRoast(r)} aria-pressed={roast === r}
              className={`rounded-[3px] border px-4 py-2 text-[0.8125rem] font-semibold tracking-[0.06em] uppercase transition-[transform,background-color,color] duration-300 ${
                roast === r
                  ? "-translate-y-0.5 border-thermal bg-thermal text-paper shadow-[0_6px_12px_-6px_rgb(200_65_43/0.6)]"
                  : "border-steel text-muted hover:border-ink hover:text-ink"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted" aria-live="polite">{count}</p>
      </div>
      <Rail />
      {shown.length === 0 ? (
        <p className="py-12 text-muted">No coffees match this roast right now.</p>
      ) : (
        <ul className="mt-2 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((c, i) => (
            <li key={c.slug}>
              <CoffeeCard {...c} tilt={tiltAt(i)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
