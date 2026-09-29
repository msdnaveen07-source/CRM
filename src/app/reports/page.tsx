'use client';

import React from 'react';
import { FileSpreadsheet, Download, FileText, Printer } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function ReportsPage() {
  const { user } = useApp();

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Lead ID,Full Name,Phone,Campaign,Status,Created At\nlead-1001,Ananya Deshmukh,+919892011223,Luxury Villa Launch,NEW,2026-09-28\nlead-1002,Rajesh Nair,+919711233445,Penthouse Collection,CONTACTED,2026-09-28';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LeadFlow_Export_${user.tenantId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet size={20} className="text-indigo-600" />
            CRM Lead Reports &amp; Export
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate and export scoped CSV/Excel lead reports for your tenant account.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition"
        >
          <Download size={14} />
          <span>Export Scoped CSV</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <FileText className="text-indigo-600" size={20} />
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Daily Lead Summary</h3>
          <p className="text-slate-500">Comprehensive breakdown of leads captured today, response SLA compliance, and rep activity.</p>
          <button onClick={handleExportCSV} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline block pt-2">
            Download PDF / CSV
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <FileText className="text-emerald-600" size={20} />
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Missed Lead Audit Report</h3>
          <p className="text-slate-500">Audit trail of leads that breached the 10-minute SLA deadline and escalation history.</p>
          <button onClick={handleExportCSV} className="text-emerald-600 font-bold hover:underline block pt-2">
            Download PDF / CSV
          </button>
        </div>
      </div>
    </div>
  );
}
