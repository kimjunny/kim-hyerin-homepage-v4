#!/usr/bin/env node
/**
 * Accessibility gate: runs axe-core against every built page at desktop and
 * mobile widths, proves the scanner can actually fail (control run), then
 * writes .audit/axe/axe-report.json and exits non-zero on any violation.
 *
 * Usage:
 *   bun run build
 *   node scripts/a11y-gate.mjs            # expects http://127.0.0.1:4319
 *   BASE_URL=http://127.0.0.1:4319 node scripts/a11y-gate.mjs
 */
import fs from "node:fs"
import path from "node:path"
import puppeteer from "puppeteer-core"

const BASE = process.env.BASE_URL || "http://127.0.0.1:4319"
const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe"
const PAGES = ["index", "profile", "research", "publications", "education", "sources"]
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"]
const AXE_PATH = path.resolve("node_modules/axe-core/axe.min.js")
const OUT_DIR = path.resolve(".audit/axe")
const AXE_SOURCE = fs.readFileSync(AXE_PATH, "utf8")

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
]

const runAxe = async (page) => {
  await page.evaluate(AXE_SOURCE)
  return page.evaluate(async (tagList) => {
    const r = await window.axe.run(document, {
      resultTypes: ["violations"],
      runOnly: { type: "tag", values: tagList },
    })
    return {
      violations: r.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        helpUrl: v.helpUrl,
        nodes: v.nodes.length,
        targets: v.nodes.slice(0, 5).map((n) => n.target.join(" ")),
      })),
      passes: r.passes.length,
      incomplete: r.incomplete.length,
      inapplicable: r.inapplicable.length,
    }
  }, TAGS)
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
})

const report = {
  generatedAt: new Date().toISOString(),
  baseUrl: BASE,
  axeVersion: JSON.parse(fs.readFileSync("node_modules/axe-core/package.json", "utf8")).version,
  tags: TAGS,
  control: null,
  results: {},
  totals: { violations: 0, passes: 0, pages: 0, runs: 0 },
}

try {
  // Control run: prove the scanner detects real defects before trusting a zero.
  const controlPage = await browser.newPage()
  await controlPage.goto(`${BASE}/profile.html`, {
    waitUntil: "networkidle0",
    timeout: 45000,
  })
  await controlPage.evaluate(() => {
    const img = document.createElement("img")
    img.src = "/favicon.svg"
    img.id = "axe-control-img"
    document.body.appendChild(img)
    const btn = document.createElement("button")
    btn.id = "axe-control-btn"
    document.body.appendChild(btn)
  })
  const control = await runAxe(controlPage)
  report.control = {
    expected: ["image-alt", "button-name"],
    detected: control.violations.map((v) => v.id),
    ok:
      control.violations.some((v) => v.id === "image-alt") &&
      control.violations.some((v) => v.id === "button-name"),
  }
  await controlPage.close()

  for (const vp of VIEWPORTS) {
    for (const pageName of PAGES) {
      const page = await browser.newPage()
      await page.setViewport({
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
      })
      await page.goto(`${BASE}/${pageName}.html`, {
        waitUntil: "networkidle0",
        timeout: 45000,
      })
      const res = await runAxe(page)
      report.results[`${vp.name}:${pageName}`] = res
      report.totals.violations += res.violations.length
      report.totals.passes += res.passes
      report.totals.runs += 1
      await page.close()
      const status = res.violations.length === 0 ? "PASS" : "FAIL"
      console.log(
        `${status} ${vp.name}:${pageName} passes=${res.passes} violations=${res.violations.length}`,
      )
    }
  }
  report.totals.pages = PAGES.length
} finally {
  await browser.close()
}

fs.mkdirSync(OUT_DIR, { recursive: true })
fs.writeFileSync(path.join(OUT_DIR, "axe-report.json"), JSON.stringify(report, null, 2))

console.log(
  `\naxe ${report.axeVersion}: ${report.totals.violations} violations across ${report.totals.runs} runs (${report.totals.pages} pages x ${VIEWPORTS.length} viewports), ${report.totals.passes} rule passes`,
)
console.log(
  `control run detected: ${report.control.detected.join(", ")} -> ${report.control.ok ? "scanner verified" : "SCANNER BROKEN"}`,
)

if (!report.control.ok) {
  console.error("Control run failed: axe did not detect known violations.")
  process.exit(2)
}
if (report.totals.violations > 0) {
  console.error("Accessibility gate FAILED.")
  process.exit(1)
}
console.log("Accessibility gate PASSED.")
