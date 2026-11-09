# Violation Inventory — kim-hyerin-homepage-v4

Audited: 2026-11-09 · source `C:/Users/yejun/Desktop/github/kim-hyerin-homepage-v4` · preview `http://127.0.0.1:4319`
Viewports: 1440x900 (DPR 1) and 390x844 (DPR 3, `mobile: true` via CDP `Emulation.setDeviceMetricsOverride`)
Pages: index, profile, research, publications, education, sources (6)

Rule sources:
- `HIG-n` = `.audit/hig-universal-web.md` rule number (75 rules, Apple-specific material excluded)
- `IMP-*` = `.audit/impeccable-checklist.md`
- `FE-<id>` = `.audit/frontend-visualqa-rules.md` detect rule id / checklist id
- `UX-n` = `.audit/ux-reference-pack.md` recommendation number

Severity: **P0** blocks reading or misinforms · **P1** degrades comprehension or trust · **P2** craft/consistency.

---

## A. Content & comprehension

### A1 · P0 · Scroll story leaves 44% of scroll positions unreadable
At scroll offsets 400, 700, 1400, 1700 px (of a 2560px track) no scene is simultaneously above 0.5 opacity and under 1px blur. The active scene is still blurred (`blur(1.19px)` at y=400, `blur(4.33px)` at y=700, `blur(11.35px)` at y=1400, `blur(1.19px)` at y=1700) while the outgoing scene has already faded below 0.5. A visitor who stops mid-scroll sees only blurred text.
Evidence: `audit/story-opacity.json`; screenshots `shots/before/index-desk-mid.png`, `shots/before/index-mob-mid.png`.
Violates: HIG-68 (no parallax/scroll-jacking), HIG-69 (content independent of animation), FE-content-hidden-at-rest, FE-A9, UX-11.
Fix: keep the approved character-assembly and blur/scale handover, but guarantee one readable scene at every scroll position. Make the incoming scene reach opacity 1 and blur 0 before the outgoing scene drops below opacity 1; overlap the handover by geometry, not by simultaneous translucency. Blur is a transition ornament, never a resting state.

### A2 · P0 · Profile page never states the person's name above the fold
H1 is the word "Professor". The actual name "Hye-Lin Kim" is an H2 that begins below the fold (y≈697 at 1440x900, y≈1400 on mobile). A visitor arriving from a search result cannot confirm whose page this is.
Evidence: `shots/before/profile-desk-top.png`, `shots/before/profile-mob-top.png`; `audit/dom-detail.json` (`profile.h1.text`).
Violates: HIG-1 (lead with identity), HIG-60 (identify the people), UX-29, UX-ideal-profile.

### A3 · P0 · Same self-introduction printed twice on the profile page
The hero lede and the About paragraph are the same sentence in the same first person: "I am an Associate Professor in the College of Pharmacy at Sahmyook University, where I research and teach social and administrative pharmacy." The About paragraph then repeats it again with a slight contraction change.
Evidence: `profile.html` lines 47 and 56; `shots/before/profile-mob-top.png`.
Violates: HIG-3 (answer questions in order), FE-repeated-container-text, IMP-dup, UX-ideal-profile ("third-person and first-person voice mixed").

### A4 · P1 · Eyebrow label repeats the H1 word verbatim on 5 of 6 pages
`profile` eyebrow="Professor" H1="Professor"; `research` "Research"/"Research"; `publications` "Publications"/"Publications"; `education` "Education"/"Education"; `sources` "Resources"/"Resources". The label carries zero information and consumes the strongest hierarchy slot.
Evidence: measured in `audit/dom-detail.json`; visible in every `*-desk-top.png`.
Violates: FE-kicker-above-heading, FE-hero-eyebrow-chip, HIG-2 (one primary message), HIG-31 (sentence case).

### A5 · P1 · Every page lacks any contact route
`mailto:` count = 0 and `tel:` count = 0 across all 6 pages. No email address appears anywhere in the text. Footer offers only "Faculty directory", "ORCID", "Resources & credits", "Back to top".
Evidence: grep over all 6 HTML files; `audit/a11y.json` footer text.
Violates: HIG-64 (keep contact routes visible), HIG-40 (footer complete), UX-29, IMP-craft-floor.

### A6 · P1 · No primary action anywhere on the home page
The hero offers a title and one sentence; there is no button or prominent link. The first actionable element is the nav. A prospective student or collaborator has no obvious next step.
Evidence: `shots/before/index-desk-top.png`, `shots/before/index-mob-top.png`.
Violates: HIG-2, FE-B1 (one primary action), UX-14 (one primary action above the fold, 7:1 contrast).

### A7 · P1 · Body copy runs 118–139 characters per line
Paragraphs inside the home page news list and section intros measure 1006–1180 px wide at 17px, i.e. ~118–139 characters. The measure token `--measure: 64ch` exists but is not applied to these blocks.
Evidence: `audit/dom-detail.json` `paras[]` (w=1180, ~139ch; w=1006, ~118ch).
Violates: HIG-11 (45–75 characters), FE-line-length, UX-3, UX-22.

### A8 · P1 · Mobile H1 consumes the entire first viewport
At 390x844 the home H1 wraps to 4 lines at 40px and, with the lede, occupies ~700 of 844 px. The affiliation and the mission sentence are the only content visible; no action, no scroll cue.
Evidence: `shots/before/index-mob-top.png`, `shots/before/profile-mob-top.png`.
Violates: FE-oversized-h1, HIG-1, UX-13 (hero 60–80% of viewport with one clear proposition).

### A9 · P2 · Dates use three inconsistent formats
`2026.05`, `2024.09` (home, education), `2026. 09. 02` (profile, publications, sources), `March 2016` (profile), `2026`, `2025`, `2024`, `2021` (publications). Some are `<time datetime>`, some are bare text.
Evidence: `audit/a11y.json` `dates[]`.
Violates: HIG-33, HIG-65, UX-31.

### A10 · P2 · News entries lead with a bare machine-formatted date
List items begin "2026.05" followed by a sentence, with no separator or label. The date is the visual lead even though the news text is the payload.
Evidence: `audit/dom-detail.json` `paras[]` entries beginning "2026.05", "2025", "2024.09".
Violates: FE-C2 (no raw machine text where a sentence belongs), HIG-29 (front-load the point).

---

## B. Layout & spacing

### B1 · P1 · Research page key column wastes 72px and disconnects label from content
"Area 01"–"Area 04" sit in a 132px column but the text is only ~60px wide, leaving a 72px void before the content column at 296px. The eye travels 236px from a 13px label to its heading.
Evidence: `shots/before/research-desk-mid.png`; measured column geometry in `audit/dom-detail.json` sections.
Violates: FE-A7 (align to shared edges), FE-A13, HIG-6 (group related content), IMP-grid.

### B2 · P1 · Education page leaves 150px of dead space mid-section
The facts table ends at y≈460 while the section continues to y≈610 before the next band. Content stops well before its container, leaving an unexplained gap.
Evidence: `shots/before/education-desk-mid.png`.
Violates: FE-monotonous-spacing, FE-A1 (nothing stranded in an empty canvas), IMP-rhythm.

### B3 · P2 · Section padding is one uniform 155.54px on every section of every page
All 20 content sections across 6 pages share `padding: 155.54px 0`. Rhythm never varies between a minor block and a major one.
Evidence: `audit/dom-detail.json` `sections[]` — every entry `155.54px/155.54px`.
Violates: FE-monotonous-spacing (explicit detect rule), IMP-rhythm, UX-21 (vary 64–96px by importance).

### B4 · P2 · Publication figure is large enough to hide the list
The first graphical abstract renders 1405x732 inside a card, pushing the second publication below two full viewports. A list page becomes one-item-per-screen.
Evidence: `shots/before/publications-desk-mid.png`.
Violates: UX-ideal-publication ("giant image cards reduce the list to one item per screen"), FE-density.

### B5 · P2 · Footer is a three-column block with no contact or updated date
Footer holds lab name, three links, and a photo credit. No email, no address, no "last updated". The bottom of every page is a dead end.
Evidence: `audit/a11y.json` footer text.
Violates: HIG-40, HIG-65, UX-32.

---

## C. Typography

### C1 · P2 · Only one typeface, system stack, no editorial voice
`--sans: "Segoe UI", -apple-system, ...`. No serif for headings, no distinctive face. For an academic lab the ui-ux-db recommends a scholarly serif paired with a legible sans.
Evidence: `src/styles/v3.css` `:root` `--sans`.
Violates: HIG-16 (limit families — passes), UX-33 (scholarly pairing), IMP-typeset.

### C2 · P2 · All-caps tracked eyebrow at 13px is the only label style
Every section label is 13px, 700, `letter-spacing: 1.82px`, uppercase. At this size and tracking it reads as decoration rather than information, and it is reused 20+ times.
Evidence: `audit/dom-detail.json` `eyebrow`; every screenshot.
Violates: FE-kicker-above-heading, FE-undersized-ui-text (13px is above 11px floor but below comfortable), HIG-31.

### C3 · P2 · H1 at 80px with `-2.4px` tracking exceeds the display comfort band on mobile
`--display: clamp(40px, 7vw, 80px)` with `letter-spacing: -0.03em`. At 390px the H1 is 40px over 4 lines; the tracking tightens a face that is already condensed at small sizes.
Evidence: `audit/dom-detail.json` `h1`; `shots/before/index-mob-top.png`.
Violates: FE-extreme-negative-tracking (borderline), FE-oversized-h1, IMP-typeset.

### C4 · P2 · Figure captions and photo credits sit at 13px
"Campus photograph:" and "Sahmyook University" measure 13px. Legal/attribution text below the 14px comfort floor.
Evidence: `audit/dom-detail.json` `tinyText`.
Violates: FE-tiny-text (13px is above the 12px error threshold but below the 14px recommendation), HIG-15.

---

## D. Accessibility

### D1 · P1 · Sticky header is 69px but no scroll-padding is set
Anchor links (`#top`, on-page nav on research/publications/sources) jump to targets that land under the sticky header. `scroll-padding-top` is absent.
Evidence: `audit/a11y.json` `sticky[]` shows `header` 69px and `page-nav` 53px sticky on 3 pages; CSS has no `scroll-padding`.
Violates: HIG-13, FE-A6 (sticky bars legible over content), UX-16.

### D2 · P1 · Touch targets below 44x44 on mobile
Body links measure 22px tall (`College of Pharmacy's graduate laborator…`, `Sahmyook University interview`, `published online`, `Hye-Lin Kim`, `Sahmyook University`). Nav links are 44px tall but the brand link is 29px.
Evidence: `audit/dom-probe.json` `smallTargets` = 10–14 per page; direct measurement in the small-target probe.
Violates: HIG-12 (44x44), FE-D1, UX-touch.

### D3 · P2 · No `og:image`, no `twitter:card`, no canonical
Sharing the page on social or in a message produces a bare link with no preview card. `og:title`/`og:description` exist but no image.
Evidence: grep over `index.html` — `og:image=false twitter=false canonical=false`.
Violates: HIG-61 (evidence of work), IMP-craft-floor, UX-credibility.

### D4 · P2 · Only `color-scheme: light`; no dark mode support
`color-scheme: light` on `:root`, zero `prefers-color-scheme` blocks. Visitors whose OS is dark get a full-white page.
Evidence: `audit/dom-detail.json` `theme` (`scheme: "light"`, `hasDarkMedia: false`).
Violates: HIG-26 (test dark mode), FE-E1, FE-V3.

### D5 · P2 · `prefers-reduced-motion` path exists but is never exercised in QA
The CSS and JS both implement a static path, but no captured evidence exists that the static path renders every chapter readable. `showEverything()` sets opacity but the story height stays 2560px, leaving a long empty scroll.
Evidence: `src/motion/story.js` `showEverything()`; CSS `@media (prefers-reduced-motion: reduce)` keeps `.story { height: auto }` — but the JS path does not reset `height` when the media query flips at runtime.
Violates: HIG-58, FE-G4, FE-V6.

---

## E. Craft floor / AI slop

### E1 · P2 · No favicon/OG image, so link previews are blank
(merged into D3, counted once there; excluded from the 26 total below.)

### E2 · P2 · External images hotlinked from the publisher (1.27 MB, 4 requests)
All four publication figures load from `https://www.e-cmh.org/upload//thumbnails/…` with a double slash in the path. The site depends on a third party that can move or block them; three of four did not render during a 2.5s capture.
Evidence: `publications.html` img tags; HTTP probe returned 200/448KB, 469KB, 238KB, 114KB.
Violates: HIG-48/51 (render useful content, avoid layout shift), IMP-optimize, UX-35.

### E3 · P2 · Double slash in asset URLs
`upload//thumbnails` — a path-join bug in the source data.
Evidence: `publications.html`.
Violates: IMP-craft-floor.

---

## Summary

| Severity | Count |
|---|---|
| P0 | 3 |
| P1 | 9 |
| P2 | 14 |
| **Total** | **26** |

Pages affected: index (A1, A6, A7, A8, A10, B3, C3, D1, D2, E2, E3), profile (A2, A3, A4, A5, C2, D2), research (A4, B1, B3, D1, D2), publications (A4, A7, B4, D1, D2, E2, E3), education (A4, A9, B2, B3, D2), sources (A4, A5, B3, B5, D2).

Verified as **not** defects (recorded so they are not re-reported):
- `splitText(accessible: true)` produces a visually-hidden sr-only copy plus `aria-hidden` animated glyphs. Screen readers read the heading once. DOM `textContent` doubling is expected and correct.
- `src=""` in the image probe was lazy-loading timing, not broken markup; the publisher images return HTTP 200.
- The clipped "ocial Pharmacy" hero seen in early captures was an intro-animation frame, not a resting-state clip. Resting-state H1 has `scrollWidth == clientWidth`.
