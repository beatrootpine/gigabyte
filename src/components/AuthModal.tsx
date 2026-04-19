import { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Loader2, Check } from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal = ({ onClose, initialMode = 'signin' }: AuthModalProps) => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
        setSuccessMessage('Account created! Check your email to confirm, or sign in if confirmation is disabled.');
        setTimeout(() => { onClose(); }, 2000);
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

          <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">
            {mode === 'signin' ? 'Welcome back' : 'Create account'}
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-text tracking-tighter leading-tight mb-6">
            {mode === 'signin' ? 'Sign in to Gigabyte' : 'Join Gigabyte.'}
          </h2>

          {successMessage ? (
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
          )}

          {!successMessage && (
            <div className="mt-6 text-center">
              <button
                onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); }}
                className="text-sm text-text-muted hover:text-text transition-colors"
              >
                {mode === 'signin'
                  ? <>New here? <span className="text-text font-semibold">Create an account</span></>
                  : <>Already have an account? <span className="text-text font-semibold">Sign in</span></>
                }
              </button>
            </div>
          )}

          <p className="mt-6 text-center font-mono text-[10px] text-text-subtle uppercase tracking-wider">
            By continuing, you agree to Gigabyte's Terms & Privacy
          </p>
        </div>
      </div>
    </div>
  );
};
