-- Twibbon Hero database, RLS, functions, and Storage policies
-- Run this file once in Supabase Dashboard > SQL Editor.

create extension if not exists pgcrypto;

do $$ begin
  create type public.user_role as enum ('user', 'admin');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.campaign_status as enum ('draft', 'pending', 'published', 'rejected');
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text check (char_length(full_name) <= 100),
  username text unique check (username ~ '^[a-z0-9_]{3,30}$'),
  avatar_url text,
  role public.user_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name_en text not null check (char_length(name_en) between 2 and 60),
  name_id text not null check (char_length(name_id) between 2 and 60),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  icon text,
  created_at timestamptz not null default now()
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  title text not null check (char_length(title) between 3 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  description text not null check (char_length(description) between 10 and 5000),
  frame_path text not null check (frame_path <> ''),
  banner_path text,
  status public.campaign_status not null default 'draft',
  is_featured boolean not null default false,
  starts_at timestamptz,
  ends_at timestamptz,
  moderated_by uuid references public.profiles(id) on delete set null,
  moderated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint campaign_date_order check (
    starts_at is null or ends_at is null or starts_at <= ends_at
  )
);

create table if not exists public.campaign_usages (
  id bigint generated always as identity primary key,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  user_agent text check (char_length(user_agent) <= 500),
  created_at timestamptz not null default now()
);

create table if not exists public.campaign_downloads (
  id bigint generated always as identity primary key,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  format text not null default 'png' check (format in ('png', 'jpg')),
  user_agent text check (char_length(user_agent) <= 500),
  created_at timestamptz not null default now()
);

create table if not exists public.campaign_shares (
  id bigint generated always as identity primary key,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  platform text not null check (platform in ('whatsapp', 'facebook', 'x', 'copy')),
  user_agent text check (char_length(user_agent) <= 500),
  created_at timestamptz not null default now()
);

create index if not exists campaigns_status_created_idx
  on public.campaigns(status, created_at desc);
create index if not exists campaigns_owner_idx on public.campaigns(owner_id);
create index if not exists campaigns_category_idx on public.campaigns(category_id);
create index if not exists campaigns_featured_idx
  on public.campaigns(is_featured desc) where status = 'published';
create index if not exists campaign_usages_campaign_idx
  on public.campaign_usages(campaign_id);
create index if not exists campaign_downloads_campaign_idx
  on public.campaign_downloads(campaign_id);
create index if not exists campaign_shares_campaign_idx
  on public.campaign_shares(campaign_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists campaigns_set_updated_at on public.campaigns;
create trigger campaigns_set_updated_at
before update on public.campaigns
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, nullif(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_usages enable row level security;
alter table public.campaign_downloads enable row level security;
alter table public.campaign_shares enable row level security;

-- Base table privileges are required in addition to RLS policies. RLS remains
-- the authorization layer that decides which individual rows are accessible.
grant usage on schema public to anon, authenticated;

grant select on public.profiles to anon, authenticated;
grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;

grant select on public.campaigns to anon, authenticated;
grant insert, update, delete on public.campaigns to authenticated;

grant insert on public.campaign_usages to anon, authenticated;
grant insert on public.campaign_downloads to anon, authenticated;
grant insert on public.campaign_shares to anon, authenticated;
grant select on public.campaign_usages to authenticated;
grant select on public.campaign_downloads to authenticated;
grant select on public.campaign_shares to authenticated;

grant usage, select on all sequences in schema public to anon, authenticated;

-- Profiles
drop policy if exists "Profiles are publicly readable" on public.profiles;
create policy "Profiles are publicly readable"
on public.profiles for select
using (true);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
on public.profiles for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

drop policy if exists "Admins manage profiles" on public.profiles;
create policy "Admins manage profiles"
on public.profiles for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

-- Do not let normal API clients promote themselves through the role column.
revoke update on public.profiles from authenticated;
grant update (full_name, username, avatar_url) on public.profiles to authenticated;

-- Categories
drop policy if exists "Categories are publicly readable" on public.categories;
create policy "Categories are publicly readable"
on public.categories for select
using (true);

drop policy if exists "Admins manage categories" on public.categories;
create policy "Admins manage categories"
on public.categories for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

-- Campaigns
drop policy if exists "Published campaigns are public" on public.campaigns;
create policy "Published campaigns are public"
on public.campaigns for select
using (
  status = 'published'
  or owner_id = (select auth.uid())
  or (select public.is_admin())
);

drop policy if exists "Authenticated users create campaigns" on public.campaigns;
create policy "Authenticated users create campaigns"
on public.campaigns for insert to authenticated
with check (
  owner_id = (select auth.uid())
  and status in ('draft', 'pending')
  and is_featured = false
  and moderated_by is null
  and moderated_at is null
);

drop policy if exists "Owners update campaigns for review" on public.campaigns;
create policy "Owners update campaigns for review"
on public.campaigns for update to authenticated
using (owner_id = (select auth.uid()))
with check (
  owner_id = (select auth.uid())
  and status in ('draft', 'pending', 'rejected')
  and is_featured = false
  and moderated_by is null
  and moderated_at is null
);

drop policy if exists "Owners delete campaigns" on public.campaigns;
create policy "Owners delete campaigns"
on public.campaigns for delete to authenticated
using (owner_id = (select auth.uid()));

drop policy if exists "Admins manage all campaigns" on public.campaigns;
create policy "Admins manage all campaigns"
on public.campaigns for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

-- Anonymous aggregate events can only be added for public campaigns. A caller
-- cannot attribute an event to another authenticated user.
drop policy if exists "Record public campaign usage" on public.campaign_usages;
create policy "Record public campaign usage"
on public.campaign_usages for insert
with check (
  (user_id is null or user_id = (select auth.uid()))
  and exists (
    select 1 from public.campaigns
    where id = campaign_id and status = 'published'
  )
);

drop policy if exists "Record public campaign downloads" on public.campaign_downloads;
create policy "Record public campaign downloads"
on public.campaign_downloads for insert
with check (
  (user_id is null or user_id = (select auth.uid()))
  and exists (
    select 1 from public.campaigns
    where id = campaign_id and status = 'published'
  )
);

drop policy if exists "Record public campaign shares" on public.campaign_shares;
create policy "Record public campaign shares"
on public.campaign_shares for insert
with check (
  (user_id is null or user_id = (select auth.uid()))
  and exists (
    select 1 from public.campaigns
    where id = campaign_id and status = 'published'
  )
);

drop policy if exists "Owners read campaign usage" on public.campaign_usages;
create policy "Owners read campaign usage"
on public.campaign_usages for select to authenticated
using (
  exists (
    select 1 from public.campaigns
    where id = campaign_id and owner_id = (select auth.uid())
  )
  or (select public.is_admin())
);

drop policy if exists "Owners read campaign downloads" on public.campaign_downloads;
create policy "Owners read campaign downloads"
on public.campaign_downloads for select to authenticated
using (
  exists (
    select 1 from public.campaigns
    where id = campaign_id and owner_id = (select auth.uid())
  )
  or (select public.is_admin())
);

drop policy if exists "Owners read campaign shares" on public.campaign_shares;
create policy "Owners read campaign shares"
on public.campaign_shares for select to authenticated
using (
  exists (
    select 1 from public.campaigns
    where id = campaign_id and owner_id = (select auth.uid())
  )
  or (select public.is_admin())
);

-- Storage buckets. Frames/banners are intentionally public; raw user uploads
-- are private. The editor currently processes photos locally for better privacy.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('campaign-frames', 'campaign-frames', true, 10485760, array['image/png']),
  ('campaign-banners', 'campaign-banners', true, 10485760, array['image/png','image/jpeg','image/webp']),
  ('user-uploads', 'user-uploads', false, 12582912, array['image/png','image/jpeg','image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public reads campaign frames" on storage.objects;
create policy "Public reads campaign frames"
on storage.objects for select
using (bucket_id = 'campaign-frames');

drop policy if exists "Public reads campaign banners" on storage.objects;
create policy "Public reads campaign banners"
on storage.objects for select
using (bucket_id = 'campaign-banners');

drop policy if exists "Owners upload campaign assets" on storage.objects;
create policy "Owners upload campaign assets"
on storage.objects for insert to authenticated
with check (
  bucket_id in ('campaign-frames', 'campaign-banners')
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Owners update campaign assets" on storage.objects;
create policy "Owners update campaign assets"
on storage.objects for update to authenticated
using (
  bucket_id in ('campaign-frames', 'campaign-banners')
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id in ('campaign-frames', 'campaign-banners')
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Owners delete campaign assets" on storage.objects;
create policy "Owners delete campaign assets"
on storage.objects for delete to authenticated
using (
  bucket_id in ('campaign-frames', 'campaign-banners')
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or (select public.is_admin())
  )
);

drop policy if exists "Users manage private uploads" on storage.objects;
create policy "Users manage private uploads"
on storage.objects for all to authenticated
using (
  bucket_id = 'user-uploads'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'user-uploads'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

insert into public.categories (name_en, name_id, slug, icon)
values
  ('Social', 'Sosial', 'social', 'heart-handshake'),
  ('Education', 'Pendidikan', 'education', 'graduation-cap'),
  ('Environment', 'Lingkungan', 'environment', 'leaf'),
  ('Health', 'Kesehatan', 'health', 'heart-pulse'),
  ('Event', 'Acara', 'event', 'calendar-days'),
  ('Community', 'Komunitas', 'community', 'users'),
  ('Celebration', 'Perayaan', 'celebration', 'party-popper')
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_id = excluded.name_id,
  icon = excluded.icon;

-- Promote the first administrator manually after registering:
-- update public.profiles set role = 'admin' where id = '<AUTH_USER_UUID>';
