#!/usr/bin/env node
/**
 * Captures the live reference site at both required viewports (S1).
 * The audit's baseline is the deployed v3 URL, not the local preview.
 *
 * Usage: node scripts/capture-live.mjs [outDir]
 */
import fs from "node:fs"
import path from "node:path"
import puppeteer from "puppeteer-core"

const LIVE = "https://kim-hyerin-homepage-v3.vercel.app/"
const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe"
const OUT = path.resolve(process.argv[2] || ".audit/shots/live")

fs.mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
})

const manifest = []
try {
  for (const [name, width, height, dpr] of [
    ["desktop", 1440, 900, 1],
    ["mobile", 390, 844, 2],
  ]) {
    const page = await browser.newPage()
    await page.setViewport({ width, height, deviceScaleFactor: dpr })
    const res = await page.goto(LIVE, { waitUntil: "networkidle0", timeout: 60000 })
    await new Promise((r) => setTimeout(r, 1500))
    // Viewport shot: proves the first screen renders as shipped.
    const viewFile = path.join(OUT, `live-index-${name}-viewport.png`)
    await page.screenshot({ path: viewFile })
    // Full page with reduced motion: the live build gates content behind
    // scroll-reveal, so expanding the viewport leaves unrevealed bands blank.
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }])
    await page.reload({ waitUntil: "networkidle0", timeout: 60000 })
    await new Promise((r) => setTimeout(r, 1500))
    const file = path.join(OUT, `live-index-${name}.png`)
    await page.screenshot({ path: file, fullPage: true })
    const title = await page.title()
    const h1 = await page.evaluate(() => document.querySelector("h1")?.textContent.trim() || "")
    manifest.push({
      name,
      width,
      height,
      status: res?.status(),
      title,
      h1,
      viewFile: path.relative(process.cwd(), viewFile).split(path.sep).join("/"),
      file: path.relative(process.cwd(), file).split(path.sep).join("/"),
    })
    console.log(`${name}: HTTP ${res?.status()} title="${title}" h1="${h1.slice(0, 40)}"`)
    await page.close()
  }
} finally {
  await browser.close()
}
fs.writeFileSync(
  path.join(OUT, "live-manifest.json"),
  JSON.stringify({ capturedAt: new Date().toISOString(), url: LIVE, shots: manifest }, null, 2),
)
console.log(`captured ${manifest.length} live screenshots`)
