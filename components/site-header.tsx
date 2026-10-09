import Link from "next/link";
import { getMeta } from "@/lib/flowra";
import { Rail } from "@/components/ticket";

const links = [
  { href: "/coffees", label: "Coffees" },
  { href: "/journal", label: "Journal" },
  { href: "/cafes", label: "Cafés" },
  { href: "/about", label: "About" },
];

export async function SiteHeader() {
  const { siteName, favicon } = await getMeta();
  return (
    <header>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-3 px-5 pt-6 pb-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label={`${siteName}, home`}>
          {favicon && (
            // The workspace favicon is Kala's mark; it doubles as the logo here.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={favicon.w400} alt="" width={36} height={36} className="h-9 w-9" />
          )}
          <span className="ticket-head text-[1.0625rem] leading-none">{siteName}</span>
        </Link>
        <nav aria-label="Main">
          <ul className="flex gap-1 text-[0.8125rem] font-semibold tracking-[0.06em] uppercase">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block rounded-[3px] px-3 py-2 text-muted transition-colors hover:bg-paper hover:text-ink"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Rail />
      </div>
    </header>
  );
}
