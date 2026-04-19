import { useState, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Event } from '../types';
import { EventCard } from '../components/EventCard';
import { SearchBar } from '../components/SearchBar';
import { Logo } from '../components/Logo';
import { CITIES, CATEGORIES } from '../utils/theme';
import { eventsService } from '../services/supabase';

export const DiscoveryScreen = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('Johannesburg');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const featuredEvent = filteredEvents[0];
  const thisWeekend = filteredEvents.slice(1, 5);
  const rest = filteredEvents.slice(5);

  return (
    <div className="min-h-screen bg-ink-950 pb-24">
      <header className="sticky top-0 z-40 bg-ink-950/80 backdrop-blur-xl border-b border-ink-900">
        <div className="px-5 py-4 flex items-center justify-between">
          <Logo size="md" />
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCityPicker(!showCityPicker)}
              className="flex items-center gap-1.5 px-3.5 h-10 bg-ink-900 rounded-full border border-ink-800 hover:border-ink-700 transition-colors"
            >
              <span className="text-xs font-semibold text-ink-50">{selectedCity}</span>
              <ChevronDown size={14} className="text-ink-400" strokeWidth={2.5} />
            </button>
            
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="w-10 h-10 bg-ink-900 rounded-full border border-ink-800 hover:border-ink-700 flex items-center justify-center transition-colors"
            >
              <Search size={16} className="text-ink-50" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {showCityPicker && (
          <div className="px-5 pb-4 animate-fade-in">
            <div className="flex gap-2">
              {CITIES.map(city => (
                <button
                  key={city}
                  onClick={() => {
                    setSelectedCity(city);
                    setShowCityPicker(false);
                  }}
                  className={`flex-1 h-10 rounded-full text-xs font-semibold transition-all ${
                    selectedCity === city
                      ? 'bg-ink-50 text-ink-950'
                      : 'bg-ink-900 text-ink-300 border border-ink-800'
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

        <div className="px-5 pb-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 w-max">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`h-9 px-4 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === null
                  ? 'bg-ink-50 text-ink-950'
                  : 'bg-ink-900 text-ink-300 border border-ink-800 hover:border-ink-700'
              }`}
            >
              All events
            </button>
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                className={`h-9 px-4 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-ink-50 text-ink-950'
                    : 'bg-ink-900 text-ink-300 border border-ink-800 hover:border-ink-700'
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
        ) : filteredEvents.length === 0 ? (
          <EmptyState onClear={() => { setSearchQuery(''); setSelectedCategory(null); }} />
        ) : (
          <>
            <section className="mb-8">
              <p className="font-mono text-[10px] text-ink-500 uppercase tracking-wider mb-2">
                {selectedCategory || 'Featured'} · {selectedCity}
              </p>
              <h1 className="font-display text-4xl md:text-6xl font-extrabold text-ink-50 tracking-tightest leading-[0.95] text-balance">
                Tonight, tomorrow,<br />and every weekend.
              </h1>
              <p className="text-ink-400 text-base mt-4 max-w-md">
                Discover {filteredEvents.length} events {selectedCategory ? `in ${selectedCategory.toLowerCase()}` : ''} across {selectedCity}.
              </p>
            </section>

            {featuredEvent && (
              <section className="mb-12 animate-fade-up">
                <div className="flex items-baseline justify-between mb-4">
                  <h2 className="font-display text-xl font-bold text-ink-50 tracking-tighter">
                    Featured
                  </h2>
                  <span className="font-mono text-[10px] text-ink-500 uppercase tracking-wider">
                    Pick of the week
                  </span>
                </div>
                <EventCard event={featuredEvent} variant="featured" />
              </section>
            )}

            {thisWeekend.length > 0 && (
              <section className="mb-12">
                <div className="flex items-baseline justify-between mb-6">
                  <h2 className="font-display text-xl font-bold text-ink-50 tracking-tighter">
                    This weekend
                  </h2>
                  <span className="font-mono text-[10px] text-ink-500 uppercase tracking-wider">
                    {thisWeekend.length} events
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {thisWeekend.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </section>
            )}

            {rest.length > 0 && (
              <section className="mb-12">
                <div className="flex items-baseline justify-between mb-6">
                  <h2 className="font-display text-xl font-bold text-ink-50 tracking-tighter">
                    More in {selectedCity}
                  </h2>
                  <span className="font-mono text-[10px] text-ink-500 uppercase tracking-wider">
                    {rest.length} events
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {rest.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

const LoadingState = () => (
  <div className="space-y-8 animate-pulse">
    <div className="h-32 bg-ink-900 rounded-2xl" />
    <div className="aspect-[4/5] md:aspect-[16/9] bg-ink-900 rounded-3xl" />
    <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
      {[1,2,3,4,5,6].map(i => (
        <div key={i} className="aspect-[4/5] bg-ink-900 rounded-2xl" />
      ))}
    </div>
  </div>
);

const EmptyState = ({ onClear }: { onClear: () => void }) => (
  <div className="py-24 text-center">
    <p className="font-mono text-[10px] text-ink-500 uppercase tracking-wider mb-3">
      404 · No results
    </p>
    <h2 className="font-display text-3xl font-bold text-ink-50 tracking-tighter mb-3">
      Nothing here yet
    </h2>
    <p className="text-ink-400 mb-6 max-w-xs mx-auto">
      Try adjusting your filters or exploring another city.
    </p>
    <button
      onClick={onClear}
      className="inline-flex h-11 px-6 items-center justify-center bg-ink-50 text-ink-950 rounded-full font-semibold text-sm hover:bg-white transition-colors"
    >
      Clear filters
    </button>
  </div>
);
