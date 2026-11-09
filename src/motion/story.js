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
  const story = document.querySelector(".story")
  if (story) {
    story.style.height = "auto"
    story.dataset.progress = "1"
  }
  const stage = document.querySelector(".story__stage")
  if (stage) stage.style.position = "static"

  for (const el of document.querySelectorAll(".story__scene")) {
    el.style.transition = "none"
    el.style.opacity = "1"
    el.style.filter = "none"
    el.style.transform = "none"
    el.dataset.active = "true"
    el.dataset.settled = "true"
  }
  for (const el of document.querySelectorAll(".reveal, .rows > *, .cards > *, .section__head")) {
    el.style.opacity = "1"
    el.style.filter = "none"
    el.style.transform = "none"
    el.dataset.shown = "true"
  }
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

/* Inner pages get the same assembling title, without a pinned stage. */
function pageHero() {
  const hero = document.querySelector(".page-hero")
  const heading = hero?.querySelector("h1")
  if (!heading) return
  const split = splitText(heading, { chars: true, words: true, accessible: true })
  createTimeline({ defaults: { ease: "outExpo" } })
    .add(".page-hero__glow", { scale: [0.6, 1], opacity: [0, 1], duration: 1400 }, 0)
    .add(
      split.chars,
      {
        opacity: [0, 1],
        y: ["0.7em", "0em"],
        rotateX: [-88, 0],
        duration: 1000,
        delay: stagger(18),
      },
      80,
    )
    .add(hero.querySelector(".page-lede"), { opacity: [0, 1], y: [24, 0], duration: 800 }, "-=380")
    .add(hero.querySelector(".eyebrow"), { opacity: [0, 1], duration: 600 }, 0)
}

function pinnedStory() {
  const story = document.querySelector(".story")
  const scenes = [...document.querySelectorAll(".story__scene")]
  if (!story || scenes.length < 2) return

  const bar = story.querySelector(".story__progress span")
  const EASE = "cubic-bezier(0.16, 1, 0.3, 1)"
  const DURATION = 620
  const HANDOVER = `opacity ${DURATION}ms ${EASE}, filter ${DURATION}ms ${EASE}, transform ${DURATION}ms ${EASE}`

  // A compositor hint is only worth its memory while the story is actually being
  // scrubbed. Outside the track the layers are released, so a reader far down
  // the page is not paying for five promoted layers behind them.
  const hinted = story.querySelectorAll(".story__photo, .story__glow, .story__scene")
  const hint = (on) => {
    for (const el of hinted) el.style.willChange = on ? "transform, opacity" : "auto"
  }
  hint(false)
  new IntersectionObserver(
    (entries) => {
      for (const entry of entries) hint(entry.isIntersecting)
    },
    { rootMargin: "200px 0px" },
  ).observe(story)

  let lead = -1

  // The handover is a CSS transition, not a scrub. A transition always reaches
  // its end value, so stopping the scroll mid-chapter still settles on one
  // fully opaque, unblurred chapter. The blur/scale depth cue that was approved
  // for this design survives; only the resting half-visible state is removed.
  function show(index, direction) {
    if (index === lead) return
    const incoming = scenes[index]
    const outgoing = lead >= 0 ? scenes[lead] : null
    lead = index

    for (const [i, el] of scenes.entries()) el.dataset.active = i === index ? "true" : "false"

    if (outgoing) {
      outgoing.style.transition = "none"
      outgoing.style.opacity = "0"
      outgoing.style.filter = "none"
      outgoing.style.transform = "none"
    }

    incoming.style.transition = "none"
    incoming.style.opacity = "0.35"
    incoming.style.filter = "blur(7px)"
    incoming.style.transform = `translate3d(0, ${direction >= 0 ? 22 : -22}px, 0)`
    void incoming.offsetWidth

    incoming.style.transition = HANDOVER
    incoming.style.opacity = "1"
    incoming.style.filter = "blur(0px)"
    incoming.style.transform = "translate3d(0, 0, 0)"
  }

  let lastY = window.scrollY

  createTimeline({
    autoplay: onScroll({
      target: story,
      enter: "top top",
      leave: "bottom bottom",
      onUpdate: (self) => {
        const p = self.progress
        if (bar) bar.style.width = `${p * 100}%`
        story.dataset.progress = p.toFixed(3)
        const direction = window.scrollY >= lastY ? 1 : -1
        lastY = window.scrollY
        const index = Math.min(scenes.length - 1, Math.floor(p * scenes.length + 0.0001))
        show(index, direction)
      },
    }),
  })

  // The backdrop keeps drifting across the whole track so the stage never feels
  // frozen behind the copy.
  createTimeline({
    defaults: { ease: "linear" },
    autoplay: onScroll({ target: story, enter: "top top", leave: "bottom bottom" }),
  })
    .add(".story__photo", { scale: [1.06, 1.24], y: ["0%", "-5%"] }, 0)
    .add(".story__glow", { scale: [1, 1.5], opacity: [1, 0.5] }, 0)

  show(0, 1)
}

/* --------------------------------------------------------- scroll reveals */

/* anime's scroll thresholds proved unreliable for these one-shot entrances, so
   the TRIGGER is an IntersectionObserver and anime owns only the animation.
   Every animation also has a guaranteed end state: if an observer never fires,
   the fallback sweep below reveals the element anyway. */
function onVisible(el, run) {
  if (!("IntersectionObserver" in window)) {
    run()
    return
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        io.unobserve(entry.target)
        run()
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  )
  io.observe(el)
}

function reveals() {
  for (const head of document.querySelectorAll(".section__head")) {
    const h2 = head.querySelector("h2")
    if (!h2) continue
    const split = splitText(h2, { words: true, accessible: true })
    utils.set(split.words, { opacity: 0 })
    const rest = [...head.children].filter((el) => el !== h2)
    utils.set(rest, { opacity: 0 })
    onVisible(head, () => {
      animate(split.words, {
        opacity: [0, 1],
        y: ["0.6em", "0em"],
        rotateX: [-70, 0],
        duration: 900,
        ease: "outExpo",
        delay: stagger(45),
      })
      if (rest.length) {
        animate(rest, { opacity: [0, 1], y: [18, 0], duration: 700, ease: "outExpo", delay: 160 })
      }
      head.dataset.shown = "true"
    })
  }

  for (const group of document.querySelectorAll(".rows, .cards")) {
    const items = [...group.children]
    if (!items.length) continue
    utils.set(items, { opacity: 0 })
    onVisible(group, () => {
      animate(items, {
        opacity: [0, 1],
        y: [46, 0],
        scale: [0.97, 1],
        filter: ["blur(6px)", "blur(0px)"],
        duration: 900,
        ease: "outExpo",
        delay: stagger(90),
        onComplete: () => {
          for (const el of items) el.dataset.shown = "true"
        },
      })
    })
  }

  const singles = [...document.querySelectorAll(".reveal")].filter(
    (el) => !el.classList.contains("section__head") && !el.closest(".rows, .cards"),
  )
  utils.set(singles, { opacity: 0 })
  for (const el of singles) {
    onVisible(el, () => {
      animate(el, {
        opacity: [0, 1],
        y: [34, 0],
        duration: 800,
        ease: "outExpo",
        onComplete: () => {
          el.dataset.shown = "true"
          // will-change is a hint for a known animation. Leaving it on every
          // revealed block keeps a compositor layer alive for the rest of the
          // session, so it is released the moment the animation ends.
          el.style.willChange = "auto"
        },
      })
    })
  }

  // Safety net: nothing may stay invisible. Anything still hidden a moment after
  // the page settles is shown outright, so a missed observer never hides content.
  const sweep = () => {
    for (const el of document.querySelectorAll(
      ".section__head, .rows > *, .cards > *, .reveal, .section__head h2 span",
    )) {
      const cs = getComputedStyle(el)
      const r = el.getBoundingClientRect()
      const seen = r.top < window.innerHeight && r.bottom > 0
      if (seen && Number(cs.opacity) < 0.05) utils.set(el, { opacity: 1, y: 0 })
      // The safety net may be the only thing that ever reveals this element, so
      // it releases the will-change hint too. Leaving it set keeps a layer alive
      // for elements the observer never touched.
      if (Number(getComputedStyle(el).opacity) > 0.95) el.style.willChange = "auto"
    }
  }
  window.addEventListener("scroll", () => setTimeout(sweep, 1200), { passive: true })
  setTimeout(sweep, 2500)
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
  utils.set(".story__photo, .story__glow, .story__progress", { opacity: 0 })
  utils.set(".page-hero__glow, .page-hero .eyebrow, .page-lede", { opacity: 0 })
  heroIntro()
  pageHero()
  pinnedStory()
  reveals()
}

boot()

// A runtime flip of the OS preference must land on a readable page in both
// directions, not only when motion is turned off.
reduced.addEventListener("change", () => {
  if (reduced.matches) {
    showEverything()
    return
  }
  const story = document.querySelector(".story")
  if (story) story.style.removeProperty("height")
  const stage = document.querySelector(".story__stage")
  if (stage) stage.style.removeProperty("position")
  for (const el of document.querySelectorAll(".story__scene")) {
    el.style.removeProperty("transition")
    el.style.removeProperty("opacity")
    el.style.removeProperty("filter")
    el.style.removeProperty("transform")
    el.dataset.settled = "false"
  }
  document.documentElement.dataset.motion = "animated"
  window.location.reload()
})
