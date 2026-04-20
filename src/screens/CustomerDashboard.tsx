import { useState, useEffect } from 'react';
import { Sparkles, Building2, Shield, ArrowRight, User as UserIcon, Ticket, Bookmark, LogOut, Mail, Crown, Clock, XCircle } from 'lucide-react';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';
import { AuthModal } from '../components/AuthModal';
import { OrganizerApplicationModal } from '../components/OrganizerApplicationModal';
import { SubscriptionScreen } from './SubscriptionScreen';
import { BrandMarketplaceScreen } from './BrandMarketplaceScreen';
import { OrganizerConsole } from './OrganizerConsole';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';
import { organizerApplicationsService } from '../services/supabase';

export const CustomerDashboard = () => {
  const { user, loading, signOut } = useAuth();
  const { profile } = useUserProfile();
  const [showSubscription, setShowSubscription] = useState(false);
  const [showBrands, setShowBrands] = useState(false);
  const [showOrganizer, setShowOrganizer] = useState(false);
  const [showAuth, setShowAuth] = useState<false | 'signin' | 'signup'>(false);
  const [showApplication, setShowApplication] = useState(false);
  const [application, setApplication] = useState<any>(null);
  const [appLoading, setAppLoading] = useState(false);

  const fullName = profile?.full_name || (user?.user_metadata?.full_name as string) || '';
  const firstName = fullName.split(' ')[0] || user?.email?.split('@')[0] || '';
  const tier = profile?.subscription_tier || 'free';
  const role = profile?.role || 'user';

  // Load any existing organizer application for this user
  const refreshApplication = async () => {
    if (!user) { setApplication(null); return; }
    setAppLoading(true);
    try {
      const app = await organizerApplicationsService.getMine(user.id);
      setApplication(app);
    } catch {
      setApplication(null);
    } finally {
      setAppLoading(false);
    }
  };

  useEffect(() => {
    refreshApplication();
  }, [user]);

  // If signup flagged organizer intent, auto-open the application modal
  useEffect(() => {
    if (
      user &&
      profile &&
      role === 'user' &&
      !application &&
      !appLoading &&
      sessionStorage.getItem('gigabyte-pending-organizer-application') === '1'
    ) {
      setShowApplication(true);
    }
  }, [user, profile, role, application, appLoading]);

  return (
    <div className="min-h-screen bg-bg pb-28">
      <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-xl border-b border-border">
        <div className="px-5 py-4 flex items-center justify-between">
          <Logo size="md" />
          <ThemeToggle />
        </div>
      </header>

      <main className="px-5 py-6">
        {loading ? (
          <LoadingState />
        ) : user ? (
          <AuthedDashboard
            firstName={firstName}
            email={user.email || ''}
            tier={tier}
            role={role}
            application={application}
            onOpenSubscription={() => setShowSubscription(true)}
            onOpenBrands={() => setShowBrands(true)}
            onOpenOrganizer={() => setShowOrganizer(true)}
            onApplyOrganizer={() => setShowApplication(true)}
            onSignOut={signOut}
          />
        ) : (
          <LoggedOutDashboard
            onSignIn={() => setShowAuth('signin')}
            onSignUp={() => setShowAuth('signup')}
            onOpenSubscription={() => setShowSubscription(true)}
            onOpenBrands={() => setShowBrands(true)}
          />
        )}
      </main>

      {showSubscription && <SubscriptionScreen onClose={() => setShowSubscription(false)} />}
      {showBrands && <BrandMarketplaceScreen onClose={() => setShowBrands(false)} />}
      {showOrganizer && <OrganizerConsole onClose={() => setShowOrganizer(false)} />}
      {showApplication && (
        <OrganizerApplicationModal
          onClose={() => setShowApplication(false)}
          onSubmitted={refreshApplication}
        />
      )}
      {showAuth && <AuthModal initialMode={showAuth} onClose={() => setShowAuth(false)} />}
    </div>
  );
};

const LoadingState = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-20 bg-surface-2 rounded-2xl" />
    <div className="h-40 bg-surface-2 rounded-2xl" />
    <div className="h-32 bg-surface-2 rounded-2xl" />
  </div>
);

// ============== AUTHED DASHBOARD ==============
const AuthedDashboard = ({
  firstName,
  email,
  tier,
  role,
  application,
  onOpenSubscription,
  onOpenBrands,
  onOpenOrganizer,
  onApplyOrganizer,
  onSignOut,
}: {
  firstName: string;
  email: string;
  tier: 'free' | 'pro' | 'premium';
  role: 'user' | 'organizer' | 'admin';
  application: any;
  onOpenSubscription: () => void;
  onOpenBrands: () => void;
  onOpenOrganizer: () => void;
  onApplyOrganizer: () => void;
  onSignOut: () => void;
}) => {
  // These will be real queries once tickets exist. Start at 0 for new users.
  const stats = [
    { label: 'Tickets', value: '0', sub: 'In your wallet' },
    { label: 'Spent', value: 'R0', sub: 'This year' },
    { label: 'Upcoming', value: '0', sub: 'Events booked' },
    { label: 'Saved', value: '0', sub: 'Bookmarked events' },
  ];

  const tierConfig = {
    free: { label: 'Free', icon: UserIcon, classes: 'bg-surface-2 text-text-muted' },
    pro: { label: 'Pro', icon: Sparkles, classes: 'bg-electric/10 text-electric' },
    premium: { label: 'Premium', icon: Crown, classes: 'bg-gold/10 text-gold' },
  }[tier];
  const TierIcon = tierConfig.icon;

  return (
    <>
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider">
            Your dashboard
          </p>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono uppercase tracking-wider ${tierConfig.classes}`}>
            <TierIcon size={9} strokeWidth={2.5} />
            Gigabyte {tierConfig.label}
          </span>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono uppercase tracking-wider bg-surface-2 text-text-muted`}>
            {role === 'user' ? 'Attendee' : role === 'organizer' ? 'Organizer' : 'Admin'}
          </span>
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-extrabold text-text tracking-tightest leading-[0.95] capitalize">
          Welcome{firstName ? `, ${firstName}` : ''}.
        </h1>
        <p className="text-text-muted text-sm md:text-base mt-3 max-w-md">
          Ready to find your next night out? Discover events and book in seconds.
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-surface border border-border rounded-2xl p-4 md:p-5">
            <p className="font-mono text-[9px] text-text-subtle uppercase tracking-wider mb-2.5">
              {stat.label}
            </p>
            <p className="font-display text-2xl md:text-3xl font-extrabold text-text tracking-tight leading-none mb-1.5">
              {stat.value}
            </p>
            <p className="text-[11px] text-text-muted">{stat.sub}</p>
          </div>
        ))}
      </section>

      {/* Empty state encouragement */}
      <section className="mb-8 bg-surface border border-border rounded-3xl p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto mb-4">
          <Ticket size={22} className="text-text-muted" strokeWidth={2} />
        </div>
        <h3 className="font-display text-lg font-bold text-text tracking-tighter mb-2">
          No tickets yet
        </h3>
        <p className="text-sm text-text-muted mb-5 max-w-xs mx-auto">
          Head to Discover to find something worth your Friday night.
        </p>
      </section>

      {/* Pro upsell — only for free tier */}
      {tier === 'free' && (
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
      )}

      {/* Premium upsell — only for Pro tier */}
      {tier === 'pro' && (
        <section className="mb-8">
          <div className="relative rounded-3xl overflow-hidden bg-surface border-2 border-gold p-6 md:p-7">
            <div className="flex items-center gap-2 mb-3">
              <Crown size={14} className="text-gold" strokeWidth={2.5} />
              <p className="font-mono text-[10px] text-gold uppercase tracking-wider">
                Go Premium
              </p>
            </div>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-text tracking-tighter mb-3 leading-tight max-w-sm">
              Unlock members-only events.
            </h3>
            <p className="text-text-muted text-sm mb-5 max-w-sm">
              Priority concierge, zero service fees, free transfers, complimentary VIP upgrades.
            </p>
            <button
              onClick={onOpenSubscription}
              className="h-11 px-5 bg-gold text-ink-950 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              Upgrade to Premium <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </div>
        </section>
      )}

      {/* Organizer panel — only for approved organizers */}
      {role === 'organizer' && (
        <section className="mb-8">
          <div className="bg-success/5 border border-success/20 rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Building2 size={14} className="text-success" strokeWidth={2.5} />
              <p className="font-mono text-[10px] text-success uppercase tracking-wider">
                Organizer tools
              </p>
            </div>
            <h3 className="font-display text-xl font-bold text-text tracking-tighter mb-2">
              Manage your events
            </h3>
            <p className="text-sm text-text-muted mb-4 max-w-md">
              Create listings, track ticket sales, broadcast updates to attendees and view revenue reports.
            </p>
            <button
              onClick={onOpenOrganizer}
              className="h-11 px-5 bg-success text-white rounded-full font-semibold text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              Open organizer console <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </div>
        </section>
      )}

      {/* Application status card — for attendees with a pending or rejected application */}
      {role === 'user' && application && application.status === 'pending' && (
        <section className="mb-8">
          <div className="bg-electric/5 border border-electric/20 rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={14} className="text-electric" strokeWidth={2.5} />
              <p className="font-mono text-[10px] text-electric uppercase tracking-wider">
                Application under review
              </p>
            </div>
            <h3 className="font-display text-xl font-bold text-text tracking-tighter mb-2">
              We're reviewing your organizer application
            </h3>
            <p className="text-sm text-text-muted mb-2 max-w-md">
              Our team verifies every organizer within 1–2 business days. You'll get an email when a decision is made.
            </p>
            <p className="text-xs text-text-subtle font-mono">
              Submitted {new Date(application.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
              {application.company_name && ` · ${application.company_name}`}
            </p>
          </div>
        </section>
      )}

      {role === 'user' && application && application.status === 'rejected' && (
        <section className="mb-8">
          <div className="bg-error/5 border border-error/20 rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <XCircle size={14} className="text-error" strokeWidth={2.5} />
              <p className="font-mono text-[10px] text-error uppercase tracking-wider">
                Application not approved
              </p>
            </div>
            <h3 className="font-display text-xl font-bold text-text tracking-tighter mb-2">
              Your organizer application wasn't approved
            </h3>
            {application.review_notes && (
              <p className="text-sm text-text-muted mb-3 max-w-md italic">
                "{application.review_notes}"
              </p>
            )}
            <p className="text-sm text-text-muted mb-4 max-w-md">
              You can still use Gigabyte as an attendee. Contact support if you'd like to appeal.
            </p>
            <button
              onClick={onApplyOrganizer}
              className="h-11 px-5 bg-surface-2 text-text rounded-full font-semibold text-sm border border-border hover:bg-surface-3 transition-colors"
            >
              Submit a new application
            </button>
          </div>
        </section>
      )}

      {/* Apply to be an organizer — for attendees without an application yet */}
      {role === 'user' && !application && (
        <section className="mb-8">
          <button
            onClick={onApplyOrganizer}
            className="w-full bg-surface border border-border rounded-2xl p-5 text-left hover:bg-surface-2 transition-colors flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
              <Building2 size={16} className="text-success" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-sm text-text">Host events on Gigabyte?</p>
              <p className="text-xs text-text-muted mt-0.5">Apply to become an organizer — reviewed in 1–2 days.</p>
            </div>
            <ArrowRight size={16} className="text-text-subtle flex-shrink-0" strokeWidth={2} />
          </button>
        </section>
      )}

      {/* Admin panel link */}
      {role === 'admin' && (
        <section className="mb-8">
          <button
            onClick={() => { window.location.hash = '#admin'; }}
            className="w-full bg-error/5 border border-error/20 rounded-3xl p-6 text-left hover:bg-error/10 transition-colors"
          >
            <div className="flex items-center gap-2 mb-3">
              <Shield size={14} className="text-error" strokeWidth={2.5} />
              <p className="font-mono text-[10px] text-error uppercase tracking-wider">
                Admin access
              </p>
            </div>
            <h3 className="font-display text-xl font-bold text-text tracking-tighter mb-2">
              Open admin console
            </h3>
            <p className="text-sm text-text-muted mb-4 max-w-md">
              Platform-wide analytics, event management, user moderation and audit logs.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-error">
              Enter admin <ArrowRight size={14} strokeWidth={2.5} />
            </span>
          </button>
        </section>
      )}

      {/* Account section */}
      <section className="mb-8">
        <h2 className="font-display text-lg font-bold text-text tracking-tighter mb-4">
          Account
        </h2>
        <div className="bg-surface border border-border rounded-2xl overflow-hidden divide-y divide-border">
          <div className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric to-gold flex items-center justify-center flex-shrink-0">
              <span className="font-display font-bold text-sm text-white">
                {(firstName || email)[0]?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-text line-clamp-1">{firstName || 'Member'}</p>
              <p className="text-xs text-text-muted line-clamp-1 flex items-center gap-1">
                <Mail size={10} strokeWidth={2} />
                {email}
              </p>
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="w-full flex items-center gap-3 p-4 hover:bg-surface-2 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center flex-shrink-0">
              <LogOut size={14} className="text-error" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-error">Sign out</p>
              <p className="text-xs text-text-muted mt-0.5">You'll need to sign in again</p>
            </div>
          </button>
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

// ============== LOGGED-OUT DASHBOARD ==============
const LoggedOutDashboard = ({
  onSignIn,
  onSignUp,
  onOpenSubscription,
  onOpenBrands,
}: {
  onSignIn: () => void;
  onSignUp: () => void;
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

      <section className="mb-6">
        <div className="bg-surface border border-border rounded-3xl p-6">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 rounded-full bg-surface-2 border border-border flex items-center justify-center flex-shrink-0">
              <UserIcon size={18} className="text-text-muted" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-base text-text">Not signed in</p>
              <p className="text-xs text-text-muted mt-0.5">Create an account or log in to continue</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onSignIn}
              className="flex-1 h-11 bg-inverse text-inverse-text rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Sign in
            </button>
            <button
              onClick={onSignUp}
              className="flex-1 h-11 bg-surface-2 text-text rounded-full font-semibold text-sm border border-border hover:bg-surface-3 transition-colors"
            >
              Create account
            </button>
          </div>
        </div>
      </section>

      {/* Demo accounts entry */}
      <section className="mb-8">
        <button
          onClick={onSignIn}
          className="w-full bg-gradient-to-br from-electric/10 to-gold/10 border border-electric/20 rounded-3xl p-5 text-left hover:from-electric/15 hover:to-gold/15 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-electric/20 flex items-center justify-center flex-shrink-0">
              <Sparkles size={18} className="text-electric" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-sm text-text">Try a demo account</p>
              <p className="text-xs text-text-muted mt-0.5">
                One-click sign in as Free, Pro, Premium, Organizer or Admin.
              </p>
            </div>
            <ArrowRight size={16} className="text-text flex-shrink-0" strokeWidth={2} />
          </div>
        </button>
      </section>

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
