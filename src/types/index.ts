export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  subscription_tier: 'free' | 'pro' | 'premium';
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: 'Music' | 'Food' | 'Nightlife' | 'Comedy' | 'Sports';
  location: string;
  city: 'Johannesburg' | 'Cape Town' | 'Durban';
  date: string;
  time: string;
  image_url: string;
  price_min: number;
  price_max: number;
  venue: string;
  capacity: number;
  organizer: string;
  created_at: string;
}

export interface Ticket {
  id: string;
  event_id: string;
  user_id: string;
  ticket_type: string;
  price: number;
  payment_status: 'pending' | 'completed' | 'failed';
  qr_code?: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  tier: 'free' | 'pro' | 'premium';
  status: 'active' | 'cancelled';
  started_at: string;
  expires_at: string;
}

export interface Brand {
  id: string;
  name: string;
  logo_url: string;
  description: string;
  category: string;
  website?: string;
  created_at: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}
