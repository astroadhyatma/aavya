-- AAVYA production data model
-- Run this in a new Supabase project before connecting real users.
create extension if not exists pgcrypto;
create type public.audience_type as enum ('school','college');
create type public.member_role as enum ('owner','admin','counsellor','educator','student');

create table public.profiles (id uuid primary key references auth.users(id) on delete cascade, full_name text, audience audience_type, stage text, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.institutions (id uuid primary key default gen_random_uuid(), name text not null, type audience_type not null, slug text unique not null, status text not null default 'trial', created_at timestamptz not null default now());
create table public.institution_members (institution_id uuid not null references public.institutions(id) on delete cascade, user_id uuid not null references public.profiles(id) on delete cascade, role member_role not null, joined_at timestamptz not null default now(), primary key (institution_id,user_id));
create table public.checkins (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, mood text not null, stress smallint not null check (stress between 0 and 10), energy text, need text, created_at timestamptz not null default now());
create table public.journal_entries (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, body text not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.goals (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, title text not null, status text not null default 'active', created_at timestamptz not null default now(), completed_at timestamptz);
create table public.exercise_progress (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, exercise_key text not null, completed_at timestamptz not null default now(), unique(user_id,exercise_key));
create table public.programs (id uuid primary key default gen_random_uuid(), institution_id uuid references public.institutions(id) on delete cascade, audience audience_type not null, title text not null, stage text, description text, active boolean not null default true, created_at timestamptz not null default now());
create table public.program_enrollments (program_id uuid not null references public.programs(id) on delete cascade, user_id uuid not null references public.profiles(id) on delete cascade, status text not null default 'active', enrolled_at timestamptz not null default now(), primary key(program_id,user_id));
create table public.demo_requests (id uuid primary key default gen_random_uuid(), institution_name text not null, institution_type audience_type not null, contact_name text not null, email text not null, message text, created_at timestamptz not null default now());

alter table public.profiles enable row level security;
alter table public.institutions enable row level security;
alter table public.institution_members enable row level security;
alter table public.checkins enable row level security;
alter table public.journal_entries enable row level security;
alter table public.goals enable row level security;
alter table public.exercise_progress enable row level security;
alter table public.programs enable row level security;
alter table public.program_enrollments enable row level security;
alter table public.demo_requests enable row level security;

create policy "profiles own row" on public.profiles for all using (id=auth.uid()) with check (id=auth.uid());
create policy "members see own memberships" on public.institution_members for select using (user_id=auth.uid());
create policy "student checkins private" on public.checkins for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "journal private" on public.journal_entries for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "goals private" on public.goals for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "exercise progress private" on public.exercise_progress for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "enrollment private" on public.program_enrollments for select using (user_id=auth.uid());
create policy "active programs readable" on public.programs for select using (active=true);
create policy "demo requests insert only" on public.demo_requests for insert with check (true);

-- Institution dashboards must use aggregate RPCs/views. Do not grant raw access to journals or check-ins.
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(id,full_name) values (new.id,coalesce(new.raw_user_meta_data->>'full_name','')) on conflict (id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
