import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Shield, X, Check, QrCode as QRIcon, Copy, ArrowRightLeft, Tag, Info, History, Ticket as TicketIcon, Loader2 } from 'lucide-react';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';
import { TicketCard } from '../components/TicketCard';
import { AuthModal } from '../components/AuthModal';
import { MOCK_USER_TICKETS, DemoTicket, formatDateLong } from '../utils/mockData';
import { formatCurrency } from '../utils/theme';
import { useAuth } from '../contexts/AuthContext';
import { ticketsService } from '../services/supabase';

type Modal = null | 'qr' | 'transfer' | 'resell' | 'protect' | 'history';

// Map a Supabase ticket row (with joined event) to the DemoTicket shape the UI expects
const toDemoTicket = (row: any): DemoTicket => {
  // Normalize status to the DemoTicket union
  const rawStatus = row.status as string;
  const status: DemoTicket['status'] =
    rawStatus === 'resold' ? 'listed' :
    rawStatus === 'cancelled' ? 'used' :
    (rawStatus as DemoTicket['status']);
  return {
    id: row.id,
    event_id: row.event_id,
    event_title: row.events?.title || 'Event',
    event_image: row.events?.image_url || '',
    venue: row.events?.venue || '',
    city: row.events?.city || '',
    date: row.events?.date || new Date().toISOString(),
    time: row.events?.time || '',
    category: row.events?.category || '',
    ticket_type: row.ticket_type,
    seat: row.seat,
    qr_hash: row.qr_hash,
    price: Number(row.total),
    original_price: Number(row.price),
    status,
    purchased_at: row.created_at,
    transferable: status === 'active',
    resellable: status === 'active',
  };
};

export const WalletScreen = () => {
  const { user } = useAuth();
  const [activeModal, setActiveModal] = useState<Modal>(null);
  const [selectedTicket, setSelectedTicket] = useState<DemoTicket | null>(null);
  const [showAuth, setShowAuth] = useState<false | 'signin' | 'signup'>(false);
  const [showDemoTickets, setShowDemoTickets] = useState(false);
  const [myTickets, setMyTickets] = useState<DemoTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load the user's real tickets whenever auth changes
  useEffect(() => {
    if (!user) {
      setMyTickets([]);
      setShowDemoTickets(true); // unauthed: show demo by default
      return;
    }
    setShowDemoTickets(false);
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    ticketsService.getMyTickets(user.id)
      .then(rows => {
        if (cancelled) return;
        setMyTickets((rows || []).map(toDemoTicket));
      })
      .catch(err => {
        if (cancelled) return;
        if (err?.message?.includes('does not exist') || err?.message?.includes('relation')) {
          setLoadError('Tickets table not set up yet. Run tickets-setup.sql in Supabase.');
        } else {
          setLoadError(err?.message || 'Could not load your tickets.');
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  const openModal = (modal: Modal, ticket?: DemoTicket) => {
    if (ticket) setSelectedTicket(ticket);
    setActiveModal(modal);
  };

  const closeModal = () => { setActiveModal(null); setSelectedTicket(null); };

  // If authed: show real tickets, plus demo tickets if user toggled them on
  // If unauthed: show demo tickets as a preview
  const displayTickets = user
    ? (showDemoTickets ? [...myTickets, ...MOCK_USER_TICKETS] : myTickets)
    : (showDemoTickets ? MOCK_USER_TICKETS : []);

  return (
    <div className="min-h-screen bg-bg pb-28">
      <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-xl border-b border-border">
        <div className="px-5 py-4 flex items-center justify-between">
          <Logo size="md" />
          <ThemeToggle />
        </div>
      </header>

      <main className="px-5 py-6">
        <div className="mb-6">
          <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">
            Tickets & passes
          </p>
          <h1 className="font-display text-3xl md:text-5xl font-extrabold text-text tracking-tightest leading-[0.95]">
            Your wallet.
          </h1>
          <div className="flex items-center gap-5 mt-3 flex-wrap">
            <button
              onClick={() => openModal('protect')}
              className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors"
            >
              <Shield size={13} className="text-electric" strokeWidth={2.5} />
              <span>How Gigabyte Protect works</span>
            </button>
            <button
              onClick={() => openModal('history')}
              className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors"
            >
              <History size={13} strokeWidth={2} />
              <span>Transfer history</span>
            </button>
          </div>
        </div>

        {/* State banners */}
        {loadError ? (
          <div className="mb-6 bg-error/5 border border-error/20 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-error/10 flex items-center justify-center flex-shrink-0">
              <Info size={14} className="text-error" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-text">Couldn't load your tickets</p>
              <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{loadError}</p>
            </div>
          </div>
        ) : !user ? (
          <div className="mb-6 bg-electric/5 border border-electric/20 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-electric/10 flex items-center justify-center flex-shrink-0">
              <Shield size={14} className="text-electric" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-text">Demo preview</p>
              <p className="text-xs text-text-muted mt-0.5 leading-relaxed mb-2">
                Explore how tickets, transfers and resales work. Sign in to see your real tickets here.
              </p>
              <button
                onClick={() => setShowAuth('signin')}
                className="text-xs font-semibold text-electric hover:opacity-80 transition-opacity"
              >
                Sign in to Gigabyte →
              </button>
            </div>
          </div>
        ) : showDemoTickets && myTickets.length > 0 ? (
          <div className="mb-6 bg-surface-2 border border-border rounded-2xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-3 flex items-center justify-center flex-shrink-0">
              <Info size={14} className="text-text-muted" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-text">Including demo tickets</p>
              <p className="text-xs text-text-muted mt-0.5 leading-relaxed mb-2">
                Demo tickets are mixed in below so you can try Transfer and Resell flows.
              </p>
              <button
                onClick={() => setShowDemoTickets(false)}
                className="text-xs font-semibold text-text-muted hover:text-text transition-colors"
              >
                Hide demo tickets
              </button>
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className="py-16 text-center">
            <Loader2 size={24} className="text-text-muted animate-spin mx-auto mb-3" strokeWidth={2} />
            <p className="text-sm text-text-muted">Loading your tickets…</p>
          </div>
        ) : displayTickets.length > 0 ? (
          <div className="space-y-5 md:grid md:grid-cols-2 md:gap-5 md:space-y-0">
            {displayTickets.map(ticket => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onViewQR={(t) => openModal('qr', t)}
                onTransfer={(t) => openModal('transfer', t)}
                onResell={(t) => openModal('resell', t)}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-surface border border-border rounded-3xl">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-surface-2 items-center justify-center mb-5">
              <TicketIcon size={20} className="text-text-muted" strokeWidth={2} />
            </div>
            <h2 className="font-display text-xl font-bold text-text tracking-tighter mb-2">
              No tickets yet
            </h2>
            <p className="text-sm text-text-muted max-w-xs mx-auto mb-5">
              {user
                ? 'Buy an event to see your tickets here with secure QR codes.'
                : 'Sign in to see your real tickets, or preview the UX with demo tickets.'}
            </p>
            <button
              onClick={() => user ? setShowDemoTickets(true) : setShowAuth('signin')}
              className="inline-flex h-11 px-6 items-center justify-center bg-inverse text-inverse-text rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              {user ? 'View demo tickets' : 'Sign in'}
            </button>
          </div>
        )}
      </main>

      {activeModal === 'qr' && selectedTicket && <QRModal ticket={selectedTicket} onClose={closeModal} />}
      {activeModal === 'transfer' && selectedTicket && <TransferModal ticket={selectedTicket} onClose={closeModal} />}
      {activeModal === 'resell' && selectedTicket && <ResellModal ticket={selectedTicket} onClose={closeModal} />}
      {activeModal === 'protect' && <ProtectModal onClose={closeModal} />}
      {activeModal === 'history' && <HistoryModal onClose={closeModal} />}
      {showAuth && <AuthModal initialMode={showAuth} onClose={() => setShowAuth(false)} />}
    </div>
  );
};

// ===== Modal Shell =====
const ModalShell = ({ children, onClose }: { children: ReactNode; onClose: () => void }) => (
  <div
    onClick={onClose}
    className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-5 animate-fade-in"
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative bg-surface border border-border rounded-t-3xl md:rounded-3xl w-full md:max-w-md max-h-[90vh] overflow-y-auto animate-scale-in"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-9 h-9 bg-surface-2 rounded-full flex items-center justify-center hover:bg-surface-3 transition-colors z-10"
      >
        <X size={16} className="text-text" strokeWidth={2} />
      </button>
      <div className="p-6 md:p-8">{children}</div>
    </div>
  </div>
);

// ===== QR Modal =====
const QRModal = ({ ticket, onClose }: { ticket: DemoTicket; onClose: () => void }) => (
  <ModalShell onClose={onClose}>
    <div className="text-center">
      <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">Your ticket</p>
      <h2 className="font-display text-2xl font-bold text-text tracking-tighter mb-1">{ticket.event_title}</h2>
      <p className="text-sm text-text-muted mb-6">{formatDateLong(ticket.date)}</p>

      <div className="mx-auto bg-white p-6 rounded-2xl w-64 h-64 flex items-center justify-center mb-6 shadow-xl">
        <QRPattern hash={ticket.qr_hash} />
      </div>

      <div className="flex items-center justify-center gap-2 mb-1">
        <p className="font-mono text-sm font-semibold text-text">{ticket.qr_hash}</p>
        <button className="text-text-muted hover:text-text" onClick={() => navigator.clipboard?.writeText(ticket.qr_hash)}>
          <Copy size={14} strokeWidth={2} />
        </button>
      </div>
      <p className="text-xs text-text-muted mb-6">{ticket.ticket_type} · {ticket.venue}</p>

      <div className="bg-surface-2 rounded-2xl p-4 flex items-start gap-3 text-left">
        <Shield size={16} className="text-electric flex-shrink-0 mt-0.5" strokeWidth={2.5} />
        <p className="text-xs text-text-muted leading-relaxed">
          This QR is unique to your account and rotates every 30 seconds at the venue. Screenshots can't be scanned twice.
        </p>
      </div>
    </div>
  </ModalShell>
);

// Fake QR pattern — visual only
const QRPattern = ({ hash }: { hash: string }) => {
  // Generate deterministic pattern from hash
  const size = 21;
  const cells: boolean[][] = Array(size).fill(0).map(() => Array(size).fill(false));
  let seed = 0;
  for (const c of hash) seed = (seed + c.charCodeAt(0)) * 2654435761 >>> 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      seed = (seed * 1103515245 + 12345) >>> 0;
      cells[y][x] = (seed & 1) === 1;
    }
  }
  // Finder patterns in corners
  const finderAt = (sx: number, sy: number) => {
    for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) {
      cells[sy + y][sx + x] = (x === 0 || x === 6 || y === 0 || y === 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4));
    }
  };
  finderAt(0, 0); finderAt(size - 7, 0); finderAt(0, size - 7);
  
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
      {cells.map((row, y) => row.map((on, x) => on && (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#000" />
      )))}
    </svg>
  );
};

// ===== Transfer Modal =====
const TransferModal = ({ ticket, onClose }: { ticket: DemoTicket; onClose: () => void }) => {
  const [step, setStep] = useState<'enter' | 'confirm' | 'sent'>('enter');
  const [recipient, setRecipient] = useState('');

  return (
    <ModalShell onClose={onClose}>
      {step === 'enter' && (
        <>
          <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">Step 1 of 2 · Transfer</p>
          <h2 className="font-display text-2xl font-bold text-text tracking-tighter mb-1">Send to a friend</h2>
          <p className="text-sm text-text-muted mb-6">{ticket.event_title}</p>

          <label className="block mb-6">
            <span className="block font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">Recipient</span>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Phone, email or @username"
              className="w-full h-12 px-4 bg-surface-2 text-text placeholder-text-subtle rounded-xl border border-border focus:border-border-strong focus:outline-none text-sm"
              autoFocus
            />
          </label>

          <div className="bg-surface-2 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <Shield size={16} className="text-electric flex-shrink-0 mt-0.5" strokeWidth={2.5} />
            <div>
              <p className="font-semibold text-sm text-text mb-1">Protected transfer</p>
              <p className="text-xs text-text-muted leading-relaxed">
                When they accept, your QR is instantly invalidated and a new one is issued to them. No screenshots, no duplicates, no fraud.
              </p>
            </div>
          </div>

          <button
            onClick={() => setStep('confirm')}
            disabled={!recipient.trim()}
            className="w-full h-12 bg-inverse text-inverse-text rounded-full font-semibold text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            Continue
          </button>
        </>
      )}

      {step === 'confirm' && (
        <>
          <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">Step 2 of 2</p>
          <h2 className="font-display text-2xl font-bold text-text tracking-tighter mb-6">Review & send</h2>
          <div className="bg-surface-2 rounded-2xl p-4 space-y-3 mb-6">
            <ModalRow label="Event" value={ticket.event_title} />
            <ModalRow label="Ticket" value={`${ticket.ticket_type}${ticket.seat ? ` · ${ticket.seat}` : ''}`} />
            <ModalRow label="Sending to" value={recipient} />
            <ModalRow label="Transfer fee" value="Free" valueClass="text-success font-semibold" />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep('enter')} className="flex-1 h-12 bg-surface-2 text-text rounded-full font-semibold text-sm hover:bg-surface-3 transition-colors">
              Back
            </button>
            <button onClick={() => setStep('sent')} className="flex-1 h-12 bg-inverse text-inverse-text rounded-full font-semibold text-sm hover:opacity-90 transition-opacity">
              Send ticket
            </button>
          </div>
        </>
      )}

      {step === 'sent' && (
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-5">
            <Check size={28} className="text-success" strokeWidth={3} />
          </div>
          <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">Sent</p>
          <h2 className="font-display text-2xl font-bold text-text tracking-tighter mb-3">Ticket on its way</h2>
          <p className="text-sm text-text-muted mb-6 max-w-sm mx-auto">
            <span className="font-semibold text-text">{recipient}</span> has 24 hours to accept. If they don't, the ticket returns to your wallet automatically.
          </p>
          <button onClick={onClose} className="h-12 px-8 bg-inverse text-inverse-text rounded-full font-semibold text-sm hover:opacity-90 transition-opacity">
            Done
          </button>
        </div>
      )}
    </ModalShell>
  );
};

// ===== Resell Modal =====
const ResellModal = ({ ticket, onClose }: { ticket: DemoTicket; onClose: () => void }) => {
  const [step, setStep] = useState<'price' | 'listed'>('price');
  const [price, setPrice] = useState(String(Math.round(ticket.original_price * 0.9)));
  const priceNumber = parseFloat(price) || 0;
  const fee = Math.round(priceNumber * 0.1);
  const payout = priceNumber - fee;
  const capReached = priceNumber > ticket.original_price * 1.1;
  const valid = priceNumber > 0 && !capReached;

  return (
    <ModalShell onClose={onClose}>
      {step === 'price' && (
        <>
          <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">Resell on Gigabyte</p>
          <h2 className="font-display text-2xl font-bold text-text tracking-tighter mb-1">Set your price</h2>
          <p className="text-sm text-text-muted mb-6">{ticket.event_title} · {ticket.ticket_type}</p>

          <label className="block mb-4">
            <span className="block font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">Resale price (ZAR)</span>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display font-bold text-text">R</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full h-14 pl-10 pr-4 bg-surface-2 text-text rounded-xl border border-border focus:border-border-strong focus:outline-none text-lg font-display font-bold"
              />
            </div>
            <p className="text-xs text-text-muted mt-2">
              Face value: {formatCurrency(ticket.original_price).replace('.00', '')} · Max: {formatCurrency(ticket.original_price * 1.1).replace('.00', '')} (110% cap to stop scalping)
            </p>
            {capReached && (
              <p className="text-xs text-error mt-1">Price exceeds Gigabyte's anti-scalping cap.</p>
            )}
          </label>

          <div className="bg-surface-2 rounded-2xl p-4 space-y-2.5 mb-6">
            <ModalRow label="Listing price" value={formatCurrency(priceNumber).replace('.00', '')} />
            <ModalRow label="Gigabyte fee (10%)" value={`− ${formatCurrency(fee).replace('.00', '')}`} valueClass="text-text-muted" />
            <div className="pt-2.5 border-t border-border">
              <ModalRow label="You receive" value={formatCurrency(payout).replace('.00', '')} valueClass="font-display font-bold text-success" />
            </div>
          </div>

          <div className="bg-electric/5 border border-electric/20 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <Shield size={16} className="text-electric flex-shrink-0 mt-0.5" strokeWidth={2.5} />
            <div>
              <p className="font-semibold text-sm text-text mb-1">Escrow protected</p>
              <p className="text-xs text-text-muted leading-relaxed">
                Buyer pays Gigabyte (not you). We hold funds in escrow, reissue the QR to them, and release payment to your account in 24 hours.
              </p>
            </div>
          </div>

          <button
            onClick={() => setStep('listed')}
            disabled={!valid}
            className="w-full h-12 bg-inverse text-inverse-text rounded-full font-semibold text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            List for resale
          </button>
        </>
      )}

      {step === 'listed' && (
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-5">
            <Check size={28} className="text-success" strokeWidth={3} />
          </div>
          <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">Listed</p>
          <h2 className="font-display text-2xl font-bold text-text tracking-tighter mb-3">Live on the marketplace</h2>
          <p className="text-sm text-text-muted mb-6 max-w-sm mx-auto">
            Your ticket is now visible to buyers for <span className="font-semibold text-text">{formatCurrency(priceNumber).replace('.00', '')}</span>. You'll be notified the moment it sells.
          </p>
          <button onClick={onClose} className="h-12 px-8 bg-inverse text-inverse-text rounded-full font-semibold text-sm hover:opacity-90 transition-opacity">
            Done
          </button>
        </div>
      )}
    </ModalShell>
  );
};

// ===== Gigabyte Protect Explainer =====
const ProtectModal = ({ onClose }: { onClose: () => void }) => (
  <ModalShell onClose={onClose}>
    <div className="flex items-center gap-2 mb-2">
      <Shield size={14} className="text-electric" strokeWidth={2.5} />
      <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider">Gigabyte Protect</p>
    </div>
    <h2 className="font-display text-2xl font-bold text-text tracking-tighter mb-6">
      Zero fraud. Zero drama.
    </h2>

    <div className="space-y-5">
      <ProtectPoint
        icon={QRIcon}
        title="Encrypted QR, rotating code"
        desc="Every ticket has a unique QR that rotates every 30 seconds at the gate. Screenshots are useless — the code expires before it can be reused."
      />
      <ProtectPoint
        icon={ArrowRightLeft}
        title="Secure transfers to friends"
        desc="Send a ticket by phone, email or username. The moment they accept, your QR dies and a new one is issued to them. Free. Instant."
      />
      <ProtectPoint
        icon={Tag}
        title="Escrow-protected resale"
        desc="Can't make it? List it. Buyer pays Gigabyte in escrow, we reissue the QR to them, and we release your money in 24 hours. Prices capped at 110% of face value to stop scalping."
      />
      <ProtectPoint
        icon={Info}
        title="Event cancelled? Full refund."
        desc="If the event is cancelled, we automatically refund every ticket holder within 5 business days. No forms, no fights."
      />
    </div>
  </ModalShell>
);

const ProtectPoint = ({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) => (
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 rounded-xl bg-electric/10 flex items-center justify-center flex-shrink-0">
      <Icon size={16} className="text-electric" strokeWidth={2} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-display font-bold text-base text-text mb-1">{title}</p>
      <p className="text-xs text-text-muted leading-relaxed">{desc}</p>
    </div>
  </div>
);

// ===== History Modal =====
const HistoryModal = ({ onClose }: { onClose: () => void }) => {
  const mockHistory = [
    { id: 1, type: 'received', title: 'Amapiano Vibes', from: 'Lerato K.', when: '3 weeks ago' },
    { id: 2, type: 'sent', title: 'Comedy Night Stand-Up', to: 'Thabo M.', when: '1 month ago' },
    { id: 3, type: 'resold', title: 'Cricket: Proteas vs Australia', amount: 585, when: '2 months ago' },
  ];

  return (
    <ModalShell onClose={onClose}>
      <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">Transfer history</p>
      <h2 className="font-display text-2xl font-bold text-text tracking-tighter mb-6">Your activity</h2>
      <div className="space-y-3">
        {mockHistory.map(h => (
          <div key={h.id} className="bg-surface-2 rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              h.type === 'received' ? 'bg-success/10' : h.type === 'resold' ? 'bg-electric/10' : 'bg-surface-3'
            }`}>
              {h.type === 'received' ? <Check size={16} className="text-success" strokeWidth={2} /> :
               h.type === 'resold' ? <Tag size={16} className="text-electric" strokeWidth={2} /> :
               <ArrowRightLeft size={16} className="text-text" strokeWidth={2} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-text line-clamp-1">{h.title}</p>
              <p className="text-xs text-text-muted mt-0.5">
                {h.type === 'received' && `From ${h.from}`}
                {h.type === 'sent' && `Sent to ${h.to}`}
                {h.type === 'resold' && `Sold for ${formatCurrency(h.amount!).replace('.00', '')}`}
                {' · '}{h.when}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ModalShell>
  );
};

// Utility
const ModalRow = ({ label, value, valueClass = '' }: { label: string; value: string; valueClass?: string }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-text-muted">{label}</span>
    <span className={`text-text ${valueClass}`}>{value}</span>
  </div>
);
