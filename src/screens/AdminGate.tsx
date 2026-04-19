import { useState } from 'react';
import { Shield, Lock, ArrowLeft } from 'lucide-react';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';

interface AdminGateProps {
  onAuthed: () => void;
  onExit: () => void;
}

// Demo access code — in production this would be replaced by Supabase auth
// checking users.role = 'admin' on a real session
const DEMO_ADMIN_CODE = 'gigabyte-admin-2026';

export const AdminGate = ({ onAuthed, onExit }: AdminGateProps) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Small delay to feel real
    await new Promise(r => setTimeout(r, 500));
    
    if (code.trim() === DEMO_ADMIN_CODE) {
      sessionStorage.setItem('gigabyte-admin-session', 'authed');
      onAuthed();
    } else {
      setError('Invalid access code. Contact a platform administrator.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <header className="px-5 py-4 flex items-center justify-between border-b border-border">
        <button
          onClick={onExit}
          className="flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-text transition-colors"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          Back to Gigabyte
        </button>
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <span className="font-mono text-[10px] text-text-subtle uppercase tracking-wider px-2 py-0.5 bg-surface-2 rounded border border-border">
            Admin
          </span>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-surface-2 border border-border flex items-center justify-center mx-auto mb-5">
              <Shield size={24} className="text-electric" strokeWidth={2} />
            </div>
            <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">
              Restricted area
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-text tracking-tightest leading-tight mb-3">
              Admin access
            </h1>
            <p className="text-text-muted text-sm max-w-sm mx-auto">
              This console is for authorised Gigabyte staff and event organisers only. Enter your access code to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-3xl p-6 md:p-7">
            <label className="block mb-5">
              <span className="flex items-center gap-2 font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">
                <Lock size={10} strokeWidth={2.5} />
                Access code
              </span>
              <input
                type="password"
                value={code}
                onChange={(e) => { setCode(e.target.value); setError(''); }}
                placeholder="Enter your access code"
                autoFocus
                className="w-full h-12 px-4 bg-surface-2 text-text placeholder-text-subtle rounded-xl border border-border focus:border-electric focus:outline-none text-sm font-mono"
              />
              {error && (
                <p className="text-xs text-error mt-2">{error}</p>
              )}
            </label>

            <button
              type="submit"
              disabled={!code.trim() || loading}
              className="w-full h-12 bg-inverse text-inverse-text rounded-full font-semibold text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              {loading ? 'Verifying…' : 'Enter admin console'}
            </button>
          </form>

          <div className="mt-6 bg-surface-2 border border-border rounded-2xl p-4 flex items-start gap-3">
            <Shield size={14} className="text-text-subtle flex-shrink-0 mt-0.5" strokeWidth={2.5} />
            <p className="text-xs text-text-muted leading-relaxed">
              All admin actions are logged and audited. Unauthorised access attempts are flagged and may be reported to the platform's security team.
            </p>
          </div>

          <p className="text-center mt-6 font-mono text-[10px] text-text-subtle uppercase tracking-wider">
            Demo code: gigabyte-admin-2026
          </p>
        </div>
      </main>
    </div>
  );
};
