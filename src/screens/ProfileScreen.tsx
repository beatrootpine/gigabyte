import { ChevronRight, LogOut, Settings, Bell, Shield, HelpCircle, CreditCard } from 'lucide-react';

export const ProfileScreen = () => {
  const menuItems = [
    { icon: Bell, label: 'Notifications', sub: 'Manage alerts and reminders' },
    { icon: CreditCard, label: 'Payment methods', sub: 'Cards and payment plans' },
    { icon: Settings, label: 'Account settings', sub: 'Profile and preferences' },
    { icon: Shield, label: 'Privacy & security', sub: 'Data and permissions' },
    { icon: HelpCircle, label: 'Help & support', sub: 'FAQ and contact' },
  ];

  return (
    <div className="min-h-screen bg-ink-950 pb-24">
      <header className="sticky top-0 z-40 bg-ink-950/80 backdrop-blur-xl border-b border-ink-900">
        <div className="px-5 py-5">
          <p className="font-mono text-[10px] text-ink-500 uppercase tracking-wider mb-1">
            Your account
          </p>
          <h1 className="font-display text-3xl font-extrabold text-ink-50 tracking-tightest">
            Profile
          </h1>
        </div>
      </header>

      <main className="px-5 py-8 space-y-8">
        <div className="bg-ink-900 border border-ink-800 rounded-3xl p-6">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-electric to-gold flex items-center justify-center">
              <span className="font-display font-bold text-xl text-ink-950">G</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-lg font-bold text-ink-50 tracking-tight">
                Welcome back
              </h2>
              <p className="text-ink-400 text-sm truncate">Sign in to access your account</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="flex-1 h-11 bg-ink-50 text-ink-950 rounded-full font-semibold text-sm hover:bg-white transition-colors">
              Sign in
            </button>
            <button className="flex-1 h-11 bg-ink-800 text-ink-50 rounded-full font-semibold text-sm hover:bg-ink-700 transition-colors">
              Create account
            </button>
          </div>
        </div>

        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-electric via-electric-soft to-gold p-6">
          <p className="font-mono text-[10px] text-ink-950/80 uppercase tracking-wider mb-2">
            Gigabyte Pro
          </p>
          <h3 className="font-display text-2xl font-bold text-ink-950 tracking-tighter mb-2 max-w-[200px] leading-tight">
            Unlock every venue
          </h3>
          <p className="text-ink-950/80 text-sm mb-5 max-w-sm">
            Exclusive discounts, early-bird access, members-only events, and zero service fees.
          </p>
          <button className="h-11 px-6 bg-ink-950 text-ink-50 rounded-full font-semibold text-sm hover:bg-ink-900 transition-colors">
            Upgrade from R49/mo
          </button>
        </div>

        <div>
          <p className="font-mono text-[10px] text-ink-500 uppercase tracking-wider mb-3 px-1">
            Settings
          </p>
          <div className="bg-ink-900 border border-ink-800 rounded-2xl overflow-hidden divide-y divide-ink-800">
            {menuItems.map((item, i) => (
              <button
                key={i}
                className="w-full flex items-center gap-4 p-4 hover:bg-ink-800 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-ink-800 flex items-center justify-center flex-shrink-0">
                  <item.icon size={16} className="text-ink-300" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-ink-50">{item.label}</p>
                  <p className="text-xs text-ink-500 truncate">{item.sub}</p>
                </div>
                <ChevronRight size={16} className="text-ink-500 flex-shrink-0" strokeWidth={2} />
              </button>
            ))}
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 h-12 bg-ink-900 text-error border border-ink-800 rounded-full font-semibold text-sm hover:bg-ink-800 transition-colors">
          <LogOut size={16} strokeWidth={2} />
          Sign out
        </button>

        <div className="text-center pt-4">
          <p className="font-mono text-[10px] text-ink-600 uppercase tracking-wider">
            Gigabyte · v0.1
          </p>
        </div>
      </main>
    </div>
  );
};
