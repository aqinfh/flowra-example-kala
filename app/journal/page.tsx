import type { Metadata } from "next";
import { ArticleCard } from "@/components/article-card";
import { PageHead } from "@/components/page-head";
import { Rail, tiltAt } from "@/components/ticket";
import { listJournal } from "@/lib/flowra";

export const revalidate = 60;
export const metadata: Metadata = { title: "Journal" };

export default async function JournalPage() {
  const articles = await listJournal();
  return (
    <div>
      <PageHead title="Journal" />
      <Rail />
      {articles.length === 0 ? (
        <p className="py-12 text-muted">Nothing on the rail yet.</p>
      ) : (
        <ul className="rail-stack mt-2 grid gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((a, i) => (
            // Newest on top: older tickets sit partly underneath.
            <li key={a.ref} className="relative" style={{ zIndex: articles.length - i }}>
              <ArticleCard article={a} headingLevel={2} tilt={tiltAt(i + 1)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
