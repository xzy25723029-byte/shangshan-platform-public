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
    for (const prop of ["color", "backgroundColor", "borderColor", "outlineColor"]) {
      const v = cs[prop];
      if (/^rgba?\(0, 0, 24/.test(v)) {
        out.push({ tag: el.tagName, cls: String(el.className).slice(0, 50), prop, v });
      }
    }
  }
  return out.slice(0, 10);
});
console.log(JSON.stringify(found, null, 1));
await browser.close();
