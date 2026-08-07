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
  for (const el of document.querySelectorAll("a")) {
    const cs = getComputedStyle(el);
    if (cs.color === "rgb(0, 0, 238)") {
      const chain = [];
      let p = el;
      for (let i = 0; i < 3 && p; i++) { chain.push(p.tagName + "." + String(p.className).slice(0, 30)); p = p.parentElement; }
      out.push({ href: el.getAttribute("href"), text: (el.textContent || "").trim().slice(0, 16), chain: chain.join(" < ") });
    }
  }
  return out.slice(0, 10);
});
console.log(JSON.stringify(found, null, 1));
await browser.close();
