import { useState } from 'react';
import { Sparkles, Building2, Shield, ArrowRight, User, Ticket, Bookmark } from 'lucide-react';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';
import { SubscriptionScreen } from './SubscriptionScreen';
import { BrandMarketplaceScreen } from './BrandMarketplaceScreen';

export const CustomerDashboard = () => {
  const [showSubscription, setShowSubscription] = useState(false);
  const [showBrands, setShowBrands] = useState(false);

  // No auth wired yet — show logged-out state.
  // Once Supabase auth is live, swap this for: session?.user ? <AuthedDashboard/> : <LoggedOutDashboard/>
  const isAuthed = false;

  return (
    <div className="min-h-screen bg-bg pb-28">
      <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-xl border-b border-border">
        <div className="px-5 py-4 flex items-center justify-between">
          <Logo size="md" />
          <ThemeToggle />
        </div>
      </header>

      <main className="px-5 py-6">
        {!isAuthed ? (
          <LoggedOutDashboard
            onOpenSubscription={() => setShowSubscription(true)}
            onOpenBrands={() => setShowBrands(true)}
          />
        ) : null}
      </main>

      {showSubscription && <SubscriptionScreen onClose={() => setShowSubscription(false)} />}
      {showBrands && <BrandMarketplaceScreen onClose={() => setShowBrands(false)} />}
    </div>
  );
};

const LoggedOutDashboard = ({
  onOpenSubscription,
  onOpenBrands,
}: {
  onOpenSubscription: () => void;
  onOpenBrands: () => void;
}) => {
  return (
    <>
      <section className="mb-8">
        <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">
          Your account
        </p>
        <h1 className="font-display text-3xl md:text-5xl font-extrabold text-text tracking-tightest leading-[0.95]">
          Sign in to see your activity.
        </h1>
        <p className="text-text-muted text-sm md:text-base mt-3 max-w-md">
          Track your tickets, see upcoming events, and unlock member-only perks.
        </p>
      </section>

      {/* Sign in card */}
      <section className="mb-8">
        <div className="bg-surface border border-border rounded-3xl p-6">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 rounded-full bg-surface-2 border border-border flex items-center justify-center flex-shrink-0">
              <User size={18} className="text-text-muted" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-base text-text">Not signed in</p>
              <p className="text-xs text-text-muted mt-0.5">Create an account or log in to continue</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              disabled
              className="flex-1 h-11 bg-inverse text-inverse-text rounded-full font-semibold text-sm opacity-60 cursor-not-allowed"
            >
              Sign in
            </button>
            <button
              disabled
              className="flex-1 h-11 bg-surface-2 text-text rounded-full font-semibold text-sm border border-border opacity-60 cursor-not-allowed"
            >
              Create account
            </button>
          </div>
          <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider text-center mt-3">
            Auth coming soon
          </p>
        </div>
      </section>

      {/* Pro upsell */}
      <section className="mb-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-electric via-electric-deep to-gold p-6 md:p-7">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-white" strokeWidth={2.5} />
            <p className="font-mono text-[10px] text-white/90 uppercase tracking-wider">
              Gigabyte Pro
            </p>
          </div>
          <h3 className="font-display text-2xl md:text-3xl font-bold text-white tracking-tighter mb-3 leading-tight max-w-sm">
            Save on every event.
          </h3>
          <p className="text-white/80 text-sm mb-5 max-w-sm">
            Exclusive discounts, early-bird access, and zero service fees from R49/month.
          </p>
          <button
            onClick={onOpenSubscription}
            className="h-11 px-5 bg-white text-ink-950 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            See plans <ArrowRight size={14} strokeWidth={2.5} />
          </button>
        </div>
      </section>

      {/* What you'll get */}
      <section className="mb-8">
        <h2 className="font-display text-lg font-bold text-text tracking-tighter mb-4">
          What you'll unlock
        </h2>
        <div className="space-y-2">
          {[
            { icon: Ticket, label: 'All your tickets in one wallet', sub: 'Secure QR, transfer in one tap' },
            { icon: Bookmark, label: 'Saved events & personal recommendations', sub: 'Based on your taste' },
            { icon: Shield, label: 'Protected transfers and resales', sub: 'Escrow-backed, no fraud' },
            { icon: Sparkles, label: 'Early-bird access to the biggest shows', sub: 'Pro members book first' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 bg-surface border border-border rounded-2xl p-4">
              <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center flex-shrink-0">
                <item.icon size={16} className="text-text" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-text">{item.label}</p>
                <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand marketplace teaser */}
      <section>
        <button
          onClick={onOpenBrands}
          className="w-full bg-surface border border-border rounded-2xl p-5 text-left hover:bg-surface-2 transition-colors flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center flex-shrink-0">
            <Building2 size={16} className="text-text" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-semibold text-sm text-text">Are you a brand?</p>
            <p className="text-xs text-text-muted mt-0.5">Reach verified event-goers on Gigabyte.</p>
          </div>
          <ArrowRight size={16} className="text-text-subtle flex-shrink-0" strokeWidth={2} />
        </button>
      </section>
    </>
  );
};
