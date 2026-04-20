import { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Loader2, Check, Sparkles, Shield, Crown, Users as UsersIcon, ArrowRight } from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../contexts/AuthContext';

const DEMO_ACCOUNTS = [
  { email: 'demo@gigabyte.co.za', name: 'Demo User', role: 'Free user', sub: 'Standard experience', icon: UserIcon, color: 'bg-surface-2' },
  { email: 'pro@gigabyte.co.za', name: 'Thabo Mokoena', role: 'Pro subscriber', sub: 'Discounts & early access', icon: Sparkles, color: 'bg-electric/10' },
  { email: 'premium@gigabyte.co.za', name: 'Lerato Khumalo', role: 'Premium', sub: 'Members-only events', icon: Crown, color: 'bg-gold/10' },
  { email: 'organizer@gigabyte.co.za', name: 'Sipho Dlamini', role: 'Organizer', sub: 'Manages events', icon: UsersIcon, color: 'bg-success/10' },
  { email: 'admin@gigabyte.co.za', name: 'Mo Moshoane', role: 'Platform admin', sub: 'Full admin console', icon: Shield, color: 'bg-error/10' },
];
const DEMO_PASSWORD = 'Gigabyte2026!';

interface AuthModalProps {
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal = ({ onClose, initialMode = 'signin' }: AuthModalProps) => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'demo'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [accountType, setAccountType] = useState<'attendee' | 'organizer'>('attendee');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [demoSigningIn, setDemoSigningIn] = useState<string | null>(null);
  const [signupStep, setSignupStep] = useState<'choose_type' | 'details'>('choose_type');

  const handleDemoSignIn = async (demoEmail: string) => {
    setError(null);
    setDemoSigningIn(demoEmail);
    const { error } = await signIn(demoEmail, DEMO_PASSWORD);
    if (error) {
      setError(`Couldn't sign in as ${demoEmail}. Make sure demo-users.sql has been run in Supabase. (${error})`);
      setDemoSigningIn(null);
    } else {
      // If signing in as admin, redirect to admin console
      if (demoEmail === 'admin@gigabyte.co.za') {
        window.location.hash = '#admin';
      }
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setError('Please enter your name.');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, fullName);
      if (error) {
        setError(error);
      } else {
        // Flag the intent so the dashboard can prompt an organizer application
        if (accountType === 'organizer') {
          sessionStorage.setItem('gigabyte-pending-organizer-application', '1');
        }
        setSuccessMessage(
          accountType === 'organizer'
            ? "Account created! Complete your organizer application on the next screen."
            : "Account created! You're all set."
        );
        setTimeout(() => { onClose(); }, 1500);
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) setError(error);
      else onClose();
    }
    setLoading(false);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-5 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-surface border border-border rounded-t-3xl md:rounded-3xl w-full md:max-w-md max-h-[95vh] overflow-y-auto animate-scale-in"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 bg-surface-2 rounded-full flex items-center justify-center hover:bg-surface-3 transition-colors z-10"
        >
          <X size={16} className="text-text" strokeWidth={2} />
        </button>

        <div className="p-6 md:p-8">
          <div className="mb-6">
            <Logo size="md" />
          </div>

          {/* Mode tabs */}
          <div className="flex gap-1 p-1 bg-surface-2 border border-border rounded-full mb-6">
            <button
              onClick={() => { setMode('signin'); setError(null); setSignupStep('choose_type'); }}
              className={`flex-1 h-9 rounded-full text-xs font-semibold transition-all ${
                mode === 'signin' ? 'bg-inverse text-inverse-text' : 'text-text-muted'
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => { setMode('signup'); setError(null); setSignupStep('choose_type'); }}
              className={`flex-1 h-9 rounded-full text-xs font-semibold transition-all ${
                mode === 'signup' ? 'bg-inverse text-inverse-text' : 'text-text-muted'
              }`}
            >
              Create account
            </button>
            <button
              onClick={() => { setMode('demo'); setError(null); }}
              className={`flex-1 h-9 rounded-full text-xs font-semibold transition-all inline-flex items-center justify-center gap-1 ${
                mode === 'demo' ? 'bg-inverse text-inverse-text' : 'text-text-muted'
              }`}
            >
              <Sparkles size={10} strokeWidth={2.5} />
              Demo
            </button>
          </div>

          {mode === 'demo' ? (
            // ============ DEMO ACCOUNTS ============
            <>
              <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">
                One-click demo access
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-text tracking-tighter leading-tight mb-2">
                Try Gigabyte as any user.
              </h2>
              <p className="text-sm text-text-muted mb-6">
                Instant sign-in — no password. Each account shows a different experience.
              </p>

              {error && (
                <div className="bg-error/10 border border-error/20 rounded-xl p-3 mb-4">
                  <p className="text-xs text-error">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                {DEMO_ACCOUNTS.map((account) => {
                  const Icon = account.icon;
                  const isLoading = demoSigningIn === account.email;
                  return (
                    <button
                      key={account.email}
                      onClick={() => handleDemoSignIn(account.email)}
                      disabled={!!demoSigningIn}
                      className="w-full flex items-center gap-3 p-4 bg-surface-2 hover:bg-surface-3 border border-border rounded-2xl transition-colors text-left disabled:opacity-50 disabled:cursor-wait"
                    >
                      <div className={`w-10 h-10 rounded-xl ${account.color} flex items-center justify-center flex-shrink-0`}>
                        {isLoading ? (
                          <Loader2 size={16} className="text-text animate-spin" strokeWidth={2} />
                        ) : (
                          <Icon size={16} className="text-text" strokeWidth={2} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <p className="font-display font-bold text-sm text-text line-clamp-1">{account.name}</p>
                          <span className="font-mono text-[9px] text-text-subtle uppercase tracking-wider flex-shrink-0">
                            {account.role}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted line-clamp-1 mt-0.5">
                          {account.sub} · <span className="font-mono">{account.email.split('@')[0]}</span>
                        </p>
                      </div>
                      <ArrowRight size={14} className="text-text-subtle flex-shrink-0" strokeWidth={2.5} />
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 p-4 bg-surface-2 rounded-2xl border border-border">
                <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-1">
                  Shared password
                </p>
                <p className="font-mono text-sm font-semibold text-text">Gigabyte2026!</p>
                <p className="text-[11px] text-text-muted mt-2 leading-relaxed">
                  Same password for every demo account. First-time setup: run <span className="font-mono text-text">demo-users.sql</span> in your Supabase SQL Editor.
                </p>
              </div>
            </>
          ) : successMessage ? (
            <div className="bg-success/10 border border-success/20 rounded-2xl p-5 flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                <Check size={16} className="text-success" strokeWidth={3} />
              </div>
              <div>
                <p className="font-semibold text-sm text-text mb-1">Check your inbox</p>
                <p className="text-xs text-text-muted leading-relaxed">{successMessage}</p>
              </div>
            </div>
          ) : (
            // ============ SIGN IN / SIGN UP ============
            <>
              <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">
                {mode === 'signin' ? 'Welcome back' : signupStep === 'choose_type' ? 'Create account' : `Joining as ${accountType === 'attendee' ? 'an attendee' : 'an organizer'}`}
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-text tracking-tighter leading-tight mb-6">
                {mode === 'signin'
                  ? 'Sign in to Gigabyte'
                  : signupStep === 'choose_type'
                    ? 'How will you use Gigabyte?'
                    : 'Your details.'}
              </h2>

              {mode === 'signup' && signupStep === 'choose_type' ? (
                <div className="space-y-3">
                  <button
                    onClick={() => { setAccountType('attendee'); setSignupStep('details'); }}
                    className="w-full flex items-center gap-4 p-5 bg-surface-2 hover:bg-surface-3 border border-border rounded-2xl transition-colors text-left"
                  >
                    <div className="w-11 h-11 rounded-xl bg-electric/10 flex items-center justify-center flex-shrink-0">
                      <UserIcon size={18} className="text-electric" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-bold text-base text-text">I'm an attendee</p>
                      <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                        Discover events, buy tickets, transfer and resell safely.
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => { setAccountType('organizer'); setSignupStep('details'); }}
                    className="w-full flex items-center gap-4 p-5 bg-surface-2 hover:bg-surface-3 border border-border rounded-2xl transition-colors text-left"
                  >
                    <div className="w-11 h-11 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                      <UserIcon size={18} className="text-success" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-bold text-base text-text">I'm an event organizer</p>
                      <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                        List events, sell tickets, manage attendees. Requires application review.
                      </p>
                    </div>
                  </button>
                  <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider text-center mt-5">
                    Admin access is granted by Gigabyte staff only
                  </p>
                </div>
              ) : (
                <>
                  {mode === 'signup' && (
                    <button
                      onClick={() => setSignupStep('choose_type')}
                      className="mb-4 text-xs text-text-muted hover:text-text transition-colors inline-flex items-center gap-1"
                    >
                      ← Change account type
                    </button>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="flex items-center gap-2 font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">
                      <UserIcon size={10} strokeWidth={2.5} />
                      Full name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="What should we call you?"
                      className="w-full h-12 px-4 bg-surface-2 text-text placeholder-text-subtle rounded-xl border border-border focus:border-border-strong focus:outline-none text-sm"
                      autoFocus
                    />
                  </div>
                )}

                <div>
                  <label className="flex items-center gap-2 font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">
                    <Mail size={10} strokeWidth={2.5} />
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoFocus={mode === 'signin'}
                    className="w-full h-12 px-4 bg-surface-2 text-text placeholder-text-subtle rounded-xl border border-border focus:border-border-strong focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">
                    <Lock size={10} strokeWidth={2.5} />
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
                    required
                    minLength={6}
                    className="w-full h-12 px-4 bg-surface-2 text-text placeholder-text-subtle rounded-xl border border-border focus:border-border-strong focus:outline-none text-sm"
                  />
                </div>

                {error && (
                  <div className="bg-error/10 border border-error/20 rounded-xl p-3">
                    <p className="text-xs text-error">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email || !password || (mode === 'signup' && !fullName)}
                  className="w-full h-12 bg-inverse text-inverse-text rounded-full font-semibold text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  {mode === 'signin' ? 'Sign in' : 'Create account'}
                </button>
              </form>
                </>
              )}
            </>
          )}

          <p className="mt-6 text-center font-mono text-[10px] text-text-subtle uppercase tracking-wider">
            By continuing, you agree to Gigabyte's Terms & Privacy
          </p>
        </div>
      </div>
    </div>
  );
};
