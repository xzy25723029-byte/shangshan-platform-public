/* 云端部署验证：真实浏览器访问 EdgeOne 域名 */
import { chromium } from "playwright";
const exe = "C:/Users/ydx15/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe";
const BASE = process.env.CLOUD_URL || "https://shangshan.pages.dev"; /* 云端部署验证：真实浏览器跑全流程（curl 会被 eo_time 防爬拦 401，属正常） */
const browser = await chromium.launch({ executablePath: exe, headless: true });

const errs = [];
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
page.on("pageerror", (e) => errs.push("PAGEERROR: " + String(e).slice(0, 120)));
page.on("console", (m) => { if (m.type() === "error") errs.push(m.text().slice(0, 100)); });

// 1. 首页
await page.goto(BASE + "/");
await page.waitForTimeout(3500);
console.log("首页 URL:", page.url().slice(0, 60));
console.log("首页标题:", (await page.title()).slice(0, 40));
const bodyText = (await page.locator("body").innerText()).slice(0, 120);
console.log("首页文本:", bodyText.replace(/\n/g, " ").slice(0, 100));

// 2. 登录
await page.goto(BASE + "/#/login");
await page.waitForTimeout(2500);
console.log("登录页 demo-item:", await page.locator(".demo-item").count());
if (await page.locator(".demo-item").count() > 0) {
  await page.locator(".demo-item").first().click({ force: true });
  await page.waitForTimeout(3500);
  console.log("登录后 URL:", page.url().slice(0, 60));
  console.log("进入初心堂:", (await page.locator("body").innerText()).includes("初心堂"));
  console.log("核心理念:", (await page.locator("body").innerText()).includes("实事求是"));
  console.log("毛体图加载:", await page.locator(".self-photo").evaluate((el) => el.naturalWidth > 0).catch(() => false));
  console.log("楷模照片数:", await page.locator(".model-photo img").count());
  const photoOK = await page.locator(".model-photo img").evaluateAll((imgs) => imgs.map((i) => i.naturalWidth > 0).filter(Boolean).length);
  console.log("楷模照片加载成功:", photoOK, "/", await page.locator(".model-photo img").count());
  await page.screenshot({ path: "C:/Users/ydx15/AppData/Local/Temp/shots/cloud-home.png", fullPage: true });
}

// 3. 精神馆 + 能量流
await page.goto(BASE + "/#/student/scientist-hall");
await page.waitForTimeout(2500);
const shPhotos = await page.locator(".sh-photo img").evaluateAll((imgs) => imgs.map((i) => i.naturalWidth > 0).filter(Boolean).length);
console.log("精神馆照片加载:", shPhotos, "/", await page.locator(".sh-photo img").count());
await page.goto(BASE + "/#/student/energy-flow");
await page.waitForTimeout(2500);
console.log("能量流动画区:", await page.locator(".ef-canvas svg").count(), "| 滑块:", await page.locator(".ef-slider input").count());

console.log("控制台错误:", errs.slice(0, 4));
await browser.close();
