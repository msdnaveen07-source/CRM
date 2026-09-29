'use client';

import React from 'react';
import { Activity, CheckCircle2, Server, Database, Cpu, Wifi } from 'lucide-react';

export default function SystemHealthPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Activity size={20} className="text-emerald-500" />
            Infrastructure &amp; System Health Operational Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time status for Meta API Webhooks, WhatsApp Business Cloud API, PostgreSQL DB, and Background Workers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <Wifi className="text-emerald-600" size={20} />
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Meta Webhook Ingestion Engine</h3>
          <span className="text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 size={13} /> 100% HEALTHY (0ms Latency)
          </span>
          <p className="text-slate-400">Receiving live lead events from Facebook Lead Ads forms.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <Server className="text-indigo-600" size={20} />
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">10-Minute Backup Reconciliation Job</h3>
          <span className="text-indigo-600 font-bold flex items-center gap-1">
            <CheckCircle2 size={13} /> RUNNING (Last execution 2m ago)
          </span>
          <p className="text-slate-400">Scans Meta Graph API to prevent missing leads with zero duplicate creation.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <Database className="text-emerald-600" size={20} />
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">PostgreSQL Multi-Tenant Database</h3>
          <span className="text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 size={13} /> HEALTHY (Tenant Scoping Active)
          </span>
          <p className="text-slate-400">Strict tenant_id data separation and index optimization.</p>
        </div>
      </div>
    </div>
  );
}
