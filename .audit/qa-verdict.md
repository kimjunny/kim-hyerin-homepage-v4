# QA Verdict — kim-hyerin-homepage-v4

Run: 2026-11-09 · merged `main` @ `93ccb93` · preview `http://127.0.0.1:4319`
Viewports: 1440x900 DPR 1 and 390x844 DPR 2 · schemes light + dark
Method: puppeteer-core driving Chrome (`scripts/visual-gate.mjs`, `scripts/a11y-gate.mjs`).
External tools: axe-core 4.14.0 (`scripts/a11y-gate.mjs`), Lighthouse 13.6.0 (CLI).
Every row below is asserted by the gate; a row that is not automated says so.

## Verdict table

| # | Scenario | Criterion | Measured | Verdict |
|---|---|---|---|---|
| VQ-01 | One H1, subject named | exactly 1 `<h1>`; profile H1 = name | 6/6 pages 1 H1; profile H1 starts with "Hye-Lin Kim" | **PASS** |
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
| VQ-14 | Contrast | body >= 4.5, large >= 3, both schemes | light 0 failures, dark 0 failures (was 3.13:1 on `.footer-updated`; fixed to 10.96:1) | **PASS** |
| VQ-15 | Dark mode renders | dark paper, legible, no light band | `--paper #0b1220`, `--ink #eef2f8`, 0 unintended light backgrounds | **PASS** |
| VQ-16 | Images local and complete | 0 e-cmh.org requests, naturalWidth > 0 | 0 external requests; 4/4 images naturalWidth=900 complete | **PASS** |
| VQ-17 | Social preview | og:image + twitter:card + canonical | 6/6 pages, 4 og tags each, distinct canonical per page | **PASS** |
| VQ-18 | Date format | one notation family, valid datetime | 20 `<time>` elements, dotted only; precision varies (year / year-month / year-month-day) by design | **PASS** |
| VQ-19 | No horizontal scroll | scrollWidth == clientWidth | 0 overflow at 390 and 1440 on 6/6 | **PASS** |
| VQ-20 | Build and lint | exit 0 both | `bun run build` 0, `bun run check` 0 | **PASS** |
| VQ-21 | Keyboard focus visible | >= 2px ring on real Tab presses | 22 distinct tab stops, every one `solid 2px rgb(127,179,238)` | **PASS** |
| VQ-22 | Landmarks and skip link | header/nav/main/footer, skip first | a.skip-link -> header.site-header -> main#main-content -> footer.site-footer | **PASS** |
| VQ-23 | Before/after pair | at least one identical-viewport pair per lane | 5 lanes covered: motion (2 pairs), identity (4), layout (5), assets (1), vq24 (1), footer (1). Per-violation pairs are **not** complete; see the limitation below | **PARTIAL** |
| VQ-24 | Reduced-motion hero photo | photo paints on the static path | before: `paints=false`; after: `paints=true`, opacity 0.3 | **PASS** |

**23 / 24 PASS, 1 PARTIAL** on the automated gate (`node scripts/visual-gate.mjs`, 30/30 assertions across both schemes and viewports).

## External tool evidence

### axe-core 4.14.0 — `node scripts/a11y-gate.mjs`

```
PASS desktop:index passes=36 violations=0
PASS desktop:profile passes=36 violations=0
PASS desktop:research passes=34 violations=0
PASS desktop:publications passes=38 violations=0
PASS desktop:education passes=34 violations=0
PASS desktop:sources passes=34 violations=0
PASS mobile:index passes=38 violations=0
PASS mobile:profile passes=38 violations=0
PASS mobile:research passes=36 violations=0
PASS mobile:publications passes=38 violations=0
PASS mobile:education passes=36 violations=0
PASS mobile:sources passes=36 violations=0
axe 4.14.0: 0 violations across 12 runs (6 pages x 2 viewports), 434 rule passes
control run detected: button-name, image-alt, region -> scanner verified
Accessibility gate PASSED.
```

The control run injects an alt-less image and an empty button before the real
scan. It must report `image-alt` and `button-name`, which proves the zero above
is a clean page rather than a scanner that never loaded. Report:
`.audit/axe/axe-report.json`.

### Lighthouse 13.6.0 — 12 runs

| Run | Perf | A11y | Best practices | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| desktop x 6 pages | 100 | 100 | 100 | 100 | 0.3–0.4 s | 0 |
| mobile x 6 pages | 99–100 | 100 | 100 | 100 | 1.1–2.0 s | 0 |

Worst case is mobile `index` at performance **99** (LCP 2.0 s, TBT 0 ms).
All 12 runs: accessibility 100, best practices 100, SEO 100, CLS 0.
Full data: `.audit/lighthouse/lighthouse-summary.json`.

## Defects found during the final run (and fixed)

Two regressions surfaced only when the whole suite ran against merged `main`:

- `.footer-updated` ("Last updated 2026. 11. 09") used `--muted`, a token tuned
  for the light paper. On the night footer that measured **3.13:1** at 13px,
  below the 4.5:1 floor. Changed to `rgb(255 255 255 / 76%)` over `--night`,
  which measures **10.96:1**. Re-ran VQ-14 on all six pages in both schemes:
  0 failures. Commit `fix(footer): 밝은 배경용 muted 색이 어두운 푸터에서 3.13:1이던 것을 고친다`.
  Both states are captured in `.audit/shots/footer/{before,after}.png`; the
  script reproduces 3.13:1 exactly by re-applying `--muted` under a pinned
  light scheme (under dark scheme `--muted` is `#a7b2c3` and the bug does not
  reproduce).

- The reduced-motion hero photo disappeared entirely. `.story__stage` switches
  from `position: sticky` to `static` on the reduced-motion path, which removed
  the stacking context that `.story__photo` (`z-index: -2`) depends on, so the
  photo fell behind the opaque `.story` background. Added `isolation: isolate`
  to `.story__stage` so the context exists on both paths. Measured
  `photoPaints` false -> true; captures in `.audit/shots/vq24/`. This is VQ-24,
  a new scenario added because the original 23 never rendered the reduced-motion
  hero with the photo asserted.

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

- **VQ-23 is PARTIAL, not PASS.** 26 violations were fixed, but the capture
  pairs are per lane (motion 2, identity 4, layout 5, assets 1, vq24 1,
  footer 1), not one pair per violation. Several fixes are structural and have
  no meaningful before frame (A4 eyebrow wording, D1 scroll-padding, E3 URL
  shape). Each PR body carries the pairs that exist for its lane.
- `.audit/impeccable-checklist.md` holds 115 of the 165 checklist items
  (items 51-165). Items 1-50 were produced by the research pass but the
  transcript that carried them was truncated by the 30k-character capture cap
  before the file was written. They are not reconstructed. Layout and typography
  coverage came instead from `.audit/hig-universal-web.md` and
  `.audit/frontend-visualqa-rules.md`, which are complete.
- The hero's white-on-photograph text is excluded from the automated contrast
  sweep (a flat fg/bg calculation cannot score it); it was judged from the
  captures in `.audit/shots/layout/after` and the full-page set. axe reports it
  as `incomplete` rather than `violation`, matching that limitation.
- Lighthouse numbers come from a local preview server with local assets, so they
  measure layout and payload, not production CDN latency.

## Reproducing the gates

```
bun run build
bun run preview --port 4319        # separate terminal
bun run qa:a11y                    # axe, 12 runs, control-verified
bun run qa:visual                  # 30 assertions: VQ-01..22, 24 (incl. both schemes)
bun run qa:shots                   # 12 full-page captures at 1440 and 390
node scripts/capture-live.mjs      # deployed v3 baseline captures
node scripts/capture-footer.mjs before|after <out.png>
```

Each script exits non-zero on failure, so they work as CI gates as written.

## Artifacts

Live captures (all committed):
- `.audit/shots/live/` — the deployed v3 baseline at 1440x900 and 390x844,
  viewport and full-page, with `live-manifest.json` recording URL, HTTP status,
  title and H1
- `.audit/shots/motion/{before,after}`
- `.audit/shots/identity/{before,after}`
- `.audit/shots/layout/{before,after}`
- `.audit/shots/assets/{before,after}`
- `.audit/shots/vq24/{before,after}` — reduced-motion hero regression
- `.audit/shots/footer/{before,after}.png` — footer contrast 3.13:1 -> 10.96:1
- `.audit/shots/fullpage/*.webp` — 12 full-page captures (6 pages x 2 viewports)
  with `capture-manifest.json`
- `.audit/axe/axe-report.json` — axe run incl. control verification
- `.audit/lighthouse/lighthouse-summary.json` — 12 Lighthouse runs
- `.audit/visualqa/report.json` — visual gate results

Machine-readable probes this session wrote to the run directory
`C:/Users/yejun/AppData/Local/Temp/ulw-hyerin-4eEZHJ/audit/`:
`final-dom.json`, `final-desktop.json`, `final-responsive.json`.

Rule sources applied: `.audit/hig-universal-web.md` (75 rules),
`.audit/ux-reference-pack.md` (37 recommendations),
`.audit/frontend-visualqa-rules.md`, `.audit/impeccable-checklist.md` (165 items).
