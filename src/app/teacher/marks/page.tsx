'use client';

import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Save,
  Send,
  Printer,
  FileSpreadsheet,
  Search,
  BookOpen
} from 'lucide-react';

interface StudentMark {
  id: string;
  rollNo: string;
  name: string;
  marks: number;
  maxMarks: number;
  grade: string;
  status: 'PASS' | 'FAIL';
}

export default function ExamMarksPage() {
  const [selectedClass, setSelectedClass] = useState('Grade 10-A');
  const [selectedExam, setSelectedExam] = useState('Midterm Examination 2026');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');

  const [studentMarks, setStudentMarks] = useState<StudentMark[]>([
    { id: 'st-1', rollNo: '10A01', name: 'Aarav Kumar', marks: 94, maxMarks: 100, grade: 'A+', status: 'PASS' },
    { id: 'st-2', rollNo: '10A02', name: 'Kavya S.', marks: 98, maxMarks: 100, grade: 'O', status: 'PASS' },
    { id: 'st-3', rollNo: '10A03', name: 'Rahul Dravid M.', marks: 68, maxMarks: 100, grade: 'B+', status: 'PASS' },
    { id: 'st-4', rollNo: '10A04', name: 'Priya Sharma', marks: 88, maxMarks: 100, grade: 'A', status: 'PASS' },
    { id: 'st-5', rollNo: '10A05', name: 'Siddharth V.', marks: 82, maxMarks: 100, grade: 'A', status: 'PASS' }
  ]);

  const [savedMsg, setSavedMsg] = useState('');

  const calculateGrade = (score: number) => {
    if (score >= 95) return 'O';
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 65) return 'B+';
    if (score >= 50) return 'B';
    if (score >= 35) return 'C';
    return 'F';
  };

  const handleMarkChange = (id: string, val: string) => {
    const num = Math.min(100, Math.max(0, parseInt(val) || 0));
    setStudentMarks(prev =>
      prev.map(s => {
        if (s.id === id) {
          const grade = calculateGrade(num);
          const status = num >= 35 ? 'PASS' : 'FAIL';
          return { ...s, marks: num, grade, status };
        }
        return s;
      })
    );
  };

  const handleSaveMarks = () => {
    setSavedMsg('Marks published & synced to Student Gradebook successfully!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              ACADEMIC GRADING
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
              MARKSHEET PORTAL
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Exam Marks &amp; Grade Entry
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Record term marks, calculate subject grades, and publish digital report cards to parents.
          </p>
        </div>

        <button
          onClick={handleSaveMarks}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition"
        >
          <Save size={16} />
          <span>Save &amp; Publish Marks</span>
        </button>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-sm">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Select Examination:</label>
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none"
          >
            <option value="Midterm Examination 2026">Midterm Examination 2026</option>
            <option value="Quarterly Exam 2026">Quarterly Exam 2026</option>
            <option value="Unit Test 1">Unit Test 1</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Select Class:</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none"
          >
            <option value="Grade 10-A">Grade 10-A</option>
            <option value="Grade 10-B">Grade 10-B</option>
            <option value="Grade 9-A">Grade 9-A</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subject:</label>
          <input
            type="text"
            readOnly
            value={selectedSubject}
            className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none"
          />
        </div>
      </div>

      {savedMsg && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-600" />
            <span>{savedMsg}</span>
          </div>
        </div>
      )}

      {/* Marks Table */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award size={18} className="text-indigo-600" />
            Student Marksheet Roster ({selectedClass})
          </h2>

          <button
            onClick={() => alert(`Full marksheet sent to parents of ${selectedClass} via WhatsApp!`)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-bold transition"
          >
            <Send size={14} />
            <span>Send All Report Cards via WhatsApp</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/70 font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Marks Obtained (Out of 100)</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4 text-right">Result Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {studentMarks.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-500">{st.rollNo}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{st.name}</td>
                  <td className="py-3.5 px-4">
                    <input
                      type="number"
                      value={st.marks}
                      onChange={(e) => handleMarkChange(st.id, e.target.value)}
                      className="w-24 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold font-mono outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                    />
                  </td>
                  <td className="py-3.5 px-4 font-bold text-indigo-600 dark:text-indigo-400 font-mono text-sm">
                    {st.grade}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        st.status === 'PASS'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {st.status}
                    </span>
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
