# Frontend Visual-QA + Anti-Slop Rule Set

Sources: `omo-ai/plugin/skills/frontend/{SKILL.md,references/**}`, `visual-qa/{SKILL.md,references/browser-setup.md}`, `remove-ai-slops/SKILL.md`, plus `programming/references/testing/junk-classes.md` (referenced by remove-ai-slops) and the detect rule metadata under `frontend/scripts/detect/rules/**`. All rules below are quoted/condensed from those files; nothing is invented.

## 1. The frontend flow and its hard rules

**Flow: ground -> brief -> build -> subtract -> verify.**

1. **Ground** (`references/design/grounding.md`): read the guideline source in full, define the ideal state for personas/journeys, write every gap into a ledger (`DESIGN.md` section 9). Run for a new screen/flow, a redesign, or design-system work.
2. **Brief**: write into `DESIGN.md` section 5 (or the change description): exactly one primary action; information priorities 1-3 in reading order; "left out on purpose"; required content listed by name; data shape -> component; a `Layout:` line for any layout change; `before` captures before the first edit.
3. **Build**: `DESIGN.md` gate first (read it, or create it via Phase 0 branches; small change = copy nearest styled sibling). Every colour/size/spacing value traces to a token. New systems: colour roles both themes -> type/spacing -> components from shadcn/ui anatomy or the project kit. React projects also run the Phase 0.5 tooling gate (react-grab, react-scan, react-doctor, dev-only).
4. **Subtract**: walk every element and ask what the user could not do or know without it; no answer = delete. Re-check the required-content list by name; merging two required inputs, dropping a datum, or shortening required copy is a regression. Count controls; groups separate by whitespace, not boxes.
5. **Verify**: done is the `/visual-qa` gate, not your own glance. Hand it the brief (B7), `Layout:` line (A12), required-content list (Pass A), and the `before` set. Fix passes are scoped: one change + the regions it owns; never a whole-page "make it better" pass.

**Hard build rules**

- One primary action per view; peers differ by style, never size. Destructive/Cancel never the Enter default.
- Hit targets: touch >= 44x44 CSS px, 8-12 px apart; pointer >= 24x24 px (WCAG 2.5.8), ~10 px padding beyond the glyph. Grow the hit area, never the glyph.
- Every control ships hover, pressed, focus-visible, disabled; one box in every state (label/icon/spinner swap in fixed slots). Data views ship empty/loading/error/offline.
- Keyboard: reading-order reachability, visible focus ring never covered by sticky bars/overlays, Escape closes topmost overlay, icon-only controls have name + tooltip.
- Motion only for a cause, on transform/opacity/filter, interruptible, never gating input; positional/scale/depth motion becomes a cross-fade under `prefers-reduced-motion`.
- One SVG icon set (Lucide/Heroicons/Radix/Phosphor); never emoji as icons.
- Browser surfaces themed from the palette in both themes: `::selection`, caret, scrollbars, focus ring, underline offset, tabular numerals.
- Type/spacing floor: heading steps >= 1.25x; body roles closer in size differ by weight/colour/case; space above a heading >= 1.5x below; group gap >= 2x inner gap; body measure 65-75ch desktop (>= 45ch phone); display <= 6rem; tracking >= -0.04em. Read computed values.
- Concrete reference = contract: match pixels, copy, structure, responsive intent unless the user accepts a deviation.
- Never weaken UX to buy Lighthouse points (no dropped animation, hidden content, simplified interaction).
- No coloured one-side bar / accent outline on a rounded card (decorative or state); allowed: focus-visible rings, input validation, neutral 1px hairlines, table rules, blockquote neutral rule.
- No decorative badge/stat tile without a state/decision behind it; no invented proof (testimonials, logos, counts, prices); no prop decoration; no repeated formula; no subtitle under every heading; one fact, one place; no dated surface (glass/blur/neumorphism/mesh-gradient/heavy shadow); no generated scaffold (kicker, icon tile over heading, hero metric, card-in-card, gray on colour, monospace costume, zero-offset glow); no promotional copy.
- Lint before visual QA: `check-draft-guard.ts` on every stylesheet/component/HTML; exit 1 = remove the tell. Then run the detect SDK at 1440 and 390 with `reflow: true`; fix every error/warning, record a decision per advisory.
- Lighthouse 100 in every category on real Playwright Chromium, production build, mobile + desktop, 3-5 runs median; fix at the architecture; design-system compliance checked (no undeclared hex, arbitrary type, non-4px spacing, undocumented repeated components, depth mismatch).
- Deliverable states its WCAG 2.2 AA result as a PASS/FAIL/N/A table with evidence: contrast, focus, target size, keyboard, reflow/text spacing, dragging/auth/help/entry, state-stable controls, system/surfaces.

## 2. Detect rule catalog — 63 unique rule IDs (79 declarations: 63 page + 16 source)

Severity: `error` and `warning` fail the gate; `advisory` is a recorded decision. `design-system-*` rules stay silent without `config.designTokens`. Waive only with `data-detect-ignore="<id>"` plus a reason in `DESIGN.md`.

### Color (9)

| id | Name | Message | Fix |
|---|---|---|---|
| low-contrast | Low contrast text | Text below WCAG AA for its size | Raise text/surface contrast to 4.5:1 (3:1 large) |
| gray-on-color | Gray text on colored background | Mid-gray ink loses clarity on a chromatic surface | Use a dark shade of the surface hue or near-white ink |
| ai-color-palette | AI color palette | Stock violet/cyan ramps or paired neon inks replace an intentional palette | Choose a distinctive palette; declare colours as tokens |
| cream-palette | Cream / beige palette | Page defaults to a warm cream/beige ground | Choose a page surface from the project palette |
| gradient-text | Gradient text | Colour ramp clipped to glyphs adds decoration | Use a solid text colour |
| dark-glow | Glowing shadow accents | Coloured blurred shadow reads as a decorative glow | Neutral elevation shadow, or remove the halo |
| radial-halo | Radial-gradient background halo | Saturated radial fade decorates a dark surface | Solid or subtly shifted background |
| radial-spotlight-glow | Decorative radial spotlight glow | Translucent radial accent floats behind copy | Remove the wash or use a deliberate material surface |
| design-system-color | Color outside DESIGN.md | Painted colour outside the declared palette (advisory) | Use a token or add the colour to the palette |

### Typography (14)

| id | Name | Message | Fix |
|---|---|---|---|
| overused-font | Overused font | Dominant face is a frequently repeated interface font | Choose a suited face, or list it in `allowFonts` |
| flat-type-hierarchy | Flat type hierarchy | Heading/body roles lack an adjacent 1.25 size step | Add a stronger step between two roles |
| italic-serif-display | Italic serif display headline | Italic serif at hero scale repeats a landing-page treatment | Roman type or non-serif unless editorial type is the brief |
| oversized-h1 | Oversized hero headline | Sentence-length display consumes the first screen | Shorten the headline or reduce its size |
| extreme-negative-tracking | Crushed letter spacing | Negative tracking beyond threshold damages letter shapes | >= -0.07em reading, -0.09em display |
| tiny-text | Tiny body text | Running copy < 12px | Body >= 14px, preferably 16px |
| undersized-ui-text | Undersized functional text | Functional labels < 11px | >= 11px functional, >= 10px small print |
| all-caps-body | All-caps body text | Uppercase sentences lose word shapes | Sentence case for running copy; uppercase for headings/short labels |
| wide-tracking | Wide letter spacing on body text | Wide tracking splits reading words into characters | Body tracking <= 0.05em |
| tight-leading | Tight line height | Multiline copy with line-height < 1.3 crowds lines | 1.5-1.7 for body copy |
| justified-text | Justified text | Narrow justified columns stretch word spaces into gaps | Left-align, widen the column, or `hyphens: auto` |
| line-length | Line length too long | Multiple lines > 80 characters | Constrain reading copy to ~65-75ch |
| design-system-font | Font outside DESIGN.md | Text face absent from typography tokens | Use a token or add the face to `designTokens.fonts` |
| design-system-font-size | Font size outside DESIGN.md | Rendered size outside the type ramp (advisory) | Use a size token or add the step |

### Layout (14)

| id | Name | Message | Fix |
|---|---|---|---|
| nested-cards | Nested cards | Bordered/raised card inside another card | Flatten with spacing, type, or a divider |
| monotonous-spacing | Monotonous spacing | One spacing value dominates the page | Keep related items close; larger section gaps |
| edge-flush-cards | Cards flush against scroller edge | Row keeps one gutter but touches/crosses the opposite clip edge | Size panels to the container; equal inset both edges |
| text-occlusion | Text occluded by overlapping element | Overlapping surface covers readable words | Separate layers, remove leaking padding, reposition text |
| first-viewport-column-overflow | One column stretches the first viewport | Opening row's column runs far below the fold while its sibling fits | Balance columns, cap the longer one, or flow content below |
| cramped-padding | Cramped padding | Text too close to a visible container boundary | >= 8px beside body text; scale with font size |
| body-text-viewport-edge | Body text touching viewport edge | Reading text touches the edge without a usable gutter | >= 12px phone, 16px wider screens |
| text-overflow | Content overflowing its container | Text spills into a clip, another element, or the viewport | Wrap, constrain width, or a deliberate scroll region |
| clipped-overflow-container | Positioned child clipped by overflow container | Container cuts off a menu/tooltip/dialog (advisory) | Render the popup outside the clipping box |
| heading-rhythm | Heading crowded against previous block | Headings closer to preceding content than to their own content | More space above than below |
| straggler | Straggler | Paragraph leaves one short word on its last line (advisory) | `text-wrap: pretty` or edit the ending |
| unbalanced-heading | Unbalanced heading | Heading's last line much shorter than the line above (advisory) | `text-wrap: balance` or rewrite |
| content-hidden-at-rest | Content invisible at rest | Large share of text stays transparent/hidden | Show content by default; enhance entrance without hiding |
| viewport-reflow | Viewport reflow | Document wider than the viewport; sideways scrolling | Constrain widest content, wrap long tokens, contain intentional scroll |

### Decoration (17)

| id | Name | Message | Fix |
|---|---|---|---|
| hard-offset-shadow | Hard offset shadow | Visible >= 4px shadow with no blur (neobrutalist costume) | Soft elevation shadow, or waive when neobrutalism is the brief |
| side-tab | Side-tab accent border | Coloured edge turns a card into a decorative side tab | Remove the stripe; use spacing/restrained surface |
| border-accent-on-rounded | Border accent on rounded element | Heavy accent band competes with rounded corners | Remove the accent border or square the container |
| gpt-thin-border-wide-shadow | Hairline border with wide shadow | Comparable cards repeat hairline edge + broad halo (advisory) | Pick one edge treatment per row |
| repeating-stripes-gradient | Repeating-gradient stripes | Repeating bands decorate without structure (advisory) | Deliberate texture or plain surface |
| codex-grid-background | Decorative grid-line background | Tiled hairlines draw a grid behind content (advisory) | Grids only for measurement/canvas surfaces |
| organic-clip-path | Organic contour drawn as clip-path | Complex CSS contour substitutes for produced material | Image-derived alpha matte; CSS for simple geometry |
| buried-raster | Raster buried under a wash/opacity | Image nearly invisible under wash or low opacity | Let it show, or remove the unused raster |
| shape-assembled-illustration | Shape-assembled illustration | Hero-sized SVG scene built mainly from primitives (advisory) | Produced artwork, photo, or deliberately drawn illustration |
| icon-tile-stack | Icon tile stacked above heading | Small framed icon tile above a heading | Icon beside the title, or no tile |
| hero-eyebrow-chip | Hero eyebrow / pill chip | Tiny tracked/accented label decorates a display hero | Remove or integrate its words into the heading |
| kicker-above-heading | Kicker / eyebrow label above heading | Separate tracked uppercase label repeats the hierarchy | Delete, or work words into heading/body |
| design-system-radius | Radius outside DESIGN.md | Corner radius outside the project scale (advisory) | Use a documented radius token |
| marquee | Auto-scrolling marquee | Content crawls in a perpetual horizontal loop | Keep content still; reader-controlled scroll |
| pulsing-dot | Pulsing status dot | Tiny circular indicator pulses continuously | Static unless it represents live changing data |
| blinking-cursor | Decorative blinking cursor | Fake caret blinks in non-editable content (advisory) | Remove; real fields draw their caret |
| bounce-easing | Bounce or elastic easing | Names/curves imply overshooting motion (advisory) | Smooth deceleration, or document in `allowEasings` |

### Copy (9)

| id | Name | Message | Fix |
|---|---|---|---|
| em-dash-overuse | Em-dash overuse | >= 8 prose dashes at >= 1 per 500 chars (advisory) | Sentence breaks or commas |
| marketing-buzzword | Marketing buzzword | Generic promotion replaces concrete description | Name the action, benefit, or measured result |
| aphoristic-cadence | Aphoristic-cadence copy | Three+ short rebuttals give unrelated sections one cadence | Specific information; vary sentence structure |
| theater-slop-phrase | Theater framing copy | Calling a practice "theater" dismisses without explaining (advisory) | Describe the missing behavior/evidence |
| numbered-section-labels | Tiny numbered section labels | Multiple headings carry tiny styled numeric indices (advisory) | Remove decorative numbers or fold into the heading |
| repeated-container-text | Same text repeated inside one container | One card repeats a short string in 3+ structural slots | State status once |
| skipped-heading | Skipped heading level | Heading jumps a level in the visible outline | Next level; style independently of rank |
| broken-image | Broken or placeholder image | Image has no usable source | Real `src`/`srcset`, or remove |
| script-error | Uncaught script error on load | Uncaught exception/rejection during load | Fix the script or handle the rejection |

### Source engine (16 declarations; IDs mirror page rules)

Source-text rules run on CSS/SCSS/Less, JSX/TSX, Vue, Svelte, Astro. Same IDs and severities as above; source-specific messages:

| id | Source message | Fix |
|---|---|---|
| side-tab | Coloured stripe decorates a rounded card/status row | Remove stripe or use quieter surface/type |
| border-accent-on-rounded | Thick top/bottom border meets a rounded element | Remove accent border or square corners |
| overused-font | Familiar default typeface in a declaration/import | Suited typeface, or allow the family |
| gradient-text | Clipped text uses a decorative gradient fill | Solid text colour |
| gray-on-color | Gray utility text shares an element/branch with a solid colour fill | Ink from the surface hue, or a neutral surface |
| ai-color-palette | Purple heading ink or purple-to-cool gradient | Colours from the product identity |
| bounce-easing | Named bounce animation or overshooting curve | Smooth deceleration, or allow it |
| broken-image | Image tag with no statically usable source/srcset | Real source or remove |
| codex-grid-background | Two tiled hairline gradients draw a grid | Remove unless it communicates structure/data |
| monotonous-spacing | One spacing value dominates a full page | Vary spacing between groups and sections |
| em-dash-overuse | Body copy repeats em dashes in a short space | Sentences or simpler punctuation |
| marketing-buzzword | Generic promotional phrases instead of concrete information | Describe what it does and who it helps |
| aphoristic-cadence | Clipped rebuttals give copy a slogan rhythm | Specific, naturally paced sentences |
| dark-glow | Coloured blurred shadow creates a glow | Neutral elevation shadows |
| radial-halo | Saturated radial gradient fades into a dark background | Quieter solid background or imagery |
| marquee | Content moves in a perpetual horizontal loop | Still content or reader-controlled scroll |

## 3. Visual-QA checklist (88 items: 74 A-J + 14 evidence gates)

Every item is PASS / FAIL / N/A, proven by a named capture. N/A only when the surface has no instance; never PASS by default. One failing page fails the surface.

### A. Layout and alignment (13)
1. A1 Content anchored by intent (centre/grid); nothing stranded top-left of an empty canvas.
2. A2 Backgrounds and scrolling layouts run full-bleed; no stray inset margin.
3. A3 Margins symmetric; prose 65-75ch desktop, >= 45ch phone.
4. A4 (phone) Safe areas respected: home indicator, notch, status bar.
5. A5 (phone) Overlay scrollbars; no reserved right gutter.
6. A6 One scroll owner per region; no nested same-direction scrolling; sticky bars legible over content.
7. A7 Elements align to shared edges; gaps from the spacing scale.
8. A8 Related items visibly grouped; controls have clear surrounding space.
9. A9 One readable column at 390, no horizontal scroll; nothing clips/overlaps at 1440/1920 or under empty, long-label, unbroken-string content.
10. A10 Out-of-view continuation shows a cue (partial item, fade, chevron).
11. A11 (mac) Nothing important only at the bottom edge; minimum window keeps toolbar/content legible; sidebar collapses.
12. A12 Layout contract: a `Layout:` line exists; capture matches the pattern; logged owner is the main scroller; other scrollers are nested for their own content or named; no anti-patterns.
13. A13 Spacing rhythm from computed values: above heading >= 1.5x below; group gap >= 2x inner gap (or the brief's recorded route value).

### B. Hierarchy (8)
14. B1 One primary action, prominent by background accent, not glyph; peers differ by style not size.
15. B2 Destructive styled as such, never Enter default; Cancel never default.
16. B3 Plain title saying what the screen is (not the app name); toolbar title ~15 chars.
17. B4 Most important content top/leading; secondary detail does not crowd it.
18. B5 One or two accents per screen; bars monochrome over colourful content; nothing decorative carries accent.
19. B6 Type hierarchy from weight/size/colour, holds in both themes, at most two typefaces.
20. B7 Screen matches its brief: named primary action is the single prominent control; priorities 1-3 in order on the first viewport; nothing "left out on purpose" present. No brief for a session-built screen = FAIL.
21. B8 Type scale floor: adjacent heading steps >= 1.25x; closer body roles differ by weight/colour/case; display <= 6rem; tracking >= -0.04em (or the recorded route value).

### C. Text and copy (8)
22. C1 Body >= 17pt-equivalent at 390 (15pt secondary), >= 14px desktop; no thin weights at small sizes.
23. C2 No raw machine text where a sentence belongs (ISO timestamps, ids, enum/engine strings); times relative and local.
24. C3 Action labels are outcome verbs, tab/segment labels nouns, one capitalisation style; "OK" never the default; (mac) actions needing input end with ellipsis.
25. C4 Truncation/wrapping designed: ellipsis or wrap, no clipped glyphs/descenders, no overlap at large text or 200% zoom, no heading wrapping to four lines.
26. C5 CJK breaks naturally: no orphaned particle/ending, no clause split from predicate, no broken citation string.
27. C6 Empty states/errors say what happened and what to do next, next to the failure, without blame.
28. C7 Every text field has a visible label; placeholder shows format and is never the only label.
29. C8 Useful label text (ids, errors, addresses, paths) is selectable.

### D. Touch and pointer targets (4)
30. D1 Touch >= 44x44 px, 8-12 px apart; pointer padded ~10 px beyond the glyph.
31. D2 (phone) Tab bar ~49pt + safe area, icon above one-word label, all tabs visible, active matches route, none disabled/hidden.
32. D3 Toolbar <= 3 groups, standard back/close glyphs, one prominent trailing primary, text actions apart from glyph actions.
33. D4 Adjacent bar buttons have continuous hit areas.

### E. Contrast, colour and themes (7)
34. E1 Light and dark both render correctly as a pair; no light-only asset glows in dark; icons legible in both.
35. E2 WCAG AA both themes: 4.5:1 body, 3:1 large/icons/control edges, including placeholder and disabled.
36. E3 Nothing carried by colour alone; status colour pairs with glyph/label/shape; focus not colour-only.
37. E4 One colour never means two things; status colours consistent.
38. E5 Translucent surfaces keep text legible over scrolled content (blur/vibrancy, not plain alpha).
39. E6 Theme follows the system; an in-app control also offers "system".
40. E7 Secondary text on tinted/coloured surface is a shade of that hue or foreground alpha, never neutral gray; shadows have y-offset + soft blur, no zero-offset coloured glow (unless ambience route).

### F. Consistency and brand (9)
41. F1 One icon set, one stroke/weight/size matching adjacent text; no emoji icons.
42. F2 Spacing and radii from token scales; nested corners concentric.
43. F3 A shared component looks the same on every surface; fix verified on every sibling route/app.
44. F4 Owner brand elements present and untouched; nothing else carries branding.
45. F5 Selected/active = wash + glyph; focus = focus-visible ring on fields, row highlight in lists; no accent side-border marking state.
46. F6 Standard glyphs for standard actions in standard places.
47. F7 System shapes for windows/sheets/popovers; one at a time; popover arrow points at source; only alerts over popovers.
48. F8 Browser surfaces carry the palette both themes: selection, caret, scrollbars, focus ring, underline offset, tabular numerals; none browser-default (select text and focus a field in the capture).
49. F9 No generated scaffolds: kicker, icon tile over heading, hero metric without a decision, card-in-card, monospace costume (recorded brief/route exception passes).

### G. Motion and feedback (7)
50. G1 Every animation has a cause; no motion on non-interactive elements, no no-op hover, no permanent loop (ambience loops only in view, static frame under reduced motion).
51. G2 Transitions keep identity: old geometry to new, exit mirrors entry, nothing reflows under the pointer.
52. G3 Motion interruptible, never gates input; mid-animation input retargets without snapping.
53. G4 Under `prefers-reduced-motion`, positional/scale/depth motion becomes a cross-fade; fades/progress/gesture tracking stay; blur never animates.
54. G5 Press acknowledged same frame; spinner only past ~1s; progress even, no spinner-to-bar swap, no 90% front-load.
55. G6 No layout shift after load; first paint is the real screen, not a splash.
56. G7 No flashing/strobing; no ~0.2Hz oscillation on viewport-filling motion; motion never blocks reading.

### H. States (11)
57. H1 Every view has empty/loading/error/offline; empty offers the next action.
58. H2 Loading shows something at once; spinner only past ~1s with a short specific description; a stopped indicator fails.
59. H3 Failure reported next to the object with cause; success shown by changed state; toast only for outcomes not visible in place; no alert for routine/undoable actions or at launch.
60. H4 Alerts: title states the situation, message <= 2 short sentences, outcome-verb buttons, Cancel whenever destructive exists, destructive styled, alert never scrolls.
61. H5 Every control shows hover/pressed/focused/disabled; disabled dimmed but legible; toggle states differ by more than colour.
62. H6 Sheets/modals: one at a time; visible way out; grabber on resizable sheets; unsaved changes confirmed.
63. H7 Long operations cancellable when safe; a cancel with consequences warns first.
64. H8 Permission/consent in context, not at launch unless core; pre-prompt has one button and no dodge; purpose text says what data is for.
65. H9 Sign-in deferred until needed, benefit stated, method named ("Sign in with GitHub"); no licence text in onboarding; passwords masked, never pre-filled.
66. H10 Search: one location, scope visible, recents/suggestions.
67. H11 Settings: labels say what ON does; no duplicated system settings; (mac) window title names the pane.

### I. Keyboard and accessibility (5)
68. I1 Visible focus ring on every interactive element; focus order = reading order; focus never moves without user action; never lands on destructive/approve by default.
69. I2 Escape closes topmost modal/popover/menu; Enter triggers non-destructive default; standard shortcuts not overridden.
70. I3 Accessibility tree: inputs named, icon-only controls named + tooltip, meaningful images described, landmarks exist.
71. I4 Every gesture has a control alternative (swipe-dismiss also a close control; swipe actions also in a menu).
72. I5 Autoplaying media has pause/stop; no autoplay audio.

### J. Platform specifics (2)
73. J1 (mac) System chrome; toolbar actions also in menu bar; Cmd-, settings titled by pane; 1pt split dividers; sortable headers; hover-revealed controls follow hover intent.
74. J2 (phone) No popover in compact width (sheet instead); large title collapses on scroll; `inputmode` matches data.

### Evidence gates (14)
75. V1 Surface detected (web/TUI/paginated/reference-fidelity); both tracks when the change touches both.
76. V2 Complete enumeration of pages, routes, tabs, modals, states, scroll positions, and sibling surfaces sharing the change; page count recorded.
77. V3 Web matrix: 390 true mobile emulation (DPR 3, touch, overlay scrollbars) and 1440, plus 1920 for page layouts; each in light AND dark.
78. V4 Scrolled-to-end viewport shot for anything that scrolls (sticky bars prove themselves there).
79. V5 Motion frames: rest, ~100ms mid-transition, settled, for every interactive element and animated region; entrance/scroll sequences start/mid/end.
80. V6 Reduced-motion pass repeated, plus interruption at the mid frame.
81. V7 Captures are fresh (produced after the last edit); stale artifacts are invalid; only the `before` set is deliberately old.
82. V8 Capture hygiene: signature matches extension, frame fully composited, dimensions match viewport, page-only (no browser chrome or capture UI).
83. V9 Detect SDK ran first on every page with `reflow: true`; JSON kept beside captures and given to both reviewers; error/warning = FAIL on the matching item.
84. V10 Reference pairs captured at the same viewport/scroll/theme/state/density and diffed with `image-diff`; JSON fields kept (`dimensionsMatch`, `diffRatio`, `similarityScore`, `alphaChannelIntact`, `hotspots`).
85. V11 Two independent read-only reviewers (Pass A: G-J + system/function/content; Pass B: A-F + fidelity/before-after/CJK); no self-certified pass.
86. V12 Bounded budget: 2 rounds low-risk surface, 3 product surface; fresh reviewer per round; exhaustion with an open defect = NEEDS HUMAN REVIEW.
87. V13 Before/after mode when changing an existing UI: fixed cases captured before the first edit, identical after, side-by-side pairs plus diff, judged for improvement and lost required content.
88. V14 Verdict table: one row per item with PASS/FAIL/N/A, capture path#region, tagged `[product|evidence] [defect|taste]`; findings classified; "good, keep it" listed; completion gate stated.

## 4. remove-ai-slops: junk-test and AI-slop taxonomy

**Safety invariant**: behavior is locked by green regression tests before a line is removed. A checklist is not safety. Scope = branch diff vs `merge-base main` or an explicit file list; nothing outside scope is touched.

**Deletion ladder (run before categorising)**: delete entirely (YAGNI/speculative/dead) -> reuse existing repo code -> platform/stdlib/native/dependency -> simplify in place. Only the last proceeds to smell categories. Order: comments -> dead code -> defensive -> duplication -> complexity -> abstraction/boundary -> performance -> tests -> oversized modules.

**Ten slop categories and their tells**

| # | Category | Tell |
|---|---|---|
| 1 | Obvious comments | Restates code, trivial docstring, section divider, commented-out code, vague TODO/Note. Keep WHY, ticket links, regex/algorithm explanations, BDD markers. |
| 2 | Over-defensive code | Null checks for guaranteed values, try/except that cannot raise, isinstance on typed params, defaults for required params, compat shims, duplicated validation, broad `except Exception` / empty `catch` / log-only catch. Keep boundary validation and I/O handling; removal needs an adversarial test. |
| 3 | Excessive complexity | Nesting > 3, nested ternaries, 4+ predicate booleans, > 5 args without a struct, > 50-line god functions, clever one-liners, if/elif variant chains instead of match/case, `object` annotations. |
| 4 | Needless abstraction | Pass-through wrapper, single-use helper, speculative indirection, one-implementer interface with no testability win, factory that only constructs. |
| 5 | Boundary violations | Wrong-layer imports (UI -> DB driver), handler doing service logic, reading another module's private state, side effects in pure-named functions. |
| 6 | Dead code | Unused imports/private functions, unreachable branches, stale flags, debug leftovers (`console.log`, `print`, `dbg!`), removed-but-referenced code. |
| 7 | Duplication | Copy-pasted branches with trivial differences, redundant helpers, repeated literal/magic sequences. Keep incidental similarity that could diverge. |
| 8 | Performance equivalences | O(n^2)->O(n), loop-invariant hoisting, needless eager collections, string concat in loop, redundant DB/API calls, deep copies, recomputed length. Only when equivalence is obvious; no benchmark, no change. |
| 9 | Tests missing or junk | A changed behavior no test guards where the repo keeps such tests; or a test matching a junk class below without retention proof. |
| 10 | Oversized modules | Source file > 250 pure LOC (non-blank, non-comment). Split by responsibility, named for the concept; no `utils`/`helpers`/`part_N` dumps; `SIZE_OK` marker only with a reason. |

**Junk-test classes and tells** (marks: R retain, F fix weak assertion, C consolidate into keeper, D delete; only R/F/C/D, one per declaration)

| Class | Tell |
|---|---|
| Cannot fail | No assertion, `expect(x).toBe(x)`, expected value computed by the code under test, `assert result is not None` only, override fixture equal to fallback, assertion in a never-run callback. |
| Change certificate | Pins the diff (constant, string, rename, call, edit shape), not behavior. |
| Mock echo | Mock returns the value the test asserts; behavior lives in the mock. |
| Implementation mirror | Asserts call order/count, private helper args, private member access, internal state shape a refactor would break. |
| Prose pin | Asserts wording, headings, section order, snapshots, phrase counts, or length of docs/prompts/rules. |
| Copied inventory | Hard-coded export/file/tool/key list mirroring source; fails only when both sides change. |
| Source grep | Reads a source file and greps a string/import; an identifier-only refactor turns it red. |
| Duplicate contract | Same input/output asserted at two+ layers with no distinct transport/lifecycle risk; adapter copy of a core test. |
| Layer replay | Shared helper re-tested through every wrapper. |
| Seam keeper | Exists only to keep a test-only export/flag/getter/reset hook alive. |
| Fabricated postcondition | Fixture supplies the receipt/order/stored state the owner should produce; asserts a store nothing writes. |
| Capability restatement | Asserts a flag/capability is true instead of the delivery it promises. |
| Input transcript | Asserts argv/flags/URL/request handed to a child, not the resolved state. |
| Misnamed | Name promises behavior the inputs never exercise; mark by what the assertions check, never cut for the name. |
| Near-duplicate cases | N tests differing only in literals; consolidate into one table, every old assertion a row. |

**Retention bar (stays R)**: public API/SDK/RPC/protocol, config schema/default, migration, storage format, security boundary, platform behavior, prompt-byte or shipped-copy equality between real artifacts, generated/cross-language contract, package/install payload, release, architecture invariant, Node-compat suites, issue regressions, machine-consumed text, baseline-red tests (product bug, never deleted). Static or slow is never a reason to delete.

**Proof rule**: mutate the production owner and run candidate + named keeper on the unmodified test tree. Candidate green/keeper red = D proven; both red = D or C; candidate red/keeper green = R (or C into the keeper); both green = the mutation missed, pick another. Restore the owner byte for byte. A prose pin needs no mutation: assertion line + repo rule. Coverage diffs prove execution, not assertion.

**Quality gates**: regression tests green; lint zero errors; typecheck zero new errors; unit/integration green (pre-existing failures noted); static/security scan zero new findings or explicit N/A. Critical review: safety (no logic/error handling/type hints lost, imports valid, no API break), behavior (returns, side effects, exceptions, edges), quality (real slop, conventions, no orphans, equivalence obvious, no new abstractions).

## 5. Merged violation checklist for an editorial academic website (72 items)

Mark each PASS / FAIL / N/A with the capture or file:line that proves it.

**Ground, brief, system (1-10)**
1. `DESIGN.md` exists and was read, or the styled-sibling small-change rule is recorded.
2. Every colour, size, spacing, radius traces to a declared token; no undeclared hex or magic px.
3. Brief states exactly one primary action, priorities 1-3, and required content by name.
4. "Left out on purpose" list is recorded and none of it appears on the page.
5. `Layout:` line exists for every changed screen/region.
6. Gap ledger (if grounded) is closed row by row with before/after evidence.
7. Repeated components are documented in `DESIGN.md` section 5.
8. Depth mode (borders-only vs shadow vs tonal) is consistent with `DESIGN.md`.
9. Reference packet (if any) was extracted into tokens, not copied as pixels or logos.
10. Design decisions and accepted debt are recorded, not hidden in a summary.

**Colour and themes (11-20)**
11. Body text >= 4.5:1 in light and dark; large text/icons/edges >= 3:1.
12. Placeholder and disabled text meet contrast in both themes.
13. No mid-gray ink on a chromatic surface; secondary text is a hue shade or foreground alpha.
14. One or two accents per screen; accent is not used decoratively.
15. Status colour never stands alone; it pairs with a glyph, label, or shape.
16. No stock violet/cyan AI palette or paired neon inks.
17. No gradient-clipped text, coloured glow, radial halo, or floating spotlight wash.
18. Cream/beige ground (if used) is a declared editorial choice, not a default.
19. Selection, caret, scrollbar, focus ring, underline offset, tabular numerals are themed in both themes.
20. No zero-offset coloured shadow; shadows carry y-offset and soft blur.

**Typography (21-32)**
21. Adjacent heading steps differ >= 1.25x; body roles differ by weight/colour/case, not size alone.
22. Display heading <= 6rem; tracking >= -0.04em; body tracking 0 to 0.05em.
23. Body copy 65-75ch desktop, >= 45ch at 390; no line > 80 characters.
24. Body >= 16px (>= 14px minimum), functional labels >= 11px, small print >= 10px.
25. Line-height 1.5-1.7 for body; no reading copy below 1.3.
26. No justified narrow columns without hyphenation.
27. No all-caps running prose; uppercase reserved for headings and short labels.
28. At most two typefaces; display/body roles are deliberate and documented.
29. No italic-serif hero unless the editorial route explicitly chose it.
30. Heading hierarchy is sequential (no skipped levels); styled independently of rank.
31. No heading wraps to four lines; no orphan straggler line (or `text-wrap: pretty/balance`).
32. Citation strings, italics, superscripts, and footnote markers never clip or break mid-string.

**Layout and spacing (33-44)**
33. Above-heading space >= 1.5x below; group gap >= 2x inner gap.
34. One scroll owner per region; no nested same-direction scrolling.
35. Sticky header/nav stays legible over all scrolled content.
36. No horizontal scroll of primary content at 320/390; wide tables scroll inside their own region.
37. Nothing clips or overlaps at 1440/1920, with empty, long-label, or unbroken-string content.
38. Body text keeps >= 12px gutter at 390 and >= 16px wider.
39. Cards never touch or cross a clipping edge asymmetrically.
40. Text is inset >= 8px from any visible container boundary.
41. Opening columns are balanced; one column does not run far past the fold alone.
42. No nested cards; inner groups use space or a neutral 1px rule.
43. No content hidden at rest awaiting a reveal script; first paint is the real content.
44. Long-form pages show a continuation cue and a working in-page navigation or table of contents.

**Decoration and anti-slop surfaces (45-56)**
45. No coloured left/right/top accent stripe on cards, callouts, rows, or blockquotes (neutral rule allowed).
46. No 2px+ accent outline or inset ring on rounded cards; state uses ink-alpha wash + glyph.
47. No kicker/eyebrow label above headings; no hero pill chip.
48. No icon tile stacked over a heading in a same-size card grid.
49. No hero metric without a decision behind it; no vanity stat tiles.
50. No card-in-card; no monospace used as a "technical" costume.
51. No decorative grid-line background, repeating stripes, organic clip-path, or shape-assembled hero illustration.
52. No auto-scrolling marquee, pulsing status dot, blinking fake caret, or bounce/elastic easing.
53. No glass/blur/neumorphism/mesh-gradient/heavy-shadow surface unless the brief or reference supplies it.
54. No hard offset shadow unless neobrutalism is the chosen direction.
55. No raster buried under a wash; images are visible and purposeful.
56. No emoji as icon; one icon set with consistent stroke/weight/size.

**Copy and content (57-64)**
57. No marketing buzzwords ("seamlessly", "effortlessly", "powerful", "한눈에", "손쉽게", "스마트한").
58. No aphoristic three-beat rebuttal cadence across sections; sentence structure varies.
59. Em-dash density < 1 per 500 characters and < 8 total in prose.
60. No tiny decorative section numbers; any numbering is part of the heading.
61. No repeated status string in 3+ slots of one card; one fact, one place.
62. No subtitle under every heading; a subtitle exists only where the heading would be misread.
63. No invented proof: no fabricated testimonials, logos, ratings, user counts, or prices.
64. Academic copy is accurate: author names, years, titles, affiliations, and citation formats match the source.

**States, interaction, accessibility (65-72)**
65. Empty, loading, error, offline states exist where the surface has data; empty offers a next action.
66. Every control has hover/pressed/focus-visible/disabled; width and height are stable across states.
67. Focus ring visible on every interactive element and never covered by a sticky bar; focus order = reading order.
68. Escape closes the topmost overlay; Enter triggers the non-destructive default.
69. Touch targets >= 44x44 px (pointer >= 24x24), 8-12 px apart.
70. Motion has a cause, is interruptible, uses transform/opacity/filter, and cross-fades under reduced motion.
71. Icon-only controls have an accessible name and tooltip; images have meaningful alt text; landmarks exist.
72. Detect SDK, draft-guard lint, and the two independent visual-QA passes are clean on a fresh capture set at 390/1440/1920 in light and dark, with the verdict table and evidence paths recorded.

---
Counts: 63 unique detect rule IDs (79 declarations: 63 page + 16 source); 88 visual-QA checklist items (74 A-J + 14 evidence gates); 72 merged violations.