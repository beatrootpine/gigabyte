import { useState, useEffect } from 'react';
import {
  X, Plus, TrendingUp, DollarSign, Ticket as TicketIcon, Calendar,
  MoreVertical, Search, Download, Megaphone, ArrowUpRight,
  ArrowDownRight, Check, Loader2, Clock
} from 'lucide-react';
import { Event } from '../types';
import { supabase, eventsService } from '../services/supabase';
import { formatCurrency } from '../utils/theme';
import { SmartImage } from '../components/SmartImage';
import { Logo } from '../components/Logo';
import { useAuth } from '../contexts/AuthContext';

interface OrganizerConsoleProps {
  onClose: () => void;
}

type Tab = 'overview' | 'events' | 'attendees' | 'payouts';

export const OrganizerConsole = ({ onClose }: OrganizerConsoleProps) => {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      // In production this would filter by organizer_id. For the demo,
      // we treat all events as belonging to this organizer.
      const data = await eventsService.getEvents();
      setEvents((data || []).slice(0, 15));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Mock stats - in production these come from Supabase aggregations
  const totalRevenue = events.reduce((sum, e) => sum + (e.price_max * 45), 0); // mock: 45 tickets per event
  const totalTicketsSold = events.length * 45;
  const upcoming = events.filter(e => new Date(e.date) > new Date()).length;

  return (
    <div className="fixed inset-0 z-50 bg-bg overflow-y-auto animate-fade-in">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-bg/90 backdrop-blur-xl border-b border-border">
        <div className="px-5 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Logo size="md" />
            <span className="font-mono text-[10px] text-text-subtle uppercase tracking-wider px-2 py-0.5 bg-success/10 text-success rounded border border-success/20 flex-shrink-0">
              Organizer
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-surface-2 rounded-full flex items-center justify-center hover:bg-surface-3 transition-colors flex-shrink-0"
          >
            <X size={16} className="text-text" strokeWidth={2.5} />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-5 pb-3 overflow-x-auto scrollbar-hide">
          <div className="flex gap-1 p-1 bg-surface-2 border border-border rounded-full w-max">
            {(['overview', 'events', 'attendees', 'payouts'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`h-8 px-4 rounded-full text-xs font-semibold whitespace-nowrap capitalize transition-all ${
                  tab === t ? 'bg-inverse text-inverse-text' : 'text-text-muted hover:text-text'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="px-5 py-6 max-w-6xl mx-auto pb-24">
        {tab === 'overview' && (
          <OverviewTab
            events={events}
            loading={loading}
            totalRevenue={totalRevenue}
            totalTicketsSold={totalTicketsSold}
            upcoming={upcoming}
          />
        )}
        {tab === 'events' && (
          <EventsTab
            events={events}
            loading={loading}
            onCreateEvent={() => setShowCreateEvent(true)}
            onRefresh={loadEvents}
          />
        )}
        {tab === 'attendees' && <AttendeesTab events={events} />}
        {tab === 'payouts' && <PayoutsTab totalRevenue={totalRevenue} />}
      </main>

      {showCreateEvent && (
        <CreateEventModal
          onClose={() => setShowCreateEvent(false)}
          onCreated={() => { setShowCreateEvent(false); loadEvents(); }}
          organizerName={user?.user_metadata?.full_name || 'Organizer'}
        />
      )}
    </div>
  );
};

// ============== OVERVIEW TAB ==============
const OverviewTab = ({
  events,
  loading,
  totalRevenue,
  totalTicketsSold,
  upcoming,
}: { events: Event[]; loading: boolean; totalRevenue: number; totalTicketsSold: number; upcoming: number }) => {
  const stats = [
    { label: 'Revenue (30d)', value: formatCurrency(totalRevenue).replace('.00', ''), change: '+14.2%', up: true, icon: DollarSign },
    { label: 'Tickets sold', value: totalTicketsSold.toLocaleString(), change: '+8.6%', up: true, icon: TicketIcon },
    { label: 'Active events', value: String(events.length), change: `${upcoming} upcoming`, up: true, icon: Calendar },
    { label: 'Conversion', value: '4.1%', change: '−0.3%', up: false, icon: TrendingUp },
  ];

  const recentSales = events.slice(0, 5).map((e, i) => ({
    id: e.id,
    event: e.title,
    buyer: ['Lerato K.', 'Thabo M.', 'Nomsa N.', 'Andre V.', 'Zanele P.'][i] || 'Guest',
    qty: [2, 1, 3, 1, 2][i] || 1,
    total: e.price_min * ([2, 1, 3, 1, 2][i] || 1),
    when: ['2m ago', '8m ago', '14m ago', '22m ago', '31m ago'][i] || 'just now',
  }));

  return (
    <>
      <section className="mb-8">
        <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">
          Your performance · Last 30 days
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-text tracking-tightest leading-[0.95]">
          Organizer overview
        </h1>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {stats.map((s, i) => (
          <div key={i} className="bg-surface border border-border rounded-2xl p-5 animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-9 h-9 rounded-xl bg-surface-2 flex items-center justify-center">
                <s.icon size={14} className="text-text" strokeWidth={2} />
              </div>
              <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${s.up ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                {s.up ? <ArrowUpRight size={10} strokeWidth={3} /> : <ArrowDownRight size={10} strokeWidth={3} />}
                {s.change}
              </div>
            </div>
            <p className="font-display text-2xl md:text-3xl font-extrabold text-text tracking-tight leading-none mb-1.5">
              {s.value}
            </p>
            <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Recent sales */}
      <section className="mb-10">
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-border flex items-baseline justify-between">
            <h2 className="font-display text-lg font-bold text-text tracking-tighter">Recent sales</h2>
            <span className="font-mono text-[10px] text-text-subtle uppercase tracking-wider">Live</span>
          </div>
          {loading ? (
            <div className="p-5 space-y-3 animate-pulse">
              {[1,2,3].map(i => <div key={i} className="h-14 bg-surface-2 rounded-xl" />)}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentSales.map(s => (
                <div key={s.id} className="p-5 flex items-center gap-4 hover:bg-surface-2 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-surface-2 border border-border flex items-center justify-center flex-shrink-0">
                    <span className="font-display font-bold text-sm text-text">{s.buyer[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-text">{s.buyer}</p>
                    <p className="text-xs text-text-muted line-clamp-1 mt-0.5">{s.qty}× {s.event}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-display font-bold text-sm text-text">{formatCurrency(s.total).replace('.00', '')}</p>
                    <p className="font-mono text-[10px] text-text-subtle mt-0.5">{s.when}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Top events */}
      <section>
        <h2 className="font-display text-lg font-bold text-text tracking-tighter mb-5">Top performing events</h2>
        <div className="bg-surface border border-border rounded-2xl p-5">
          {events.slice(0, 5).map((e, i) => (
            <div key={e.id} className="py-3 first:pt-0 last:pb-0 border-b border-border last:border-0">
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-semibold text-sm text-text line-clamp-1 flex-1 min-w-0 mr-4">{e.title}</span>
                <span className="font-mono text-xs text-text-muted flex-shrink-0">{(95 - i * 12)}%</span>
              </div>
              <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                <div className="h-full bg-text rounded-full" style={{ width: `${95 - i * 12}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

// ============== EVENTS TAB ==============
const EventsTab = ({
  events, loading, onCreateEvent, onRefresh,
}: { events: Event[]; loading: boolean; onCreateEvent: () => void; onRefresh: () => void }) => {
  const [query, setQuery] = useState('');
  const filtered = events.filter(e =>
    !query || e.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <section className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">
            {events.length} events · Tap any to view analytics
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-text tracking-tightest leading-[0.95]">
            Your events
          </h1>
        </div>
        <button
          onClick={onCreateEvent}
          className="h-11 px-5 bg-inverse text-inverse-text rounded-full font-semibold text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2"
        >
          <Plus size={16} strokeWidth={2.5} /> New event
        </button>
      </section>

      <section className="mb-6">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" strokeWidth={2} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your events..."
            className="w-full h-11 pl-11 pr-4 bg-surface-2 text-text placeholder-text-subtle rounded-full border border-border focus:border-border-strong focus:outline-none text-sm"
          />
        </div>
      </section>

      <section>
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-5 space-y-3 animate-pulse">
              {[1,2,3,4].map(i => <div key={i} className="h-16 bg-surface-2 rounded-xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-text-muted text-sm mb-4">No events yet. Create your first one.</p>
              <button onClick={onCreateEvent} className="h-11 px-5 bg-inverse text-inverse-text rounded-full font-semibold text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2">
                <Plus size={14} strokeWidth={2.5} /> Create event
              </button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map(event => {
                const date = new Date(event.date);
                const isPast = date < new Date();
                const ticketsSold = Math.floor(Math.random() * 50) + 20;
                return (
                  <div key={event.id} className="p-4 md:p-5 flex items-center gap-4 hover:bg-surface-2 transition-colors">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden bg-surface-2 flex-shrink-0">
                      <SmartImage src={event.image_url} alt={event.title} seed={event.id} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-sm text-text line-clamp-1">{event.title}</p>
                      <div className="flex items-center gap-2 mt-1 font-mono text-[10px] text-text-subtle uppercase tracking-wider flex-wrap">
                        <span>{event.category}</span>
                        <span className="w-1 h-1 rounded-full bg-border-strong" />
                        <span>{event.city}</span>
                        <span className="w-1 h-1 rounded-full bg-border-strong" />
                        <span>{date.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' })}</span>
                      </div>
                    </div>
                    <div className="hidden md:block text-right flex-shrink-0">
                      <p className="font-display font-bold text-sm text-text">{ticketsSold} sold</p>
                      <p className="font-mono text-[10px] text-text-subtle">{formatCurrency(ticketsSold * event.price_min).replace('.00', '')}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${isPast ? 'bg-surface-2 text-text-muted' : 'bg-success/10 text-success'}`}>
                        {isPast ? 'Ended' : 'Live'}
                      </span>
                      <button className="w-8 h-8 rounded-full hover:bg-surface-3 flex items-center justify-center transition-colors">
                        <MoreVertical size={14} className="text-text-muted" strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Quick actions */}
      <section className="mt-6 grid grid-cols-2 gap-3">
        <button className="bg-surface border border-border rounded-2xl p-4 text-left hover:bg-surface-2 transition-colors flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center flex-shrink-0">
            <Megaphone size={16} className="text-text" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-semibold text-sm text-text">Broadcast</p>
            <p className="text-xs text-text-muted mt-0.5">Message attendees</p>
          </div>
        </button>
        <button
          onClick={onRefresh}
          className="bg-surface border border-border rounded-2xl p-4 text-left hover:bg-surface-2 transition-colors flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center flex-shrink-0">
            <Download size={16} className="text-text" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-semibold text-sm text-text">Export</p>
            <p className="text-xs text-text-muted mt-0.5">CSV of all events</p>
          </div>
        </button>
      </section>
    </>
  );
};

// ============== ATTENDEES TAB ==============
const AttendeesTab = ({ events }: { events: Event[] }) => {
  const attendees = [
    { name: 'Lerato Khumalo', email: 'lerato.k@gmail.com', event: events[0]?.title || 'Event', tier: 'VIP', status: 'Checked in' },
    { name: 'Thabo Mokoena', email: 'thabo@example.com', event: events[0]?.title || 'Event', tier: 'Standard', status: 'Confirmed' },
    { name: 'Nomsa Nkosi', email: 'nomsa.n@yahoo.com', event: events[1]?.title || 'Event', tier: 'VIP', status: 'Confirmed' },
    { name: 'Andre Van Wyk', email: 'andre.vw@outlook.com', event: events[1]?.title || 'Event', tier: 'Standard', status: 'Confirmed' },
    { name: 'Zanele Pilane', email: 'zanele@gmail.com', event: events[2]?.title || 'Event', tier: 'VIP', status: 'Transferred' },
    { name: 'Sipho Ndlovu', email: 'sipho@hotmail.com', event: events[2]?.title || 'Event', tier: 'Standard', status: 'Confirmed' },
    { name: 'Mpho Dube', email: 'mpho.d@gmail.com', event: events[3]?.title || 'Event', tier: 'General', status: 'Confirmed' },
  ];

  return (
    <>
      <section className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">
            {attendees.length} people · All active events
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-text tracking-tightest leading-[0.95]">
            Attendees
          </h1>
        </div>
        <div className="flex gap-2">
          <button className="h-11 px-4 bg-surface-2 text-text rounded-full border border-border font-semibold text-sm hover:bg-surface-3 transition-colors inline-flex items-center gap-2">
            <Download size={14} strokeWidth={2.5} /> Export CSV
          </button>
          <button className="h-11 px-4 bg-inverse text-inverse-text rounded-full font-semibold text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2">
            <Megaphone size={14} strokeWidth={2.5} /> Broadcast
          </button>
        </div>
      </section>

      <section>
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="divide-y divide-border">
            {attendees.map((a, i) => (
              <div key={i} className="p-4 md:p-5 flex items-center gap-4 hover:bg-surface-2 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric to-gold flex items-center justify-center flex-shrink-0">
                  <span className="font-display font-bold text-sm text-white">{a.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-text line-clamp-1">{a.name}</p>
                  <p className="text-xs text-text-muted line-clamp-1 mt-0.5">{a.email}</p>
                </div>
                <div className="hidden md:block text-right flex-shrink-0 max-w-[200px]">
                  <p className="text-xs text-text-muted line-clamp-1">{a.event}</p>
                  <p className="font-mono text-[10px] text-text-subtle mt-0.5 uppercase tracking-wider">{a.tier}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-[10px] font-semibold flex-shrink-0 ${
                  a.status === 'Checked in' ? 'bg-success/10 text-success' :
                  a.status === 'Transferred' ? 'bg-electric/10 text-electric' :
                  'bg-surface-2 text-text-muted'
                }`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

// ============== PAYOUTS TAB ==============
const PayoutsTab = ({ totalRevenue }: { totalRevenue: number }) => {
  const gigabyteCut = Math.round(totalRevenue * 0.075);
  const netPayout = totalRevenue - gigabyteCut;
  const payouts = [
    { id: 'PO-2026-014', date: '14 Apr 2026', amount: 87250, events: 3, status: 'Paid' },
    { id: 'PO-2026-013', date: '07 Apr 2026', amount: 124800, events: 5, status: 'Paid' },
    { id: 'PO-2026-012', date: '31 Mar 2026', amount: 56400, events: 2, status: 'Paid' },
    { id: 'PO-2026-011', date: '24 Mar 2026', amount: 98600, events: 4, status: 'Paid' },
  ];

  return (
    <>
      <section className="mb-8">
        <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">
          Funds & statements
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-text tracking-tightest leading-[0.95]">
          Payouts
        </h1>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        <div className="bg-gradient-to-br from-electric via-electric-deep to-gold rounded-2xl p-5 text-white">
          <p className="font-mono text-[10px] text-white/80 uppercase tracking-wider mb-2">Available balance</p>
          <p className="font-display text-3xl font-extrabold tracking-tight mb-1">{formatCurrency(netPayout).replace('.00', '')}</p>
          <p className="text-xs text-white/70">After 7.5% platform fee</p>
          <button className="mt-4 h-9 px-4 bg-white text-ink-950 rounded-full font-semibold text-xs hover:opacity-90 transition-opacity">
            Withdraw to bank
          </button>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={12} className="text-text-subtle" strokeWidth={2.5} />
            <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider">Next payout</p>
          </div>
          <p className="font-display text-2xl font-extrabold text-text tracking-tight">{formatCurrency(Math.round(netPayout * 0.4)).replace('.00', '')}</p>
          <p className="text-xs text-text-muted mt-1">Friday · 7-day hold period</p>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-5">
          <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">Lifetime payouts</p>
          <p className="font-display text-2xl font-extrabold text-text tracking-tight">{formatCurrency(netPayout * 4).replace('.00', '')}</p>
          <p className="text-xs text-text-muted mt-1">Across {payouts.length + 2} settlements</p>
        </div>
      </section>

      <section>
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-border flex items-baseline justify-between">
            <h2 className="font-display text-lg font-bold text-text tracking-tighter">Payout history</h2>
            <button className="text-xs font-semibold text-text-muted hover:text-text transition-colors inline-flex items-center gap-1">
              <Download size={11} strokeWidth={2.5} /> Download
            </button>
          </div>
          <div className="divide-y divide-border">
            {payouts.map(p => (
              <div key={p.id} className="p-5 flex items-center gap-4 hover:bg-surface-2 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                  <Check size={14} className="text-success" strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs font-semibold text-text">{p.id}</p>
                  <p className="text-xs text-text-muted mt-0.5">{p.events} events · {p.date}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-display font-bold text-sm text-text">{formatCurrency(p.amount).replace('.00', '')}</p>
                  <p className="font-mono text-[10px] text-success uppercase tracking-wider mt-0.5">{p.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

// ============== CREATE EVENT MODAL ==============
const CreateEventModal = ({
  onClose, onCreated, organizerName,
}: { onClose: () => void; onCreated: () => void; organizerName: string }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Music' | 'Food' | 'Nightlife' | 'Comedy' | 'Sports'>('Music');
  const [city, setCity] = useState<'Johannesburg' | 'Cape Town' | 'Durban'>('Johannesburg');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('20:00');
  const [priceMin, setPriceMin] = useState('150');
  const [priceMax, setPriceMax] = useState('450');
  const [capacity, setCapacity] = useState('500');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error } = await supabase.from('events').insert({
      title,
      description,
      category,
      city,
      venue,
      location: venue,
      date: new Date(`${date}T${time}:00`).toISOString(),
      time,
      price_min: parseFloat(priceMin),
      price_max: parseFloat(priceMax),
      capacity: parseInt(capacity, 10),
      organizer: organizerName,
      image_url: `https://source.unsplash.com/800x1000/?${category.toLowerCase()},${city.split(' ')[0].toLowerCase()}`,
    });

    if (error) {
      setError(error.message + ' (You may need to add RLS policies for organizer writes — see organizer-setup.sql)');
      setSubmitting(false);
    } else {
      setSuccess(true);
      setTimeout(() => onCreated(), 1200);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-5 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-surface border border-border rounded-t-3xl md:rounded-3xl w-full md:max-w-lg max-h-[95vh] overflow-y-auto animate-scale-in"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 bg-surface-2 rounded-full flex items-center justify-center hover:bg-surface-3 transition-colors z-10"
        >
          <X size={16} className="text-text" strokeWidth={2} />
        </button>

        <div className="p-6 md:p-8">
          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-5">
                <Check size={28} className="text-success" strokeWidth={3} />
              </div>
              <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">Event created</p>
              <h2 className="font-display text-2xl font-bold text-text tracking-tighter mb-3">You're live.</h2>
              <p className="text-sm text-text-muted">Tickets are ready to sell.</p>
            </div>
          ) : (
            <>
              <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">New event</p>
              <h2 className="font-display text-2xl font-bold text-text tracking-tighter mb-6">Create an event</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Field label="Event title">
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Black Coffee at Konka"
                    required
                    className="w-full h-11 px-4 bg-surface-2 text-text placeholder-text-subtle rounded-xl border border-border focus:border-border-strong focus:outline-none text-sm"
                  />
                </Field>

                <Field label="Description">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the event"
                    required
                    rows={3}
                    className="w-full px-4 py-3 bg-surface-2 text-text placeholder-text-subtle rounded-xl border border-border focus:border-border-strong focus:outline-none text-sm resize-none"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Category">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full h-11 px-3 bg-surface-2 text-text rounded-xl border border-border focus:border-border-strong focus:outline-none text-sm"
                    >
                      {['Music', 'Food', 'Nightlife', 'Comedy', 'Sports'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="City">
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value as any)}
                      className="w-full h-11 px-3 bg-surface-2 text-text rounded-xl border border-border focus:border-border-strong focus:outline-none text-sm"
                    >
                      {['Johannesburg', 'Cape Town', 'Durban'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field label="Venue">
                  <input
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="e.g. FNB Stadium"
                    required
                    className="w-full h-11 px-4 bg-surface-2 text-text placeholder-text-subtle rounded-xl border border-border focus:border-border-strong focus:outline-none text-sm"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Date">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full h-11 px-3 bg-surface-2 text-text rounded-xl border border-border focus:border-border-strong focus:outline-none text-sm"
                    />
                  </Field>
                  <Field label="Time">
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                      className="w-full h-11 px-3 bg-surface-2 text-text rounded-xl border border-border focus:border-border-strong focus:outline-none text-sm"
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Field label="Min price (R)">
                    <input
                      type="number"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      required
                      min="0"
                      className="w-full h-11 px-4 bg-surface-2 text-text rounded-xl border border-border focus:border-border-strong focus:outline-none text-sm"
                    />
                  </Field>
                  <Field label="Max price (R)">
                    <input
                      type="number"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      required
                      min="0"
                      className="w-full h-11 px-4 bg-surface-2 text-text rounded-xl border border-border focus:border-border-strong focus:outline-none text-sm"
                    />
                  </Field>
                  <Field label="Capacity">
                    <input
                      type="number"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      required
                      min="1"
                      className="w-full h-11 px-4 bg-surface-2 text-text rounded-xl border border-border focus:border-border-strong focus:outline-none text-sm"
                    />
                  </Field>
                </div>

                {error && (
                  <div className="bg-error/10 border border-error/20 rounded-xl p-3">
                    <p className="text-xs text-error">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 bg-inverse text-inverse-text rounded-full font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition-opacity flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  Publish event
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="block font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">{label}</span>
    {children}
  </label>
);
