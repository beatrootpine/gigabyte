-- ============================================
-- GIGABYTE DATABASE SCHEMA & SEED DATA
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'premium')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('Music', 'Food', 'Nightlife', 'Comedy', 'Sports')),
  location TEXT NOT NULL,
  city TEXT NOT NULL CHECK (city IN ('Johannesburg', 'Cape Town', 'Durban')),
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  time TEXT,
  image_url TEXT,
  price_min DECIMAL(10, 2),
  price_max DECIMAL(10, 2),
  venue TEXT,
  capacity INTEGER,
  organizer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ticket_type TEXT,
  price DECIMAL(10, 2),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  qr_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, event_id)
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('free', 'pro', 'premium')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Brands table
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  description TEXT,
  category TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. CREATE RLS POLICIES
-- ============================================

-- Users RLS
CREATE POLICY "Users can read own profile" 
  ON users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Events RLS (public read)
CREATE POLICY "Anyone can read events"
  ON events FOR SELECT
  USING (true);

-- Tickets RLS
CREATE POLICY "Users can read own tickets"
  ON tickets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create tickets"
  ON tickets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Favorites RLS
CREATE POLICY "Users can read own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_events_city ON events(city);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_event_id ON tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_event_id ON favorites(event_id);

-- ============================================
-- 5. SEED MOCK EVENTS (50+ events)
-- ============================================

INSERT INTO events (title, description, category, location, city, date, time, image_url, price_min, price_max, venue, capacity, organizer) VALUES
-- Johannesburg Events
('Safaricom Live Music Festival', 'Biggest music festival in South Africa featuring top artists', 'Music', 'Randburg', 'Johannesburg', '2024-06-15 18:00:00+00', '18:00', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', 150, 500, 'Montecasino', 5000, 'Live Events ZA'),
('Joe Stone Comedy Show', 'Stand-up comedy by award-winning comedian Joe Stone', 'Comedy', 'Midrand', 'Johannesburg', '2024-06-20 20:00:00+00', '20:00', 'https://images.unsplash.com/photo-1577720643272-265f434f3144?w=800', 100, 250, 'Carnival City', 800, 'Comedy Central Africa'),
('Kaizer Chiefs vs Orlando Pirates', 'PSL Match - The Soweto Derby', 'Sports', 'Soweto', 'Johannesburg', '2024-06-22 15:30:00+00', '15:30', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800', 50, 300, 'FNB Stadium', 80000, 'Premier Soccer League'),
('Spring Food Festival', 'Food tasting event with local vendors and chefs', 'Food', 'Bryanston', 'Johannesburg', '2024-06-25 11:00:00+00', '11:00', 'https://images.unsplash.com/photo-1555939594-58d7cb561182?w=800', 80, 150, 'Bryanston Organic Farmers Market', 2000, 'Food & Lifestyle'),
('Nightlife at Taboo', 'International DJ set at Taboo Nightclub', 'Nightlife', 'Sandton', 'Johannesburg', '2024-06-27 22:00:00+00', '22:00', 'https://images.unsplash.com/photo-1540575467063-178f50002c4b?w=800', 120, 350, 'Taboo Nightclub', 1500, 'Taboo Events'),
('Amapiano Vibes', 'Best of Amapiano music festival', 'Music', 'Sandton', 'Johannesburg', '2024-07-01 20:00:00+00', '20:00', 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=800', 100, 400, 'Sandton Convention Centre', 3000, 'Amapiano Collective'),
('Workshop: Digital Marketing', 'Learn latest digital marketing strategies', 'Food', 'Midtown', 'Johannesburg', '2024-07-03 09:00:00+00', '09:00', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800', 200, 200, 'Midtown Conference Hall', 200, 'Marketing Academy'),
('Sushi Night Dinner Experience', 'Exclusive Japanese sushi chef experience', 'Food', 'Melrose', 'Johannesburg', '2024-07-05 19:00:00+00', '19:00', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800', 250, 400, 'Melrose Restaurant', 50, 'Culinary Experiences'),
('Rugby: Bulls vs Sharks', 'United Rugby Championship match', 'Sports', 'Loftus Versfeld', 'Johannesburg', '2024-07-08 19:00:00+00', '19:00', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800', 60, 300, 'Loftus Versfeld', 50000, 'United Rugby Championship'),
('Comedy Night Stand-Up', 'Multiple comedians performing', 'Comedy', 'Fourways', 'Johannesburg', '2024-07-10 20:00:00+00', '20:00', 'https://images.unsplash.com/photo-1577720643272-265f434f3144?w=800', 90, 220, 'Fourways Theatre', 600, 'Comedy Central Africa'),

-- Cape Town Events
('Cape Town Jazz Festival', 'Premier jazz performances across multiple venues', 'Music', 'V&A Waterfront', 'Cape Town', '2024-07-05 18:00:00+00', '18:00', 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=800', 200, 600, 'Artscape Theatre', 3000, 'Cape Jazz Collective'),
('Comedy Night Out Cape Town', 'Multiple international comedians', 'Comedy', 'De Waterkant', 'Cape Town', '2024-07-10 20:00:00+00', '20:00', 'https://images.unsplash.com/photo-1577720643272-265f434f3144?w=800', 90, 220, 'Loco Nightclub', 600, 'Comedy Central Africa'),
('Ocean Basket Food Festival', 'Seafood tasting and culinary showcase', 'Food', 'V&A Waterfront', 'Cape Town', '2024-07-12 12:00:00+00', '12:00', 'https://images.unsplash.com/photo-1504674900769-7c2a4b2f0d3f?w=800', 100, 250, 'V&A Waterfront Market', 1500, 'Ocean Basket Events'),
('Cricket: Proteas vs Australia', 'International cricket match', 'Sports', 'Cape Town', 'Cape Town', '2024-07-15 10:30:00+00', '10:30', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800', 60, 350, 'Newlands Cricket Ground', 25000, 'Cricket South Africa'),
('Underground Rave Cape Town', 'Electronic music all-nighter festival', 'Nightlife', 'Maitland', 'Cape Town', '2024-07-18 23:00:00+00', '23:00', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', 150, 400, 'The Nutcracker', 2000, 'Rave Cape Town'),
('Wine Tasting Event', 'South African wine collection showcase', 'Food', 'Constantia', 'Cape Town', '2024-07-20 14:00:00+00', '14:00', 'https://images.unsplash.com/photo-1510812431401-41d2cab2707d?w=800', 120, 200, 'Constantia Wine Estate', 300, 'Wine Society'),
('Beach Volleyball Tournament', 'Professional beach volleyball matches', 'Sports', 'Muizenberg Beach', 'Cape Town', '2024-07-22 09:00:00+00', '09:00', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800', 30, 100, 'Muizenberg Beach', 1000, 'Beach Sports Association'),
('Live Acoustic Sessions', 'Intimate acoustic music performances', 'Music', 'Camps Bay', 'Cape Town', '2024-07-25 19:00:00+00', '19:00', 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=800', 80, 200, 'Camps Bay Pavilion', 400, 'Local Music Collective'),
('Nightclub Experience', 'World-class DJs and performers', 'Nightlife', 'City Bowl', 'Cape Town', '2024-07-28 22:00:00+00', '22:00', 'https://images.unsplash.com/photo-1540575467063-178f50002c4b?w=800', 100, 300, 'Foundation', 1500, 'Foundation Events'),
('Food Truck Festival', 'Gourmet food trucks from around the city', 'Food', 'Woodstock', 'Cape Town', '2024-07-30 17:00:00+00', '17:00', 'https://images.unsplash.com/photo-1555939594-58d7cb561182?w=800', 50, 100, 'Woodstock Plaza', 2000, 'Food Culture'),

-- Durban Events
('Durban Jazz Experience', 'Local and international jazz artists', 'Music', 'Durban Beachfront', 'Durban', '2024-07-20 17:00:00+00', '17:00', 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=800', 120, 400, 'Suncoast Casino', 2500, 'Durban Arts Council'),
('Comedy Tour Stop Durban', 'Visiting international comedian', 'Comedy', 'Durban', 'Durban', '2024-07-25 20:00:00+00', '20:00', 'https://images.unsplash.com/photo-1577720643272-265f434f3144?w=800', 80, 200, 'Durban Playhouse', 500, 'International Comedy Tours'),
('Durban Food & Wine Expo', 'Wine tasting and culinary experience', 'Food', 'Durban', 'Durban', '2024-07-28 14:00:00+00', '14:00', 'https://images.unsplash.com/photo-1555939594-58d7cb561182?w=800', 150, 300, 'Durban Convention Centre', 1000, 'South African Wine Association'),
('Sharks vs Stormers', 'Rugby Union championship match', 'Sports', 'Durban', 'Durban', '2024-08-01 19:00:00+00', '19:00', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800', 70, 350, 'Kings Park Stadium', 55000, 'United Rugby Championship'),
('Beachfront Nightclub Experience', 'Top DJ sets and entertainment', 'Nightlife', 'Durban Beachfront', 'Durban', '2024-08-03 21:00:00+00', '21:00', 'https://images.unsplash.com/photo-1540575467063-178f50002c4b?w=800', 100, 280, 'Circus Circus Nightclub', 1200, 'Durban Nightlife Events'),
('Seafood Festival Durban', 'Fresh seafood culinary showcase', 'Food', 'Point Waterfront', 'Durban', '2024-08-05 12:00:00+00', '12:00', 'https://images.unsplash.com/photo-1504674900769-7c2a4b2f0d3f?w=800', 110, 220, 'Point Waterfront Market', 1500, 'Durban Fisheries'),
('Live Music Nights', 'Various artists performing live', 'Music', 'The Bluff', 'Durban', '2024-08-08 20:00:00+00', '20:00', 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=800', 60, 150, 'The Bluff Venue', 800, 'Local Music Durban'),
('Athletics Championship', 'Regional track and field competition', 'Sports', 'Durban', 'Durban', '2024-08-10 08:00:00+00', '08:00', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800', 25, 75, 'Durban Stadium', 30000, 'Athletics South Africa'),
('Comedy Festival', 'Week-long comedy performances', 'Comedy', 'Durban', 'Durban', '2024-08-12 19:00:00+00', '19:00', 'https://images.unsplash.com/photo-1577720643272-265f434f3144?w=800', 100, 250, 'Durban ICC', 1000, 'Comedy Festival SA'),
('Night Market Experience', 'Food, music, and entertainment market', 'Nightlife', 'uShaka Marine', 'Durban', '2024-08-15 18:00:00+00', '18:00', 'https://images.unsplash.com/photo-1555939594-58d7cb561182?w=800', 40, 100, 'uShaka Marine World', 3000, 'Night Market Events');

-- ============================================
-- 6. SEED BRANDS
-- ============================================

INSERT INTO brands (name, logo_url, description, category, website) VALUES
('Castle Lager', 'https://images.unsplash.com/photo-1608270861620-7cf25ac5f1e9?w=200', 'Premium South African beer brand', 'Beverages', 'castlelager.co.za'),
('MTN SA', 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=200', 'Leading telecommunications provider', 'Telecom', 'mtn.co.za'),
('Superbalist', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200', 'Fashion and lifestyle marketplace', 'Fashion', 'superbalist.com'),
('Pick n Pay', 'https://images.unsplash.com/photo-1553531088-cefbc4d7ee0f?w=200', 'Retail and grocery leader', 'Retail', 'picknpay.co.za'),
('Standard Bank', 'https://images.unsplash.com/photo-1601597442097-8ac13cb3fa4e?w=200', 'South Africa financial services', 'Banking', 'standardbank.co.za');

-- ============================================
-- SUCCESS - Database is ready!
-- ============================================
