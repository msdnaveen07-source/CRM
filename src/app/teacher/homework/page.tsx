'use client';

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  MessageSquare,
  Send,
  Users,
  Search,
  BookOpen
} from 'lucide-react';

interface Homework {
  id: string;
  className: string;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  submissionsCount: number;
  totalStudents: number;
}

export default function HomeworkPage() {
  const [selectedClass, setSelectedClass] = useState('Grade 10-A');
  const [homeworkList, setHomeworkList] = useState<Homework[]>([
    {
      id: 'hw-1',
      className: 'Grade 10-A',
      subject: 'Mathematics',
      title: 'Quadratic Equations Exercise 4.2',
      description: 'Solve problems 1 to 15 in notebook. Draw graphs for problem 12.',
      dueDate: 'Sept 30, 2026',
      submissionsCount: 28,
      totalStudents: 32
    },
    {
      id: 'hw-2',
      className: 'Grade 10-A',
      subject: 'Mathematics',
      title: 'Pythagoras Theorem Proof Worksheet',
      description: 'Complete worksheet pages 45-48 and submit step-by-step proofs.',
      dueDate: 'Oct 02, 2026',
      submissionsCount: 12,
      totalStudents: 32
    }
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleCreateHomework = (e: React.FormEvent) => {
    e.preventDefault();
    const newHw: Homework = {
      id: `hw-${Date.now()}`,
      className: selectedClass,
      subject: 'Mathematics',
      title,
      description,
      dueDate: dueDate || 'Oct 05, 2026',
      submissionsCount: 0,
      totalStudents: 32
    };
    setHomeworkList([newHw, ...homeworkList]);
    setSuccessMsg('Homework assigned successfully & WhatsApp alert sent to parents!');
    setTimeout(() => {
      setModalOpen(false);
      setTitle('');
      setDescription('');
      setSuccessMsg('');
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              FACULTY MODULE
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
              ACADEMIC ASSIGNMENTS
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Homework &amp; Assignment Tracker
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Assign daily class tasks, track student submissions, and send automated reminders to parents.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition"
        >
          <Plus size={16} />
          <span>Assign New Homework</span>
        </button>
      </div>

      {/* Class Selector & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400 font-bold uppercase">Active Assignments</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{homeworkList.length}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">For {selectedClass}</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400 font-bold uppercase">Average Completion Rate</span>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">87.5%</p>
          <span className="text-[10px] text-emerald-600 font-semibold">40 Submissions Received</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400 font-bold uppercase">Pending Submissions</span>
          <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">24 Students</p>
          <span className="text-[10px] text-amber-600 font-semibold">Due in next 48 hours</span>
        </div>
      </div>

      {/* Homework Cards List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText size={18} className="text-indigo-600" />
          Current Homework Assignments for {selectedClass}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {homeworkList.map((hw) => (
            <div key={hw.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-extrabold uppercase bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 px-2.5 py-0.5 rounded-full">
                    {hw.subject} • {hw.className}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                    {hw.title}
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                  Due: {hw.dueDate}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {hw.description}
              </p>

              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                  <Users size={15} className="text-indigo-600" />
                  <span>Submissions: {hw.submissionsCount} / {hw.totalStudents}</span>
                </div>

                <button
                  onClick={() => alert(`WhatsApp homework reminder dispatched to pending parents of ${hw.className}!`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-bold transition"
                >
                  <MessageSquare size={14} />
                  <span>Send WhatsApp Reminder</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal to Assign Homework */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 px-2.5 py-0.5 rounded-full">
                  NEW ASSIGNMENT
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  Assign Homework to Class
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

            <form onSubmit={handleCreateHomework} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Class *
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                >
                  <option value="Grade 10-A">Grade 10-A</option>
                  <option value="Grade 10-B">Grade 10-B</option>
                  <option value="Grade 9-A">Grade 9-A</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Homework Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Chapter 5 Statistics Worksheet"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Instructions &amp; Questions Details *
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Solve questions 1 to 10 on page 78..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Submission Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition text-xs flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  <span>Assign &amp; Notify Parents via WhatsApp</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
