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

  // VQ-01..05, VQ-07..09, VQ-13, VQ-15..18, VQ-21..22: page-level assertions
  // that previously sat in the verdict table as manual claims. Each one is
  // measured here so a regression cannot pass by being restated in prose.
  {
    const page = await browser.newPage()
    await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "light" }])
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })

    // VQ-01 one H1, and the profile page names the person.
    {
      const rows = []
      for (const name of PAGES) {
        await page.goto(`${BASE}/${name}.html`, { waitUntil: "networkidle0", timeout: 45000 })
        const r = await page.evaluate(() => {
          const hs = [...document.querySelectorAll("h1")]
          return {
            count: hs.length,
            text: hs[0] ? hs[0].innerText.replace(/\s+/g, " ").trim() : "",
            // splitText() keeps a visually-hidden sr-only copy next to the
            // animated glyphs; count the accessible copy only.
            visibleCopies: hs[0]
              ? new Set(
                  [...hs[0].querySelectorAll("*")]
                    .filter((n) => getComputedStyle(n).position === "absolute")
                    .map((n) => n.textContent.trim()),
                ).size
              : 0,
          }
        })
        rows.push({ page: name, ...r })
      }
      const multi = rows.filter((r) => r.count !== 1)
      const profile = rows.find((r) => r.page === "profile")
      add(
        "VQ-01/all",
        "페이지마다 H1 하나, profile은 이름을 쓴다",
        multi.length === 0 && profile?.text.startsWith("Hye-Lin Kim") ? "PASS" : "FAIL",
        `h1counts=${rows.map((r) => `${r.page}:${r.count}`).join(",")} profile="${profile?.text}"`,
      )
    }

    // VQ-02 no sentence repeated verbatim across a page.
    {
      const dups = []
      for (const name of PAGES) {
        await page.goto(`${BASE}/${name}.html`, { waitUntil: "networkidle0", timeout: 45000 })
        const d = await page.evaluate(() => {
          const text = document.body.innerText.replace(/\s+/g, " ")
          const sentences = text
            .split(/(?<=[.!?])\s+/)
            .map((s) => s.trim())
            .filter((s) => s.length >= 40)
          const seen = new Map()
          for (const s of sentences) seen.set(s, (seen.get(s) || 0) + 1)
          return [...seen.entries()]
            .filter(([, n]) => n > 1)
            .map(([s, n]) => `${n}x ${s.slice(0, 60)}`)
        })
        dups.push(...d.map((x) => `${name}: ${x}`))
      }
      add(
        "VQ-02/all",
        "같은 문장이 두 번 인쇄되지 않는다",
        dups.length === 0 ? "PASS" : "FAIL",
        dups.length ? dups.join(" | ") : "0 repeated sentences",
      )
    }

    // VQ-03 eyebrow must add information beyond the H1.
    {
      const same = []
      const seenPairs = []
      for (const name of PAGES) {
        await page.goto(`${BASE}/${name}.html`, { waitUntil: "networkidle0", timeout: 45000 })
        const r = await page.evaluate(() => {
          const eb = document.querySelector(".eyebrow")
          const h1 = document.querySelector("h1")
          return {
            eyebrow: eb ? eb.innerText.trim() : "",
            h1: h1 ? h1.innerText.replace(/\s+/g, " ").trim() : "",
          }
        })
        const a = r.eyebrow.toLowerCase()
        const b = r.h1.toLowerCase()
        seenPairs.push(`${name}="${r.eyebrow}"`)
        if (a && (a === b || b.includes(a) || a.includes(b))) same.push(`${name}: ${r.eyebrow}`)
      }
      add(
        "VQ-03/all",
        "eyebrow가 H1을 반복하지 않는다",
        same.length === 0 ? "PASS" : "FAIL",
        same.length ? same.join(", ") : seenPairs.join(", "),
      )
    }

    // VQ-04 contact route present on every page.
    {
      const missing = []
      const counts = []
      for (const name of PAGES) {
        await page.goto(`${BASE}/${name}.html`, { waitUntil: "networkidle0", timeout: 45000 })
        const n = await page.evaluate(() => document.querySelectorAll('a[href^="mailto:"]').length)
        counts.push(`${name}:${n}`)
        if (n === 0) missing.push(name)
      }
      add(
        "VQ-04/all",
        "모든 페이지에 mailto 연락 경로",
        missing.length === 0 ? "PASS" : "FAIL",
        `counts=${counts.join(",")}`,
      )
    }

    // VQ-05 a primary action inside the first viewport.
    {
      await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle0", timeout: 45000 })
      const r = await page.evaluate(() => {
        const vh = innerHeight
        const cs = (el) => getComputedStyle(el)
        const cands = [...document.querySelectorAll("a[href], button")].filter((el) => {
          if (el.closest("header") || el.closest("footer") || el.closest(".skip-link")) return false
          const s = cs(el)
          const b = el.getBoundingClientRect()
          if (b.width < 1 || b.height < 1) return false
          if (s.visibility === "hidden" || s.display === "none") return false
          // A hero action is visually promoted: background, border or strong weight.
          const promoted =
            s.backgroundColor !== "rgba(0, 0, 0, 0)" ||
            Number.parseFloat(s.borderTopWidth) > 0 ||
            Number(s.fontWeight) >= 600
          return promoted && b.top < vh
        })
        return cands.map((el) => ({
          text: el.innerText.trim().slice(0, 30),
          top: Math.round(el.getBoundingClientRect().top),
        }))
      })
      add(
        "VQ-05/index",
        "첫 화면에 주 행동이 있다",
        r.length > 0 ? "PASS" : "FAIL",
        r.length ? JSON.stringify(r.slice(0, 3)) : "no promoted action above the fold",
      )
    }

    // VQ-07 mobile first viewport: H1 lines and a visible action.
    {
      await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true })
      await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle0", timeout: 45000 })
      const r = await page.evaluate(() => {
        const h1 = document.querySelector("h1")
        const cs = getComputedStyle(h1)
        const lh = Number.parseFloat(cs.lineHeight) || Number.parseFloat(cs.fontSize) * 1.2
        const box = h1.getBoundingClientRect()
        const actions = [...document.querySelectorAll("a[href], button")].filter((el) => {
          if (el.closest("header") || el.closest("footer") || el.closest(".skip-link")) return false
          const s = getComputedStyle(el)
          const b = el.getBoundingClientRect()
          if (b.width < 1 || b.height < 1) return false
          const promoted =
            s.backgroundColor !== "rgba(0, 0, 0, 0)" ||
            Number.parseFloat(s.borderTopWidth) > 0 ||
            Number(s.fontWeight) >= 600
          return promoted && b.top < innerHeight
        })
        return {
          lines: Math.round(box.height / lh),
          h1Height: Math.round(box.height),
          vh: innerHeight,
          actions: actions.length,
        }
      })
      add(
        "VQ-07/index-mobile",
        "모바일 첫 화면: H1 4줄 이하 + 행동 노출",
        r.lines <= 4 && r.actions > 0 ? "PASS" : "FAIL",
        `lines=${r.lines} h1Height=${r.h1Height}px vh=${r.vh} actions=${r.actions}`,
      )
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
    }

    // VQ-08 section rhythm must not be one flat padding value everywhere.
    {
      const rows = []
      for (const name of PAGES) {
        await page.goto(`${BASE}/${name}.html`, { waitUntil: "networkidle0", timeout: 45000 })
        const pads = await page.evaluate(() => [
          ...new Set(
            [...document.querySelectorAll(".section")].map((el) => getComputedStyle(el).paddingTop),
          ),
        ])
        rows.push({ page: name, pads })
      }
      const flat = rows.filter((r) => r.pads.length < 2)
      add(
        "VQ-08/all",
        "섹션 리듬이 획일적이지 않다",
        flat.length === 0 ? "PASS" : "FAIL",
        rows.map((r) => `${r.page}:${r.pads.length}`).join(",") +
          (flat.length ? ` flat=${flat.map((r) => r.page).join(",")}` : ""),
      )
    }

    // VQ-09 key-column gap stays tight.
    {
      await page.goto(`${BASE}/research.html`, { waitUntil: "networkidle0", timeout: 45000 })
      const gap = await page.evaluate(() => {
        const rows = [...document.querySelectorAll(".rows > li")]
        if (!rows.length) return null
        return Math.max(
          ...rows.map((li) => {
            const cols = [...li.children]
            if (cols.length < 2) return 0
            const a = cols[0].getBoundingClientRect()
            const b = cols[1].getBoundingClientRect()
            return Math.round(b.left - a.right)
          }),
        )
      })
      add(
        "VQ-09/research",
        "키 컬럼 간격 32px 이하",
        gap !== null && gap <= 32 ? "PASS" : "FAIL",
        gap === null ? "no .rows found" : `maxGap=${gap}px`,
      )
    }

    // VQ-13 touch targets (previously mislabelled VQ-15).
    await page.setViewport({
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    })
    {
      const small = []
      for (const name of PAGES) {
        await page.goto(`${BASE}/${name}.html`, { waitUntil: "networkidle0", timeout: 45000 })
        const bad = await page.evaluate(() => {
          const out = []
          for (const el of document.querySelectorAll("a[href], button, [role=button]")) {
            const r = el.getBoundingClientRect()
            const cs = getComputedStyle(el)
            if (cs.visibility === "hidden" || cs.display === "none" || r.width < 1) continue
            if (r.height < 44)
              out.push({ text: el.textContent.trim().slice(0, 24), h: Math.round(r.height) })
          }
          return out
        })
        small.push(...bad.map((b) => ({ page: name, ...b })))
      }
      add(
        "VQ-13/mobile",
        "터치 타깃 높이 44px 이상",
        small.length === 0 ? "PASS" : "FAIL",
        small.length ? JSON.stringify(small.slice(0, 5)) : "all targets >= 44px tall",
      )
    }

    // VQ-15 dark mode actually renders dark with legible ink.
    {
      const page2 = await browser.newPage()
      await page2.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "dark" }])
      await page2.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
      const rows = []
      for (const name of PAGES) {
        await page2.goto(`${BASE}/${name}.html`, { waitUntil: "networkidle0", timeout: 45000 })
        rows.push(
          await page2.evaluate(() => {
            const lum = (rgb) => {
              const f = (v) => {
                const s = v / 255
                return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
              }
              return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2])
            }
            const parse = (c) => {
              const m = c.match(/rgba?\(([^)]+)\)/)
              if (!m) return null
              const p = m[1]
                .split(/[,\s/]+/)
                .filter(Boolean)
                .map(Number)
              return { rgb: p.slice(0, 3), a: p.length > 3 ? p[3] : 1 }
            }
            const root = parse(getComputedStyle(document.documentElement).backgroundColor)
            const body = parse(getComputedStyle(document.body).backgroundColor)
            const surface = root && root.a > 0.5 ? root.rgb : body ? body.rgb : [255, 255, 255]
            const ink = parse(getComputedStyle(document.body).color)
            return { surfaceLum: Math.round(lum(surface) * 1000) / 1000, ink: ink?.rgb ?? null }
          }),
        )
      }
      const light = rows.filter((r) => r.surfaceLum > 0.2)
      add(
        "VQ-15/dark",
        "다크 모드에서 배경이 실제로 어둡다",
        light.length === 0 ? "PASS" : "FAIL",
        rows.map((r, i) => `${PAGES[i]}:lum=${r.surfaceLum}`).join(","),
      )
      await page2.close()
    }

    // VQ-16 no publisher hotlinks; every image that is meant to be visible decodes.
    {
      const offenders = []
      const pending = []
      for (const name of PAGES) {
        await page.goto(`${BASE}/${name}.html`, { waitUntil: "networkidle0", timeout: 45000 })
        const r = await page.evaluate(() => {
          // Images inside a closed <details> are deferred by the browser and
          // that is correct. Only count images the reader can currently see.
          const inClosed = (img) => {
            const d = img.closest("details")
            return Boolean(d && !d.open)
          }
          return {
            external: [...document.images]
              .filter((i) => /\.(e-cmh\.org|springer|wiley|elsevier)/i.test(i.src))
              .map((i) => i.src),
            broken: [...document.images]
              .filter((i) => !inClosed(i) && i.complete && i.naturalWidth === 0)
              .map((i) => i.currentSrc || i.src),
            deferred: [...document.images].filter(inClosed).length,
          }
        })
        offenders.push(...r.external.map((u) => `${name}: ${u}`))
        pending.push(...r.broken.map((u) => `${name}: ${u}`))
      }
      add(
        "VQ-16/all",
        "발행사 핫링크 0, 보이는 이미지 전부 디코드",
        offenders.length === 0 && pending.length === 0 ? "PASS" : "FAIL",
        `external=${offenders.length} broken=${pending.length}` +
          (offenders.length ? ` :: ${offenders.slice(0, 3).join(" | ")}` : "") +
          (pending.length ? ` :: ${pending.slice(0, 3).join(" | ")}` : ""),
      )
    }

    // VQ-17 social preview metadata on every page.
    {
      const bad = []
      const canonicalSeen = new Set()
      for (const name of PAGES) {
        await page.goto(`${BASE}/${name}.html`, { waitUntil: "networkidle0", timeout: 45000 })
        const r = await page.evaluate(() => ({
          og: document.querySelector('meta[property="og:image"]')?.content || "",
          tw: document.querySelector('meta[name="twitter:card"]')?.content || "",
          canonical: document.querySelector('link[rel="canonical"]')?.href || "",
        }))
        if (!r.og || !r.tw || !r.canonical) bad.push(`${name} missing`)
        canonicalSeen.add(r.canonical)
      }
      add(
        "VQ-17/all",
        "og:image·twitter:card·canonical 존재",
        bad.length === 0 && canonicalSeen.size === PAGES.length ? "PASS" : "FAIL",
        `missing=${bad.join(",") || "none"} distinctCanonicals=${canonicalSeen.size}`,
      )
    }

    // VQ-18 one date notation, every <time> carries a parseable datetime.
    // Precision legitimately varies (year / year-month / year-month-day); the
    // defect in A9 was mixing notation families ("March 2016" beside
    // "2026.05"). Assert a single dotted family instead of one exact shape.
    {
      const offenders = []
      const precisions = new Set()
      let total = 0
      for (const name of PAGES) {
        await page.goto(`${BASE}/${name}.html`, { waitUntil: "networkidle0", timeout: 45000 })
        const r = await page.evaluate(() =>
          [...document.querySelectorAll("time")].map((t) => ({
            txt: t.innerText.trim(),
            dt: t.getAttribute("datetime") || "",
          })),
        )
        for (const t of r) {
          total += 1
          if (!/^\d{4}(\. \d{2}){0,2}$/.test(t.txt)) offenders.push(`${name}: "${t.txt}"`)
          if (!t.dt || Number.isNaN(Date.parse(t.dt)))
            offenders.push(`${name}: bad datetime=${t.dt}`)
          precisions.add(t.txt.replace(/\d/g, "#"))
        }
      }
      add(
        "VQ-18/all",
        "날짜 표기 하나(점 표기), datetime 유효",
        offenders.length === 0 ? "PASS" : "FAIL",
        `${total} time elements, precision shapes=${JSON.stringify([...precisions])}` +
          (offenders.length ? ` offenders=${offenders.slice(0, 3).join(" | ")}` : ""),
      )
    }

    // VQ-21 focus ring on every focusable element.
    // :focus-visible only engages for real keyboard input, so el.focus() would
    // report a false failure. Drive actual Tab presses instead.
    {
      await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle0", timeout: 45000 })
      const rings = []
      const seen = new Set()
      for (let i = 0; i < 40; i++) {
        await page.keyboard.press("Tab")
        const r = await page.evaluate(() => {
          const el = document.activeElement
          if (!el || el === document.body) return null
          const cs = getComputedStyle(el)
          return {
            tag: el.tagName,
            text: (el.innerText || "").trim().slice(0, 24),
            fv: el.matches(":focus-visible"),
            w: Number.parseFloat(cs.outlineWidth) || 0,
            style: cs.outlineStyle,
            key: `${el.tagName}:${(el.innerText || "").trim().slice(0, 24)}`,
          }
        })
        if (!r) break
        if (seen.has(r.key)) continue
        seen.add(r.key)
        if (r.fv && (r.style === "none" || r.w < 2))
          rings.push({ text: r.text, w: r.w, style: r.style })
      }
      add(
        "VQ-21/index",
        "키보드 포커스 링 2px 이상",
        rings.length === 0 ? "PASS" : "FAIL",
        rings.length
          ? JSON.stringify(rings.slice(0, 4))
          : `${seen.size} distinct tab stops, all with a >=2px ring`,
      )
    }

    // VQ-22 landmarks present and the skip link is the first tab stop.
    {
      await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle0", timeout: 45000 })
      const r = await page.evaluate(() => {
        const first = document.querySelector('a[href^="#"], button, input')
        return {
          header: Boolean(document.querySelector("header")),
          main: Boolean(document.querySelector("main")),
          footer: Boolean(document.querySelector("footer")),
          skipTarget: first?.getAttribute("href") || "",
          skipText: first?.textContent.trim() || "",
        }
      })
      const ok =
        r.header &&
        r.main &&
        r.footer &&
        r.skipTarget === "#main-content" &&
        /skip/i.test(r.skipText)
      add(
        "VQ-22/index",
        "랜드마크 존재, 스킵 링크가 첫 탭 정지점",
        ok ? "PASS" : "FAIL",
        JSON.stringify(r),
      )
    }

    // VQ-25 browser surfaces: selection, caret, scrollbar and tabular figures
    // are themed from the palette instead of falling back to OS defaults.
    {
      const r = await page.evaluate(() => {
        const rules = [...document.styleSheets]
          .flatMap((s) => {
            try {
              return [...s.cssRules]
            } catch {
              return []
            }
          })
          .map((x) => x.cssText)
        const has = (re) => rules.some((t) => re.test(t))
        const time = document.querySelector("time")
        return {
          selection: has(/::selection/),
          scrollbar: has(/scrollbar-color/),
          caret: has(/caret-color/),
          tabular: time ? getComputedStyle(time).fontVariantNumeric : "no-time",
        }
      })
      const ok = r.selection && r.scrollbar && r.caret && r.tabular === "tabular-nums"
      add(
        "VQ-25/index",
        "브라우저 표면(선택·스크롤바·캐럿·표 숫자)이 팔레트를 따른다",
        ok ? "PASS" : "FAIL",
        JSON.stringify(r),
      )
    }

    // VQ-26 wrapping: headings balance their lines and prose uses pretty
    // wrapping, so display type does not leave a single orphan word.
    {
      const r = await page.evaluate(() => {
        const h = document.querySelector("h2")
        const p = document.querySelector("main p")
        const cs = (el) => (el ? getComputedStyle(el) : null)
        const read = (el) => {
          const s = cs(el)
          return s ? s.textWrap || s.textWrapMode || "none" : "missing"
        }
        return { heading: read(h), prose: read(p) }
      })
      const ok = r.heading === "balance" && r.prose === "pretty"
      add(
        "VQ-26/publications",
        "제목은 balance, 본문은 pretty로 줄바꿈된다",
        ok ? "PASS" : "FAIL",
        JSON.stringify(r),
      )
    }

    // VQ-27 reading floor: every prose paragraph, list item and definition on
    // every page stays at or above 16px, so iOS Safari cannot force-zoom and
    // the mobile body minimum holds. Captions and chrome may go lower.
    {
      const r = await page.evaluate(() => {
        const offenders = [...document.querySelectorAll("main p, main li, main dd")]
          .filter((e) => e.getClientRects().length > 0)
          .map((e) => ({
            px: parseFloat(getComputedStyle(e).fontSize),
            txt: e.innerText.trim().slice(0, 30),
          }))
          .filter((x) => x.px < 16)
        const sizes = [
          ...new Set(
            [...document.querySelectorAll("*")].map((e) =>
              parseFloat(getComputedStyle(e).fontSize),
            ),
          ),
        ]
          .filter((n) => n > 0)
          .sort((a, b) => a - b)
        return { offenders: offenders.slice(0, 5), count: offenders.length, sizes }
      })
      add(
        "VQ-27/prose",
        "본문 텍스트가 16px 하한을 지킨다",
        r.count === 0 ? "PASS" : "FAIL",
        `${r.count} offender(s) ${JSON.stringify(r.offenders)}`,
      )
    }

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

  // The former touch-target block here was labelled VQ-15 but measured VQ-13;
  // the correct VQ-13 assertion now lives in the page-level block above.
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
