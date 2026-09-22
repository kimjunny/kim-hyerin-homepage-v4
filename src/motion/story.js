/* Scroll motion for 시안 3.
 *
 * Follows the StyleGallery scroll-driven story contract:
 * - progress = clamp((scrollY - start) / distance, 0, 1), derived every frame
 *   from the current position, never from which callbacks already fired, so
 *   reversing and jumping into the middle are well defined;
 * - a nonpositive distance selects the static path;
 * - geometry is recomputed on resize and after fonts load;
 * - prefers-reduced-motion takes the static path: no pinning, no scrubbing;
 * - no wheel interception, no scroll hijacking. The document owns scrolling.
 */

const motionOK = !window.matchMedia("(prefers-reduced-motion: reduce)").matches

/* ---------------------------------------------------------------- reveals */

function setupReveals() {
  const items = [...document.querySelectorAll(".reveal")]
  if (!items.length) return

  if (!motionOK || !("IntersectionObserver" in window)) {
    for (const el of items) el.dataset.shown = "true"
    return
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.dataset.shown = "true"
        io.unobserve(entry.target) // declare once
      }
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
  )
  for (const el of items) io.observe(el)
}

/* ------------------------------------------------------------ pinned story */

function setupStory() {
  const story = document.querySelector(".story")
  if (!story) return

  const scenes = [...story.querySelectorAll(".story__scene")]
  const glow = story.querySelector(".story__glow")
  const photo = story.querySelector(".story__photo")
  const bar = story.querySelector(".story__progress span")
  if (!scenes.length) return

  // Static path: every chapter stays readable, nothing is pinned or scrubbed.
  if (!motionOK) {
    for (const scene of scenes) scene.dataset.active = "true"
    return
  }

  let start = 0
  let distance = 0

  const measure = () => {
    const rect = story.getBoundingClientRect()
    start = rect.top + window.scrollY
    // The last viewport of the track is the release, so the scrub ends there.
    distance = story.offsetHeight - window.innerHeight
  }

  // Scene centres are evenly spread across the track: 0, 0.5, 1 for three scenes.
  const centreOf = (index) => (scenes.length === 1 ? 0 : index / (scenes.length - 1))
  const span = scenes.length === 1 ? 1 : 1 / (scenes.length - 1)

  const render = () => {
    if (distance <= 0) {
      for (const scene of scenes) scene.dataset.active = "true"
      return
    }
    const progress = Math.min(1, Math.max(0, (window.scrollY - start) / distance))

    for (const [i, scene] of scenes.entries()) {
      const d = Math.abs(progress - centreOf(i))
      const nearness = Math.max(0, 1 - d / span) // 1 at the centre, 0 a full span away
      scene.style.opacity = String(nearness)
      scene.style.transform = `translateY(${(1 - nearness) * 26}px)`
      scene.dataset.active = nearness > 0.5 ? "true" : "false"
      scene.setAttribute("aria-hidden", nearness > 0.05 ? "false" : "true")
    }

    if (glow) {
      const scale = 0.85 + progress * 0.4
      glow.style.transform = `translate(-50%, -50%) scale(${scale})`
    }
    if (photo) {
      // Bounded displacement: the photo drifts at most 6% of its height.
      photo.style.transform = `scale(${1.06 + progress * 0.08}) translateY(${progress * -3}%)`
    }
    if (bar) bar.style.width = `${progress * 100}%`
  }

  let ticking = false
  const onScroll = () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => {
      render()
      ticking = false
    })
  }

  const remeasure = () => {
    measure()
    render()
  }

  measure()
  render() // direct entry: loading at the middle of the track renders correctly
  window.addEventListener("scroll", onScroll, { passive: true })
  window.addEventListener("resize", remeasure)
  window.addEventListener("orientationchange", remeasure)
  if (document.fonts?.ready) document.fonts.ready.then(remeasure)
}

/* --------------------------------------------------------- header shadow */

function setupHeader() {
  const header = document.querySelector(".site-header")
  if (!header) return
  const apply = () => {
    header.dataset.scrolled = window.scrollY > 8 ? "true" : "false"
  }
  apply()
  window.addEventListener("scroll", apply, { passive: true })
}

setupReveals()
setupStory()
setupHeader()
