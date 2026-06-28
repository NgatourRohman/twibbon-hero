-- Patch for an existing Twibbon Hero Supabase project.
-- Run once in Supabase Dashboard > SQL Editor.

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

-- Keep profile role escalation blocked for normal authenticated clients.
revoke update on public.profiles from authenticated;
grant update (full_name, username, avatar_url) on public.profiles to authenticated;
