# Product

## Platform

web

## Users

- **Primary: prospective Flowra customers** (agencies and founders) evaluating what a site built on Flowra looks like. They arrive from the Flowra landing page or from "View website" in the demo dashboard. The site must read as a real client site made by a good agency, so they can picture their own result.
- **Secondary: developers** reading the public source on GitHub to copy how a frontend connects to Flowra.
- In the fiction, the site's audience is coffee drinkers in Jakarta and Bali looking at Kala's coffees, journal and cafés.

## Product Purpose

A sample website for "Kala Coffee Roasters", a fictional specialty coffee roaster in Jakarta. Every piece of content (homepage hero, coffees, origins, journal articles, cafés, team, SEO metadata) comes from Flowra's public demo workspace at demo.withflowra.com. It is the "View website" for that workspace and a public starter template. Success: a prospective customer believes this could be their client's site, and an edit published in the dashboard shows up on the site without a deploy.

## Positioning

A real, content-complete site wired to a live CMS workspace, not a mockup: what you see is exactly what the demo dashboard holds, and the code is open.

## Operating Context

- Lives at kala.withflowra.com (planned), source at github.com/aqinfh/flowra-example-kala (planned, public).
- Content is edited in the Flowra dashboard; publishing triggers a webhook that refreshes the site.
- Next.js 16 App Router, Tailwind CSS v4, deployed on Vercel.

## Capabilities and Constraints

- Pages: home, coffees (list with roast filter, detail), journal (list, article), cafés, about (team).
- No commerce: prices are text from the CMS; there is no cart, checkout or buy button, and none may be added.
- All content comes from the CMS; the design must hold up when editors change text length, images or the number of entries.
- Article HTML is sanitized; the design styles only the allowed tags (paragraphs, h2–h4, lists, blockquote, links, images, code, tables).
- One light look; no dark mode.
- Not indexed by search engines (the workspace sets allowIndexing false).

## Brand Commitments

- Name: Kala Coffee Roasters. Logo: a terracotta coffee-cherry mark with a "kala" wordmark, served from the workspace (`_meta` favicon/og image; logo assets live in the workspace media library).
- A thin honesty strip on every page, verbatim: "Sample site built on Flowra · Kala Coffee Roasters is a fictional company", linking to withflowra.com and the GitHub repo.
- The CMS announcement bar ("Free shipping across Jabodetabek on orders over IDR 300,000") is shown (owner decision, 2026-10-09).
- The site is Kala's brand, not Flowra's: it must not look like the Flowra landing page.

## Evidence on Hand

- Real photos from the demo workspace (Unsplash License): coffee bags, beans, pour-over, café interiors, farms, team portraits (~41 images).
- Real copy written for Kala: 9 published coffees with tasting notes and origins, 5 journal articles with full bodies, 3 cafés with addresses and hours, 5 team bios, homepage hero copy.
- Kala is fictional: no reviews, ratings, press, awards or sales figures exist, and none may be invented.

## Product Principles

1. Content is the design's material: everything shown comes from the CMS and must survive edits.
2. Believable before clever: it should feel like a real roaster's site an agency shipped, so Flowra's prospects trust the result.
3. Honest fiction: clearly labelled as a sample, never implying real commerce.
4. Copyable: the structure stays simple enough that a developer can lift a page into their own project.

## Accessibility & Inclusion

WCAG AA contrast, keyboard paths, meaningful alt text from content, respect for reduced motion.
