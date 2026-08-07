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
    const cs = getComputedStyle(el);
    for (const prop of ["color", "backgroundColor", "borderTopColor"]) {
      const c = cs[prop];
      if (/^rgba?\(/.test(c)) {
        const [r, g, b] = c.match(/\d+/g).map(Number);
        // hsl(240,100%,47%)=rgb(0,0,120) 附近 或 红色 rgb(222,88,88) 附近
        if ((r < 30 && g < 30 && b > 100 && b < 140) || (r > 200 && g < 120 && b < 120)) {
          out.push({ tag: el.tagName, cls: String(el.className).slice(0, 40), prop, c, rgb: `${r},${g},${b}` });
        }
      }
    }
    if (out.length > 14) break;
  }
  return out;
});
console.log(JSON.stringify(found, null, 1));
await browser.close();
