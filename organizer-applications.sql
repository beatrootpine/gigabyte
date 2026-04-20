-- ============================================
-- ORGANIZER APPLICATIONS
-- Run in Supabase SQL Editor (safe to re-run)
-- ============================================
--
-- Adds:
--  - organizer_applications table (pending/approved/rejected)
--  - extended role: 'user' | 'organizer' | 'admin' remains the same but
--    new signups marked as organizer applicants don't become 'organizer'
--    until an admin approves.
--  - admin_approve_organizer() RPC: promotes a user and marks app approved
--  - admin_reject_organizer() RPC: marks app rejected with reason
-- ============================================

-- 1. Table
CREATE TABLE IF NOT EXISTS organizer_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  website TEXT,
  event_history TEXT NOT NULL,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_organizer_apps_user ON organizer_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_organizer_apps_status ON organizer_applications(status);

-- One pending application per user at a time
CREATE UNIQUE INDEX IF NOT EXISTS uq_organizer_apps_user_pending
  ON organizer_applications(user_id) WHERE status = 'pending';

-- 2. RLS
ALTER TABLE organizer_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see their own applications" ON organizer_applications;
DROP POLICY IF EXISTS "Users submit their own applications" ON organizer_applications;
DROP POLICY IF EXISTS "Admins see all applications" ON organizer_applications;
DROP POLICY IF EXISTS "Admins update applications" ON organizer_applications;

-- Users see their own application
CREATE POLICY "Users see their own applications"
  ON organizer_applications FOR SELECT
  USING (auth.uid() = user_id);

-- Users can submit their own application
CREATE POLICY "Users submit their own applications"
  ON organizer_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins see everything
CREATE POLICY "Admins see all applications"
  ON organizer_applications FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- Admins update (approve/reject)
CREATE POLICY "Admins update applications"
  ON organizer_applications FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- 3. Approval RPC — promotes user and marks app approved, atomically
CREATE OR REPLACE FUNCTION public.admin_approve_organizer(application_id UUID, notes TEXT DEFAULT NULL)
RETURNS JSONB AS $$
DECLARE
  app RECORD;
  caller_role TEXT;
BEGIN
  -- Only admins can call this
  SELECT role INTO caller_role FROM public.users WHERE id = auth.uid();
  IF caller_role != 'admin' THEN
    RAISE EXCEPTION 'Only admins can approve organizer applications';
  END IF;

  -- Fetch the application
  SELECT * INTO app FROM organizer_applications WHERE id = application_id AND status = 'pending';
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Application not found or already reviewed';
  END IF;

  -- Promote the user to organizer
  UPDATE public.users SET role = 'organizer' WHERE id = app.user_id;

  -- Mark application approved
  UPDATE organizer_applications
  SET status = 'approved',
      reviewed_by = auth.uid(),
      reviewed_at = now(),
      review_notes = notes
  WHERE id = application_id;

  RETURN jsonb_build_object('status', 'approved', 'user_id', app.user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Rejection RPC
CREATE OR REPLACE FUNCTION public.admin_reject_organizer(application_id UUID, notes TEXT DEFAULT NULL)
RETURNS JSONB AS $$
DECLARE
  caller_role TEXT;
BEGIN
  SELECT role INTO caller_role FROM public.users WHERE id = auth.uid();
  IF caller_role != 'admin' THEN
    RAISE EXCEPTION 'Only admins can reject organizer applications';
  END IF;

  UPDATE organizer_applications
  SET status = 'rejected',
      reviewed_by = auth.uid(),
      reviewed_at = now(),
      review_notes = notes
  WHERE id = application_id AND status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Application not found or already reviewed';
  END IF;

  RETURN jsonb_build_object('status', 'rejected');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Verify
SELECT 'organizer_applications table ready' AS status;
