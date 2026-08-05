/* 桌面+手机双视口截图验证 S 型水流布局 */
import { chromium } from "playwright";
const exe = "C:/Users/ydx15/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe";
const base = "http://127.0.0.1:4173";
const browser = await chromium.launch({ executablePath: exe, headless: true });

// 桌面 1440
const dctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const dpage = await dctx.newPage();
await dpage.goto(base + "/#/login");
await dpage.waitForTimeout(700);
await dpage.locator(".demo-item").first().click({ force: true });
await dpage.waitForURL("**/#/student/home");
await dpage.waitForTimeout(1500);
const totalH = await dpage.evaluate(() => document.body.scrollHeight);
console.log("桌面 页面总高:", totalH, "px");
await dpage.screenshot({ path: "C:/Users/ydx15/AppData/Local/Temp/shots/home-s.png", fullPage: true });

// 手机 390×844
const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const mpage = await mctx.newPage();
await mpage.goto(base + "/#/login");
await mpage.waitForTimeout(700);
await mpage.locator(".demo-item").first().click({ force: true });
await mpage.waitForURL("**/#/student/home");
await mpage.waitForTimeout(1500);
const mH = await mpage.evaluate(() => document.body.scrollHeight);
console.log("手机 页面总高:", mH, "px");
await mpage.screenshot({ path: "C:/Users/ydx15/AppData/Local/Temp/shots/home-m.png", fullPage: true });

// 验证手机端卡片横向滚动
const scrollW = await mpage.evaluate(() => {
  const g = document.querySelector(".stage-grid");
  return g ? { client: g.clientWidth, scroll: g.scrollWidth } : null;
});
console.log("手机 阶段卡片横向滚动:", JSON.stringify(scrollW));
await browser.close();
