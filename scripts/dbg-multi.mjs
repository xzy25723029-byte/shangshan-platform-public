import { chromium } from "playwright";
const exe = "C:/Users/ydx15/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe";
const BASE = "https://shangshan-platform-5tstn20u.edgeone.cool";
const browser = await chromium.launch({ executablePath: exe, headless: true });

// 实验1：连续3次访问（每次新会话），看是否间歇性
for (let i = 1; i <= 3; i++) {
  const page = await (await browser.newContext()).newPage();
  let st = "?";
  page.on("response", (r) => { if (r.url() === BASE + "/" && r.request().resourceType() === "document") st = r.status(); });
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1800);
  console.log(`实验1-${i}: 状态=${st} 标题=${(await page.title()).slice(0, 22)}`);
  await page.context().close();
}

// 实验2：带查询参数
const page2 = await (await browser.newContext()).newPage();
let st2 = "?";
page2.on("response", (r) => { if (r.url().startsWith(BASE)) st2 = r.status(); });
await page2.goto(BASE + "/?t=1", { waitUntil: "domcontentloaded", timeout: 20000 }).catch(() => {});
await page2.waitForTimeout(1500);
console.log(`实验2-带参数: 状态=${st2}`);

// 实验3：直接访问 index.html
const page3 = await (await browser.newContext()).newPage();
let st3 = "?";
page3.on("response", (r) => { if (r.url().startsWith(BASE)) st3 = r.status(); });
await page3.goto(BASE + "/index.html", { waitUntil: "domcontentloaded", timeout: 20000 }).catch(() => {});
await page3.waitForTimeout(1500);
console.log(`实验3-index.html: 状态=${st3}`);
await browser.close();
