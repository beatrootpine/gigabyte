-- ============================================
-- ORGANIZER WRITE PERMISSIONS
-- Run this in Supabase SQL Editor to allow organizers to create events
-- Safe to re-run (drops existing policies first)
-- ============================================

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Organizers can insert events" ON events;
DROP POLICY IF EXISTS "Organizers can update events" ON events;
DROP POLICY IF EXISTS "Organizers can delete events" ON events;

-- Allow organizers and admins to create new events
CREATE POLICY "Organizers can insert events"
  ON events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('organizer', 'admin')
    )
  );

-- Allow organizers and admins to update events
CREATE POLICY "Organizers can update events"
  ON events FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('organizer', 'admin')
    )
  );

-- Allow organizers and admins to delete events
CREATE POLICY "Organizers can delete events"
  ON events FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('organizer', 'admin')
    )
  );

-- Confirm RLS is enabled on events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Verify policies
SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'events';
