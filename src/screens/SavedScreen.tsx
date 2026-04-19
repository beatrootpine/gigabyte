import { Bookmark } from 'lucide-react';

export const SavedScreen = () => {
  return (
    <div className="min-h-screen bg-ink-950 pb-24">
      <header className="sticky top-0 z-40 bg-ink-950/80 backdrop-blur-xl border-b border-ink-900">
        <div className="px-5 py-5">
          <p className="font-mono text-[10px] text-ink-500 uppercase tracking-wider mb-1">
            Bookmarked events
          </p>
          <h1 className="font-display text-3xl font-extrabold text-ink-50 tracking-tightest">
            Saved
          </h1>
        </div>
      </header>

      <main className="px-5 py-8">
        <div className="py-24 text-center">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-ink-900 border border-ink-800 items-center justify-center mb-6">
            <Bookmark size={24} className="text-ink-500" strokeWidth={2} />
          </div>
          <p className="font-mono text-[10px] text-ink-500 uppercase tracking-wider mb-3">
            Empty
          </p>
          <h2 className="font-display text-2xl font-bold text-ink-50 tracking-tighter mb-3">
            Nothing saved yet
          </h2>
          <p className="text-ink-400 max-w-xs mx-auto">
            Tap the bookmark icon on any event to save it here for later.
          </p>
        </div>
      </main>
    </div>
  );
};
