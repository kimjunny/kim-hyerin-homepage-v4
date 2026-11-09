# UX Reference Pack - Academic Laboratory Website Audit

Target: a 6-page English academic laboratory site (static HTML/CSS, one scroll-driven hero). Sources: the local `ui-ux-db` (all 11 CSV headers plus targeted rows) and the Apple, Stripe, Linear, Notion, and Figma brand references read in full. Quoted text is verbatim from the named CSV or brand file; items marked **[synthesis]** are my inference from those rows, not a direct CSV claim.

## 1. What the ui-ux-db says about institutional, academic, and editorial sites

### 1.1 The closest archetype rows

- **Institutional trust: `Government/Public Service`** (`ui-reasoning.csv` #13). Recommended pattern: `"Minimal & Direct"`; style: `"Accessible & Ethical + Minimalism"`; typography: `"Clear + Large typography"`; effects: `"Clear focus rings (3-4px) + Skip links"`. Required: `"wcag-aaa"`, `"keyboard-navigation"`. Anti-patterns: `"Ornate design + Low contrast + Motion effects + AI purple/pink gradients"`. The product row adds: `"WCAG AAA mandatory. Trust paramount."` (`products.csv` #13).
- **Academic typography: `Academic/Research`** (`typography.csv` #41). Pairing: `Crimson Pro` headings with `Atkinson Hyperlegible` body; note: `"Crimson for scholarly headlines. Atkinson for accessibility."` Best for: `"Universities, research papers, academic journals, educational"`. The more traditional `Academic/Archival` row (#54) uses `EB Garamond` + `Crimson Text` and notes: `"Classic academic aesthetic. Very legible."`
- **Scholarly personal identity: `Portfolio/Personal`** (`ui-reasoning.csv` #11). Pattern: `"Storytelling-Driven"`; styles: `"Motion-Driven + Minimalism"`. Anti-patterns: `"Corporate templates + Generic layouts"`. Landing sequence (`landing.csv` #26): `"1. Hero (Name/Role), 2. Project Grid (Masonry), 3. About/Philosophy, 4. Contact"`; guidance: `"Visuals first. Filter by category. Fast loading essential."`
- **Editorial content: `Magazine/Blog`** (`products.csv` #67). Features: `"Article showcase. Category navigation. Author profiles. Newsletter signup. Related content. Typography-focused."` The style row `Editorial Grid / Magazine` (`styles.csv` #66) recommends `"asymmetric grid, pull quotes, drop caps, multi-column text, large imagery, bylines, section dividers, print-inspired typography"` and warns it is not for `"Dashboards, apps, e-commerce catalogs, real-time data, short-form content"`.
- **Reference material: `Knowledge Base/Documentation`** (`products.csv` #30). Key considerations: `"Search-first. Clear navigation. Code highlighting. Version switching. Feedback system."` The ordering row says: `"FAQ + Minimal"` with `"Search highlight + Smooth scrolling"` (`ui-reasoning.csv` #30).
- **Research credibility: `Biotech / Life Sciences`** (`products.csv` #82). Key considerations: `"Data accuracy. Cleanliness. Complex data viz."` Required: `"data-accuracy"`, `"clean-aesthetic"`; anti-pattern: `"Cluttered data + Poor credibility"` (`ui-reasoning.csv` #82).

### 1.2 Numbers the database actually gives

| Metric | Stated value | Source |
|---|---|---|
| Body text minimum | `"Base 16px"`; `"Minimum 16px body text on mobile"` | `README.md`; `ux-guidelines.csv` #67 |
| Body line height | `"Use 1.5-1.75 for body text"` | `ux-guidelines.csv` #72 |
| Reading width | `"Limit to 65-75 characters per line"`; desktop `"60-75 chars"`, mobile `"35-60 chars"` | `ux-guidelines.csv` #73; `README.md` |
| Type scale | `"Type scale (12 14 16 18 24 32)"` | `ux-guidelines.csv` #74 |
| Spacing rhythm | `"Use 4pt/8dp incremental spacing system"`; `"gap: 1rem (8px base unit)"` | `README.md`; `styles.csv` #50 |
| Grid and container | `"Grid-based layout 12-16 columns"`, `"max-width: 1200px"` | `styles.csv` #1 |
| Text contrast | `"Minimum 4.5:1 ratio for normal text"`; `"large text 3:1"`; AAA `"7:1+"` | `ux-guidelines.csv` #36; `README.md`; `styles.csv` #8 |
| Focus ring | `"Visible focus rings (2-4px)"`; `"Clear focus rings (3-4px)"` | `README.md`; `styles.csv` #8 |
| Touch target | `"Min size 44x44px"`; `"Minimum 8px gap between touch targets"` | `README.md`; `ux-guidelines.csv` #22-23 |
| Micro-motion | `"Use 150-300ms for micro-interactions"` | `ux-guidelines.csv` #8 |
| Hero share of viewport | `"Hero is 60-80% above fold"`; `"CTA 7:1 contrast"` | `landing.csv` #32 |
| Section rhythm | `"64-120px between major sections"` (brand-derived, not CSV) | `notion.md` section 5 |

The `12 14 16 18 24 32` row is an example scale, not a requirement; it is a useful six-step skeleton, with 40/48/56px added for page and hero headings.

### 1.3 Recommended patterns, anti-patterns, and evidence by audit area

**Navigation.** `"Fixed nav should not obscure content"`; the prescribed fix is `"Add padding-top to body equal to nav height"` (`ux-guidelines.csv` #2). `"Current page/section should be visually indicated"` (#3). Use breadcrumbs only for `"3+ levels of depth"` (#6), but use an on-page anchor nav for long research/publication pages. Navigation placement must stay constant across pages; `README.md` states: `"Navigation placement must stay the same across all pages; don't change by page type"` and `"Avoid mixed patterns"`. Keep `"Core navigation ... reachable from deep pages"` (`persistent-nav`).

**Hero.** The clearest numeric rule is `"One primary CTA. Hero is 60-80% above fold. Mobile: same hierarchy."` (`landing.csv` #32). The minimal variant says: `"Single CTA focus. Large typography. Lots of whitespace. No nav clutter. Mobile-first."` (`landing.csv` #4). For scroll-driven storytelling, the row prescribes `"1. Intro hook, 2. Chapter 1 (problem), 3. Chapter 2 (journey), 4. Chapter 3 (solution), 5. Climax CTA"` and warns: `"Narrative increases time-on-page 3x. Use progress indicator. Mobile: simplify animations."` (`landing.csv` #10). Against motion excess: `"Animate 1-2 key elements per view maximum"` (#7) and `"Parallax/Scroll-jacking causes nausea"` / `"Respect prefers-reduced-motion"` (#99).

**Typography and reading.** `"Use darker text on light backgrounds"` (#76); `"Headings should stand out from body"` via `"Bold + larger size"` (#77). Use `"font-display: swap"` and a similar fallback to avoid layout shift (#50, #75). `"Prefer wrapping over truncation"` (`README.md`, `truncation-strategy`).

**Cards and grids.** Feature-rich pages use `"Feature grid/cards (4-6)"` with `"Clear feature hierarchy. One key message per card."` (`landing.csv` #31). Card hover is a `"Card hover lift (200ms)"` (`ui-reasoning.csv` #3), within the 150-300ms rule. Do not use identical card weight for primary and secondary content: `"Establish hierarchy via size, spacing, contrast - not color alone"` (`README.md`, `visual-hierarchy`).

**Publication lists.** There is **no publication-list row** in the database; this is the main coverage gap. The nearest evidence is editorial/content guidance: `"Article showcase. Category navigation. Author profiles. Related content. Typography-focused."` (`products.csv` #67); `"Filter by category"` (`landing.csv` #26); `"Use relative or locale-aware dates"` (#85); `"Handle long content gracefully"` with ellipsis plus expansion (#84). **[synthesis]** A publication page should therefore combine editorial hierarchy, category/year filtering, author metadata, and locale-safe dates rather than inventing a separate card system.

**Credibility signals.** The legal-services row requires `"credential-display"` and lists `"Hidden credentials"` as an anti-pattern (`ui-reasoning.csv` #40). The trust landing pattern orders `"1. Hero (mission/credibility), 2. Proof (logos, certs, stats), 3. Solution overview, 4. Clear CTA path"` (`landing.csv` #33). The nonprofit row requires `"impact-stories"` and `"donation-transparency"`, with anti-patterns `"No impact data + Hidden financials"` (#44). **[synthesis]** For a lab: rank, affiliation, ORCID, faculty directory, DOI/PMID records, and visible "as of" dates are the equivalent credibility inventory.

**Accessibility.** The hard floor is: 4.5:1 text, 3:1 large text, visible 2-4px focus, skip link, sequential headings, alt text, keyboard order, semantic landmarks, reduced motion, and 44x44px touch targets. Relevant rows: #28, #36-39, #41-45, #99 and the `Accessible & Ethical` style row #8, which specifies `"WCAG AA/AAA (4.5:1 min)"`, `"focus rings (3-4px)"`, `"skip links"`, `"reduced motion"`, and `"44x44px touch targets"`.

**Coverage note.** `web-interface.csv` is almost entirely iOS/Android/React Native guidance; `react-performance.csv` is React-specific; `charts.csv` and `icons.csv` are peripheral for this site. The applicable web evidence is concentrated in `ux-guidelines.csv`, `styles.csv`, `typography.csv`, `landing.csv`, `ui-reasoning.csv`, and `products.csv`.

## 2. Transferable techniques from the brand references

**Apple.** The transferable structure is a neutral three-tone foundation (`#000000`, `#f5f5f7`, `#ffffff`) with color reserved for action, plus a two-gear density model: cinematic showcase sections and tighter transactional sections. Type hierarchy: 80px/600/1.00-1.05 hero, 48px/500-600/1.08 section, 17px/400/1.47 body, 12px micro UI. Use the 8px base and 14-20px utility intervals, and radius tiers rather than one global radius. Transfer: alternate surface tones instead of drawing section borders; let content imagery carry drama while chrome stays quiet. Do not copy the black/blue Apple palette, SF Pro, or capsule CTAs.

**Stripe.** The signature move is authority through lightness: 56px/300/1.03/-1.4px display, 32px/300/1.10/-0.64px section, 16px/300-400/1.40 body. Tracking tightens progressively with size. Layout: about 1080px max content width, 8px base, `"Dense data, generous chrome"` - tightly packed tables inside generously spaced sections. Transfer: a light display weight and progressive negative tracking can make academic headings feel precise without shouting; use a 1080-1120px container for text-heavy pages and reserve dense typography for publication metadata. Do not copy the purple accent, blue-tinted shadows, or `ss01`.

**Linear.** Type: 72px/510/1.00/-1.584px, 48px/510/1.00/-1.056px, 32px/400/1.13/-0.704px, 16px/400/1.50 body, 15px/400/1.60 secondary. Layout: about 1200px max width, 8px base, 80px+ section spacing, hairline borders at 5-8% opacity, and elevation via luminance steps rather than shadow stacks. Transfer: use a 500-550 intermediate weight for labels and nav, a 1200px container, and 80px section cadence; achieve hierarchy with spacing and weight, not extra colors. Do not copy the near-black canvas or indigo accent.

**Notion.** Type: 64px/700/1.00/-2.125px hero, 48px/700/1.00/-1.5px section, 22px/700/1.27 card title, 16px/400/1.50 body, 14px/500/1.43 caption. Layout: 1200px max width, 64-120px between major sections, `1px solid rgba(0,0,0,0.1)` "whisper" borders, 12px standard cards, warm white `#f6f5f4` alternation, secondary text at about 5.5:1. Transfer: a warm paper canvas, one-pixel borders, 64-120px section rhythm, and 12px cards are the closest off-the-shelf language for a scholarly site. Do not copy NotionInter or Notion Blue.

**Figma.** Type: 86px/400/1.00/-1.72px hero, 64px/400/1.10/-0.96px section, 26px/540/1.35/-0.26px subhead, 20px/330-450/1.30-1.40 body, 16px/330-400/1.40-1.45 UI. Mono labels run 18px/400/1.30/+0.54px uppercase and 12px/400/1.00/+0.6px. Layout: 8px base, up to 1920px, pill tabs, gallery pacing. Transfer: keep site chrome strictly neutral and let publication figures and research imagery carry color; use uppercase mono labels for dates, DOI/PMID, and section eyebrows; use granular weight differences instead of bold/regular jumps. Do not copy the 86px scale, 50px pills everywhere, or dashed focus rings.

**Cross-source conflict.** Apple (1.47), Stripe (1.40), and Figma (1.40-1.45) use body leading below the database's `1.5-1.75` recommendation. For long-form academic reading, follow the database: 1.55-1.7 for body copy, 1.1-1.25 for display headings. The brand files are useful for proportions, not for overriding accessibility guidance.

**Synthesis for this site.** One warm neutral canvas, one muted institutional accent, serif headings plus humanist sans body, 17-18px body at 1.6, 65-75ch measure, 1120-1200px container, 8px spacing scale, 64-96px section spacing, 1px borders, 8-12px card radii, and one accent used only for links and the primary action.

## 3. Reference ideal for each page type

### Home
**Above the fold, in order:** lab name and university affiliation; one-sentence research mission (15-25 words); one primary action ("Research") and one secondary ("Publications"); three proof items (professor rank, ORCID/faculty page, two or three research areas); a quiet scroll cue. **Then:** latest news, 3-5 dated rows; four research-area cards or rows; three selected publications; teaching/contact strip. **Density:** low. One idea per viewport, hero at 60-80vh, no more than six sections, 64-96px between sections. **Avoid:** a full-screen animation with no readable proposition, autoplay video, more than seven nav items, a carousel of unrelated announcements.

### Person profile
**Above the fold, in order:** name; title and affiliation; two-line bio; portrait (optional, 280-360px wide); ORCID, faculty directory, CV, and email links. **Then:** facts table (position, specialization, laboratory, appointment, ORCID); research interests, 3-5 bullets; three selected publications; teaching and contact. **Density:** medium. Bio 60-90 words at 65-75ch; five to seven fact rows; facts in two columns on desktop, one on mobile. **Avoid:** a portrait that pushes the bio below the fold, third-person and first-person voice mixed, credential links hidden in a footer, a full CV reproduced inline.

### Research overview
**Above the fold, in order:** H1 "Research"; a two-sentence scope statement; on-page nav with three to five anchors; the first research-area row visible at the fold edge. **Then:** three to four research areas, each with a 40-70 word explanation; methods, as a compact tag or definition list; current projects or collaborations; link to publications. **Density:** medium-high and scannable. Use a left key column ("Area 01") and a wider explanation column; 40-70 words per row; 48-64px between rows. **Avoid:** unexplained acronyms, method names without a one-line gloss, one giant paragraph, decorative cards that repeat the same claim.

### Publication list
**Above the fold, in order:** H1; one-sentence scope; visible "Selected publications" and "As of" date; year/filter nav; the first two entries fully visible. **Then:** newest-first list; each entry = year and journal key, full title, authors, citation, DOI/PMID/publisher links, and a 1-2 sentence plain-language takeaway. Optional figure with caption, credit, and license. **Density:** high but rhythmic. 10-20 entries per page; 80-140 words per entry; title 20-24px, metadata 12-14px; 32-48px between entries; three to five links per entry, grouped in one row. **Avoid:** link-only entries, truncated author lists without an ellipsis rule, undated lists, giant image cards that reduce the list to one item per screen, missing license or credit for figures.

### Teaching
**Above the fold, in order:** H1 "Education" or "Teaching"; a two-sentence statement of teaching scope and philosophy; program and role facts; current courses or supervision areas. **Then:** course table (term, course, level, role); graduate supervision and recruitment note; practice placements; downloadable syllabi or reading lists. **Density:** medium. Four to eight course rows; a 60-100 word philosophy statement; table columns must remain readable on mobile (stack or scroll). **Avoid:** stale course lists, student evaluations without context, recruitment claims without a link to the official procedure, a wall of PDFs with no description.

### Resources / credits
**Above the fold, in order:** H1 "Resources"; one sentence on what is sourced and why; visible "As of" date; three to five category anchors. **Then:** grouped lists - institutional sources, publication records, figure/photo credits and licenses, site technical credits, correction contact. **Density:** high but tidy. 15-30 links maximum; one line per resource plus one clause on what it supports; license and credit on the same line as the asset. **Avoid:** a bare link dump, unlabeled "here" links, missing image licenses, no last-updated date, no way to report a correction.

## 4. Checkable recommendations

1. Each page has exactly one `<h1>`; heading levels never skip. **Pass:** one H1 and sequential H2/H3. **Source:** `ux-guidelines.csv` #39.
2. Body text is at least 16px, preferably 17-18px, with line-height 1.55-1.75. **Source:** #67, #72; `README.md`.
3. Prose measure is 65-75 characters on desktop and 35-60 on mobile. **Source:** #73; `README.md`.
4. Use a six-step scale (12/14/16/18/24/32) with 40-56px display steps; no arbitrary sizes. **Source:** #74.
5. Normal text contrast is at least 4.5:1; large text at least 3:1; key institutional text targets 7:1. **Source:** #36; `styles.csv` #8.
6. No meaning is conveyed by color alone; add text or an icon. **Source:** #37.
7. Every interactive element has a visible 2-4px focus ring with 3:1 contrast against its surroundings. **Source:** #28; `README.md`.
8. A "Skip to main content" link is the first focusable element. **Source:** #45.
9. Tab order matches visual order; no keyboard traps; all controls are reachable. **Source:** #41.
10. Pages use `<nav>`, `<main>`, `<article>`, and `<time>`; meaningful images have descriptive alt text and decorative images use `alt=""`. **Source:** #38, #42.
11. The scroll hero and all reveals respect `prefers-reduced-motion: reduce` and show a static first frame. **Source:** #9, #99; `README.md` `parallax-subtle`.
12. Animate at most one or two elements per view; micro-interactions run 150-300ms; no UI transition exceeds 500ms. **Source:** #7, #8.
13. The hero occupies 60-80% of the first viewport with minimal text and one clear proposition. **Source:** `landing.csv` #32.
14. One primary action is visible above the fold; its text/background contrast is at least 7:1. **Source:** `landing.csv` #4, #32.
15. Hero order is identity -> promise -> action; the lab name and affiliation appear before the animation begins. **Source:** `landing.csv` #32; **[synthesis]**.
16. A sticky header does not cover content; body or section top padding equals the header height. **Source:** `ux-guidelines.csv` #2.
17. The current page is visually marked in navigation on all six pages. **Source:** #3.
18. Navigation order and placement are identical on all six pages; no page swaps to a different nav pattern. **Source:** `README.md` `navigation-consistency`.
19. Top-level navigation has five to seven items; secondary or utility links do not crowd the primary row. **Source:** `README.md` `bottom-nav-limit`; **[synthesis]** for web.
20. Long research and publication pages have an on-page anchor nav; breadcrumbs appear only where hierarchy is three or more levels deep. **Source:** #6; `landing.csv` #33.
21. Spacing uses a 4/8px scale; major sections are 64-96px apart on desktop and about 48px on mobile. **Source:** `README.md`; `styles.csv` #50; `notion.md` section 5.
22. The content container is 1120-1200px; prose blocks are 680-760px and never full viewport width. **Source:** `styles.csv` #1; `ux-guidelines.csv` #21.
23. Use a 12-column grid with consistent gutters rather than ad hoc widths. **Source:** `styles.csv` #50.
24. Card grids are two to three columns on desktop and one on mobile; each card carries one message. **Source:** `landing.csv` #31; `README.md` responsive rows.
25. Cards use either a 1px hairline border or one soft shadow, not both heavy; elevation is consistent across the page. **Source:** `notion.md` sections 4-6; `stripe.md` section 6; **[synthesis]**.
26. Publication lists run newest first, show year as a left key, and give a full citation plus DOI and PMID links. **Source:** `products.csv` #67; `ux-guidelines.csv` #85; **[synthesis]**.
27. Each publication entry scans in 80-140 words: 20-24px title, 12-14px metadata, three to five grouped links. **Source:** `typography.csv` scale rows; `landing.csv` #26; **[synthesis]**.
28. Publication pages state "Selected" and a visible "As of" date, and provide year or category anchors when there are more than eight entries. **Source:** `products.csv` #67; `landing.csv` #26; #85.
29. A credibility strip shows rank, affiliation, ORCID or faculty-directory link, and last-updated date without requiring a footer search. **Source:** `ui-reasoning.csv` #40; `landing.csv` #33; **[synthesis]**.
30. Every external link names its destination in the link text ("PubMed PMID ...", "DOI ...", "Publisher full text"), and new-window links disclose that behavior. **Source:** `ux-guidelines.csv` #40; `README.md` `aria-labels`; **[synthesis]**.
31. Dates use `<time datetime="...">` with one consistent visible format; relative dates are not mixed with numeric dates. **Source:** `ux-guidelines.csv` #85.
32. The resources page groups links into three to five labeled categories and states what each source supports, plus license or credit for every figure. **Source:** `products.csv` #30; `styles.csv` #66; **[synthesis]**.
33. Headings use a scholarly serif and body uses a highly legible sans: Crimson Pro + Atkinson Hyperlegible, or EB Garamond + Crimson Text. **Source:** `typography.csv` #41, #54.
34. The palette is three neutral tones plus one accent; avoid `"Ornate design + Low contrast + Motion effects + AI purple/pink gradients"`. **Source:** `ui-reasoning.csv` #13; `styles.csv` #50.
35. Images declare width/height or aspect-ratio, use `srcset`/`sizes`, load the hero eagerly with high priority, and lazy-load below-fold media. **Source:** `ux-guidelines.csv` #19, #46, #47; `README.md` performance rows.
36. Web fonts use `font-display: swap`, preload only critical faces, and fall back to a metric-compatible family. **Source:** `ux-guidelines.csv` #50, #75.
37. Filtered or empty lists show a helpful "No results" message with suggested next steps, never a blank region. **Source:** `ux-guidelines.csv` #90.

Counts: 4 sections populated; 37 checkable recommendations; 6 page-type ideals; 11/11 CSV headers inspected with targeted row sampling; 5 brand files plus `_INDEX.md` read in full; 1 output path target (`C:/Users/yejun/Desktop/github/kim-hyerin-homepage-v4/.audit/ux-reference-pack.md`) not written due to read-only constraint.