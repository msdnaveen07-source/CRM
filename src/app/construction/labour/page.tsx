'use client';

import React, { useState } from 'react';
import {
  Users,
  HardHat,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  DollarSign
} from 'lucide-react';

interface LabourEntry {
  id: string;
  subcontractor: string;
  tradeType: string;
  headcount: number;
  dailyRatePerHead: number;
  totalDailyPayout: number;
  siteLocation: string;
}

export default function LabourPage() {
  const [labourData] = useState<LabourEntry[]>([
    { id: 'l-1', subcontractor: 'Venkatesh Civil Works', tradeType: 'Masons & Shuttering', headcount: 24, dailyRatePerHead: 950, totalDailyPayout: 22800, siteLocation: 'Apex Commercial Tower' },
    { id: 'l-2', subcontractor: 'Shankar Steel Benders', tradeType: 'Bar Benders & Rebar', headcount: 16, dailyRatePerHead: 900, totalDailyPayout: 14400, siteLocation: 'Apex Commercial Tower' },
    { id: 'l-3', subcontractor: 'Murugan Electricals', tradeType: 'Conduit Electricians', headcount: 8, dailyRatePerHead: 1000, totalDailyPayout: 8000, siteLocation: 'Green Valley Villas' },
    { id: 'l-4', subcontractor: 'Direct Daily Labour', tradeType: 'Unskilled Helpers', headcount: 30, dailyRatePerHead: 650, totalDailyPayout: 19500, siteLocation: 'Apex Commercial Tower' }
  ]);

  const totalHeadcount = labourData.reduce((acc, l) => acc + l.headcount, 0);
  const totalDailyPayout = labourData.reduce((acc, l) => acc + l.totalDailyPayout, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
              WORKFORCE &amp; SUBCONTRACTORS
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
              DAILY LABOUR ATTENDANCE
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Daily Labour Headcount &amp; Wage Payouts
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track daily site headcount for masons, carpenters, bar benders, helpers, and contractor daily wages.
          </p>
        </div>

        <button
          onClick={() => alert('Log Daily Labour Muster Roll!')}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-md transition"
        >
          <Plus size={16} />
          <span>Record Daily Headcount</span>
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400 font-bold uppercase">Total Site Headcount Today</span>
          <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{totalHeadcount} Workers</p>
          <span className="text-[10px] text-emerald-600 font-semibold">100% Verified at Muster Gate</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400 font-bold uppercase">Total Daily Wage Payout</span>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">₹{totalDailyPayout.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-slate-400 font-semibold">Daily Site Expenditure</span>
        </div>
      </div>

      {/* Labour Muster Table */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HardHat size={18} className="text-amber-600" />
          Subcontractor &amp; Daily Labour Muster Roll
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/70 font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Subcontractor / Group</th>
                <th className="py-3 px-4">Trade / Skill Category</th>
                <th className="py-3 px-4">Headcount Today</th>
                <th className="py-3 px-4">Daily Rate Per Head</th>
                <th className="py-3 px-4 text-right">Total Daily Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {labourData.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{l.subcontractor}</td>
                  <td className="py-3.5 px-4 font-semibold text-indigo-600 dark:text-indigo-400">{l.tradeType}</td>
                  <td className="py-3.5 px-4 font-mono font-extrabold text-amber-600 text-sm">
                    {l.headcount} Workers
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">₹{l.dailyRatePerHead}/day</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600 text-sm">
                    ₹{l.totalDailyPayout.toLocaleString('en-IN')}
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
