import { Shield, ArrowRightLeft, Tag, QrCode, MoreHorizontal } from 'lucide-react';
import { DemoTicket, formatDateShort } from '../utils/mockData';
import { formatCurrency } from '../utils/theme';
import { SmartImage } from './SmartImage';

interface TicketCardProps {
  ticket: DemoTicket;
  onViewQR?: (ticket: DemoTicket) => void;
  onTransfer?: (ticket: DemoTicket) => void;
  onResell?: (ticket: DemoTicket) => void;
}

export const TicketCard = ({ ticket, onViewQR, onTransfer, onResell }: TicketCardProps) => {
  const { day, month, weekday } = formatDateShort(ticket.date);

  return (
    <div className="bg-surface border border-border rounded-3xl overflow-hidden animate-fade-up">
      {/* Top: event image with overlay */}
      <div className="relative aspect-[5/2] overflow-hidden bg-surface-2">
        <SmartImage
          src={ticket.event_image}
          alt={ticket.event_title}
          seed={ticket.id}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Gigabyte Protect badge */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 bg-black/50 backdrop-blur-md rounded-full">
          <Shield size={11} className="text-electric-soft" strokeWidth={2.5} />
          <span className="font-mono text-[9px] font-semibold text-white uppercase tracking-wider">
            Verified
          </span>
        </div>

        {/* Date */}
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md rounded-xl px-3 py-2 text-center">
          <p className="font-mono text-[9px] text-white/80 uppercase tracking-wider leading-none mb-1">{weekday}</p>
          <p className="font-display font-extrabold text-xl text-white leading-none">{day}</p>
          <p className="font-mono text-[9px] text-white/80 uppercase tracking-wider leading-none mt-0.5">{month}</p>
        </div>

        {/* Title on image */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <span className="inline-block px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-full text-[9px] font-mono font-semibold text-white uppercase tracking-wider mb-2">
            {ticket.category}
          </span>
          <h3 className="font-display text-xl md:text-2xl font-bold text-white tracking-tighter leading-tight line-clamp-2">
            {ticket.event_title}
          </h3>
        </div>
      </div>

      {/* Perforated divider */}
      <div className="relative h-0">
        <div className="absolute -left-3 top-0 -translate-y-1/2 w-6 h-6 rounded-full bg-bg" />
        <div className="absolute -right-3 top-0 -translate-y-1/2 w-6 h-6 rounded-full bg-bg" />
        <div className="absolute left-4 right-4 top-0 border-t border-dashed border-border" />
      </div>

      {/* Body: ticket details */}
      <div className="p-5">
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-1">Venue</p>
            <p className="font-semibold text-sm text-text line-clamp-1">{ticket.venue}</p>
            <p className="text-xs text-text-muted">{ticket.city}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-1">Type</p>
            <p className="font-semibold text-sm text-text line-clamp-1">{ticket.ticket_type}</p>
            {ticket.section && (
              <p className="text-xs text-text-muted">{ticket.section}{ticket.seat ? ` · ${ticket.seat}` : ''}</p>
            )}
          </div>
          <div>
            <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-1">Ticket code</p>
            <p className="font-mono text-xs text-text font-semibold">{ticket.qr_hash}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-1">Paid</p>
            <p className="font-display text-sm font-bold text-text">
              {formatCurrency(ticket.price).replace('.00', '')}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onViewQR?.(ticket)}
            className="flex flex-col items-center justify-center gap-1 h-16 bg-surface-2 hover:bg-surface-3 rounded-xl border border-border transition-colors"
          >
            <QrCode size={16} className="text-text" strokeWidth={2} />
            <span className="text-[11px] font-semibold text-text">QR Code</span>
          </button>
          
          <button
            onClick={() => onTransfer?.(ticket)}
            disabled={!ticket.transferable}
            className="flex flex-col items-center justify-center gap-1 h-16 bg-surface-2 hover:bg-surface-3 rounded-xl border border-border transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowRightLeft size={16} className="text-text" strokeWidth={2} />
            <span className="text-[11px] font-semibold text-text">Transfer</span>
          </button>
          
          <button
            onClick={() => onResell?.(ticket)}
            disabled={!ticket.resellable}
            className="flex flex-col items-center justify-center gap-1 h-16 bg-electric hover:bg-electric-deep rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Tag size={16} className="text-white" strokeWidth={2} />
            <span className="text-[11px] font-semibold text-white">Resell</span>
          </button>
        </div>

        {/* Protection footer */}
        <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
          <Shield size={12} className="text-electric flex-shrink-0" strokeWidth={2.5} />
          <p className="text-[11px] text-text-muted leading-snug">
            Protected by <span className="font-semibold text-text">Gigabyte Protect</span> — fraud-proof transfers, escrow-secured resales.
          </p>
          <button className="ml-auto text-text-muted hover:text-text flex-shrink-0">
            <MoreHorizontal size={14} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
};
