import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth services
export const authService = {
  signUp: async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) throw error;
    return data;
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },
};

// Events services
export const eventsService = {
  getEvents: async (city?: string, category?: string) => {
    let query = supabase.from('events').select('*');
    
    if (city) {
      query = query.eq('city', city);
    }
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query.order('date', { ascending: true });
    if (error) throw error;
    return data;
  },

  getEventById: async (eventId: string) => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();
    if (error) throw error;
    return data;
  },

  searchEvents: async (query: string) => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`);
    if (error) throw error;
    return data;
  },
};

// User services
export const userService = {
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  },

  updateProfile: async (userId: string, updates: any) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// Tickets services
export const ticketsService = {
  getMyTickets: async (userId: string) => {
    const { data, error } = await supabase
      .from('tickets')
      .select('*, events(*)')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  buyTicket: async (params: {
    userId: string;
    eventId: string;
    ticketType: string;
    price: number;
    serviceFee: number;
    total: number;
    paymentMode: 'full' | 'plan';
  }) => {
    // Simple QR hash — in production this would be signed and rotate server-side
    const qrHash = `GB-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    const { data, error } = await supabase
      .from('tickets')
      .insert({
        user_id: params.userId,
        event_id: params.eventId,
        ticket_type: params.ticketType,
        price: params.price,
        service_fee: params.serviceFee,
        total: params.total,
        payment_mode: params.paymentMode,
        payment_status: params.paymentMode === 'full' ? 'paid' : 'partially_paid',
        qr_hash: qrHash,
        status: 'active',
      })
      .select('*, events(*)')
      .single();
    if (error) throw error;
    return data;
  },
};

// Favorites services
export const favoritesService = {
  addFavorite: async (userId: string, eventId: string) => {
    const { data, error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, event_id: eventId })
      .select();
    if (error) throw error;
    return data;
  },

  removeFavorite: async (userId: string, eventId: string) => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('event_id', eventId);
    if (error) throw error;
  },

  getFavorites: async (userId: string) => {
    const { data, error } = await supabase
      .from('favorites')
      .select('events(*)')
      .eq('user_id', userId);
    if (error) throw error;
    return data?.map((fav: any) => fav.events) || [];
  },
};

// Brands services
export const brandsService = {
  getBrands: async () => {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
};

// Subscriptions services
export const subscriptionService = {
  getSubscription: async (userId: string) => {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  updateSubscription: async (userId: string, tier: string) => {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        tier,
        status: 'active',
        started_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
