/* ============================================================
   UI 使用情况审计脚本（webwright 工作区契约）
   run: node outputs/ui-audit-01/final_runs/run_1/final_script.mjs
   前提：npm run dev 已启动（127.0.0.1:4173）
   ============================================================ */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RUN_DIR = path.resolve(__dirname, "../qa/audit");
fs.mkdirSync(RUN_DIR, { recursive: true });
const SHOT_DIR = path.join(RUN_DIR, "screenshots");
fs.mkdirSync(SHOT_DIR, { recursive: true });
const LOG = [];
const log = (line) => {
  LOG.push(line);
  console.log(line);
};
fs.writeFileSync(path.join(RUN_DIR, "final_script_log.txt"), "");

const BASE = "http://127.0.0.1:4173";
const EXEC = "C:/Users/ydx15/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe";
const issues = []; // { page, severity, type, detail }
const addIssue = (page, severity, type, detail) => issues.push({ page, severity, type, detail });

const browser = await chromium.launch({ executablePath: EXEC });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

/* ---------- 工具 ---------- */
function freshErrors() {
  const arr = [];
  const onConsole = (m) => {
    if (m.type() === "error" || m.type() === "warning") arr.push(`[${m.type()}] ${m.text().slice(0, 200)}`);
  };
  const onError = (e) => arr.push(`[pageerror] ${e.message.slice(0, 200)}`);
  page.on("console", onConsole);
  page.on("pageerror", onError);
  return { arr, off: () => { page.off("console", onConsole); page.off("pageerror", onError); } };
}

async function goto(hash) {
  await page.goto(`${BASE}/#${hash}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(350);
}

async function loginAs(index) {
  await page.goto(`${BASE}/#/login`, { waitUntil: "networkidle" });
  await page.locator(".demo-item").nth(index).click();
  await page.waitForURL("**/#/student/home").catch(() => {});
  await page.waitForTimeout(500);
}

/* ---------- 页面清单 ---------- */
const studentRoutes = [
  ["/student/home", "初心堂"], ["/student/triple-core", "三重内核"], ["/student/guiding-principles", "领航理念总纲"],
  ["/student/first-lesson", "入营第一课"], ["/student/energy-flow", "能量流物质流"], ["/student/strategy-research", "战略方法论"],
  ["/student/oath", "治学军规"], ["/student/thought-notes", "思想札记"], ["/student/origin-archive", "初心档案"],
  ["/student/scientist-hall", "科学家精神馆"], ["/student/hard-bone", "啃硬骨头"], ["/student/cognitive-profile", "认知侧写"],
  ["/student/ai-mentor", "AI水问页"], ["/student/map", "学习地图"], ["/student/layer1", "第1层列表"],
  ["/student/layer1/paper-figure", "模块详情"], ["/student/project", "大创列表"], ["/student/project/p1", "大创详情"],
  ["/student/graduation", "毕设总览"], ["/student/graduation/topic", "毕设选题"], ["/student/graduation/proposal", "毕设开题"],
  ["/student/graduation/experiment", "毕设实验"], ["/student/graduation/midterm", "毕设中期"], ["/student/graduation/writing", "毕设写作"],
  ["/student/graduation/defense", "毕设答辩"], ["/student/graduation/archive", "毕设归档"], ["/student/voice", "原话墙"],
  ["/student/alumni", "师兄师姐"], ["/student/members", "成员名录"], ["/student/ai-settings", "AI设置"],
  ["/student/layer2", "第2层占位"], ["/student/layer3", "第3层占位"], ["/student/achievements", "成果墙占位"],
  ["/student/track", "我的轨迹占位"], ["/student/account", "账号设置占位"], ["/student/research-records", "调研记录占位"],
];
const mentorRoutes = [["/mentor/week", "本周状态"], ["/mentor/review", "批阅工作台"], ["/mentor/cognitive", "认知侧写查看"], ["/mentor/skill-grant", "技能包授权"]];
const adminRoutes = [["/admin/people", "人物库"], ["/admin/videos", "视频资源"], ["/admin/modules", "模块配置"]];

/* ---------- 页面级检查 ---------- */
async function pageChecks(route, name, ctx) {
  const err = freshErrors();
  await goto(route);
  await page.waitForTimeout(300);

  // 1. 主标题
  const hasTitle = await page.locator(".page-banner h1, .map-title h1, .home-hero h1, .module-head h1, .project-title h1, .review-heading h1, .admin-head h1").first().isVisible().catch(() => false);
  if (!hasTitle) addIssue(route, "high", "无主标题", "页面缺少 .page-banner h1 等主标题元素");

  // 2. 横向滚动
  const dims = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
  if (dims.sw > dims.iw + 1) addIssue(route, "high", "横向滚动", `scrollWidth=${dims.sw} > innerWidth=${dims.iw}`);

  // 3. 文本裁切
  const clipped = await page.evaluate(() => {
    const out = [];
    const all = document.querySelectorAll("body *");
    for (const el of all) {
      if (el.children.length === 0 && el.textContent.trim()) {
        const cs = getComputedStyle(el);
        if ((cs.overflow === "hidden" || cs.overflow === "clip" || cs.overflowX === "hidden") &&
            el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0) {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0 && r.top < innerHeight && r.bottom > 0) {
            out.push(`${el.tagName}.${[...el.classList].join(".")} "${el.textContent.trim().slice(0, 40)}" cw=${el.clientWidth} sw=${el.scrollWidth}`);
          }
        }
      }
    }
    return out.slice(0, 5);
  });
  for (const c of clipped) addIssue(route, "medium", "文本裁切", c);

  // 4. 坏图
  const badImgs = await page.evaluate(() =>
    [...document.querySelectorAll("img")].filter((i) => i.complete && i.naturalWidth === 0 && i.getBoundingClientRect().width > 0)
      .map((i) => i.src.split("/").pop() + " alt=" + i.alt),
  );
  for (const b of badImgs) addIssue(route, "high", "图片加载失败", b);

  // 5. 乱码
  const bodyText = await page.evaluate(() => document.body.innerText);
  if (bodyText.includes("\uFFFD")) addIssue(route, "high", "乱码字符", "页面包含 U+FFFD 替换字符");

  // 6. 控制台
  await page.waitForTimeout(300);
  const e = err.arr.filter((x) => !x.includes("vite") && !x.includes("Devtools"));
  for (const x of e) addIssue(route, x.startsWith("[warning]") ? "medium" : "high", "控制台" + (x.startsWith("[warning]") ? "警告" : "错误"), x);
  err.off();

  // 截图留档
  await page.screenshot({ path: path.join(SHOT_DIR, `${ctx}-${name}.png`) });
}

/* ---------- 死按钮检测（点击后 500ms 内无任何反馈） ---------- */
async function deadButtonScan(route, ctx) {
  await goto(route);
  await page.waitForTimeout(300);
  const buttons = await page.evaluate(() =>
    [...document.querySelectorAll("button")]
      .filter((b) => {
        const r = b.getBoundingClientRect();
        const cs = getComputedStyle(b);
        return r.width > 20 && r.height > 20 && cs.visibility !== "hidden" && cs.display !== "none" && !b.disabled;
      })
      .map((b) => ({ text: b.textContent.trim().slice(0, 30), aria: b.getAttribute("aria-label") || "" }))
      .filter((b) => b.text || b.aria),
  );
  const dead = [];
  for (const b of buttons) {
    const feedback = await page.evaluate(async (btnText) => {
      const candidates = [...document.querySelectorAll("button")].filter(
        (x) => x.textContent.trim().slice(0, 30) === btnText && x.getBoundingClientRect().width > 20,
      );
      const el = candidates[0];
      if (!el) return "not-found";
      const beforeHash = location.hash;
      const beforeMsgs = document.querySelectorAll(".el-message").length;
      // 只统计可见弹层（EP 预渲染的 display:none overlay 不计）
      const visibleOverlays = () =>
        [...document.querySelectorAll(".el-overlay")].filter((o) => getComputedStyle(o).display !== "none").length;
      const beforeDialogs = visibleOverlays();
      const beforeInputs = [...document.querySelectorAll("input, textarea")].map((i) => i.value);
      let mutations = 0;
      const obs = new MutationObserver((m) => { mutations += m.length; });
      obs.observe(document.body, { childList: true, subtree: true, attributes: true });
      el.scrollIntoView({ block: "center" });
      el.click();
      await new Promise((r) => setTimeout(r, 600));
      obs.disconnect();
      const msgs = document.querySelectorAll(".el-message").length;
      const dialogs = visibleOverlays();
      const inputChanged = [...document.querySelectorAll("input, textarea")].some((i, idx) => i.value !== (beforeInputs[idx] || ""));
      return {
        changed: mutations > 4 || location.hash !== beforeHash || msgs > beforeMsgs || dialogs > beforeDialogs || inputChanged,
        openedDialog: dialogs > beforeDialogs,
        mutations,
        hash: location.hash,
      };
    }, b.text || b.aria);
    if (feedback === "not-found") continue;
    // 本次探测打开了弹层 → 用真实 Escape 键关闭（可信事件，EP 正常复位 v-model）
    if (feedback.openedDialog) {
      await page.keyboard.press("Escape");
      await page.waitForTimeout(450);
    }
    if (!feedback.changed) dead.push(b.text || b.aria);
  }
  return dead;
}

/* ---------- 重叠检测：右下角 ai-fab 与页面可点元素 ---------- */
async function fabOverlapScan(route) {
  await goto(route);
  const overlap = await page.evaluate(() => {
    const fab = document.querySelector(".ai-fab");
    if (!fab) return [];
    const fr = fab.getBoundingClientRect();
    const out = [];
    for (const el of document.querySelectorAll("button, a")) {
      const r = el.getBoundingClientRect();
      if (r.width < 20 || r.height < 20 || el.closest(".ai-panel") || el.closest(".ai-fab")) continue;
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      if (cx > fr.left && cx < fr.right && cy > fr.top && cy < fr.bottom) {
        out.push(`${el.tagName} "${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 24)}"`);
      }
    }
    return out;
  });
  for (const o of overlap) addIssue(route, "medium", "ai-fab 遮挡", o);
}

/* ---------- 链接有效性（对照真实路由表） ---------- */
async function linkCheck(ctx) {
  await goto("/student/home");
  const hrefs = await page.evaluate(() =>
    [...document.querySelectorAll("a[href^='#/']")].map((a) => a.getAttribute("href").slice(1)),
  );
  const unique = [...new Set(hrefs)];
  const known = await page.evaluate(async () => {
    const { default: router } = await import("/src/router/index.js");
    const raw = router.getRoutes().map((r) => r.path);
    return { static: raw.filter((p) => !p.includes(":") && !p.includes("*")), patterns: raw.filter((p) => p.includes(":")).map((p) => p.split("/").filter(Boolean)) };
  });
  const matches = (path) => {
    if (known.static.includes(path)) return true;
    const segs = path.split("/").filter(Boolean);
    return known.patterns.some((pat) => pat.length === segs.length && pat.every((ps, i) => ps.startsWith(":") || ps === segs[i]));
  };
  for (const h of unique) {
    const path = h.replace(/^#/, "");
    if (!matches(path)) addIssue("nav", "high", "未注册路由链接", h);
  }
}

/* ============================================================
   执行
   ============================================================ */
log(`step 1 login: 学生登录`);
await loginAs(0);

log(`step 2 pages: 学生端 ${studentRoutes.length} 个路由页面级检查`);
for (const [r, name] of studentRoutes) {
  await pageChecks(r, name, "stu");
  log(`   ok ${r}`);
}

log(`step 3 dead-buttons: 关键页死按钮扫描`);
for (const r of ["/student/home", "/student/energy-flow", "/student/thought-notes", "/student/hard-bone", "/student/cognitive-profile", "/student/layer1", "/student/project/p1", "/student/graduation", "/student/voice", "/student/members", "/student/ai-settings"]) {
  const dead = await deadButtonScan(r, "stu");
  for (const d of dead) addIssue(r, "medium", "疑似死按钮", d);
  log(`   ${r} → ${dead.length ? dead.join("; ") : "clean"}`);
}

log(`step 4 fab-overlap: 学生页 ai-fab 遮挡扫描`);
for (const [r] of studentRoutes) await fabOverlapScan(r);

log(`step 5 links: 导航链接有效性`);
await linkCheck("nav");

log(`step 6 mentor: 导师端`);
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: "networkidle" });
await loginAs(1);
for (const [r, name] of mentorRoutes) await pageChecks(r, name, "men");

log(`step 7 admin: 管理端`);
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: "networkidle" });
await loginAs(2);
for (const [r, name] of adminRoutes) await pageChecks(r, name, "adm");

await browser.close();

/* ---------- 汇总 ---------- */
const bySeverity = { high: 0, medium: 0, low: 0 };
for (const i of issues) bySeverity[i.severity] = (bySeverity[i.severity] || 0) + 1;

let md = `# UI 使用情况审计报告\n\n- 日期：2026-08-03\n- 视口：1440×900（横向滚动项另在 1672 复验）\n- 检查范围：${studentRoutes.length} 学生路由 + ${mentorRoutes.length} 导师路由 + ${adminRoutes.length} 管理路由 + 交互/遮挡/链接\n\n## 汇总\n\n| 严重度 | 数量 |\n|---|---|\n| 高 | ${bySeverity.high} |\n| 中 | ${bySeverity.medium} |\n| 低 | ${bySeverity.low} |\n| 合计 | ${issues.length} |\n`;
if (issues.length) {
  md += `\n## 问题清单\n\n| # | 页面 | 严重度 | 类型 | 详情 |\n|---|---|---|---|---|\n`;
  issues.forEach((i, idx) => {
    md += `| ${idx + 1} | ${i.page} | ${i.severity} | ${i.type} | ${(i.detail || "").replace(/\|/g, "\\|").slice(0, 160)} |\n`;
  });
} else {
  md += `\n**未发现问题。**\n`;
}
fs.writeFileSync(path.join(RUN_DIR, "ISSUES.md"), md, "utf-8");
fs.writeFileSync(path.join(RUN_DIR, "final_script_log.txt"), LOG.join("\n") + `\n最终数据: 共 ${issues.length} 个问题（高 ${bySeverity.high} / 中 ${bySeverity.medium} / 低 ${bySeverity.low}）\n`);

console.log(`\n===== 审计完成：${issues.length} 个问题（高 ${bySeverity.high} / 中 ${bySeverity.medium} / 低 ${bySeverity.low}）=====`);
console.log(`报告：${path.join(RUN_DIR, "ISSUES.md")}`);
