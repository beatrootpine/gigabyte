import { useState } from 'react';
import { X, Building2, Globe, Phone, Check, Loader2, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { organizerApplicationsService } from '../services/supabase';

interface OrganizerApplicationModalProps {
  onClose: () => void;
  onSubmitted?: () => void;
}

export const OrganizerApplicationModal = ({ onClose, onSubmitted }: OrganizerApplicationModalProps) => {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [phone, setPhone] = useState('');
  const [eventHistory, setEventHistory] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { setError('You need to be signed in.'); return; }
    setError(null);
    setSubmitting(true);

    try {
      await organizerApplicationsService.submit({
        userId: user.id,
        companyName: companyName.trim(),
        website: website.trim() || undefined,
        phone: phone.trim() || undefined,
        eventHistory: eventHistory.trim(),
      });
      sessionStorage.removeItem('gigabyte-pending-organizer-application');
      setSuccess(true);
      setTimeout(() => {
        onSubmitted?.();
        onClose();
      }, 2500);
    } catch (err: any) {
      if (err?.message?.includes('does not exist') || err?.message?.includes('relation')) {
        setError('Organizer applications table not set up yet. Run organizer-applications.sql in Supabase.');
      } else if (err?.code === '23505' || err?.message?.includes('duplicate')) {
        setError('You already have a pending application. Check your account status.');
      } else {
        setError(err?.message || 'Something went wrong. Try again.');
      }
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-5 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-surface border border-border rounded-t-3xl md:rounded-3xl w-full md:max-w-lg max-h-[95vh] overflow-y-auto animate-scale-in"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 bg-surface-2 rounded-full flex items-center justify-center hover:bg-surface-3 transition-colors z-10"
        >
          <X size={16} className="text-text" strokeWidth={2} />
        </button>

        <div className="p-6 md:p-8">
          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-5">
                <Check size={28} className="text-success" strokeWidth={3} />
              </div>
              <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">Submitted</p>
              <h2 className="font-display text-2xl font-bold text-text tracking-tighter mb-3">
                Application received.
              </h2>
              <p className="text-sm text-text-muted leading-relaxed">
                Our team reviews new organizer accounts within 1–2 business days. You'll get an email when your application is decided.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-2">
                <Clock size={12} className="text-success" strokeWidth={2.5} />
                <p className="font-mono text-[10px] text-success uppercase tracking-wider">
                  Review takes 1–2 business days
                </p>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-text tracking-tighter leading-tight mb-2">
                Apply to list events.
              </h2>
              <p className="text-sm text-text-muted mb-6">
                Tell us about your business. We verify all organizers before giving them ticket-selling access to protect buyers from fraud.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Field label="Company / brand name" icon={Building2}>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Homecoming Events Pty Ltd"
                    required
                    className="w-full h-12 px-4 bg-surface-2 text-text placeholder-text-subtle rounded-xl border border-border focus:border-border-strong focus:outline-none text-sm"
                  />
                </Field>

                <Field label="Website or Instagram" icon={Globe}>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="e.g. homecoming.co.za"
                    className="w-full h-12 px-4 bg-surface-2 text-text placeholder-text-subtle rounded-xl border border-border focus:border-border-strong focus:outline-none text-sm"
                  />
                </Field>

                <Field label="Contact phone" icon={Phone}>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+27 82 000 0000"
                    className="w-full h-12 px-4 bg-surface-2 text-text placeholder-text-subtle rounded-xl border border-border focus:border-border-strong focus:outline-none text-sm"
                  />
                </Field>

                <div>
                  <label className="block font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">
                    Tell us about your events
                  </label>
                  <textarea
                    value={eventHistory}
                    onChange={(e) => setEventHistory(e.target.value)}
                    placeholder="What events have you hosted? What do you plan to list on Gigabyte? Include any venue partnerships, past attendance, or social links that prove you're legit."
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-surface-2 text-text placeholder-text-subtle rounded-xl border border-border focus:border-border-strong focus:outline-none text-sm resize-none"
                  />
                </div>

                {error && (
                  <div className="bg-error/10 border border-error/20 rounded-xl p-3">
                    <p className="text-xs text-error">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || !companyName.trim() || !eventHistory.trim()}
                  className="w-full h-12 bg-inverse text-inverse-text rounded-full font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition-opacity flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  Submit application
                </button>

                <p className="text-center font-mono text-[10px] text-text-subtle uppercase tracking-wider">
                  You can still use Gigabyte as an attendee while we review
                </p>
              </form>
            </>
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
