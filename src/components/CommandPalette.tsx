'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Search, Inbox, Users, Clock, ArrowRight, X, Megaphone, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useApp();
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const navigateTo = (path: string) => {
    setCommandPaletteOpen(false);
    router.push(path);
  };

  const actions = [
    { label: 'View Leads Inbox', icon: Inbox, path: '/leads', category: 'Navigation' },
    { label: 'View Follow-ups SLA', icon: Clock, path: '/followups', category: 'Navigation' },
    { label: 'View Meta Ads Integration', icon: Megaphone, path: '/integrations/meta', category: 'Integrations' },
    { label: 'Super Admin HQ', icon: Users, path: '/admin', category: 'Admin' },
    { label: 'System Health & Worker Status', icon: FileText, path: '/admin/health', category: 'Admin' }
  ];

  const filtered = actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-24 p-4">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
          <Search size={18} className="text-slate-400 mr-3" />
          <input
            type="text"
            placeholder="Type a command or search leads..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-4 text-slate-900 dark:text-white bg-transparent outline-none text-sm placeholder-slate-400"
            autoFocus
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="p-1 rounded text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching commands or leads found.
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.label}
                onClick={() => navigateTo(item.path)}
                className="w-full flex items-center justify-between p-3 text-left rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 group transition"
              >
                <div className="flex items-center gap-3 text-xs font-medium">
                  <item.icon size={16} className="text-slate-400 group-hover:text-indigo-600" />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800">
                    {item.category}
                  </span>
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition" />
                </div>
              </button>
            ))
          )}
        </div>

        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex justify-between text-[11px] text-slate-400">
          <span>Navigate with ↑ ↓ keys</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}
