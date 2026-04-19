import { Check, Sparkles, X } from 'lucide-react';
import { formatCurrency } from '../utils/theme';

interface SubscriptionScreenProps {
  onClose: () => void;
}

const TIERS = [
  {
    name: 'Free',
    price: 0,
    tagline: 'Discover events, save favourites.',
    benefits: [
      'Unlimited event discovery',
      'Save & bookmark events',
      'Secure QR tickets',
      'Transfer to friends',
      'Resell with escrow protection',
    ],
    limitations: [
      'Standard service fees (7.5%)',
      'No early-bird access',
    ],
    cta: 'Current plan',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: 49,
    tagline: 'Save on every event, all year round.',
    benefits: [
      'Everything in Free',
      'Exclusive Gigabyte discounts (up to 20% off)',
      'Early-bird access (24 hours before public)',
      'Reduced service fees (3%)',
      'Priority customer support',
      'Pay-monthly plans on any event',
    ],
    limitations: [],
    cta: 'Upgrade to Pro',
    highlighted: true,
  },
  {
    name: 'Premium',
    price: 99,
    tagline: 'For the hardcore weekend crew.',
    benefits: [
      'Everything in Pro',
      'Members-only Gigabyte events',
      'Zero service fees',
      'Free ticket transfers (no cap)',
      'Dedicated concierge',
      'Complimentary upgrade to VIP on select events',
    ],
    limitations: [],
    cta: 'Go Premium',
    highlighted: false,
  },
];

export const SubscriptionScreen = ({ onClose }: SubscriptionScreenProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-bg overflow-y-auto animate-fade-in">
      <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-xl border-b border-border">
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider">
              Subscription
            </p>
            <h1 className="font-display text-xl font-bold text-text tracking-tighter">
              Gigabyte Pro
            </h1>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-surface-2 rounded-full flex items-center justify-center hover:bg-surface-3 transition-colors"
          >
            <X size={16} className="text-text" strokeWidth={2.5} />
          </button>
        </div>
      </header>

      <main className="px-5 py-8 max-w-5xl mx-auto">
        {/* Hero */}
        <section className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-electric/10 rounded-full mb-4">
            <Sparkles size={12} className="text-electric" strokeWidth={2.5} />
            <span className="font-mono text-[10px] font-semibold text-electric uppercase tracking-wider">
              Save more, experience more
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold text-text tracking-tightest leading-[0.95] text-balance mb-4">
            Unlock every venue,<br />every weekend.
          </h1>
          <p className="text-text-muted text-base md:text-lg max-w-2xl mx-auto">
            Exclusive discounts, early-bird access to the biggest SA events, and zero service fees. Cancel anytime.
          </p>
        </section>

        {/* Tiers */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {TIERS.map((tier, i) => (
            <div
              key={i}
              className={`rounded-3xl p-6 md:p-7 border-2 transition-all animate-fade-up ${
                tier.highlighted
                  ? 'bg-surface border-electric shadow-2xl shadow-electric/20 md:scale-[1.02]'
                  : 'bg-surface border-border'
              }`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {tier.highlighted && (
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-electric rounded-full mb-3">
                  <Sparkles size={10} className="text-white" strokeWidth={2.5} />
                  <span className="font-mono text-[9px] font-semibold text-white uppercase tracking-wider">
                    Most popular
                  </span>
                </div>
              )}
              <h3 className="font-display text-xl font-bold text-text tracking-tighter mb-1">
                Gigabyte {tier.name}
              </h3>
              <p className="text-sm text-text-muted mb-5 min-h-[40px]">{tier.tagline}</p>

              <div className="mb-6">
                <span className="font-display text-5xl font-extrabold text-text tracking-tighter">
                  {tier.price === 0 ? 'Free' : formatCurrency(tier.price).replace('.00', '')}
                </span>
                {tier.price > 0 && (
                  <span className="text-text-muted text-sm ml-2">/month</span>
                )}
              </div>

              <button
                disabled={tier.price === 0}
                className={`w-full h-12 rounded-full font-semibold text-sm transition-all mb-6 ${
                  tier.highlighted
                    ? 'bg-electric text-white hover:bg-electric-deep'
                    : tier.price === 0
                    ? 'bg-surface-2 text-text-muted cursor-default'
                    : 'bg-inverse text-inverse-text hover:opacity-90'
                }`}
              >
                {tier.cta}
              </button>

              <div className="space-y-2.5">
                {tier.benefits.map((b, j) => (
                  <div key={j} className="flex items-start gap-2.5 text-sm">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      tier.highlighted ? 'bg-electric' : 'bg-success'
                    }`}>
                      <Check size={10} className="text-white" strokeWidth={3} />
                    </div>
                    <span className="text-text">{b}</span>
                  </div>
                ))}
                {tier.limitations.map((l, j) => (
                  <div key={j} className="flex items-start gap-2.5 text-sm opacity-50">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-surface-3">
                      <X size={10} className="text-text-muted" strokeWidth={3} />
                    </div>
                    <span className="text-text-muted line-through">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* FAQ */}
        <section className="mb-10 max-w-2xl mx-auto">
          <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-3 text-center">
            Frequently asked
          </p>
          <h2 className="font-display text-3xl font-bold text-text tracking-tighter mb-6 text-center">
            Questions, answered.
          </h2>
          <div className="space-y-3">
            {[
              { q: 'Can I cancel anytime?', a: 'Yes. Cancel from your profile settings. You keep Pro benefits until the end of your billing period.' },
              { q: 'How do early-bird tickets work?', a: 'Pro & Premium members see tickets 24 hours before they go public. You can buy at the pre-sale price before everyone else.' },
              { q: 'What counts as a Gigabyte-exclusive event?', a: 'Members-only shows, warehouse parties, pop-up dinners, and Homecoming curated experiences not available to free users.' },
              { q: 'Can I switch between Pro and Premium?', a: 'Yes, upgrade or downgrade anytime. Prorated automatically — no lock-ins.' },
            ].map((item, i) => (
              <details key={i} className="group bg-surface border border-border rounded-2xl overflow-hidden">
                <summary className="p-4 cursor-pointer list-none flex items-center justify-between font-semibold text-sm text-text">
                  {item.q}
                  <span className="text-text-muted group-open:rotate-45 transition-transform">＋</span>
                </summary>
                <div className="px-4 pb-4 text-sm text-text-muted leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
