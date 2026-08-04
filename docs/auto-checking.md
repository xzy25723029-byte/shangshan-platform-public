# 自动检查体系（Auto-Checking）

用编程方式替代人工逐页检查：一条命令跑完全部检查，输出四份报告。
适合在每次功能迭代后执行，或在接入 AI 代理（Agent）前作为"质量闸门"。

## 一键执行

```bash
npm run full-check
```

| 步骤 | 命令 | 检查内容 | 产出 |
|---|---|---|---|
| 1 语法 | `npm run lint` | ESLint（eslint-plugin-vue）：未定义变量、未使用导入、语法错误 | 终端 |
| 2 构建 | `npm run build` | Vite 生产构建（编译即语法校验） | dist/ |
| 3 功能 | `npm run qa` | 88 项功能断言（三端登录、核心交互、红线词、横向滚动、控制台） | 终端 |
| 4 全角色矩阵 | `npm run matrix` | **4 角色登录 × 每个页面 × 每个按钮逐一验证**（死按钮检测）+ 端到端功能 | qa/matrix-report.md |
| 5 使用体验 | `npm run audit` | 43 路由：控制台/溢出/文本裁切/坏图/乱码/死按钮/遮挡/未注册链接 | qa/audit/ISSUES.md |

任一环节失败即退出码非 0，可接入 CI 或 EdgeOne Pages 构建钩子。

## 三层检查设计

```
第一层 静态（快）：ESLint + Vite build —— 语法与编译错误
第二层 功能（准）：qa-smoke —— 关键路径端到端断言（88 项）
第三层 矩阵（全）：matrix-check —— 穷举：每角色 × 每页面 × 每按钮
       + ui-audit —— 使用体验：遮挡、裁切、死按钮、坏链、坏图
```

三层从"快而粗"到"慢而全"，日常迭代跑前两层，发版/接后端后跑全量。

## 矩阵检查（matrix-check.mjs）说明

- 4 个演示角色依次登录（学生/导师/内容管理员/平台管理员），每角色独立新页面
- 每个路由：主标题存在、无横向滚动、控制台无 error/warn
- 每个可见按钮：逐一真实点击，550ms 窗口内检测 DOM 变化
  （节点增删 + mutation 记录数；兼容 Element Plus 预渲染弹层的 attribute 显隐切换）
- 弹层类按钮点击后用真实 Escape 关闭，避免状态污染后续按钮
- **选择器类按钮**（如批阅队列，点击已选中项无变化属正常 UX）：
  自动点击同容器兄弟按钮验证页面可响应
- 每个角色的关键功能端到端断言（毕设关联、新建任务、求带、批阅、授权、人物新增）
- 角色隔离：学生访问导师/管理端路由应被守卫重定向

## 与 AI 自动检查工具连用（GitHub 生态调研）

| 方案 | Stars | 定位 | 与本项目结合方式 |
|---|---|---|---|
| [Anthropic webapp-testing skill](https://github.com/anthropics/skills)（仓库 149k+） | 高 | AI 代理用 Playwright 测本地 Web 应用的标准 skill：决策树 + Iron Laws（networkidle 后再查 DOM、永远捕获 console、不硬编码等待）+ 验证清单 | 把本体系的"三层检查"作为 skill 的验证清单；AI 代理负责探索式检查，本体系负责确定性回归 |
| [Playwright MCP](https://github.com/microsoft/playwright-mcp) | 29k+ | Microsoft 官方 MCP server：AI 直接驱动浏览器（accessibility-tree 快照，非截图）；内置 Copilot Agent，Healer 自愈选择器 | Agent 需要"真机走查"时启动它连接 dev server，与 qa/matrix 互补（AI 找新问题，脚本防回归） |
| [Stagehand](https://github.com/browserbase/stagehand) | 22k+ | AI 原生 Playwright SDK：`act()/extract()/observe()` 自然语言操作 | 后续可把探索式用例写成 Stagehand 动作，纳入流水线 |
| [Browser Use](https://github.com/browser-use/browser-use) | 81k+ | Python 自主浏览器代理（多步任务） | 跨站点调研（如原话墙外部素材）时用 |

**推荐组合（本项目现状）**：
1. 确定性回归 → 本体系 `npm run full-check`（零成本、可进 CI）
2. 探索式走查 → AI 代理 + [Playwright MCP](https://github.com/microsoft/playwright-mcp)（每次迭代后让 AI"像用户一样"点一遍，报告新问题）
3. 把本体系的验收项写成 [Anthropic webapp-testing](https://github.com/anthropics/skills) 风格 SKILL.md（见下），让任何 AI 代理开箱即用

## AI 代理检查清单（SKILL 模板）

以下清单可直接作为 AI 代理（Claude/Codex + Playwright）的检查要求：

```
1. 启动：npm run dev（127.0.0.1:4173），等 networkidle 再操作 DOM
2. 四角色走查：学生/导师/内容管理员/平台管理员各登录一遍
3. 每页必查：控制台 error/warn、1440px 无横向滚动、中文无乱码裁切
4. 按钮必查：每个可见按钮点击后必须有反馈（导航/弹层/消息/状态变化）
5. 红线词扫描：未解锁/通关/参考答案/未通过/一键生成/徽章/积分/排名
6. 不硬编码等待：优先 waitFor 状态变化；截图留档到 qa/ai-walkthrough/
7. 结束前运行 npm run full-check，确认无回归后提交报告
```

## 接入 CI（EdgeOne Pages）

EdgeOne Pages 构建命令可配置为 `npm ci && npm run full-check && npm run build`，
任一检查失败则构建失败——把人力检查变成构建闸门。
（注意 full-check 中的浏览器检查需要 dev server，可在 CI 中
`npm run dev &` 后执行，或仅保留 lint+build 作为构建闸门。）
