/* 正式模式端到端验证：注册 → 登录 → 顶栏标识 */
import { chromium } from "playwright";
const exe = "C:/Users/ydx15/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe";
const BASE = "https://shangshan.pages.dev";
const browser = await chromium.launch({ executablePath: exe, headless: true });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const errs = [];
page.on("pageerror", (e) => errs.push(String(e).slice(0, 100)));

await page.goto(BASE + "/#/login");
await page.waitForTimeout(1500);

// 1. 切换到正式模式
await page.locator(".mode-switch button").nth(1).click();
await page.waitForTimeout(300);
console.log("正式模式可见:", await page.locator(".formal-form").count() === 1);

// 2. 填写注册表单
await page.locator(".formal-form input").nth(0).fill("测试学员");
await page.locator(".formal-form input").nth(1).fill("13800138000");
await page.getByRole("button", { name: "发送验证码" }).click();
await page.waitForTimeout(800);
const hint = await page.locator(".sms-hint").textContent();
console.log("验证码提示:", hint.trim());

// 3. 输入验证码提交注册
await page.locator(".formal-form input").nth(2).fill("123456");
await page.getByRole("button", { name: /注册并进入/ }).click();
await page.waitForTimeout(2500);
console.log("注册后 URL:", page.url().slice(0, 60));

// 4. 顶栏标识
const profile = await page.locator(".profile span").first().textContent();
console.log("顶栏标识:", profile.trim());

// 5. 退出后手机号登录
await page.locator(".profile").click();
await page.waitForTimeout(600);
await page.getByText("退出登录").click();
await page.waitForTimeout(1500);
await page.locator(".mode-switch button").nth(1).click();
await page.getByRole("button", { name: "手机号登录" }).click();
await page.locator(".formal-form input").nth(0).fill("13800138000");
await page.getByRole("button", { name: "发送验证码" }).click();
await page.waitForTimeout(600);
await page.locator(".formal-form input").nth(1).fill("123456");
await page.getByRole("button", { name: /^登\s*录$/ }).click();
await page.waitForTimeout(2500);
console.log("手机号登录 →", page.url().includes("/student/home") ? "初心堂 OK" : page.url().slice(0, 50));

// 6. 微信按钮提示
await page.locator(".profile").click();
await page.waitForTimeout(400);
await page.getByText("退出登录").click();
await page.waitForTimeout(1200);
await page.locator(".mode-switch button").nth(1).click();
await page.locator(".wechat-btn").click();
await page.waitForTimeout(400);
console.log("微信提示:", (await page.locator(".login-error").textContent()).slice(0, 40));

console.log("控制台错误:", errs.slice(0, 3));
await browser.close();
