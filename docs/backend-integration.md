# 后端接入说明（Supabase + Edge Function）

## 一、逻辑分界：直接接口 vs Edge Function

| 逻辑 | 走哪里 | 原因 |
|---|---|---|
| 登录 / 注册 / 会话 | Supabase Auth（直接接口） | 标准能力，anon key 即可 |
| 个人记录读写（札记、啃硬骨头、初心档案、认知侧写、调研记录） | Supabase 直接接口 | RLS 保护，学生只见自己的行 |
| 提交与批阅（submissions / reviews / 技能包授权记录） | Supabase 直接接口 | RLS 限制导师只能批阅所指导学生的内容 |
| 内容读取（人物库、视频、模块、原话墙已发布） | Supabase 直接接口 | RLS 只读策略 |
| 内容写入（管理端人物/视频/模块配置） | Supabase 直接接口（admin/super_admin 角色命中 RLS 写入策略） | RLS 校验角色 |
| **AI 对话代理（水问）** | **Edge Function `ai-mentor`** | LLM 密钥只放函数环境变量 |
| **文件上传** | **Edge Function `storage-signed`** | 签发预签名 URL，service role 只在函数内 |
| **邀请码发放** | **Edge Function**（预留） | 需要服务端生成随机码并校验 |
| **管理员批量操作 / 审计写入** | **Edge Function**（预留） | service role + audit_logs 无普通用户写入策略 |

## 二、接入步骤

1. **创建 Supabase 项目**，在 SQL Editor 依次执行：
   - `supabase/migrations/0001_schema.sql`
   - `supabase/migrations/0002_rls.sql`
   - `supabase/migrations/0003_seed.sql`
2. **复制 `.env.example` 为 `.env`**，填写：
   ```env
   VITE_USE_MOCK=false
   VITE_SUPABASE_URL=https://<project-ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon key>
   ```
3. **部署 Edge Function**：
   ```bash
   supabase link --project-ref <project-ref>
   supabase secrets set AI_MENTOR_API_KEY=<平台 LLM 密钥>
   supabase functions deploy ai-mentor
   supabase functions deploy storage-signed
   ```
4. **创建 Storage bucket**：`shangshan-files`（private）。
5. **本地运行**：`npm run dev`（此时页面数据走 `src/api/supabase.js`，按 `src/api/mock.js` 的函数签名逐个对接真实查询）。
6. **角色账号**：通过 Auth 创建用户后，在 `profiles` 表补一行 `role`（学生/导师/管理员），并设置 `mentor_id` 建立指导关系——导师端可见性依赖该字段。

## 三、权限模型速查（RLS 已实现）

| 数据 | 学生 | 导师 | 管理员 |
|---|---|---|---|
| 自己的私密记录 | 读+写 | 所指导学生的只读/反馈 | 全量 |
| 认知侧写 | 本人读+写 | 所指导学生的只读（页面标注「不构成评价」） | 只读 |
| 能力标签 | 只读 | 可授予（写 `skill_tag_sources`） | 可授予 |
| 技能包授权 | 只读 | 可授予（写 `mentor_skill_grants`） | 可授予 |
| 内容资源 | 读 | 读 | 读+写 |
| 审计日志 | — | — | 只读（写入仅 service role） |

**防自封核心**：`skill_tag_sources` 的 insert 策略只放行 `mentor/admin/super_admin` 角色；
学生角色没有任何 insert 策略命中，数据库层直接拒绝——界面也不提供「自己添加能力标签」入口。

## 四、红线在数据层的落点

- **平权**：`reviews.verdict` 只有 `ok / warm` 两个枚举值（通过 / 请再想想），无「未通过」；
  `hard_bone_records.outcome` 四种结局平权存储。
- **不淘汰人**：预警只提醒（前端展示），无自动处置逻辑；无强制倒计时字段。
- **不游戏化**：数据库无积分/徽章/等级/排行相关字段。
- **AI 密钥**：`ai-mentor` 函数环境变量持有平台密钥；学生 Key 只存浏览器 localStorage，不进任何表。
