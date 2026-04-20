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
    // Only return events that haven't happened yet
    let query = supabase
      .from('events')
      .select('*')
      .gte('date', new Date().toISOString());

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
      .gte('date', new Date().toISOString())
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
      .select('*, events(*), payment_plans(*, installments(*))')
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

// Payments services — demo gateway + payment plans
export const paymentsService = {
  // Create a 3-installment payment plan for a ticket
  createPlan: async (params: {
    ticketId: string;
    userId: string;
    totalAmount: number;
    installmentsTotal?: number;
    frequency?: 'monthly' | 'biweekly';
  }) => {
    const installmentsTotal = params.installmentsTotal ?? 3;
    const frequency = params.frequency ?? 'monthly';
    const installmentAmount = Math.ceil(params.totalAmount / installmentsTotal);

    // Create the plan — first installment is considered paid at creation
    const { data: plan, error: planError } = await supabase
      .from('payment_plans')
      .insert({
        ticket_id: params.ticketId,
        user_id: params.userId,
        total_amount: params.totalAmount,
        installments_total: installmentsTotal,
        installments_paid: 1, // first one paid today
        installment_amount: installmentAmount,
        frequency,
        status: 'active',
      })
      .select()
      .single();
    if (planError) throw planError;

    // Build installment schedule
    const now = new Date();
    const gapDays = frequency === 'biweekly' ? 14 : 30;
    const installmentRows = [];
    for (let i = 1; i <= installmentsTotal; i++) {
      const dueDate = new Date(now);
      dueDate.setDate(dueDate.getDate() + gapDays * (i - 1));
      installmentRows.push({
        plan_id: plan.id,
        installment_number: i,
        amount: installmentAmount,
        due_date: dueDate.toISOString(),
        status: i === 1 ? 'paid' : 'pending',
        paid_at: i === 1 ? now.toISOString() : null,
      });
    }

    const { data: installments, error: instError } = await supabase
      .from('installments')
      .insert(installmentRows)
      .select();
    if (instError) throw instError;

    return { plan, installments };
  },

  // Get a ticket's plan with all installments
  getPlan: async (ticketId: string) => {
    const { data, error } = await supabase
      .from('payment_plans')
      .select('*, installments(*)')
      .eq('ticket_id', ticketId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  // Pay one installment (via RPC so it atomically updates plan + ticket)
  payInstallment: async (installmentId: string) => {
    const { data, error } = await supabase.rpc('pay_installment', {
      installment_id: installmentId,
    });
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

// Organizer applications service
export const organizerApplicationsService = {
  // Submit a new application
  submit: async (params: {
    userId: string;
    companyName: string;
    website?: string;
    eventHistory: string;
    phone?: string;
  }) => {
    const { data, error } = await supabase
      .from('organizer_applications')
      .insert({
        user_id: params.userId,
        company_name: params.companyName,
        website: params.website || null,
        event_history: params.eventHistory,
        phone: params.phone || null,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Get the current user's latest application (if any)
  getMine: async (userId: string) => {
    const { data, error } = await supabase
      .from('organizer_applications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  // Admin: list all pending applications with user profile joined
  listPending: async () => {
    const { data, error } = await supabase
      .from('organizer_applications')
      .select('*, users!organizer_applications_user_id_fkey(email, full_name)')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  },

  // Admin: list everything (all statuses)
  listAll: async () => {
    const { data, error } = await supabase
      .from('organizer_applications')
      .select('*, users!organizer_applications_user_id_fkey(email, full_name)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Admin: approve an application (calls the RPC)
  approve: async (applicationId: string, notes?: string) => {
    const { data, error } = await supabase.rpc('admin_approve_organizer', {
      application_id: applicationId,
      notes: notes || null,
    });
    if (error) throw error;
    return data;
  },

  // Admin: reject an application
  reject: async (applicationId: string, notes?: string) => {
    const { data, error } = await supabase.rpc('admin_reject_organizer', {
      application_id: applicationId,
      notes: notes || null,
    });
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
