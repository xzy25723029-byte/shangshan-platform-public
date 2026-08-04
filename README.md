# 上善若水 · 本科生科研素养实训平台（第一期）

基于 Vue 3 + Vite + Pinia + Element Plus 的正式工程，UI 以已交付的 HTML 原型为视觉源（现代水科技：白底 / 冰蓝 / 青绿 / 浅灰蓝，无黑色界面、无水墨山水化）。数据层默认 **Mock 先行**，接入 Supabase 后一键切换（UI 不动）。

## 快速开始

```bash
npm install
npm run dev        # http://127.0.0.1:4173
```

生产构建与预览：

```bash
npm run build
npm run preview
```

### 演示账号（登录页点击即入）

| 角色 | 账号 | 说明 |
|---|---|---|
| 学生 | 李明远 | 初心堂 / 学习地图 / 大创 / 毕设 / 原话墙 |
| 导师 | 张涛 | 点将台：批阅 / 认知侧写 / 技能包授权 |
| 内容管理员 | 内容管理员 | 人物库 / 视频资源 / 模块配置 |
| 平台管理员 | 平台管理员 | 同上 + 未来管理能力 |

邀请码：`STU2026`（学生）/ `MEN2026`（导师）/ `ADM2026`（内容管理员）/ `SUP2026`（平台管理员）。

## 第一期范围（v3 开发方案）

- **壳层与权限**：三端导航（学生/导师/管理）、顶部搜索、AIMentorDock（水滴意象）
- **初心堂 12 项全部**：三重内核、领航理念总纲（P0，四条理念→功能对照）、入营第一课、能量流物质流（先作答再看另一种看法）、战略方法论（衔接原话墙）、治学军规签署、思想札记（通过/请再想想）、初心档案、科学家精神馆（四类同权重）、啃硬骨头（四种结局平权）、认知侧写（六轴，自己 vs 自己）、水问（苏格拉底反问）
- **学习地图**：水流路径，无阶梯关卡；远方标「尚未开启」
- **第1层**：11 个模块列表 + 统一模块详情模板（科技论文绘图为完整示例）
- **大创中心**：课题列表/详情（摘要、成员、里程碑、待办、看板、资料、导师建议、复盘、AI 助手）
- **毕业设计**：一级导航，8 个阶段页骨架 + 共用 MilestoneTimeline + 「关联为第3层交付物」（不重复提交）
- **产业调研·原话墙**、**师兄师姐**、**成员名录**（标签只展示来源）
- **导师端**：本周状态、批阅工作台、认知侧写查看（标注「不构成评价」）、技能包授权（手动授予+来源记录）
- **管理端**：人物库（CRUD 抽屉）、视频资源、模块配置

其余导航项渲染「尚未开启」占位页（符合红线：允许尚未开启的远方模块）。

## 目录结构

```
src/
├── api/          # 适配层：mock 实现 / supabase 待接实现（VITE_USE_MOCK 切换）
├── data/         # 内容数据（第0-3层模块、人物、原话墙、大创、毕设…）
├── layouts/      # AppShell / SidebarNav / TopbarSearch / AIMentorDock
├── components/   # 全站复用组件（ModuleDetailTemplate、MilestoneTimeline、RadarProfile…）
├── pages/        # student / mentor / admin / auth
├── router/       # hash 路由 + 角色守卫
├── stores/       # auth / app
└── styles/       # 设计令牌 + 原型样式移植 + Element Plus 主题重写
supabase/
├── migrations/   # 31 张表 DDL + RLS + 种子数据
└── functions/    # ai-mentor（LLM 代理）/ storage-signed（预签名上传）
scripts/qa-smoke.mjs   # 88 项 QA 冒烟测试（Playwright）
docs/backend-integration.md  # 接口分界与接入步骤
```

## 设计红线（v3 §3）

- 不游戏化：无徽章/积分/排名/星级/关卡/锁头/签到
- 失败与成功视觉平权：只用「通过 / 请再想想」，低饱和暖色，同尺寸同权重
- 系统不淘汰人：预警只提醒、不催促、不自动处置
- 能力标签不可自封：界面无自添入口，数据库 RLS 拒绝学生写入标签来源
- 措辞：尚未开启 / 已走过 / 另一种看法是 / 请再想想 / 帮我检查

## QA（自动检查体系，替代人力逐页检查）

```bash
# Windows：双击 run-check.bat 即可（自动定位项目目录并启动 dev server）
# 或命令行（须在项目目录内）：
npm run full-check   # 一键全检：lint + build + qa + matrix + audit
npm run lint         # ESLint 语法/规范（eslint-plugin-vue）
npm run qa           # 88 项功能断言（三端登录/核心交互/红线词/溢出/控制台）
npm run matrix       # 全角色矩阵：4 角色登录 × 每页 × 每按钮逐一验证（142 项）
npm run audit        # 使用体验审计：死按钮/遮挡/裁切/坏图/坏链（43 路由）
```

- 检查报告：`qa/matrix-report.md`、`qa/audit/ISSUES.md`
- 体系设计与 AI 代理（Playwright MCP / Anthropic webapp-testing）连用指南：`docs/auto-checking.md`

## 接入 Supabase / 部署 EdgeOne Pages

见 `docs/backend-integration.md`。部署：推送到 Git 仓库后，腾讯云 EdgeOne Pages 关联仓库自动构建（`npm run build`，输出 `dist/`），纯静态托管，无常驻后端进程。

### 云端部署（腾讯云 EdgeOne Pages）

**方式一 · 一键部署按钮**（推荐，已配置 `edgeone.json`，构建配置自动读取）：

[![使用 EdgeOne 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?repository-url=https%3A%2F%2Fgithub.com%2FAaron927-dev%2Fshangshan-platform)

点击上方按钮 → 登录腾讯云 → 授权连接 GitHub（选择 `Aaron927-dev` 账号）→ 确认仓库与分支 `main` → 开始部署。构建配置已由仓库根目录 `edgeone.json` 提供：

```json
{
  "name": "shangshan-platform",
  "installCommand": "npm install",
  "buildCommand": "npm run build",
  "outputDirectory": "./dist",
  "nodeVersion": "22.11.0"
}
```

**方式二 · 控制台手动创建**：腾讯云控制台 → EdgeOne → Pages 服务 → 创建项目 → 关联 GitHub 仓库 `shangshan-platform` → 分支 `main` → 构建设置按 `edgeone.json` 填写（构建命令 `npm run build`，输出目录 `dist`）→ 开始部署。

部署完成后获得公网网址（`https://<项目名>.edgeone.app`），之后每次推送 `main` 自动重新构建。

