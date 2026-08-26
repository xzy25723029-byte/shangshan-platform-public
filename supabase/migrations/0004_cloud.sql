-- ============================================================
-- 0004_cloud.sql · 云服务接入补充
-- 1. profiles 增加审核状态列（正式学员注册后待审核）
-- 2. invitations 种子邀请码（学员内部使用）
-- ============================================================

-- ---------- 审核状态 ----------
alter table profiles
  add column if not exists status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected'));

-- 迁移前已存在的用户默认通过
update profiles set status = 'approved' where status = 'pending';

-- ---------- 邀请码种子（内部使用，管理员可再发放） ----------
insert into invitations (code, role) values
  ('STU2026', 'student'),
  ('MEN2026', 'mentor'),
  ('ADM2026', 'admin'),
  ('SUP2026', 'super_admin')
on conflict (code) do nothing;
