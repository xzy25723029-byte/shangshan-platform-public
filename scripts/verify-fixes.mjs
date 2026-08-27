/* 体验反馈三项修复验证 */
import { chromium } from "playwright";
const exe = "D:/dev/caches/playwright/chromium-1234/chrome-win64/chrome.exe";
const BASE = "http://127.0.0.1:4173";
const browser = await chromium.launch({ executablePath: exe, headless: true });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const errs = [];
page.on("pageerror", (e) => errs.push(String(e).slice(0, 90)));

await page.goto(BASE + "/#/login"); await page.waitForTimeout(1200);
await page.locator(".demo-item").first().click({ force: true }); await page.waitForTimeout(2000);

// ① B站内嵌播放器
await page.goto(BASE + "/#/student/layer1/paper-figure"); await page.waitForTimeout(2000);
const videoRows = await page.locator(".video-cols .video-row").count();
const playerBefore = await page.locator(".video-player").count();
await page.locator(".video-cols .video-row .video-link").first().click();
await page.waitForTimeout(1200);
const playerAfter = await page.locator(".video-player").count();
const iframeSrc = await page.locator(".video-player iframe").getAttribute("src").catch(() => "");
console.log("① 视频行:", videoRows, "| 点击前播放器:", playerBefore, "→ 点击后:", playerAfter, "| iframe:", (iframeSrc || "").includes("player.bilibili.com") ? "B站内嵌 ✓" : iframeSrc.slice(0, 40));

// ② 返回按钮
const backBtn = await page.locator(".back-btn").count();
await page.locator(".back-btn").click(); await page.waitForTimeout(1200);
console.log("② 返回按钮:", backBtn ? "有 ✓" : "无!", "| 返回后:", page.url().includes("/layer1") ? "回到第1层 ✓" : page.url().slice(0, 50));

// ③ 学习地图手机端
const mpage = await (await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
await mpage.goto(BASE + "/#/login"); await mpage.waitForTimeout(1200);
await mpage.locator(".demo-item").first().click({ force: true }); await mpage.waitForTimeout(2000);
await mpage.goto(BASE + "/#/student/map"); await mpage.waitForTimeout(2000);
const mob = await mpage.evaluate(() => ({
  canvasShown: getComputedStyle(document.querySelector(".map-canvas")).display !== "none",
  listShown: getComputedStyle(document.querySelector(".map-list")).display !== "none",
  listCards: document.querySelectorAll(".map-list-nodes button").length,
  flowStrip: document.querySelectorAll(".flow-strip-list li").length,
  docW: document.documentElement.scrollWidth,
  innerW: window.innerWidth,
}));
console.log("③ 手机地图:", JSON.stringify(mob));

// 桌面全流程带
const desktopFlow = await page.evaluate(() => ({
  flow: document.querySelectorAll(".flow-strip-list li").length,
  cases: document.querySelectorAll(".case-card").length,
}));
await page.goto(BASE + "/#/student/map"); await page.waitForTimeout(2200);
const d2 = await page.evaluate(() => ({
  flow: document.querySelectorAll(".flow-strip-list li").length,
  cases: document.querySelectorAll(".case-card").length,
}));
console.log("④ 全流程带/案例:", JSON.stringify(d2));
console.log("控制台错误:", errs.length ? errs.slice(0, 3) : "无");
await browser.close();
