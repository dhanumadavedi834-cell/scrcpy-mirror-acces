import React from 'react';
import { Smartphone, Download, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onDownloadPackage: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onDownloadPackage }) => {
  const navItems = [
    { id: 'console', label: 'Connection Console' },
    { id: 'wizard', label: 'Setup Guide' },
    { id: 'scripts', label: 'Scripts & Files' },
    { id: 'security', label: 'Persistence & Security' },
    { id: 'troubleshoot', label: 'Troubleshooting' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-6 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Smartphone className="w-4 h-4" />
          </div>
          <a
            href="#console"
            onClick={(e) => { e.preventDefault(); setActiveTab('console'); }}
            className="text-base font-bold tracking-tight text-white hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <span>Remote scrcpy Suite</span>
            <span className="text-xs font-normal text-slate-400 font-mono">v3.3.4</span>
          </a>
        </div>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 text-xs uppercase tracking-wider font-semibold ${
                activeTab === item.id
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onDownloadPackage}
            className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all flex items-center gap-2 shadow-sm hover:shadow-emerald-500/20 whitespace-nowrap shrink-0 cursor-pointer"
            title="Download complete zip package with all batch scripts and configuration"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Windows Kit (.ZIP)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
