import { useState } from 'react';
import { X, CreditCard, Lock, Loader2, Check, Shield, Calendar as CalIcon } from 'lucide-react';
import { formatCurrency } from '../utils/theme';

interface PaymentModalProps {
  mode: 'full' | 'plan';
  eventTitle: string;
  ticketType: string;
  total: number;
  installmentAmount?: number;
  installmentsTotal?: number;
  frequency?: 'monthly' | 'biweekly';
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

type Step = 'form' | 'processing' | 'success';

export const PaymentModal = ({
  mode,
  eventTitle,
  ticketType,
  total,
  installmentAmount,
  installmentsTotal = 3,
  frequency = 'monthly',
  onClose,
  onSuccess,
}: PaymentModalProps) => {
  const [step, setStep] = useState<Step>('form');
  const [error, setError] = useState<string | null>(null);

  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('123');
  const [nameOnCard, setNameOnCard] = useState('');

  // How much is actually charged right now
  const chargedNow = mode === 'full' ? total : (installmentAmount ?? Math.ceil(total / installmentsTotal));
  const remaining = mode === 'full' ? 0 : total - chargedNow;

  const formatCardNumber = (v: string) => {
    const digits = v.replace(/\s/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Light validation — this is a demo gateway so we accept basically anything
    const digitsOnly = cardNumber.replace(/\s/g, '');
    if (digitsOnly.length < 12) {
      setError('Please enter a valid card number.');
      return;
    }
    if (!expiry.match(/^\d{2}\/\d{2}$/)) {
      setError('Expiry should look like MM/YY.');
      return;
    }
    if (cvv.length < 3) {
      setError('CVV should be at least 3 digits.');
      return;
    }
    if (!nameOnCard.trim()) {
      setError('Add the name on the card.');
      return;
    }

    setStep('processing');

    // Simulate payment processing delay (feels real)
    await new Promise(r => setTimeout(r, 1800));

    try {
      await onSuccess();
      setStep('success');
    } catch (err: any) {
      setError(err?.message || 'Payment failed. Try again.');
      setStep('form');
    }
  };

  return (
    <div
      onClick={step === 'form' ? onClose : undefined}
      className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-5 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-surface border border-border rounded-t-3xl md:rounded-3xl w-full md:max-w-md max-h-[95vh] overflow-y-auto animate-scale-in"
      >
        {step === 'form' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-surface-2 rounded-full flex items-center justify-center hover:bg-surface-3 transition-colors z-10"
          >
            <X size={16} className="text-text" strokeWidth={2} />
          </button>
        )}

        <div className="p-6 md:p-8">
          {step === 'form' && (
            <>
              {/* Demo banner */}
              <div className="bg-gold/10 border border-gold/30 rounded-xl p-3 mb-5 flex items-start gap-2">
                <Shield size={14} className="text-gold flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <div className="min-w-0">
                  <p className="font-mono text-[10px] text-gold uppercase tracking-wider font-semibold">
                    Demo payment gateway
                  </p>
                  <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
                    Any card details will work. Nothing is actually charged.
                  </p>
                </div>
              </div>

              <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">
                {mode === 'full' ? 'One-time payment' : 'Start payment plan'}
              </p>
              <h2 className="font-display text-2xl font-bold text-text tracking-tighter mb-1">
                {formatCurrency(chargedNow).replace('.00', '')}
              </h2>
              <p className="text-sm text-text-muted mb-6">
                {mode === 'full'
                  ? `For ${ticketType} — ${eventTitle}`
                  : `Today's payment. ${installmentsTotal - 1} more ${frequency} ${installmentsTotal - 1 === 1 ? 'payment' : 'payments'} of ${formatCurrency(chargedNow).replace('.00', '')} after this.`}
              </p>

              {mode === 'plan' && (
                <div className="bg-surface-2 rounded-xl p-4 mb-5 border border-border">
                  <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-3">
                    Payment schedule
                  </p>
                  <div className="space-y-2">
                    {Array.from({ length: installmentsTotal }).map((_, i) => {
                      const due = new Date();
                      due.setDate(due.getDate() + (frequency === 'biweekly' ? 14 : 30) * i);
                      return (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              i === 0 ? 'bg-electric text-white' : 'bg-surface-3 text-text-muted'
                            }`}>
                              {i + 1}
                            </span>
                            <span className="text-text">
                              {i === 0 ? 'Today' : due.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                          <span className={`font-mono font-semibold ${i === 0 ? 'text-text' : 'text-text-muted'}`}>
                            {formatCurrency(chargedNow).replace('.00', '')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs">
                    <span className="font-mono text-text-subtle uppercase tracking-wider">Total</span>
                    <span className="font-display font-bold text-sm text-text">{formatCurrency(total).replace('.00', '')}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Field label="Name on card" icon={CreditCard}>
                  <input
                    type="text"
                    value={nameOnCard}
                    onChange={(e) => setNameOnCard(e.target.value)}
                    placeholder="e.g. Mo Moshoane"
                    required
                    className="w-full h-11 px-4 bg-surface-2 text-text placeholder-text-subtle rounded-xl border border-border focus:border-border-strong focus:outline-none text-sm"
                  />
                </Field>

                <Field label="Card number" icon={CreditCard}>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="4242 4242 4242 4242"
                    required
                    className="w-full h-11 px-4 bg-surface-2 text-text placeholder-text-subtle rounded-xl border border-border focus:border-border-strong focus:outline-none text-sm font-mono tracking-wide"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Expiry" icon={CalIcon}>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      required
                      className="w-full h-11 px-4 bg-surface-2 text-text placeholder-text-subtle rounded-xl border border-border focus:border-border-strong focus:outline-none text-sm font-mono"
                    />
                  </Field>
                  <Field label="CVV" icon={Lock}>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="123"
                      required
                      className="w-full h-11 px-4 bg-surface-2 text-text placeholder-text-subtle rounded-xl border border-border focus:border-border-strong focus:outline-none text-sm font-mono"
                    />
                  </Field>
                </div>

                {error && (
                  <div className="bg-error/10 border border-error/20 rounded-xl p-3">
                    <p className="text-xs text-error">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full h-12 bg-inverse text-inverse-text rounded-full font-semibold text-sm hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
                >
                  <Lock size={13} strokeWidth={2.5} />
                  Pay {formatCurrency(chargedNow).replace('.00', '')}
                </button>

                <p className="text-center font-mono text-[10px] text-text-subtle uppercase tracking-wider">
                  Secured by Gigabyte · 256-bit SSL
                </p>
              </form>
            </>
          )}

          {step === 'processing' && (
            <div className="text-center py-10">
              <div className="w-14 h-14 rounded-full bg-electric/10 flex items-center justify-center mx-auto mb-5">
                <Loader2 size={24} className="text-electric animate-spin" strokeWidth={2.5} />
              </div>
              <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">
                Processing
              </p>
              <h2 className="font-display text-xl font-bold text-text tracking-tighter mb-2">
                Authorising your payment…
              </h2>
              <p className="text-sm text-text-muted max-w-xs mx-auto">
                Verifying card details with your bank. This can take a few seconds.
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-5">
                <Check size={28} className="text-success" strokeWidth={3} />
              </div>
              <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">
                Payment successful
              </p>
              <h2 className="font-display text-2xl font-bold text-text tracking-tighter mb-3">
                You're in!
              </h2>
              <p className="text-sm text-text-muted mb-2 max-w-sm mx-auto">
                {mode === 'full'
                  ? <>Your ticket for <span className="font-semibold text-text">{eventTitle}</span> is now in your wallet.</>
                  : <>Your first payment cleared. Your ticket is secured — complete the remaining payments by the due dates.</>}
              </p>
              {mode === 'plan' && remaining > 0 && (
                <p className="text-xs text-text-subtle font-mono mb-6">
                  Remaining balance: {formatCurrency(remaining).replace('.00', '')}
                </p>
              )}
              <button
                onClick={onClose}
                className="w-full h-12 bg-inverse text-inverse-text rounded-full font-semibold text-sm hover:opacity-90 transition-opacity mt-4"
              >
                View ticket
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, icon: Icon, children }: { label: string; icon: any; children: React.ReactNode }) => (
  <div>
    <label className="flex items-center gap-2 font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">
      <Icon size={10} strokeWidth={2.5} />
      {label}
    </label>
    {children}
  </div>
);
