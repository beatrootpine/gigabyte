import { useEffect, useState } from 'react';
import { X, Check, Clock, Loader2, CreditCard, Calendar as CalIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { paymentsService } from '../services/supabase';
import { formatCurrency } from '../utils/theme';

interface Installment {
  id: string;
  installment_number: number;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid' | 'failed';
  paid_at: string | null;
}

interface Plan {
  id: string;
  total_amount: number;
  installments_total: number;
  installments_paid: number;
  installment_amount: number;
  frequency: 'monthly' | 'biweekly';
  status: 'active' | 'completed' | 'cancelled';
  installments?: Installment[];
}

interface PaymentPlanDetailProps {
  ticketId: string;
  eventTitle: string;
  onClose: () => void;
  onPaymentMade?: () => void;
}

export const PaymentPlanDetail = ({
  ticketId,
  eventTitle,
  onClose,
  onPaymentMade,
}: PaymentPlanDetailProps) => {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [justPaid, setJustPaid] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await paymentsService.getPlan(ticketId);
      setPlan(data as Plan | null);
    } catch (err: any) {
      setError(err?.message || 'Could not load payment plan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [ticketId]);

  const installments = (plan?.installments || []).sort(
    (a, b) => a.installment_number - b.installment_number
  );
  const nextPending = installments.find(i => i.status === 'pending');
  const totalPaid = installments.filter(i => i.status === 'paid').reduce((s, i) => s + Number(i.amount), 0);
  const progress = plan ? Math.round((plan.installments_paid / plan.installments_total) * 100) : 0;

  const payInstallment = async (installmentId: string) => {
    setError(null);
    setPaying(installmentId);
    // Simulate payment gateway delay
    await new Promise(r => setTimeout(r, 1400));
    try {
      await paymentsService.payInstallment(installmentId);
      setJustPaid(installmentId);
      await load();
      onPaymentMade?.();
      setTimeout(() => setJustPaid(null), 3000);
    } catch (err: any) {
      setError(err?.message || 'Payment failed. Try again.');
    } finally {
      setPaying(null);
    }
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
          <div className="flex items-center gap-2 mb-2">
            <CreditCard size={12} className="text-electric" strokeWidth={2.5} />
            <p className="font-mono text-[10px] text-electric uppercase tracking-wider">
              Payment plan · {plan?.frequency || 'monthly'}
            </p>
          </div>
          <h2 className="font-display text-2xl font-bold text-text tracking-tighter leading-tight mb-1">
            {eventTitle}
          </h2>

          {loading ? (
            <div className="py-10 text-center">
              <Loader2 size={20} className="text-text-muted animate-spin mx-auto mb-2" strokeWidth={2} />
              <p className="text-xs text-text-muted">Loading plan…</p>
            </div>
          ) : !plan ? (
            <div className="py-10 text-center">
              <p className="text-sm text-text-muted mb-2">No payment plan found for this ticket.</p>
              <p className="text-xs text-text-subtle">This ticket may have been paid in full.</p>
            </div>
          ) : (
            <>
              {/* Progress */}
              <div className="bg-surface-2 rounded-2xl p-5 border border-border mb-5 mt-4">
                <div className="flex items-baseline justify-between mb-3">
                  <span className="font-mono text-[10px] text-text-subtle uppercase tracking-wider">
                    {plan.installments_paid} of {plan.installments_total} paid
                  </span>
                  <span className="font-mono text-[10px] text-text-subtle uppercase tracking-wider">
                    {progress}%
                  </span>
                </div>
                <div className="h-2 bg-surface-3 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-electric rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="font-display text-xl font-extrabold text-text tracking-tight">
                      {formatCurrency(totalPaid).replace('.00', '')}
                    </p>
                    <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mt-0.5">
                      Paid so far
                    </p>
                  </div>
                  <div>
                    <p className="font-display text-xl font-extrabold text-text tracking-tight">
                      {formatCurrency(Number(plan.total_amount) - totalPaid).replace('.00', '')}
                    </p>
                    <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mt-0.5">
                      Remaining
                    </p>
                  </div>
                </div>
              </div>

              {/* Plan completed state */}
              {plan.status === 'completed' && (
                <div className="bg-success/10 border border-success/20 rounded-2xl p-4 mb-5 flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-success flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <div>
                    <p className="font-display font-bold text-sm text-text mb-1">Plan complete!</p>
                    <p className="text-xs text-text-muted leading-relaxed">
                      Your ticket is fully paid and your QR code is now active. See you at the event.
                    </p>
                  </div>
                </div>
              )}

              {/* Installments list */}
              <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-3">
                Schedule
              </p>
              <div className="space-y-2 mb-5">
                {installments.map(inst => {
                  const dueDate = new Date(inst.due_date);
                  const isOverdue = inst.status === 'pending' && dueDate < new Date();
                  const isPaid = inst.status === 'paid';
                  const isNextDue = inst.id === nextPending?.id;
                  const wasJustPaid = justPaid === inst.id;

                  return (
                    <div
                      key={inst.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        isPaid
                          ? 'bg-success/5 border-success/20'
                          : isOverdue
                            ? 'bg-error/5 border-error/20'
                            : isNextDue
                              ? 'bg-electric/5 border-electric/30'
                              : 'bg-surface-2 border-border'
                      } ${wasJustPaid ? 'ring-2 ring-success animate-fade-in' : ''}`}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isPaid ? 'bg-success' : isOverdue ? 'bg-error/20' : 'bg-surface-3'
                      }`}>
                        {isPaid ? (
                          <Check size={14} className="text-white" strokeWidth={3} />
                        ) : isOverdue ? (
                          <AlertCircle size={14} className="text-error" strokeWidth={2.5} />
                        ) : (
                          <span className="font-display font-bold text-xs text-text">
                            {inst.installment_number}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-sm text-text">
                            Payment {inst.installment_number}
                          </p>
                          {isNextDue && !isOverdue && (
                            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-semibold uppercase tracking-wider bg-electric text-white">
                              Next
                            </span>
                          )}
                          {isOverdue && (
                            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-semibold uppercase tracking-wider bg-error text-white">
                              Overdue
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-text-muted mt-0.5 inline-flex items-center gap-1">
                          <CalIcon size={10} strokeWidth={2} />
                          {isPaid && inst.paid_at
                            ? `Paid ${new Date(inst.paid_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}`
                            : `Due ${dueDate.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}`}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`font-display font-bold text-sm ${isPaid ? 'text-success' : 'text-text'}`}>
                          {formatCurrency(Number(inst.amount)).replace('.00', '')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {error && (
                <div className="bg-error/10 border border-error/20 rounded-xl p-3 mb-4">
                  <p className="text-xs text-error">{error}</p>
                </div>
              )}

              {/* Pay next installment button */}
              {nextPending && plan.status === 'active' && (
                <button
                  onClick={() => payInstallment(nextPending.id)}
                  disabled={!!paying}
                  className="w-full h-12 bg-inverse text-inverse-text rounded-full font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-opacity inline-flex items-center justify-center gap-2"
                >
                  {paying ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Processing payment…
                    </>
                  ) : (
                    <>
                      <CreditCard size={14} strokeWidth={2.5} />
                      Pay {formatCurrency(Number(nextPending.amount)).replace('.00', '')} now
                    </>
                  )}
                </button>
              )}

              <p className="mt-4 text-center font-mono text-[10px] text-text-subtle uppercase tracking-wider">
                {plan.status === 'completed'
                  ? 'All payments settled'
                  : 'No interest · No late fees for on-time payments'}
              </p>

              <div className="mt-4 flex items-start gap-2 p-3 bg-gold/10 border border-gold/20 rounded-xl">
                <Clock size={12} className="text-gold flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <p className="text-[11px] text-text-muted leading-relaxed">
                  Demo mode — tapping pay uses the test gateway. Payment is simulated but the schedule, progress and completed ticket status all persist in Supabase.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
