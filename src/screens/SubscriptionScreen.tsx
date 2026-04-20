import { useState } from 'react';
import { Check, Sparkles, X, Crown, User as UserIcon, Loader2, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/theme';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';
import { PaymentModal } from '../components/PaymentModal';
import { AuthModal } from '../components/AuthModal';
import { supabase } from '../services/supabase';

interface SubscriptionScreenProps {
  onClose: () => void;
}

type Tier = 'free' | 'pro' | 'premium';

const TIERS: Array<{
  id: Tier;
  name: string;
  price: number;
  tagline: string;
  benefits: string[];
  limitations: string[];
  highlighted: boolean;
  icon: typeof UserIcon;
}> = [
  {
    id: 'free',
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
    limitations: ['Standard service fees (7.5%)', 'No early-bird access'],
    highlighted: false,
    icon: UserIcon,
  },
  {
    id: 'pro',
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
    highlighted: true,
    icon: Sparkles,
  },
  {
    id: 'premium',
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
    highlighted: false,
    icon: Crown,
  },
];

export const SubscriptionScreen = ({ onClose }: SubscriptionScreenProps) => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const currentTier: Tier = profile?.subscription_tier || 'free';

  const [targetTier, setTargetTier] = useState<Tier | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showDowngrade, setShowDowngrade] = useState<Tier | null>(null);
  const [changing, setChanging] = useState(false);
  const [flash, setFlash] = useState<{ kind: 'success' | 'error'; msg: string } | null>(null);

  const tierRank = (t: Tier) => t === 'free' ? 0 : t === 'pro' ? 1 : 2;

  const handleTierClick = (tier: typeof TIERS[number]) => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    if (tier.id === currentTier) return; // no-op on current plan

    const isUpgrade = tierRank(tier.id) > tierRank(currentTier);
    if (isUpgrade) {
      setTargetTier(tier.id);
      setShowPayment(true);
    } else {
      // Downgrade — confirmation, no payment
      setShowDowngrade(tier.id);
    }
  };

  const applyTierChange = async (newTier: Tier) => {
    if (!user) return;
    const { error } = await supabase
      .from('users')
      .update({ subscription_tier: newTier })
      .eq('id', user.id);
    if (error) throw error;
    // Profile will refresh on next useUserProfile run — force with a short reload
    window.dispatchEvent(new Event('gigabyte:tier-changed'));
  };

  const confirmDowngrade = async (newTier: Tier) => {
    setChanging(true);
    try {
      await applyTierChange(newTier);
      setFlash({ kind: 'success', msg: `You're now on Gigabyte ${newTier === 'free' ? 'Free' : 'Pro'}. Changes take effect immediately.` });
      setShowDowngrade(null);
      // Simple hard reload so profile + stats re-query
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: any) {
      setFlash({ kind: 'error', msg: err?.message || 'Could not change your plan. Try again.' });
    } finally {
      setChanging(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-bg overflow-y-auto animate-fade-in">
      <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-xl border-b border-border">
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider">
              Subscription
            </p>
            <h1 className="font-display text-xl font-bold text-text tracking-tighter">
              Gigabyte {currentTier === 'free' ? 'Pro' : currentTier === 'pro' ? 'Premium' : 'Premium'}
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
              {currentTier === 'premium' ? "You're on Premium" : currentTier === 'pro' ? "You're on Pro" : 'Save more, experience more'}
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold text-text tracking-tightest leading-[0.95] text-balance mb-4">
            {currentTier === 'premium'
              ? <>Living the <br />Premium life.</>
              : <>Unlock every venue,<br />every weekend.</>}
          </h1>
          <p className="text-text-muted text-base md:text-lg max-w-2xl mx-auto">
            Exclusive discounts, early-bird access to the biggest SA events, and zero service fees. Cancel anytime.
          </p>
        </section>

        {flash && (
          <section className="mb-6 max-w-xl mx-auto">
            <div className={`rounded-2xl p-4 border flex items-start gap-3 ${
              flash.kind === 'success'
                ? 'bg-success/10 border-success/20'
                : 'bg-error/10 border-error/20'
            }`}>
              {flash.kind === 'success'
                ? <Check size={16} className="text-success flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                : <AlertCircle size={16} className="text-error flex-shrink-0 mt-0.5" strokeWidth={2.5} />}
              <p className="text-sm text-text flex-1">{flash.msg}</p>
            </div>
          </section>
        )}

        {/* Tiers */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {TIERS.map((tier, i) => {
            const isCurrent = tier.id === currentTier;
            const isUpgrade = tierRank(tier.id) > tierRank(currentTier);
            const isDowngrade = tierRank(tier.id) < tierRank(currentTier);
            const TierIcon = tier.icon;

            let ctaLabel: string;
            if (isCurrent) ctaLabel = 'Current plan';
            else if (isUpgrade) ctaLabel = tier.id === 'premium' ? 'Go Premium' : `Upgrade to ${tier.name}`;
            else ctaLabel = tier.id === 'free' ? 'Cancel subscription' : `Switch to ${tier.name}`;

            return (
              <div
                key={tier.id}
                className={`rounded-3xl p-6 md:p-7 border-2 transition-all animate-fade-up relative ${
                  isCurrent
                    ? 'bg-success/5 border-success shadow-lg'
                    : tier.highlighted
                      ? 'bg-surface border-electric shadow-2xl shadow-electric/20 md:scale-[1.02]'
                      : 'bg-surface border-border'
                }`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-2.5 py-1 bg-success rounded-full">
                    <Check size={10} className="text-white" strokeWidth={3} />
                    <span className="font-mono text-[9px] font-semibold text-white uppercase tracking-wider">
                      Your plan
                    </span>
                  </div>
                )}
                {!isCurrent && tier.highlighted && (
                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-electric rounded-full mb-3">
                    <Sparkles size={10} className="text-white" strokeWidth={2.5} />
                    <span className="font-mono text-[9px] font-semibold text-white uppercase tracking-wider">
                      Most popular
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-1">
                  <TierIcon size={16} className="text-text" strokeWidth={2.5} />
                  <h3 className="font-display text-xl font-bold text-text tracking-tighter">
                    Gigabyte {tier.name}
                  </h3>
                </div>
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
                  onClick={() => handleTierClick(tier)}
                  disabled={isCurrent || changing}
                  className={`w-full h-12 rounded-full font-semibold text-sm transition-all mb-6 inline-flex items-center justify-center gap-2 ${
                    isCurrent
                      ? 'bg-surface-2 text-text-muted cursor-default'
                      : isDowngrade
                        ? 'bg-surface-2 text-text border border-border hover:bg-surface-3'
                        : tier.highlighted
                          ? 'bg-electric text-white hover:bg-electric-deep'
                          : 'bg-inverse text-inverse-text hover:opacity-90'
                  }`}
                >
                  {changing && !isCurrent && <Loader2 size={14} className="animate-spin" />}
                  {ctaLabel}
                </button>

                <div className="space-y-2.5">
                  {tier.benefits.map((b, j) => (
                    <div key={j} className="flex items-start gap-2.5 text-sm">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isCurrent ? 'bg-success' : tier.highlighted ? 'bg-electric' : 'bg-success'
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
            );
          })}
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
              { q: 'Can I cancel anytime?', a: 'Yes. Downgrade or cancel from this screen — takes effect immediately. You keep benefits until the end of your billing period.' },
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

      {/* Auth prompt if not signed in */}
      {showAuth && <AuthModal initialMode="signin" onClose={() => setShowAuth(false)} />}

      {/* Payment modal for upgrades */}
      {showPayment && targetTier && user && (
        <PaymentModal
          mode="full"
          eventTitle={`Gigabyte ${targetTier === 'pro' ? 'Pro' : 'Premium'} subscription`}
          ticketType="Monthly plan"
          total={targetTier === 'pro' ? 49 : 99}
          onClose={() => { setShowPayment(false); setTargetTier(null); }}
          onSuccess={async () => {
            await applyTierChange(targetTier);
            setFlash({
              kind: 'success',
              msg: `Welcome to Gigabyte ${targetTier === 'pro' ? 'Pro' : 'Premium'}! Your perks are live.`,
            });
            setShowPayment(false);
            setTargetTier(null);
            setTimeout(() => window.location.reload(), 1500);
          }}
        />
      )}

      {/* Downgrade / cancel confirmation */}
      {showDowngrade && (
        <div
          onClick={() => setShowDowngrade(null)}
          className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-5 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-surface border border-border rounded-t-3xl md:rounded-3xl w-full md:max-w-md p-6 md:p-8 animate-scale-in"
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={12} className="text-electric" strokeWidth={2.5} />
              <p className="font-mono text-[10px] text-electric uppercase tracking-wider">
                Confirm change
              </p>
            </div>
            <h2 className="font-display text-2xl font-bold text-text tracking-tighter mb-3">
              {showDowngrade === 'free' ? 'Cancel your subscription?' : `Switch to Gigabyte ${showDowngrade === 'pro' ? 'Pro' : 'Premium'}?`}
            </h2>
            <p className="text-sm text-text-muted mb-5 leading-relaxed">
              {showDowngrade === 'free'
                ? `You'll lose your ${currentTier === 'premium' ? 'Premium' : 'Pro'} perks — discounts, early-bird access, and reduced service fees — immediately.`
                : `You'll move from Premium to Pro. Members-only events and zero service fees will no longer apply.`}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDowngrade(null)}
                disabled={changing}
                className="flex-1 h-12 bg-surface-2 text-text rounded-full font-semibold text-sm border border-border hover:bg-surface-3 disabled:opacity-50 transition-colors"
              >
                Keep {currentTier === 'premium' ? 'Premium' : 'Pro'}
              </button>
              <button
                onClick={() => confirmDowngrade(showDowngrade)}
                disabled={changing}
                className="flex-1 h-12 bg-inverse text-inverse-text rounded-full font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity inline-flex items-center justify-center gap-2"
              >
                {changing && <Loader2 size={14} className="animate-spin" />}
                Confirm change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
