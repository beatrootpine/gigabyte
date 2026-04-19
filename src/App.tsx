import { useState } from 'react';
import { Compass, Bookmark, Ticket, User } from 'lucide-react';
import { DiscoveryScreen } from './screens/DiscoveryScreen';
import { WalletScreen } from './screens/WalletScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SavedScreen } from './screens/SavedScreen';

type TabType = 'discover' | 'saved' | 'wallet' | 'profile';

const TABS: { id: TabType; label: string; icon: typeof Compass }[] = [
  { id: 'discover', label: 'Discover', icon: Compass },
  { id: 'saved', label: 'Saved', icon: Bookmark },
  { id: 'wallet', label: 'Wallet', icon: Ticket },
  { id: 'profile', label: 'Profile', icon: User },
];

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('discover');

  const renderContent = () => {
    switch (activeTab) {
      case 'discover': return <DiscoveryScreen />;
      case 'saved': return <SavedScreen />;
      case 'wallet': return <WalletScreen />;
      case 'profile': return <ProfileScreen />;
      default: return <DiscoveryScreen />;
    }
  };

  return (
    <div className="bg-ink-950 min-h-screen text-ink-50">
      <div className="max-w-5xl mx-auto">
        {renderContent()}
      </div>

      {/* Bottom nav - floating pill style */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-1 p-1.5 bg-ink-900/90 backdrop-blur-xl border border-ink-800 rounded-full shadow-2xl shadow-ink-black/50">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 h-11 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-ink-50 text-ink-950 px-5'
                    : 'text-ink-400 hover:text-ink-50 w-11 justify-center'
                }`}
              >
                <Icon size={18} strokeWidth={2.5} />
                {isActive && (
                  <span className="font-semibold text-sm whitespace-nowrap animate-fade-in">
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

export default App;
