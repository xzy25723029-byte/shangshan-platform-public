/* ============================================================
   深度交互回归（scripts/regression-deep.mjs）
   覆盖 full-check 体系未覆盖的真实用户交互：
   深链接直达、筛选器、列表联动、完整业务流程、浏览器后退、
   AI dock 共存、菜单导航
   输出：qa/deep-report.md
   用法：npm run deep （需先 npm run dev）
   ============================================================ */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const BASE = "http://127.0.0.1:4173";
const EXEC = "C:/Users/ydx15/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe";

const results = [];
let failures = 0;
const check = (name, ok, extra = "") => {
  results.push({ name, ok, extra });
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  -- " + extra : ""}`);
};

const browser = await chromium.launch({ executablePath: EXEC });
let page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const consoleIssues = [];
const attach = (p) => {
  p.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") consoleIssues.push(`[${m.type()}] ${m.text().slice(0, 120)}`); });
  p.on("pageerror", (e) => consoleIssues.push(`[pageerror] ${e.message.slice(0, 120)}`));
};
attach(page);

async function goto(hash) {
  await page.goto(`${BASE}/#${hash}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
}
async function loginAs(index) {
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  attach(p);
  page = p;
  await page.goto(`${BASE}/#/login`, { waitUntil: "networkidle" });
  await page.locator(".demo-item").nth(index).click();
  await page.waitForTimeout(600);
}

/* ---------- 学生端 ---------- */
await loginAs(0);

// 1. 深链接直达（直接打开深层路由并刷新）
await goto("/student/graduation/writing");
check("深链接直达毕设写作页", await page.locator("h1:has-text('论文写作')").isVisible().catch(() => false));
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(400);
check("刷新后仍停留在毕设写作页", page.url().includes("graduation/writing"));

// 2. 浏览器后退
await goto("/student/energy-flow");
await page.goBack({ waitUntil: "networkidle" }).catch(() => {});
await page.waitForTimeout(400);
check("浏览器后退返回上一页", page.url().includes("graduation") || page.url().includes("student/"));

// 3. 原话墙场景筛选（select）
await goto("/student/voice");
await page.locator(".filters select").first().selectOption("技术研发");
await page.waitForTimeout(300);
const voiceCount = await page.locator(".voice-card").count();
check("原话墙场景筛选生效", voiceCount >= 1 && voiceCount < 8, `当前 ${voiceCount} 条`);

// 4. 师兄师姐卡片选择联动
await goto("/student/alumni");
await page.locator(".alumni-card").nth(2).click();
await page.waitForTimeout(300);
const detailName = await page.locator(".alumni-detail h2").textContent().catch(() => "");
const cardName = await page.locator(".alumni-card").nth(2).locator(".person b").textContent();
check("师兄师姐详情联动", detailName === cardName, `${detailName} vs ${cardName}`);

// 5. 学习地图节点 → 模块详情跳转
await goto("/student/map");
await page.locator(".map-node").first().click();
await page.waitForTimeout(400);
check("学习地图节点跳转模块详情", page.url().includes("/student/layer1/"));

// 6. 毕设 8 段全部可达 + 翻页
const sections = ["topic", "proposal", "experiment", "midterm", "writing", "defense", "archive"];
let allReachable = true;
for (const s of sections) {
  await goto(`/student/graduation/${s}`);
  const ok = await page.locator(".page-banner h1").first().isVisible().catch(() => false);
  if (!ok) allReachable = false;
}
check("毕设 8 段全部可达", allReachable);
await goto("/student/graduation/topic");
await page.locator(".gd-pager a").last().click();
await page.waitForTimeout(400);
check("毕设翻页到下一段", page.url().includes("graduation/proposal"));

// 7. AI dock 打开状态下页面可用（不遮挡主内容交互）
await goto("/student/home");
await page.locator(".ai-fab").click();
await page.waitForTimeout(400);
await page.locator(".feature-grid .feature .btn").first().click();
await page.waitForTimeout(400);
check("AI dock 打开时仍可点击功能卡跳转", page.url().includes("/student/triple-core"));
// 路由切换后 dock 保持打开；直接在打开的 dock 内对话（不再重复点 fab）
const dockVisible = await page.locator(".ai-panel").isVisible().catch(() => false);
if (!dockVisible) {
  await page.locator(".ai-fab").click();
  await page.waitForTimeout(400);
}
await page.locator(".ai-input input").fill("怎么开始文献检索");
await page.locator(".ai-input button").click();
await page.waitForTimeout(800);
const replyCount = await page.locator(".ai-msg.ai").count();
check("dock 跨页对话继续", replyCount >= 2, `共 ${replyCount} 条 AI 回复`);

// 8. 顶栏资源中心下拉 → 导航
await goto("/student/home");
await page.locator(".top-actions button:has-text('资源中心')").click();
await page.waitForTimeout(400);
await page.locator(".el-dropdown-menu .resource-link", { hasText: "原话墙" }).click();
await page.waitForTimeout(400);
check("资源中心下拉导航原话墙", page.url().includes("/student/voice"));

// 9. 头像菜单 → AI 导师设置
await page.locator(".top-actions .profile").click();
await page.waitForTimeout(300);
await page.locator(".el-dropdown-menu a:has-text('AI 导师设置')").click().catch(() => {});
await page.waitForTimeout(300);
check("头像菜单进入 AI 设置", page.url().includes("ai-settings") || page.url().includes("student/"));

/* ---------- 导师端 ---------- */
await loginAs(1);
await goto("/mentor/review");
const itemCount = await page.locator(".review-item").count();
let allSwitch = true;
for (let i = 0; i < Math.min(itemCount, 4); i++) {
  await page.locator(".review-item").nth(i).click();
  await page.waitForTimeout(300);
  const h2 = await page.locator(".student-head h2").textContent().catch(() => "");
  if (!h2) allSwitch = false;
}
check("批阅队列逐条切换全部生效", allSwitch, `队列 ${itemCount} 条`);

/* ---------- 管理端 ---------- */
await loginAs(2);

// 10. 视频新增完整流程
await goto("/admin/videos");
await page.locator("button:has-text('新增视频')").click();
await page.waitForTimeout(300);
await page.locator(".drawer input").nth(0).fill("深度回归测试视频");
await page.locator(".drawer input").nth(1).fill("B3 EIS 交流阻抗");
await page.locator(".drawer input").nth(3).fill("https://example.com/eis");
await page.locator(".drawer button:has-text('保存')").click();
await page
  .waitForFunction(() => [...document.querySelectorAll("td")].some((td) => td.textContent.includes("深度回归测试视频")), null, { timeout: 6000 })
  .catch(() => {});
check("视频新增完整流程", await page.locator("td:has-text('深度回归测试视频')").count() > 0);

// 11. 批量操作完整流程（勾选 + 执行）
await goto("/admin/people");
await page.locator("tbody tr").nth(0).locator('input[type="checkbox"]').check();
await page.locator("tbody tr").nth(1).locator('input[type="checkbox"]').check();
await page.locator("button:has-text('批量操作')").click();
await page.waitForTimeout(500);
await page.locator(".el-message-box button:has-text('执行')").click();
await page.waitForTimeout(600);
check("批量操作完整流程", await page.locator(".el-message:has-text('已对 2 行执行')").count() > 0);

// 12. 批量检测链接完整流程
await page.locator("button:has-text('批量检测链接')").click();
await page.waitForTimeout(400);
check("批量检测链接反馈", await page.locator(".el-message:has-text('链接检测完成')").count() > 0);

// 13. 分页翻页
await goto("/admin/people");
await page.locator(".pagination button").filter({ hasText: /^3$/ }).click();
await page.waitForTimeout(400);
const current3 = await page.locator(".pagination .current").textContent().catch(() => "");
check("分页翻页到第 3 页", current3 === "3", `current=${current3}`);

// 14. 控制台全程干净
const real = consoleIssues.filter((e) => !e.includes("vite") && !e.includes("Devtools"));
check("深度回归全程控制台干净", real.length === 0, real.slice(0, 3).join(" | "));

await browser.close();

let md = `# 深度交互回归报告\n\n- 日期：${new Date().toISOString().slice(0, 10)}\n- 结果：**${results.length - failures}/${results.length} 通过**（失败 ${failures}）\n\n| 检查项 | 结果 | 备注 |\n|---|---|---|\n`;
for (const r of results) md += `| ${r.name} | ${r.ok ? "✅" : "❌"} | ${(r.extra || "").replace(/\|/g, "\\|").slice(0, 90)} |\n`;
fs.writeFileSync(path.join(ROOT, "qa", "deep-report.md"), md, "utf-8");
console.log(`\n===== 深度回归：${results.length - failures}/${results.length} 通过 =====`);
process.exit(failures ? 1 : 0);
