import { useState } from 'react';
import { Compass, Bookmark, Ticket, LayoutDashboard, Shield } from 'lucide-react';
import { ThemeProvider } from './contexts/ThemeContext';
import { DiscoveryScreen } from './screens/DiscoveryScreen';
import { WalletScreen } from './screens/WalletScreen';
import { SavedScreen } from './screens/SavedScreen';
import { CustomerDashboard } from './screens/CustomerDashboard';
import { AdminDashboard } from './screens/AdminDashboard';

type TabType = 'discover' | 'saved' | 'wallet' | 'dashboard' | 'admin';

const TABS: { id: TabType; label: string; icon: typeof Compass }[] = [
  { id: 'discover', label: 'Discover', icon: Compass },
  { id: 'saved', label: 'Saved', icon: Bookmark },
  { id: 'wallet', label: 'Wallet', icon: Ticket },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'admin', label: 'Admin', icon: Shield },
];

function AppInner() {
  const [activeTab, setActiveTab] = useState<TabType>('discover');

  const renderContent = () => {
    switch (activeTab) {
      case 'discover': return <DiscoveryScreen />;
      case 'saved': return <SavedScreen />;
      case 'wallet': return <WalletScreen />;
      case 'dashboard': return <CustomerDashboard />;
      case 'admin': return <AdminDashboard />;
      default: return <DiscoveryScreen />;
    }
  };

  return (
    <div className="bg-bg min-h-screen text-text">
      <div className="max-w-6xl mx-auto">
        {renderContent()}
      </div>

      {/* Floating pill bottom nav */}
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
      <AppInner />
    </ThemeProvider>
  );
}

export default App;
