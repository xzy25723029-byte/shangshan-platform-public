-- ============================================================
-- 0002_rls.sql · 行级安全策略（四种角色）
-- 原则（v3 §14 安全原则）：
--   1. 学生只能看自己的私密记录
--   2. 认知侧写不对其他学生可见
--   3. 导师只能看自己指导或被授权查看的学生
--   4. 管理端内容管理有独立权限
--   5. 能力标签来源不可伪造（学生无法自行插入）
-- ============================================================

-- ---------- 辅助函数 ----------
create or replace function auth_role() returns user_role as $$
  select role from profiles where id = auth.uid();
$$ language sql stable security definer;

create or replace function is_mentor_of(target uuid) returns boolean as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role in ('mentor', 'admin', 'super_admin')
      and (id = profiles.mentor_id or role in ('admin', 'super_admin'))
      and profiles.id = target
  );
$$ language sql stable security definer;

create or replace function is_content_manager() returns boolean as $$
  select role in ('admin', 'super_admin') from profiles where id = auth.uid();
$$ language sql stable security definer;

create or replace function is_staff() returns boolean as $$
  select role in ('mentor', 'admin', 'super_admin') from profiles where id = auth.uid();
$$ language sql stable security definer;

-- ---------- 启用 RLS ----------
alter table profiles             enable row level security;
alter table invitations          enable row level security;
alter table figures              enable row level security;
alter table figure_videos        enable row level security;
alter table modules              enable row level security;
alter table module_videos        enable row level security;
alter table module_resources     enable row level security;
alter table module_checklists    enable row level security;
alter table submissions          enable row level security;
alter table reviews              enable row level security;
alter table thought_notes        enable row level security;
alter table oath_signatures      enable row level security;
alter table origin_archives      enable row level security;
alter table hard_bone_records    enable row level security;
alter table ai_conversations     enable row level security;
alter table cognitive_profiles   enable row level security;
alter table research_interviews  enable row level security;
alter table voice_wall_quotes    enable row level security;
alter table projects             enable row level security;
alter table project_members      enable row level security;
alter table project_tasks        enable row level security;
alter table graduation_projects  enable row level security;
alter table graduation_milestones enable row level security;
alter table graduation_files     enable row level security;
alter table deliverables         enable row level security;
alter table skill_tags           enable row level security;
alter table skill_tag_sources    enable row level security;
alter table mentor_skill_grants  enable row level security;
alter table files                enable row level security;
alter table audit_logs           enable row level security;

-- ============================================================
-- profiles：本人读写；导师可见所指导学生；管理员全量
-- ============================================================
create policy "profiles_own_select" on profiles for select
  using (id = auth.uid());
create policy "profiles_own_update" on profiles for update
  using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles_mentor_select" on profiles for select
  using (is_staff());
create policy "profiles_admin_all" on profiles for all
  using (is_content_manager());

-- ============================================================
-- invitations：学生用邀请码加入走 Edge Function（service role）；
-- 普通登录用户不可读/写邀请码
-- ============================================================
create policy "invitations_staff_all" on invitations for all
  using (is_content_manager());

-- ============================================================
-- 内容资源（人物库/视频/模块）：登录用户可读，管理员可写
-- ============================================================
create policy "content_read_any" on figures for select using (auth.uid() is not null and status = 'published');
create policy "content_admin_all" on figures for all using (is_content_manager());
create policy "figure_videos_read" on figure_videos for select using (auth.uid() is not null);
create policy "figure_videos_admin" on figure_videos for all using (is_content_manager());
create policy "modules_read" on modules for select using (auth.uid() is not null);
create policy "modules_admin" on modules for all using (is_content_manager());
create policy "module_videos_read" on module_videos for select using (auth.uid() is not null);
create policy "module_videos_admin" on module_videos for all using (is_content_manager());
create policy "module_resources_read" on module_resources for select using (auth.uid() is not null);
create policy "module_resources_admin" on module_resources for all using (is_content_manager());
create policy "module_checklists_read" on module_checklists for select using (auth.uid() is not null);
create policy "module_checklists_admin" on module_checklists for all using (is_content_manager());

-- ============================================================
-- submissions / reviews：学生本人；导师见所指导学生的；管理员全量
-- ============================================================
create policy "submissions_own" on submissions for all
  using (student_id = auth.uid()) with check (student_id = auth.uid());
create policy "submissions_mentor" on submissions for select
  using (is_mentor_of(student_id));
create policy "submissions_admin" on submissions for all
  using (is_content_manager());

create policy "reviews_mentor_create" on reviews for insert
  with check (mentor_id = auth.uid() and is_mentor_of((select student_id from submissions where id = submission_id)));
create policy "reviews_read_owner" on reviews for select
  using (mentor_id = auth.uid() or is_mentor_of((select student_id from submissions where id = submission_id)));
create policy "reviews_admin" on reviews for all
  using (is_content_manager());

-- ============================================================
-- 初心堂个人记录：仅本人（导师批阅思想札记例外）
-- ============================================================
create policy "thought_notes_own" on thought_notes for all
  using (student_id = auth.uid()) with check (student_id = auth.uid());
create policy "thought_notes_mentor_read_feedback" on thought_notes for select
  using (is_mentor_of(student_id));
create policy "thought_notes_mentor_feedback" on thought_notes for update
  using (is_mentor_of(student_id))
  with check (is_mentor_of(student_id));

create policy "oath_own" on oath_signatures for all
  using (student_id = auth.uid()) with check (student_id = auth.uid());

create policy "archive_own" on origin_archives for all
  using (student_id = auth.uid()) with check (student_id = auth.uid());

create policy "hardbone_own" on hard_bone_records for all
  using (student_id = auth.uid()) with check (student_id = auth.uid());
create policy "hardbone_mentor_read" on hard_bone_records for select
  using (is_mentor_of(student_id));

create policy "ai_conv_own" on ai_conversations for all
  using (student_id = auth.uid()) with check (student_id = auth.uid());

-- 认知侧写：本人读写；导师查看；不对其他学生可见
create policy "cognitive_own" on cognitive_profiles for all
  using (student_id = auth.uid()) with check (student_id = auth.uid());
create policy "cognitive_mentor_read" on cognitive_profiles for select
  using (is_mentor_of(student_id));

-- ============================================================
-- 产业调研 / 原话墙
-- ============================================================
create policy "interviews_own" on research_interviews for all
  using (student_id = auth.uid()) with check (student_id = auth.uid());
create policy "interviews_mentor_read" on research_interviews for select
  using (is_mentor_of(student_id));

create policy "voice_read_any" on voice_wall_quotes for select
  using (auth.uid() is not null and status = 'published');
create policy "voice_insert_any" on voice_wall_quotes for insert
  with check (auth.uid() is not null);
create policy "voice_admin_all" on voice_wall_quotes for all
  using (is_content_manager());

-- ============================================================
-- 大创中心：成员可见；负责人/导师可写；管理员全量
-- ============================================================
create policy "projects_read_member" on projects for select
  using (
    owner_id = auth.uid()
    or exists (select 1 from project_members pm where pm.project_id = projects.id and pm.student_id = auth.uid())
    or is_mentor_of(owner_id)
  );
create policy "projects_write_owner" on projects for all
  using (owner_id = auth.uid() or is_content_manager())
  with check (owner_id = auth.uid() or is_content_manager());

create policy "members_read_project" on project_members for select
  using (exists (select 1 from projects p where p.id = project_members.project_id and (
    p.owner_id = auth.uid()
    or exists (select 1 from project_members me where me.project_id = p.id and me.student_id = auth.uid())
    or is_mentor_of(p.owner_id))));
create policy "members_write_owner" on project_members for all
  using (exists (select 1 from projects p where p.id = project_members.project_id and p.owner_id = auth.uid()))
  with check (exists (select 1 from projects p where p.id = project_members.project_id and p.owner_id = auth.uid()));

create policy "tasks_read_project" on project_tasks for select
  using (exists (select 1 from project_members pm where pm.project_id = project_tasks.project_id and pm.student_id = auth.uid())
         or is_mentor_of((select owner_id from projects where id = project_tasks.project_id)));
create policy "tasks_write_owner" on project_tasks for all
  using (exists (select 1 from projects p where p.id = project_tasks.project_id and p.owner_id = auth.uid()))
  with check (exists (select 1 from projects p where p.id = project_tasks.project_id and p.owner_id = auth.uid()));

-- ============================================================
-- 毕业设计：本人 + 导师
-- ============================================================
create policy "graduation_own" on graduation_projects for all
  using (student_id = auth.uid()) with check (student_id = auth.uid());
create policy "graduation_mentor" on graduation_projects for all
  using (mentor_id = auth.uid() or is_content_manager());

create policy "gmilestones_own" on graduation_milestones for all
  using (exists (select 1 from graduation_projects gp where gp.id = graduation_milestones.project_id and gp.student_id = auth.uid()));
create policy "gmilestones_mentor" on graduation_milestones for select
  using (exists (select 1 from graduation_projects gp where gp.id = graduation_milestones.project_id and gp.mentor_id = auth.uid()));

create policy "gfiles_own" on graduation_files for all
  using (exists (select 1 from graduation_projects gp where gp.id = graduation_files.project_id and gp.student_id = auth.uid()));
create policy "gfiles_mentor" on graduation_files for select
  using (exists (select 1 from graduation_projects gp where gp.id = graduation_files.project_id and gp.mentor_id = auth.uid()));

-- ============================================================
-- 第3层交付物：本人 + 导师 + 管理员
-- ============================================================
create policy "deliverables_own" on deliverables for all
  using (student_id = auth.uid()) with check (student_id = auth.uid());
create policy "deliverables_mentor" on deliverables for select
  using (is_mentor_of(student_id));
create policy "deliverables_admin" on deliverables for all
  using (is_content_manager());

-- ============================================================
-- 能力标签（防自封核心）：
--   skill_tags 只读；skill_tag_sources 只能由导师/管理员插入（或系统 service role），
--   学生角色无权插入 → 能力标签不可自封
-- ============================================================
create policy "tags_read" on skill_tags for select using (auth.uid() is not null);
create policy "tags_admin" on skill_tags for all using (is_content_manager());

create policy "tag_sources_read" on skill_tag_sources for select
  using (student_id = auth.uid() or is_mentor_of(student_id) or is_content_manager());
create policy "tag_sources_mentor_insert" on skill_tag_sources for insert
  with check (auth_role() in ('mentor', 'admin', 'super_admin') and source_type in ('mentor_certified', 'system_grant', 'peer_thanks'));
-- 学生角色无法命中任何 insert 策略 → 自封被数据库层拒绝

create policy "grants_read_own" on mentor_skill_grants for select
  using (student_id = auth.uid() or is_mentor_of(student_id) or is_content_manager());
create policy "grants_mentor_insert" on mentor_skill_grants for insert
  with check (auth_role() in ('mentor', 'admin', 'super_admin'));

-- ============================================================
-- files / audit_logs：文件本人可见；审计仅管理员；写入走 Edge Function（service role）
-- ============================================================
create policy "files_own" on files for all
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "files_admin" on files for select
  using (is_content_manager());

create policy "audit_admin_read" on audit_logs for select
  using (is_content_manager());
-- audit_logs 的写入仅通过 service role（Edge Function / 触发器），无普通用户 insert 策略
