import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Wallet, Heart, ChevronRight, Sparkles, Building2 } from 'lucide-react';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';
import { Event } from '../types';
import { eventsService } from '../services/supabase';
import { formatCurrency } from '../utils/theme';
import { SubscriptionScreen } from './SubscriptionScreen';
import { BrandMarketplaceScreen } from './BrandMarketplaceScreen';

interface StatCard {
  label: string;
  value: string;
  sublabel: string;
  trend?: string;
}

export const CustomerDashboard = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showBrands, setShowBrands] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const events = await eventsService.getEvents();
      setUpcomingEvents((events || []).slice(0, 4));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock stats - in production these would come from user's tickets/history
  const stats: StatCard[] = [
    { label: 'Events attended', value: '12', sublabel: 'This year', trend: '+3 vs 2023' },
    { label: 'Total spent', value: formatCurrency(4850).replace('.00', ''), sublabel: 'On tickets', trend: 'R450 saved with Pro' },
    { label: 'Upcoming', value: '3', sublabel: 'In the next 30 days', trend: 'Next: Friday' },
    { label: 'Favorites', value: '18', sublabel: 'Saved events', trend: '+5 this month' },
  ];

  return (
    <div className="min-h-screen bg-bg pb-28">
      <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-xl border-b border-border">
        <div className="px-5 py-4 flex items-center justify-between">
          <Logo size="md" />
          <ThemeToggle />
        </div>
      </header>

      <main className="px-5 py-6">
        {/* Greeting */}
        <section className="mb-8">
          <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">
            Your dashboard
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-text tracking-tightest leading-[0.95]">
            Welcome back, Mo.
          </h1>
          <p className="text-text-muted text-base mt-4 max-w-md">
            Here's your event activity and what's coming up next.
          </p>
        </section>

        {/* Stats grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-surface border border-border rounded-2xl p-5 animate-fade-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <p className="font-mono text-[9px] text-text-subtle uppercase tracking-wider mb-3">
                {stat.label}
              </p>
              <p className="font-display text-3xl md:text-4xl font-extrabold text-text tracking-tight leading-none mb-2">
                {stat.value}
              </p>
              <p className="text-xs text-text-muted">{stat.sublabel}</p>
              {stat.trend && (
                <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border">
                  <TrendingUp size={11} className="text-electric" strokeWidth={2.5} />
                  <p className="text-[11px] font-medium text-text-muted">{stat.trend}</p>
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Pro upgrade banner */}
        <section className="mb-10">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-electric via-electric-deep to-gold p-6 md:p-8">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="max-w-md">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={14} className="text-white" strokeWidth={2.5} />
                  <p className="font-mono text-[10px] text-white/90 uppercase tracking-wider">
                    Gigabyte Pro
                  </p>
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-white tracking-tighter mb-2 leading-tight">
                  Unlock every venue, every weekend.
                </h3>
                <p className="text-white/80 text-sm mb-5">
                  Exclusive discounts, early-bird access, members-only events, zero service fees.
                </p>
              </div>
              <div className="flex-shrink-0">
                <button onClick={() => setShowSubscription(true)} className="h-12 px-6 bg-white text-ink-950 rounded-full font-semibold text-sm hover:bg-white/90 transition-colors">
                  Upgrade R49/mo
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming events */}
        <section className="mb-10">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-text tracking-tighter">
              Your upcoming events
            </h2>
            <button className="flex items-center gap-1 text-xs font-semibold text-text-muted hover:text-text transition-colors">
              See all <ChevronRight size={14} strokeWidth={2.5} />
            </button>
          </div>
          
          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[1,2,3].map(i => (
                <div key={i} className="h-20 bg-surface-2 rounded-2xl" />
              ))}
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="bg-surface border border-border rounded-2xl p-8 text-center">
              <Calendar size={20} className="text-text-subtle mx-auto mb-3" strokeWidth={2} />
              <p className="text-text-muted text-sm">No upcoming events. Explore to find your next one.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map(event => {
                const date = new Date(event.date);
                const day = date.toLocaleDateString('en-ZA', { day: '2-digit' });
                const month = date.toLocaleDateString('en-ZA', { month: 'short' }).toUpperCase();
                return (
                  <div
                    key={event.id}
                    className="flex items-center gap-4 bg-surface border border-border rounded-2xl p-4 hover:bg-surface-2 transition-colors cursor-pointer"
                  >
                    <div className="flex-shrink-0 w-16 text-center">
                      <p className="font-display font-extrabold text-2xl text-text leading-none">{day}</p>
                      <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mt-1">{month}</p>
                    </div>
                    <div className="w-px h-12 bg-border flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-base text-text line-clamp-1">{event.title}</h3>
                      <p className="text-xs text-text-muted line-clamp-1 mt-1">{event.venue} · {event.city}</p>
                    </div>
                    <ChevronRight size={16} className="text-text-subtle flex-shrink-0" strokeWidth={2} />
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Activity breakdown */}
        <section className="mb-10">
          <h2 className="font-display text-xl font-bold text-text tracking-tighter mb-6">
            Your event mix
          </h2>
          <div className="bg-surface border border-border rounded-2xl p-6">
            <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-4">
              Categories attended · 2024
            </p>
            {[
              { cat: 'Music', count: 6, pct: 50 },
              { cat: 'Nightlife', count: 3, pct: 25 },
              { cat: 'Comedy', count: 2, pct: 17 },
              { cat: 'Food', count: 1, pct: 8 },
            ].map((row, i) => (
              <div key={i} className="mb-4 last:mb-0">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="font-semibold text-sm text-text">{row.cat}</span>
                  <span className="font-mono text-xs text-text-muted">{row.count} events · {row.pct}%</span>
                </div>
                <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-text rounded-full transition-all"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick actions */}
        <section>
          <h2 className="font-display text-xl font-bold text-text tracking-tighter mb-6">
            Quick actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowSubscription(true)}
              className="bg-surface border border-border rounded-2xl p-5 text-left hover:bg-surface-2 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-electric/10 flex items-center justify-center mb-3">
                <Sparkles size={16} className="text-electric" strokeWidth={2} />
              </div>
              <p className="font-display font-semibold text-sm text-text">Gigabyte Pro</p>
              <p className="text-xs text-text-muted mt-1">Benefits & tiers</p>
            </button>
            <button className="bg-surface border border-border rounded-2xl p-5 text-left hover:bg-surface-2 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center mb-3">
                <Wallet size={16} className="text-text" strokeWidth={2} />
              </div>
              <p className="font-display font-semibold text-sm text-text">My tickets</p>
              <p className="text-xs text-text-muted mt-1">View all tickets</p>
            </button>
            <button className="bg-surface border border-border rounded-2xl p-5 text-left hover:bg-surface-2 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center mb-3">
                <Heart size={16} className="text-text" strokeWidth={2} />
              </div>
              <p className="font-display font-semibold text-sm text-text">Favourites</p>
              <p className="text-xs text-text-muted mt-1">18 saved events</p>
            </button>
            <button
              onClick={() => setShowBrands(true)}
              className="bg-surface border border-border rounded-2xl p-5 text-left hover:bg-surface-2 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center mb-3">
                <Building2 size={16} className="text-text" strokeWidth={2} />
              </div>
              <p className="font-display font-semibold text-sm text-text">Brands</p>
              <p className="text-xs text-text-muted mt-1">Partner offers</p>
            </button>
          </div>
        </section>
      </main>

      {showSubscription && <SubscriptionScreen onClose={() => setShowSubscription(false)} />}
      {showBrands && <BrandMarketplaceScreen onClose={() => setShowBrands(false)} />}
    </div>
  );
};
