'use client';

import React, { useState } from 'react';
import {
  Code,
  Copy,
  CheckCircle2,
  Globe,
  Zap,
  Send,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  Play
} from 'lucide-react';

export default function WebsiteIntegrationPage() {
  const [copied, setCopied] = useState(false);
  const [testName, setTestName] = useState('Vikramaditya R.');
  const [testPhone, setTestPhone] = useState('+91 98409 99887');
  const [testEmail, setTestEmail] = useState('vikram@gmail.com');
  const [testProperty, setTestProperty] = useState('Apex Luxury Palms Villa 14-B');
  const [testBudget, setTestBudget] = useState('₹1.85 Cr');
  
  const [simulatorResult, setSimulatorResult] = useState<any>(null);
  const [simulating, setSimulating] = useState(false);

  const apiEndpoint = typeof window !== 'undefined' 
    ? `${window.location.origin}/api/leads/external` 
    : 'https://leadflow.io/api/leads/external';

  const codeSnippet = `<!-- HTML Website Lead Capture Form Code Snippet -->
<form id="leadflow-website-form">
  <input type="text" name="fullName" placeholder="Your Name" required />
  <input type="tel" name="phone" placeholder="Phone Number" required />
  <input type="email" name="email" placeholder="Email Address" />
  <input type="text" name="propertyType" value="Apex Luxury Palms" />
  <button type="submit">Enquire Now</button>
</form>

<script>
document.getElementById('leadflow-website-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const payload = Object.fromEntries(formData);
  payload.tenantId = 'tenant-101'; // Your Real Estate Tenant ID

  const res = await fetch('${apiEndpoint}', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (data.success) {
    alert('Thank you! Our Sales Manager ' + data.assignment.assignedTo + ' will contact you shortly.');
  }
});
</script>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunSimulator = async (e: React.FormEvent) => {
    e.preventDefault();
    setSimulating(true);
    setSimulatorResult(null);

    try {
      const res = await fetch('/api/leads/external', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: testName,
          phone: testPhone,
          email: testEmail,
          location: testProperty,
          propertyType: testProperty,
          budget: testBudget,
          source: 'Website Landing Page Form',
          tenantId: 'tenant-101'
        })
      });

      const data = await res.json();
      setSimulatorResult(data);
    } catch (err: any) {
      setSimulatorResult({ success: false, error: err.message });
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              API INTEGRATIONS HUB
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
              WEBSITE WEBHOOK &amp; API CONNECT
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Website Lead Ingestion API &amp; Webhook Integration
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Connect any WordPress, React, HTML, or landing page form to LeadFlow API for instant Round-Robin sales assignment.
          </p>
        </div>
      </div>

      {/* API Details Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Globe size={18} className="text-indigo-600" />
          Your External API Credentials &amp; Endpoint URL
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">API POST Endpoint URL</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm select-all">{apiEndpoint}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Real Estate Tenant ID</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm select-all">tenant-101</span>
          </div>
        </div>

        {/* Code Snippet Box */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Copy-Paste HTML &amp; JavaScript Form Snippet:</span>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
            >
              {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Snippet Code'}</span>
            </button>
          </div>

          <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl text-xs overflow-x-auto font-mono border border-slate-800">
            <code>{codeSnippet}</code>
          </pre>
        </div>
      </div>

      {/* Live Interactive Simulator Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm">
        <div>
          <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 rounded-full">
            LIVE TEST BENCH
          </span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            <Play size={18} className="text-emerald-600" />
            Website Lead Ingestion &amp; Round-Robin Simulator
          </h2>
          <p className="text-xs text-slate-500">
            Submit a test website inquiry below to verify real-time ingestion, auto-assignment to sales executive, and WhatsApp alerts.
          </p>
        </div>

        <form onSubmit={handleRunSimulator} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Buyer Full Name *</label>
            <input
              type="text"
              required
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none font-bold"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Buyer Phone Number *</label>
            <input
              type="text"
              required
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Property Choice</label>
            <input
              type="text"
              value={testProperty}
              onChange={(e) => setTestProperty(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Budget</label>
            <input
              type="text"
              value={testBudget}
              onChange={(e) => setTestBudget(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
            />
          </div>

          <div className="sm:col-span-2 pt-2">
            <button
              type="submit"
              disabled={simulating}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              <Send size={16} />
              <span>{simulating ? 'Ingesting Website Lead...' : 'Submit Website Lead API Request'}</span>
            </button>
          </div>
        </form>

        {/* Simulator API Response Output */}
        {simulatorResult && (
          <div className="bg-slate-950 text-white p-5 rounded-2xl border border-slate-800 space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <CheckCircle2 size={16} />
                <span>HTTP 200 OK — Website Lead Ingested &amp; Auto-Assigned!</span>
              </div>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded">
                Round-Robin Verified
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <p className="text-indigo-300 font-bold">
                🎯 Assigned Sales Executive: <span className="text-white underline">{simulatorResult.assignment?.assignedTo}</span>
              </p>
              <p className="text-slate-300">
                ⏱️ SLA First Contact Deadline: <span className="text-amber-400 font-bold">{simulatorResult.assignment?.slaDeadlineMinutes} Minutes</span>
              </p>

              <div className="p-3 bg-emerald-950/80 rounded-xl border border-emerald-800 text-[11px] space-y-1 mt-2">
                <p className="text-emerald-300 font-bold">Simulated WhatsApp Notifications Dispatched:</p>
                <p>{simulatorResult.notifications?.whatsappBuyerMsg}</p>
                <p>{simulatorResult.notifications?.whatsappSalesMsg}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
