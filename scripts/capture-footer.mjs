#!/usr/bin/env node
/**
 * Captures the footer meta line used for the VQ-20 before/after pair.
 * The "before" state is forced by re-applying the light-paper muted token,
 * so the capture shows the measured 3.13:1 regression rather than an
 * approximation of it.
 *
 * Usage: node scripts/capture-footer.mjs <before|after> <outputPath>
 */
import path from "node:path"
import puppeteer from "puppeteer-core"

const BASE = process.env.BASE_URL || "http://127.0.0.1:4319"
const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe"
const [state, outArg] = process.argv.slice(2)
if (!state || !["before", "after"].includes(state)) {
  console.error("usage: capture-footer.mjs <before|after> <outputPath>")
  process.exit(64)
}
const out = path.resolve(outArg || `footer-${state}.png`)

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
})
try {
  const page = await browser.newPage()
  // Pin the light scheme: --muted is #5b6472 there, which is the token that
  // measured 3.13:1 on the night footer. Under dark scheme it resolves to
  // #a7b2c3 and the regression does not reproduce.
  await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "light" }])
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
  await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle0", timeout: 45000 })
  if (state === "before") {
    await page.evaluate(() => {
      const el = document.querySelector(".footer-updated")
      if (el) el.style.color = "var(--muted, #a7b2c3)"
    })
  }
  const footer = await page.$("footer")
  await footer.scrollIntoView()
  await new Promise((r) => setTimeout(r, 600))
  // elementHandle.screenshot() clips in the element's own coordinate space,
  // so the footer is captured in full even though it exceeds the viewport.
  await footer.screenshot({ path: out })
  const ratio = await page.evaluate(() => {
    const el = document.querySelector(".footer-updated")
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
    const lum = (c) => 0.2126 * srgb(c[0]) + 0.7152 * srgb(c[1]) + 0.0722 * srgb(c[2])
    const L1 = lum(blend)
    const L2 = lum(bg)
    return Math.round(((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)) * 100) / 100
  })
  console.log(`${out} :: ${state} ratio=${ratio}:1`)
} finally {
  await browser.close()
}
