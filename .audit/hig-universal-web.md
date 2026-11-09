# Universal Web Interface Guidelines for an Academic Lab Site

**Scope.** All 173 cached HIG pages were triaged by title, URL, and content. The 34 pages that encode transferable principles about human perception and information use are cited below. Platform-specific material was discarded: SF Symbols, Dynamic Island, Apple Watch, visionOS, CarPlay, SharePlay, App Store, in-app purchase, system colors, and device-specific gesture vocabularies. Every rule is rewritten for the web and is checkable from a screenshot or the DOM.

## Persona: the interrupted, skeptical scanner

The universal visitor is not a reader but a scanner with a goal and a timer. They arrive from a search result, a citation, a conference badge, or a colleague's link, often mid-task and ready to leave. The HIG's model of attention assumes people understand notifications at a glance, abandon flows that demand commitment too early, and need feedback that confirms where they are. They may be a prospective student, a peer reviewer, a journalist, a funder, or a collaborator. They may use a screen reader, a keyboard, 200% zoom, reduced motion, or a slow connection. They are distracted, interruptible, and quick to judge credibility.

In the first five seconds they need: whose lab this is and where it sits; what the lab studies in plain language; proof the work is real; a visible way to go deeper; and a reason to trust the page. If any is missing, they leave.

## 1. Information hierarchy

1. **Lead with identity.** Lab name, institution, and research focus are visible without scrolling.
   Check: H1 and a one-sentence deck sit above the fold at 1280x800. Source: https://developer.apple.com/design/human-interface-guidelines/design-principles
2. **Give each page one primary message.** A visitor can state the page's purpose after one glance.
   Check: one dominant H1 and one primary call to action per page. Source: https://developer.apple.com/design/human-interface-guidelines/design-principles
3. **Answer visitor questions in order.** Pages move from who, to what, to proof, to contact.
   Check: section order matches that sequence on home, research, and profile. Source: https://developer.apple.com/design/human-interface-guidelines/writing
4. **Use progressive disclosure.** Summaries lead to detail instead of dumping everything above the fold.
   Check: each major section has a short summary and a link to a fuller page. Source: https://developer.apple.com/design/human-interface-guidelines/layout-and-organization
5. **Make importance visible.** The most important element is the largest and heaviest.
   Check: H1 > H2 > body in both font size and weight. Source: https://developer.apple.com/design/human-interface-guidelines/typography
6. **Group related content.** Related items share a heading, container, and spacing rhythm.
   Check: every content block has a heading and consistent internal spacing. Source: https://developer.apple.com/design/human-interface-guidelines/layout
7. **Keep the first screen free of blockers.** Nothing covers the lab's identity on arrival.
   Check: no modal, cookie wall, autoplay video, or promo overlay obscures the H1. Source: https://developer.apple.com/design/human-interface-guidelines/modality

## 2. Layout and adaptation

8. **Use a stable grid.** Columns and gutters stay aligned across pages.
   Check: left edges align at 1280, 768, and 375 px widths. Source: https://developer.apple.com/design/human-interface-guidelines/layout
9. **Respect page margins.** Content never touches the viewport edge.
   Check: at least 24 px side padding at 375 px width. Source: https://developer.apple.com/design/human-interface-guidelines/layout
10. **Reflow instead of scrolling sideways.** Narrow screens stack content.
    Check: no horizontal scrollbar from 320 to 1280 px. Source: https://developer.apple.com/design/human-interface-guidelines/accessibility
11. **Keep line length readable.** Body text stays in a comfortable measure.
    Check: body lines are roughly 45-75 characters at desktop width. Source: https://developer.apple.com/design/human-interface-guidelines/typography
12. **Size interactive targets for touch.** Buttons and links are easy to hit.
    Check: all controls are at least 44x44 CSS px. Source: https://developer.apple.com/design/human-interface-guidelines/accessibility
13. **Keep navigation reachable.** Primary navigation is visible or one action away.
    Check: nav is in the header on desktop and behind one clearly labeled control on mobile. Source: https://developer.apple.com/design/human-interface-guidelines/navigation-and-search
14. **Let content breathe.** Sections are separated by clear space.
    Check: vertical gap between sections is at least 1.5x body line height. Source: https://developer.apple.com/design/human-interface-guidelines/layout

## 3. Typography and legibility

15. **Use a legible base size.** Body text is comfortable at default zoom.
    Check: computed body font size is at least 16 px. Source: https://developer.apple.com/design/human-interface-guidelines/typography
16. **Limit typefaces.** One or two families carry the whole site.
    Check: at most two font families load across all pages. Source: https://developer.apple.com/design/human-interface-guidelines/typography
17. **Build hierarchy with size and weight.** Headings do not rely on color alone.
    Check: heading levels differ in size or weight, not only hue. Source: https://developer.apple.com/design/human-interface-guidelines/typography
18. **Avoid all-caps and thin body text.** Long text stays easy to read.
    Check: no all-caps paragraphs; no 300-weight text below 18 px. Source: https://developer.apple.com/design/human-interface-guidelines/typography
19. **Set comfortable line height.** Lines do not collide or drift apart.
    Check: body line-height is between 1.4 and 1.6. Source: https://developer.apple.com/design/human-interface-guidelines/typography
20. **Left-align body text.** Paragraphs have a consistent starting edge.
    Check: body text is left-aligned, not justified, in LTR pages. Source: https://developer.apple.com/design/human-interface-guidelines/right-to-left
21. **Support text resizing.** Enlarged text remains usable.
    Check: at 200% zoom, text does not clip, overlap, or hide controls. Source: https://developer.apple.com/design/human-interface-guidelines/accessibility

## 4. Color and contrast

22. **Meet text contrast.** Text is readable against its background.
    Check: body text at least 4.5:1; large or bold text at least 3:1. Source: https://developer.apple.com/design/human-interface-guidelines/accessibility
23. **Meet non-text contrast.** Borders, icons, and focus rings are distinguishable.
    Check: essential UI boundaries and icons reach at least 3:1. Source: https://developer.apple.com/design/human-interface-guidelines/color
24. **Never use color alone.** Meaning survives grayscale and color-vision deficiency.
    Check: links are underlined or otherwise marked; statuses include text or icons. Source: https://developer.apple.com/design/human-interface-guidelines/color
25. **Keep the palette restrained.** One accent color marks action and emphasis.
    Check: no more than one accent hue plus neutrals on a page. Source: https://developer.apple.com/design/human-interface-guidelines/color
26. **Test dark mode.** The site remains legible when the OS prefers dark.
    Check: no hard-coded white backgrounds or black text in dark mode. Source: https://developer.apple.com/design/human-interface-guidelines/dark-mode
27. **Do not let brand color carry meaning.** Semantic states have labels.
    Check: success, warning, and error states include words or icons. Source: https://developer.apple.com/design/human-interface-guidelines/branding

## 5. Content and writing

28. **Write plain, specific sentences.** A smart non-specialist can follow the intro.
    Check: average sentence length is at most 25 words; jargon is defined once. Source: https://developer.apple.com/design/human-interface-guidelines/writing
29. **Front-load the point.** Each section states its takeaway first.
    Check: the first sentence of every section is a complete claim, not throat-clearing. Source: https://developer.apple.com/design/human-interface-guidelines/writing
30. **Use consistent terminology.** The same concept keeps the same name.
    Check: one term per concept across nav, headings, and body. Source: https://developer.apple.com/design/human-interface-guidelines/inclusion
31. **Use sentence case.** Headings and buttons read as sentences.
    Check: no Title Case or ALL CAPS in navigation and buttons. Source: https://developer.apple.com/design/human-interface-guidelines/labels
32. **Write descriptive links.** Link text explains the destination.
    Check: no "click here" or bare "read more" links. Source: https://developer.apple.com/design/human-interface-guidelines/writing
33. **State dates and versions.** Time-sensitive content is anchored in time.
    Check: publications show a year; news and resources show a last-updated date. Source: https://developer.apple.com/design/human-interface-guidelines/writing
34. **Avoid hype and unverifiable claims.** Claims are specific and evidenced.
    Check: no "world-leading" or "revolutionary" without a cited result. Source: https://developer.apple.com/design/human-interface-guidelines/inclusion

## 6. Navigation and wayfinding

35. **Keep top-level navigation small.** Visitors can scan every choice at once.
    Check: five to seven top-level items in a stable order. Source: https://developer.apple.com/design/human-interface-guidelines/tab-bars
36. **Show current location.** The visitor always knows which page they are on.
    Check: active nav state plus breadcrumb on detail pages. Source: https://developer.apple.com/design/human-interface-guidelines/navigation-and-search
37. **Make search findable.** Search is visible or one click away.
    Check: a labeled search field exists in the header or a labeled search control. Source: https://developer.apple.com/design/human-interface-guidelines/searching
38. **Give search feedback.** Results explain what was searched and what was found.
    Check: query is echoed, result count is shown, and an empty state offers guidance. Source: https://developer.apple.com/design/human-interface-guidelines/search-fields
39. **Make the logo link home.** The standard escape route works.
    Check: the header logo links to the site root. Source: https://developer.apple.com/design/human-interface-guidelines/navigation-and-search
40. **Keep the footer complete.** Key destinations are repeated at the end.
    Check: footer includes main pages, contact, affiliation, and last-updated date. Source: https://developer.apple.com/design/human-interface-guidelines/navigation-and-search
41. **Use unique page titles.** Browser tabs and bookmarks identify each page.
    Check: every page has a distinct, descriptive `<title>`. Source: https://developer.apple.com/design/human-interface-guidelines/writing

## 7. Feedback and state

42. **Acknowledge every action.** Interactive elements respond visually.
    Check: links and buttons have distinct hover, focus, and active states. Source: https://developer.apple.com/design/human-interface-guidelines/feedback
43. **Show focus visibly.** Keyboard users can see where they are.
    Check: tabbing produces a visible focus ring of at least 3:1 contrast. Source: https://developer.apple.com/design/human-interface-guidelines/focus-and-selection
44. **Confirm success after forms.** The visitor knows the message was sent.
    Check: a success message names the action and the next step. Source: https://developer.apple.com/design/human-interface-guidelines/alerts
45. **Put errors next to the field.** Correction does not require hunting.
    Check: inline error text is adjacent and programmatically associated with its input. Source: https://developer.apple.com/design/human-interface-guidelines/text-fields
46. **Reserve alerts for important events.** Routine information does not interrupt.
    Check: no modal dialog for noncritical notices or marketing. Source: https://developer.apple.com/design/human-interface-guidelines/alerts
47. **Keep status visible long enough.** Feedback is readable before it disappears.
    Check: transient messages last at least five seconds or require dismissal. Source: https://developer.apple.com/design/human-interface-guidelines/feedback

## 8. Loading and latency

48. **Render useful content first.** Text appears before heavy media.
    Check: HTML text and headings render before hero video or large images. Source: https://developer.apple.com/design/human-interface-guidelines/loading
49. **Use skeletons for known layouts.** Loading preserves the shape of the page.
    Check: slow-network view shows placeholders matching final blocks, not a blank spinner. Source: https://developer.apple.com/design/human-interface-guidelines/loading
50. **Show progress for real waits.** Operations longer than a moment explain themselves.
    Check: waits over two seconds show a labeled determinate or indeterminate indicator. Source: https://developer.apple.com/design/human-interface-guidelines/progress-indicators
51. **Avoid layout shift.** Content does not jump when assets arrive.
    Check: images and embeds reserve width and height; no visible reflow on load. Source: https://developer.apple.com/design/human-interface-guidelines/images
52. **Fail gracefully on slow networks.** The page remains useful with images blocked.
    Check: core text, nav, and contact are readable with images disabled. Source: https://developer.apple.com/design/human-interface-guidelines/loading

## 9. Accessibility and inclusivity

53. **Provide a skip link.** Keyboard users bypass repeated navigation.
    Check: first Tab reveals a "Skip to content" link that moves focus to main. Source: https://developer.apple.com/design/human-interface-guidelines/accessibility
54. **Use semantic landmarks and headings.** Assistive technology can outline the page.
    Check: header, nav, main, footer exist; one H1; no skipped heading levels. Source: https://developer.apple.com/design/human-interface-guidelines/voiceover
55. **Write alt text for meaningful images.** Nonvisual visitors get the same information.
    Check: informative images have descriptive alt; decorative images use alt="". Source: https://developer.apple.com/design/human-interface-guidelines/images
56. **Caption and transcribe media.** Audio and video have text alternatives.
    Check: videos have captions; audio has a transcript. Source: https://developer.apple.com/design/human-interface-guidelines/accessibility
57. **Support keyboard-only use.** Every function works without a pointer.
    Check: all controls are reachable and operable with Tab, Enter, Space, and Esc. Source: https://developer.apple.com/design/human-interface-guidelines/focus-and-selection
58. **Respect reduced motion.** Nonessential animation stops when requested.
    Check: `prefers-reduced-motion` disables parallax, autoplay, and decorative transitions. Source: https://developer.apple.com/design/human-interface-guidelines/motion
59. **Use inclusive language and imagery.** Content does not assume a single identity.
    Check: no generic "he"; people are described by role, not stereotype; imagery is varied. Source: https://developer.apple.com/design/human-interface-guidelines/inclusion

## 10. Trust, privacy and credibility

60. **Identify the people and institution.** The lab is attributable.
    Check: PI name, role, department, and institution appear on home and profile. Source: https://developer.apple.com/design/human-interface-guidelines/design-principles
61. **Show evidence of work.** Claims connect to outputs.
    Check: publications list venue, year, authors, and a DOI or stable link. Source: https://developer.apple.com/design/human-interface-guidelines/writing
62. **Explain data practices plainly.** Visitors know what is collected and why.
    Check: a privacy note near forms and analytics states purpose and scope. Source: https://developer.apple.com/design/human-interface-guidelines/privacy
63. **Ask only for necessary data.** Public content needs no account.
    Check: contact forms request the minimum; no sign-in wall for public pages. Source: https://developer.apple.com/design/human-interface-guidelines/managing-accounts
64. **Keep contact routes visible.** A visitor can reach a human.
    Check: email, lab location, and affiliation appear in the footer and contact page. Source: https://developer.apple.com/design/human-interface-guidelines/offering-help
65. **Date and attribute content.** Readers can judge freshness and ownership.
    Check: news and resources show a date; quoted material names its source. Source: https://developer.apple.com/design/human-interface-guidelines/writing

## 11. Motion and animation

66. **Animate with purpose.** Motion explains a change or relationship.
    Check: every animation has a stated function; no decorative loops. Source: https://developer.apple.com/design/human-interface-guidelines/motion
67. **Keep motion brief.** Animation does not delay comprehension.
    Check: no transition blocks reading for more than about 400 ms. Source: https://developer.apple.com/design/human-interface-guidelines/motion
68. **Avoid autoplay and parallax.** The page does not move without consent.
    Check: no auto-playing video with sound; no scroll-jacking or parallax. Source: https://developer.apple.com/design/human-interface-guidelines/accessibility
69. **Keep content independent of animation.** Information survives if motion fails.
    Check: all text and links are present with CSS animations disabled. Source: https://developer.apple.com/design/human-interface-guidelines/loading
70. **Give control over moving content.** Users can pause or stop it.
    Check: any motion lasting over five seconds has a visible pause control. Source: https://developer.apple.com/design/human-interface-guidelines/accessibility

## 12. Error prevention and recovery

71. **Prevent errors with constraints.** Inputs guide valid entry.
    Check: correct input types, visible format hints, and required-field markers. Source: https://developer.apple.com/design/human-interface-guidelines/entering-data
72. **Confirm destructive actions.** Irreversible actions state their consequence.
    Check: delete or reset asks for confirmation and names what will be lost. Source: https://developer.apple.com/design/human-interface-guidelines/undo-and-redo
73. **Preserve user input on error.** A failed submission does not erase work.
    Check: form values remain populated after validation fails. Source: https://developer.apple.com/design/human-interface-guidelines/text-fields
74. **Offer a way back from errors.** Error pages are not dead ends.
    Check: 404 and failure pages link to home, search, and contact. Source: https://developer.apple.com/design/human-interface-guidelines/navigation-and-search
75. **Make recovery reversible.** Users can undo or cancel a mistake.
    Check: multi-step actions provide cancel or undo, and undo confirms its result. Source: https://developer.apple.com/design/human-interface-guidelines/undo-and-redo

## What an ideal academic lab site looks like

1. The home page passes the five-second test: lab name, institution, research focus, selected publications, and contact are all visible or one scroll away (rules 1-3, 60).
2. A persistent header carries five to seven top-level pages, a visible active state, and a findable search field (rules 35-37).
3. The profile page names the PI, states role and affiliation, and gives a direct contact route (rules 60, 64).
4. Research is organized into three to five plain-language themes, each with a summary, a figure, and a link to outputs (rules 4, 28-29).
5. Publications are reverse-chronological and show authors, venue, year, and DOI or stable link (rules 33, 61).
6. Education and resources pages state audience, prerequisites, licensing, and citation guidance (rules 28, 33, 63).
7. Every page ends with contact, affiliation, and a last-updated date (rules 40, 65).
8. Body text is at least 16 px, left-aligned, and readable at 200% zoom (rules 15, 20-21).
9. Text contrast is at least 4.5:1 and no meaning depends on color alone (rules 22, 24).
10. The site works keyboard-only, with visible focus, a skip link, and semantic landmarks (rules 43, 53-54, 57).
11. Images carry meaningful alt text; video has captions; audio has transcripts (rules 55-56).
12. Motion is brief and purposeful, and respects `prefers-reduced-motion` (rules 58, 66-68).
13. Slow connections still get readable text, stable layout, and visible progress (rules 48-52).
14. Forms ask only for necessary data, explain privacy, validate inline, and preserve input (rules 45, 62-63, 71-73).
15. Claims are specific and evidenced, with no hype and no dead-end errors (rules 34, 61, 74-75).

Count: 75 numbered rules, 75 HIG source URLs, 15 ideal-site properties; target path C:/Users/yejun/Desktop/github/kim-hyerin-homepage-v4/.audit/hig-universal-web.md.