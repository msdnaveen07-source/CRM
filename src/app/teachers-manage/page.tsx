'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  UserPlus,
  Users,
  BookOpen,
  Mail,
  Lock,
  Phone,
  Building,
  CheckCircle2,
  ShieldCheck,
  Search,
  Key,
  UserCheck,
  MapPin,
  ArrowRight,
  Edit3,
  Trash2,
  Clock,
  Layers
} from 'lucide-react';

interface PeriodConfig {
  periodNo: number;
  time: string;
  class: string;
  subject: string;
  room: string;
}

interface TeacherItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  department: string;
  assignedClasses: string[];
  periods?: PeriodConfig[];
  status: string;
  geoPunchIn?: {
    status: string;
    time: string;
    location: string;
  };
}

const defaultPeriods: PeriodConfig[] = [
  { periodNo: 1, time: '08:30 AM - 09:15 AM', class: 'Grade 10-A', subject: 'Mathematics', room: 'Room 204' },
  { periodNo: 2, time: '09:20 AM - 10:05 AM', class: 'Grade 9-A', subject: 'Mathematics', room: 'Room 102' },
  { periodNo: 3, time: '10:15 AM - 11:00 AM', class: 'Grade 10-B', subject: 'Mathematics', room: 'Room 205' },
  { periodNo: 4, time: '11:05 AM - 11:50 AM', class: 'Free / Staff Room', subject: 'Lesson Planning', room: 'Faculty Block' },
  { periodNo: 5, time: '12:30 PM - 01:15 PM', class: 'Grade 10-A', subject: 'Math Practical Lab', room: 'Math Lab 1' },
  { periodNo: 6, time: '01:20 PM - 02:05 PM', class: 'Grade 9-A', subject: 'Remedial Math', room: 'Room 102' }
];

export default function AdminTeachersManagePage() {
  const { user, switchRole } = useApp();
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<TeacherItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State for creating/editing teacher
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [department, setDepartment] = useState('High School');
  const [classesInput, setClassesInput] = useState('Grade 10-A, Grade 10-B');
  const [periods, setPeriods] = useState<PeriodConfig[]>(defaultPeriods);

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/teachers');
      const data = await res.json();
      if (data.success) {
        setTeachers(data.teachers);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (index: number, field: keyof PeriodConfig, value: string) => {
    setPeriods(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch('/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_teacher',
          name,
          email,
          password: password || 'teacher123',
          phone,
          subject,
          department,
          assignedClasses: classesInput.split(',').map(c => c.trim()),
          periods
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(data.message || 'Teacher login created successfully with period timetable!');
        if (data.teacher) {
          setTeachers(prev => [{ ...data.teacher, periods }, ...prev]);
        }
        setTimeout(() => {
          setModalOpen(false);
          setSuccessMsg('');
        }, 1200);
      } else {
        setErrorMsg(data.error || 'Failed to create teacher');
      }
    } catch (err: any) {
      setErrorMsg('An error occurred while creating teacher');
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (t: TeacherItem) => {
    setEditingTeacher(t);
    setName(t.name);
    setEmail(t.email);
    setPassword('');
    setPhone(t.phone || '');
    setSubject(t.subject || 'Mathematics');
    setDepartment(t.department || 'High School');
    setClassesInput(Array.isArray(t.assignedClasses) ? t.assignedClasses.join(', ') : (t.assignedClasses || 'Grade 10-A'));
    setPeriods(t.periods || defaultPeriods);
    setSuccessMsg('');
    setErrorMsg('');
    setEditModalOpen(true);
  };

  // Save Edit Teacher
  const handleUpdateTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch('/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_teacher',
          id: editingTeacher.id,
          name,
          email,
          password,
          phone,
          subject,
          department,
          assignedClasses: classesInput.split(',').map(c => c.trim()),
          periods
        })
      });

      const data = await res.json();
      if (data.success) {
        setTeachers(prev =>
          prev.map(t =>
            t.id === editingTeacher.id
              ? {
                  ...t,
                  name,
                  email,
                  phone,
                  subject,
                  department,
                  assignedClasses: classesInput.split(',').map(c => c.trim()),
                  periods
                }
              : t
          )
        );
        setSuccessMsg(`Teacher credentials & period schedule for ${name} updated successfully!`);
        setTimeout(() => {
          setEditModalOpen(false);
          setSuccessMsg('');
        }, 1200);
      } else {
        setErrorMsg(data.error || 'Failed to update teacher credentials');
      }
    } catch (err) {
      setErrorMsg('Error updating teacher account');
    }
  };

  // Delete Teacher
  const handleDeleteTeacher = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete teacher login for ${name}?`)) return;

    try {
      await fetch('/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_teacher', id })
      });
      setTeachers(prev => prev.filter(t => t.id !== id));
    } catch (e) {
      setTeachers(prev => prev.filter(t => t.id !== id));
    }
  };

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              ADMIN CONTROL PANEL
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
              FACULTY CREDENTIALS &amp; TIMETABLE
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Teacher Login Management &amp; Period Timetable
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Create teacher logins, configure their daily Period 1 to Period 6 class schedule, and track GPS campus check-ins.
          </p>
        </div>

        <button
          onClick={() => {
            setName('');
            setEmail('');
            setPassword('');
            setPhone('');
            setPeriods(defaultPeriods);
            setSuccessMsg('');
            setErrorMsg('');
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition"
        >
          <UserPlus size={16} />
          <span>Create Teacher Login</span>
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400 font-bold uppercase">Total Faculty Accounts</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{teachers.length}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Active &amp; Verified Logins</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400 font-bold uppercase">Today GPS Campus Check-In</span>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {teachers.filter(t => t.geoPunchIn?.status === 'PUNCHED_IN').length} / {teachers.length}
          </p>
          <span className="text-[10px] text-slate-400 font-semibold">Geo-Fenced School Radius</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400 font-bold uppercase">Configured Period Timetables</span>
          <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">6 Periods / Day</p>
          <span className="text-[10px] text-indigo-600 font-semibold">Per Faculty Member</span>
        </div>
      </div>

      {/* Teacher Search & Directory Table */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="text-indigo-600" size={18} />
            School Teacher Directory &amp; Period Schedule
          </h2>

          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teacher by name or subject..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/70 font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Teacher Name</th>
                <th className="py-3 px-4">Subject &amp; Department</th>
                <th className="py-3 px-4">Period Classes Schedule</th>
                <th className="py-3 px-4">GPS Campus Check-In</th>
                <th className="py-3 px-4 text-right">Actions &amp; Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTeachers.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{t.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{t.email} • {t.phone}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-indigo-600 dark:text-indigo-400">{t.subject}</div>
                    <div className="text-[10px] text-slate-500">{t.department}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {t.periods ? (
                        t.periods.map((p) => (
                          <span key={p.periodNo} className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-mono font-bold rounded">
                            P{p.periodNo}: {p.class}
                          </span>
                        ))
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded">
                          P1: 10-A | P2: 9-A | P3: 10-B
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {t.geoPunchIn?.status === 'PUNCHED_IN' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded-full">
                        <MapPin size={12} />
                        Punched In ({t.geoPunchIn.time})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-semibold rounded-full">
                        Not Punched Yet
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(t)}
                        className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[11px] font-bold transition inline-flex items-center gap-1 shadow-sm"
                        title="Edit Teacher Login & Period Schedule"
                      >
                        <Edit3 size={13} />
                        <span>Edit Login &amp; Periods</span>
                      </button>

                      <button
                        onClick={() => handleDeleteTeacher(t.id, t.name)}
                        className="p-1.5 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                        title="Delete Teacher Account"
                      >
                        <Trash2 size={14} />
                      </button>

                      <button
                        onClick={() => switchRole('TEACHER', 'tenant-104', 'Oxford Academy', 'EDUCATION')}
                        className="px-3 py-1.5 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 text-white rounded-lg text-[11px] font-bold transition inline-flex items-center gap-1"
                      >
                        <span>Login Portal</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal to Create New Teacher Login with Period Schedule */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 px-2.5 py-0.5 rounded-full">
                  ADMIN ACTION
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  Create Teacher Login &amp; Assign Periods
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

            {errorMsg && (
              <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateTeacher} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Teacher Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Prof. Anitha Ramesh"
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
                    placeholder="anitha@oxfordedu.in"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
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

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98401 23456"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Mathematics"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="High School"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              {/* Configure Daily Period Schedule */}
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock size={16} className="text-indigo-600" />
                  Assign Daily Period Classes &amp; Schedule (Period 1 - 6)
                </h4>

                <div className="space-y-2">
                  {periods.map((p, idx) => (
                    <div key={p.periodNo} className="grid grid-cols-12 gap-2 items-center bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="col-span-3 font-bold font-mono text-indigo-600 dark:text-indigo-400">
                        Period {p.periodNo} ({p.time.split(' - ')[0]})
                      </div>
                      <div className="col-span-4">
                        <input
                          type="text"
                          value={p.class}
                          onChange={(e) => handlePeriodChange(idx, 'class', e.target.value)}
                          placeholder="Grade 10-A"
                          className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold"
                        />
                      </div>
                      <div className="col-span-5">
                        <input
                          type="text"
                          value={p.subject}
                          onChange={(e) => handlePeriodChange(idx, 'subject', e.target.value)}
                          placeholder="Subject"
                          className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition text-xs flex items-center justify-center gap-2"
                >
                  <UserCheck size={16} />
                  <span>Create Account &amp; Save Period Timetable</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal to Edit Existing Teacher Login with Period Schedule */}
      {editModalOpen && editingTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 px-2.5 py-0.5 rounded-full">
                  EDIT TEACHER &amp; PERIOD TIMETABLE
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  Edit Account &amp; Periods: {editingTeacher.name}
                </h3>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
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

            {errorMsg && (
              <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleUpdateTeacherSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Teacher Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Work Email (Login Email) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Update Password (Leave blank to keep unchanged)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              {/* Configure Daily Period Schedule */}
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock size={16} className="text-indigo-600" />
                  Edit Daily Period Classes &amp; Schedule (Period 1 - 6)
                </h4>

                <div className="space-y-2">
                  {periods.map((p, idx) => (
                    <div key={p.periodNo} className="grid grid-cols-12 gap-2 items-center bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="col-span-3 font-bold font-mono text-indigo-600 dark:text-indigo-400">
                        Period {p.periodNo} ({p.time.split(' - ')[0]})
                      </div>
                      <div className="col-span-4">
                        <input
                          type="text"
                          value={p.class}
                          onChange={(e) => handlePeriodChange(idx, 'class', e.target.value)}
                          placeholder="Grade 10-A"
                          className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold"
                        />
                      </div>
                      <div className="col-span-5">
                        <input
                          type="text"
                          value={p.subject}
                          onChange={(e) => handlePeriodChange(idx, 'subject', e.target.value)}
                          placeholder="Subject"
                          className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-md"
                >
                  <CheckCircle2 size={16} />
                  <span>Save Updated Credentials &amp; Timetable</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
