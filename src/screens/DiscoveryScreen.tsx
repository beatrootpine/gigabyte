import React, { useState, useEffect } from 'react';
import { MapPin, Filter } from 'lucide-react';
import { Event } from '../types';
import { EventCard } from '../components/EventCard';
import { SearchBar } from '../components/SearchBar';
import { Button } from '../components/Button';
import { Logo } from '../components/Logo';
import { CITIES, CATEGORIES } from '../utils/theme';
import { eventsService } from '../services/supabase';

export const DiscoveryScreen: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | null>('Johannesburg');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await eventsService.getEvents();
      setEvents(data || []);
      filterEvents(data || [], selectedCity, selectedCategory, searchQuery);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = (eventsToFilter: Event[], city: string | null, category: string | null, query: string) => {
    let result = eventsToFilter;

    if (city) {
      result = result.filter(e => e.city === city);
    }

    if (category) {
      result = result.filter(e => e.category === category);
    }

    if (query) {
      result = result.filter(e =>
        e.title.toLowerCase().includes(query.toLowerCase()) ||
        e.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredEvents(result);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterEvents(events, selectedCity, selectedCategory, query);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    filterEvents(events, city, selectedCategory, searchQuery);
  };

  const handleCategoryChange = (category: string) => {
    const newCategory = selectedCategory === category ? null : category;
    setSelectedCategory(newCategory);
    filterEvents(events, selectedCity, newCategory, searchQuery);
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-gigabyte-dark p-4 sticky top-0 z-10 border-b border-gigabyte-surface">
        <Logo size="md" className="mb-4" />
        <SearchBar
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search events..."
        />
      </div>

      {/* Filters */}
      <div className="p-4 space-y-4">
        {/* City selection */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={18} className="text-gigabyte-primary" />
            <span className="text-sm font-semibold text-gigabyte-text">Location</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {CITIES.map(city => (
              <button
                key={city}
                onClick={() => handleCityChange(city)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCity === city
                    ? 'bg-gigabyte-primary text-gigabyte-dark'
                    : 'bg-gigabyte-surface text-gigabyte-text hover:bg-gigabyte-surface/80'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Category filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-gigabyte-primary hover:text-gigabyte-accent transition-colors"
        >
          <Filter size={18} />
          <span className="text-sm font-medium">Categories</span>
        </button>

        {/* Category filter */}
        {showFilters && (
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-gigabyte-accent text-gigabyte-dark'
                    : 'bg-gigabyte-surface text-gigabyte-text hover:bg-gigabyte-surface/80'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Events grid */}
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gigabyte-text-muted">Loading events...</div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gigabyte-text-muted mb-4">No events found</p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
                setSelectedCity('Johannesburg');
              }}
              variant="ghost"
              size="sm"
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => {
                  /* Navigate to event detail */
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
