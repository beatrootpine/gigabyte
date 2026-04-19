import { useState, useEffect } from 'react';
import { ChevronDown, Search, Shield, Sparkles } from 'lucide-react';
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
  const [showCityPicker, setShowCityPicker] = useState(false);
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

  const cityEvents = events.filter(e => e.city === selectedCity);
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

  // Homecoming spotlight - highlight specific events (mock: pick 3 Music/Nightlife events)
  const homecomingSpotlight = filteredEvents
    .filter(e => e.category === 'Music' || e.category === 'Nightlife')
    .slice(0, 3);

  const featuredEvent = filteredEvents[0];
  const thisWeekend = filteredEvents.slice(1, 5);
  const rest = filteredEvents.slice(5);

  return (
    <div className="min-h-screen bg-bg pb-28">
      <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-xl border-b border-border">
        <div className="px-5 py-4 flex items-center justify-between gap-3">
          <Logo size="md" />
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCityPicker(!showCityPicker)}
              className="flex items-center gap-1.5 px-3.5 h-10 bg-surface-2 rounded-full border border-border hover:border-border-strong transition-colors"
            >
              <span className="text-xs font-semibold text-text">{selectedCity}</span>
              <ChevronDown size={14} className="text-text-muted" strokeWidth={2.5} />
            </button>
            
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="w-10 h-10 bg-surface-2 rounded-full border border-border hover:border-border-strong flex items-center justify-center transition-colors"
            >
              <Search size={16} className="text-text" strokeWidth={2.5} />
            </button>

            <ThemeToggle />
          </div>
        </div>

        {showCityPicker && (
          <div className="px-5 pb-4 animate-fade-in">
            <div className="flex gap-2">
              {CITIES.map(city => (
                <button
                  key={city}
                  onClick={() => { setSelectedCity(city); setShowCityPicker(false); }}
                  className={`flex-1 h-10 rounded-full text-xs font-semibold transition-all ${
                    selectedCity === city
                      ? 'bg-inverse text-inverse-text'
                      : 'bg-surface-2 text-text-muted border border-border'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}

        {showSearch && (
          <div className="px-5 pb-4 animate-fade-in">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        )}

        {/* Mode toggle: Direct vs Resale */}
        <div className="px-5 pb-3">
          <div className="inline-flex items-center gap-1 p-1 bg-surface-2 border border-border rounded-full">
            <button
              onClick={() => setMode('direct')}
              className={`h-8 px-4 rounded-full text-xs font-semibold transition-all ${
                mode === 'direct' ? 'bg-inverse text-inverse-text' : 'text-text-muted hover:text-text'
              }`}
            >
              Direct
            </button>
            <button
              onClick={() => setMode('resale')}
              className={`h-8 px-4 rounded-full text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
                mode === 'resale' ? 'bg-inverse text-inverse-text' : 'text-text-muted hover:text-text'
              }`}
            >
              <Shield size={11} strokeWidth={2.5} />
              Resale
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="px-5 pb-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 w-max">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`h-9 px-4 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
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
                className={`h-9 px-4 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-inverse text-inverse-text'
                    : 'bg-surface-2 text-text-muted border border-border'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="px-5 py-6">
        {loading ? (
          <LoadingState />
        ) : mode === 'resale' ? (
          <>
            <section className="mb-8">
              <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">
                Resale · {selectedCity}
              </p>
              <h1 className="font-display text-4xl md:text-6xl font-extrabold text-text tracking-tightest leading-[0.95] text-balance">
                Someone's selling.<br />You're buying. Safely.
              </h1>
              <p className="text-text-muted text-base mt-4 max-w-md">
                Every resale ticket is escrow-protected and fraud-verified. No fake QRs, no chargebacks, no drama.
              </p>
            </section>
            <ResaleMarketplace cityFilter={selectedCity} categoryFilter={selectedCategory} />
          </>
        ) : filteredEvents.length === 0 ? (
          <EmptyState onClear={() => { setSearchQuery(''); setSelectedCategory(null); }} />
        ) : (
          <>
            <section className="mb-8">
              <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">
                {selectedCategory || 'Featured'} · {selectedCity}
              </p>
              <h1 className="font-display text-4xl md:text-6xl font-extrabold text-text tracking-tightest leading-[0.95] text-balance">
                Tonight, tomorrow,<br />and every weekend.
              </h1>
              <div className="flex items-center gap-5 mt-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-electric" strokeWidth={2.5} />
                  <p className="text-sm text-text-muted">Every ticket verified. Every transfer protected.</p>
                </div>
              </div>
            </section>

            {/* Homecoming spotlight */}
            {homecomingSpotlight.length > 0 && (
              <section className="mb-12 animate-fade-up">
                <div className="flex items-baseline justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-gold" strokeWidth={2.5} />
                    <h2 className="font-display text-xl font-bold text-text tracking-tighter">
                      Homecoming spotlight
                    </h2>
                  </div>
                  <span className="font-mono text-[10px] text-text-subtle uppercase tracking-wider">
                    Curated
                  </span>
                </div>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-5 px-5">
                  {homecomingSpotlight.map(event => (
                    <div key={event.id} className="flex-shrink-0 w-72">
                      <EventCard event={event} onClick={() => setSelectedEvent(event)} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Featured */}
            {featuredEvent && (
              <section className="mb-12 animate-fade-up">
                <div className="flex items-baseline justify-between mb-4">
                  <h2 className="font-display text-xl font-bold text-text tracking-tighter">Featured</h2>
                  <span className="font-mono text-[10px] text-text-subtle uppercase tracking-wider">Pick of the week</span>
                </div>
                <EventCard event={featuredEvent} variant="featured" onClick={() => setSelectedEvent(featuredEvent)} />
              </section>
            )}

            {/* This weekend */}
            {thisWeekend.length > 0 && (
              <section className="mb-12">
                <div className="flex items-baseline justify-between mb-6">
                  <h2 className="font-display text-xl font-bold text-text tracking-tighter">This weekend</h2>
                  <span className="font-mono text-[10px] text-text-subtle uppercase tracking-wider">{thisWeekend.length} events</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {thisWeekend.map(event => (
                    <EventCard key={event.id} event={event} onClick={() => setSelectedEvent(event)} />
                  ))}
                </div>
              </section>
            )}

            {/* More */}
            {rest.length > 0 && (
              <section className="mb-12">
                <div className="flex items-baseline justify-between mb-6">
                  <h2 className="font-display text-xl font-bold text-text tracking-tighter">More in {selectedCity}</h2>
                  <span className="font-mono text-[10px] text-text-subtle uppercase tracking-wider">{rest.length} events</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {rest.map(event => (
                    <EventCard key={event.id} event={event} onClick={() => setSelectedEvent(event)} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {selectedEvent && (
        <EventDetailScreen event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
};

const LoadingState = () => (
  <div className="space-y-8 animate-pulse">
    <div className="h-32 bg-surface-2 rounded-2xl" />
    <div className="aspect-[4/5] md:aspect-[16/9] bg-surface-2 rounded-3xl" />
    <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
      {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-[4/5] bg-surface-2 rounded-2xl" />)}
    </div>
  </div>
);

const EmptyState = ({ onClear }: { onClear: () => void }) => (
  <div className="py-24 text-center">
    <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-3">404 · No results</p>
    <h2 className="font-display text-3xl font-bold text-text tracking-tighter mb-3">Nothing here yet</h2>
    <p className="text-text-muted mb-6 max-w-xs mx-auto">Try adjusting your filters or exploring another city.</p>
    <button onClick={onClear} className="inline-flex h-11 px-6 items-center justify-center bg-inverse text-inverse-text rounded-full font-semibold text-sm hover:opacity-90 transition-opacity">
      Clear filters
    </button>
  </div>
);
