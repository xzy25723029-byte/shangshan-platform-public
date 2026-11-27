-- A member can read their project, and only its assigned mentor can give feedback.
create function public.can_read_innovation_project(target uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.projects p
    where p.id = target and (
      p.owner_id = auth.uid() or p.mentor_id = auth.uid()
      or exists (
        select 1 from public.project_members m
        where m.project_id = p.id and m.student_id = auth.uid()
      )
    )
  );
$$;

create function public.is_innovation_project_mentor(target uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.projects p join public.profiles u on u.id = p.mentor_id
    where p.id = target and u.id = auth.uid() and u.role = 'mentor' and u.status = 'approved'
  );
$$;

revoke execute on function public.can_read_innovation_project(uuid) from public;
revoke execute on function public.is_innovation_project_mentor(uuid) from public;
grant execute on function public.can_read_innovation_project(uuid) to authenticated;
grant execute on function public.is_innovation_project_mentor(uuid) to authenticated;

-- The previous read policies for projects and members referenced each other.
drop policy projects_read_member on public.projects;
create policy projects_read_member on public.projects for select to authenticated
  using (public.can_read_innovation_project(id));
drop policy members_read_project on public.project_members;
create policy members_read_project on public.project_members for select to authenticated
  using (public.can_read_innovation_project(project_id));
drop policy tasks_read_project on public.project_tasks;
create policy tasks_read_project on public.project_tasks for select to authenticated
  using (public.can_read_innovation_project(project_id));

-- Prevent a user from changing the role or approval status used by the progress policies.
create function public.protect_own_profile_permissions() returns trigger
language plpgsql set search_path = '' as $$
begin
  if old.id = auth.uid() and (new.role is distinct from old.role or new.status is distinct from old.status) then
    raise exception 'Users cannot change their own role or approval status' using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger protect_own_profile_permissions before update of role, status on public.profiles
  for each row execute function public.protect_own_profile_permissions();

create table public.project_progress (
  id uuid primary key,
  project_id uuid not null references public.projects(id) on delete cascade,
  student_id uuid not null default auth.uid() references public.profiles(id),
  summary text not null check (char_length(btrim(summary)) between 1 and 3000),
  challenges text not null default '' check (char_length(challenges) <= 3000),
  next_steps text not null check (char_length(btrim(next_steps)) between 1 and 3000),
  submitted_at timestamptz not null default now(),
  feedback text check (char_length(btrim(feedback)) between 1 and 3000),
  feedback_at timestamptz
);

create index project_progress_project_student_time
  on public.project_progress (project_id, student_id, submitted_at desc);

alter table public.project_progress enable row level security;
revoke all on table public.project_progress from public, anon, authenticated;
grant select on table public.project_progress to authenticated;
grant insert (id, project_id, summary, challenges, next_steps) on public.project_progress to authenticated;
grant update (feedback) on public.project_progress to authenticated;

create policy project_progress_read on public.project_progress for select to authenticated
  using (student_id = (select auth.uid()) or public.is_innovation_project_mentor(project_id));

create policy project_progress_submit on public.project_progress for insert to authenticated
  with check (
    student_id = (select auth.uid()) and public.can_read_innovation_project(project_id)
    and exists (
      select 1 from public.profiles u where u.id = (select auth.uid())
        and u.role = 'student' and u.status = 'approved'
    )
  );

create policy project_progress_feedback on public.project_progress for update to authenticated
  using (public.is_innovation_project_mentor(project_id))
  with check (public.is_innovation_project_mentor(project_id) and feedback is not null);

create function public.stamp_project_progress_feedback() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.feedback is distinct from old.feedback then
    new.feedback_at := now();
  end if;
  return new;
end;
$$;

create trigger stamp_project_progress_feedback before update of feedback on public.project_progress
  for each row execute function public.stamp_project_progress_feedback();
