'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  UserPlus,
  Users,
  UserCheck,
  Mail,
  Lock,
  Phone,
  CheckCircle2,
  Zap,
  Clock,
  ArrowRight,
  Edit3,
  Trash2,
  Search,
  ShieldCheck,
  Sliders,
  Award
} from 'lucide-react';

interface SalesExec {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE';
  assignedLeadsCount: number;
  contactedCount: number;
  wonCount: number;
  avgResponseTimeSeconds: number;
}

export default function TeamMembersPage() {
  const { user, switchRole } = useApp();
  const [team, setTeam] = useState<SalesExec[]>([
    {
      id: 'user-sales-1',
      name: 'Rohan Verma',
      email: 'rohan@apexrealestate.com',
      phone: '+91 98401 11223',
      role: 'SALES_USER',
      status: 'ACTIVE',
      assignedLeadsCount: 14,
      contactedCount: 12,
      wonCount: 4,
      avgResponseTimeSeconds: 245 // ~4 mins
    },
    {
      id: 'user-sales-2',
      name: 'Priya Sundaram',
      email: 'priya@apexrealestate.com',
      phone: '+91 98402 33445',
      role: 'SALES_USER',
      status: 'ACTIVE',
      assignedLeadsCount: 10,
      contactedCount: 9,
      wonCount: 3,
      avgResponseTimeSeconds: 320 // ~5.3 mins
    },
    {
      id: 'user-sales-3',
      name: 'Karthik Raja',
      email: 'karthik@apexrealestate.com',
      phone: '+91 98403 55667',
      role: 'SALES_MANAGER',
      status: 'ACTIVE',
      assignedLeadsCount: 8,
      contactedCount: 8,
      wonCount: 5,
      avgResponseTimeSeconds: 180 // ~3 mins
    }
  ]);

  const [autoAssignEnabled, setAutoAssignEnabled] = useState(true);
  const [assignmentStrategy, setAssignmentStrategy] = useState<'ROUND_ROBIN' | 'MANUAL'>('ROUND_ROBIN');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'SALES_USER' | 'SALES_MANAGER'>('SALES_USER');
  const [successMsg, setSuccessMsg] = useState('');

  const handleCreateSalesUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newExec: SalesExec = {
      id: `user-sales-${Date.now()}`,
      name,
      email,
      phone: phone || '+91 98400 00000',
      role,
      status: 'ACTIVE',
      assignedLeadsCount: 0,
      contactedCount: 0,
      wonCount: 0,
      avgResponseTimeSeconds: 300
    };

    setTeam([newExec, ...team]);
    setSuccessMsg(`Sales login for ${name} created successfully! Credentials sent.`);
    setTimeout(() => {
      setModalOpen(false);
      setName('');
      setEmail('');
      setPassword('');
      setPhone('');
      setSuccessMsg('');
    }, 1200);
  };

  const toggleUserStatus = (id: string) => {
    setTeam(prev =>
      prev.map(u => (u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : u))
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              REAL ESTATE SALES TEAM
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
              ROUND-ROBIN AUTO ASSIGNMENT
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Sales Team Login &amp; Auto-Assignment Engine
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Create logins for sales executives. Website and Meta leads will automatically get assigned via Round-Robin.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition"
        >
          <UserPlus size={16} />
          <span>Create Sales Team Login</span>
        </button>
      </div>

      {/* Auto-Assignment Engine Controls */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 p-6 rounded-2xl text-white shadow-xl space-y-4 border border-indigo-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
              <Zap className="text-amber-400" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Round-Robin Auto-Assignment Strategy
              </h3>
              <p className="text-xs text-slate-300">
                Incoming leads from Website API &amp; Meta Ads are automatically assigned to the active sales executive with the lowest workload.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 p-2.5 rounded-xl border border-white/15">
            <span className="text-xs font-bold">Auto-Assign:</span>
            <button
              onClick={() => setAutoAssignEnabled(!autoAssignEnabled)}
              className={`px-3 py-1 rounded-lg text-xs font-extrabold transition ${
                autoAssignEnabled
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {autoAssignEnabled ? 'ENABLED (ACTIVE)' : 'DISABLED'}
            </button>
          </div>
        </div>
      </div>

      {/* Sales Team Members Directory Table */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="text-indigo-600" size={18} />
            Active Sales Executives &amp; SLA Response Speed
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/70 font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Sales Executive Name</th>
                <th className="py-3 px-4">Role &amp; Credentials</th>
                <th className="py-3 px-4">Assigned Leads</th>
                <th className="py-3 px-4">Deals Won</th>
                <th className="py-3 px-4">Avg Response SLA</th>
                <th className="py-3 px-4">Round-Robin Status</th>
                <th className="py-3 px-4 text-right">Login Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {team.map((exec) => (
                <tr key={exec.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    {exec.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono">
                    <div>{exec.email}</div>
                    <div className="text-[10px] text-indigo-600 font-bold">{exec.role}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {exec.assignedLeadsCount} Leads
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">
                    {exec.wonCount} Closed Deals
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className="inline-flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                      <Clock size={12} className="text-amber-500" />
                      {Math.floor(exec.avgResponseTimeSeconds / 60)}m {exec.avgResponseTimeSeconds % 60}s
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => toggleUserStatus(exec.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        exec.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                      }`}
                    >
                      {exec.status === 'ACTIVE' ? '✓ ACTIVE IN ROUND-ROBIN' : 'PAUSED'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => switchRole('SALES_USER', 'tenant-101', 'Apex Real Estate', 'REAL_ESTATE')}
                      className="px-3 py-1.5 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 text-white rounded-lg text-[11px] font-bold transition inline-flex items-center gap-1"
                    >
                      <span>Login as Executive</span>
                      <ArrowRight size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal to Create Sales Executive Login */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 px-2.5 py-0.5 rounded-full">
                  REAL ESTATE ADMIN
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  Create Sales Executive Login
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {successMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleCreateSalesUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Sales Executive Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rohan Verma"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-indigo-500 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Work Email (Login ID) *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rohan@apexrealestate.com"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Initial Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98401 11223"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sales Role
                  </label>
                  <select
                    value={role}
                    onChange={(e: any) => setRole(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none font-bold"
                  >
                    <option value="SALES_USER">Sales Executive</option>
                    <option value="SALES_MANAGER">Sales Manager</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition text-xs flex items-center justify-center gap-2"
                >
                  <UserCheck size={16} />
                  <span>Create Login &amp; Enable Round-Robin</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
