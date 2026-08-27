/* ============================================================
   审美与布局审计（参考 GitHub: deterministic-design-skill 的
   测量法 + frontend-design-audit 的 15 设计原则）
   逐页测量：点击目标尺寸 / 字体数量 / 圆角一致性 / 色彩 /
   文本对比度 / 布局对齐 / 间距节奏
   ============================================================ */
import { chromium } from "playwright";

const exe = "D:/dev/caches/playwright/chromium-1234/chrome-win64/chrome.exe";
const BASE = "http://127.0.0.1:4173";

const routes = [
  ["home", "/#/student/home"],
  ["scientist-hall", "/#/student/scientist-hall"],
  ["energy-flow", "/#/student/energy-flow"],
  ["first-lesson", "/#/student/first-lesson"],
  ["guiding-principles", "/#/student/guiding-principles"],
  ["triple-core", "/#/student/triple-core"],
  ["oath", "/#/student/oath"],
  ["thought-notes", "/#/student/thought-notes"],
  ["hard-bone", "/#/student/hard-bone"],
  ["cognitive-profile", "/#/student/cognitive-profile"],
  ["ai-mentor", "/#/student/ai-mentor"],
  ["voice", "/#/student/voice"],
  ["map", "/#/student/map"],
  ["layer1", "/#/student/layer1"],
  ["review", "/#/mentor/review"],
  ["people", "/#/admin/people"],
];

const browser = await chromium.launch({ executablePath: exe, headless: true });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();

await page.goto(`${BASE}/#/login`);
await page.waitForTimeout(700);
await page.locator(".demo-item").first().click({ force: true });
await page.waitForURL("**/#/student/home");
await page.waitForTimeout(1000);

const report = {};

for (const [name, route] of routes) {
  await page.goto(`${BASE}${route}`);
  await page.waitForTimeout(900);

  const m = await page.evaluate(() => {
    const vis = (el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return cs.display !== "none" && cs.visibility !== "hidden" && r.width > 2 && r.height > 2;
    };
    const hsl = (r, g, b) => {
      r /= 255; g /= 255; b /= 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      const l = (max + min) / 2;
      let h = 0, s = 0;
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) h = ((g - b) / d + (g < b ? 6 : 0));
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        h *= 60;
      }
      return [h, s * 100, l * 100];
    };
    const lum = (c) => {
      const [r, g, b] = c.match(/\d+/g).map(Number).map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const contrast = (c1, c2) => {
      const l1 = lum(c1), l2 = lum(c2);
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    };

    /* 1. 点击目标尺寸（<40px 报小，40-44 提示） */
    const small = [];
    const smallWarn = [];
    for (const el of document.querySelectorAll("button, a[href], [role='button'], input[type=submit]")) {
      if (!vis(el)) continue;
      const r = el.getBoundingClientRect();
      const t = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 14) || el.getAttribute("aria-label") || "";
      if (r.width < 34 && r.height < 34) small.push(`${t} ${Math.round(r.width)}x${Math.round(r.height)}`);
      else if (r.width < 40 || r.height < 40) smallWarn.push(`${t} ${Math.round(r.width)}x${Math.round(r.height)}`);
    }

    /* 2. 字体家族数量（正文/标题） */
    const fonts = new Set();
    document.querySelectorAll("h1,h2,h3,h4,p,span,a,button,li,td").forEach((el) => {
      if (vis(el) && el.textContent.trim()) fonts.add(getComputedStyle(el).fontFamily.split(",")[0].replace(/['"]/g, ""));
    });

    /* 3. 圆角分布（卡片/按钮） */
    const radii = new Set();
    document.querySelectorAll(".card, .btn, button, .f-icon, .stage-node").forEach((el) => {
      if (vis(el)) {
        const r = getComputedStyle(el).borderRadius;
        if (r !== "0px") radii.add(r);
      }
    });

    /* 4. 高饱和 accent 色种类（饱和度 > 60%） */
    const accents = new Set();
    document.querySelectorAll("body *").forEach((el) => {
      if (!vis(el)) return;
      const cs = getComputedStyle(el);
      for (const prop of ["color", "backgroundColor"]) {
        const c = cs[prop];
        if (/^rgba?\(/.test(c)) {
          const [r, g, b] = c.match(/\d+/g).map(Number);
          const [, s, l] = hsl(r, g, b);
          if (s > 60 && l > 25 && l < 82) accents.add(`hsl(${Math.round(hsl(r, g, b)[0])},${Math.round(s)}%,${Math.round(l)}%)`);
        }
      }
    });

    /* 5. 文本对比度抽查：按钮文本 vs 按钮背景 */
    const lowContrast = [];
    const seen = new Set();
    document.querySelectorAll("button, .btn").forEach((el) => {
      if (!vis(el) || !el.textContent.trim()) return;
      const cs = getComputedStyle(el);
      const tc = cs.color, bc = cs.backgroundColor;
      if (!/^rgba?\(/.test(tc) || !/^rgba?\(/.test(bc) || bc === "rgba(0, 0, 0, 0)") return;
      const key = `${tc}|${bc}`;
      if (seen.has(key)) return;
      seen.add(key);
      const ratio = contrast(tc, bc);
      if (ratio < 3.5) lowContrast.push(`${(el.textContent || "").trim().slice(0, 10)}: ${ratio.toFixed(2)}`);
    });

    /* 6. 布局对齐：卡片网格 x 起点集合 */
    const xs = new Set();
    document.querySelectorAll(".card").forEach((el) => {
      if (vis(el) && el.getBoundingClientRect().width > 60) xs.add(Math.round(el.getBoundingClientRect().x));
    });

    /* 7. 页面总高与可视高度比（过长检测） */
    const scrollH = document.documentElement.scrollHeight;

    return {
      smallTargets: small.slice(0, 12),
      smallCount: small.length,
      smallWarnCount: smallWarn.length,
      fonts: [...fonts].slice(0, 10),
      radii: [...radii].slice(0, 12),
      accents: [...accents].slice(0, 12),
      accentCount: accents.size,
      lowContrast: lowContrast.slice(0, 8),
      cardXs: [...xs].slice(0, 10),
      scrollH,
    };
  });

  report[name] = m;
}

await browser.close();
console.log(JSON.stringify(report, null, 1));
