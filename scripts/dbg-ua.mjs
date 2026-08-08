import { chromium } from "playwright";
const exe = "C:/Users/ydx15/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe";
const BASE = "https://shangshan-platform-5tstn20u.edgeone.cool";
const browser = await chromium.launch({ executablePath: exe, headless: true });

const uas = [
  ["微信安卓", "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36 MicroMessenger/8.0.49.2580(0x28003135) NetType/WIFI Language/zh_CN"],
  ["微信iOS", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.49(0x18003135) NetType/WIFI Language/zh_CN"],
  ["Chrome桌面", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"],
  ["Chrome安卓", "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36"],
];

for (const [name, ua] of uas) {
  const ctx = await browser.newContext({ userAgent: ua, viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  let status = "?";
  page.on("response", (r) => { if (r.url().includes("edgeone.cool") && r.request().resourceType() === "document") status = r.status(); });
  try {
    await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(2000);
    const title = (await page.title()).slice(0, 24);
    console.log(name, "| 状态:", status, "| 标题:", title);
  } catch (e) {
    console.log(name, "| 状态:", status, "| 错误:", String(e).slice(0, 60));
  }
  await ctx.close();
}
await browser.close();
