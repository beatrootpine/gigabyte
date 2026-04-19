import { useState } from 'react';
import { Ticket } from 'lucide-react';

export const WalletScreen = () => {
  const [tickets] = useState<any[]>([]);
  const [loading] = useState(false);

  return (
    <div className="min-h-screen bg-ink-950 pb-24">
      <header className="sticky top-0 z-40 bg-ink-950/80 backdrop-blur-xl border-b border-ink-900">
        <div className="px-5 py-5">
          <p className="font-mono text-[10px] text-ink-500 uppercase tracking-wider mb-1">
            Your tickets
          </p>
          <h1 className="font-display text-3xl font-extrabold text-ink-50 tracking-tightest">
            Wallet
          </h1>
        </div>
      </header>

      <main className="px-5 py-8">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1,2,3].map(i => (
              <div key={i} className="h-32 bg-ink-900 rounded-2xl" />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="py-24 text-center">
            <div className="inline-flex w-16 h-16 rounded-2xl bg-ink-900 border border-ink-800 items-center justify-center mb-6">
              <Ticket size={24} className="text-ink-500" strokeWidth={2} />
            </div>
            <p className="font-mono text-[10px] text-ink-500 uppercase tracking-wider mb-3">
              Empty
            </p>
            <h2 className="font-display text-2xl font-bold text-ink-50 tracking-tighter mb-3">
              No tickets yet
            </h2>
            <p className="text-ink-400 max-w-xs mx-auto">
              Book an event to see your tickets appear here with QR codes and event details.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="bg-ink-900 border border-ink-800 p-5 rounded-2xl">
                <h3 className="font-display font-bold text-ink-50">{ticket.event_title}</h3>
                <p className="text-ink-400 text-sm mt-1">{ticket.ticket_type}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
