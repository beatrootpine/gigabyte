-- ============================================
-- AUTH SETUP FOR GIGABYTE
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop any existing trigger/function first (safe to re-run)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Function: automatically create a row in public.users when someone signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, subscription_tier, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'free',
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: fires after a user signs up via Supabase auth
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- SUPABASE DASHBOARD CONFIGURATION
-- ============================================
-- After running this SQL, go to your Supabase project dashboard:
--
-- 1. AUTHENTICATION → PROVIDERS
--    - Make sure "Email" is ENABLED
--
-- 2. AUTHENTICATION → SETTINGS
--    - For instant demo access (no email confirmation required):
--      Turn OFF "Confirm email"
--    - For production, turn it back ON
--
-- 3. AUTHENTICATION → URL CONFIGURATION
--    - Site URL: https://gigabyte-events.vercel.app
--    - Redirect URLs: add https://gigabyte-events.vercel.app/** and http://localhost:3000/**
--
-- ============================================
-- TO PROMOTE YOURSELF TO ADMIN AFTER SIGNUP
-- ============================================
-- Run this after you create your first account:
--
--   UPDATE public.users SET role = 'admin' WHERE email = 'your-email@example.com';
--
-- ============================================
