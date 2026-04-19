-- ============================================
-- REALISTIC SA EVENT PRICING UPDATE
-- Run this in Supabase SQL Editor to update existing demo events
-- with pricing benchmarked against real South African events
-- ============================================

-- ============================================
-- JOHANNESBURG EVENTS
-- ============================================

-- Music festivals (benchmark: DSTV Delicious R350-R850, 947 Joburg Day R650-R1,200)
UPDATE events SET price_min = 350, price_max = 1200, title = 'DSTV Delicious Food & Music Festival'
WHERE title = 'Safaricom Live Music Festival';

-- Comedy (benchmark: Loyiso Gola R180-R400, Trevor Noah R450-R1,500)
UPDATE events SET price_min = 180, price_max = 420
WHERE title = 'Joe Stone Comedy Show';

UPDATE events SET price_min = 150, price_max = 380
WHERE title = 'Comedy Night Stand-Up';

-- Sports - Soweto Derby (benchmark: R120-R800, premium boxes R1,500+)
UPDATE events SET price_min = 120, price_max = 800
WHERE title = 'Kaizer Chiefs vs Orlando Pirates';

-- Rugby URC (benchmark: Loftus R150-R500, URC final R250-R800)
UPDATE events SET price_min = 150, price_max = 500
WHERE title = 'Rugby: Bulls vs Sharks';

-- Food festivals (benchmark: Neighbourgoods R40-R120, DSTV Delicious R350-R850)
UPDATE events SET price_min = 120, price_max = 280
WHERE title = 'Spring Food Festival';

-- Amapiano (benchmark: Ba2cada Live R280-R650, Groovist Sessions R150-R400)
UPDATE events SET price_min = 280, price_max = 650
WHERE title = 'Amapiano Vibes';

-- Premium nightclub (benchmark: Taboo/Konka entry R150-R450)
UPDATE events SET price_min = 180, price_max = 450
WHERE title = 'Nightlife at Taboo';

-- Workshop/Masterclass (benchmark: professional workshops R450-R1,200)
UPDATE events SET price_min = 550, price_max = 1200
WHERE title = 'Workshop: Digital Marketing';

-- Premium dining experience (benchmark: Sushi Mori R650-R950, chef dinners R450-R1,500)
UPDATE events SET price_min = 580, price_max = 950
WHERE title = 'Sushi Night Dinner Experience';

-- ============================================
-- CAPE TOWN EVENTS
-- ============================================

-- Cape Town Jazz Festival (benchmark: real CTJF R650-R1,800)
UPDATE events SET price_min = 650, price_max = 1800
WHERE title = 'Cape Town Jazz Festival';

-- Comedy (benchmark: Parker's Comedy R180-R450)
UPDATE events SET price_min = 180, price_max = 450
WHERE title = 'Comedy Night Out Cape Town';

-- V&A Market food (entry-based, not premium)
UPDATE events SET price_min = 80, price_max = 220
WHERE title = 'Ocean Basket Food Festival';

-- Test Cricket at Newlands (benchmark: R150-R650, premium stands R800+)
UPDATE events SET price_min = 150, price_max = 650
WHERE title = 'Cricket: Proteas vs Australia';

-- Underground electronic (benchmark: Cape Town rave scene R280-R550)
UPDATE events SET price_min = 280, price_max = 550
WHERE title = 'Underground Rave Cape Town';

-- Constantia wine tasting (benchmark: Groot Constantia R220-R480)
UPDATE events SET price_min = 220, price_max = 480
WHERE title = 'Wine Tasting Event';

-- Beach sports (benchmark: local tournaments R60-R150)
UPDATE events SET price_min = 60, price_max = 150
WHERE title = 'Beach Volleyball Tournament';

-- Live acoustic (benchmark: Alma Café R180-R380)
UPDATE events SET price_min = 180, price_max = 380
WHERE title = 'Live Acoustic Sessions';

-- Foundation/Shimmy nightclub (benchmark: R180-R450)
UPDATE events SET price_min = 180, price_max = 450
WHERE title = 'Nightclub Experience';

-- Woodstock food trucks (benchmark: market entry R40-R120)
UPDATE events SET price_min = 40, price_max = 120
WHERE title = 'Food Truck Festival';

-- ============================================
-- DURBAN EVENTS
-- ============================================

-- Durban Jazz (benchmark: Suncoast jazz R250-R650)
UPDATE events SET price_min = 250, price_max = 650
WHERE title = 'Durban Jazz Experience';

-- Touring comedy (benchmark: Playhouse R180-R420)
UPDATE events SET price_min = 180, price_max = 420
WHERE title = 'Comedy Tour Stop Durban';

-- Durban Food & Wine (benchmark: ICC event R180-R420)
UPDATE events SET price_min = 180, price_max = 420
WHERE title = 'Durban Food & Wine Expo';

-- Sharks URC Rugby (benchmark: Kings Park R150-R500)
UPDATE events SET price_min = 150, price_max = 500
WHERE title = 'Sharks vs Stormers';

-- Beachfront nightclub (benchmark: R180-R450)
UPDATE events SET price_min = 180, price_max = 450
WHERE title = 'Beachfront Nightclub Experience';

-- Seafood festival (benchmark: Point waterfront R120-R280)
UPDATE events SET price_min = 120, price_max = 280
WHERE title = 'Seafood Festival Durban';

-- Local music venue (benchmark: Bluff live music R120-R280)
UPDATE events SET price_min = 120, price_max = 280
WHERE title = 'Live Music Nights';

-- Athletics meet (benchmark: regional athletics R60-R180)
UPDATE events SET price_min = 60, price_max = 180
WHERE title = 'Athletics Championship';

-- Comedy festival (benchmark: Comedy Central tours R220-R550)
UPDATE events SET price_min = 220, price_max = 550
WHERE title = 'Comedy Festival';

-- uShaka night market (benchmark: market entry R40-R120)
UPDATE events SET price_min = 40, price_max = 120
WHERE title = 'Night Market Experience';

-- ============================================
-- ADD 20 NEW EVENTS WITH REALISTIC SA PRICING
-- Expands demo to 50+ events
-- ============================================

INSERT INTO events (title, description, category, location, city, date, time, image_url, price_min, price_max, venue, capacity, organizer) VALUES

-- JOHANNESBURG
('Black Coffee at Konka', 'World-renowned DJ Black Coffee headlines an exclusive night', 'Nightlife', 'Soweto', 'Johannesburg', '2024-08-16 22:00:00+00', '22:00', 'https://images.unsplash.com/photo-1571266028243-d220c9c3b31f?w=800', 350, 1200, 'Konka Soweto', 2500, 'Konka Events'),

('Nasty C Zulu Man Tour', 'SA rap star Nasty C live in concert', 'Music', 'Johannesburg', 'Johannesburg', '2024-08-20 20:00:00+00', '20:00', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800', 280, 750, 'Ticketpro Dome', 8000, 'MTN Live'),

('Trevor Noah Homecoming Show', 'Exclusive Johannesburg return show', 'Comedy', 'Sandton', 'Johannesburg', '2024-08-24 20:00:00+00', '20:00', 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800', 450, 1500, 'Teatro at Montecasino', 1800, 'Showtime SA'),

('Currie Cup Final', 'SA Rugby Currie Cup grand final', 'Sports', 'Johannesburg', 'Johannesburg', '2024-09-07 16:00:00+00', '16:00', 'https://images.unsplash.com/photo-1557862921-37829c790f19?w=800', 180, 650, 'Ellis Park Stadium', 62000, 'SA Rugby'),

('947 Joburg Day', 'Massive one-day music festival in Fourways', 'Music', 'Fourways', 'Johannesburg', '2024-09-14 12:00:00+00', '12:00', 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800', 650, 1200, 'Ticketpro Dome Grounds', 30000, '947 Radio'),

('Neighbourgoods Market', 'Weekly artisan food market in Braamfontein', 'Food', 'Braamfontein', 'Johannesburg', '2024-08-17 09:00:00+00', '09:00', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800', 20, 80, '73 Juta Street', 3000, 'Neighbourgoods'),

('Kyalami F1 Experience Day', 'Drive F1-style cars on the Kyalami circuit', 'Sports', 'Midrand', 'Johannesburg', '2024-08-31 10:00:00+00', '10:00', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800', 650, 2500, 'Kyalami Grand Prix Circuit', 400, 'Kyalami Racing'),

('Loyiso Gola: Unlearning', 'Stand-up special by Loyiso Gola', 'Comedy', 'Randburg', 'Johannesburg', '2024-09-05 20:00:00+00', '20:00', 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800', 220, 480, 'Market Theatre', 500, 'Goliath Comedy'),

-- CAPE TOWN
('Kirstenbosch Summer Concert: Freshlyground', 'Live music on the Kirstenbosch lawns', 'Music', 'Newlands', 'Cape Town', '2024-09-22 17:30:00+00', '17:30', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800', 220, 380, 'Kirstenbosch Gardens', 4500, 'Kirstenbosch SANBI'),

('Stormers vs Munster', 'United Rugby Championship clash', 'Sports', 'Cape Town', 'Cape Town', '2024-09-14 19:00:00+00', '19:00', 'https://images.unsplash.com/photo-1599653666960-5f47049dd4df?w=800', 150, 500, 'DHL Stadium', 55000, 'United Rugby Championship'),

('Shimmy Beach Club Sunset Sessions', 'Sunset DJ sets at the V&A Waterfront', 'Nightlife', 'V&A Waterfront', 'Cape Town', '2024-08-24 16:00:00+00', '16:00', 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800', 180, 450, 'Shimmy Beach Club', 800, 'Shimmy Events'),

('V&A Wine Affair', 'Showcase of South African wine estates', 'Food', 'V&A Waterfront', 'Cape Town', '2024-09-07 14:00:00+00', '14:00', 'https://images.unsplash.com/photo-1510812431401-41d2cab2707d?w=800', 180, 450, 'Watershed V&A', 1200, 'Wine Affairs SA'),

('Shortstraw Acoustic Session', 'Intimate acoustic show by indie band Shortstraw', 'Music', 'Observatory', 'Cape Town', '2024-08-30 20:00:00+00', '20:00', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', 220, 380, 'The Armchair Theatre', 200, 'Indie Live CT'),

('Riaad Moosa: Family Friendly', 'Award-winning Riaad Moosa stand-up', 'Comedy', 'Canal Walk', 'Cape Town', '2024-09-13 19:30:00+00', '19:30', 'https://images.unsplash.com/photo-1595194571476-8d1ef53a5a03?w=800', 200, 450, 'Grandslots Century City', 400, 'Goliath Comedy'),

('The Galileo Open Air Cinema', 'Outdoor cinema with dinner and wine', 'Food', 'Kirstenbosch', 'Cape Town', '2024-08-31 18:30:00+00', '18:30', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800', 120, 220, 'The Galileo at Kirstenbosch', 600, 'Galileo Cinema'),

-- DURBAN
('Sharks vs Bulls URC', 'Derby at Kings Park', 'Sports', 'Durban', 'Durban', '2024-09-21 17:00:00+00', '17:00', 'https://images.unsplash.com/photo-1599653666960-5f47049dd4df?w=800', 150, 450, 'Kings Park Stadium', 52000, 'United Rugby Championship'),

('Durban July Fashion Experience', 'SA''s premier horse racing and fashion event', 'Food', 'Greyville', 'Durban', '2024-07-06 12:00:00+00', '12:00', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800', 450, 1200, 'Greyville Racecourse', 45000, 'Hollywoodbets Durban July'),

('Moses Mabhida PSL: Amazulu vs Chiefs', 'Premier Soccer League fixture', 'Sports', 'Durban', 'Durban', '2024-08-28 19:30:00+00', '19:30', 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800', 80, 280, 'Moses Mabhida Stadium', 54000, 'Premier Soccer League'),

('Durban Curry Festival', 'Celebration of Durban''s iconic curry heritage', 'Food', 'Durban', 'Durban', '2024-08-17 11:00:00+00', '11:00', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800', 80, 220, 'Durban Exhibition Centre', 3500, 'Durban Tourism'),

('Suncoast Amapiano Night', 'Top Amapiano DJs take over Suncoast', 'Nightlife', 'Durban Beachfront', 'Durban', '2024-09-06 21:00:00+00', '21:00', 'https://images.unsplash.com/photo-1571266028243-d220c9c3b31f?w=800', 150, 300, 'Suncoast Casino', 1800, 'Suncoast Entertainment');

-- ============================================
-- DONE
-- All existing events now have realistic SA pricing
-- 20 new events added with pricing benchmarked against real SA events
-- ============================================
