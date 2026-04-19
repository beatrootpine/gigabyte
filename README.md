# Gigabyte Web App

South Africa's unified event discovery platform. Centralized events, exclusive deals, secure ticketing, and brand marketplace.

**Live Demo:** (Deploy to Vercel)

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + custom design system
- **Backend:** Supabase (PostgreSQL + Auth)
- **Deployment:** Vercel
- **Icons:** Lucide React
- **Dates:** date-fns

## Project Structure

```
gigabyte-web/
├── src/
│   ├── screens/           # Page components
│   │   ├── DiscoveryScreen.tsx    (Event browsing + filters)
│   │   ├── WalletScreen.tsx       (Saved tickets)
│   │   └── ProfileScreen.tsx      (User account)
│   ├── components/        # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── EventCard.tsx
│   │   └── SearchBar.tsx
│   ├── services/          # API clients
│   │   └── supabase.ts    (Auth, events, tickets, users)
│   ├── types/             # TypeScript interfaces
│   │   └── index.ts
│   ├── utils/             # Helpers & constants
│   │   └── theme.ts       (Colors, categories, formatting)
│   ├── App.tsx            # Main component with tab navigation
│   ├── main.tsx           # React entry point
│   └── index.css          # Global styles
├── index.html             # HTML entry point
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind theme
├── postcss.config.js      # PostCSS config
├── package.json           # Dependencies
└── .env.example           # Environment template
```

## Design System

### Colors
- **Primary:** `#1F1FFF` (Electric Blue)
- **Accent:** `#FFD700` (Gold)
- **Dark:** `#0F0F1F` (Deep Navy)
- **Surface:** `#1A1A2E` (Card background)
- **Text:** `#F5F5F5` (Off-white)
- **Text Muted:** `#A0A0A0` (Secondary text)
- **Success:** `#00D084` (Green)
- **Error:** `#FF4444` (Red)

### Typography
- **Display Font:** Space Grotesk (headings, logo)
- **Body Font:** Inter (text content)
- **Mono Font:** IBM Plex Mono (prices, badges)

## Getting Started

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org))
- npm or yarn

### 1. Clone & Install

```bash
git clone https://github.com/beatrootpine/gigabyte.git
cd gigabyte
npm install
```

### 2. Setup Supabase

1. Go to [supabase.com](https://supabase.com) → Create a new project
2. Get your **Project URL** and **Anon Public Key** from Settings → API
3. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
4. Add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

### 3. Create Database Tables

Run this SQL in your Supabase SQL editor (SQL → New Query):

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'premium')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('Music', 'Food', 'Nightlife', 'Comedy', 'Sports')),
  location TEXT NOT NULL,
  city TEXT NOT NULL CHECK (city IN ('Johannesburg', 'Cape Town', 'Durban')),
  date TIMESTAMP NOT NULL,
  time TEXT,
  image_url TEXT,
  price_min DECIMAL(10, 2),
  price_max DECIMAL(10, 2),
  venue TEXT,
  capacity INTEGER,
  organizer TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tickets table
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  ticket_type TEXT,
  price DECIMAL(10, 2),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  qr_code TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Favorites table
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  event_id UUID NOT NULL REFERENCES events(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, event_id)
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  tier TEXT NOT NULL CHECK (tier IN ('free', 'pro', 'premium')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled')),
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Brands table
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  description TEXT,
  category TEXT,
  website TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Available Scripts

```bash
# Development server (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint
```

## Deployment to Vercel

### 1. Push to GitHub (already done ✓)

### 2. Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or connect repo at [vercel.com](https://vercel.com) → Import Project

### 3. Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables:
```
VITE_SUPABASE_URL = your_supabase_url
VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
```

### 4. Deploy

```bash
git push
# Vercel deploys automatically
```

Your app is live at `gigabyte.vercel.app` (or your custom domain)

## Features

- ✅ Event discovery with search & filters (city, category)
- ✅ Event detail pages
- ✅ Save favorite events
- ✅ Ticket wallet
- ✅ Subscription tiers (Free, Pro, Premium)
- ✅ User profile & settings
- ✅ Mobile-responsive design
- ✅ Dark theme with Gigabyte branding

## Next Steps

1. **Seed Mock Data:** Add 50+ SA events with Unsplash images
2. **Auth Flow:** Email/password signup and Google OAuth
3. **Payment Integration:** Paystack for ticket purchases
4. **Ticket Transfer:** QR codes for secure transfers
5. **Analytics:** Track user behavior & event popularity
6. **Push Notifications:** Event reminders

## Environment Variables

```
# Supabase (Required)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...

# Google OAuth (Optional)
VITE_GOOGLE_CLIENT_ID=your_client_id

# Paystack (Optional)
VITE_PAYSTACK_PUBLIC_KEY=pk_live_xxx

# App
VITE_APP_NAME=Gigabyte
VITE_APP_URL=http://localhost:3000
```

## Troubleshooting

### "Cannot find module" errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Supabase connection errors
- Check `.env.local` has correct credentials
- Verify project is active in Supabase dashboard
- Check CORS settings in Supabase

### Build errors
```bash
# Clear Vite cache
rm -rf dist
npm run build
```

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add feature"`
3. Push: `git push origin feature/your-feature`
4. Open Pull Request

## License

MIT

## Support

- Email: beatrootpine@gmail.com
- GitHub: [@beatrootpine](https://github.com/beatrootpine)

---

**Built with ❤️ by Beatroot Pineapple**
