/* 邮箱注册审核闭环端到端验证（同一浏览器串行，共享 localStorage） */
import { chromium } from "playwright";
const exe = "C:/Users/ydx15/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe";
const BASE = process.env.CLOUD_URL || "http://127.0.0.1:4173";
const browser = await chromium.launch({ executablePath: exe, headless: true });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const errs = [];
page.on("pageerror", (e) => errs.push(String(e).slice(0, 80)));

const go = (p) => page.goto(BASE + p, { waitUntil: "load" }).catch(() => {});
const sleep = (ms) => page.waitForTimeout(ms);

// 0. 清理旧数据
await go("/#/login"); await sleep(1200);
await page.evaluate(() => localStorage.removeItem("ss_formal_users"));

// 1. 正式模式注册（邮箱+邀请码）→ 等待审核页
await go("/#/login"); await sleep(1500);
await page.locator(".mode-switch button").nth(1).click();
await page.locator(".formal-form input").nth(0).fill("王小卓");
await page.locator(".formal-form input").nth(1).fill("wangxz@bjtu.edu.cn");
await page.locator(".formal-form input").nth(2).fill("abc123456");
await page.locator(".formal-form input").nth(3).fill("STU2026");
await page.getByRole("button", { name: /注册并进入/ }).click();
await sleep(2500);
console.log("① 注册 →", page.url().includes("/student/pending") ? "等待审核页 ✓" : page.url().slice(0, 50));

// 2. 待审核时访问首页被守卫拦回
await go("/#/student/home"); await sleep(1500);
console.log("② 待审核守卫 →", page.url().includes("/student/pending") ? "留在等待审核页 ✓" : "未拦截!");

// 3. 退出 → 管理员审核通过
await page.locator("button:has-text('退出登录')").first().click();
await sleep(1500);
await page.locator(".demo-item").nth(2).click({ force: true });
await sleep(2000);
await go("/#/admin/users"); await sleep(1800);
const rowCount = await page.locator("tbody tr:has-text('王小卓')").count();
console.log("③ 管理员待审核列表:", rowCount, "条");
await page.locator("tbody tr:has-text('王小卓') button:has-text('通过')").click();
await sleep(1200);
await page.getByRole("button", { name: "全部学员" }).click();
await sleep(800);
console.log("   已通过:", (await page.locator("tbody tr:has-text('王小卓') .pill").first().textContent()).trim());

// 4. 退出 → 邮箱登录 → 进入初心堂
await page.locator(".profile").click(); await sleep(500);
await page.getByText("退出登录").click(); await sleep(1500);
await page.locator(".mode-switch button").nth(1).click();
await page.getByRole("button", { name: "邮箱登录" }).click();
await page.locator(".formal-form input").nth(0).fill("wangxz@bjtu.edu.cn");
await page.locator(".formal-form input").nth(1).fill("abc123456");
await page.getByRole("button", { name: /^登\s*录$/ }).click();
await sleep(2500);
console.log("④ 审核后登录 →", page.url().includes("/student/home") ? "进入初心堂 ✓" : page.url().slice(0, 50));
console.log("   顶栏:", (await page.locator(".profile span").first().textContent()).trim());

// 5. 无效邀请码
await page.locator(".profile").click(); await sleep(400);
await page.getByText("退出登录").click(); await sleep(1500);
await page.locator(".mode-switch button").nth(1).click();
await page.locator(".formal-form input").nth(1).fill("hacker@evil.com");
await page.locator(".formal-form input").nth(2).fill("abc123456");
await page.locator(".formal-form input").nth(3).fill("WRONG99");
await page.getByRole("button", { name: /注册并进入/ }).click();
await sleep(1500);
console.log("⑤ 无效邀请码:", (await page.locator(".login-error").textContent()).slice(0, 34));

console.log("控制台错误:", errs.length ? errs.slice(0, 3) : "无");
await browser.close();
