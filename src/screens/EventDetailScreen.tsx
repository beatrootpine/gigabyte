import { useState } from 'react';
import { X, MapPin, Calendar, Clock, Users, Share2, Bookmark, Shield, Check, CreditCard } from 'lucide-react';
import { Event } from '../types';
import { formatCurrency } from '../utils/theme';
import { SmartImage } from '../components/SmartImage';

interface EventDetailScreenProps {
  event: Event;
  onClose: () => void;
}

interface TicketTier {
  name: string;
  description: string;
  price: number;
  remaining?: number;
  sold_out?: boolean;
  benefits?: string[];
}

export const EventDetailScreen = ({ event, onClose }: EventDetailScreenProps) => {
  const [selectedTier, setSelectedTier] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<'full' | 'plan'>('full');
  const [showCheckout, setShowCheckout] = useState(false);

  // Generate ticket tiers based on event pricing
  const tiers: TicketTier[] = [
    {
      name: 'General Admission',
      description: 'Standard entry ticket',
      price: event.price_min,
    },
    {
      name: 'Standard Plus',
      description: 'Priority entry + cloakroom',
      price: Math.round((event.price_min + event.price_max) / 2),
    },
    {
      name: 'VIP',
      description: 'Premium access + hospitality',
      price: event.price_max,
      benefits: ['Fast-track entry', 'VIP lounge access', 'Complimentary welcome drink', 'Dedicated host'],
    },
  ];

  const tier = tiers[selectedTier];
  const serviceFee = Math.round(tier.price * 0.075);
  const total = tier.price + serviceFee;
  const installmentPerMonth = Math.ceil(total / 3);
  const biweeklyPayment = Math.ceil(total / 6);

  const date = new Date(event.date);
  const formattedDate = date.toLocaleDateString('en-ZA', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-bg overflow-y-auto animate-fade-in">
      {/* Hero image */}
      <div className="relative h-[55vh] md:h-[60vh] overflow-hidden bg-surface-2">
        <SmartImage
          src={event.image_url}
          alt={event.title}
          seed={event.id}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-black/20" />
        
        {/* Top controls */}
        <div className="absolute top-0 left-0 right-0 px-5 py-4 flex items-center justify-between z-10">
          <button
            onClick={onClose}
            className="w-11 h-11 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <X size={18} className="text-white" strokeWidth={2.5} />
          </button>
          <div className="flex items-center gap-2">
            <button className="w-11 h-11 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/70 transition-colors">
              <Bookmark size={18} className="text-white" strokeWidth={2.5} />
            </button>
            <button className="w-11 h-11 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/70 transition-colors">
              <Share2 size={18} className="text-white" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Bottom content on hero */}
        <div className="absolute bottom-0 left-0 right-0 px-5 py-8">
          <span className="inline-block px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-mono font-semibold text-white uppercase tracking-wider mb-3">
            {event.category}
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-extrabold text-white tracking-tightest leading-[0.95] mb-3 text-balance">
            {event.title}
          </h1>
          <p className="text-white/80 text-sm md:text-base">{event.venue} · {event.city}</p>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-8 max-w-3xl mx-auto pb-32">
        {/* Key info grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          <InfoTile icon={Calendar} label="Date" value={date.toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' })} />
          <InfoTile icon={Clock} label="Time" value={event.time} />
          <InfoTile icon={MapPin} label="Venue" value={event.venue} />
          <InfoTile icon={Users} label="Capacity" value={event.capacity.toLocaleString()} />
        </div>

        {/* Description */}
        <section className="mb-10">
          <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-3">
            About
          </p>
          <p className="text-text text-base leading-relaxed">
            {event.description}
          </p>
          <p className="text-text-muted text-sm mt-3">
            Presented by <span className="font-semibold text-text">{event.organizer}</span> · {formattedDate}
          </p>
        </section>

        {/* Ticket tiers */}
        <section className="mb-10">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-text tracking-tighter">
              Ticket tiers
            </h2>
            <div className="flex items-center gap-1.5">
              <Shield size={12} className="text-electric" strokeWidth={2.5} />
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
                Verified & protected
              </span>
            </div>
          </div>
          <div className="space-y-3">
            {tiers.map((t, i) => (
              <button
                key={i}
                onClick={() => setSelectedTier(i)}
                disabled={t.sold_out}
                className={`w-full text-left p-5 rounded-2xl border transition-all ${
                  selectedTier === i
                    ? 'bg-surface border-border-strong ring-2 ring-electric'
                    : 'bg-surface border-border hover:border-border-strong'
                } ${t.sold_out ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display font-bold text-base text-text">{t.name}</h3>
                      {selectedTier === i && (
                        <div className="w-4 h-4 rounded-full bg-electric flex items-center justify-center">
                          <Check size={10} className="text-white" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-text-muted">{t.description}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="font-display text-xl font-extrabold text-text tracking-tight">
                      {formatCurrency(t.price).replace('.00', '')}
                    </p>
                  </div>
                </div>
                {t.benefits && selectedTier === i && (
                  <div className="mt-3 pt-3 border-t border-border space-y-1.5">
                    {t.benefits.map((b, j) => (
                      <div key={j} className="flex items-center gap-2 text-xs text-text-muted">
                        <Check size={11} className="text-electric flex-shrink-0" strokeWidth={2.5} />
                        {b}
                      </div>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Payment mode */}
        <section className="mb-10">
          <h2 className="font-display text-xl font-bold text-text tracking-tighter mb-4">
            How do you want to pay?
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPaymentMode('full')}
              className={`text-left p-5 rounded-2xl border transition-all ${
                paymentMode === 'full'
                  ? 'bg-surface border-border-strong ring-2 ring-electric'
                  : 'bg-surface border-border hover:border-border-strong'
              }`}
            >
              <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">Option 1</p>
              <p className="font-display font-bold text-base text-text mb-1">Pay in full</p>
              <p className="font-display text-2xl font-extrabold text-text tracking-tight mb-1">
                {formatCurrency(total).replace('.00', '')}
              </p>
              <p className="text-xs text-text-muted">Today</p>
            </button>
            <button
              onClick={() => setPaymentMode('plan')}
              className={`text-left p-5 rounded-2xl border transition-all ${
                paymentMode === 'plan'
                  ? 'bg-surface border-border-strong ring-2 ring-electric'
                  : 'bg-surface border-border hover:border-border-strong'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider">Option 2</p>
                <span className="px-1.5 py-0.5 rounded-full bg-electric/10 text-electric font-mono text-[9px] font-semibold uppercase tracking-wider">Plan</span>
              </div>
              <p className="font-display font-bold text-base text-text mb-1">3× monthly</p>
              <p className="font-display text-2xl font-extrabold text-text tracking-tight mb-1">
                {formatCurrency(installmentPerMonth).replace('.00', '')}
              </p>
              <p className="text-xs text-text-muted">per month · No interest</p>
            </button>
          </div>
          
          {paymentMode === 'plan' && (
            <div className="mt-4 p-4 bg-electric/5 border border-electric/20 rounded-2xl animate-fade-in">
              <div className="flex items-start gap-3">
                <CreditCard size={16} className="text-electric flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <div className="flex-1">
                  <p className="font-semibold text-sm text-text mb-1">How payment plans work</p>
                  <p className="text-xs text-text-muted leading-relaxed mb-3">
                    Pay {formatCurrency(installmentPerMonth).replace('.00', '')}/month for 3 months, or {formatCurrency(biweeklyPayment).replace('.00', '')} bi-weekly. Your ticket activates once fully paid. No interest, no fees — just split it.
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[1,2,3].map(n => (
                      <div key={n} className="p-2 bg-bg rounded-lg text-center border border-border">
                        <p className="font-mono text-[9px] text-text-subtle uppercase tracking-wider mb-1">Payment {n}</p>
                        <p className="font-display font-bold text-sm text-text">
                          {formatCurrency(installmentPerMonth).replace('.00', '')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Price breakdown */}
        <section className="mb-10">
          <div className="bg-surface border border-border rounded-2xl p-5">
            <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-3">
              Order summary
            </p>
            <div className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">{tier.name} × 1</span>
                <span className="text-text">{formatCurrency(tier.price).replace('.00', '')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Service fee (7.5%)</span>
                <span className="text-text">{formatCurrency(serviceFee).replace('.00', '')}</span>
              </div>
              <div className="pt-2.5 border-t border-border flex justify-between items-baseline">
                <span className="font-semibold text-text">Total</span>
                <span className="font-display text-2xl font-extrabold text-text tracking-tight">
                  {formatCurrency(total).replace('.00', '')}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Gigabyte Protect */}
        <section className="mb-10">
          <div className="bg-electric/5 border border-electric/20 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <Shield size={18} className="text-electric flex-shrink-0 mt-0.5" strokeWidth={2.5} />
              <div>
                <p className="font-display font-bold text-base text-text mb-2">
                  Gigabyte Protect on every ticket
                </p>
                <ul className="space-y-1.5 text-xs text-text-muted leading-relaxed">
                  <li className="flex gap-2"><Check size={11} className="text-electric flex-shrink-0 mt-0.5" strokeWidth={2.5} /> Encrypted QR, rotates every 30 seconds at the gate</li>
                  <li className="flex gap-2"><Check size={11} className="text-electric flex-shrink-0 mt-0.5" strokeWidth={2.5} /> Transfer to any friend — their QR, your old one dies</li>
                  <li className="flex gap-2"><Check size={11} className="text-electric flex-shrink-0 mt-0.5" strokeWidth={2.5} /> If plans change, resell safely via escrow</li>
                  <li className="flex gap-2"><Check size={11} className="text-electric flex-shrink-0 mt-0.5" strokeWidth={2.5} /> Event cancelled? Automatic full refund</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Sticky checkout bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-bg/95 backdrop-blur-xl border-t border-border">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider">
              {paymentMode === 'full' ? 'Total today' : `${formatCurrency(installmentPerMonth).replace('.00', '')}/month × 3`}
            </p>
            <p className="font-display text-xl font-extrabold text-text tracking-tight truncate">
              {paymentMode === 'full' ? formatCurrency(total).replace('.00', '') : formatCurrency(installmentPerMonth).replace('.00', '')}
            </p>
          </div>
          <button
            onClick={() => setShowCheckout(true)}
            className="h-12 px-8 bg-inverse text-inverse-text rounded-full font-semibold text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            {paymentMode === 'full' ? 'Buy now' : 'Start plan'}
          </button>
        </div>
      </div>

      {/* Checkout success (demo) */}
      {showCheckout && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md flex items-center justify-center p-5 animate-fade-in">
          <div className="bg-surface border border-border rounded-3xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-5">
              <Check size={28} className="text-success" strokeWidth={3} />
            </div>
            <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">
              Payment successful
            </p>
            <h2 className="font-display text-2xl font-bold text-text tracking-tighter mb-3">
              You're going!
            </h2>
            <p className="text-sm text-text-muted mb-6">
              Your ticket for <span className="font-semibold text-text">{event.title}</span> is in your wallet.
            </p>
            <button
              onClick={() => { setShowCheckout(false); onClose(); }}
              className="w-full h-12 bg-inverse text-inverse-text rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              View ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoTile = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="bg-surface border border-border rounded-2xl p-4">
    <div className="flex items-center gap-2 mb-2">
      <Icon size={12} className="text-text-subtle" strokeWidth={2.5} />
      <span className="font-mono text-[9px] text-text-subtle uppercase tracking-wider">{label}</span>
    </div>
    <p className="font-display font-bold text-sm text-text line-clamp-1">{value}</p>
  </div>
);
