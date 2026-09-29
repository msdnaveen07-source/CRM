'use client';

import React from 'react';
import { Megaphone, TrendingUp, DollarSign, Target, Percent } from 'lucide-react';

export default function CampaignsPage() {
  const campaigns = [
    {
      id: 'cmp-1',
      name: 'Luxury Villa Launch - Q3',
      platform: 'META',
      status: 'ACTIVE',
      leads: 142,
      spend: 48500,
      cpl: 341.5,
      contacted: 130,
      qualified: 48,
      won: 12,
      conversionRate: 8.45
    },
    {
      id: 'cmp-2',
      name: 'Penthouse Collection 2026',
      platform: 'META',
      status: 'ACTIVE',
      leads: 84,
      spend: 62000,
      cpl: 738.0,
      contacted: 79,
      qualified: 32,
      won: 9,
      conversionRate: 10.71
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Megaphone size={20} className="text-indigo-600" />
            Meta Ad Campaigns Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track lead performance, spend, CPL, qualified rate &amp; closed deals per Meta campaign.
          </p>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3.5 px-5">Campaign Name</th>
              <th className="py-3.5 px-5">Status</th>
              <th className="py-3.5 px-5">Leads Captured</th>
              <th className="py-3.5 px-5">Ad Spend (₹)</th>
              <th className="py-3.5 px-5">CPL (₹)</th>
              <th className="py-3.5 px-5">Qualified</th>
              <th className="py-3.5 px-5">Won Deals</th>
              <th className="py-3.5 px-5 text-right">Conversion Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {campaigns.map((cmp) => (
              <tr key={cmp.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                <td className="py-4 px-5 font-bold text-slate-900 dark:text-white text-sm">
                  {cmp.name}
                </td>
                <td className="py-4 px-5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                    {cmp.status}
                  </span>
                </td>
                <td className="py-4 px-5 font-semibold text-slate-900 dark:text-white">
                  {cmp.leads}
                </td>
                <td className="py-4 px-5 font-mono font-semibold">₹{cmp.spend.toLocaleString()}</td>
                <td className="py-4 px-5 font-mono text-indigo-600 font-bold">₹{cmp.cpl}</td>
                <td className="py-4 px-5 font-semibold text-slate-900 dark:text-white">
                  {cmp.qualified}
                </td>
                <td className="py-4 px-5 font-semibold text-emerald-600">{cmp.won}</td>
                <td className="py-4 px-5 text-right font-bold text-slate-900 dark:text-white">
                  {cmp.conversionRate}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
