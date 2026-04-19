import { useState } from 'react';
import { Compass, Heart, Wallet, User } from 'lucide-react';
import { DiscoveryScreen } from './screens/DiscoveryScreen';
import { WalletScreen } from './screens/WalletScreen';
import { ProfileScreen } from './screens/ProfileScreen';

type TabType = 'discover' | 'saved' | 'wallet' | 'profile';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('discover');

  const renderContent = () => {
    switch (activeTab) {
      case 'discover':
        return <DiscoveryScreen />;
      case 'wallet':
        return <WalletScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'saved':
        return (
          <div className="min-h-screen bg-gigabyte-dark p-4">
            <h1 className="font-display text-3xl font-bold text-gigabyte-accent mb-6">Saved Events</h1>
            <div className="text-center py-12">
              <Heart size={48} className="mx-auto text-gigabyte-text-muted mb-4 opacity-50" />
              <p className="text-gigabyte-text-muted">Save events to view them here</p>
            </div>
          </div>
        );
      default:
        return <DiscoveryScreen />;
    }
  };

  return (
    <div className="bg-gigabyte-dark min-h-screen text-gigabyte-text">
      {/* Main content */}
      <div className="max-w-7xl mx-auto">
        {renderContent()}
      </div>

      {/* Bottom tab navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gigabyte-dark border-t border-gigabyte-surface max-w-7xl mx-auto">
        <div className="flex justify-around">
          <button
            onClick={() => setActiveTab('discover')}
            className={`flex-1 flex flex-col items-center justify-center py-4 transition-colors ${
              activeTab === 'discover'
                ? 'text-gigabyte-primary'
                : 'text-gigabyte-text-muted hover:text-gigabyte-text'
            }`}
          >
            <Compass size={24} />
            <span className="text-xs mt-1 font-medium">Discover</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 flex flex-col items-center justify-center py-4 transition-colors ${
              activeTab === 'saved'
                ? 'text-gigabyte-primary'
                : 'text-gigabyte-text-muted hover:text-gigabyte-text'
            }`}
          >
            <Heart size={24} />
            <span className="text-xs mt-1 font-medium">Saved</span>
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex-1 flex flex-col items-center justify-center py-4 transition-colors ${
              activeTab === 'wallet'
                ? 'text-gigabyte-primary'
                : 'text-gigabyte-text-muted hover:text-gigabyte-text'
            }`}
          >
            <Wallet size={24} />
            <span className="text-xs mt-1 font-medium">Wallet</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 flex flex-col items-center justify-center py-4 transition-colors ${
              activeTab === 'profile'
                ? 'text-gigabyte-primary'
                : 'text-gigabyte-text-muted hover:text-gigabyte-text'
            }`}
          >
            <User size={24} />
            <span className="text-xs mt-1 font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;
