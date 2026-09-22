/* Dramatic scroll motion for 시안 3, built on anime.js v4.
 *
 * Still bound by the StyleGallery scroll-driven story contract:
 * - the pinned stage is scrubbed by scroll POSITION (anime's onScroll sync),
 *   so reversing and entering mid-track are well defined;
 * - prefers-reduced-motion takes the static path: no pinning, no scrubbing,
 *   every chapter simply readable;
 * - anime's ScrollObserver recomputes its own geometry on resize;
 * - the document owns scrolling. No wheel interception, no scroll hijacking.
 *
 * Recorded brief: start = story top, distance = track height - viewport,
 * scene_ranges = evenly spread across the timeline, resize_policy = observer
 * remeasure, direct_entry = sync scrub renders from current position,
 * static_path = reduced motion + no-JS CSS fallback, media_budget = one SVG
 * campus image already used by the page.
 */

import { animate, createTimeline, onScroll, splitText, stagger, utils } from "animejs"

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")

/* ------------------------------------------------------------ static path */

function showEverything() {
  for (const el of document.querySelectorAll(".story__scene")) {
    el.style.opacity = "1"
    el.style.filter = "none"
    el.style.transform = "none"
    el.dataset.active = "true"
  }
  for (const el of document.querySelectorAll(".reveal")) el.dataset.shown = "true"
  document.documentElement.dataset.motion = "static"
}

/* ------------------------------------------------------------ hero intro */

function heroIntro() {
  const scene = document.querySelector(".story__scene")
  const heading = scene?.querySelector("h1")
  if (!heading) return

  // Character-level split so the title assembles instead of just fading in.
  const split = splitText(heading, { chars: true, words: true, accessible: true })

  createTimeline({ defaults: { ease: "outExpo" } })
    .add(".story__photo", { scale: [1.35, 1.06], opacity: [0, 0.3], duration: 1800 }, 0)
    .add(".story__glow", { scale: [0.55, 1], opacity: [0, 1], duration: 1600 }, 60)
    .add(
      split.chars,
      {
        opacity: [0, 1],
        y: ["0.8em", "0em"],
        rotateX: [-92, 0],
        duration: 1100,
        delay: stagger(16, { from: "start" }),
      },
      140,
    )
    .add(scene.querySelector("p"), { opacity: [0, 1], y: [26, 0], duration: 900 }, "-=420")
    .add(".story__progress", { opacity: [0, 1], duration: 600 }, "-=300")
}

/* ------------------------------------------------- pinned, scrubbed story */

function pinnedStory() {
  const story = document.querySelector(".story")
  const scenes = [...document.querySelectorAll(".story__scene")]
  if (!story || scenes.length < 2) return

  const bar = story.querySelector(".story__progress span")

  // One scrubbed timeline drives the whole chapter sequence. `sync` smooths the
  // scrub without decoupling it from position: the value is still derived from
  // where the scroll is, never from which callbacks fired.
  const tl = createTimeline({
    defaults: { ease: "inOutQuad" },
    autoplay: onScroll({
      target: story,
      enter: "top top",
      leave: "bottom bottom",
      sync: 0.18,
      onUpdate: (self) => {
        const p = self.progress
        if (bar) bar.style.width = `${p * 100}%`
        // Expose the derived progress for verification and for the header.
        story.dataset.progress = p.toFixed(3)
        const lead = Math.min(scenes.length - 1, Math.round(p * (scenes.length - 1)))
        for (const [i, el] of scenes.entries()) el.dataset.active = i === lead ? "true" : "false"
      },
    }),
  })

  // Chapter 1 leaves as chapter 2 arrives, and so on: each handover is a
  // simultaneous blur-out / blur-in with a scale change, which reads as a cut
  // through depth rather than a cross-fade.
  // Scene i owns the timeline position i * step, so with three scenes the
  // chapters lead at progress 0, 0.5 and 1. Each handover overlaps by 200ms so
  // one chapter is always carrying the stage.
  const step = 1000
  const fade = 800
  const total = (scenes.length - 1) * step

  scenes.forEach((scene, i) => {
    const centre = i * step
    if (i > 0) {
      tl.add(
        scene,
        {
          opacity: [0, 1],
          scale: [1.14, 1],
          y: [80, 0],
          filter: ["blur(16px)", "blur(0px)"],
          duration: fade,
        },
        centre - fade,
      )
    }
    if (i < scenes.length - 1) {
      tl.add(
        scene,
        {
          opacity: [1, 0],
          scale: [1, 0.9],
          y: [0, -70],
          filter: ["blur(0px)", "blur(14px)"],
          duration: fade,
        },
        centre + (step - fade),
      )
    }
  })

  // The backdrop keeps moving through the whole track: slow push-in plus a
  // bounded vertical drift, so the stage never feels static behind the copy.
  tl.add(".story__photo", { scale: [1.06, 1.24], y: ["0%", "-5%"], duration: total }, 0).add(
    ".story__glow",
    { scale: [1, 1.5], opacity: [1, 0.5], duration: total },
    0,
  )
}

/* --------------------------------------------------------- scroll reveals */

function reveals() {
  // Section headings assemble word by word; bodies and rows rise in sequence.
  for (const head of document.querySelectorAll(".section__head h2")) {
    const split = splitText(head, { words: true, accessible: true })
    animate(split.words, {
      opacity: [0, 1],
      y: ["0.6em", "0em"],
      rotateX: [-70, 0],
      duration: 900,
      ease: "outExpo",
      delay: stagger(45),
      autoplay: onScroll({ target: head, enter: "bottom-=8% top", once: true }),
    })
  }

  for (const group of document.querySelectorAll(".rows, .cards")) {
    const items = group.querySelectorAll(":scope > li")
    if (!items.length) continue
    animate(items, {
      opacity: [0, 1],
      y: [46, 0],
      scale: [0.97, 1],
      filter: ["blur(6px)", "blur(0px)"],
      duration: 900,
      ease: "outExpo",
      delay: stagger(90),
      autoplay: onScroll({ target: group, enter: "bottom-=10% top", once: true }),
      onComplete: () => {
        for (const el of items) el.dataset.shown = "true"
        utils.cleanInlineStyles(items)
      },
    })
  }

  for (const el of document.querySelectorAll(".reveal:not(.section__head)")) {
    if (el.closest(".rows, .cards")) continue
    animate(el, {
      opacity: [0, 1],
      y: [34, 0],
      duration: 800,
      ease: "outExpo",
      autoplay: onScroll({ target: el, enter: "bottom-=8% top", once: true }),
      onComplete: () => {
        el.dataset.shown = "true"
      },
    })
  }

  for (const el of document.querySelectorAll(".section__head.reveal")) el.dataset.shown = "true"
}

/* ---------------------------------------------------------------- header */

function header() {
  const el = document.querySelector(".site-header")
  if (!el) return
  const apply = () => {
    el.dataset.scrolled = window.scrollY > 8 ? "true" : "false"
  }
  apply()
  window.addEventListener("scroll", apply, { passive: true })
}

/* ------------------------------------------------------------------ boot */

function boot() {
  header()
  if (reduced.matches) {
    showEverything()
    return
  }
  document.documentElement.dataset.motion = "animated"
  // Hide what is about to animate, in one frame, so nothing flashes before its
  // scroll observer fires. CSS keeps these visible when this never runs.
  utils.set(".story__scene + .story__scene", { opacity: 0 })
  utils.set(".reveal, .rows > li, .cards > li", { opacity: 0 })
  utils.set(".story__photo, .story__glow, .story__progress", { opacity: 0 })
  heroIntro()
  pinnedStory()
  reveals()
}

boot()
reduced.addEventListener("change", () => {
  if (reduced.matches) showEverything()
})
