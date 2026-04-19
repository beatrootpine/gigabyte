// Mock user tickets - replace with Supabase query when auth is wired
export interface DemoTicket {
  id: string;
  event_id: string;
  event_title: string;
  event_image: string;
  venue: string;
  city: string;
  date: string;
  time: string;
  category: string;
  ticket_type: string;
  section?: string;
  seat?: string;
  price: number;
  original_price: number;
  qr_hash: string;
  status: 'active' | 'transferred' | 'listed' | 'used';
  purchased_at: string;
  transferable: boolean;
  resellable: boolean;
}

export const MOCK_USER_TICKETS: DemoTicket[] = [
  {
    id: 'tkt_gb_001',
    event_id: 'evt_001',
    event_title: 'DSTV Delicious Food & Music Festival',
    event_image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    venue: 'Montecasino',
    city: 'Johannesburg',
    date: '2024-06-15T18:00:00+00:00',
    time: '18:00',
    category: 'Music',
    ticket_type: 'General Admission',
    section: 'Main Lawn',
    price: 650,
    original_price: 650,
    qr_hash: 'GB-4K9X-2M7P-8L3N',
    status: 'active',
    purchased_at: '2024-04-02T10:14:00+00:00',
    transferable: true,
    resellable: true,
  },
  {
    id: 'tkt_gb_002',
    event_id: 'evt_002',
    event_title: 'Black Coffee at Konka',
    event_image: 'https://images.unsplash.com/photo-1571266028243-d220c9c3b31f?w=800',
    venue: 'Konka Soweto',
    city: 'Johannesburg',
    date: '2024-08-16T22:00:00+00:00',
    time: '22:00',
    category: 'Nightlife',
    ticket_type: 'VIP Booth',
    section: 'Upper Floor',
    seat: 'Booth 12',
    price: 1200,
    original_price: 1200,
    qr_hash: 'GB-7H2W-9F4Q-1R6T',
    status: 'active',
    purchased_at: '2024-07-18T20:45:00+00:00',
    transferable: true,
    resellable: true,
  },
  {
    id: 'tkt_gb_003',
    event_id: 'evt_003',
    event_title: 'Kaizer Chiefs vs Orlando Pirates',
    event_image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
    venue: 'FNB Stadium',
    city: 'Johannesburg',
    date: '2024-06-22T15:30:00+00:00',
    time: '15:30',
    category: 'Sports',
    ticket_type: 'Standard',
    section: 'Block 17',
    seat: 'Row G, Seat 42',
    price: 250,
    original_price: 250,
    qr_hash: 'GB-3D8Z-5V1Y-7B2M',
    status: 'active',
    purchased_at: '2024-05-10T09:22:00+00:00',
    transferable: true,
    resellable: true,
  },
];

// Mock resale marketplace listings
export interface ResaleListing {
  id: string;
  event_title: string;
  event_image: string;
  venue: string;
  city: string;
  date: string;
  category: string;
  ticket_type: string;
  section?: string;
  original_price: number;
  resale_price: number;
  seller_name: string;
  seller_rating: number;
  verified: boolean;
  listed_at: string;
}

export const MOCK_RESALE_LISTINGS: ResaleListing[] = [
  {
    id: 'rsl_001',
    event_title: 'Trevor Noah Homecoming Show',
    event_image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800',
    venue: 'Teatro at Montecasino',
    city: 'Johannesburg',
    date: '2024-08-24T20:00:00+00:00',
    category: 'Comedy',
    ticket_type: 'Premium',
    section: 'Row 4',
    original_price: 1500,
    resale_price: 1350,
    seller_name: 'Thabo M.',
    seller_rating: 4.9,
    verified: true,
    listed_at: '2024-08-10T14:22:00+00:00',
  },
  {
    id: 'rsl_002',
    event_title: '947 Joburg Day',
    event_image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800',
    venue: 'Ticketpro Dome Grounds',
    city: 'Johannesburg',
    date: '2024-09-14T12:00:00+00:00',
    category: 'Music',
    ticket_type: 'General Admission',
    original_price: 850,
    resale_price: 720,
    seller_name: 'Lerato K.',
    seller_rating: 5.0,
    verified: true,
    listed_at: '2024-08-12T09:15:00+00:00',
  },
  {
    id: 'rsl_003',
    event_title: 'Black Coffee at Konka',
    event_image: 'https://images.unsplash.com/photo-1571266028243-d220c9c3b31f?w=800',
    venue: 'Konka Soweto',
    city: 'Johannesburg',
    date: '2024-08-16T22:00:00+00:00',
    category: 'Nightlife',
    ticket_type: 'General Entry',
    original_price: 450,
    resale_price: 380,
    seller_name: 'Sipho D.',
    seller_rating: 4.7,
    verified: true,
    listed_at: '2024-08-13T16:40:00+00:00',
  },
  {
    id: 'rsl_004',
    event_title: 'Cape Town Jazz Festival',
    event_image: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=800',
    venue: 'Artscape Theatre',
    city: 'Cape Town',
    date: '2024-07-05T18:00:00+00:00',
    category: 'Music',
    ticket_type: '2-Day Pass',
    original_price: 1800,
    resale_price: 1500,
    seller_name: 'Nomsa N.',
    seller_rating: 4.8,
    verified: true,
    listed_at: '2024-06-20T11:05:00+00:00',
  },
  {
    id: 'rsl_005',
    event_title: 'Stormers vs Munster',
    event_image: 'https://images.unsplash.com/photo-1599653666960-5f47049dd4df?w=800',
    venue: 'DHL Stadium',
    city: 'Cape Town',
    date: '2024-09-14T19:00:00+00:00',
    category: 'Sports',
    ticket_type: 'Grandstand',
    section: 'Block 42',
    original_price: 500,
    resale_price: 420,
    seller_name: 'Andre V.',
    seller_rating: 4.6,
    verified: true,
    listed_at: '2024-08-11T18:30:00+00:00',
  },
  {
    id: 'rsl_006',
    event_title: 'Durban July Fashion Experience',
    event_image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    venue: 'Greyville Racecourse',
    city: 'Durban',
    date: '2024-07-06T12:00:00+00:00',
    category: 'Food',
    ticket_type: 'Marquee Access',
    original_price: 1200,
    resale_price: 950,
    seller_name: 'Zanele P.',
    seller_rating: 5.0,
    verified: true,
    listed_at: '2024-06-25T13:45:00+00:00',
  },
];

export const formatDateLong = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-ZA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateShort = (dateString: string) => {
  const date = new Date(dateString);
  return {
    day: date.toLocaleDateString('en-ZA', { day: '2-digit' }),
    month: date.toLocaleDateString('en-ZA', { month: 'short' }).toUpperCase(),
    weekday: date.toLocaleDateString('en-ZA', { weekday: 'short' }).toUpperCase(),
  };
};
