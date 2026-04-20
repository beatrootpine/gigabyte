import { useState, useEffect } from 'react';
import {
  Building2, Check, X, Globe, Phone, Clock, CheckCircle2, XCircle,
  Loader2, FileText, User as UserIcon,
} from 'lucide-react';
import { organizerApplicationsService } from '../services/supabase';

interface OrganizerApplication {
  id: string;
  user_id: string;
  company_name: string;
  website: string | null;
  event_history: string;
  phone: string | null;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_at: string | null;
  review_notes: string | null;
  created_at: string;
  users?: { email: string; full_name: string | null };
}

export const AdminOrganizerApplications = () => {
  const [apps, setApps] = useState<OrganizerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tab, setTab] = useState<'pending' | 'all'>('pending');
  const [selected, setSelected] = useState<OrganizerApplication | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [flash, setFlash] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = tab === 'pending'
        ? await organizerApplicationsService.listPending()
        : await organizerApplicationsService.listAll();
      setApps((data || []) as OrganizerApplication[]);
    } catch (err: any) {
      if (err?.message?.includes('does not exist') || err?.message?.includes('relation')) {
        setLoadError('Run organizer-applications.sql in Supabase to create the applications table.');
      } else {
        setLoadError(err?.message || 'Could not load applications.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [tab]);

  const approve = async (app: OrganizerApplication) => {
    setProcessing(app.id);
    try {
      await organizerApplicationsService.approve(app.id, notes || undefined);
      setFlash(`${app.users?.full_name || app.company_name} approved — they're now an organizer.`);
      setSelected(null);
      setNotes('');
      await load();
    } catch (err: any) {
      setFlash(`Could not approve: ${err?.message || 'unknown error'}`);
    } finally {
      setProcessing(null);
      setTimeout(() => setFlash(null), 4000);
    }
  };

  const reject = async (app: OrganizerApplication) => {
    if (!notes.trim()) {
      setFlash('Please add a reason in the notes before rejecting.');
      setTimeout(() => setFlash(null), 4000);
      return;
    }
    setProcessing(app.id);
    try {
      await organizerApplicationsService.reject(app.id, notes);
      setFlash(`Application from ${app.users?.full_name || app.company_name} was rejected.`);
      setSelected(null);
      setNotes('');
      await load();
    } catch (err: any) {
      setFlash(`Could not reject: ${err?.message || 'unknown error'}`);
    } finally {
      setProcessing(null);
      setTimeout(() => setFlash(null), 4000);
    }
  };

  const pendingCount = apps.filter(a => a.status === 'pending').length;

  return (
    <section className="mb-10">
      <div className="flex items-baseline justify-between mb-5 flex-wrap gap-3">
        <div>
          <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-1">
            Organizer applications
          </p>
          <h2 className="font-display text-xl font-bold text-text tracking-tighter">
            Review queue {tab === 'pending' && pendingCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-electric text-white text-xs font-semibold align-middle">
                {pendingCount}
              </span>
            )}
          </h2>
        </div>
        <div className="flex gap-1 p-1 bg-surface-2 border border-border rounded-full">
          <button
            onClick={() => setTab('pending')}
            className={`h-8 px-3.5 rounded-full text-xs font-semibold transition-all ${
              tab === 'pending' ? 'bg-inverse text-inverse-text' : 'text-text-muted'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setTab('all')}
            className={`h-8 px-3.5 rounded-full text-xs font-semibold transition-all ${
              tab === 'all' ? 'bg-inverse text-inverse-text' : 'text-text-muted'
            }`}
          >
            All
          </button>
        </div>
      </div>

      {flash && (
        <div className="mb-4 bg-surface-2 border border-border rounded-xl p-3">
          <p className="text-xs text-text">{flash}</p>
        </div>
      )}

      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        {loadError ? (
          <div className="p-8 text-center">
            <p className="text-sm text-error">{loadError}</p>
          </div>
        ) : loading ? (
          <div className="p-8 text-center">
            <Loader2 size={20} className="text-text-muted animate-spin mx-auto mb-2" strokeWidth={2} />
            <p className="text-xs text-text-muted">Loading applications…</p>
          </div>
        ) : apps.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex w-12 h-12 rounded-xl bg-surface-2 items-center justify-center mb-3">
              <CheckCircle2 size={18} className="text-text-muted" strokeWidth={2} />
            </div>
            <p className="text-sm text-text-muted">
              {tab === 'pending' ? "All caught up — no applications waiting." : 'No applications yet.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {apps.map(app => (
              <button
                key={app.id}
                onClick={() => { setSelected(app); setNotes(app.review_notes || ''); }}
                className="w-full p-5 flex items-center gap-4 hover:bg-surface-2 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center flex-shrink-0">
                  <Building2 size={16} className="text-text" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-sm text-text line-clamp-1">
                    {app.company_name}
                  </p>
                  <p className="text-xs text-text-muted line-clamp-1 mt-0.5">
                    {app.users?.full_name || 'Unknown'} · {app.users?.email || '—'}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-text-subtle font-mono hidden md:block">
                    {new Date(app.created_at).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' })}
                  </span>
                  <StatusPill status={app.status} />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <ReviewModal
          application={selected}
          notes={notes}
          onNotesChange={setNotes}
          processing={processing === selected.id}
          onApprove={() => approve(selected)}
          onReject={() => reject(selected)}
          onClose={() => { setSelected(null); setNotes(''); }}
        />
      )}
    </section>
  );
};

const StatusPill = ({ status }: { status: 'pending' | 'approved' | 'rejected' }) => {
  if (status === 'pending') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-electric/10 text-electric">
        <Clock size={9} strokeWidth={2.5} /> Pending
      </span>
    );
  }
  if (status === 'approved') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-success/10 text-success">
        <Check size={9} strokeWidth={2.5} /> Approved
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-error/10 text-error">
      <XCircle size={9} strokeWidth={2.5} /> Rejected
    </span>
  );
};

// ============== REVIEW MODAL ==============
const ReviewModal = ({
  application, notes, onNotesChange, processing, onApprove, onReject, onClose,
}: {
  application: OrganizerApplication;
  notes: string;
  onNotesChange: (v: string) => void;
  processing: boolean;
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
}) => {
  const isPending = application.status === 'pending';
  const isRejected = application.status === 'rejected';

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
          <div className="flex items-center gap-2 mb-2">
            <StatusPill status={application.status} />
            <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider">
              Submitted {new Date(application.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <h2 className="font-display text-2xl font-bold text-text tracking-tighter mb-5">
            {application.company_name}
          </h2>

          <div className="space-y-3 mb-6">
            <InfoRow icon={UserIcon} label="Applicant" value={application.users?.full_name || 'Unknown'} />
            <InfoRow icon={Building2} label="Email" value={application.users?.email || '—'} mono />
            {application.website && (
              <InfoRow icon={Globe} label="Website" value={application.website} mono />
            )}
            {application.phone && (
              <InfoRow icon={Phone} label="Phone" value={application.phone} mono />
            )}
          </div>

          <div className="mb-5">
            <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2 flex items-center gap-2">
              <FileText size={10} strokeWidth={2.5} /> Event history
            </p>
            <div className="bg-surface-2 rounded-xl p-4 border border-border">
              <p className="text-sm text-text leading-relaxed whitespace-pre-wrap">
                {application.event_history}
              </p>
            </div>
          </div>

          {isPending && (
            <>
              <div className="mb-5">
                <label className="block font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-2">
                  Review notes (required for rejection)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => onNotesChange(e.target.value)}
                  placeholder="Optional note on approval. Required reason if rejecting."
                  rows={3}
                  className="w-full px-4 py-3 bg-surface-2 text-text placeholder-text-subtle rounded-xl border border-border focus:border-border-strong focus:outline-none text-sm resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onReject}
                  disabled={processing}
                  className="flex-1 h-12 bg-error/10 text-error border border-error/20 rounded-full font-semibold text-sm hover:bg-error/15 disabled:opacity-50 transition-colors inline-flex items-center justify-center gap-2"
                >
                  {processing ? <Loader2 size={14} className="animate-spin" /> : <X size={14} strokeWidth={2.5} />}
                  Reject
                </button>
                <button
                  onClick={onApprove}
                  disabled={processing}
                  className="flex-1 h-12 bg-success text-white rounded-full font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity inline-flex items-center justify-center gap-2"
                >
                  {processing ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} strokeWidth={2.5} />}
                  Approve
                </button>
              </div>
            </>
          )}

          {!isPending && (
            <div className={`rounded-xl p-4 ${isRejected ? 'bg-error/5 border border-error/20' : 'bg-success/5 border border-success/20'}`}>
              <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-1">
                Reviewed {application.reviewed_at && new Date(application.reviewed_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
              {application.review_notes ? (
                <p className="text-sm text-text leading-relaxed italic">"{application.review_notes}"</p>
              ) : (
                <p className="text-sm text-text-muted">No notes recorded.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({
  icon: Icon, label, value, mono,
}: { icon: any; label: string; value: string; mono?: boolean }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center flex-shrink-0">
      <Icon size={13} className="text-text-muted" strokeWidth={2} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-mono text-[10px] text-text-subtle uppercase tracking-wider mb-0.5">{label}</p>
      <p className={`text-sm text-text break-all ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  </div>
);
