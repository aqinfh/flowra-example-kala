import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { authorNames, formatDate } from "@/components/article-card";
import Link from "next/link";
import { Photo } from "@/components/photo";
import { ArrowLeft } from "@/components/icons";
import { Rail, Ticket, TicketTitle } from "@/components/ticket";
import { getArticleBySlug, listJournal, PUBLIC_SOURCE } from "@/lib/flowra";
import { RichText } from "@/components/rich-text";

export const revalidate = 60;
export const dynamicParams = true;

// Build time has no request, so no Draft Mode: always the public workspace.
export async function generateStaticParams() {
  const slugs = (await listJournal(100, PUBLIC_SOURCE)).map((a) => a.slug).filter(Boolean);
  return [...new Set(slugs)].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  return article ? { title: article.title, description: article.excerpt || undefined } : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <article className="mx-auto max-w-3xl">
      {/* A long ticket roll: the article reads like one continuous printout. */}
      <Rail />
      <Ticket as="div" print className="mt-2">
        <div className="mx-auto max-w-[40rem] py-4">
          <TicketTitle as="h1" className="text-[1.875rem] sm:text-[2.5rem]">{article.title}</TicketTitle>
          {/* Byline row under the title: who, which section, when. */}
          <p className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm text-faint">
            {authorNames(article) && <span>By {authorNames(article)}</span>}
            {authorNames(article) && article.category && <span aria-hidden>·</span>}
            {article.category && <span>{article.category}</span>}
            <span aria-hidden>·</span>
            <time dateTime={article.publishedAt} className="font-mono text-xs">
              {formatDate(article.publishedAt)}
            </time>
          </p>
          {article.cover_image && (
            <div className="mt-8">
              <Photo
                src={article.cover_image.w1200} alt=""
                width={article.cover_image.width} height={article.cover_image.height}
                sizes="(min-width: 768px) 640px, 90vw" preload
              />
            </div>
          )}
          <RichText html={article.body} className="mt-10" />
          <p className="mt-12 border-t-2 border-dotted border-steel pt-4 text-center text-[0.6875rem] font-semibold tracking-[0.08em] text-faint uppercase">
            End of ticket
          </p>
        </div>
      </Ticket>
      <Link
        href="/journal"
        className="mt-8 inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold tracking-[0.06em] text-muted uppercase hover:text-ink"
      >
        <ArrowLeft /> The journal
      </Link>
    </article>
  );
}
