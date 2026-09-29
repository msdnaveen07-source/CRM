'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Bell,
  Search,
  ShieldAlert,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  Check
} from 'lucide-react';
import { NotificationItem } from '@/types';

export function Header() {
  const { user, stopImpersonating, setCommandPaletteOpen } = useApp();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [reconciling, setReconciling] = useState(false);

  useEffect(() => {
    // Fetch notifications
    const mockNotifs: NotificationItem[] = [
      {
        id: 'n-1',
        tenantId: user.tenantId,
        title: 'MISSED LEAD ALERT ⚠️',
        message: 'Lead Ananya Deshmukh waiting > 10 minutes uncontacted.',
        category: 'MISSED_LEAD',
        read: false,
        createdAt: new Date(Date.now() - 15 * 60000).toISOString()
      },
      {
        id: 'n-2',
        tenantId: user.tenantId,
        title: 'New Meta Lead Received 🔔',
        message: 'Rajesh Nair submitted form Luxury Villa Inquiry.',
        category: 'NEW_LEAD',
        read: false,
        createdAt: new Date(Date.now() - 48 * 60000).toISOString()
      }
    ];
    setNotifications(mockNotifs);
  }, [user.tenantId]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const triggerReconciliation = async () => {
    setReconciling(true);
    try {
      await fetch(`/api/reconcile?tenantId=${user.tenantId}`, { method: 'POST' });
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setReconciling(false), 800);
    }
  };

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search & Breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          <Search size={14} />
          <span>Quick command search...</span>
          <kbd className="ml-4 font-mono text-[10px] bg-white dark:bg-slate-900 px-1 py-0.5 rounded border border-slate-300 dark:border-slate-700">
            Ctrl+K
          </kbd>
        </button>

        {/* Impersonation Banner */}
        {user.isImpersonating && (
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-lg text-xs font-medium animate-pulse">
            <ShieldAlert size={14} />
            <span>Impersonating Client: {user.impersonatedTenantName || user.tenantId}</span>
            <button
              onClick={stopImpersonating}
              className="ml-2 font-bold underline hover:text-amber-700"
            >
              Exit Impersonation
            </button>
          </div>
        )}
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        {/* Manual 10-min Sync Trigger */}
        <button
          onClick={triggerReconciliation}
          disabled={reconciling}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition"
          title="Run 10-Minute Meta Reconciliation & SLA Missed Lead Engine"
        >
          <RefreshCw size={13} className={reconciling ? 'animate-spin text-indigo-600' : ''} />
          <span>{reconciling ? 'Reconciling...' : 'Run Sync'}</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 relative"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-xs text-slate-900 dark:text-white">
                  Notifications ({unreadCount})
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-2 mt-2 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No new notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-lg text-xs transition ${
                        n.read
                          ? 'bg-slate-50 dark:bg-slate-800/40 text-slate-500'
                          : 'bg-indigo-50/60 dark:bg-indigo-950/40 text-slate-900 dark:text-slate-200 font-medium'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px]">{n.title}</span>
                        <span className="text-[9px] text-slate-400">
                          {new Date(n.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
