'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Play,
  Pause,
  ShieldCheck,
  Activity,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Users,
  TrendingUp,
  RefreshCw,
  Clock,
  Settings,
  BellRing,
  Cpu,
  Layers
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function AiAgentControlHub() {
  const { user } = useApp();
  const [autonomousActive, setAutonomousActive] = useState(true);
  const [autoAssign, setAutoAssign] = useState(true);
  const [autoWhatsApp, setAutoWhatsApp] = useState(true);
  const [leadScoring, setLeadScoring] = useState(true);
  const [escalationAlerts, setEscalationAlerts] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(88);

  const [logs, setLogs] = useState([
    {
      id: 1,
      time: '18:01:10',
      type: 'AUTO_REPLY',
      status: 'SUCCESS',
      message: 'Ani AI replied to WhatsApp lead (+91 9080692565): Sent Villa brochure & booked visit.'
    },
    {
      id: 2,
      time: '17:55:44',
      type: 'LEAD_QUALIFICATION',
      status: 'SUCCESS',
      message: 'Ani AI qualified Lead #L-904 (Ananya Deshmukh) -> Score: 94/100 (High Intent).'
    },
    {
      id: 3,
      time: '17:48:05',
      type: 'AUTO_ASSIGN',
      status: 'SUCCESS',
      message: 'Ani AI assigned Lead #L-904 to Rohan Verma based on load & language match.'
    },
    {
      id: 4,
      time: '17:35:30',
      type: 'SLA_MONITOR',
      status: 'WARNING',
      message: 'Lead #L-899 response delayed by 8 mins. Sent urgency ping to rep.'
    }
  ]);

  const handleTriggerManualRun = () => {
    const newLog = {
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      type: 'MANUAL_AI_SYNC',
      status: 'SUCCESS',
      message: 'Manual Ani AI Neural Sync complete: 24 leads analyzed, 0 bottlenecks found.'
    };
    setLogs([newLog, ...logs]);
  };

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Ultra-Trendy Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 border border-cyan-500/30 p-8 text-white shadow-[0_0_50px_rgba(6,182,212,0.15)]">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-gradient-to-br from-cyan-500/20 via-indigo-500/20 to-purple-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-extrabold border border-cyan-500/40 backdrop-blur-md">
              <Cpu className="w-4 h-4 text-cyan-400 animate-spin-slow" />
              Ani AI Neural Control Hub
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-cyan-300 via-white to-purple-300 bg-clip-text text-transparent">
              Ani AI Autonomous Agent Control
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed font-medium">
              Configure 24/7 autonomous Ani AI agents to auto-qualify leads, answer WhatsApp queries, assign sales reps, and drive pipeline conversion.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAutonomousActive(!autonomousActive)}
              className={`px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm shadow-xl transition duration-300 flex items-center gap-2 border ${
                autonomousActive
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white border-emerald-300/40 shadow-emerald-950/40'
                  : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white border-amber-300/40 shadow-amber-950/40'
              }`}
            >
              {autonomousActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {autonomousActive ? 'Pause Ani AI' : 'Activate Ani AI'}
            </button>

            <button
              onClick={handleTriggerManualRun}
              className="p-3.5 bg-slate-900/90 hover:bg-slate-800 text-cyan-300 rounded-2xl border border-cyan-500/30 transition shadow-lg"
              title="Trigger Neural Scan"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Control Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900/90 dark:bg-slate-950/90 p-6 rounded-3xl border border-indigo-500/20 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <MessageSquare className="w-6 h-6" />
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoWhatsApp}
                onChange={(e) => setAutoWhatsApp(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>
          <h3 className="font-bold text-slate-100 mt-4 text-base">WhatsApp AI Auto-Responder</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Ani AI auto-replies to WhatsApp leads with intelligent context awareness.
          </p>
        </div>

        <div className="bg-slate-900/90 dark:bg-slate-950/90 p-6 rounded-3xl border border-indigo-500/20 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Users className="w-6 h-6" />
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoAssign}
                onChange={(e) => setAutoAssign(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
          <h3 className="font-bold text-slate-100 mt-4 text-base">Smart Lead Routing</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Distribute incoming leads automatically based on sales rep load & skill.
          </p>
        </div>

        <div className="bg-slate-900/90 dark:bg-slate-950/90 p-6 rounded-3xl border border-indigo-500/20 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <TrendingUp className="w-6 h-6" />
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={leadScoring}
                onChange={(e) => setLeadScoring(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
            </label>
          </div>
          <h3 className="font-bold text-slate-100 mt-4 text-base">AI Intent Lead Scoring</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Predict buying intent scores automatically for incoming lead forms.
          </p>
        </div>

        <div className="bg-slate-900/90 dark:bg-slate-950/90 p-6 rounded-3xl border border-indigo-500/20 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <BellRing className="w-6 h-6" />
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={escalationAlerts}
                onChange={(e) => setEscalationAlerts(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>
          <h3 className="font-bold text-slate-100 mt-4 text-base">SLA Delay Escalation</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Alert sales managers when reps exceed 10-minute response SLAs.
          </p>
        </div>
      </div>

      {/* Main Section: Live Activity Log & Tuning */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live AI Logs */}
        <div className="lg:col-span-2 bg-slate-900/90 rounded-3xl border border-cyan-500/20 p-6 shadow-xl space-y-4 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <h2 className="font-bold text-lg text-slate-100">Ani AI Live Neural Execution Stream</h2>
            </div>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full font-bold flex items-center gap-1.5 border border-emerald-500/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Stream
            </span>
          </div>

          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3.5 transition hover:border-cyan-500/40"
              >
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mt-0.5">
                  <Cpu className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400 tracking-wider">
                      {log.type}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">{log.time}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">{log.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Fine Tuning Controls */}
        <div className="bg-slate-900/90 rounded-3xl border border-cyan-500/20 p-6 shadow-xl space-y-6 backdrop-blur-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <Sliders className="w-5 h-5 text-purple-400" />
            <h2 className="font-bold text-lg text-slate-100">Ani Neural Parameters</h2>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-2">
                <span>Confidence Threshold</span>
                <span className="text-cyan-400 font-mono font-bold">{confidenceThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Ani AI executes actions automatically when confidence score exceeds {confidenceThreshold}%.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
              <div className="flex items-center gap-2 text-cyan-300 font-semibold text-xs">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Neural Guardrails</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Sensitive actions (such as high value lead updates) require supervisor approval.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
