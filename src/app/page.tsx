'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Zap, MessageSquare, Share2, CheckCircle2, ArrowRight, Play } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center font-bold text-xl shadow-lg">
            L
          </div>
          <span className="font-bold text-xl tracking-tight">LeadFlow</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <Link href="/login" className="text-slate-400 hover:text-white transition">
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5"
          >
            <span>Launch Live App</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
          <Zap size={14} /> 2026 Production Multi-Tenant Lead Management
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400">
          Never Miss a Lead. <br /> Never Miss a Follow-up.
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
          Capture Meta Lead Ads in real-time, trigger instant WhatsApp alerts to your sales team, detect missed follow-ups within 10 minutes, and run automated reconciliation.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-2 text-sm"
          >
            <span>Get Started Free</span>
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/admin/login"
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold rounded-2xl transition flex items-center justify-center gap-2 text-sm"
          >
            <ShieldCheck size={16} className="text-indigo-400" />
            <span>Super Admin Demo</span>
          </Link>
        </div>
      </section>

      {/* Product Feature Showcase Cards */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <Share2 className="text-indigo-400" size={32} />
          <h3 className="text-lg font-bold">Real-time Meta Ingestion</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Direct Meta Lead Ad webhook integration with automated field mapping and duplicate lead prevention.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <MessageSquare className="text-emerald-400" size={32} />
          <h3 className="text-lg font-bold">WhatsApp Business Alerts</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Instant WhatsApp push alerts sent to your assigned sales reps the moment a customer submits a lead form.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <Zap className="text-amber-400" size={32} />
          <h3 className="text-lg font-bold">10-Min SLA Missed Detector</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Automated SLA engine monitors response timers and escalates uncontacted leads after 10 minutes.
          </p>
        </div>
      </section>
    </div>
  );
}
