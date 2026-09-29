'use client';

import React, { useState } from 'react';
import {
  HardHat,
  Building,
  CheckCircle2,
  Clock,
  UserCheck,
  TrendingUp,
  MapPin,
  Calendar,
  Plus,
  Search,
  FileText
} from 'lucide-react';

interface ProjectSite {
  id: string;
  projectName: string;
  clientName: string;
  location: string;
  siteEngineer: string;
  stage: string;
  progressPercent: number;
  startDate: string;
  targetDate: string;
  budgetLakhs: number;
  spentLakhs: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
}

export default function ConstructionProjectsPage() {
  const [projects, setProjects] = useState<ProjectSite[]>([
    {
      id: 'cp-101',
      projectName: 'Apex Commercial Tower (G+12)',
      clientName: 'Apex Holdings Pvt Ltd',
      location: 'OMR Road, Chennai',
      siteEngineer: 'Er. Sundaram P.',
      stage: '9th Floor Slab Concrete Pouching',
      progressPercent: 68,
      startDate: 'Jan 15, 2026',
      targetDate: 'Dec 30, 2026',
      budgetLakhs: 450,
      spentLakhs: 290,
      status: 'IN_PROGRESS'
    },
    {
      id: 'cp-102',
      projectName: 'Royal Residency Luxury Apartments',
      clientName: 'Royal Builders',
      location: 'ECR Beach Road',
      siteEngineer: 'Er. Rajesh K.',
      stage: 'Foundation & Basement Column Piling',
      progressPercent: 28,
      startDate: 'May 01, 2026',
      targetDate: 'Mar 15, 2027',
      budgetLakhs: 320,
      spentLakhs: 95,
      status: 'IN_PROGRESS'
    },
    {
      id: 'cp-103',
      projectName: 'Green Valley Premium Villas (14 Units)',
      clientName: 'Greenwood Developers',
      location: 'Tambaram East',
      siteEngineer: 'Er. Karthik R.',
      stage: 'Plastering & Interior Wiring',
      progressPercent: 88,
      startDate: 'Oct 10, 2025',
      targetDate: 'Nov 30, 2026',
      budgetLakhs: 600,
      spentLakhs: 520,
      status: 'IN_PROGRESS'
    }
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
              CONSTRUCTION INDUSTRY CRM
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
              SITE PROGRESS TRACKER
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Active Construction Sites &amp; Engineering Progress
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor active civil projects, stage completion percentages, site engineers, and material spend budgets.
          </p>
        </div>

        <button
          onClick={() => alert('Add New Construction Project Site form triggered!')}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-md transition"
        >
          <Plus size={16} />
          <span>New Construction Site</span>
        </button>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map((p) => (
          <div key={p.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm hover:border-amber-500 transition">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded">
                  {p.status}
                </span>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base mt-2">
                  {p.projectName}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin size={12} className="text-amber-500" />
                  {p.location}
                </p>
              </div>
            </div>

            {/* Completion Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-300">Completion Progress</span>
                <span className="text-amber-600 dark:text-amber-400 font-mono">{p.progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${p.progressPercent}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-500 font-medium pt-1">
                Current Stage: <span className="font-bold text-slate-800 dark:text-slate-200">{p.stage}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800 font-mono">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Site Engineer</span>
                <span className="font-bold text-slate-900 dark:text-white">{p.siteEngineer}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Budget Spent</span>
                <span className="font-bold text-emerald-600">₹{p.spentLakhs} / ₹{p.budgetLakhs}L</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => alert(`Site progress report sent to client ${p.clientName} via WhatsApp!`)}
                className="w-full flex items-center justify-center gap-1.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition"
              >
                <FileText size={14} className="text-amber-600" />
                <span>Send WhatsApp Site Progress to Client</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
