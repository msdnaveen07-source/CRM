'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  Car,
  UserCheck,
  CheckCircle2,
  Phone,
  Plus,
  Search,
  MessageSquare
} from 'lucide-react';

interface SiteVisit {
  id: string;
  leadName: string;
  leadPhone: string;
  property: string;
  visitDate: string;
  timeSlot: string;
  assignedRM: string;
  cabAssigned: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'NO_SHOW' | 'CANCELLED';
}

export default function SiteVisitsPage() {
  const [visits, setVisits] = useState<SiteVisit[]>([
    {
      id: 'sv-1',
      leadName: 'Rajesh Subramanian',
      leadPhone: '+91 98401 99887',
      property: 'Apex Luxury Palms - Villa 12-A',
      visitDate: 'Sept 30, 2026',
      timeSlot: '11:00 AM',
      assignedRM: 'Rohan Verma',
      cabAssigned: 'Toyota Innova (TN 09 CB 4021)',
      status: 'SCHEDULED'
    },
    {
      id: 'sv-2',
      leadName: 'Anand Kumar',
      leadPhone: '+91 98402 88776',
      property: 'Greenwood Estates - Plot 45',
      visitDate: 'Sept 29, 2026',
      timeSlot: '03:30 PM',
      assignedRM: 'Vikram Sharma',
      cabAssigned: 'Honda City (TN 01 AK 9900)',
      status: 'COMPLETED'
    }
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              REAL ESTATE SALES SLA
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
              SITE VISIT MANAGER
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Site Visit Scheduler &amp; Pickup Cab Dispatch
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Schedule customer property visits, assign Relationship Managers, and send WhatsApp driver details to buyers.
          </p>
        </div>

        <button
          onClick={() => alert('New Site Visit Booking Form Triggered!')}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition"
        >
          <Plus size={16} />
          <span>Schedule Site Visit</span>
        </button>
      </div>

      {/* Site Visit Table */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MapPin size={18} className="text-indigo-600" />
          Scheduled Customer Site Visits
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/70 font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Property Interested</th>
                <th className="py-3 px-4">Visit Date &amp; Time</th>
                <th className="py-3 px-4">Assigned RM &amp; Cab Pickup</th>
                <th className="py-3 px-4 text-right">Status &amp; Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {visits.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{v.leadName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{v.leadPhone}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-indigo-600 dark:text-indigo-400">
                    {v.property}
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <div>{v.visitDate}</div>
                    <div className="text-[10px] text-slate-500">{v.timeSlot}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{v.assignedRM}</div>
                    <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                      <Car size={12} />
                      <span>{v.cabAssigned}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => alert(`WhatsApp location & driver details sent to ${v.leadName}!`)}
                        className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-lg font-bold text-[11px] transition flex items-center gap-1"
                      >
                        <MessageSquare size={13} />
                        <span>Send Driver Info</span>
                      </button>
                    </div>
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
