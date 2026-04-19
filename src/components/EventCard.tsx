import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Event } from '../types';
import { formatCurrency } from '../utils/theme';

interface EventCardProps {
  event: Event;
  onClick?: () => void;
  onFavorite?: (eventId: string, isFavorited: boolean) => void;
  isFavorited?: boolean;
  variant?: 'default' | 'featured' | 'compact';
}

const formatEventDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.toLocaleDateString('en-ZA', { day: '2-digit' });
  const month = date.toLocaleDateString('en-ZA', { month: 'short' }).toUpperCase();
  const weekday = date.toLocaleDateString('en-ZA', { weekday: 'short' }).toUpperCase();
  return { day, month, weekday };
};

export const EventCard = ({
  event,
  onClick,
  onFavorite,
  isFavorited = false,
  variant = 'default',
}: EventCardProps) => {
  const { day, month, weekday } = formatEventDate(event.date);

  if (variant === 'featured') {
    return (
      <div
        onClick={onClick}
        className="relative w-full aspect-[4/5] md:aspect-[16/9] rounded-3xl overflow-hidden cursor-pointer group bg-ink-900"
      >
        <img
          src={event.image_url}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-black via-ink-black/40 to-transparent" />
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite?.(event.id, !isFavorited);
          }}
          className="absolute top-5 right-5 w-11 h-11 bg-ink-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-ink-black/60 transition-all"
        >
          {isFavorited ? (
            <BookmarkCheck size={18} className="text-gold fill-gold" strokeWidth={2} />
          ) : (
            <Bookmark size={18} className="text-ink-50" strokeWidth={2} />
          )}
        </button>

        <div className="absolute top-5 left-5">
          <span className="inline-block px-3 py-1.5 bg-ink-50/10 backdrop-blur-md rounded-full text-[10px] font-mono font-semibold text-ink-50 uppercase tracking-wider">
            {event.category}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex items-end justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-3 mb-2 font-mono text-xs text-ink-300 uppercase tracking-wider">
                <span>{weekday} {day} {month}</span>
                <span className="w-1 h-1 rounded-full bg-ink-500" />
                <span className="truncate">{event.city}</span>
              </div>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-ink-50 tracking-tighter leading-[0.98] line-clamp-2">
                {event.title}
              </h2>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="font-mono text-[10px] text-ink-400 uppercase tracking-wider mb-1">From</p>
              <p className="font-display font-bold text-2xl md:text-3xl text-ink-50 tracking-tight">
                {formatCurrency(event.price_min).replace('.00', '')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        onClick={onClick}
        className="flex gap-4 p-3 rounded-2xl hover:bg-ink-900 transition-colors cursor-pointer group"
      >
        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-ink-900 flex-shrink-0">
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[10px] text-ink-400 uppercase tracking-wider mb-1">
            {weekday} {day} {month}
          </p>
          <h3 className="font-display font-semibold text-base text-ink-50 tracking-super-tight line-clamp-2 mb-1">
            {event.title}
          </h3>
          <p className="text-xs text-ink-400 line-clamp-1">{event.venue}</p>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="font-display font-bold text-base text-ink-50">
            {formatCurrency(event.price_min).replace('.00', '')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div onClick={onClick} className="group cursor-pointer animate-fade-up">
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-ink-900 mb-4">
        <img
          src={event.image_url}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-black/60 via-transparent to-transparent" />
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite?.(event.id, !isFavorited);
          }}
          className="absolute top-3 right-3 w-10 h-10 bg-ink-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-ink-black/70 transition-all"
        >
          {isFavorited ? (
            <BookmarkCheck size={16} className="text-gold fill-gold" strokeWidth={2} />
          ) : (
            <Bookmark size={16} className="text-ink-50" strokeWidth={2} />
          )}
        </button>

        <div className="absolute top-3 left-3 bg-ink-black/50 backdrop-blur-md rounded-lg px-2.5 py-1.5 text-center">
          <p className="font-mono text-[9px] text-ink-300 uppercase tracking-wider leading-none mb-0.5">{month}</p>
          <p className="font-display font-bold text-lg text-ink-50 leading-none">{day}</p>
        </div>

        <div className="absolute bottom-3 left-3">
          <span className="inline-block px-2.5 py-1 bg-ink-50/10 backdrop-blur-md rounded-full text-[9px] font-mono font-semibold text-ink-50 uppercase tracking-wider">
            {event.category}
          </span>
        </div>
      </div>

      <div className="px-1">
        <h3 className="font-display font-semibold text-lg text-ink-50 tracking-super-tight leading-tight line-clamp-2 mb-2">
          {event.title}
        </h3>

        <div className="flex items-center gap-2 text-xs text-ink-400 mb-3">
          <span className="truncate">{event.venue}</span>
          <span className="w-1 h-1 rounded-full bg-ink-600 flex-shrink-0" />
          <span className="flex-shrink-0">{event.city}</span>
        </div>

        <div className="flex items-center justify-between">
          <p className="font-mono text-xs text-ink-400">
            From <span className="text-ink-50 font-semibold">{formatCurrency(event.price_min).replace('.00', '')}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
