-- Administrators are deliberately excluded from public registration and onboarding.
alter type public.marketplace_role add value if not exists 'admin';

-- Promote the first administrator manually in the Supabase SQL Editor after the
-- account has registered and verified its email. This is intentionally not an API.
-- update public.profiles set role = 'admin', onboarding_completed_at = coalesce(onboarding_completed_at, now()) where email = 'you@example.com';
