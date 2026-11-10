# Social Pharmacy Laboratory website

Static six-page academic website for the Social Pharmacy Laboratory, College of Pharmacy,
Sahmyook University. HTML and CSS only, built with Vite. No executable JavaScript, no backend,
no remote fonts or remote CSS. The visual system is the "quiet journal": warm paper, one deep
green accent, a refined serif for headings, a clean sans for everything else, hairline rules
instead of boxes, generous whitespace.

## Scope and content freeze

Routes: Home (`index.html`), Professor (`profile.html`), Research (`research.html`),
Publications (`publications.html`), Education (`education.html`), Resources (`sources.html`).
All copy is English and factual: no invented members, portraits, positions, funding, contacts,
dates or statistics.

Content is frozen. Every visible word, `href`, `img src`, `time datetime`, `title`, meta
description and JSON-LD block stays byte-identical across design work. The only permitted markup
changes are: wrapping existing text in `span`/`div` or renaming tags and classes for layout;
removing the literal `[` `]` around news dates (the `time` element now carries the date column);
removing the decorative campus `img alt=""` banner from the five inner pages (it stays on the home
hero, and photo-credit paragraphs stay everywhere); removing a `p.eyebrow` only when its text
duplicates the adjacent heading. A content check compares each page against `origin/main` on
text, hrefs, images, datetimes, title, description and JSON-LD.

## Concept

One focal point per page: the serif headline. One accent, covering at most about 5% of any
viewport. Dates, labels and captions recede into `--muted`. Rows are separated by 1px hairlines,
not cards; the only rounded surfaces are the hero photo (20px), figure cards and panels (12px) and
link chips (999px). No gradients, no shadow heavier than `0 1px 2px rgba(22,32,30,.06)`.

## Tokens (`src/styles/laboratory.css` `:root`)

- Colour: `--paper #FAF9F6` page, `--surface #FFFFFF` cards, `--surface-2 #F1F0EA` tinted
  panels, `--ink #16201E` headings and footer, `--ink-2 #2E3A37` body, `--muted #5E6B67`,
  `--line #E3E1D9` hairlines, `--line-strong #C9C6BA` chip borders, `--accent #0F6E56`,
  `--accent-ink #0A5542` hover, `--accent-soft #E6F1EC` notice band and note panels,
  `--on-dark #E8EBE8` and `--on-dark-muted #A9B3AE` footer text. No other colours.
- Type: self-hosted woff2 in `public/fonts/` (`newsreader-latin`, `newsreader-italic-latin`,
  `inter-latin`), declared with `@font-face` and `font-display: swap`. `--serif` Newsreader
  (headings, publication years, journal names, hero locator); `--sans` Inter (everything else).
- Scale (desktop / at or below 640px): display 64/1.02 weight 400 tracking -0.015em / 40;
  h1 48/1.08 / 34; h2 32/1.15 / 26; h3 22/1.3 weight 500 / 20; lede 20/1.5 / 18;
  body 17/1.65 / 16; small 14; caption and eyebrow 13px uppercase, 0.08em, weight 600.
  Headings use `text-wrap: balance`; dates use tabular numerals.
- Layout: `--shell 1200px`, gutter `clamp(20px, 5vw, 48px)`, 12-column grid with 24px gaps
  where a grid is used. Home sections are 96px apart (64 mobile); reading blocks 64px (48).
  Header 72px (64 mobile), sticky, 92% paper with `backdrop-filter: blur(10px)` and a hairline.
- Links in running text: accent, underlined at 35% accent, offset 3px; hover solid `--accent-ink`.
  Focus: `2px solid var(--accent)`, offset 3px. Transitions 160-220ms on colour, border and
  transform only.

## Shared components

- Header: serif wordmark "Social Pharmacy Lab." left; six sans links right, current page in ink
  with a 2px accent mark sitting on the header's bottom edge. Below 1024px the links hide and a
  native `details.mobile-menu` shows a text "Menu" button that drops a full-width paper panel with
  48px rows under the header; the current page is in accent.
- Footer: ink background, 64/40 padding, three columns `1.4fr 1fr auto` (identity / stacked
  links / right-aligned photo credit) at 14px, serif 20px lab name, links underline on hover only.
  One column below 820px; below 640px the footer links are 44px rows.
- Page head (inner pages): no photo. 72/48 padding, 48px serif h1, `.page-summary` lede at 62ch,
  then a hairline across the shell. Each inner page adds only its small page-specific rules in
  `src/styles/pages/<page>.css`, linked after `laboratory.css`.
- Page layout: `260px minmax(0,1fr)` grid, 72px column gap, sticky `aside.page-sidebar` at
  header height + 24px. Below 820px one column with the sidebar after the content, except that a
  sidebar leading with `dl.facts` (the professor's at-a-glance card) stays first.
- Reading block: optional accent eyebrow, 32px h2 with 24px below, paragraphs at 68ch, chips.
- `dl.facts`: caps label over 16px weight-500 value, hairlines between rows, no outer border.
- `nav.section-nav`: stacked 15px links, 12px gaps, 2px left border that turns accent on hover.
- `dl.method-list`: `200px 1fr` rows, serif 20px term (sans 13px `small` beneath), hairlines
  between rows; stacks below 640px.
- `.link-cluster`: pill chips, 13px weight 500, `--line-strong` border, accent on hover.
- `article.publication-row`: `120px 1fr`, serif 40px light year with journal abbreviation,
  caps meta, serif 26px title, serif italic subtitle, body, chips, figure. Hairline on top of each
  row. Below 640px one column with the year inline above the title.
- `figure.paper-figure`: white card, hairline, 12px radius, 16px padding, 760px max; 13px caption.
  `details.figure-disclosure` uses a drawn plus that turns into a minus when open.
- `ol.source-ledger`: `110px 1fr` rows with a caps type label, 17px link, 14px muted detail.
- `.note` / `aside.note`: `--accent-soft` panel, 12px radius, 32px padding, 24px serif h2.
- `.news-list`: `140px 1fr` rows, 14px muted tabular date, 18px text, hairlines; journal names
  in serif italic. Inside the notice band the single item is plain 17px text.

## Home composition

Header; hero (`section.lab-banner.shell`, 12-column grid, vertically centred, 96px top padding):
columns 1-5 hold the h1 split into `.hero-line` (display serif) and `.hero-at` (28px serif
italic muted locator whose "@" is dimmed via `.at-sign`) plus the 20px lede at 44ch; columns
6-12 hold the campus photo at 2:1 with `object-position: 55% 8%`, so the crop keeps sky,
mountains and buildings and trims the sports ground, 20px radius. Then, 112px below, the
full-bleed `--accent-soft` notice band (caps "Notice" label and text in a `max-content 1fr`
row, 40px gap), the three-column
index with ink top rules and arrow-suffixed serif titles, the news list, and the footer. The hero
copy and photo rise in over 640ms with an 80ms stagger; `prefers-reduced-motion` disables it.

## Breakpoints

1024: desktop nav -> Menu, sidebar 220px. 900: hero stacks, photo 16:10 (same object-position)
at 16px radius, display
56px. 820: sidebar and footer stack. 720: index grid stacks. 640: mobile type scale, 64px header,
news and publication rows stack, method-list and source-ledger stack, section rhythm 64px.

## Assets and attribution

Campus image: <https://www.syu.ac.kr/wp-content/uploads/2025/12/%EC%82%AC%EC%A7%842-%EC%82%BC%EC%9C%A1%EB%8C%80-%EC%A0%84%EA%B2%BD-scaled.jpg>,
carried as WebP inside `public/images/campus-640.svg` and `campus-1280.svg`. Credit Sahmyook
University and keep the source link. Paper figures: Yoon EL et al., DOI 10.3350/cmh.2025.0796,
CC BY-NC 3.0; keep original URLs, dimensions, alternative text and visible attribution.

## Verification

`bun run build` must exit 0 with six HTML pages in `dist/`. Check all routes at 390, 820 and
1440px for horizontal overflow, navigation switching, the mobile Menu, focus visibility and the
publication disclosure, and confirm both Newsreader and Inter load from `/fonts/`.
