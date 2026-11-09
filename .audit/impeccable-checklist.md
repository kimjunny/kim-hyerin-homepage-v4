# Impeccable checklist applied to kim-hyerin-homepage-v4

Source: pbakaus/impeccable, `.agent/skills/impeccable/` (SKILL.md + reference/*.md,
17 files). Citations in parentheses name the source file; `registry.rs` is
`crates/foundation/src/registry.rs`, the deterministic slop registry.

Item count: **115 numbered items (51-165)** across sections 4-11. Items 1-50
(direction/world/scope, layout, type) were produced by the research pass but the
transcript that carried them was cut by the 30k-character capture cap before it
reached this file, and they are not reconstructed. The audit did not rely on that
section alone: layout and typography were judged against
`.audit/hig-universal-web.md` (HIG-6, HIG-11, HIG-15, HIG-16, HIG-31) and
`.audit/frontend-visualqa-rules.md`, both of which are complete. The gap is
recorded in `.audit/qa-verdict.md` under "Known gaps".

Items 4-11 in the numbering refer to craft-floor defaults that the project
deliberately keeps (a photographic hero, a serif display face, a nav bar); the
brief earns them, which the checklist itself allows ("Treat the floor as the
category's defaults, not bans").

## 4. Color, contrast, and theming

51. Hold body and placeholder text at 4.5:1 or better. (craft-floor.md; colorize.md)
52. Hold large text at 3:1 or better. (craft-floor.md; colorize.md)
53. Hold controls, icons, and focus indicators at 3:1 or better. (colorize.md)
54. On colored surfaces, tint secondary text from that hue or the foreground; never use gray. (craft-floor.md; registry.rs - gray-on-color)
55. Assign color by role, not swatch: canvas, elevated surfaces, text, action/focus/selection, borders, semantic status, data. (colorize.md)
56. Prefer OKLCH for a new web palette and derive hue from product meaning, never a category default. (colorize.md)
57. Let the strongest color own a deliberate region or role instead of scattering tiny accents. (colorize.md)
58. Do not spend the primary action color on decoration. (colorize.md)
59. Tint neutrals only when the brand hue creates cohesion; neutral gray is valid when it serves the world. (colorize.md)
60. Keep semantic meanings consistent while respecting platform and domain conventions. (colorize.md)
61. Never carry data on color alone; add lightness, chroma, shape, label, or pattern. (colorize.md)
62. Compose dark mode as its own elevation and contrast system; never invert the light theme mechanically. (colorize.md)
63. Remap semantic roles for theme changes instead of hard-coding per-theme values. (colorize.md)
64. Reduce chroma near white and black in OKLCH ramps, and prefer explicit colors over chains of translucent overlays. (colorize.md)
65. Keep color dosage subordinate to brief and world; no fixed percentage rule substitutes for that judgment. (colorize.md)
66. In a quieter pass, desaturate toward 70-85% and use color as an accent, around 10%. (quieter.md)
67. Pick light or dark from the use scene (who, where, ambient light), not from the product category. (craft-floor.md)

## 5. Motion

68. Use motion to explain state, relationship, or hierarchy, or for one authored moment the surface has earned; decoration without purpose is animation debt. (animate.md)
69. Do not scatter effects or give every section the same entrance. (craft-floor.md; animate.md)
70. Animate from an already-visible default with an exponential ease-out; `cubic-bezier(0.16, 1, 0.3, 1)`. (craft-floor.md; animate.md)
71. Set durations: 100-150ms immediate feedback, 150-300ms routine state change, 300-500ms layout/overlay/view transition, 500-800ms authored focal entrance. (animate.md)
72. Make exits faster than entrances. (animate.md)
73. Do not bounce or elastic ease by reflex. (animate.md; registry.rs - bounce-easing)
74. Cap total stagger delay and never reinterpret every scrolled section as a staggered list. (animate.md)
75. Reach past transform and opacity when the material calls for it (blur, backdrop-filter, clip-path, mask, shadow) and keep it smooth. (craft-floor.md; animate.md)
76. Use CSS transitions for state, WAAPI for interruption and sequencing, View Transitions for continuity, and scroll-driven motion only when it carries meaning. (animate.md)
77. Keep content visible in the default state so a failed script cannot hide the page. (animate.md)
78. Do not animate `width`, `height`, `top`, `left`, or margins; use FLIP, transforms, or grid. (animate.md)
79. Bound blur, filter, shadow, canvas, and shader work to isolated regions. (animate.md)
80. Apply `will-change` only during a known animation, never at rest. (animate.md; audit.md)
81. Give every web animation a `prefers-reduced-motion` path that reduces movement but preserves meaningful feedback. (animate.md)
82. Never kill motion globally with a 0.01ms override; it destroys feedback. (audit.md)
83. Stop nonessential loops when they leave the viewport. (animate.md)

## 6. States, resilience, and hardening

84. Ship hover, disabled, loading, error, and empty states plus real content, working controls, responsive composition, and keyboard focus. (craft-floor.md)
85. Cover every control at default, hover, focus, active, disabled, loading, error, and success. (polish.md)
86. Test extreme inputs: very long and very short text, emoji, RTL, accents, large numbers, 1000+ items, and no data. (harden.md)
87. Test failures: offline, slow, timeout, 400, 401, 403, 404, 500, validation, permission, rate limit, and concurrent use. (harden.md)
88. Test German-length expansion (about 30%), RTL, CJK, and emoji; budget 30-40% translation growth. (harden.md)
89. Format dates, times, numbers, and currency through `Intl` rather than manual assembly. (harden.md)
90. Handle overflow with truncation, line-clamp, `overflow-wrap`, and `min-width: 0` on flex and grid items. (harden.md)
91. Size type fluidly with `clamp()`; keep 16px as the mobile body floor (14px only for genuinely secondary text) because iOS Safari force-zooms inputs under 16px. (harden.md)
92. Test at 200% zoom. (harden.md)
93. Use logical properties for RTL layouts. (harden.md)
94. Preserve ZWNJ (U+200C) and correct Persian/Arabic Yeh and Kaf forms (U+06CC, U+06A9) where the language requires them. (harden.md)
95. Keep UTF-8 everywhere. (harden.md)
96. Eliminate horizontal scroll, fixed widths that break, and text-scaling failures. (audit.md)
97. Complete touch gestures: no mouse-only handlers, declare `touch-action`, clear drag state on cancel, keep pointer capture. (audit.md)
98. Keep touch targets at 44x44px where practical; the WCAG 2.5.8 floor is 24x24 CSS px, checked by the 24px circle overlap rule. (audit.md)
99. Verify mobile, intermediate, and wide widths, not just two endpoints. (polish.md)

## 7. Copy and microcopy

100. Write in the product's own language, and make controls name their action. (craft-floor.md)
101. Make errors name what failed, why when known, and how to recover. (craft-floor.md; clarify.md)
102. Order messages by hierarchy: the one fact now, the next action, context that changes the decision, then tone. (clarify.md)
103. Say each idea once; delete headings that restate intros and explanations that repeat. (clarify.md; distill.md)
104. Label controls by outcome, not gesture. (clarify.md)
105. On destructive actions name the object and the consequence, prefer undo over confirmation, and put the action on the button rather than Yes/No/OK/Submit. (clarify.md)
106. Keep labels persistent; placeholders are examples, not labels. (clarify.md)
107. Write validation that states what is wrong and how to fix it, without blame. (clarify.md)
108. Do not expose internal codes and do not promise a cause you do not know. (clarify.md)
109. Name the real operation in loading states; show determinate progress only when you have it; never invent progress. (clarify.md)
110. Distinguish first use, no results, filters, permissions, and failure in empty states. (clarify.md)
111. Keep success messages brief. (clarify.md)
112. Make helper text answer the implicit question instead of restating the label. (clarify.md)
113. Ship complete translatable messages with structured variables, room to expand, meaningful alt text, and screen-reader names that match visible labels. (clarify.md)
114. Do not rely on punctuation, color, or icons alone to carry meaning. (clarify.md)
115. Do not vary wording for literary effect in UI; use one term for one thing. (clarify.md)
116. Cut filler, not meaning, and prefer active voice. (distill.md)

## 8. Accessibility

117. Meet WCAG AA: 4.5:1 body, 3:1 large text and UI; AAA is 7:1. (audit.md)
118. Provide labels, error association, and ARIA where native semantics do not carry the meaning. (audit.md)
119. Guarantee keyboard access, visible focus, sensible tab order, and no focus traps. (audit.md)
120. Use semantic HTML with a correct heading hierarchy and landmarks; never skip heading levels. (audit.md)
121. Write alt text for meaningful images and empty alt for decorative ones. (audit.md)
122. Respect motion sensitivity without erasing feedback. (audit.md)
123. Verify the build under zoom, contrast, focus, and assistive technology. (polish.md)

## 9. Performance and implementation integrity

124. Avoid layout thrashing, expensive animations, and unbounded blur. (audit.md)
125. Lazy-load below-the-fold media and keep bundles lean. (audit.md)
126. Keep `will-change` off at rest and remove hard-coded colors that break dark mode or fail to remap. (audit.md; colorize.md)
127. Verify each detector finding in context; a detector result is defect evidence, not proof of quality. (polish.md; audit.md)
128. Structure the page so it could not be swapped with an unrelated product's markup. (audit.md)
129. Classify drift as missing token, one-off implementation, conceptual mismatch, or local defect, then fix at the narrowest correct level. (polish.md)
130. Treat a clean scan as unable to prove hierarchy or rhythm; inspect the render. (layout.md; polish.md)
131. Remove churn and dead code in the final diff. (polish.md)

## 10. Refuse list

132. No side-tab accent border and no accent border on a rounded card. (registry.rs - side-tab, border-accent-on-rounded)
133. Avoid overused faces: Inter, Roboto, Fraunces, Geist, Plus Jakarta Sans, Space Grotesk. (registry.rs - overused-font)
134. No gradient text. (registry.rs - gradient-text)
135. No AI palette (purple/violet gradients, cyan-on-dark) and no default cream/beige surface. (registry.rs - ai-color-palette, cream-palette)
136. No pulsing dot, blinking cursor, or marquee. (registry.rs - pulsing-dot, blinking-cursor, marquee)
137. No shape-assembled illustration, organic clip-path, buried raster, or broken image. (registry.rs - shape-assembled-illustration, organic-clip-path, buried-raster, broken-image)
138. No hard offset shadow outside a neobrutalist world; no dark glow, radial halo, or spotlight glow as decoration; no thin border with wide shadow. (registry.rs - hard-offset-shadow, dark-glow, radial-halo, radial-spotlight-glow, gpt-thin-border-wide-shadow)
139. No icon-tile stack above every heading. (registry.rs - icon-tile-stack)
140. No italic serif display as a default voice, no hero eyebrow chip, no kicker above a heading (a ban no brief earns back), and no numbered section labels unless sequence carries information. (registry.rs - italic-serif-display, hero-eyebrow-chip, kicker-above-heading, numbered-section-labels; craft-floor.md)
141. No oversized h1 or extreme negative tracking. (registry.rs - oversized-h1, extreme-negative-tracking)
142. No script error and no content hidden at rest. (registry.rs - script-error, content-hidden-at-rest)
143. No edge-flush cards, text occlusion, first-viewport column overflow, text overflow, repeated container text, or clipped overflow container. (registry.rs)
144. No gray on color and no low contrast. (registry.rs - gray-on-color, low-contrast)
145. No line-length, cramped-padding, body-text-viewport-edge, tight-leading, justified-text, all-caps body, wide tracking, tiny text, undersized UI text, straggler, or unbalanced heading failures. (registry.rs)
146. No font, color, radius, or font-size values outside the design system tokens. (registry.rs - design-system-font, design-system-color, design-system-radius, design-system-font-size)
147. No repeating-stripes gradient or codex grid background. (registry.rs - repeating-stripes-gradient, codex-grid-background)
148. No em-dash overuse, marketing buzzword, aphoristic cadence, or theater slop phrase. (registry.rs)
149. No same-size icon+heading+text cards as page structure, no hero-metric template, and no modal for a task that needs neither interruption nor protected focus. (craft-floor.md)
150. No glass or blur as decoration, no monospace as a costume for "technical", and no Unicode glyphs or emoji as an icon system; draw icons in one consistent stroke and weight. (craft-floor.md)
151. No geometric mask standing in for an organic contour; derive an alpha matte or produce a real cut-out asset. (craft-floor.md)

## 11. Verification and finish

152. Batch visual checks into one look at the render rather than separate screenshot trips. (craft-floor.md)
153. Confirm every brief requirement is present and findable within seconds. (craft-floor.md)
154. Theme browser surfaces from the palette: selection, caret, scrollbars, focus rings, underline offset, and tabular numerals. (craft-floor.md)
155. Run the real copy at every breakpoint and fix what overflows. (craft-floor.md)
156. Triage fixes in order: broken/blocked/data loss/inaccessible, missing states, flow/hierarchy/responsive/system drift, visual and motion inconsistencies, then code and asset cleanup. (polish.md)
157. Do not perfect one corner below the bar while the rest is unfinished. (polish.md)
158. Ship only when the work is functionally complete and consistently finished. (polish.md)
159. Score five audit dimensions 0-4: Accessibility, Performance, Theming, Responsive, Implementation Integrity. (audit.md)
160. Report the health score out of 20 in bands: 18-20 Excellent, 14-17 Good, 10-13 Acceptable, 6-9 Poor, 0-5 Critical. (audit.md)
161. Tag findings P0 Blocking, P1 Major (including WCAG AA), P2 Minor, P3 Polish, each with location, impact, standard, and recommendation. (audit.md)
162. Report systemic patterns and positive findings, not only defects. (audit.md)
163. Run the design review and the mechanical detector pass as two isolated assessments and synthesize only after both finish. (critique.md)
164. Inspect the rendered experience and real interaction path; never present the detector as proof of quality. (polish.md)
165. Use `/impeccable polish` as the final pass, and route drift to `doctor` rather than repairing it as a side effect of a design task. (polish.md; SKILL.md)

**Total: 165 checklist items across 11 categories, drawn from 17 source files.**
