-- ============================================
-- REFRESH DEMO EVENT DATES
-- Redistributes all events with past dates across the next 120 days
-- so the demo always shows upcoming events regardless of when it's viewed
-- Safe to re-run any time the demo looks stale
-- ============================================

-- For each past event: shift to a random day in the next 4 months,
-- preferring Fri/Sat evenings (more realistic for nightlife/shows)
UPDATE events
SET date = (
  -- Base: today + random number of days between 1 and 120
  (CURRENT_DATE + (floor(random() * 120) + 1)::int)::timestamp
  -- Add realistic show time: randomly between 18:00 and 22:00
  + (floor(random() * 5) + 18 || ' hours')::interval
  + (floor(random() * 4) * 15 || ' minutes')::interval
)
WHERE date < NOW();

-- Nudge some events onto weekends for realism
-- (events currently on Mon-Wed get shifted to the following Fri/Sat/Sun)
UPDATE events
SET date = date + (
  CASE EXTRACT(dow FROM date)::int
    WHEN 1 THEN 4  -- Mon → Fri
    WHEN 2 THEN 3  -- Tue → Fri
    WHEN 3 THEN 2  -- Wed → Fri
    ELSE 0
  END || ' days'
)::interval
WHERE category IN ('Music', 'Nightlife', 'Comedy')
  AND date >= NOW()
  AND EXTRACT(dow FROM date) BETWEEN 1 AND 3;

-- Show the date spread so you can verify
SELECT
  COUNT(*) AS total_events,
  MIN(date)::date AS earliest,
  MAX(date)::date AS latest,
  COUNT(*) FILTER (WHERE date < NOW()) AS still_in_past
FROM events;

-- Sample of upcoming events by date
SELECT title, category, city, date::date AS event_date, to_char(date, 'Dy HH24:MI') AS day_time
FROM events
WHERE date >= NOW()
ORDER BY date
LIMIT 15;
