/* ============================================================
   全角色全功能矩阵检查（scripts/matrix-check.mjs）
   4 角色（student / mentor / admin / super_admin）依次登录：
   1. 每个角色可见的每个路由 → 渲染 + 控制台 + 溢出 + 主标题
   2. 每个路由上每一个可点按钮 → 逐一点击并验证有反馈（死按钮检测）
   3. 每个角色的关键功能 → 端到端断言
   输出：qa/matrix-report.md
   用法：npm run matrix （需先 npm run dev）
   ============================================================ */
import { chromium } from "playwright";
import { scanButtonsOnPage } from "./lib/dead-button-scan.mjs";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "qa", "matrix");
fs.mkdirSync(OUT_DIR, { recursive: true });

const BASE = "http://127.0.0.1:4173";
const EXEC = "C:/Users/ydx15/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe";

const results = [];
let failures = 0;
const check = (role, name, ok, extra = "") => {
  results.push({ role, name, ok, extra });
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"} [${role}] ${name}${extra ? " -- " + extra : ""}`);
};

const browser = await chromium.launch({ executablePath: EXEC });
let page = null;
const consoleIssues = [];

/* 每个角色使用全新页面，避免会话/弹层残留 */
async function freshPage() {
  if (page) await page.close().catch(() => {});
  page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") consoleIssues.push(`[${m.type()}] ${m.text().slice(0, 160)}`);
  });
  page.on("pageerror", (e) => consoleIssues.push(`[pageerror] ${e.message.slice(0, 160)}`));
  return page;
}

async function goto(hash) {
  await page.goto(`${BASE}/#${hash}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(350);
}

async function loginAs(index) {
  consoleIssues.length = 0;
  await freshPage();
  await page.goto(`${BASE}/#/login`, { waitUntil: "networkidle" });
  await page.locator(".demo-item").nth(index).click();
  await page.waitForTimeout(600);
}

/* ---------- 单页渲染检查 ---------- */
async function checkPage(role, route, name) {
  const before = consoleIssues.length;
  await goto(route);
  const hasTitle = await page
    .locator(".page-banner h1, .map-title h1, .home-hero h1, .module-head h1, .project-title h1, .review-heading h1, .admin-head h1")
    .first()
    .isVisible()
    .catch(() => false);
  const dims = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
  check(role, `${name} 渲染`, hasTitle);
  check(role, `${name} 无横向滚动`, dims.sw <= dims.iw + 1);
  const errs = consoleIssues.slice(before).filter((e) => !e.includes("favicon") && !e.includes("vite") && !e.includes("Devtools"));
  check(role, `${name} 控制台干净`, errs.length === 0, errs.slice(0, 2).join(" | "));
}

/* ---------- 页面内所有按钮逐一验证（死按钮检测） ---------- */
async function scanButtons(role, route, name) {
  await goto(route);
  const dead = await scanButtonsOnPage(page);
  check(role, `${name} 全部按钮可用`, dead.length === 0, dead.slice(0, 4).join("; "));
}

/* ============================================================
   学生端（index 0）
   ============================================================ */
await loginAs(0);
check("student", "登录进入初心堂", page.url().includes("#/student/home"));

const studentRoutes = [
  ["/student/home", "初心堂"], ["/student/triple-core", "三重内核"], ["/student/guiding-principles", "领航理念总纲"],
  ["/student/first-lesson", "入营第一课"], ["/student/energy-flow", "能量流物质流"], ["/student/strategy-research", "战略方法论"],
  ["/student/oath", "治学军规"], ["/student/thought-notes", "思想札记"], ["/student/origin-archive", "初心档案"],
  ["/student/scientist-hall", "科学家精神馆"], ["/student/hard-bone", "啃硬骨头"], ["/student/cognitive-profile", "认知侧写"],
  ["/student/ai-mentor", "AI水问页"], ["/student/map", "学习地图"], ["/student/layer1", "第1层列表"],
  ["/student/layer1/paper-figure", "模块详情"], ["/student/project", "大创列表"], ["/student/project/p1", "大创详情"],
  ["/student/graduation", "毕设总览"], ["/student/graduation/experiment", "毕设实验"], ["/student/voice", "原话墙"],
  ["/student/alumni", "师兄师姐"], ["/student/members", "成员名录"], ["/student/ai-settings", "AI设置"],
  ["/student/layer2", "第2层占位"], ["/student/layer3", "第3层占位"], ["/student/achievements", "成果墙占位"],
];
for (const [r, n] of studentRoutes) await checkPage("student", r, n);

for (const [r, n] of [
  ["/student/home", "初心堂"], ["/student/energy-flow", "能量流"], ["/student/oath", "军规"], ["/student/thought-notes", "札记"],
  ["/student/hard-bone", "硬骨头"], ["/student/cognitive-profile", "侧写"], ["/student/layer1", "第1层"],
  ["/student/project/p1", "大创详情"], ["/student/graduation", "毕设总览"], ["/student/voice", "原话墙"],
  ["/student/members", "成员名录"], ["/student/ai-settings", "AI设置"],
]) {
  await scanButtons("student", r, n);
}

/* 学生关键功能端到端 */
await goto("/student/graduation");
await page.locator("button:has-text('方向 A · 论文写作')").click();
await page.waitForFunction(() => document.querySelector(".gd-link-row")?.textContent.includes("已关联"), null, { timeout: 6000 }).catch(() => {});
check("student", "毕设关联第3层交付物", (await page.locator(".gd-link-row .pill").allTextContents()).some((t) => t.includes("已关联")));

await goto("/student/project/p1");
await page.locator("button:has-text('新建任务')").click();
await page.waitForTimeout(500);
await page.locator(".el-message-box input").fill("QA 矩阵任务");
await page.locator(".el-message-box button:has-text('添加')").click();
await page.waitForTimeout(600);
check("student", "大创新建任务", await page.locator(".task-row span:has-text('QA 矩阵任务')").count() > 0);

await goto("/student/members");
await page.locator("button:has-text('求带 TA 聊聊')").first().click();
await page.waitForTimeout(500);
check("student", "成员求带对话框", await page.locator(".el-dialog:has-text('求带')").count() > 0);

/* ============================================================
   导师端（index 1）
   ============================================================ */
await loginAs(1);
check("mentor", "登录进入点将台", page.url().includes("#/mentor/week"));
for (const [r, n] of [["/mentor/week", "本周状态"], ["/mentor/review", "批阅工作台"], ["/mentor/cognitive", "认知侧写"], ["/mentor/skill-grant", "技能包授权"]]) {
  await checkPage("mentor", r, n);
  await scanButtons("mentor", r, n);
}
await goto("/mentor/review");
await page.locator(".review-item").first().click();
await page.waitForTimeout(400);
await page.locator(".feedback textarea").fill("矩阵检查：请再想想");
await page.locator("button:has-text('请再想想')").click();
await page.waitForFunction(() => document.body.textContent.includes("已请学生再想想"), null, { timeout: 6000 }).catch(() => {});
check("mentor", "批阅「请再想想」", await page.locator("text=已请学生再想想").count() > 0);

await goto("/mentor/skill-grant");
await page.locator(".sg-form-row select").nth(0).selectOption({ index: 1 });
await page.locator(".sg-form-row select").nth(1).selectOption({ index: 1 });
await page.locator("button:has-text('确认授权')").click();
await page.waitForFunction(() => document.querySelectorAll(".sg-grants b").length >= 1, null, { timeout: 6000 }).catch(() => {});
check("mentor", "技能包授权", (await page.locator(".sg-grants b").count()) >= 1);

/* ============================================================
   内容管理员（index 2）
   ============================================================ */
await loginAs(2);
check("admin", "登录进入内容管理", page.url().includes("#/admin/people"));
for (const [r, n] of [["/admin/people", "人物库"], ["/admin/videos", "视频资源"], ["/admin/modules", "模块配置"]]) {
  await checkPage("admin", r, n);
  await scanButtons("admin", r, n);
}
await goto("/admin/people");
await page.locator("button:has-text('新增人物')").click();
await page.waitForTimeout(400);
await page.locator(".drawer input").first().fill("矩阵人物");
await page.locator(".drawer textarea").nth(1).fill("# 矩阵测试");
await page.locator(".drawer button:has-text('下一步')").click();
await page.waitForTimeout(600);
check("admin", "人物库新增", await page.locator("td:has-text('矩阵人物')").count() > 0);

/* ============================================================
   平台管理员（index 3）—— 同一管理端，验证独立角色可用
   ============================================================ */
await loginAs(3);
check("super_admin", "登录进入内容管理", page.url().includes("#/admin/people"));
for (const [r, n] of [["/admin/people", "人物库"], ["/admin/videos", "视频资源"], ["/admin/modules", "模块配置"]]) {
  await checkPage("super_admin", r, n);
}

/* ---------- 角色隔离：学生不可进导师/管理端 ---------- */
await loginAs(0);
await goto("/mentor/week");
check("student", "学生被拦截于导师端", page.url().includes("#/student/"));
await goto("/admin/people");
check("student", "学生被拦截于管理端", page.url().includes("#/student/"));

await browser.close();

/* ---------- 报告 ---------- */
const pass = results.length - failures;
let md = `# 全角色全功能矩阵检查报告\n\n- 日期：${new Date().toISOString().slice(0, 10)}\n- 视口：1440×900\n- 结果：**${pass}/${results.length} 通过**（失败 ${failures}）\n\n## 明细\n\n| 角色 | 检查项 | 结果 | 备注 |\n|---|---|---|---|\n`;
for (const r of results) {
  md += `| ${r.role} | ${r.name} | ${r.ok ? "✅" : "❌"} | ${(r.extra || "").replace(/\|/g, "\\|").slice(0, 80)} |\n`;
}
fs.writeFileSync(path.join(ROOT, "qa", "matrix-report.md"), md, "utf-8");
console.log(`\n===== 矩阵检查：${pass}/${results.length} 通过 =====`);
console.log(`报告：qa/matrix-report.md`);
process.exit(failures ? 1 : 0);
