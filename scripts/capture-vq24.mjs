#!/usr/bin/env node
/**
 * Captures the reduced-motion hero for VQ-24 before/after evidence.
 * Usage: node scripts/capture-vq24.mjs <outputPath>
 */
import path from "node:path"
import puppeteer from "puppeteer-core"

const BASE = process.env.BASE_URL || "http://127.0.0.1:4319"
const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe"
const out = path.resolve(process.argv[2] || "vq24.png")

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
})
try {
  const page = await browser.newPage()
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }])
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
  await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle0", timeout: 45000 })
  await new Promise((r) => setTimeout(r, 1500))
  await page.screenshot({ path: out })
  const state = await page.evaluate(() => {
    const photo = document.querySelector(".story__photo")
    let paints = false
    let n = photo?.parentElement
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
    return { paints, opacity: photo ? getComputedStyle(photo).opacity : null }
  })
  console.log(`${out} :: photo paints=${state.paints} opacity=${state.opacity}`)
} finally {
  await browser.close()
}
