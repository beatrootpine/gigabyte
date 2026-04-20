import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface DashboardStats {
  ticketsCount: number;
  spentThisYear: number;
  upcomingCount: number;
  savedCount: number;
}

export interface UpcomingTicket {
  id: string;
  event_title: string;
  event_image: string;
  venue: string;
  date: string;
  ticket_type: string;
  payment_status: 'paid' | 'pending' | 'partially_paid';
  plan_installments_paid: number | null;
  plan_installments_total: number | null;
}

interface DashboardData {
  stats: DashboardStats;
  upcoming: UpcomingTicket[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useDashboardStats = (): DashboardData => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    ticketsCount: 0,
    spentThisYear: 0,
    upcomingCount: 0,
    savedCount: 0,
  });
  const [upcoming, setUpcoming] = useState<UpcomingTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!user) {
      setStats({ ticketsCount: 0, spentThisYear: 0, upcomingCount: 0, savedCount: 0 });
      setUpcoming([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch all active tickets for this user, with event + plan data joined
      const { data: tickets, error: ticketsErr } = await supabase
        .from('tickets')
        .select('*, events(title, image_url, venue, date), payment_plans(installments_paid, installments_total)')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (ticketsErr) throw ticketsErr;

      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);

      const ticketsList = tickets || [];
      const ticketsCount = ticketsList.length;

      const spentThisYear = ticketsList
        .filter(t => new Date(t.created_at) >= startOfYear)
        .reduce((sum, t) => sum + Number(t.total || 0), 0);

      // Upcoming tickets = event date is in the future
      const upcomingTickets = ticketsList
        .filter(t => t.events?.date && new Date(t.events.date) > now)
        .sort((a, b) => new Date(a.events.date).getTime() - new Date(b.events.date).getTime());

      const upcomingCount = upcomingTickets.length;

      // Saved (favorites) count — tolerate table missing
      let savedCount = 0;
      try {
        const { count } = await supabase
          .from('favorites')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        savedCount = count || 0;
      } catch {
        // Favorites table may not exist yet
      }

      setStats({ ticketsCount, spentThisYear, upcomingCount, savedCount });

      // Shape the upcoming list for the dashboard preview (top 3)
      setUpcoming(
        upcomingTickets.slice(0, 3).map((t): UpcomingTicket => {
          const plan = Array.isArray(t.payment_plans) ? t.payment_plans[0] : t.payment_plans;
          return {
            id: t.id,
            event_title: t.events?.title || 'Event',
            event_image: t.events?.image_url || '',
            venue: t.events?.venue || '',
            date: t.events?.date || '',
            ticket_type: t.ticket_type,
            payment_status: t.payment_status,
            plan_installments_paid: plan?.installments_paid ?? null,
            plan_installments_total: plan?.installments_total ?? null,
          };
        })
      );
    } catch (err: any) {
      if (err?.message?.includes('does not exist') || err?.message?.includes('relation')) {
        setError('Tickets table not set up yet. Run payments-setup.sql.');
      } else {
        setError(err?.message || 'Could not load dashboard.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [user]);

  return { stats, upcoming, loading, error, refresh: load };
};
