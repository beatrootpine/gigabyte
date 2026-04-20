-- ============================================
-- TICKETS TABLE
-- Run this in Supabase SQL Editor
-- Creates the tickets table with RLS so users can buy and see their own tickets
-- Safe to re-run
-- ============================================

CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  ticket_type TEXT NOT NULL,
  price NUMERIC NOT NULL,
  service_fee NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL,
  payment_mode TEXT NOT NULL CHECK (payment_mode IN ('full', 'plan')),
  payment_status TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('paid', 'pending', 'partially_paid')),
  qr_hash TEXT NOT NULL,
  seat TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'transferred', 'resold', 'used', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tickets_user ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_event ON tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);

-- Enable RLS
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if rerunning
DROP POLICY IF EXISTS "Users can see their own tickets" ON tickets;
DROP POLICY IF EXISTS "Users can buy their own tickets" ON tickets;
DROP POLICY IF EXISTS "Users can update their own tickets" ON tickets;

-- Users see only their own tickets
CREATE POLICY "Users can see their own tickets"
  ON tickets FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only create tickets for themselves
CREATE POLICY "Users can buy their own tickets"
  ON tickets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own tickets (for transfer/resell)
CREATE POLICY "Users can update their own tickets"
  ON tickets FOR UPDATE
  USING (auth.uid() = user_id);

-- Verify
SELECT
  policyname, cmd
FROM pg_policies
WHERE tablename = 'tickets';
