import type { Metadata } from "next";
import { Archivo, Martian_Mono } from "next/font/google";
import { Suspense } from "react";
import { PreviewNotice } from "@/components/preview-notice";
import { PreviewStrip } from "@/components/preview-strip";
import { SampleBanner } from "@/components/sample-banner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getMeta } from "@/lib/flowra";
import "./globals.css";

// Archivo carries a width axis: ticket headers are set stretched wide, the
// way receipt printers set titles; body text uses the normal width.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

// Numbers and data lines (prices, altitudes, dates, hours) share one mono grid.
const martian = Martian_Mono({
  variable: "--font-martian",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const m = await getMeta();
  return {
    title: { default: m.metaTitle ?? m.siteName, template: `%s · ${m.siteName}` },
    description: m.metaDescription ?? undefined,
    openGraph: m.ogImage ? { images: [{ url: m.ogImage.w1200 }] } : undefined,
    icons: m.favicon ? { icon: m.favicon.w400 } : undefined,
    robots: m.allowIndexing ? undefined : { index: false, follow: false },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${martian.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SampleBanner />
        <PreviewStrip />
        <div role="status" aria-live="polite">
          <Suspense fallback={null}>
            <PreviewNotice />
          </Suspense>
        </div>
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl flex-1 px-5 pt-10 sm:px-8">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
