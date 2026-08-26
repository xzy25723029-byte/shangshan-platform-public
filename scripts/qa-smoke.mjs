/* ============================================================
   QA 冒烟测试脚本
   用法：node scripts/qa-smoke.mjs （需先启动 npm run dev）
   检查：控制台 error/warn、1440px+ 横向滚动、关键文案、核心交互
   ============================================================ */
import { chromium } from "playwright";

const BASE = "http://127.0.0.1:4173";
const EXEC = "C:/Users/ydx15/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe";
const results = [];
let failures = 0;

function check(name, ok, extra = "") {
  results.push({ name, ok, extra });
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  -- " + extra : ""}`);
}

const browser = await chromium.launch({ executablePath: EXEC });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on("console", (m) => {
  if (m.type() === "error" || m.type() === "warning") errors.push(`[${m.type()}] ${m.text()}`);
});
page.on("pageerror", (e) => errors.push(`[pageerror] ${e.message}`));

async function go(hash) {
  errors.length = 0;
  await page.goto(`${BASE}/#${hash}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
}

async function overflow(hash) {
  await go(hash);
  const dims = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
  return dims.sw <= dims.iw + 1;
}

/* ---------- 登录（学生） ---------- */
await go("/login");
check("登录页渲染", await page.locator("h1:has-text('上善若水')").count() > 0 || await page.locator("text=演示账号").count() > 0);
await page.locator(".demo-item").first().click();
await page.waitForURL("**/#/student/home");
check("学生演示账号登录进入初心堂", page.url().includes("#/student/home"));

/* ---------- 学生端路由 ---------- */
const studentRoutes = [
  ["/student/home", "初心堂"],
  ["/student/triple-core", "三重内核"],
  ["/student/guiding-principles", "领航理念总纲"],
  ["/student/first-lesson", "入营第一课"],
  ["/student/energy-flow", "能量流物质流"],
  ["/student/strategy-research", "战略方法论"],
  ["/student/oath", "治学军规"],
  ["/student/thought-notes", "思想札记"],
  ["/student/origin-archive", "初心档案"],
  ["/student/scientist-hall", "科学家精神馆"],
  ["/student/hard-bone", "啃硬骨头"],
  ["/student/cognitive-profile", "认知侧写"],
  ["/student/ai-mentor", "水问"],
  ["/student/map", "学习地图"],
  ["/student/layer1", "第1层"],
  ["/student/layer1/paper-figure", "科技论文绘图模块详情"],
  ["/student/project", "大创中心"],
  ["/student/project/p1", "大创课题详情"],
  ["/student/graduation", "毕设总览"],
  ["/student/graduation/experiment", "毕设实验记录"],
  ["/student/voice", "原话墙"],
  ["/student/alumni", "师兄师姐"],
  ["/student/members", "成员名录"],
  ["/student/ai-settings", "AI 设置"],
  ["/student/layer2", "第2层（专业基础）"],
  ["/student/layer2/A1", "第2层模块详情（XRD）"],
  ["/student/layer3", "第3层（独立产出）"],
  ["/student/layer3/A", "第3层方向（论文写作）"],
];
for (const [hash, name] of studentRoutes) {
  await go(hash);
  const hasTitle = await page
    .locator(".page-banner h1, .map-title h1, .home-hero h1, .module-head h1, .project-title h1")
    .first()
    .isVisible()
    .catch(() => false);
  check(`学生路由 ${name} 渲染`, hasTitle, `errors=${errors.length}`);
  if (errors.length) console.log("   console:", errors.join(" | "));
}

/* ---------- 横向滚动（1440px 全路由） ---------- */
for (const [hash] of studentRoutes) {
  const ok = await overflow(hash);
  check(`无横向滚动 ${hash}`, ok);
}

/* ---------- 核心交互 ---------- */
// 能量流：先作答 → 查看另一种看法
await go("/student/energy-flow");
await page.locator(".ef-answer textarea").first().fill("我先选 A，因为工艺成熟稳定。");
await page.locator(".ef-answer .btn").first().click();
check("能量流 提交判断后出现「另一种看法是」入口", await page.locator("button:has-text('另一种看法是')").first().isVisible());
await page.locator("button:has-text('另一种看法是')").first().click();
check("能量流 查看另一种看法", await page.locator(".ef-view").first().isVisible());

// 军规签署
await go("/student/oath");
await page.locator(".oath-rule input").first().check();
await page.locator(".oath-rule input").nth(1).check();
await page.locator(".oath-rule input").nth(2).check();
await page.locator(".oath-rule input").nth(3).check();
await page.locator(".oath-rule input").nth(4).check();
await page.locator(".oath-rule input").nth(5).check();
await page.locator("button:has-text('签署治学军规')").click();
await page.waitForTimeout(600);
check("治学军规签署完成", await page.locator("text=已签署").first().isVisible());

// 思想札记
await go("/student/thought-notes");
await page.locator(".tn-field input").fill("QA 测试札记");
await page.locator(".tn-field textarea").fill("这是一条由自动化测试提交的诚实记录。");
await page.locator("button:has-text('提交札记')").click();
await page.waitForTimeout(600);
check("思想札记提交", await page.locator("h3:has-text('QA 测试札记')").count() > 0);

// 啃硬骨头
await go("/student/hard-bone");
await page.locator("button:has-text('记录一条')").click();
await page.locator(".hb-form textarea").fill("QA 测试：EEM 散射峰没扣净，还在试。");
await page.locator(".hb-form .btn:has-text('保存记录')").click();
await page.waitForTimeout(600);
check("啃硬骨头记录保存", await page.locator(".hard-bone p:has-text('QA 测试')").count() > 0);

// 认知侧写保存
await go("/student/cognitive-profile");
await page.locator(".cp-slider input").first().fill("85");
await page.locator("button:has-text('保存侧写')").click();
await page.waitForTimeout(600);
check("认知侧写保存", await page.locator("text=认知侧写已更新").count() > 0);

// AI 水问
await go("/student/home");
await page.locator(".ai-fab").click();
check("AI 水问 Dock 打开", await page.locator(".ai-panel").isVisible());
await page.locator(".ai-input input").fill("我论文不会写怎么办");
await page.locator(".ai-input button").click();
await page.waitForTimeout(800);
const aiReply = await page.locator(".ai-msg.ai span").last().textContent();
check("水问反问（不判对错）", aiReply.includes("？") && !aiReply.includes("正确"), `reply=${aiReply?.slice(0, 30)}`);

// 毕设关联第3层
await go("/student/graduation");
await page.locator("button:has-text('方向 A · 论文写作')").click();
await page
  .waitForFunction(() => document.querySelector(".gd-link-row")?.textContent.includes("已关联"), null, { timeout: 6000 })
  .catch(() => {});
const linked = await page.locator(".gd-link-row .pill").allTextContents();
check("毕设关联第3层交付物", linked.some((t) => t.includes("论文写作") && t.includes("已关联")), linked.join(","));

// 学习地图无关卡措辞
await go("/student/map");
const mapText = await page.locator(".map-page").textContent();
check("学习地图无「关卡/通关/锁」措辞", !/关卡|通关|锁/.test(mapText));

// 原话墙搜索
await go("/student/voice");
await page.locator(".filters input").fill("碳排放");
await page.waitForTimeout(300);
check("原话墙搜索过滤", await page.locator(".voice-card").count() === 1);

// AI 导师模型配置（内置推荐 / 添加 / 删除）
await go("/student/ai-settings");
check("AI 设置内置推荐模型清单", (await page.locator(".model-card").count()) >= 6);
await page.locator("button:has-text('添加自定义模型')").click();
await page.waitForTimeout(300);
await page.locator(".cfg-form input").nth(0).fill("QA 测试模型");
await page.locator(".cfg-form input").nth(1).fill("https://api.example.com/v1");
await page.locator(".cfg-form input").nth(2).fill("test/qa-model");
await page.locator(".cfg-form input").nth(3).fill("sk-qa-test");
await page.locator(".el-dialog button:has-text('保存配置')").click();
await page.waitForTimeout(400);
check("添加自定义模型", (await page.locator(".model-card h3:has-text('QA 测试模型')").count()) > 0);
await page.locator(".model-card:has-text('QA 测试模型') .danger").click();
await page.waitForTimeout(300);
check("删除自定义模型", (await page.locator(".model-card h3:has-text('QA 测试模型')").count()) === 0);
// 无 Key 时 dock 保持本地引导（不真实外呼）
await go("/student/home");
await page.locator(".ai-fab").click();
const modelBtnText = await page.locator(".model-btn").textContent().catch(() => "");
check("dock 未配置模型显示本地引导", modelBtnText.includes("本地引导"), modelBtnText);

/* ---------- 导师端 ---------- */
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: "networkidle" });
await go("/login");
await page.locator(".demo-item").nth(1).click();
await page.waitForURL("**/#/mentor/week");
check("导师登录进入点将台", page.url().includes("#/mentor/week"));

await go("/mentor/week");
check("导师本周状态", await page.locator("text=本周状态").count() > 0);

await go("/mentor/review");
check("批阅工作台渲染", await page.locator(".review-item").count() >= 3);
await page.locator(".review-item").first().click();
await page.waitForTimeout(300);
await page.locator(".feedback textarea").fill("QA：数据区间选取需要更明确依据，请再想想。");
await page.locator("button:has-text('请再想想')").click();
await page
  .waitForFunction(() => document.body.textContent.includes("已请学生再想想"), null, { timeout: 6000 })
  .catch(() => {});
check("批阅「请再想想」反馈（无未通过措辞）", await page.locator("text=已请学生再想想").count() > 0);

await go("/mentor/cognitive");
check("认知侧写查看 + 免责标注", (await page.locator("text=不构成评价").count()) > 0);
await go("/mentor/skill-grant");
check("技能包授权页", await page.locator("text=技能包授权").count() > 0);
await page.locator(".sg-form-row select").first().selectOption({ index: 1 });
await page.locator(".sg-form-row select").nth(1).selectOption({ index: 1 });
await page.locator("button:has-text('确认授权')").click();
await page.waitForTimeout(500);
check("技能包手动授权记录", await page.locator(".sg-grants b").count() >= 1);

// 导师端横向滚动
for (const [hash] of [["/mentor/review"], ["/mentor/week"], ["/mentor/cognitive"], ["/mentor/skill-grant"]]) {
  const ok = await overflow(hash);
  check(`导师端无横向滚动 ${hash}`, ok);
}

/* ---------- 管理端 ---------- */
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: "networkidle" });
  await page.reload({ waitUntil: "networkidle" });
await go("/login");
await page.locator(".demo-item").nth(2).click();
await page.waitForURL("**/#/admin/people");
check("管理员登录进入内容管理", page.url().includes("#/admin/people"));

await go("/admin/people");
check("人物库渲染", await page.locator("tbody tr").count() >= 3);
await page.locator("button:has-text('新增人物')").click();
await page.locator(".drawer input").first().fill("QA 测试人物");
await page.locator(".drawer textarea").nth(1).fill("# 测试简介\n\n这是自动化测试写入的人物简介。");
await page.locator(".drawer button:has-text('下一步')").click();
// 轮询等待：savePerson(300ms) + getPersons(200ms) 为异步时序，固定等待不可靠
await page
  .waitForFunction(() => [...document.querySelectorAll("td")].some((td) => td.textContent.includes("QA 测试人物")), null, { timeout: 6000 })
  .catch(() => {});
check("人物库新增人物", await page.locator("td:has-text('QA 测试人物')").count() > 0);

await go("/admin/videos");
check("视频资源渲染", await page.locator("tbody tr").count() >= 3);
await go("/admin/modules");
check("模块配置渲染", await page.locator("text=结果可不可信").count() > 0);

for (const [hash] of [["/admin/people"], ["/admin/videos"], ["/admin/modules"], ["/admin/cases"]]) {
  const ok = await overflow(hash);
  check(`管理端无横向滚动 ${hash}`, ok);
}

/* ---------- 邀请码 ---------- */
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: "networkidle" });
await go("/invite");
await page.locator(".demo-tips button").first().click();
await page.locator("button:has-text('加入平台')").click();
await page.waitForTimeout(500);
check("邀请码加入（学生角色）", page.url().includes("#/student/home"));

/* ---------- 红线词扫描（全站静态扫描由 P8 脚本执行，这里查运行期 DOM） ---------- */
const domText = await page.evaluate(() => document.body.innerText);
check("登录后页面无禁用词", !/未解锁|通关|参考答案|未通过|一键生成|徽章|积分|排名/.test(domText));

/* ---------- 控制台错误汇总 ---------- */
check("全程控制台无 error/warn", errors.length === 0, errors.slice(0, 3).join(" | "));

await browser.close();
console.log(`\n===== 结果：${results.length - failures}/${results.length} 通过 =====`);
process.exit(failures ? 1 : 0);
