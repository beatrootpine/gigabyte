import { useState, useEffect } from 'react';
import { Search, Shield, CreditCard, Sparkles, ArrowRightLeft, ChevronDown, X } from 'lucide-react';
import { Event } from '../types';
import { EventCard } from '../components/EventCard';
import { SearchBar } from '../components/SearchBar';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';
import { CITIES, CATEGORIES } from '../utils/theme';
import { eventsService } from '../services/supabase';
import { EventDetailScreen } from './EventDetailScreen';
import { ResaleMarketplace } from './ResaleMarketplace';

type Mode = 'direct' | 'resale';

export const DiscoveryScreen = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('Johannesburg');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>('direct');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await eventsService.getEvents();
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Only show events in the future — safety net in case demo data goes stale
  const now = new Date();
  const upcomingEvents = events.filter(e => e.date && new Date(e.date) > now);
  const cityEvents = upcomingEvents.filter(e => e.city === selectedCity);
  const filteredEvents = cityEvents.filter(event => {
    if (selectedCategory && event.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        event.title.toLowerCase().includes(q) ||
        event.description.toLowerCase().includes(q) ||
        event.venue.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const featuredEvent = filteredEvents[0];
  const thisWeekend = filteredEvents.slice(1, 5);
  const rest = filteredEvents.slice(5);

  return (
    <div className="min-h-screen bg-bg pb-28">
      {/* COMPACT HEADER: Logo + City + Search only */}
      <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-xl border-b border-border">
        <div className="px-5 py-3.5 flex items-center justify-between gap-3">
          <Logo size="md" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilterSheet(true)}
              className="flex items-center gap-1.5 px-3 h-9 bg-surface-2 rounded-full border border-border hover:border-border-strong transition-colors"
              aria-label="Change city"
            >
              <span className="text-xs font-semibold text-text">{selectedCity}</span>
              <ChevronDown size={12} className="text-text-muted" strokeWidth={2.5} />
            </button>
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="w-9 h-9 bg-surface-2 rounded-full border border-border hover:border-border-strong flex items-center justify-center transition-colors"
              aria-label="Search"
            >
              <Search size={14} className="text-text" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {showSearch && (
          <div className="px-5 pb-3 animate-fade-in">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        )}
      </header>

      <main className="px-5 py-6">
        {loading ? (
          <LoadingState />
        ) : mode === 'resale' ? (
          <>
            <ModeToggle mode={mode} onChange={setMode} />
            <section className="mb-8 mt-6">
              <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">
                Resale · {selectedCity}
              </p>
              <h1 className="font-display text-3xl md:text-5xl font-extrabold text-text tracking-tightest leading-[0.95] text-balance">
                Fan-to-fan,<br />escrow-protected.
              </h1>
              <p className="text-text-muted text-sm md:text-base mt-3 max-w-md">
                Every resale ticket is fraud-verified. Buyer pays Gigabyte, we reissue a fresh QR, seller gets paid.
              </p>
            </section>
            <ResaleMarketplace cityFilter={selectedCity} categoryFilter={selectedCategory} />
          </>
        ) : filteredEvents.length === 0 ? (
          <EmptyState onClear={() => { setSearchQuery(''); setSelectedCategory(null); }} />
        ) : (
          <>
            {/* HERO */}
            <section className="mb-7">
              <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">
                {selectedCategory || 'Events'} · {selectedCity}
              </p>
              <h1 className="font-display text-3xl md:text-6xl font-extrabold text-text tracking-tightest leading-[0.95] text-balance">
                Every event.<br />One app.
              </h1>
            </section>

            {/* WHY GIGABYTE USP STRIP */}
            <section className="mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                <USPTile
                  icon={Shield}
                  title="Verified tickets"
                  desc="Zero fraud. Rotating QR."
                />
                <USPTile
                  icon={ArrowRightLeft}
                  title="Safe transfers"
                  desc="Send to a friend in one tap."
                />
                <USPTile
                  icon={CreditCard}
                  title="Pay over time"
                  desc="Split into 3 months."
                />
                <USPTile
                  icon={Sparkles}
                  title="Member perks"
                  desc="Discounts & early access."
                />
              </div>
            </section>

            {/* Mode toggle */}
            <ModeToggle mode={mode} onChange={setMode} />

            {/* Category scroll */}
            <section className="mb-8 mt-6 overflow-x-auto scrollbar-hide -mx-5 px-5">
              <div className="flex gap-2 w-max">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`h-8 px-3.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === null
                      ? 'bg-inverse text-inverse-text'
                      : 'bg-surface-2 text-text-muted border border-border'
                  }`}
                >
                  All
                </button>
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                    className={`h-8 px-3.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === category
                        ? 'bg-inverse text-inverse-text'
                        : 'bg-surface-2 text-text-muted border border-border'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </section>

            {/* Featured */}
            {featuredEvent && (
              <section className="mb-10 animate-fade-up">
                <div className="flex items-baseline justify-between mb-4">
                  <h2 className="font-display text-lg font-bold text-text tracking-tighter">Featured</h2>
                  <span className="font-mono text-[10px] text-text-subtle uppercase tracking-wider">Pick of the week</span>
                </div>
                <EventCard event={featuredEvent} variant="featured" onClick={() => setSelectedEvent(featuredEvent)} />
              </section>
            )}

            {/* This weekend */}
            {thisWeekend.length > 0 && (
              <section className="mb-10">
                <div className="flex items-baseline justify-between mb-5">
                  <h2 className="font-display text-lg font-bold text-text tracking-tighter">This weekend</h2>
                  <span className="font-mono text-[10px] text-text-subtle uppercase tracking-wider">{thisWeekend.length}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                  {thisWeekend.map(event => (
                    <EventCard key={event.id} event={event} onClick={() => setSelectedEvent(event)} />
                  ))}
                </div>
              </section>
            )}

            {/* More */}
            {rest.length > 0 && (
              <section className="mb-10">
                <div className="flex items-baseline justify-between mb-5">
                  <h2 className="font-display text-lg font-bold text-text tracking-tighter">More in {selectedCity}</h2>
                  <span className="font-mono text-[10px] text-text-subtle uppercase tracking-wider">{rest.length}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                  {rest.map(event => (
                    <EventCard key={event.id} event={event} onClick={() => setSelectedEvent(event)} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* Filter / city sheet */}
      {showFilterSheet && (
        <FilterSheet
          selectedCity={selectedCity}
          onCityChange={(c) => { setSelectedCity(c); setShowFilterSheet(false); }}
          onClose={() => setShowFilterSheet(false)}
        />
      )}

      {selectedEvent && (
        <EventDetailScreen event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
};

// ===== USP Tile =====
const USPTile = ({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) => (
  <div className="bg-surface border border-border rounded-2xl p-3.5 md:p-4">
    <div className="w-8 h-8 rounded-lg bg-electric/10 flex items-center justify-center mb-2.5">
      <Icon size={14} className="text-electric" strokeWidth={2.5} />
    </div>
    <p className="font-display font-bold text-[13px] md:text-sm text-text tracking-tight leading-tight mb-0.5">
      {title}
    </p>
    <p className="text-[11px] md:text-xs text-text-muted leading-tight">{desc}</p>
  </div>
);

// ===== Mode Toggle =====
const ModeToggle = ({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) => (
  <div className="inline-flex items-center gap-1 p-1 bg-surface-2 border border-border rounded-full">
    <button
      onClick={() => onChange('direct')}
      className={`h-8 px-3.5 rounded-full text-xs font-semibold transition-all ${
        mode === 'direct' ? 'bg-inverse text-inverse-text' : 'text-text-muted'
      }`}
    >
      Direct
    </button>
    <button
      onClick={() => onChange('resale')}
      className={`h-8 px-3.5 rounded-full text-xs font-semibold transition-all inline-flex items-center gap-1 ${
        mode === 'resale' ? 'bg-inverse text-inverse-text' : 'text-text-muted'
      }`}
    >
      <Shield size={10} strokeWidth={2.5} />
      Resale
    </button>
  </div>
);

// ===== Filter Sheet =====
const FilterSheet = ({
  selectedCity,
  onCityChange,
  onClose,
}: {
  selectedCity: string;
  onCityChange: (c: string) => void;
  onClose: () => void;
}) => (
  <div
    onClick={onClose}
    className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-5 animate-fade-in"
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-surface border border-border rounded-t-3xl md:rounded-3xl w-full md:max-w-md max-h-[90vh] overflow-y-auto p-6 md:p-7 animate-scale-in"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider">Filters</p>
          <h2 className="font-display text-xl font-bold text-text tracking-tighter">Browse by city</h2>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 bg-surface-2 rounded-full flex items-center justify-center hover:bg-surface-3 transition-colors"
        >
          <X size={16} className="text-text" strokeWidth={2} />
        </button>
      </div>
      <div className="space-y-2 mb-6">
        {CITIES.map(city => (
          <button
            key={city}
            onClick={() => onCityChange(city)}
            className={`w-full h-12 px-4 rounded-2xl text-sm font-semibold transition-all flex items-center justify-between ${
              selectedCity === city
                ? 'bg-inverse text-inverse-text'
                : 'bg-surface-2 text-text border border-border'
            }`}
          >
            {city}
            {selectedCity === city && (
              <span className="font-mono text-[10px] uppercase tracking-wider opacity-70">Active</span>
            )}
          </button>
        ))}
      </div>
      <div className="pt-4 border-t border-border flex items-center justify-between">
        <span className="text-sm text-text-muted">Appearance</span>
        <ThemeToggle />
      </div>
    </div>
  </div>
);

// ===== Loading / Empty =====
const LoadingState = () => (
  <div className="space-y-8 animate-pulse">
    <div className="h-24 bg-surface-2 rounded-2xl" />
    <div className="grid grid-cols-4 gap-2.5">
      {[1,2,3,4].map(i => <div key={i} className="h-24 bg-surface-2 rounded-2xl" />)}
    </div>
    <div className="aspect-[4/5] md:aspect-[16/9] bg-surface-2 rounded-3xl" />
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {[1,2,3,4].map(i => <div key={i} className="aspect-[4/5] bg-surface-2 rounded-2xl" />)}
    </div>
  </div>
);

const EmptyState = ({ onClear }: { onClear: () => void }) => (
  <div className="py-24 text-center">
    <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-3">No results</p>
    <h2 className="font-display text-2xl font-bold text-text tracking-tighter mb-3">Nothing here yet</h2>
    <p className="text-text-muted mb-6 max-w-xs mx-auto text-sm">Try another city or clear your filters.</p>
    <button onClick={onClear} className="inline-flex h-11 px-6 items-center justify-center bg-inverse text-inverse-text rounded-full font-semibold text-sm hover:opacity-90 transition-opacity">
      Clear filters
    </button>
  </div>
);
