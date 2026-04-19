import React from 'react';
import { User, LogOut, Settings } from 'lucide-react';
import { Button } from '../components/Button';

export const ProfileScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gigabyte-dark p-4">
      <h1 className="font-display text-3xl font-bold text-gigabyte-accent mb-6">Profile</h1>

      {/* User avatar & info */}
      <div className="bg-gigabyte-surface p-6 rounded-lg mb-6 text-center">
        <div className="w-20 h-20 bg-gigabyte-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <User size={40} className="text-gigabyte-dark" />
        </div>
        <h2 className="font-display text-2xl font-bold text-gigabyte-text">Welcome back!</h2>
        <p className="text-gigabyte-text-muted text-sm">user@example.com</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gigabyte-surface p-4 rounded-lg text-center">
          <div className="font-display font-bold text-2xl text-gigabyte-accent">0</div>
          <p className="text-xs text-gigabyte-text-muted">Tickets</p>
        </div>
        <div className="bg-gigabyte-surface p-4 rounded-lg text-center">
          <div className="font-display font-bold text-2xl text-gigabyte-accent">0</div>
          <p className="text-xs text-gigabyte-text-muted">Favorites</p>
        </div>
        <div className="bg-gigabyte-surface p-4 rounded-lg text-center">
          <div className="font-display font-bold text-2xl text-gigabyte-accent">Free</div>
          <p className="text-xs text-gigabyte-text-muted">Tier</p>
        </div>
      </div>

      {/* Menu items */}
      <div className="space-y-2 mb-6">
        <button className="w-full flex items-center gap-3 bg-gigabyte-surface p-4 rounded-lg hover:bg-gigabyte-surface/80 transition-colors">
          <Settings size={20} className="text-gigabyte-primary" />
          <span className="font-medium text-gigabyte-text">Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 bg-gigabyte-surface p-4 rounded-lg hover:bg-gigabyte-surface/80 transition-colors">
          <LogOut size={20} className="text-gigabyte-error" />
          <span className="font-medium text-gigabyte-error">Sign out</span>
        </button>
      </div>

      {/* Subscription upgrade */}
      <div className="bg-gradient-to-r from-gigabyte-primary to-gigabyte-accent p-6 rounded-lg text-center">
        <h3 className="font-display font-bold text-gigabyte-dark mb-2">Upgrade to Pro</h3>
        <p className="text-sm text-gigabyte-dark/80 mb-4">Get exclusive discounts and early-bird access</p>
        <Button variant="ghost">Upgrade now</Button>
      </div>
    </div>
  );
};
