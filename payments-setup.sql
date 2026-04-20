-- ============================================
-- GIGABYTE PAYMENTS SETUP (self-contained)
-- Run this in Supabase SQL Editor
-- Creates: tickets, payment_plans, installments — plus RLS + helpers
-- Safe to re-run
-- ============================================

-- ============================================
-- 1. TICKETS TABLE
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

ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can see their own tickets" ON tickets;
DROP POLICY IF EXISTS "Users can buy their own tickets" ON tickets;
DROP POLICY IF EXISTS "Users can update their own tickets" ON tickets;

CREATE POLICY "Users can see their own tickets" ON tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can buy their own tickets" ON tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tickets" ON tickets FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- 2. PAYMENT PLANS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount NUMERIC NOT NULL,
  installments_total INT NOT NULL DEFAULT 3,
  installments_paid INT NOT NULL DEFAULT 0,
  installment_amount NUMERIC NOT NULL,
  frequency TEXT NOT NULL DEFAULT 'monthly' CHECK (frequency IN ('monthly', 'biweekly')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_plans_user ON payment_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_plans_ticket ON payment_plans(ticket_id);

ALTER TABLE payment_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see their own plans" ON payment_plans;
DROP POLICY IF EXISTS "Users create their own plans" ON payment_plans;
DROP POLICY IF EXISTS "Users update their own plans" ON payment_plans;

CREATE POLICY "Users see their own plans" ON payment_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create their own plans" ON payment_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update their own plans" ON payment_plans FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- 3. INSTALLMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS installments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES payment_plans(id) ON DELETE CASCADE,
  installment_number INT NOT NULL,
  amount NUMERIC NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_installments_plan ON installments(plan_id);
CREATE INDEX IF NOT EXISTS idx_installments_status ON installments(status);

ALTER TABLE installments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see their own installments" ON installments;
DROP POLICY IF EXISTS "Users create their own installments" ON installments;
DROP POLICY IF EXISTS "Users update their own installments" ON installments;

CREATE POLICY "Users see their own installments" ON installments FOR SELECT
  USING (EXISTS (SELECT 1 FROM payment_plans WHERE payment_plans.id = installments.plan_id AND payment_plans.user_id = auth.uid()));

CREATE POLICY "Users create their own installments" ON installments FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM payment_plans WHERE payment_plans.id = installments.plan_id AND payment_plans.user_id = auth.uid()));

CREATE POLICY "Users update their own installments" ON installments FOR UPDATE
  USING (EXISTS (SELECT 1 FROM payment_plans WHERE payment_plans.id = installments.plan_id AND payment_plans.user_id = auth.uid()));

-- ============================================
-- 4. RPC: pay_installment
-- Records one installment paid, updates plan counters, and if all paid,
-- marks plan completed and the ticket payment_status = 'paid'
-- ============================================
CREATE OR REPLACE FUNCTION public.pay_installment(installment_id UUID)
RETURNS JSONB AS $$
DECLARE
  inst RECORD;
  plan RECORD;
  new_paid_count INT;
BEGIN
  -- Fetch the installment and verify ownership via plan
  SELECT i.*, p.user_id AS plan_user_id, p.ticket_id, p.installments_total, p.installments_paid
  INTO inst
  FROM installments i
  JOIN payment_plans p ON p.id = i.plan_id
  WHERE i.id = installment_id AND i.status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Installment not found or already paid';
  END IF;

  IF inst.plan_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Not authorised to pay this installment';
  END IF;

  -- Mark installment paid
  UPDATE installments
  SET status = 'paid', paid_at = now()
  WHERE id = installment_id;

  -- Bump plan counter
  new_paid_count := inst.installments_paid + 1;
  UPDATE payment_plans
  SET installments_paid = new_paid_count,
      status = CASE WHEN new_paid_count >= inst.installments_total THEN 'completed' ELSE 'active' END
  WHERE id = inst.plan_id;

  -- If this completes the plan, mark the ticket fully paid
  IF new_paid_count >= inst.installments_total THEN
    UPDATE tickets
    SET payment_status = 'paid'
    WHERE id = inst.ticket_id;
  END IF;

  RETURN jsonb_build_object(
    'installment_id', installment_id,
    'paid', new_paid_count,
    'total', inst.installments_total,
    'plan_completed', new_paid_count >= inst.installments_total
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Done
-- ============================================
SELECT 'payments tables ready' AS status;
