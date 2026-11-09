#!/usr/bin/env node
/**
 * Full-page screenshot capture for the built site.
 *
 * Uses puppeteer's fullPage option (CDP captureBeyondViewport) so viewport
 * units stay at their real size. Expanding the viewport to page height would
 * inflate every `100vh` scroll-story section and produce a hero-only image.
 *
 * The scroll-story section is pinned to a single scene while the viewport is
 * expanded during fullPage capture, which would leave its remaining scenes
 * invisible. Captures therefore run with `prefers-reduced-motion: reduce`,
 * the product's own static path, so every scene is laid out in document flow.
 * Interactive motion states are covered separately by the motion captures.
 *
 * Usage:
 *   node scripts/capture-fullpage.mjs [outDir]
 */
import fs from "node:fs"
import path from "node:path"
import puppeteer from "puppeteer-core"

const BASE = process.env.BASE_URL || "http://127.0.0.1:4319"
const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe"
const OUT = path.resolve(process.argv[2] || ".audit/shots/fullpage")
const PAGES = ["index", "profile", "research", "publications", "education", "sources"]
const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900, dpr: 1 },
  { name: "mobile", width: 390, height: 844, dpr: 2 },
]

fs.mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
})

const captured = []
try {
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage()
    await page.setViewport({
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.dpr,
    })
    for (const name of PAGES) {
      await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }])
      await page.goto(`${BASE}/${name}.html`, {
        waitUntil: "networkidle0",
        timeout: 45000,
      })
      // Walk the page so IntersectionObserver reveals fire before capture.
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.6
        for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
          window.scrollTo(0, y)
          await new Promise((r) => setTimeout(r, 60))
        }
        window.scrollTo(0, 0)
        await new Promise((r) => setTimeout(r, 500))
      })
      const height = await page.evaluate(() => document.documentElement.scrollHeight)
      const file = path.join(OUT, `${name}-${vp.name}.png`)
      await page.screenshot({ path: file, fullPage: true })
      captured.push({ page: name, viewport: vp.name, height, file })
      console.log(`${name}-${vp.name}: ${vp.width}x${height}`)
    }
    await page.close()
  }
} finally {
  await browser.close()
}

fs.writeFileSync(
  path.join(OUT, "capture-manifest.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), baseUrl: BASE, captured }, null, 2),
)
console.log(`\ncaptured ${captured.length} full-page screenshots into ${OUT}`)
