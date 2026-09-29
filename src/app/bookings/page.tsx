'use client';

import React, { useState } from 'react';
import {
  Key,
  CheckCircle2,
  Clock,
  Printer,
  Send,
  MessageSquare,
  FileSpreadsheet,
  Award
} from 'lucide-react';

interface Booking {
  id: string;
  unitNo: string;
  buyerName: string;
  buyerPhone: string;
  totalCostLakhs: number;
  tokenAdvancePaid: number;
  loanStatus: 'APPROVED' | 'IN_PROCESS' | 'SELF_FUNDED';
  bookingDate: string;
}

export default function BookingsPage() {
  const [bookings] = useState<Booking[]>([
    {
      id: 'bk-1',
      unitNo: 'Villa 14-B',
      buyerName: 'Vikramaditya R.',
      buyerPhone: '+91 98409 11223',
      totalCostLakhs: 210,
      tokenAdvancePaid: 500000,
      loanStatus: 'APPROVED',
      bookingDate: 'Sept 28, 2026'
    },
    {
      id: 'bk-2',
      unitNo: 'Apt 402',
      buyerName: 'Suresh Kumar',
      buyerPhone: '+91 98765 43210',
      totalCostLakhs: 98,
      tokenAdvancePaid: 200000,
      loanStatus: 'IN_PROCESS',
      bookingDate: 'Sept 25, 2026'
    }
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              REAL ESTATE TRANSACTIONS
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
              TOKEN &amp; BOOKING REGISTRATION
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Property Bookings &amp; Payment Milestones
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track token advance receipts, bank loan approvals, and generate booking confirmation letters.
          </p>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Key size={18} className="text-indigo-600" />
          Active Property Unit Bookings
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/70 font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Unit Number</th>
                <th className="py-3 px-4">Buyer Details</th>
                <th className="py-3 px-4">Total Cost</th>
                <th className="py-3 px-4">Token Advance Paid</th>
                <th className="py-3 px-4">Bank Loan Status</th>
                <th className="py-3 px-4 text-right">Booking Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-bold text-indigo-600 dark:text-indigo-400 text-sm">{b.unitNo}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{b.buyerName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{b.buyerPhone}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    ₹{b.totalCostLakhs} Lakhs
                  </td>
                  <td className="py-3.5 px-4 font-mono font-extrabold text-emerald-600">
                    ₹{(b.tokenAdvancePaid / 100000).toFixed(2)} Lakhs
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold rounded-full text-[10px]">
                      {b.loanStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => alert(`Booking confirmation receipt sent to buyer (${b.buyerPhone}) via WhatsApp!`)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1 ml-auto"
                    >
                      <Send size={13} />
                      <span>Send WhatsApp Receipt</span>
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
