"use client";

import { LogOut } from 'lucide-react';

interface DashboardHeaderProps {
  phoneNumber?: string | null;
  developerMode: boolean;
  onToggleDeveloperMode: () => void;
  onLogout: () => void;
}

export function DashboardHeader({
  phoneNumber,
  developerMode,
  onToggleDeveloperMode,
  onLogout,
}: DashboardHeaderProps) {
  return (
    <header className="bg-emerald-950 text-stone-100 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        <span className="font-serif text-xl tracking-wider">
          dhrubotara <span className="text-emerald-400 text-sm font-sans tracking-normal ml-2">Admin</span>
        </span>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={onToggleDeveloperMode}
            className={`text-xs px-2.5 py-1 rounded-sm border transition-all cursor-pointer active:scale-95 ${
              developerMode
                ? 'border-emerald-400 bg-emerald-900 text-emerald-100'
                : 'border-emerald-800 text-stone-400 hover:text-stone-200'
            }`}
            aria-pressed={developerMode}
          >
            Developer
          </button>
          <span className="text-xs text-stone-400 hidden sm:inline">
            {phoneNumber || 'Demo User'}
          </span>
          <button
            onClick={onLogout}
            className="flex items-center text-sm hover:text-white transition-all cursor-pointer active:scale-95"
          >
            <LogOut size={16} className="mr-2" /> Logout
          </button>
        </div>
      </div>
    </header>
  );
}
