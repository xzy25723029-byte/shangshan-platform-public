import { chromium } from "playwright";
const exe = "C:/Users/ydx15/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe";
const browser = await chromium.launch({ executablePath: exe, headless: true });
const page = await (await browser.newContext()).newPage();
const errs = [];
page.on("pageerror", (e) => errs.push(String(e).slice(0, 100)));
page.on("console", (m) => { if (m.type() === "error") errs.push(m.text().slice(0, 100)); });

// 先注册一个 pending 用户
await page.goto("http://127.0.0.1:4173/#/login");
await page.waitForTimeout(1200);
await page.evaluate(() => localStorage.removeItem("ss_formal_users"));
await page.locator(".mode-switch button").nth(1).click();
await page.locator(".formal-form input").nth(0).fill("王小卓");
await page.locator(".formal-form input").nth(1).fill("wangxz@bjtu.edu.cn");
await page.locator(".formal-form input").nth(2).fill("abc123456");
await page.locator(".formal-form input").nth(3).fill("STU2026");
await page.getByRole("button", { name: /注册并进入/ }).click();
await page.waitForTimeout(2000);

// 退出 → admin
await page.locator("button:has-text('退出登录')").first().click();
await page.waitForTimeout(1500);
await page.locator(".demo-item").nth(2).click({ force: true });
await page.waitForTimeout(2000);
await page.goto("http://127.0.0.1:4173/#/admin/users");
await page.waitForTimeout(2000);
console.log("表格行数:", await page.locator("tbody tr").count());
console.log("页面文本:", (await page.locator("body").innerText()).slice(0, 200).replace(/\n/g, " "));

const btn = page.locator("tbody tr:has-text('王小卓') button:has-text('通过')");
console.log("通过按钮数:", await btn.count());
await btn.click();
await page.waitForTimeout(2000);
console.log("点击后页面文本:", (await page.locator("body").innerText()).slice(0, 250).replace(/\n/g, " "));
console.log("错误:", errs.slice(0, 4));
await browser.close();
