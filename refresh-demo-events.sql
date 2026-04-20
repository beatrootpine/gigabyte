-- ============================================
-- REFRESH DEMO EVENT DATES
-- Spreads all events across the next 90 days
-- Safe to re-run any time — ideal for keeping a demo fresh
-- Run in Supabase SQL Editor whenever the dates go stale
-- ============================================

-- Weekend-category events (Nightlife, Music, Comedy) get Fri/Sat dates
-- Everything else (Food, Sports) gets any day of the week
DO $$
DECLARE
  rec RECORD;
  new_date DATE;
  target_dow INT;
  tries INT;
  start_time TIME;
BEGIN
  FOR rec IN SELECT id, category, time FROM events LOOP
    -- Parse stored time like "20:00" back into a real TIME, default 20:00
    BEGIN
      start_time := COALESCE(NULLIF(rec.time, '')::time, '20:00'::time);
    EXCEPTION WHEN OTHERS THEN
      start_time := '20:00'::time;
    END;

    -- Weekend-ish events prefer Fri (5) or Sat (6)
    IF rec.category IN ('Nightlife', 'Music', 'Comedy') THEN
      target_dow := CASE WHEN random() > 0.5 THEN 5 ELSE 6 END;
    ELSE
      target_dow := -1;  -- don't force weekday
    END IF;

    -- Pick a date 7–90 days in the future, preferring the target weekday
    tries := 0;
    LOOP
      new_date := CURRENT_DATE + ((7 + floor(random() * 83))::int);
      EXIT WHEN target_dow = -1 OR EXTRACT(DOW FROM new_date) = target_dow OR tries >= 8;
      tries := tries + 1;
    END LOOP;

    UPDATE events
    SET date = (new_date + start_time) AT TIME ZONE 'Africa/Johannesburg'
    WHERE id = rec.id;
  END LOOP;
END $$;

-- Verify — should show events ordered soonest-first, all in the future
SELECT
  TO_CHAR(date, 'Dy DD Mon') AS when,
  title,
  category,
  city
FROM events
WHERE date > now()
ORDER BY date ASC
LIMIT 15;
