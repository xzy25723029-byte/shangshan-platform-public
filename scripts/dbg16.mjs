import { chromium } from "playwright";
const exe = "C:/Users/ydx15/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe";
const browser = await chromium.launch({ executablePath: exe, headless: true });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto("http://127.0.0.1:4173/#/login");
await page.waitForTimeout(700);
await page.locator(".demo-item").first().click({ force: true });
await page.waitForTimeout(1500);
const found = await page.evaluate(() => {
  const out = [];
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || r.width < 2) continue;
    for (const prop of ["color", "backgroundColor"]) {
      const v = cs[prop];
      if (/^rgba?\(/.test(v)) {
        const [rr, gg, bb] = v.match(/\d+/g).map(Number);
        // 蓝：b 明显大于 r,g 且 b>200
        if (bb > 200 && rr < 60 && gg < 60) out.push({ tag: el.tagName, cls: String(el.className).slice(0, 40), prop, v });
      }
    }
  }
  return out.slice(0, 8);
});
console.log(JSON.stringify(found, null, 1));
await browser.close();
