import { useState, useEffect } from 'react';
import { Compass, Bookmark, Ticket, LayoutDashboard } from 'lucide-react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useUserProfile } from './hooks/useUserProfile';
import { DiscoveryScreen } from './screens/DiscoveryScreen';
import { WalletScreen } from './screens/WalletScreen';
import { SavedScreen } from './screens/SavedScreen';
import { CustomerDashboard } from './screens/CustomerDashboard';
import { AdminDashboard } from './screens/AdminDashboard';
import { AdminGate } from './screens/AdminGate';

type TabType = 'discover' | 'saved' | 'wallet' | 'dashboard';

const TABS: { id: TabType; label: string; icon: typeof Compass }[] = [
  { id: 'discover', label: 'Discover', icon: Compass },
  { id: 'saved', label: 'Saved', icon: Bookmark },
  { id: 'wallet', label: 'Wallet', icon: Ticket },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

// Admin is gated: access via URL hash #admin + access code
// This is NOT visible in the public bottom nav
const useAdminRoute = () => {
  const [isAdminRoute, setIsAdminRoute] = useState(
    typeof window !== 'undefined' && window.location.hash === '#admin'
  );

  useEffect(() => {
    const onHashChange = () => setIsAdminRoute(window.location.hash === '#admin');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const exitAdminRoute = () => {
    window.location.hash = '';
    setIsAdminRoute(false);
  };

  return { isAdminRoute, exitAdminRoute };
};

function AppInner() {
  const [activeTab, setActiveTab] = useState<TabType>('discover');
  const { isAdminRoute, exitAdminRoute } = useAdminRoute();
  const { signOut } = useAuth();
  const { profile } = useUserProfile();
  const [adminCodeAuthed, setAdminCodeAuthed] = useState(
    typeof window !== 'undefined' && sessionStorage.getItem('gigabyte-admin-session') === 'authed'
  );

  // Admin access: signed-in admin OR access-code authed
  const hasAdminAccess = profile?.role === 'admin' || adminCodeAuthed;

  // If URL hash is #admin, show admin flow (gated)
  if (isAdminRoute) {
    if (hasAdminAccess) {
      return (
        <div className="bg-bg min-h-screen text-text">
          <div className="max-w-6xl mx-auto">
            <AdminDashboard />
          </div>
          {/* Admin-only sign out bar */}
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-3 px-4 h-11 bg-surface/95 backdrop-blur-xl border border-border rounded-full shadow-2xl shadow-black/30">
              <span className="font-mono text-[10px] text-text-subtle uppercase tracking-wider">
                {profile?.role === 'admin' ? `Admin · ${profile.full_name || profile.email}` : 'Admin session'}
              </span>
              <button
                onClick={async () => {
                  sessionStorage.removeItem('gigabyte-admin-session');
                  setAdminCodeAuthed(false);
                  if (profile?.role === 'admin') await signOut();
                  exitAdminRoute();
                }}
                className="text-xs font-semibold text-error hover:opacity-80 transition-opacity"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <AdminGate
        onAuthed={() => setAdminCodeAuthed(true)}
        onExit={exitAdminRoute}
      />
    );
  }

  // Public app
  const renderContent = () => {
    switch (activeTab) {
      case 'discover': return <DiscoveryScreen />;
      case 'saved': return <SavedScreen />;
      case 'wallet': return <WalletScreen />;
      case 'dashboard': return <CustomerDashboard />;
      default: return <DiscoveryScreen />;
    }
  };

  return (
    <div className="bg-bg min-h-screen text-text">
      <div className="max-w-6xl mx-auto">
        {renderContent()}
      </div>

      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-[calc(100%-2rem)] md:max-w-none md:w-auto md:px-0">
        <div className="flex items-center gap-1 p-1.5 bg-surface/95 backdrop-blur-xl border border-border rounded-full shadow-2xl shadow-black/30 mx-auto w-fit">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 h-11 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-inverse text-inverse-text px-4'
                    : 'text-text-muted hover:text-text w-11 justify-center'
                }`}
                aria-label={tab.label}
              >
                <Icon size={17} strokeWidth={2.5} />
                {isActive && (
                  <span className="font-semibold text-xs md:text-sm whitespace-nowrap animate-fade-in">
                    {tab.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
