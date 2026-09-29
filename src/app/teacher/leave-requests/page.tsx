'use client';

import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  UserCheck,
  Search
} from 'lucide-react';

interface LeaveRequest {
  id: string;
  studentName: string;
  className: string;
  parentName: string;
  parentPhone: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export default function LeaveRequestsPage() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: 'lr-1',
      studentName: 'Rahul Dravid M.',
      className: 'Grade 10-A',
      parentName: 'Murugan P.',
      parentPhone: '+91 98765 43212',
      startDate: 'Sept 29, 2026',
      endDate: 'Sept 30, 2026',
      reason: 'Fever and doctor advised 2 days rest',
      status: 'PENDING'
    },
    {
      id: 'lr-2',
      studentName: 'Priya Sharma',
      className: 'Grade 10-A',
      parentName: 'Vijay Sharma',
      parentPhone: '+91 98765 43213',
      startDate: 'Oct 02, 2026',
      endDate: 'Oct 03, 2026',
      reason: 'Family function in hometown',
      status: 'APPROVED'
    }
  ]);

  const [alertMsg, setAlertMsg] = useState('');

  const handleUpdateStatus = (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    const req = leaveRequests.find(r => r.id === id);
    if (!req) return;

    setLeaveRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
    );

    setAlertMsg(
      `📲 WhatsApp notification sent to parent (${req.parentPhone}): Leave request for ${req.studentName} has been ${newStatus.toLowerCase()} by Prof. Anitha.`
    );
    setTimeout(() => setAlertMsg(''), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              PARENT PORTAL INTEGRATION
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
              LEAVE APPROVALS
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Student Leave Applications
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review leave notes submitted by parents, approve requests, and send auto WhatsApp confirmations.
          </p>
        </div>
      </div>

      {alertMsg && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <MessageSquare size={18} className="text-emerald-600 shrink-0" />
          <p className="font-mono">{alertMsg}</p>
        </div>
      )}

      {/* Leave Requests List */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CalendarCheck size={18} className="text-indigo-600" />
          Student Leave Applications Roster
        </h2>

        <div className="space-y-3">
          {leaveRequests.map((req) => (
            <div key={req.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{req.studentName}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {req.className}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Parent: <span className="font-semibold text-slate-700 dark:text-slate-200">{req.parentName}</span> ({req.parentPhone})
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Reason: &quot;{req.reason}&quot; • <span className="font-mono text-indigo-600 dark:text-indigo-400">{req.startDate} to {req.endDate}</span>
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {req.status === 'PENDING' ? (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(req.id, 'APPROVED')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition flex items-center gap-1"
                    >
                      <CheckCircle2 size={14} />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(req.id, 'REJECTED')}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs transition flex items-center gap-1"
                    >
                      <XCircle size={14} />
                      <span>Reject</span>
                    </button>
                  </>
                ) : (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      req.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {req.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
