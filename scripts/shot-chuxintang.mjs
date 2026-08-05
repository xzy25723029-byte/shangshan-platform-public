/* 初心堂丰富版视觉验证截图脚本 */
import { chromium } from "playwright";

const exe = "C:/Users/ydx15/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe";
const base = "http://localhost:4174";

const shots = [
  { name: "home", route: "/#/student/home" },
  { name: "scientist-hall", route: "/#/student/scientist-hall" },
  { name: "energy-flow", route: "/#/student/energy-flow" },
];

const browser = await chromium.launch({ executablePath: exe, headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

// 学生登录
await page.goto(base + "/#/login");
await page.waitForTimeout(600);
const demo = page.locator(".demo-item").first();
await demo.click();
if (false) {
  await inputs.nth(0).fill("student");
  await inputs.nth(1).fill("123456");
  await page.getByRole("button", { name: /登\s*录/ }).first().click();
  await page.waitForTimeout(1200);
}

for (const s of shots) {
  await page.goto(base + s.route);
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `C:/Users/ydx15/AppData/Local/Temp/shots/${s.name}.png`, fullPage: true });
  console.log("shot:", s.name);
}

// 能量流滑块交互：拖动去除率滑块看数值变化
await page.goto(base + "/#/student/energy-flow");
await page.waitForTimeout(1200);
const slider = page.locator(".ef-slider input[type=range]").nth(2);
const before = await page.locator(".ef-num b").first().textContent();
await slider.fill("50");
await page.waitForTimeout(500);
const after = await page.locator(".ef-num b").nth(1).textContent();
console.log("mass in before/after:", before, after);

await browser.close();
