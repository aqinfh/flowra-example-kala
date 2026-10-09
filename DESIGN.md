---
name: Kala Coffee Roasters
description: A specialty roaster's site set as the brew-bar ticket rail, thermal-paper tickets clipped to a steel bar.
colors:
  wall: "#e9e5dd"
  paper: "#fbfaf7"
  ink: "#141210"
  ink-hover: "#3a3530"
  muted: "#5f584f"
  faint: "#6f685e"
  rule: "#d8d2c8"
  steel: "#a9a399"
  steel-dark: "#6c675f"
  thermal: "#c8412b"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3.1rem"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 125"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 125"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 125"
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  body-long:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    letterSpacing: "0.06em"
  caption:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    letterSpacing: "0.08em"
  data:
    fontFamily: "Martian Mono, ui-monospace, SF Mono, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
  price:
    fontFamily: "Martian Mono, ui-monospace, SF Mono, monospace"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.33
rounded:
  hardware: "3px"
spacing:
  ticket-x: "24px"
  ticket-top: "28px"
  ticket-bottom: "24px"
  gutter: "24px"
  row-gap: "40px"
  section: "96px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.hardware}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "{colors.ink-hover}"
    textColor: "{colors.paper}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.hardware}"
    padding: "12px 20px"
  button-outline-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  chip-filter:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    rounded: "{rounded.hardware}"
    padding: "8px 16px"
  chip-filter-selected:
    backgroundColor: "{colors.thermal}"
    textColor: "{colors.paper}"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    rounded: "{rounded.hardware}"
    padding: "8px 12px"
  nav-link-hover:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  ticket:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "28px 24px 24px"
  footer:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    padding: "48px 32px"
---

# Design System: Kala Coffee Roasters

## Overview

**Creative North Star: "The Ticket Rail"**

The site is the brew bar's order rail. Every coffee, journal article, café and team member is a thermal-paper ticket clipped to a steel rail and printed in ink. The rail is real hardware in the interface: a rolled steel bar with screws at each end runs under the header and above every list, and tickets hang from it with a bulldog clip, a few degrees off true, straightening when you reach for them. The wall behind the rail is warm grey; the paper is a shade off white.

Density is that of a printed receipt: wide bold caps for titles, quiet reading text, and a monospace character grid for anything that is a number or a data line (prices, altitudes, dates, opening hours), joined to its label by a dotted leader. Printer red is the only second colour and appears where a receipt printer would use it: the announcement, the price in focus, the selected filter. Photography sits inside the tickets as real printed content, never as full-bleed backdrops.

The system was built to refuse two familiar roaster looks: the full-bleed-photo theme, and the cream-paper, serif and terracotta label look.

**Key Characteristics:**
- Content lives on tickets; tickets hang from a rail.
- Ink is the only text colour family; printer red is the single accent.
- Three type voices: wide bold caps (headers), plain Archivo (reading), Martian Mono (numbers and data lines).
- Perforated top and bottom edges, a soft hanging shadow, a slight hand-clipped tilt.
- Motion is mechanical and rare: a one-time print-out and a straighten-on-hover.

## Colors

A near-monochrome warm-grey and ink palette with one printer red.

### Primary
- **Printer Red** (thermal): the only accent. Used for the announcement line, the price on a coffee detail ticket, and the selected roast filter. Text in this colour sits on paper, where it clears AA (4.7:1); on the wall it does not.

### Neutral
- **Thermal Paper** (paper): every ticket surface, the text colour on ink, and the nav hover fill.
- **Rail Wall** (wall): the page background behind the rail.
- **Print Ink** (ink): all primary text, the primary button, the honesty strip and the footer band. The focus ring and text selection are ink too.
- **Worn Ink** (ink-hover): the primary button's hover fill, defined as a theme colour beside ink. Use it for nothing else.
- **Faded Print** (muted): secondary text such as tasting notes, ledes, nav links at rest, line-item labels. It is also the colour for small secondary text sitting directly on the wall (the filter's live count, empty states), where it passes AA (5.6:1).
- **Light Print** (faint): captions, dates, bylines. Use on paper; on the wall it falls under AA for small text (4.4:1).
- **Paper Rule** (rule): hairlines in tables, dotted dividers between rows on a ticket, and the placeholder fill behind photos while they load.
- **Steel** (steel) and **Shadowed Steel** (steel-dark): the rail, the clips, dotted leaders, dotted section breaks on a ticket, and resting chip borders. Steel is hardware, not text: never set copy in it.

### Named Rules
**The One Red Rule.** Printer red marks what needs attention right now: the announcement, a price in focus, the active filter. Nothing decorative is red, and no other hue joins it.

**The Ink-Only Rule.** Text is ink or a lighter ink (muted, faint). Brand colour does not appear in text except as Printer Red under the One Red Rule.

## Typography

**Display Font:** Archivo, set wide via its width axis (with ui-sans-serif, system-ui)
**Body Font:** Archivo, normal width
**Label/Mono Font:** Martian Mono (with ui-monospace, SF Mono)

**Character:** One family in two widths does the talking, the way a receipt printer stretches its title line and prints the rest normally; Martian Mono lines up every figure on one character grid.

### Hierarchy
- **Display** (800, wide 125%, 2rem to 3.1rem, line-height 1.02, uppercase): the hero ticket headline only.
- **Headline** (800, wide 125%, 2.25rem to 3rem, uppercase): page titles; section heads step down to 1.5rem to 1.875rem.
- **Title** (800, wide 125%, 1.0625rem at card size, up to 2.5rem on a detail or article ticket, uppercase): every ticket's title, including the not-found and error tickets. On those, the title comes first, then a one-line message, then any status code as a small mono data line, never as a caption above the title.
- **Body** (400, 1rem, line-height 1.625; ledes at 1.125rem): card copy and ledes, capped near 34rem.
- **Body Long** (400, 1.0625rem, line-height 1.75): article bodies in a 40rem column; subheads use 112% width at 750.
- **Label** (600, 0.8125rem, 0.06em tracking, uppercase): buttons, nav, filters, "All coffees" style links.
- **Caption** (600, 0.6875rem, 0.08em tracking, uppercase, faint): field names on a ticket (Address, Opening hours), a role under a name, an article's category.
- **Data** (Martian Mono 400, 0.8125rem): line items, opening hours, dates, status codes (0.6875rem to 0.75rem on cards and the 404 code line).
- **Price** (Martian Mono 600, 1.5rem to 1.875rem): prices that are the subject of the row or the page.

### Named Rules
**The Printer's Width Rule.** Headers are wide (125% width, 800, uppercase, -0.01em); reading text is never wide. If it is longer than a title, set it at normal width.

**The One Grid Rule.** Anything that is a number or a data value (price, altitude, date, hours) is set in Martian Mono. Labels and prose are not.

## Layout

A single centred column capped at 72rem (max-w-6xl) with 20px side padding, 32px from 640px up. The rail runs the full column width under the header, and every list of tickets starts with its own rail directly above it, with tickets hanging 8px below.

Ticket grids are one column on mobile, two at 640px or 768px, three at 1024px, with 24px column gutters and 40px row gaps. Home sections are separated by 80px (96px from 640px). Reading surfaces narrow: the coffee detail is a two-column ticket pair at 1024px (photo ticket sticky on the left), the article is one 48rem ticket with a 40rem text measure inside.

On a busy rail (the journal lists, from 768px), tickets overlap: each newer ticket covers the left 16px of the older one, every second ticket drops 24px, and covered tickets carry 56px of left padding so only blank paper is ever hidden. The hovered or focused ticket rises to the top.

Line items keep label, leader and value on one baseline; where the value is long on a narrow screen, the value drops under the label and the leader is removed rather than squeezed.

## Elevation & Depth

Depth is physical and comes from the hardware: paper hangs in front of the wall, the rail sits proud of it, and the clip sits proud of the paper. Everything is lit from above, so every shadow falls down. Nothing else floats.

### Shadow Vocabulary
- **Hanging paper** (`box-shadow: 0 1px 1px rgb(20 18 16 / 0.06), 0 14px 28px -16px rgb(20 18 16 / 0.35)`): every ticket.
- **Rail lip** (`box-shadow: 0 3px 4px -1px rgb(20 18 16 / 0.25)`): the steel rail.
- **Clip** (`box-shadow: 0 2px 2px rgb(20 18 16 / 0.3)`): the bulldog clip on a ticket.
- **Pressed key** (`box-shadow: 0 6px 12px -6px rgb(200 65 43 / 0.6)`): the selected roast filter, together with a 2px lift.

### Named Rules
**The Gravity Rule.** Shadows exist only where an object physically hangs or protrudes, and they always fall downward. Do not add shadows to text, photos, or flat controls at rest.

## Shapes

Paper has no corner radius; its top and bottom edges are perforated with a row of 5px half-circles every 16px, punched out with a mask so the wall shows through. Hardware and controls take a tight 3px radius (rail, clip, buttons, chips, nav hover). Photos are square-cornered and cropped to fixed ratios: square for coffees and team, 4:3 for articles, 4:5 for cafés. Dividers inside a ticket are 2px dotted, in steel for section breaks and rule for row separators, echoing the leader.

## Components

### Buttons
Printed-key buttons: compact, uppercase, flat.
- **Shape:** gently squared (3px).
- **Primary:** ink fill, paper label text, 12px by 20px, optional trailing arrow. Hover darkens to Worn Ink.
- **Outline:** 1px ink border, ink label; hover fills ink with paper text.
- **Focus:** global 2px ink outline at 3px offset.
- **Text link with arrow:** label type in muted, turning ink on hover; used for "All coffees", "The journal", back links.

### Chips
- **Style:** roast filter keys: 1px steel border, muted label text, 8px by 16px, 3px radius.
- **State:** hover turns border and text ink; selected fills Printer Red with paper text, lifts 2px and takes the Pressed key shadow (300ms). Exposed as toggle buttons with a live count beside them.

### Cards / Containers
The ticket is the only container.
- **Corner Style:** none; perforated top and bottom edges.
- **Background:** paper.
- **Shadow Strategy:** Hanging paper (see Elevation & Depth).
- **Border:** none.
- **Internal Padding:** 28px top, 24px bottom, 20px sides (24px from 640px).
- **Clip:** a 44px by 18px steel bulldog clip bites 6px into the top edge, centred. The hero ticket, which hangs directly from the header rail, has no clip.
- **Tilt:** list tickets hang between -1.2 and 1.1 degrees from a fixed sequence so the rail looks hand-clipped yet renders identically every time. Reading tickets (article body, coffee detail text) hang straight.

### Navigation
Uppercase label type in muted, 8px by 12px hit area. Hover fills paper with ink text, like lifting a ticket off the wall. The wordmark beside the logo is set as a ticket header. On narrow screens the links wrap under the logo; the rail follows directly below.

### Line Item (signature)
A label, a 2px dotted steel leader that fills the gap on the text baseline, and a value, in Data type. Labels are muted; a strong line (the price) sets its label in ink at 600. On home, featured coffees are line items at full size: thumbnail, title and notes, leader, then the price in Price type.

### Rail (signature)
A 12px rolled steel bar: a 2px lit top edge, steel body, shadowed lower lip, 3px radius, and a 6px dark screw head 10px in from each end. Purely decorative and hidden from assistive technology.

### Long-form text
Article bodies use Body Long. Links are underlined in steel and darken to ink on hover; blockquotes are 1.25rem italic with a hanging ink quote mark; lists use square bullets; tables use rule hairlines; code uses Martian Mono at 0.85em. The ticket closes with a dotted steel rule and a centred "End of ticket" caption.

### Bands
The honesty strip on top and the footer below are solid ink bands with paper text (footer secondary text at 75 to 80% paper), the only places the page leaves the wall.

### Motion
- **Print-out:** a ticket marked to print reveals top to bottom in 18 discrete steps over 1.1s, once, on first appearance (the hero, a coffee detail, an article).
- **Straighten:** a tilted ticket rotates to true on hover or focus in 0.45s on `cubic-bezier(0.22, 1, 0.36, 1)`, pivoting from its clip.
- Both are removed under reduced motion; tickets then hang straight.

## Do's and Don'ts

### Do:
- **Do** put every piece of CMS content on a ticket, and start every list of tickets with a rail.
- **Do** set every ticket title in the wide uppercase header style (800, 125% width) and every number in Martian Mono.
- **Do** join a label to its value with a dotted leader on one baseline, and stack them on narrow screens instead of squeezing the leader.
- **Do** keep Printer Red on paper, and only for the announcement, a price in focus, or the active filter.
- **Do** take tilts from the fixed tilt sequence so renders are stable, and keep reading tickets straight.
- **Do** keep photos inside tickets at a fixed aspect ratio, with the rule colour as the loading fill.
- **Do** honour reduced motion: no print-out, no tilt.

### Don't:
- **Don't** run photos full-bleed across the page or behind text; that is the roaster theme this system rejects.
- **Don't** drift toward cream paper, a serif display face and terracotta accents; that is the label look this system rejects.
- **Don't** introduce a second accent colour or use Printer Red decoratively.
- **Don't** set long text in the wide header style, or set prose in Martian Mono.
- **Don't** round ticket corners or replace the perforated edge with a border.
- **Don't** add shadows that do not come from something hanging or protruding.
- **Don't** set faint text or Printer Red text on the wall colour; both fall under AA there. Use muted for small text on the wall.
- **Don't** add a small caption line above a heading just to introduce it; captions on a ticket carry real data (a category, a field name, a role).
