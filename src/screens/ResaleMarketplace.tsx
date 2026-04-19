import { useState } from 'react';
import { Shield, Check, Star, ArrowRight } from 'lucide-react';
import { MOCK_RESALE_LISTINGS, ResaleListing, formatDateShort } from '../utils/mockData';
import { formatCurrency } from '../utils/theme';
import { SmartImage } from '../components/SmartImage';

interface ResaleMarketplaceProps {
  cityFilter?: string;
  categoryFilter?: string | null;
}

export const ResaleMarketplace = ({ cityFilter, categoryFilter }: ResaleMarketplaceProps) => {
  const [selectedListing, setSelectedListing] = useState<ResaleListing | null>(null);

  const listings = MOCK_RESALE_LISTINGS.filter(l => {
    if (cityFilter && l.city !== cityFilter) return false;
    if (categoryFilter && l.category !== categoryFilter) return false;
    return true;
  });

  return (
    <>
      <section className="mb-10">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-display text-2xl font-bold text-text tracking-tighter">
                Resale marketplace
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-electric/10 rounded-full">
                <Shield size={10} className="text-electric" strokeWidth={2.5} />
                <span className="font-mono text-[9px] font-semibold text-electric uppercase tracking-wider">
                  Verified
                </span>
              </span>
            </div>
            <p className="text-sm text-text-muted">
              Face-value resales from real fans. Every ticket escrow-protected.
            </p>
          </div>
        </div>

        {listings.length === 0 ? (
          <div className="bg-surface border border-border rounded-2xl p-10 text-center">
            <p className="text-text-muted text-sm">No resale listings in this city/category right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map(listing => (
              <ResaleCard key={listing.id} listing={listing} onClick={() => setSelectedListing(listing)} />
            ))}
          </div>
        )}
      </section>

      {selectedListing && <ResaleBuyModal listing={selectedListing} onClose={() => setSelectedListing(null)} />}
    </>
  );
};

const ResaleCard = ({ listing, onClick }: { listing: ResaleListing; onClick: () => void }) => {
  const { day, month, weekday } = formatDateShort(listing.date);
  const discount = Math.round(((listing.original_price - listing.resale_price) / listing.original_price) * 100);

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer animate-fade-up"
    >
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-surface-2 mb-4">
        <SmartImage
          src={listing.event_image}
          alt={listing.event_title}
          seed={listing.id}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-electric/90 backdrop-blur-md rounded-full">
          <Shield size={10} className="text-white" strokeWidth={2.5} />
          <span className="font-mono text-[9px] font-semibold text-white uppercase tracking-wider">
            Verified resale
          </span>
        </div>

        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md rounded-lg px-2.5 py-1.5 text-center">
          <p className="font-mono text-[9px] text-white/80 uppercase tracking-wider leading-none mb-0.5">{weekday}</p>
          <p className="font-display font-bold text-lg text-white leading-none">{day}</p>
          <p className="font-mono text-[9px] text-white/80 uppercase tracking-wider leading-none mt-0.5">{month}</p>
        </div>

        {discount > 0 && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-success rounded-full">
            <span className="font-mono text-[9px] font-semibold text-white uppercase tracking-wider">
              {discount}% off face value
            </span>
          </div>
        )}
      </div>

      <div className="px-1">
        <h3 className="font-display font-semibold text-base text-text tracking-super-tight leading-tight line-clamp-2 mb-2">
          {listing.event_title}
        </h3>
        <p className="text-xs text-text-muted mb-3 line-clamp-1">
          {listing.ticket_type}{listing.section ? ` · ${listing.section}` : ''}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-display font-bold text-base text-text">
              {formatCurrency(listing.resale_price).replace('.00', '')}
            </p>
            {discount > 0 && (
              <p className="font-mono text-[10px] text-text-subtle line-through">
                {formatCurrency(listing.original_price).replace('.00', '')}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-text-muted">
            <Star size={11} className="fill-gold text-gold" strokeWidth={0} />
            <span>{listing.seller_rating}</span>
            <span className="text-text-subtle">· {listing.seller_name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResaleBuyModal = ({ listing, onClose }: { listing: ResaleListing; onClose: () => void }) => {
  const [step, setStep] = useState<'review' | 'bought'>('review');
  const fee = Math.round(listing.resale_price * 0.075);
  const total = listing.resale_price + fee;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-5 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface border border-border rounded-t-3xl md:rounded-3xl w-full md:max-w-md max-h-[90vh] overflow-y-auto animate-scale-in p-6 md:p-8"
      >
        {step === 'review' && (
          <>
            <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">Buy from resale</p>
            <h2 className="font-display text-2xl font-bold text-text tracking-tighter mb-4">
              {listing.event_title}
            </h2>

            <div className="bg-surface-2 rounded-2xl p-4 space-y-3 mb-5">
              <div className="flex items-start gap-3">
                <SmartImage src={listing.event_image} alt={listing.event_title} seed={listing.id} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-text line-clamp-1">{listing.ticket_type}</p>
                  <p className="text-xs text-text-muted line-clamp-1">
                    {listing.section || 'General'} · {listing.venue}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-text-muted">
                    <Star size={10} className="fill-gold text-gold" strokeWidth={0} />
                    <span>{listing.seller_rating} · Seller: {listing.seller_name}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface-2 rounded-2xl p-4 space-y-2.5 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Ticket price</span>
                <span className="text-text">{formatCurrency(listing.resale_price).replace('.00', '')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Service fee (7.5%)</span>
                <span className="text-text">{formatCurrency(fee).replace('.00', '')}</span>
              </div>
              <div className="pt-2.5 border-t border-border flex justify-between items-baseline">
                <span className="font-semibold text-text">Total</span>
                <span className="font-display text-xl font-extrabold text-text">{formatCurrency(total).replace('.00', '')}</span>
              </div>
            </div>

            <div className="bg-electric/5 border border-electric/20 rounded-2xl p-4 mb-6 flex items-start gap-3">
              <Shield size={16} className="text-electric flex-shrink-0 mt-0.5" strokeWidth={2.5} />
              <div>
                <p className="font-semibold text-sm text-text mb-1">100% buyer protection</p>
                <p className="text-xs text-text-muted leading-relaxed">
                  Your money sits in Gigabyte escrow. The seller's QR is revoked and a fresh, verified one is issued to you before they get paid.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 h-12 bg-surface-2 text-text rounded-full font-semibold text-sm hover:bg-surface-3 transition-colors">
                Cancel
              </button>
              <button onClick={() => setStep('bought')} className="flex-1 h-12 bg-inverse text-inverse-text rounded-full font-semibold text-sm hover:opacity-90 transition-opacity">
                Pay {formatCurrency(total).replace('.00', '')}
              </button>
            </div>
          </>
        )}

        {step === 'bought' && (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-5">
              <Check size={28} className="text-success" strokeWidth={3} />
            </div>
            <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">Verified ticket issued</p>
            <h2 className="font-display text-2xl font-bold text-text tracking-tighter mb-3">You're in.</h2>
            <p className="text-sm text-text-muted mb-6 max-w-sm mx-auto">
              A fresh QR code has been added to your wallet. {listing.seller_name}'s ticket is now revoked. Payment releases to them in 24 hours.
            </p>
            <button onClick={onClose} className="inline-flex items-center gap-2 h-12 px-8 bg-inverse text-inverse-text rounded-full font-semibold text-sm hover:opacity-90 transition-opacity">
              View in wallet <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
