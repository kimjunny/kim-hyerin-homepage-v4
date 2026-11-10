# Reference research — nine institutional and lab homepages

Prepared for the Social Pharmacy Laboratory homepage rebuild (Sahmyook University, College of Pharmacy). Evidence base: `.audit/references/<slug>-desktop-fold.png` (1440x900 viewport crop) and `.audit/references/<slug>-mobile-fold.png` (390x844), captured 2026-11-09 from the live sites. Only fold crops were read; full-page captures were never opened.

Comparison baseline: `.audit/shots/review/index-full.png` (current site, 1440x4629), sliced offline for the hero, news, explore and footer.

## 1. Ranked candidates

| # | Site | URL | Why it earns its place | Desktop fold | Mobile fold |
|---|---|---|---|---|---|
| 1 | Arc Institute | https://arcinstitute.org/ | Light 12-col field, serif H1 in one accent hue, research rows that read like a journal contents page. | `.audit/references/arc-institute-desktop-fold.png` | `.audit/references/arc-institute-mobile-fold.png` |
| 2 | Emery Lab | https://emery-lab.org/ | Cream paper, 60px display serif over a field-site photograph, one olive CTA — the warmest credible lab in the set. | `.audit/references/emery-lab-desktop-fold.png` | `.audit/references/emery-lab-mobile-fold.png` |
| 3 | IHME | https://www.healthdata.org/ | Closest subject match: mission headline, one solid CTA tied by a left rule, figure-led story cards. | `.audit/references/ihme-desktop-fold.png` | `.audit/references/ihme-mobile-fold.png` |
| 4 | Blavatnik School of Government | https://www.bsg.ox.ac.uk/ | Best people-photograph hero with a single outline CTA; the all-caps voice is too plaque-like to copy whole. | `.audit/references/blavatnik-school-desktop-fold.png` | `.audit/references/blavatnik-school-mobile-fold.png` |
| 5 | Eddy Lab | https://www.eddy-lab.org/ | Human palette and a clean three-beat hero (who / what / next); illustration solves the no-portrait problem. | `.audit/references/eddy-lab-desktop-fold.png` | `.audit/references/eddy-lab-mobile-fold.png` |
| 6 | Harvard CHDS | https://chds.hsph.harvard.edu/ | People portraits beside a recent-news rail — the pattern to fix our news section, minus the portal chrome. | `.audit/references/harvard-chds-desktop-fold.png` | `.audit/references/harvard-chds-mobile-fold.png` |
| 7 | Biohub | https://biohub.org/ | Accent-dosage model: near-black field, one violet pill and one bracket, a mission sentence and nothing else. | `.audit/references/biohub-desktop-fold.png` | `.audit/references/biohub-mobile-fold.png` |
| 8 | Bennett School of Public Policy | https://www.bennettinstitute.cam.ac.uk/ | Full-bleed documentary hero, but three equal outline buttons and four accent colours compete. | `.audit/references/bennett-institute-desktop-fold.png` | `.audit/references/bennett-institute-mobile-fold.png` |
| 9 | Galárraga Health Economics Lab | https://sites.brown.edu/galarragaresearchlab/ | The anti-pattern we are escaping: template column, skyline banner, link-only hierarchy. | `.audit/references/galarraga-lab-desktop-fold.png` | `.audit/references/galarraga-lab-mobile-fold.png` |

Ranking criteria, in order: fit for a health-economics lab (subject credibility), a hero that states who/what/next in one screen, an information pattern we can reuse for news/publications/people, palette and type we can hold across six pages, and how little of it must be discarded.

## 2. Per-site observations

Each block is based on the desktop fold (1440x900) and the mobile fold (390x844) of that site. Numbers come from the capture-time computed styles in `_tools/capture-metrics.json` and `capture-metrics-2.json`.

### 1. Arc Institute — https://arcinstitute.org/


- **Grid / 1440.** 12-col field on `#F7F9FB`: hero text sits cols 1-5 (x48, 660px wide), while cols 7-12 hold a blue particle-rendered protein; the two elements share one band, not two stacked blocks. Below, "Featured Research" is a full-width editorial index: date + journal in a narrow left column (x48), headline in the right 7 cols.
- **Type.** Tiempos Headline serif for H1/H2 at 40px/300, line-height 48; body IBM Plex Sans 16/24. H1 is 2 lines at 1440 and 32px on mobile. Measure is ~70 chars in the lead paragraphs; no justified text.
- **Palette.** Near-white cool field, ink `#11181C`/`#0C2043`, one saturated blue `#0073E6` carrying H1, links, announcement bar and the hero figure; cream `#FBF8F2` only on the footer band. Accent is loud in the hero, then drops to links and chips — a single-hue system, not multi-accent.
- **Hero statement.** Announces what the organization is ("A full-stack institute for AI and biology research.") in the accent serif; identity is carried by the wordmark in a 48px nav. No hero buttons at all — the first action is scrolling into "Featured Research", whose "See all research →" is the only nav-like CTA above the fold. The visual is one abstract scientific figure (a dot-cloud protein) that bleeds to the band's bottom edge; no stock photography, no portraits in the fold.
- **News / publications.** One row per item, not cards: `08.2026 • Cell` in small blue-ink meta, a blue outline tag (`COMPUTATIONAL`), then a 22-24px sans headline across the remaining width. Hierarchy comes from the headline size and a rule between rows.
- **Mobile.** Announcement bar becomes a 2-line message with a close X; nav reduces to wordmark + hamburger; H1 32px; the particle figure drops behind the lower third of the text as a cropped right-edge element. Content is one column with 24px gutters.

### 2. Emery Lab — https://emery-lab.org/


- **Grid / 1440.** Full-bleed photo hero under a 96px cream masthead (logo lockup left, four nav items centre-right, olive pill "JOIN THE LAB" at x805-941). Hero text occupies the left 45% (x86, 739px), leaving the mountain ridge visible to the right; a solid pale-yellow band starts at y530 and becomes the next section's field.
- **Type.** IvyPresto Display serif at 59.7px/400, line-height 70.5, in cream `#FEFAF1`; body Sofia Pro 20px with a slightly heavy weight for a lab. Section H2 42.5px. This is the most editorial display scale in the set and the closest match to a university-press feel.
- **Palette.** Cream paper `#FEFAF1`, deep forest `#192D2B`, the photo's blues/greens, and an olive-yellow `#BEBE31` used for the single header CTA and band; a butter `#FAE59F` band follows the hero. Two warm neutrals plus one olive accent, no blue institutional chrome at all.
- **Hero statement.** A research question as the headline ("Exploring ecological change in its evolutionary context"), then a 4-line plain-language mission with the phrase "Their goal is to" spelled out. No button in the hero — the next step is the header's Join the Lab pill, so the fold stays declarative.
- **News, people, CTA and imagery.** Below the fold; nav uses Research / Our Team / Lab News / Publications. The site keeps a research-first order rather than news-first. One wide landscape photograph doing all the work; the subject (a mountain valley) is the lab's field site, so the image is evidence of the research, not decoration. Logo is a hand-drawn leaf-and-bird mark that picks up the olive accent.
- **Mobile.** Photo crops to a portrait band; H1 39px in five lines over the ridge; body 17px; the Join pill disappears from the header leaving wordmark + hamburger. Text remains left-aligned with 24px gutters.

### 3. IHME — https://www.healthdata.org/


- **Grid / 1440.** A 1440px canvas with a 117px left margin: a navy utility bar (Contact/Research library/Data catalog/Give now + language), a white 76px nav with four bordered dropdowns and a search cell, then a 353px full-bleed hero. Content begins at x117 with a 730px text block; the hero's right half is graphic.
- **Type.** Archivo — H1 50px/300 at line-height 1.1 in near-white, H2 37px/600, body 18px. A light display weight plus a heavy section weight gives contrast without a second family.
- **Palette.** Deep teal-navy `#02262E`, green `#1E7B53` (SUPPORT button, links) with `#0F7C95` as secondary, mint `#F2FBF5` and `#EFFBFB` tinted section fields, warm off-white `#FFFEFC`. The hero graphic is a multi-hue ribbon gradient, but UI accent stays green and one solid button.
- **Hero statement.** A mission as a headline ("All people living long lives in full health"), a two-line who/what ("At IHME, based at the University of Washington...") and one solid green button "SUPPORT OUR MISSION". A thin white vertical rule at the left of the text block ties headline, body and CTA into one column — a simple, repeatable hero anatomy.
- **News, people, CTA and imagery.** "Featured stories" is a carousel with category overlines (COMMENTARY, VIDEO), 22px headlines, and a 1/5 counter with square arrow buttons; stories mix data visuals, video thumbnails, and multilingual text graphics. Publications live under "Research and analysis" in the nav rather than in the fold. The hero is a generative ribbon/gradient animation, not a photo; story cards use real charts, videos and covers. The site is data-first: imagery is evidence, not atmosphere.
- **Mobile.** Utility bar keeps only the institute name; logo + search + hamburger on white; hero keeps the left rule, H1 38px in three lines, body 16px, full-width green button; the featured carousel shows one card with the arrow pair above it.

### 4. Blavatnik School of Government — https://www.bsg.ox.ac.uk/


- **Grid / 1440.** No visible container above the fold: the nav is a transparent bar over a full-bleed photo band (the measured hero container spans the page's whole 8160px image stack), with the two lockups (BSG mark + Oxford) stacked at x48 and nav right-aligned at the same 48px margin. The headline band is the entire first screen; sections below are full-bleed image + text modules with 72px gutters.
- **Type.** Brandon Text / Open Sans; H1 is all caps 32px/700 at line-height 52.8 with wide tracking over the photo, giving a plaque-like institutional voice. Body 16px black. Section H2s 24px/700. The school leans on uppercase, not a serif.
- **Palette.** Photography supplies all colour; UI ink is white on photo, black on white body bands, with a single orange `#FF9600` reserved for focus/hover and a dark slate `#1F2A3E` for the cookie panel and nav text. Accent dosage is close to zero on the page itself.
- **Hero statement.** A governance slogan ("A world better led, better served and better governed") in caps over a seminar photo, with one white outline button "APPLY NOW" centered under it. The school's purpose is stated as a mission, not as a programme list, and exactly one action is offered.
- **News, people, CTA and imagery.** Not in the fold — the fold is deliberately one image and one sentence; navigation carries Study/Research/People/Events/About as five dropdowns. Content below is event and news card bands. A candid photograph of a discussion, faces included, cropped so the centre is mid-table and the headline sits across the subjects' chests. This is the strongest "people not stock" hero in the set; it makes an institution feel inhabited.
- **Mobile.** The photo band keeps its 4:5-ish crop, headline breaks into five lines but stays readable at 32px; the two lockups remain side by side; the Apply button vanishes entirely above the fold and only the hamburger + search remain. Cookie bar covers the bottom third.

### 5. Eddy Lab — https://www.eddy-lab.org/


- **Grid / 1440.** A centred 738px card (x351) floating on a warm off-white field, with two full-body illustrations anchored to the left and right margins outside the card. Header is a simple wordmark-left / nav-right bar with a rust CTA. The card, not the page, is the layout unit.
- **Type.** Poppins for the H1 ("WE'RE RESHAPING HOW WE TEACH AND LEARN SCIENCE") in all caps 51px, plus a hand-script line above it in rust ("Welcome to the Eddy Lab") and 20px body. Three type voices — script, geometric caps, sans body — used once each.
- **Palette.** Warm paper `#FCFEFF`/`#FAF7F5`, ink `#1E1E1E`, rust `#A73111` for script and button, cornflower `#BEE5F3` in the illustration, yellow `#FDD803` for the primary button. Bright and human, the only lab in the set that is not institutional blue/navy.
- **Hero statement.** "Welcome to the Eddy Lab" (script) then a value proposition in caps, then a 2-line research summary, then one yellow button "OUR RESEARCH APPROACH". The who is the script, the what is the caps line, the next step is the single filled button — a clean three-beat structure.
- **News, people, CTA and imagery.** Outside the fold. Nav names Our Research / Lab News / About Us / Publications — same four-item taxonomy a small lab needs; one CTA in the header ("JOIN THE LAB") and one in the hero. Custom vector illustrations of two people (one at a laptop, one standing) frame the text card; no photography. This is the only site in the set that solves "no portrait yet" with commissioned-feeling illustration instead of a stock photo.
- **Mobile.** Illustrations crop at both edges and the standing figure overlaps the yellow button; the card keeps its border and 24px padding, H1 drops to 34px and wraps to five lines. Header is wordmark + hamburger only. Crowded but legible.

### 6. Harvard Center for Health Decision Science (CHDS) — https://chds.hsph.harvard.edu/


- **Grid / 1440.** Three-tier chrome: 12px-wide Harvard Chan crimson utility bar (Quicklinks), then a 218px teal masthead with the CHDS lockup left and search right, then a white nav row with six items and a thin active underline. Below, content sits in a 920px page column (x80-920) with a right rail at x650-920 for "Recent News".
- **Type.** Proxima Nova for UI and body 18px, Lato as fallback; H1 does not exist — the carousel caption is the largest text (~16-18px bold). Section labels are uppercase 11-12px in blue-grey; news headlines 18px blue `#328CC1`. Almost no display scale: this is a portal, not a poster.
- **Palette.** Crimson `#A51C30` Harvard bar, deep teal-grey `#1D313F` masthead, light grey `#EEEEEE` field, blue `#328CC1` links and news headings, yellow accent bar under the active carousel item. Many institutional colours, low contrast between them; the fold has four horizontal colour bands.
- **Hero statement.** A photo carousel of faculty pairs with a translucent caption strip: "Center for Health Decision Science faculty and scholars create a vibrant research and teaching community." It states the community, not the work; the only next step is the carousel next arrow.
- **News, people, CTA and imagery.** The strongest pattern here: a "RECENT NEWS" sidebar card beside a grid of people portraits, each item showing a thumbnail, blue headline, date, and two lines of summary. People and news share the same visual language (photo + name/headline), which makes the lab feel populated. CTA count is 5 but none is visually primary. Documentary portraits of real faculty in offices, cropped 4:5; three portraits across the content width plus the carousel. No abstract or stock imagery; faces carry the page.
- **Mobile.** Crimson bar shrinks to "Quicklinks", masthead keeps the CHDS lockup, then a 352px-tall stacked nav; the carousel becomes a single portrait crop with the caption strip retained; the people grid stacks to one column with a yellow accent bar above each name.

### 7. Biohub — https://biohub.org/


- **Grid / 1440.** A single centred measure: 820px text column starting at x310 on a 1440 canvas, so the page reads like a long-form statement, not a dashboard. Nav is a single line at the very top with a purple pill CTA at its right end.
- **Type.** Helvetica Neue Light; H1 41.5px/400 at line-height 1.0, H2 30.5px/400, body 15.7px in `#DEE8EB`. No display face, no serif — authority comes from scale and space rather than typeface contrast.
- **Palette.** Near-black `#101010` field, white and pale blue-grey ink, one violet `#6E4FF9` used in exactly two places above the fold: the "Biohub Platform" pill and a thin bracket pair around the pull quote. That is the accent-dosage model to copy: dark field, almost no hue, one saturated element that marks the one action.
- **Hero statement.** A single declarative mission sentence, centred, in sentence case ("Our mission is to cure or prevent all disease"), followed by a 3-line explainer and a bordered pull-quote. The next step is a plain "Learn more →" text link, not a button — the page argues before it asks.
- **News, people, CTA and imagery.** None in the fold; the fold is mission + one proof-of-work block ("Introducing a world model of protein biology") with a wide media panel below. Navigation names News, Team, Join Us, so those exist deeper, but the homepage leads with capability, not org chart. Full-width dark media panel (protein render) at the bottom of the first screen; metrics report zero `<img>` elements, so the visual is background media rather than an `<img>` — imagery as ambience, not portrait photography.
- **Mobile.** Identical order, one 24px column: wordmark + hamburger on a black bar, H1 25px, quote bracket retained, media panel below. The purple pill disappears from the mobile bar — a loss of the one CTA.

### 8. Bennett School of Public Policy (University of Cambridge) — https://www.bennettinstitute.cam.ac.uk/


- **Grid / 1440.** Classic university chrome: a 30px black Cambridge utility bar spanning full width, then a 96px white masthead with the school lockup left and nav + search right; hero band starts at y179 and runs 550px. Content sections below sit in a 1080-1164px column (x138-192), not edge-to-edge.
- **Type.** PT Sans throughout — a humanist sans, no serif. H1 lockup at 36px/600 with mint "Bennett School of Public Policy"; campaign line "The *right kind* of growth *fairly shared*" at 36px/600 with italic emphasis. Body 18px/1.3 grey `#4F4F4F`. Lower section headings 32.4px.
- **Palette.** White masthead, near-black `#130526` and `#28292A` body bands, bright purple `#4B23C3` as the primary action colour, mint `#06DEA7` for accent text and outline buttons. High-contrast but crowded: mint on photo, purple buttons, mint outlines, cookie modal blue — four action colours on one screen.
- **Hero statement.** "Welcome to" + institution name + a campaign strapline, over a full-bleed photograph of a person behind a glass partition. Three equal outline buttons (Study with us / Explore research / Latest news) — no single primary; all three carry the same weight and size.
- **News, people, CTA and imagery.** Below the fold the pattern is "Welcome" text block, then "Featured highlights" on grey, "Explore our programmes" full-bleed, "Upcoming events" — every section is a heading plus card grid, each in its own coloured band. Imagery is documentary photography of people, not portraits of leadership in the fold. Full-bleed photo hero is the entire identity of the fold; the crop pushes the subject to the right so centered text lands on the blurred wall.
- **Mobile.** The hero image stays, text centred, the three buttons stack as full-width mint outlines; the cookie dialog covers the lower two-thirds of the first screen. Header keeps the Cambridge lockup and gains a boxed hamburger.

### 9. Galárraga Health Economics Research Lab — https://sites.brown.edu/galarragaresearchlab/


- **Grid / 1440.** A 720px WordPress content column starting at x170 inside a white field, with a low-contrast grey band behind the title block. The banner image is 766px wide and sits between title and nav; nav is a red tab strip that overlaps the photo's bottom edge. Standard Brown Sites template, not a bespoke layout.
- **Type.** Roboto Slab for the two-line site title at 30px/400 in `#444`, Roboto 16px body in `#666`. Heading and "Home" label are the same 30px slab, so the page has almost no type hierarchy; the title and the section label compete.
- **Palette.** White and `#F8F8F8`, grey ink, and Brown red `#C00404` used for the active nav tab and link underline only — about 3k px² of accent on the whole page. Clean restraint, but no voice.
- **Hero statement.** Institution name + parent school as a subtitle, then a Providence skyline photo, then "Home". There is no proposition and no action above the fold; the first sentence only appears after a 180px empty gap.
- **News, people, CTA and imagery.** A single paragraph of lab description with one red-outline button "Learn more about our research projects here."; publications are buried in a nav dropdown by year (2007-2012, 2013, 2014, 2015...). This is the anti-pattern our current site shares: links as the only hierarchy. One generic city-skyline banner, not lab, people, or research. It says "Providence", not "health economics".
- **Mobile.** Title 30px in three lines, banner 350x100, a red hamburger labelled "Menu", then a large empty gap before "Home" and the paragraph. The header CTA is gone. The layout survives but the first screen communicates nothing.

## 3. Top three, and what we would take

### 3.1 Arc Institute — https://arcinstitute.org/

The strongest structural model. It solves the exact failure our hero has: two elements on one 12-col grid, each starting on a real column line, with a scientific visual doing the work that a stock photo cannot.

- **Two-column hero, one shared baseline** — copy in cols 1-5 (x48, 660px), a particle-rendered protein in cols 7-12, both beginning at the same top edge. Take this instead of three story scenes with three left edges. → defect 1 → `index.html`.
- **Serif display in a single accent hue** — H1 40px/300 Tiempos, 2 lines at 1440, 32px on mobile, body sans 16/24. One face carries authority; the accent colour carries emphasis, not a second typeface. → defect 1, defect 2 → `index.html`.
- **Research index instead of a news log** — `08.2026 • Cell` meta, an outline category tag, then a 24px headline across the remaining width, hairline between rows, no underlined link text. → defect 4 → `index.html`, `publications.html`.
- **One section-level action, not a card grid** — "See all research →" sits at the far right of the section head; the three "Explore" boxes disappear and become a typographic list with the same single link. → defect 5 → `index.html`, `research.html`.
- **Light field with a single dark band** — `#F7F9FB` field, ink `#11181C`, one `#0073E6` accent, cream `#FBF8F2` used once at the footer. → defect 2 → all six pages.
- **Mobile discipline** — 24px gutters, H1 32px, the scientific figure crops at the right edge rather than shrinking to a thumbnail. → defect 1, defect 6 → all six pages.

### 3.2 Emery Lab — https://emery-lab.org/

The warmth model. It proves a lab site can look editorial and human without stock photography or a navy institutional frame; the display serif at 60px is the closest thing in the set to a university-press page.

- **Cream paper + forest ink + one olive accent** — `#FEFAF1` field, `#192D2B` ink, `#BEBE31` only on the header CTA and one band. No blue anywhere. → defect 2 (one navy tone everywhere) → all six pages.
- **60px display serif over a field-site photograph** — H1 left-aligned on 45% width, 2 lines, cream on image; body below the fold is 20px/1.65. → defect 1 (4-line H1), defect 6 (no imagery) → `index.html`, `profile.html`.
- **One header CTA** — an olive "JOIN THE LAB" pill is the only filled control on the page; the hero offers no button at all, so the mission sentence is read before anything is asked. → defect 5 (three equal cards / competing actions) → all six pages.
- **A butter band as a section break** — `#FAE59F` full-bleed behind the next section, used exactly once. It separates bands without borders or cards. → defect 2, defect 5 → `index.html`, `education.html`.
- **Plain-language purpose under the headline** — "The Emery Lab studies … Their goal is to …" in 3-4 lines. A concrete replacement for a one-sentence section. → defect 3 (Graduate study wastes a section) → `index.html`, `education.html`.
- **Image as evidence, not decoration** — the hero photograph is the lab's field site; the hand-drawn mark picks up the accent. → defect 6 → `index.html`, `research.html`.

### 3.3 IHME — https://www.healthdata.org/

The subject match. Health metrics is the nearest neighbour to health economics, and its homepage shows how to present a mission, a primary action and research stories on one screen without a card wall.

- **Mission headline + who/what + one solid CTA, tied by a thin left rule** — 50px/300 H1, 2-line explainer, a single green "SUPPORT OUR MISSION" button in a 1px white rule column. → defect 1 → `index.html`.
- **"Featured stories" as a carousel of real evidence** — category overline (COMMENTARY / VIDEO), 22px headline, 1/5 counter with square arrows; stories carry charts, video stills and covers, not stock photos. → defect 4, defect 6 → `index.html`, `publications.html`.
- **Tinted section fields instead of boxes** — `#F2FBF5`/`#EFFBFB` bands separate sections; no borders, no card shadows. → defect 2, defect 5 → all six pages.
- **Overline meta at 11-12px** — uppercase category labels do the work our grey dates currently fail to do, without shrinking the headline. → defect 4 → `index.html`, `publications.html`.
- **Mobile keeps the left rule and the full-width primary button** — the hero anatomy survives at 390px rather than collapsing into centred text. → defect 1, defect 2 → all six pages.
- **Research library as a first-class destination** — IHME's utility bar carries Research library and Data catalog as plain text links, not buried in a dropdown; the sources page can use the same top-level treatment for its citation ledger, grouped in a typed table (year / journal / DOI / what it supports) instead of h3-plus-link lists. → defect 4 → `sources.html`.

## 4. Recommended direction

One direction, no options: **a warm editorial research page — cream paper, deep green ink, a serif display face, and a photographic or figure-led right column.** It takes Arc's grid discipline and journal-index rows, Emery's warmth and display scale, and IHME's mission-plus-one-action hero. It refuses the navy-everything frame, the three-chapter hero, and the three-card Explore row.

**Layout:** `12-col / 1240px / 24px gutters / 48px page inset at >=1280; hero copy cols 1-6, media cols 7-12; every section starts on a column line.`

### 4.1 Grid and container

- `--shell: 1240px` max width, centred; `--gutter: clamp(20px, 4vw, 48px)`. At 1440 the content box is 1144px wide (x148-x1292) — the right side stops being empty because media occupies cols 7-12, not because the text stretches.
- 12 columns, `column-gap: 24px`; no nested containers. Text measures: hero 6 cols, section lede 7 cols, body prose `--measure: 68ch`, publication metadata 3 cols.
- Section rhythm: `--section-space: clamp(64px, 7vw, 96px)` (down from the current 88-168px), heading top margin 1.5x its bottom margin. One dark band (`--night`) per page maximum, never above the fold.
- Breakpoints: 1240 (12 cols), 900 (8 cols), 620 (4 cols, 20px gutter). At 390 every section is one column, media after copy.

### 4.2 Type scale

| Role | Desktop | Mobile (390) | Line-height | Use |
|---|---|---|---|---|
| Display | 64px | 36px | 1.06 | Homepage H1 only, max 2 lines at 1440 / 3 at 390 |
| Headline | 40px | 30px | 1.15 | Section H2, PI name, page H1 on inner pages |
| Title | 24px | 20px | 1.3 | News lead, publication title, card-free list headings |
| Body | 17px | 17px | 1.65 | Paragraphs, 65-75 characters |
| Caption | 13px | 13px | 1.4 | Dates, journal meta, figure credits, uppercase overlines at 0.08em tracking |

- Display/headline/title in **Source Serif 4** (self-hosted latin woff2, 400 + 600, `font-display: swap`; fallback `"Iowan Old Style", Palatino, Georgia, serif`). If the build must stay zero-download, keep the existing `--serif` stack and accept Georgia's narrower personality.
- Body/caption in the existing system sans stack (`Segoe UI`, -apple-system, Roboto, Helvetica). One serif plus one sans; no third family, no monospace costume.
- Ratios hold the 1.25 floor: 64 -> 40 (1.6), 40 -> 24 (1.67), 24 -> 17 (1.41), 17 -> 13 (1.31). Weight and colour separate body from caption, not a third size.

### 4.3 Palette

| Token | Light | Dark | Role | Verified contrast |
|---|---|---|---|---|
| `--paper` | `#FBFAF7` | `#101A17` | Page field | ink 16.0:1 / 15.3:1 |
| `--surface` | `#F3F2EC` | `#18231F` | Alternate band, table head | ink 14.9:1 |
| `--ink` | `#15201D` | `#EDEFE9` | Text | — |
| `--muted` | `#57635F` | `#A8B4AD` | Dates, captions | 6.0:1 / 8.3:1 |
| `--line` | `#E3E1D8` | `#2A3632` | 1px hairlines only | non-text |
| `--accent` | `#0E6B57` | `#7FD0B4` | Links, one filled button, overlines | 6.2:1 / 9.8:1 |
| `--accent-soft` | `#DFEDE7` | `#1E332C` | Hover wash, quote bracket | ink 13.9:1 |
| `--night` | `#10201C` | `#0B1411` | Footer, one closing band | on-night 15.0:1 |

- **Accent dosage:** at most **5% of any viewport's area**, and exactly **one filled accent button per screen** (hover `#0B5747`, white label 8.5:1). Everything else accent is text or a 1px rule. No accent field larger than a quote bracket; no coloured stripe on a card.
- Images supply the rest of the colour. The palette is warm-neutral plus one green; it has no blue, no navy, no radial glow.
- Both themes ship; dark is a token swap, not an inversion of photos.

### 4.4 Homepage section order

1. **Header** — 64px, wordmark left, six links right, no CTA in the bar (the hero owns the action). Sticky, 1px `--line` bottom border.
2. **Hero** — 12-col band, 560-620px tall. Copy cols 1-6: overline "Social Pharmacy Laboratory · Sahmyook University" (caption, accent), H1 display max 3 lines ("Health economics that reaches practice and policy." or the lab name — never `@`), one 2-line body sentence, **one primary button "Read the research"** plus a text link "Publications →". Media cols 7-12: PI portrait 4:5, or the paper figure plate if the portrait is not supplied. No second and third story chapter, no glow layer.
3. **What we study** — H2 headline + 7-col lede, then four research areas as a **typographic list** (title 24px, 2-line description, 1px hairline between rows, no borders, no card), with one small evidence figure in cols 9-12 on desktop. One link: "Research topics and methods →".
4. **Selected publications** — 3 rows, journal-contents layout (see 4.5).
5. **News** — 1 lead + 3 compact rows (see 4.5).
6. **The PI** — portrait + bio band (see 4.5), which absorbs the "Graduate study" sentence as a compact admissions strip: "Graduate study — Admissions information for the College of Pharmacy laboratory guide →" at caption/title scale, inside this band, not its own section.
7. **Footer** — one 12-col row: identity cols 1-4, contact + directory cols 5-8, resources/credits + back-to-top cols 9-12; 13px captions, 32px row gap. No cramped single-line link run.

### 4.5 News, publications, PI — exact presentation

**News (index, and the same component on any page).**
- Lead item: 6 cols image (16:9, `--surface` placeholder until a real photo exists), 6 cols text — overline `NEWS · 2026.05` (13px, accent), headline 24px/1.3, one 2-line summary, full-row link with an arrow at the end. No underline on the headline; underline appears on hover only.
- Three secondary rows: 12 cols, `date (3 cols, 13px muted)` + `headline (9 cols, 18px ink)` + arrow; 1px hairline between rows, 20px vertical padding. Dates use `font-variant-numeric: tabular-nums`.
- No grey-on-grey, no underlined body links inside summaries; the whole row is the link. Category tag only when it can change (e.g. `PAPER`, `TALK`, `VISIT`).

**Publications (index preview + `publications.html`).**
- One row per paper, 12 cols: cols 1-3 metadata (year 24px serif, journal name 13px muted, DOI link 13px), cols 4-9 title 24px/1.3 + one-line finding 17px, cols 10-12 a 200px-wide figure plate from the paper (`/images/papers/cmh-2025-0796f1.webp`) with a 13px credit. 1px hairline between rows; 32px row padding.
- `publications.html` uses the same row component grouped under two H2s (Health economics and outcomes research; Interpreting the results) — no cards, no tag clouds, no underlined titles.
- Only real artifacts: the four CMH figure plates already in `public/assets/images/papers/`. No invented journal covers.

**PI (index band and `profile.html`).**
- Index: portrait 4 cols (4:5, `--surface` placeholder labelled "Portrait to be supplied" until the lab provides one), name + role 7 cols, two-sentence bio, then a 3-item definition list (Position / ORCID / Email) in caption + body, and one text link "Full profile →". No card, no badge, no stat tiles.
- `profile.html`: hero becomes the same 12-col split — portrait left 5 cols, name + role + contact right 7 cols, one primary button "Email the lab". The facts list stays but moves to a two-column definition grid under the bio; the current `page-hero__glow` layer is deleted.
- The portrait is required content, not optional decoration; if it is missing at build time the labelled placeholder ships rather than a stock face.

### 4.6 What this direction deletes

The three-scene story stage and its progress bar, the radial glow, the `@` in the H1, the three bordered Explore cards, the "Graduate study" section, the 88-168px section gaps, the navy-on-navy bands, and the single-line footer link run.

## 5. URL ledger

Fetched live in this run (2026-11-09, plain GET, redirects followed, 30s timeout, desktop UA). All returned HTTP 200:

| Site | URL fetched | Final URL | Status | Title seen |
|---|---|---|---|---|
| Arc Institute | https://arcinstitute.org/ | https://arcinstitute.org/ | 200 | Arc Institute |
| Bennett School of Public Policy | https://www.bennettinstitute.cam.ac.uk/ | https://www.bennettschool.cam.ac.uk/ | 200 | Bennett School of Public Policy at the University of Cambridge |
| Biohub | https://biohub.org/ | https://biohub.org/ | 200 | Biohub - Leading the new era of AI-powered biology |
| Blavatnik School of Government | https://www.bsg.ox.ac.uk/ | https://www.bsg.ox.ac.uk/ | 200 | Homepage \| Blavatnik School of Government |
| Eddy Lab | https://www.eddy-lab.org/ | https://www.eddy-lab.org/ | 200 | Eddy Lab \| Amplifying Student Voices in STEM |
| Emery Lab | https://emery-lab.org/ | https://emery-lab.org/ | 200 | Emery Lab - Evolution \| Ecology \| Conservation |
| Galárraga Health Economics Research Lab | https://sites.brown.edu/galarragaresearchlab/ | https://sites.brown.edu/galarragaresearchlab/ | 200 | Galárraga Health Economics Research Lab – Brown University School of Public Health |
| Harvard CHDS | https://chds.hsph.harvard.edu/ | https://chds.hsph.harvard.edu/ | 200 | Center for Health Decision Science |
| IHME | https://www.healthdata.org/ | https://www.healthdata.org/ | 200 | Homepage \| Institute for Health Metrics and Evaluation |

Note: the Bennett URL now 301s to `bennettschool.cam.ac.uk` (the school was renamed); the fold capture was taken before the rename and shows the Bennett Institute lockup. Cite the live `bennettschool.cam.ac.uk` address in any new work.

Referenced but not fetched in this run:

- `https://www.bennettschool.cam.ac.uk/` — the redirect target of the Bennett fetch above; resolved by the fetch, not opened separately.

Local evidence (not URLs): `.audit/references/<slug>-{desktop,mobile}-fold.png` for the nine slugs, and `.audit/shots/review/index-full.png` as the current-site baseline. Capture metadata is in `.audit/references/_tools/capture-metrics.json` and `capture-metrics-2.json`; the extraction used for these notes is `_tools/digest-9.json`, and the live-check result is `_tools/live-checks.json`.
