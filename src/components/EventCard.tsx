import React from 'react';
import { Heart, MapPin, Clock, Users } from 'lucide-react';
import { Event } from '../types';
import { formatCurrency, formatDate } from '../utils/theme';

interface EventCardProps {
  event: Event;
  onClick?: () => void;
  onFavorite?: (eventId: string, isFavorited: boolean) => void;
  isFavorited?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onClick,
  onFavorite,
  isFavorited = false,
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-gigabyte-surface rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gigabyte-dark">
        <img
          src={event.image_url}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite?.(event.id, !isFavorited);
          }}
          className="absolute top-3 right-3 p-2 bg-gigabyte-dark bg-opacity-75 rounded-full hover:bg-opacity-100 transition-all"
        >
          <Heart
            size={20}
            className={isFavorited ? 'fill-gigabyte-accent text-gigabyte-accent' : 'text-gigabyte-text'}
          />
        </button>

        {/* Category badge */}
        <div className="absolute top-3 left-3 px-3 py-1 bg-gigabyte-primary rounded-full">
          <span className="text-xs font-semibold text-gigabyte-dark">
            {event.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display text-lg font-bold text-gigabyte-text mb-2 line-clamp-2">
          {event.title}
        </h3>

        {/* Details */}
        <div className="space-y-2 mb-4 text-sm text-gigabyte-text-muted">
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span className="line-clamp-1">{event.venue}, {event.city}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} />
            <span>{event.capacity.toLocaleString()} capacity</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex justify-between items-center pt-4 border-t border-gigabyte-dark">
          <span className="text-gigabyte-text-muted text-sm">From</span>
          <span className="font-bold text-gigabyte-accent text-lg">
            {formatCurrency(event.price_min)}
          </span>
        </div>
      </div>
    </div>
  );
};
