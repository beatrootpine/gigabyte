import { Ticket } from 'lucide-react';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';

export const WalletScreen = () => {
  const tickets: any[] = [];

  return (
    <div className="min-h-screen bg-bg pb-28">
      <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-xl border-b border-border">
        <div className="px-5 py-4 flex items-center justify-between">
          <Logo size="md" />
          <ThemeToggle />
        </div>
      </header>

      <div className="px-5 py-6">
        <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">
          Your tickets
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-extrabold text-text tracking-tightest leading-[0.95] mb-8">
          Wallet
        </h1>

        {tickets.length === 0 ? (
          <div className="py-24 text-center">
            <div className="inline-flex w-16 h-16 rounded-2xl bg-surface border border-border items-center justify-center mb-6">
              <Ticket size={24} className="text-text-muted" strokeWidth={2} />
            </div>
            <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-3">
              Empty
            </p>
            <h2 className="font-display text-2xl font-bold text-text tracking-tighter mb-3">
              No tickets yet
            </h2>
            <p className="text-text-muted max-w-xs mx-auto">
              Book an event to see your tickets appear here with QR codes and event details.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
