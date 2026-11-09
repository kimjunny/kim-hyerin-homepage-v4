#!/usr/bin/env node
/**
 * Visual QA gate. Asserts the measured properties that the audit plan
 * (VQ-01..VQ-24) promises, at desktop and mobile widths, and writes
 * .audit/visualqa/report.json. Exits non-zero on any FAIL.
 *
 * Requires `bun run build` and a preview server on BASE_URL.
 */
import fs from "node:fs"
import path from "node:path"
import puppeteer from "puppeteer-core"

const BASE = process.env.BASE_URL || "http://127.0.0.1:4319"
const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe"
const PAGES = ["index", "profile", "research", "publications", "education", "sources"]
const OUT_DIR = path.resolve(".audit/visualqa")

const measureContrast = () => {
  const srgb = (v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  const lum = (rgb) => 0.2126 * srgb(rgb[0]) + 0.7152 * srgb(rgb[1]) + 0.0722 * srgb(rgb[2])
  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/)
    if (!m) return null
    const p = m[1]
      .split(/[,\s/]+/)
      .filter(Boolean)
      .map(Number)
    return { rgb: p.slice(0, 3), a: p.length > 3 ? p[3] : 1 }
  }
  const blend = (fg, bg) => fg.rgb.map((c, i) => c * fg.a + bg[i] * (1 - fg.a))
  const bgOf = (el) => {
    let n = el
    while (n) {
      const c = parse(getComputedStyle(n).backgroundColor)
      if (c && c.a > 0.5) return c.rgb
      n = n.parentElement
    }
    const rootBg = parse(getComputedStyle(document.documentElement).backgroundColor)
    return rootBg && rootBg.a > 0.5 ? rootBg.rgb : [255, 255, 255]
  }
  const hasGradientBacking = (el) => {
    let n = el
    while (n) {
      if (getComputedStyle(n).backgroundImage !== "none") return true
      n = n.parentElement
    }
    return false
  }
  const out = []
  for (const el of document.querySelectorAll(
    "p, li, a, h1, h2, h3, h4, span, td, th, dd, dt, figcaption, button, time, small, strong, em",
  )) {
    const text = el.textContent.trim()
    if (!text || el.children.length > 0) continue
    const cs = getComputedStyle(el)
    if (cs.visibility === "hidden" || cs.display === "none" || Number(cs.opacity) < 0.9) continue
    const r = el.getBoundingClientRect()
    if (r.width < 2 || r.height < 2) continue
    // Off-screen affordances (the skip link parked above the viewport) are not
    // read by sighted users until focused; axe covers them in the focus state.
    if (r.bottom <= 0) continue
    // Gradients and photos cannot be sampled from computed styles. axe reports
    // those as "incomplete" instead of guessing, so skip them here too.
    if (hasGradientBacking(el)) continue
    const fg = parse(cs.color)
    if (!fg) continue
    const bg = bgOf(el)
    const eff = fg.a < 1 ? blend(fg, bg) : fg.rgb
    const L1 = lum(eff)
    const L2 = lum(bg)
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)
    const size = Number.parseFloat(cs.fontSize)
    const weight = Number(cs.fontWeight) || 400
    const large = size >= 24 || (size >= 18.66 && weight >= 700)
    const need = large ? 3 : 4.5
    if (ratio < need) {
      out.push({
        text: text.slice(0, 40),
        cls: el.className.toString().slice(0, 40),
        ratio: Math.round(ratio * 100) / 100,
        need,
        size,
        weight,
      })
    }
  }
  return out
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
})

const report = { generatedAt: new Date().toISOString(), baseUrl: BASE, checks: [], totals: {} }
const add = (id, name, status, detail) => {
  report.checks.push({ id, name, status, detail })
  console.log(`${status} ${id} ${name}${detail ? ` :: ${detail}` : ""}`)
}

try {
  for (const scheme of ["light", "dark"]) {
    const page = await browser.newPage()
    await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: scheme }])
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
    await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle0", timeout: 45000 })

    // VQ-06 readable measure: no line may exceed 80ch of actual characters.
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
    const measure = await page.evaluate(() => {
      const widths = []
      for (const p of document.querySelectorAll("p")) {
        const r = p.getBoundingClientRect()
        if (r.width < 100 || !p.textContent.trim()) continue
        const range = document.createRange()
        range.selectNodeContents(p)
        const rects = [...range.getClientRects()].filter((x) => x.width > 40)
        if (!rects.length) continue
        const cs = getComputedStyle(p)
        const probe = document.createElement("span")
        probe.textContent = "0".repeat(100)
        probe.style.cssText = `position:absolute;visibility:hidden;font:${cs.font}`
        document.body.appendChild(probe)
        const chw = probe.getBoundingClientRect().width / 100
        probe.remove()
        widths.push(Math.round(Math.max(...rects.map((x) => x.width)) / chw))
      }
      return { max: widths.length ? Math.max(...widths) : 0, samples: widths.length }
    })
    add(
      `VQ-06/${scheme}`,
      "본문 측정 폭 80ch 이하",
      measure.max > 0 && measure.max <= 80 ? "PASS" : "FAIL",
      `max=${measure.max}ch samples=${measure.samples}`,
    )

    // VQ-12 anchor offset: header height must be cleared by scroll-padding.
    const anchor = await page.evaluate(() => {
      const header = document.querySelector("header")
      const pad = getComputedStyle(document.documentElement).scrollPaddingTop
      const main = document.querySelector("#main-content")
      return {
        headerH: header ? Math.round(header.getBoundingClientRect().height) : 0,
        pad,
        mainTop: main ? Math.round(main.getBoundingClientRect().top) : -1,
      }
    })
    const padPx = Number.parseFloat(anchor.pad) || 0
    add(
      `VQ-12/${scheme}`,
      "앵커 이동 시 헤더에 가려지지 않음",
      padPx >= anchor.headerH && anchor.mainTop >= anchor.headerH - 1 ? "PASS" : "FAIL",
      `header=${anchor.headerH}px pad=${anchor.pad} mainTop=${anchor.mainTop}px`,
    )

    // VQ-14 contrast on every page, both schemes.
    const contrastFails = []
    for (const name of PAGES) {
      await page.goto(`${BASE}/${name}.html`, { waitUntil: "networkidle0", timeout: 45000 })
      const f = await page.evaluate(measureContrast)
      contrastFails.push(...f.map((x) => ({ page: name, ...x })))
    }
    add(
      `VQ-14/${scheme}`,
      "텍스트 대비 WCAG AA",
      contrastFails.length === 0 ? "PASS" : "FAIL",
      `${contrastFails.length} failing nodes` +
        (contrastFails.length ? ` :: ${JSON.stringify(contrastFails.slice(0, 4))}` : ""),
    )

    // VQ-19 no horizontal overflow at either width.
    for (const [label, w, h] of [
      ["desktop", 1440, 900],
      ["mobile", 390, 844],
    ]) {
      await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 })
      let worst = { page: "", over: 0 }
      for (const name of PAGES) {
        await page.goto(`${BASE}/${name}.html`, { waitUntil: "networkidle0", timeout: 45000 })
        const over = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        )
        if (over > worst.over) worst = { page: name, over }
      }
      add(
        `VQ-19/${scheme}/${label}`,
        "가로 오버플로 0",
        worst.over <= 0 ? "PASS" : "FAIL",
        `worst=${worst.over}px on ${worst.page || "none"}`,
      )
    }

    // VQ-20 footer meta text contrast (the regression found after merge).
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
    await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle0", timeout: 45000 })
    const footer = await page.evaluate(() => {
      const el = document.querySelector(".footer-updated")
      if (!el) return null
      const cs = getComputedStyle(el)
      const parse = (c) => {
        const m = c.match(/rgba?\(([^)]+)\)/)
        if (!m) return null
        const p = m[1]
          .split(/[,\s/]+/)
          .filter(Boolean)
          .map(Number)
        return { rgb: p.slice(0, 3), a: p.length > 3 ? p[3] : 1 }
      }
      let n = el
      let bg = [11, 18, 32]
      while (n) {
        const c = parse(getComputedStyle(n).backgroundColor)
        if (c && c.a > 0.5) {
          bg = c.rgb
          break
        }
        n = n.parentElement
      }
      const fg = parse(cs.color)
      const blend = fg.rgb.map((c, i) => c * fg.a + bg[i] * (1 - fg.a))
      const srgb = (v) => {
        const s = v / 255
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
      }
      const lum = (rgb) => 0.2126 * srgb(rgb[0]) + 0.7152 * srgb(rgb[1]) + 0.0722 * srgb(rgb[2])
      const L1 = lum(blend)
      const L2 = lum(bg)
      return {
        ratio: Math.round(((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)) * 100) / 100,
        color: cs.color,
      }
    })
    add(
      `VQ-20/${scheme}`,
      "푸터 갱신일 대비 4.5:1 이상",
      footer && footer.ratio >= 4.5 ? "PASS" : "FAIL",
      footer ? `ratio=${footer.ratio} color=${footer.color}` : "element missing",
    )

    await page.close()
  }

  // VQ-10 / VQ-24: motion paths. Scenes must be readable when settled, and
  // the hero photo must survive the reduced-motion static path.
  {
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
    await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle0", timeout: 45000 })
    const offsets = [0, 600, 1200, 1800, 2400]
    const bad = []
    for (const y of offsets) {
      await page.evaluate((v) => window.scrollTo(0, v), y)
      await new Promise((r) => setTimeout(r, 900))
      const state = await page.evaluate(() => {
        const active = document.querySelector('.story__scene[data-active="true"]')
        if (!active) return { none: true }
        const cs = getComputedStyle(active)
        return { op: Number(cs.opacity), blur: cs.filter }
      })
      if (
        state.none ||
        state.op < 0.99 ||
        (state.blur !== "none" && !state.blur.includes("blur(0px"))
      )
        bad.push({ y, state })
    }
    add(
      "VQ-10/animated",
      "스크롤이 멈춘 씬은 흐림 없이 완전 불투명",
      bad.length === 0 ? "PASS" : "FAIL",
      bad.length ? JSON.stringify(bad) : `${offsets.length}/${offsets.length} offsets settled`,
    )

    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }])
    await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle0", timeout: 45000 })
    await new Promise((r) => setTimeout(r, 1200))
    const rm = await page.evaluate(() => {
      const photo = document.querySelector(".story__photo")
      const scenes = [...document.querySelectorAll(".story__scene")]
      const vh = window.innerHeight
      const visiblePhoto = photo
        ? photo.getBoundingClientRect().height > vh * 0.5 &&
          Number(getComputedStyle(photo).opacity) > 0.05 &&
          photo.complete &&
          photo.naturalWidth > 0
        : false
      // A photo at negative z-index only paints if an ancestor makes a stacking context.
      let paints = false
      if (photo) {
        let n = photo.parentElement
        while (n && n !== document.documentElement) {
          const cs = getComputedStyle(n)
          if (
            cs.isolation === "isolate" ||
            cs.transform !== "none" ||
            cs.filter !== "none" ||
            cs.opacity !== "1" ||
            cs.willChange.includes("transform") ||
            cs.willChange.includes("opacity")
          ) {
            paints = true
            break
          }
          n = n.parentElement
        }
      }
      return {
        photoVisible: visiblePhoto,
        photoPaints: paints,
        scenes: scenes.length,
        allReadable: scenes.every((s) => Number(getComputedStyle(s).opacity) >= 0.99),
        stageStatic: getComputedStyle(document.querySelector(".story__stage")).position,
      }
    })
    add(
      "VQ-24/reduced-motion",
      "모션 감소 경로에서도 히어로 사진이 보인다",
      rm.photoVisible && rm.photoPaints ? "PASS" : "FAIL",
      `photoVisible=${rm.photoVisible} paints=${rm.photoPaints} stage=${rm.stageStatic}`,
    )
    add(
      "VQ-11/reduced-motion",
      "모션 감소 경로에서 모든 씬이 읽힌다",
      rm.allReadable && rm.scenes === 3 && rm.stageStatic === "static" ? "PASS" : "FAIL",
      `scenes=${rm.scenes} allReadable=${rm.allReadable} stage=${rm.stageStatic}`,
    )
    await page.close()
  }

  // VQ-15 touch target size at mobile width.
  {
    const page = await browser.newPage()
    await page.setViewport({
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    })
    const small = []
    for (const name of PAGES) {
      await page.goto(`${BASE}/${name}.html`, { waitUntil: "networkidle0", timeout: 45000 })
      const bad = await page.evaluate(() => {
        const out = []
        for (const el of document.querySelectorAll("a[href], button, [role=button]")) {
          const r = el.getBoundingClientRect()
          const cs = getComputedStyle(el)
          if (cs.visibility === "hidden" || cs.display === "none" || r.width < 1) continue
          if (r.height < 44 || r.width < 24) {
            out.push({
              text: el.textContent.trim().slice(0, 24),
              w: Math.round(r.width),
              h: Math.round(r.height),
            })
          }
        }
        return out
      })
      small.push(...bad.map((b) => ({ page: name, ...b })))
    }
    add(
      "VQ-15/mobile",
      "터치 타깃 44px 이상",
      small.length === 0 ? "PASS" : "FAIL",
      small.length ? JSON.stringify(small.slice(0, 5)) : "all targets >= 44px tall",
    )
    await page.close()
  }
} finally {
  await browser.close()
}

report.totals = {
  total: report.checks.length,
  pass: report.checks.filter((c) => c.status === "PASS").length,
  fail: report.checks.filter((c) => c.status === "FAIL").length,
}
fs.mkdirSync(OUT_DIR, { recursive: true })
fs.writeFileSync(path.join(OUT_DIR, "report.json"), JSON.stringify(report, null, 2))
console.log(`\n${report.totals.pass}/${report.totals.total} checks passed`)
if (report.totals.fail > 0) {
  console.error("Visual QA gate FAILED.")
  process.exit(1)
}
console.log("Visual QA gate PASSED.")
