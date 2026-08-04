-- ============================================================
-- 上善若水 · 本科生科研素养实训平台
-- 0001_schema.sql · 数据库结构（v3 §14 全部表 + 初心堂补充表）
-- 角色：student / mentor / admin / super_admin
-- 安全原则：能力标签来源强制记录（skill_tag_sources）；
--           认知侧写仅本人与导师可见；AI 密钥只放 Edge Function
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- 枚举 ----------
create type user_role as enum ('student', 'mentor', 'admin', 'super_admin');
create type verdict_type as enum ('ok', 'warm');                    -- 通过 / 请再想想（平权）
create type hard_bone_outcome as enum ('仍在啃', '啃下来了', '换路子', '放弃了'); -- 四种结局平权
create type tag_source_type as enum ('system_grant', 'mentor_certified', 'peer_thanks');
create type content_status as enum ('draft', 'reviewing', 'published', 'disabled');

-- ---------- 角色 ----------
create table roles (
  id          uuid primary key default gen_random_uuid(),
  name        user_role not null unique,
  label       text not null,
  description text,
  created_at  timestamptz not null default now()
);

-- ---------- 用户档案 ----------
create table profiles (
  id              uuid primary key references auth.users (id) on delete cascade,
  username        text unique,
  real_name       text not null,
  role            user_role not null default 'student',
  grade           text,                                   -- 如：环境工程 2022级
  avatar_url      text,
  mentor_id       uuid references profiles (id),          -- 学生归属导师（导师端可见性依据）
  bio             text,
  invited_code    text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ---------- 邀请码 ----------
create table invitations (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,                       -- 发放时使用 Edge Function 生成
  role        user_role not null,
  created_by  uuid references profiles (id),
  used_by     uuid references profiles (id),
  used_at     timestamptz,
  expires_at  timestamptz,
  created_at  timestamptz not null default now()
);

-- ---------- 人物库 / 视频资源 ----------
create table figures (
  id          uuid primary key default gen_random_uuid(),
  category    text not null,               -- 革命先辈与战略思想 / 功勋科学家 / 当代模范 / 本学科先辈
  name        text not null,
  unit        text,
  direction   text,
  story       text,
  action      text,                        -- 平台动作对应
  avatar_url  text,
  status      content_status not null default 'published',
  created_by  uuid references profiles (id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table figure_videos (
  id          uuid primary key default gen_random_uuid(),
  figure_id   uuid not null references figures (id) on delete cascade,
  title       text not null,
  url         text not null,               -- 只存链接，不下载转存
  duration    text,
  note        text,                        -- 看这个解决什么问题
  level       text not null default '必看' check (level in ('必看', '需要时再看')),
  is_valid    boolean not null default true,
  checked_at  timestamptz,
  created_at  timestamptz not null default now()
);

-- ---------- 模块体系 ----------
create table modules (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,        -- 1-1 / A1 / B3 ...
  layer       smallint not null check (layer between 0 and 3),
  name        text not null,
  kind        text,                        -- 技能类 / 常识类 / 收官综合 / 核心必修 ...
  hours       text,
  acceptance  text,                        -- 验收物说明
  status      content_status not null default 'draft',
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table module_videos (
  id          uuid primary key default gen_random_uuid(),
  module_id   uuid not null references modules (id) on delete cascade,
  title       text not null,
  url         text not null,
  duration    text,
  note        text,
  level       text not null default '必看' check (level in ('必看', '需要时再看')),
  is_valid    boolean not null default true,
  checked_at  timestamptz,
  created_at  timestamptz not null default now()
);

create table module_resources (
  id          uuid primary key default gen_random_uuid(),
  module_id   uuid not null references modules (id) on delete cascade,
  title       text not null,
  kind        text not null default '教材' check (kind in ('教材', '论文', '文档', '工具')),
  url         text,
  note        text,
  created_at  timestamptz not null default now()
);

create table module_checklists (
  id          uuid primary key default gen_random_uuid(),
  module_id   uuid not null references modules (id) on delete cascade,
  item        text not null,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

-- ---------- 提交与批阅（平权：通过 / 请再想想） ----------
create table submissions (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references profiles (id),
  module_id   uuid references modules (id),
  project_id  uuid,
  kind        text not null default 'module' check (kind in ('module', 'thought_note', 'graduation', 'deliverable')),
  title       text not null,
  content     text,
  file_paths  jsonb not null default '[]'::jsonb,
  status      text not null default 'pending' check (status in ('pending', 'reviewed')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table reviews (
  id            uuid primary key default gen_random_uuid(),
  submission_id uuid not null references submissions (id) on delete cascade,
  mentor_id     uuid not null references profiles (id),
  verdict       verdict_type not null,     -- 只有「通过 / 请再想想」
  feedback      text,
  created_at    timestamptz not null default now()
);

-- ---------- 初心堂 ----------
create table thought_notes (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references profiles (id),
  title       text not null,
  content     text not null,
  status      text not null default 'pending' check (status in ('pending', 'reviewed')),
  feedback    text,
  mentor_id   uuid references profiles (id),
  created_at  timestamptz not null default now()
);

create table oath_signatures (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null unique references profiles (id),
  rules_agreed jsonb not null default '[]'::jsonb,
  signed_at   timestamptz not null default now()
);

create table origin_archives (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null unique references profiles (id),
  content     text not null,
  sealed_at   timestamptz not null default now(),
  returned    boolean not null default false,   -- 四年后归还
  returned_at timestamptz
);

create table hard_bone_records (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references profiles (id),
  outcome     hard_bone_outcome not null,       -- 四种结局平权
  content     text not null,
  created_at  timestamptz not null default now()
);

create table ai_conversations (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references profiles (id),
  mode        text not null check (mode in ('socratic', 'assistant')),
  messages    jsonb not null default '[]'::jsonb,   -- [{role, content}]
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table cognitive_profiles (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null unique references profiles (id),
  baseline    jsonb not null default '{}'::jsonb,  -- 入学基线（自己 vs 自己）
  current     jsonb not null default '{}'::jsonb,  -- 六轴当前倾向
  updated_at  timestamptz not null default now(),
  -- 认知侧写不构成评价，不得作为筛选依据
  note        text not null default '不构成评价，不得作为筛选依据'
);

-- ---------- 产业调研与原话墙 ----------
create table research_interviews (
  id              uuid primary key default gen_random_uuid(),
  student_id      uuid not null references profiles (id),
  place           text,        -- 去了哪里
  person          text,        -- 和谁聊的（脱敏）
  quote           text not null,   -- 对方原话
  assumed_before  text,        -- 我原本以为的
  changed_after   text,        -- 我听到之后改变的
  gap_not_in_lit  text,        -- 文献里没提到的问题
  linked_project  uuid,        -- 是否关联大创/毕设/第3层方向
  created_at      timestamptz not null default now()
);

create table voice_wall_quotes (
  id          uuid primary key default gen_random_uuid(),
  quote       text not null,          -- 保留真实语气，不加工成「正确问题」
  scene       text,                   -- 场景（生产运营 / 技术研发 ...）
  tag         text,
  status      content_status not null default 'reviewing',  -- 原话墙审核
  submitted_by uuid references profiles (id),
  created_at  timestamptz not null default now()
);

-- ---------- 大创中心 ----------
create table projects (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  type        text,
  field       text,
  owner_id    uuid not null references profiles (id),
  mentor_id   uuid references profiles (id),
  abstract    text,
  status      text not null default 'active' check (status in ('active', 'archived')),
  started_at  date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table project_members (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects (id) on delete cascade,
  student_id  uuid not null references profiles (id),
  role        text,          -- 负责人 / 实验负责人 ...
  duty        text,
  unique (project_id, student_id)
);

create table project_tasks (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects (id) on delete cascade,
  title       text not null,
  assignee_id uuid references profiles (id),
  due_date    date,
  done        boolean not null default false,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

-- ---------- 毕业设计 ----------
create table graduation_projects (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null unique references profiles (id),
  title       text not null,
  mentor_id   uuid references profiles (id),
  direction   text,
  stage       text,          -- 当前阶段（与 milestones 对齐）
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table graduation_milestones (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references graduation_projects (id) on delete cascade,
  name        text not null,          -- 选题确认/开题/实验推进/中期/初稿/定稿/答辩/归档
  planned_at  date,
  state       text not null default '' check (state in ('done', 'current', '')),
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create table graduation_files (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references graduation_projects (id) on delete cascade,
  section     text not null,          -- overview/topic/proposal/experiment/midterm/writing/defense/archive
  title       text not null,
  file_path   text,
  created_at  timestamptz not null default now()
);

-- ---------- 第3层交付物（与毕设/大创打通，不重复提交） ----------
create table deliverables (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references profiles (id),
  direction   text not null check (direction in ('A', 'B', 'C', 'D')),
  title       text not null,
  source_type text not null check (source_type in ('graduation', 'innovation', 'standalone')),
  source_id   uuid,          -- 指向 graduation_projects.id 或 projects.id
  status      text not null default 'active' check (status in ('active', 'archived')),
  created_at  timestamptz not null default now()
);

-- ---------- 能力标签（不可自封） ----------
create table skill_tags (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  description text,
  created_at  timestamptz not null default now()
);

-- 标签归属：来源强制记录，学生无法自行插入（见 RLS）
create table skill_tag_sources (
  id          uuid primary key default gen_random_uuid(),
  tag_id      uuid not null references skill_tags (id) on delete cascade,
  student_id  uuid not null references profiles (id),
  source_type tag_source_type not null,   -- 系统授予 / 导师认证 / 同伴致谢
  granted_by  uuid references profiles (id),   -- 授予人（导师或系统）
  note        text,
  created_at  timestamptz not null default now(),
  unique (tag_id, student_id, source_type)
);

-- 技能包手动授予（学生初稿完成后由导师授予）
create table mentor_skill_grants (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references profiles (id),
  pack_id     uuid not null references skill_tags (id),
  granted_by  uuid not null references profiles (id),
  note        text,
  created_at  timestamptz not null default now(),
  unique (student_id, pack_id)
);

-- ---------- 文件与审计 ----------
create table files (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references profiles (id),
  storage_path text not null,       -- COS/Supabase Storage 路径（预签名上传写入）
  mime_type   text,
  size_bytes  bigint,
  created_at  timestamptz not null default now()
);

create table audit_logs (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid references profiles (id),
  action      text not null,
  entity      text,
  entity_id   uuid,
  detail      jsonb,
  created_at  timestamptz not null default now()
);

-- ---------- 通用触发器：updated_at ----------
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
declare t text;
begin
  foreach t in array array[
    'profiles','figures','modules','submissions','ai_conversations',
    'cognitive_profiles','projects','graduation_projects'
  ] loop
    execute format('create trigger trg_%s_updated before update on %I for each row execute function set_updated_at()', t, t);
  end loop;
end $$;
