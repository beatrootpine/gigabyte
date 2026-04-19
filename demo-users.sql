-- ============================================
-- DEMO USER ACCOUNTS FOR GIGABYTE
-- Run this in Supabase SQL Editor AFTER running auth-setup.sql
-- ============================================
--
-- Creates 5 demo accounts covering every user type:
--   1. demo@gigabyte.co.za       — Free tier regular user
--   2. pro@gigabyte.co.za        — Pro subscriber
--   3. premium@gigabyte.co.za    — Premium subscriber
--   4. organizer@gigabyte.co.za  — Event organizer
--   5. admin@gigabyte.co.za      — Platform admin
--
-- All demo accounts use the same password: Gigabyte2026!
-- Email confirmation is set to completed so they can log in immediately.
-- ============================================

-- Safety: remove any previous demo users before re-seeding
DELETE FROM public.users WHERE email IN (
  'demo@gigabyte.co.za',
  'pro@gigabyte.co.za',
  'premium@gigabyte.co.za',
  'organizer@gigabyte.co.za',
  'admin@gigabyte.co.za'
);
DELETE FROM auth.users WHERE email IN (
  'demo@gigabyte.co.za',
  'pro@gigabyte.co.za',
  'premium@gigabyte.co.za',
  'organizer@gigabyte.co.za',
  'admin@gigabyte.co.za'
);

-- ============================================
-- 1. Free tier regular user
-- ============================================
WITH new_user AS (
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at, raw_user_meta_data,
    is_super_admin, confirmation_token, email_change, email_change_token_new, recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'demo@gigabyte.co.za',
    crypt('Gigabyte2026!', gen_salt('bf')),
    now(), now(), now(),
    '{"full_name":"Demo User","provider":"email"}'::jsonb,
    false, '', '', '', ''
  )
  RETURNING id, email
)
INSERT INTO public.users (id, email, full_name, subscription_tier, role)
SELECT id, email, 'Demo User', 'free', 'user' FROM new_user
ON CONFLICT (id) DO UPDATE SET subscription_tier = 'free', role = 'user';

-- ============================================
-- 2. Pro subscriber
-- ============================================
WITH new_user AS (
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at, raw_user_meta_data,
    is_super_admin, confirmation_token, email_change, email_change_token_new, recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'pro@gigabyte.co.za',
    crypt('Gigabyte2026!', gen_salt('bf')),
    now(), now(), now(),
    '{"full_name":"Thabo Mokoena","provider":"email"}'::jsonb,
    false, '', '', '', ''
  )
  RETURNING id, email
)
INSERT INTO public.users (id, email, full_name, subscription_tier, role)
SELECT id, email, 'Thabo Mokoena', 'pro', 'user' FROM new_user
ON CONFLICT (id) DO UPDATE SET subscription_tier = 'pro', role = 'user';

-- ============================================
-- 3. Premium subscriber
-- ============================================
WITH new_user AS (
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at, raw_user_meta_data,
    is_super_admin, confirmation_token, email_change, email_change_token_new, recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'premium@gigabyte.co.za',
    crypt('Gigabyte2026!', gen_salt('bf')),
    now(), now(), now(),
    '{"full_name":"Lerato Khumalo","provider":"email"}'::jsonb,
    false, '', '', '', ''
  )
  RETURNING id, email
)
INSERT INTO public.users (id, email, full_name, subscription_tier, role)
SELECT id, email, 'Lerato Khumalo', 'premium', 'user' FROM new_user
ON CONFLICT (id) DO UPDATE SET subscription_tier = 'premium', role = 'user';

-- ============================================
-- 4. Event organizer
-- ============================================
WITH new_user AS (
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at, raw_user_meta_data,
    is_super_admin, confirmation_token, email_change, email_change_token_new, recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'organizer@gigabyte.co.za',
    crypt('Gigabyte2026!', gen_salt('bf')),
    now(), now(), now(),
    '{"full_name":"Sipho Dlamini","provider":"email"}'::jsonb,
    false, '', '', '', ''
  )
  RETURNING id, email
)
INSERT INTO public.users (id, email, full_name, subscription_tier, role)
SELECT id, email, 'Sipho Dlamini', 'pro', 'organizer' FROM new_user
ON CONFLICT (id) DO UPDATE SET subscription_tier = 'pro', role = 'organizer';

-- ============================================
-- 5. Platform admin
-- ============================================
WITH new_user AS (
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at, raw_user_meta_data,
    is_super_admin, confirmation_token, email_change, email_change_token_new, recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@gigabyte.co.za',
    crypt('Gigabyte2026!', gen_salt('bf')),
    now(), now(), now(),
    '{"full_name":"Mo Moshoane","provider":"email"}'::jsonb,
    false, '', '', '', ''
  )
  RETURNING id, email
)
INSERT INTO public.users (id, email, full_name, subscription_tier, role)
SELECT id, email, 'Mo Moshoane', 'premium', 'admin' FROM new_user
ON CONFLICT (id) DO UPDATE SET subscription_tier = 'premium', role = 'admin';

-- ============================================
-- Done. Verify with:
--   SELECT email, full_name, subscription_tier, role FROM public.users ORDER BY role, email;
-- ============================================
