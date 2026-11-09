# QA Verdict — kim-hyerin-homepage-v4

Run: 2026-11-09 · merged `main` @ `7eb46a3` · preview `http://127.0.0.1:4319`
Viewports: 1440x900 DPR 1 and 390x844 DPR 3 · schemes light + dark
Method: Bun.WebView (Chromium) + CDP `Emulation.setEmulatedMedia` / `setDeviceMetricsOverride`.
Every row below records a measurement taken in this session, not an intention.

## Verdict table

| # | Scenario | Criterion | Measured | Verdict |
|---|---|---|---|---|
| VQ-01 | One H1, subject named | exactly 1 `<h1>`; profile H1 = name | 6/6 pages 1 H1; profile "Hye-Lin Kim" | **PASS** |
| VQ-02 | No duplicated sentence | no sentence >= 40ch twice | 0 duplicates on 6/6 pages | **PASS** |
| VQ-03 | Eyebrow != H1 | not equal, not contained | 6/6 differ (Notice / Principal investigator / Four areas / Selected works / Teaching / Provenance) | **PASS** |
| VQ-04 | Contact reachable | `mailto:` in footer | 6/6 pages, 1–3 mailto each | **PASS** |
| VQ-05 | Primary action above fold | hero link top < 900 | index hero CTA top = 694 | **PASS** |
| VQ-06 | Prose measure | 45–75 chars per line | worst 75ch @ 623px on 6/6 pages | **PASS** |
| VQ-07 | Mobile first viewport | H1 <= 4 lines + lede + action | H1 4 lines / 199px (27% of 744), lede + 2 CTAs visible | **PASS** |
| VQ-08 | Section rhythm varies | >= 2 padding values | 2–3 values per page (88 / 96 / 156) | **PASS** |
| VQ-09 | Key column gap | <= 32px | research rows 30px | **PASS** |
| VQ-10 | Story readable at every offset | opacity >= 0.99, blur <= 0.5 | 9/9 offsets op=1.00 blur=0.00 | **PASS** |
| VQ-11 | Reduced-motion path | scenes stacked, all readable | 3 scenes op=1 blur=none, tops 225/843/1241, overlap=false, stage 1602px | **PASS** |
| VQ-12 | Sticky offset | target not under header | `#main-content` top = 69px = header height; scroll-padding 140px | **PASS** |
| VQ-13 | Touch targets | >= 44px | 0 elements under 44px on 6/6 pages at 390 | **PASS** |
| VQ-14 | Contrast | body >= 4.5, large >= 3, both schemes | light 0 failures, dark 0 failures (was 3.13:1 on `.footer-updated`; fixed to 7.9:1) | **PASS** |
| VQ-15 | Dark mode renders | dark paper, legible, no light band | `--paper #0b1220`, `--ink #eef2f8`, 0 unintended light backgrounds | **PASS** |
| VQ-16 | Images local and complete | 0 e-cmh.org requests, naturalWidth > 0 | 0 external requests; 4/4 images naturalWidth=900 complete | **PASS** |
| VQ-17 | Social preview | og:image + twitter:card + canonical | 6/6 pages, 4 og tags each, distinct canonical per page | **PASS** |
| VQ-18 | Date format | one notation, valid datetime | dotted notation only; every `<time>` parses | **PASS** |
| VQ-19 | No horizontal scroll | scrollWidth == clientWidth | 0 overflow at 390 and 1440 on 6/6 | **PASS** |
| VQ-20 | Build and lint | exit 0 both | `bun run build` 0, `bun run check` 0 | **PASS** |
| VQ-21 | Keyboard focus visible | >= 2px ring | `solid 2px rgb(127,179,238)` | **PASS** |
| VQ-22 | Landmarks and skip link | header/nav/main/footer, skip first | a.skip-link -> header.site-header -> main#main-content -> footer.site-footer | **PASS** |
| VQ-23 | Before/after pair | one capture each per fixed violation | `.audit/shots/{motion,identity,layout,assets}/{before,after}` | **PASS** |

**23 / 23 PASS.**

## Defects found during the final run (and fixed)

One regression surfaced only when the whole suite ran against merged `main`:

- `.footer-updated` ("Last updated 2026. 11. 09") used `--muted`, a token tuned
  for the light paper. On the night footer that measured **3.13:1** at 13px,
  below the 4.5:1 floor. Changed to `rgb(255 255 255 / 76%)` over `--night`,
  which measures **7.9:1**. Re-ran VQ-14 on all six pages in both schemes:
  0 failures. Commit `fix(footer): 밝은 배경용 muted 색이 어두운 푸터에서 3.13:1이던 것을 고친다`.

## Violations closed

| Violation | PR | Extra evidence |
|---|---|---|
| A1 story unreadable | #1 | VQ-10 9/9 offsets |
| A2 profile H1 not a name | #2 | VQ-01 |
| A3 duplicated self-intro | #2 | VQ-02 |
| A4 eyebrow repeats H1 | #2 | VQ-03 |
| A5 no contact route | #2 | VQ-04 |
| A6 no hero action | #2 | VQ-05 |
| A7 118–139 char lines | #3 | VQ-06 |
| A8 mobile H1 full viewport | #3 | VQ-07 |
| A9 date formats | #2 / #3 | VQ-18 |
| A10 bare date lead | #3 | shots/layout |
| B1 72px dead column | #3 | VQ-09 |
| B2 150px dead space | #3 | shots/layout |
| B3 uniform 155.54px | #3 | VQ-08 |
| B4 oversized figure | #4 | 900px WebP, shots/assets |
| B5 footer dead end | #2 | VQ-04 |
| C1 single typeface | #3 | serif display already present in v3 |
| C2 caps eyebrow only | #2 / #3 | VQ-03 |
| C3 tight tracking on mobile | #3 | VQ-07 |
| C4 13px captions | #3 | 14px floor |
| D1 no scroll-padding | #3 | VQ-12 |
| D2 sub-44px targets | #3 | VQ-13 |
| D3 no og:image/canonical | #4 | VQ-17 |
| D4 no dark mode | #3 | VQ-15 |
| D5 reduced-motion path | #1 | VQ-11 |
| E2 1.27MB hotlink | #4 | VQ-16, 125KB |
| E3 double slash | #4 | 8 URLs fixed |

## Not defects (recorded so they are not re-reported)

- H1 `textContent` is doubled by `splitText(accessible: true)`: one visually
  hidden sr-only copy plus `aria-hidden` animated glyphs. Screen readers read it
  once. This is correct, not a duplication bug.
- Hero white text over the campus photograph cannot be scored by a flat
  foreground/background calculation; the scrim gradient (`.story__stage::before`)
  is what carries contrast. Hero text is excluded from the VQ-14 sweep for that
  reason, and was checked visually.
- `.skip-link` is visually hidden until focused, so it is excluded from the
  resting-state contrast sweep.

## Known gaps

- `.audit/impeccable-checklist.md` holds 115 of the 165 checklist items
  (items 51-165). Items 1-50 were produced by the research pass but the
  transcript that carried them was truncated by the 30k-character capture cap
  before the file was written. They are not reconstructed. Layout and typography
  coverage came instead from `.audit/hig-universal-web.md` and
  `.audit/frontend-visualqa-rules.md`, which are complete.
- The hero's white-on-photograph text is excluded from the automated contrast
  sweep (a flat fg/bg calculation cannot score it); it was judged from the
  captures in `.audit/shots/layout/after`.
- No Lighthouse/axe run was executed. VQ-13, VQ-14, VQ-21 and VQ-22 cover the
  same ground by direct measurement, but an external tool pass is not claimed.

## Artifacts

Live captures (all committed):
- `.audit/shots/motion/{before,after}`
- `.audit/shots/identity/{before,after}`
- `.audit/shots/layout/{before,after}`
- `.audit/shots/assets/{before,after}`

Machine-readable probes this session wrote to the run directory
`C:/Users/yejun/AppData/Local/Temp/ulw-hyerin-4eEZHJ/audit/`:
`final-dom.json`, `final-desktop.json`, `final-responsive.json`.

Rule sources applied: `.audit/hig-universal-web.md` (75 rules),
`.audit/ux-reference-pack.md` (37 recommendations),
`.audit/frontend-visualqa-rules.md`, `.audit/impeccable-checklist.md` (165 items).
