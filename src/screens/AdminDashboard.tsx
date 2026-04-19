import { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Ticket, ArrowUpRight, ArrowDownRight, Plus, MoreVertical } from 'lucide-react';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';
import { Event } from '../types';
import { eventsService } from '../services/supabase';
import { formatCurrency } from '../utils/theme';

export const AdminDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const data = await eventsService.getEvents();
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Revenue', value: formatCurrency(284500).replace('.00', ''), change: '+12.4%', up: true, icon: DollarSign },
    { label: 'Tickets sold', value: '1,247', change: '+8.1%', up: true, icon: Ticket },
    { label: 'Active users', value: '4,892', change: '+23.5%', up: true, icon: Users },
    { label: 'Conversion', value: '3.4%', change: '-0.8%', up: false, icon: TrendingUp },
  ];

  const recentBookings = [
    { id: '1', name: 'Thabo M.', event: 'Safaricom Live Festival', tickets: 2, total: 580, time: '2m ago' },
    { id: '2', name: 'Lerato K.', event: 'Amapiano Vibes', tickets: 1, total: 350, time: '8m ago' },
    { id: '3', name: 'Sipho D.', event: 'Cape Town Jazz Festival', tickets: 4, total: 1200, time: '14m ago' },
    { id: '4', name: 'Nomsa N.', event: 'Joe Stone Comedy', tickets: 2, total: 400, time: '22m ago' },
    { id: '5', name: 'Andre V.', event: 'Sharks vs Stormers', tickets: 3, total: 900, time: '31m ago' },
  ];

  const salesByCategory = [
    { cat: 'Music', sales: 485200, pct: 68 },
    { cat: 'Sports', sales: 142000, pct: 20 },
    { cat: 'Nightlife', sales: 56800, pct: 8 },
    { cat: 'Comedy', sales: 21300, pct: 3 },
    { cat: 'Food', sales: 7100, pct: 1 },
  ];

  return (
    <div className="min-h-screen bg-bg pb-28">
      <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-xl border-b border-border">
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <Logo size="md" />
            <span className="font-mono text-[10px] text-text-subtle uppercase tracking-wider px-2 py-0.5 bg-surface-2 rounded border border-border">
              Admin
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="px-5 py-6">
        {/* Header section */}
        <section className="mb-8 flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">
              Admin dashboard · Today
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-text tracking-tightest leading-[0.95]">
              Platform overview
            </h1>
          </div>
          <button className="h-11 px-5 bg-inverse text-inverse-text rounded-full font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
            <Plus size={16} strokeWidth={2.5} />
            New event
          </button>
        </section>

        {/* KPI stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-surface border border-border rounded-2xl p-5 animate-fade-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-9 h-9 rounded-xl bg-surface-2 flex items-center justify-center">
                  <stat.icon size={14} className="text-text" strokeWidth={2} />
                </div>
                <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${stat.up ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                  {stat.up ? <ArrowUpRight size={10} strokeWidth={3} /> : <ArrowDownRight size={10} strokeWidth={3} />}
                  {stat.change}
                </div>
              </div>
              <p className="font-display text-2xl md:text-3xl font-extrabold text-text tracking-tight leading-none mb-2">
                {stat.value}
              </p>
              <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </section>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Recent bookings */}
          <section className="lg:col-span-2">
            <div className="bg-surface border border-border rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-border flex items-baseline justify-between">
                <h2 className="font-display text-lg font-bold text-text tracking-tighter">
                  Recent bookings
                </h2>
                <button className="text-xs font-semibold text-text-muted hover:text-text transition-colors">
                  View all
                </button>
              </div>
              <div className="divide-y divide-border">
                {recentBookings.map(booking => (
                  <div key={booking.id} className="p-5 flex items-center gap-4 hover:bg-surface-2 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-surface-2 border border-border flex items-center justify-center flex-shrink-0">
                      <span className="font-display font-bold text-sm text-text">{booking.name[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-text">{booking.name}</p>
                      <p className="text-xs text-text-muted line-clamp-1 mt-0.5">
                        {booking.tickets}× {booking.event}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-display font-bold text-sm text-text">
                        {formatCurrency(booking.total).replace('.00', '')}
                      </p>
                      <p className="font-mono text-[10px] text-text-subtle mt-0.5">{booking.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Sales by category */}
          <section>
            <div className="bg-surface border border-border rounded-2xl p-5">
              <h2 className="font-display text-lg font-bold text-text tracking-tighter mb-1">
                Sales by category
              </h2>
              <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-5">
                Last 30 days
              </p>
              <div className="space-y-4">
                {salesByCategory.map((row, i) => (
                  <div key={i}>
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="font-semibold text-sm text-text">{row.cat}</span>
                      <span className="font-mono text-xs text-text-muted">{row.pct}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-surface-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-text rounded-full"
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11px] text-text-muted w-16 text-right">
                        {formatCurrency(row.sales).replace('.00', '').replace('R', 'R ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Events management table */}
        <section>
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-border flex items-baseline justify-between">
              <div>
                <h2 className="font-display text-lg font-bold text-text tracking-tighter">
                  Your events
                </h2>
                <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mt-1">
                  {events.length} total · {events.filter(e => new Date(e.date) > new Date()).length} upcoming
                </p>
              </div>
              <button className="text-xs font-semibold text-text-muted hover:text-text transition-colors">
                Manage
              </button>
            </div>
            {loading ? (
              <div className="p-5 space-y-3 animate-pulse">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-16 bg-surface-2 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="divide-y divide-border">
                {events.slice(0, 6).map(event => {
                  const date = new Date(event.date);
                  const isPast = date < new Date();
                  return (
                    <div key={event.id} className="p-5 flex items-center gap-4 hover:bg-surface-2 transition-colors">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-surface-2 flex-shrink-0">
                        <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-semibold text-sm text-text line-clamp-1">{event.title}</p>
                        <div className="flex items-center gap-2 mt-1 font-mono text-[10px] text-text-subtle uppercase tracking-wider">
                          <span>{event.category}</span>
                          <span className="w-1 h-1 rounded-full bg-border-strong" />
                          <span>{event.city}</span>
                          <span className="w-1 h-1 rounded-full bg-border-strong" />
                          <span>{date.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' })}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${isPast ? 'bg-surface-2 text-text-muted' : 'bg-success/10 text-success'}`}>
                          {isPast ? 'Ended' : 'Active'}
                        </span>
                        <button className="w-8 h-8 rounded-full hover:bg-surface-2 flex items-center justify-center transition-colors">
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
      </main>
    </div>
  );
};
