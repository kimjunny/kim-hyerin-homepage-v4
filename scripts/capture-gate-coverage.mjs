#!/usr/bin/env node
/**
 * Renders a before/after comparison of which VQ scenarios the gate asserts.
 * The "before" column is derived from the script at a given git revision, so
 * the picture cannot drift from the code.
 *
 * Usage: node scripts/capture-gate-coverage.mjs <beforeRev> <outPath>
 */
import { execFileSync } from "node:child_process"
import path from "node:path"
import puppeteer from "puppeteer-core"

const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe"
const rev = process.argv[2] || "93ccb93"
const out = path.resolve(process.argv[3] || ".audit/shots/gate/coverage.png")

const idsIn = (source) => [...new Set([...source.matchAll(/VQ-(\d+)\//g)].map((m) => `VQ-${m[1]}`))]

const beforeSrc = execFileSync("git", ["show", `${rev}:scripts/visual-gate.mjs`], {
  encoding: "utf8",
})
const afterSrc = execFileSync("git", ["show", `HEAD:scripts/visual-gate.mjs`], { encoding: "utf8" })

const ALL = idsIn(afterSrc).sort()
const before = new Set(idsIn(beforeSrc))
const after = new Set(idsIn(afterSrc))

const panel = (title, subtitle, active, tone, note = "") => {
  const cells = ALL.map((id) => {
    const on = active.has(id)
    const cls = on ? `on ${tone}` : "off"
    const label = on ? "asserted" : "prose only"
    return `<div class="cell ${cls}"><b>${id}</b><span>${label}</span></div>`
  }).join("")
  return `<section class="panel">
    <h2>${title}</h2>
    <p class="sub">${subtitle}</p>
    <div class="grid">${cells}</div>
    <p class="tally"><b>${active.size}</b> of ${ALL.length} scenarios asserted</p>
    ${note ? `<p class="note">${note}</p>` : ""}
  </section>`
}

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; }
  body { margin: 0; padding: 40px; background: #f7f5f1; color: #16233a;
         font-family: ui-sans-serif, system-ui, "Segoe UI", sans-serif; }
  .wrap { display: flex; gap: 32px; }
  .panel { flex: 1; background: #fff; border: 1px solid #e2ddd4; border-radius: 14px; padding: 26px; }
  h1 { font-family: ui-serif, Georgia, serif; font-size: 30px; margin: 0 0 6px; }
  .lede { margin: 0 0 26px; color: #5b6472; font-size: 15px; }
  h2 { font-size: 17px; margin: 0 0 4px; }
  .sub { margin: 0 0 16px; color: #5b6472; font-size: 13px; }
  .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
  .cell { border-radius: 8px; padding: 8px 10px; display: flex; flex-direction: column;
          gap: 2px; border: 1.5px solid; }
  .cell b { font-family: ui-monospace, monospace; font-size: 14px; }
  .cell span { font-size: 11px; opacity: .8; }
  .on.poor { background: rgba(28,107,74,.10); border-color: #1c6b4a; color: #1c6b4a; }
  .on.good { background: rgba(28,107,74,.10); border-color: #1c6b4a; color: #1c6b4a; }
  .off { background: rgba(138,47,58,.07); border-color: #c98b93; color: #8a2f3a; }
  .tally { margin: 18px 0 0; font-size: 14px; color: #5b6472; }
  .tally b { color: #16233a; font-size: 20px; }
  .note { margin: 10px 0 0; font-size: 12px; line-height: 1.5; color: #8a2f3a; }
</style></head><body>
  <h1>Visual QA gate coverage</h1>
  <p class="lede">Which VQ scenarios the gate actually measures, read from the script itself.</p>
  <div class="wrap">
    ${panel(
      "Before",
      `scripts/visual-gate.mjs @ ${rev}`,
      before,
      "poor",
      "VQ-15 was labelled as dark-mode coverage but measured touch targets; dark mode was never asserted. VQ-13 had no assertion at all.",
    )}
    ${panel(
      "After",
      "scripts/visual-gate.mjs @ HEAD",
      after,
      "good",
      "VQ-15 now measures dark-mode surface luminance; VQ-13 measures touch targets under its own id.",
    )}
  </div>
</body></html>`

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
})
try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1320, height: 800, deviceScaleFactor: 2 })
  await page.setContent(html, { waitUntil: "load" })
  await page.screenshot({ path: out, fullPage: true })
  console.log(`${out} :: before=${before.size} after=${after.size} of ${ALL.length}`)
} finally {
  await browser.close()
}
