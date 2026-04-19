import { X, ArrowRight, Target, BarChart3, Zap, Users } from 'lucide-react';

interface BrandMarketplaceScreenProps {
  onClose: () => void;
}

const FEATURED_BRANDS = [
  {
    name: 'Castle Lager',
    category: 'Beverages',
    logo: 'https://images.unsplash.com/photo-1608270861620-7cf25ac5f1e9?w=200',
    description: 'Official beer partner of Gigabyte. Exclusive 2-for-1 at partnered venues.',
    cta: 'Redeem offer',
    color: '#C41E3A',
  },
  {
    name: 'MTN South Africa',
    category: 'Telecom',
    logo: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=200',
    description: 'MTN Pulse subscribers get 15% off all concert tickets.',
    cta: 'Link account',
    color: '#FFC600',
  },
  {
    name: 'Superbalist',
    category: 'Fashion',
    logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200',
    description: 'Festival fits, delivered. R200 off your first order for Gigabyte users.',
    cta: 'Claim code',
    color: '#000000',
  },
  {
    name: 'Savanna',
    category: 'Beverages',
    logo: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=200',
    description: 'Buy one, get one at every Savanna-sponsored comedy show.',
    cta: 'Find events',
    color: '#2E7D32',
  },
];

export const BrandMarketplaceScreen = ({ onClose }: BrandMarketplaceScreenProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-bg overflow-y-auto animate-fade-in">
      <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-xl border-b border-border">
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider">
              For brands & sponsors
            </p>
            <h1 className="font-display text-xl font-bold text-text tracking-tighter">
              Brand marketplace
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
        <section className="mb-10">
          <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-3">
            Advertiser platform
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold text-text tracking-tightest leading-[0.95] text-balance mb-5">
            Reach verified<br />event-goers directly.
          </h1>
          <p className="text-text-muted text-base md:text-lg max-w-2xl mb-6">
            Put your brand in front of 4,800+ high-intent South African lifestyle users. Targeted by event, category, city, and spend level.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="h-12 px-6 bg-inverse text-inverse-text rounded-full font-semibold text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2">
              Become a partner <ArrowRight size={14} strokeWidth={2.5} />
            </button>
            <button className="h-12 px-6 bg-surface-2 text-text rounded-full font-semibold text-sm border border-border hover:bg-surface-3 transition-colors">
              Download media kit
            </button>
          </div>
        </section>

        {/* Value props */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {[
            { icon: Users, label: 'Active users', value: '4,892' },
            { icon: Target, label: 'Targeting dimensions', value: '14' },
            { icon: Zap, label: 'Avg CTR', value: '6.2%' },
            { icon: BarChart3, label: 'Partner brands', value: '23' },
          ].map((stat, i) => (
            <div key={i} className="bg-surface border border-border rounded-2xl p-5">
              <div className="w-9 h-9 rounded-xl bg-surface-2 flex items-center justify-center mb-4">
                <stat.icon size={14} className="text-text" strokeWidth={2} />
              </div>
              <p className="font-display text-2xl md:text-3xl font-extrabold text-text tracking-tight mb-1">
                {stat.value}
              </p>
              <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </section>

        {/* Ad products */}
        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold text-text tracking-tighter mb-6">
            Ad products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: 'Sponsored events',
                description: 'Boost your event or activation to the top of relevant Discover feeds.',
                price: 'From R2,500/day',
              },
              {
                name: 'In-app banner',
                description: 'Premium placement at the top of Discover for your target audience.',
                price: 'From R4,800/week',
              },
              {
                name: 'Targeted push',
                description: 'Send notifications to users who match your audience criteria.',
                price: 'R1.20 per notification',
              },
            ].map((product, i) => (
              <div key={i} className="bg-surface border border-border rounded-2xl p-6">
                <h3 className="font-display font-bold text-base text-text mb-2">{product.name}</h3>
                <p className="text-sm text-text-muted mb-4 leading-relaxed">{product.description}</p>
                <p className="font-mono text-sm font-semibold text-electric">{product.price}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured partner brands (for users) */}
        <section className="mb-10">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-text tracking-tighter">
              Partner offers
            </h2>
            <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider">
              For Gigabyte users
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FEATURED_BRANDS.map((brand, i) => (
              <div key={i} className="bg-surface border border-border rounded-2xl p-5 flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 border border-border"
                  style={{ background: brand.color }}
                >
                  <span className="font-display font-extrabold text-lg text-white">{brand.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <p className="font-display font-bold text-base text-text line-clamp-1">{brand.name}</p>
                    <span className="font-mono text-[9px] text-text-subtle uppercase tracking-wider flex-shrink-0">
                      {brand.category}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed line-clamp-2 mb-3">
                    {brand.description}
                  </p>
                  <button className="font-mono text-[11px] font-semibold text-electric uppercase tracking-wider inline-flex items-center gap-1 hover:opacity-80 transition-opacity">
                    {brand.cta} <ArrowRight size={11} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-electric via-electric-deep to-gold rounded-3xl p-8 md:p-12 text-center">
          <p className="font-mono text-[10px] text-white/90 uppercase tracking-wider mb-3">
            Ready to partner?
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white tracking-tightest leading-tight mb-4">
            Let's put you in front of the<br />right audience.
          </h2>
          <p className="text-white/80 text-base mb-6 max-w-xl mx-auto">
            POPIA-compliant data, transparent reporting, and real-time analytics. No impressions wasted.
          </p>
          <button className="h-12 px-8 bg-white text-ink-950 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2">
            Talk to sales <ArrowRight size={14} strokeWidth={2.5} />
          </button>
        </section>
      </main>
    </div>
  );
};
