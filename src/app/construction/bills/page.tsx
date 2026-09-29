'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  Clock,
  Printer,
  Send,
  Download,
  Building
} from 'lucide-react';

interface StageInvoice {
  id: string;
  projectName: string;
  clientName: string;
  clientPhone: string;
  stageName: string;
  invoiceAmountLakhs: number;
  dueDate: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
}

export default function ConstructionBillsPage() {
  const [invoices] = useState<StageInvoice[]>([
    {
      id: 'inv-101',
      projectName: 'Apex Commercial Tower',
      clientName: 'Apex Holdings Pvt Ltd',
      clientPhone: '+91 98409 11223',
      stageName: 'Stage 4: 9th Floor Slab Concrete Completion (20%)',
      invoiceAmountLakhs: 45.0,
      dueDate: 'Oct 05, 2026',
      status: 'PENDING'
    },
    {
      id: 'inv-102',
      projectName: 'Green Valley Premium Villas',
      clientName: 'Greenwood Developers',
      clientPhone: '+91 98765 43210',
      stageName: 'Stage 3: Brickwork & Internal Plastering (25%)',
      invoiceAmountLakhs: 62.5,
      dueDate: 'Sept 20, 2026',
      status: 'PAID'
    }
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
              COMMERCIAL BILLING &amp; BLUEPRINTS
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
              STAGE PAYMENT INVOICES
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Client Stage Billing &amp; Architect Blueprints
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Generate milestone stage-wise construction bills, architectural drawings, and WhatsApp payment receipts.
          </p>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileSpreadsheet size={18} className="text-amber-600" />
          Construction Milestone Invoices
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/70 font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Project &amp; Client</th>
                <th className="py-3 px-4">Construction Milestone Stage</th>
                <th className="py-3 px-4">Stage Bill Amount</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Actions &amp; WhatsApp Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    <div>{inv.projectName}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{inv.clientName} ({inv.clientPhone})</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-indigo-600 dark:text-indigo-400">{inv.stageName}</td>
                  <td className="py-3.5 px-4 font-mono font-extrabold text-amber-600 text-sm">
                    ₹{inv.invoiceAmountLakhs} Lakhs
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{inv.dueDate}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => alert(`Construction stage bill sent to client (${inv.clientPhone}) via WhatsApp!`)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1 ml-auto"
                    >
                      <Send size={13} />
                      <span>Send WhatsApp Invoice</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
