'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Inbox,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  UserCheck,
  Zap,
  ArrowUpRight,
  Share2,
  MessageSquare,
  GraduationCap,
  Users,
  CalendarCheck,
  BookOpen,
  Building2,
  Award,
  Bot
} from 'lucide-react';
import Link from 'next/link';

export default function ClientDashboardPage() {
  const { user, switchRole } = useApp();
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiFollowupEnabled, setAiFollowupEnabled] = useState(false);

  // Education category specific state
  const [studentAttendance, setStudentAttendance] = useState([
    { id: 'st-1', name: 'Aarav Kumar', class: 'Grade 10-A', status: 'PRESENT', time: '08:30 AM' },
    { id: 'st-2', name: 'Kavya S.', class: 'Grade 10-A', status: 'PRESENT', time: '08:32 AM' },
    { id: 'st-3', name: 'Rahul Dravid', class: 'Grade 10-B', status: 'ABSENT', time: '-' },
    { id: 'st-4', name: 'Priya Sharma', class: 'Grade 9-A', status: 'PRESENT', time: '08:45 AM' }
  ]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch(`/api/analytics?tenantId=${user.tenantId}`);
        const data = await res.json();
        if (data.success) {
          setMetrics(data.metrics);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, [user.tenantId]);

  const category = user.businessCategory || 'REAL_ESTATE';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Client Header with Category Pill */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              {category.replace('_', ' ')} CATEGORY DASHBOARD
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
              ROLE: {user.role}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back, {user.name} 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {category === 'EDUCATION'
              ? 'Manage admissions, course enquiries, teacher portal, student directory & attendance records.'
              : 'Here is what is happening with your leads, customer enquiries, and sales pipeline today.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/leads"
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white rounded-xl font-medium text-xs transition shadow-sm"
          >
            <Inbox size={15} />
            <span>Open Enquiries Inbox</span>
          </Link>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. DYNAMIC CATEGORY: EDUCATION DASHBOARD */}
      {/* ========================================================= */}
      {category === 'EDUCATION' ? (
        <div className="space-y-6">
          {/* Education Specific KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Admission Enquiries</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">45</p>
              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-0.5 mt-1">
                <ArrowUpRight size={12} /> +18% this week
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Students</p>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">890</p>
              <span className="text-[11px] text-slate-400 mt-1 block">Enrolled 2026 Batch</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Teachers &amp; Faculty</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">42</p>
              <span className="text-[11px] text-emerald-600 font-medium mt-1 block">100% Present</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Today Attendance</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">94.8%</p>
              <span className="text-[11px] text-emerald-600 font-medium mt-1 block">844 / 890 Present</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Fees Pending</p>
              <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-2">₹18.4L</p>
              <span className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1">
                <AlertTriangle size={12} /> 124 Students Defaulted
              </span>
            </div>
          </div>

          {/* AI Smart Fee Recovery & Parent Communication Engine */}
          <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 p-6 rounded-2xl text-white shadow-xl space-y-4 border border-rose-800/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center shrink-0">
                  <MessageSquare className="text-amber-400" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    AI Auto-Fee Reminder &amp; Recovery Engine
                    <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-400 font-extrabold tracking-widest uppercase">
                      Active
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                    Automatically scans the defaulters list and sends personalized, polite WhatsApp fee reminders with payment links to parents 3 days before the due date and on overdue dates.
                  </p>
                </div>
              </div>
              <button
                onClick={() => alert('Sending bulk WhatsApp fee reminders to 124 parents now...')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg transition"
              >
                <Zap size={14} /> Send Smart Alerts Now
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10 mt-2">
              <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Automated Reminders Sent</p>
                <p className="text-lg font-bold text-white mt-0.5">342 This Month</p>
              </div>
              <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Fees Recovered via WhatsApp</p>
                <p className="text-lg font-bold text-emerald-400 mt-0.5">₹5.2 Lakhs</p>
              </div>
              <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Parents Unreachable</p>
                <p className="text-lg font-bold text-rose-400 mt-0.5">8 Numbers Invalid</p>
              </div>
            </div>
          </div>

          {/* Student Fee Defaulters List */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-rose-200 dark:border-rose-900/50 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <AlertTriangle size={18} className="text-rose-600" />
                  Action Required: Student Fee Defaulters
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">List of students with pending fees categorized by grade.</p>
              </div>
              <button 
                onClick={() => alert('Opening full list of 124 defaulters... (This would open a detailed table/modal)')}
                className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition"
              >
                View All 124 Defaulters
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-rose-50 dark:bg-rose-950/20 font-semibold text-slate-600 dark:text-slate-400 border-b border-rose-100 dark:border-rose-900/30">
                  <tr>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Grade / Section</th>
                    <th className="py-3 px-4">Pending Amount</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">Arun Kumar</td>
                    <td className="py-3 px-4 font-medium text-slate-500">Grade 10 - A</td>
                    <td className="py-3 px-4 font-bold text-rose-600">₹ 45,000</td>
                    <td className="py-3 px-4 text-slate-500">15 Aug, 2026</td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => alert('Sending automated WhatsApp fee reminder to Sneha Reddy...')}
                        className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 rounded flex items-center justify-end gap-1 font-semibold hover:bg-emerald-200 transition ml-auto"
                      >
                        <MessageSquare size={12} /> Send Alert
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">Sneha Reddy</td>
                    <td className="py-3 px-4 font-medium text-slate-500">Grade 8 - C</td>
                    <td className="py-3 px-4 font-bold text-rose-600">₹ 32,500</td>
                    <td className="py-3 px-4 text-slate-500">01 Sep, 2026</td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => alert('Sending automated WhatsApp fee reminder to Karthik M...')}
                        className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 rounded flex items-center justify-end gap-1 font-semibold hover:bg-emerald-200 transition ml-auto"
                      >
                        <MessageSquare size={12} /> Send Alert
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">Karthik M.</td>
                    <td className="py-3 px-4 font-medium text-slate-500">Grade 12 - Sci</td>
                    <td className="py-3 px-4 font-bold text-rose-600">₹ 60,000</td>
                    <td className="py-3 px-4 text-slate-500">10 Sep, 2026</td>
                    <td className="py-3 px-4 text-right">
                      <button className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 rounded flex items-center justify-end gap-1 font-semibold hover:bg-emerald-200 transition ml-auto">
                        <MessageSquare size={12} /> Send Alert
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Education Sub-Portals & Grade-wise Attendance */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Grade-wise Student & Teacher Attendance */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Grade-wise Student Attendance */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    <CalendarCheck size={18} className="text-indigo-600" />
                    Grade-wise Student Attendance
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">Date: Sept 28, 2026</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="font-bold text-slate-900 dark:text-white">Grade 10</p>
                    <div className="flex items-end justify-between mt-2">
                      <span className="text-xl font-bold text-emerald-600">96%</span>
                      <span className="text-[10px] text-slate-400">142/148</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="font-bold text-slate-900 dark:text-white">Grade 9</p>
                    <div className="flex items-end justify-between mt-2">
                      <span className="text-xl font-bold text-emerald-600">92%</span>
                      <span className="text-[10px] text-slate-400">138/150</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="font-bold text-slate-900 dark:text-white">Grade 8</p>
                    <div className="flex items-end justify-between mt-2">
                      <span className="text-xl font-bold text-amber-500">88%</span>
                      <span className="text-[10px] text-slate-400">110/125</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="font-bold text-slate-900 dark:text-white">Grade 7</p>
                    <div className="flex items-end justify-between mt-2">
                      <span className="text-xl font-bold text-emerald-600">98%</span>
                      <span className="text-[10px] text-slate-400">145/148</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Teacher Attendance Tracking */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    <Users size={18} className="text-emerald-600" />
                    Teacher &amp; Faculty Live Attendance
                  </h3>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full">
                    42 / 45 Present Today
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Faculty Name</th>
                        <th className="py-3 px-4">Department</th>
                        <th className="py-3 px-4">Punch In Time</th>
                        <th className="py-3 px-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">Mrs. Anitha S.</td>
                        <td className="py-3 px-4 text-slate-500">Mathematics</td>
                        <td className="py-3 px-4 font-mono">07:45 AM</td>
                        <td className="py-3 px-4 text-right">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-600">PRESENT</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">Mr. Rajesh K.</td>
                        <td className="py-3 px-4 text-slate-500">Physics</td>
                        <td className="py-3 px-4 font-mono">07:50 AM</td>
                        <td className="py-3 px-4 text-right">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-600">PRESENT</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">Ms. Priya M.</td>
                        <td className="py-3 px-4 text-slate-500">English</td>
                        <td className="py-3 px-4 font-mono">-</td>
                        <td className="py-3 px-4 text-right">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-600">ON LEAVE</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Specialized Role Quick Access */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <GraduationCap size={18} className="text-indigo-600" />
                Education Role Portals
              </h3>

              <div className="space-y-3 text-xs">
                <button
                  onClick={() => switchRole('TEACHER', 'tenant-104', 'Oxford Academy', 'EDUCATION')}
                  className="w-full p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/40 text-left space-y-1 hover:border-indigo-500 transition"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-indigo-900 dark:text-indigo-300">Teacher Login Portal</span>
                    <BookOpen size={14} className="text-indigo-600" />
                  </div>
                  <p className="text-slate-500 text-[11px]">Mark attendance, enter exam grades &amp; send parent alerts</p>
                </button>

                <button
                  onClick={() => switchRole('STUDENT', 'tenant-104', 'Oxford Academy', 'EDUCATION')}
                  className="w-full p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/40 text-left space-y-1 hover:border-emerald-500 transition"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-emerald-900 dark:text-emerald-300">Student &amp; Parent Login</span>
                    <Users size={14} className="text-emerald-600" />
                  </div>
                  <p className="text-slate-500 text-[11px]">View class schedules, homework &amp; attendance scorecard</p>
                </button>

                <button
                  onClick={() => switchRole('SALES_MANAGER', 'tenant-104', 'Oxford Academy', 'EDUCATION')}
                  className="w-full p-3.5 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/40 text-left space-y-1 hover:border-amber-500 transition"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-amber-900 dark:text-amber-300">Admissions Lead Manager</span>
                    <Award size={14} className="text-amber-600" />
                  </div>
                  <p className="text-slate-500 text-[11px]">Track student lead pipelines &amp; counselor call SLAs</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================= */
        /* 2. DYNAMIC CATEGORY: REAL ESTATE / GENERAL CRM DASHBOARD  */
        /* ========================================================= */
        <div className="space-y-6">
          {/* KPI Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">New Leads</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{metrics?.newLeads ?? 24}</p>
              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-0.5 mt-1">
                <ArrowUpRight size={12} /> +12% vs yesterday
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Contacted</p>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">{metrics?.contactedLeads ?? 18}</p>
              <span className="text-[11px] text-slate-400 mt-1 block">Within 8m SLA</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Follow-ups Due</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">{metrics?.followupsDue ?? 14}</p>
              <span className="text-[11px] text-amber-600 font-medium mt-1 block">Action required today</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Site Visits</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{metrics?.qualifiedLeads ?? 8}</p>
              <span className="text-[11px] text-emerald-600 font-medium mt-1 block">High Intent</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Booked Villas</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">{metrics?.wonLeads ?? 5}</p>
              <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Closed Deals</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Missed (&gt;10m)</p>
              <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-2">{metrics?.missedLeads ?? 2}</p>
              <span className="text-[11px] text-rose-600 font-medium mt-1 block">SLA Breached</span>
            </div>
          </div>

          {/* SLA Speedometer & Active Connections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap size={16} className="text-amber-500" />
                  Response Speed SLA &amp; Missed Lead Detector
                </h2>
                <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                  Target: &lt; 10 Minutes
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Average First Response</span>
                  <span className="text-xl font-bold text-slate-900 dark:text-white mt-1 block">7m 10s</span>
                  <span className="text-[10px] text-emerald-600 font-medium">Within target</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Fastest Response</span>
                  <span className="text-xl font-bold text-emerald-600 mt-1 block">1m 45s</span>
                  <span className="text-[10px] text-slate-400">Instant contact</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">SLA Compliance</span>
                  <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1 block">92.4%</span>
                  <span className="text-[10px] text-indigo-600">High performance</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Active Connections</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                  <div className="flex items-center gap-2">
                    <Share2 size={16} className="text-blue-600" />
                    <span className="font-semibold">Meta Lead Ads</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                    CONNECTED
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} className="text-emerald-600" />
                    <span className="font-semibold">WhatsApp Alerts</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                    CONNECTED
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Smart Auto-Recovery Engine (Problem Solving Feature) */}
          <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 p-6 rounded-2xl text-white shadow-xl space-y-4 border border-indigo-800/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
                  <Bot className="text-amber-400" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    AI Smart Auto-Followup Engine
                    <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-400 font-extrabold tracking-widest uppercase">
                      New
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                    Solves lead leakage by automatically sending a smart WhatsApp message to leads untouched for 2+ days. Re-engages them and notifies the assigned sales executive.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 p-2.5 rounded-xl border border-white/15">
                <span className="text-xs font-bold whitespace-nowrap">Engine Status:</span>
                <button
                  onClick={() => setAiFollowupEnabled(!aiFollowupEnabled)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition whitespace-nowrap ${
                    aiFollowupEnabled
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  }`}
                >
                  {aiFollowupEnabled ? 'ENABLED (ACTIVE)' : 'DISABLED'}
                </button>
              </div>
            </div>

            {aiFollowupEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10 mt-2">
                <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Leads Re-engaged</p>
                  <p className="text-lg font-bold text-white mt-0.5">14</p>
                </div>
                <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Revenue Saved (Est)</p>
                  <p className="text-lg font-bold text-emerald-400 mt-0.5">₹24.5 {category === 'REAL_ESTATE' ? 'Lakhs' : 'K'}</p>
                </div>
                <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Next Batch Trigger</p>
                  <p className="text-lg font-bold text-amber-400 mt-0.5">Today, 6:00 PM</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
