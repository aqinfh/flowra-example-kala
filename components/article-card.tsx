import Link from "next/link";
import { Photo } from "@/components/photo";
import { Ticket, TicketMeta, TicketTitle } from "@/components/ticket";
import type { Article } from "@/lib/flowra";

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** Ticket-style timestamp, e.g. "01.10.2026". */
export const ticketDate = (iso: string) => {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getUTCDate())}.${p(d.getUTCMonth() + 1)}.${d.getUTCFullYear()}`;
};

export const authorNames = (a: Article) => a.author.map((x) => x.title).join(", ");

export function ArticleCard({
  article,
  headingLevel = 3,
  tilt = 0,
}: {
  article: Article;
  headingLevel?: 2 | 3;
  tilt?: number;
}) {
  return (
    <Ticket tilt={tilt} className="h-full">
      <div className="flex items-baseline justify-between gap-3">
        <TicketMeta>{article.category || "Journal"}</TicketMeta>
        <time dateTime={article.publishedAt} className="font-mono text-[0.6875rem] text-faint">
          {ticketDate(article.publishedAt)}
        </time>
      </div>
      {article.cover_image && (
        <Photo
          src={article.cover_image.w400} alt=""
          width={article.cover_image.width} height={article.cover_image.height}
          sizes="(min-width: 1024px) 30vw, 90vw"
          className="mt-3 aspect-[4/3] object-cover"
        />
      )}
      <TicketTitle as={`h${headingLevel}`} className="mt-4 text-lg">
        <Link href={`/journal/${article.slug}`} className="after:absolute after:inset-0 hover:underline">
          {article.title}
        </Link>
      </TicketTitle>
      <p className="mt-2 text-sm leading-relaxed text-muted">{article.excerpt}</p>
      {authorNames(article) && <p className="mt-4 text-xs text-faint">By {authorNames(article)}</p>}
    </Ticket>
  );
}
