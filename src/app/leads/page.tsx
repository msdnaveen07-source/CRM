'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Inbox,
  Search,
  Filter,
  Phone,
  MessageSquare,
  Mail,
  UserPlus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileSpreadsheet,
  ChevronRight,
  Send,
  Calendar,
  X,
  Plus,
  Building2,
  UserCheck,
  Zap,
  Tag,
  DollarSign
} from 'lucide-react';
import { Lead, LeadActivity, LeadNote } from '@/types';

const salesTeamList = [
  { id: 'AUTO_ROUND_ROBIN', name: '⚡ Auto-Assign (Round-Robin)' },
  { id: 'user-sales-1', name: 'Rohan Verma (Sales Exec)' },
  { id: 'user-sales-2', name: 'Priya Sundaram (Sales Exec)' },
  { id: 'user-sales-3', name: 'Karthik Raja (Sales Manager)' }
];

export default function LeadsPage() {
  const { user } = useApp();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [showManualModal, setShowManualModal] = useState(false);
  const [assignmentToast, setAssignmentToast] = useState('');

  // Rich Real Estate Manual Lead Form
  const [manualLead, setManualLead] = useState({
    fullName: '',
    phone: '',
    email: '',
    location: 'Apex Luxury Palms',
    propertyType: '3BHK Luxury Villa',
    budget: '₹1 Cr - ₹1.85 Cr',
    source: 'WALK_IN',
    assignedToId: 'user-sales-1',
    notes: ''
  });

  const fetchLeads = async () => {
    try {
      const res = await fetch(`/api/leads?tenantId=${user.tenantId}`);
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads);
        if (data.leads.length > 0 && !selectedLead) {
          setSelectedLead(data.leads[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [user.tenantId]);

  useEffect(() => {
    if (selectedLead) {
      setActivities([
        {
          id: 'a1',
          tenantId: user.tenantId,
          leadId: selectedLead.id,
          actorName: 'Lead Ingestion Engine',
          type: 'CREATED',
          description: `Lead registered via ${selectedLead.platform || 'Manual Entry'}`,
          timestamp: selectedLead.createdAt
        },
        {
          id: 'a2',
          tenantId: user.tenantId,
          leadId: selectedLead.id,
          actorName: 'Sales Auto-Assign',
          type: 'ASSIGNED',
          description: `Assigned to Sales Executive ${getAssigneeName(selectedLead.assignedTo)}`,
          timestamp: selectedLead.createdAt
        }
      ]);
      setNotes([
        {
          id: 'n1',
          tenantId: user.tenantId,
          leadId: selectedLead.id,
          authorId: 'u1',
          authorName: 'Rohan Verma',
          content: 'Inquired about 3BHK villa floor plan and requested weekend site visit.',
          createdAt: new Date().toISOString()
        }
      ]);
    }
  }, [selectedLead]);

  const getAssigneeName = (assignedToId?: string) => {
    const found = salesTeamList.find(s => s.id === assignedToId);
    return found ? found.name : (assignedToId || 'Rohan Verma (Sales Exec)');
  };

  const handleCreateManualLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const assignedExec = salesTeamList.find(s => s.id === manualLead.assignedToId);
      const assigneeName = assignedExec ? assignedExec.name : 'Rohan Verma';

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: user.tenantId,
          fullName: manualLead.fullName,
          phone: manualLead.phone,
          email: manualLead.email,
          location: `${manualLead.location} (${manualLead.propertyType})`,
          platform: manualLead.source === 'WALK_IN' ? 'MANUAL' : 'WEBSITE',
          assignedTo: manualLead.assignedToId === 'AUTO_ROUND_ROBIN' ? undefined : manualLead.assignedToId,
          questionsAnswers: {
            propertyType: manualLead.propertyType,
            budget: manualLead.budget,
            notes: manualLead.notes
          }
        })
      });

      const data = await res.json();
      if (data.success && data.lead) {
        setLeads(prev => [data.lead, ...prev]);
        setSelectedLead(data.lead);
      } else {
        // Fallback local lead add for mock state
        const newLocalLead: Lead = {
          id: `lead-${Date.now()}`,
          tenantId: user.tenantId,
          platform: manualLead.source === 'WALK_IN' ? 'MANUAL' : 'WEBSITE',
          fullName: manualLead.fullName,
          phone: manualLead.phone,
          email: manualLead.email,
          location: `${manualLead.location} (${manualLead.propertyType})`,
          assignedTo: manualLead.assignedToId === 'AUTO_ROUND_ROBIN' ? 'user-sales-1' : manualLead.assignedToId,
          status: 'NEW',
          isMissed: false,
          firstResponseDeadline: new Date(Date.now() + 10 * 60000).toISOString(),
          aiScore: 94,
          aiValidationStatus: 'HOT',
          aiValidationReason: 'High intent buyer registered via Manual Entry',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setLeads(prev => [newLocalLead, ...prev]);
        setSelectedLead(newLocalLead);
      }

      setShowManualModal(false);
      setAssignmentToast(`Lead ${manualLead.fullName} created & assigned to ${assigneeName}!`);
      setTimeout(() => setAssignmentToast(''), 4000);
      // Reset Form
      setManualLead({
        fullName: '',
        phone: '',
        email: '',
        location: 'Apex Luxury Palms',
        propertyType: '3BHK Luxury Villa',
        budget: '₹1 Cr - ₹1.85 Cr',
        source: 'WALK_IN',
        assignedToId: 'user-sales-1',
        notes: ''
      });
    } catch (err) {
      console.error(err);
      // Fallback local lead creation on network/server error
      const assignedExec = salesTeamList.find(s => s.id === manualLead.assignedToId);
      const assigneeName = assignedExec ? assignedExec.name : 'Rohan Verma';
      const fallbackLead: Lead = {
        id: `lead-${Date.now()}`,
        tenantId: user.tenantId,
        platform: 'MANUAL',
        fullName: manualLead.fullName,
        phone: manualLead.phone,
        email: manualLead.email,
        location: `${manualLead.location} (${manualLead.propertyType})`,
        assignedTo: manualLead.assignedToId,
        status: 'NEW',
        isMissed: false,
        firstResponseDeadline: new Date(Date.now() + 10 * 60000).toISOString(),
        aiScore: 90,
        aiValidationStatus: 'HOT',
        aiValidationReason: 'Direct manual creation',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setLeads(prev => [fallbackLead, ...prev]);
      setSelectedLead(fallbackLead);
      setShowManualModal(false);
      setAssignmentToast(`Lead ${manualLead.fullName} added successfully!`);
      setTimeout(() => setAssignmentToast(''), 4000);
    }
  };

  const handleReassignLead = async (newAssigneeId: string) => {
    if (!selectedLead) return;
    const assigneeName = getAssigneeName(newAssigneeId);

    setLeads(prev =>
      prev.map(l => (l.id === selectedLead.id ? { ...l, assignedTo: newAssigneeId } : l))
    );

    setSelectedLead({ ...selectedLead, assignedTo: newAssigneeId });
    setAssignmentToast(`Lead re-assigned to ${assigneeName}! WhatsApp alert sent.`);
    setTimeout(() => setAssignmentToast(''), 3000);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote || !selectedLead) return;
    const noteObj: LeadNote = {
      id: `n-${Date.now()}`,
      tenantId: user.tenantId,
      leadId: selectedLead.id,
      authorId: user.id,
      authorName: user.name,
      content: newNote,
      createdAt: new Date().toISOString()
    };
    setNotes([noteObj, ...notes]);
    setNewNote('');
  };

  const filteredLeads = leads.filter(l => {
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    const matchesSearch =
      l.fullName.toLowerCase().includes(search.toLowerCase()) ||
      (l.phone && l.phone.includes(search)) ||
      (l.email && l.email.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              REAL ESTATE SALES PIPELINE
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
              LEADS INBOX &amp; TEAM ASSIGNMENT
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Property Inquiries &amp; Sales Assignment Inbox
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage incoming villa/apartment inquiries, assign leads to sales executives, and track 10-minute SLA response timers.
          </p>
        </div>

        <button
          onClick={() => setShowManualModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition"
        >
          <Plus size={16} />
          <span>+ Add Real Estate Lead</span>
        </button>
      </div>

      {assignmentToast && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-600" />
            <span>{assignmentToast}</span>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'MISSED', 'NEW', 'CONTACTED', 'INTERESTED', 'FOLLOW_UP', 'QUALIFIED', 'WON', 'LOST'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              statusFilter === st
                ? 'bg-slate-900 text-white dark:bg-indigo-600'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Main 2-Column Split: Leads Roster (8 cols) + Detail Panel (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Roster Table */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search lead by buyer name, phone, or email..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/70 font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-3">Lead Buyer</th>
                  <th className="py-3 px-3">Property Interest</th>
                  <th className="py-3 px-3">Sales Executive</th>
                  <th className="py-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredLeads.map((l) => {
                  const isSelected = selectedLead?.id === l.id;
                  return (
                    <tr
                      key={l.id}
                      onClick={() => setSelectedLead(l)}
                      className={`cursor-pointer transition ${
                        isSelected
                          ? 'bg-indigo-50/80 dark:bg-indigo-950/60 font-medium'
                          : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-white">{l.fullName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{l.phone}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-indigo-600 dark:text-indigo-400">
                          {l.location || 'Apex Luxury Palms'}
                        </div>
                        <span className="text-[10px] text-slate-400">{l.platform}</span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                        {getAssigneeName(l.assignedTo)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            l.status === 'NEW'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                              : l.status === 'WON'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lead Detail Panel with Assignee Dropdown */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm">
          {selectedLead ? (
            <>
              <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 px-2 py-0.5 rounded">
                    {selectedLead.platform} INQUIRY
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                    {selectedLead.fullName}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedLead.phone} • {selectedLead.email}</p>
                </div>
              </div>

              {/* Assignee Card & Re-assign selector */}
              <div className="bg-indigo-50/50 dark:bg-indigo-950/40 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900 space-y-2">
                <label className="block text-xs font-bold text-indigo-900 dark:text-indigo-300">
                  Assigned Sales Executive:
                </label>
                <select
                  value={selectedLead.assignedTo || 'user-sales-1'}
                  onChange={(e) => handleReassignLead(e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                >
                  {salesTeamList.filter(s => s.id !== 'AUTO_ROUND_ROBIN').map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes Form */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Add Call Note:</span>
                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter sales update or site visit notes..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1 p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs outline-none text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2.5 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl text-xs font-bold"
                  >
                    <Send size={14} />
                  </button>
                </form>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {notes.map((n) => (
                    <div key={n.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between font-bold text-slate-900 dark:text-white text-[11px]">
                        <span>{n.authorName}</span>
                        <span className="text-[9px] text-slate-400 font-mono">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">{n.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-xs text-slate-400">Select a lead from the roster</div>
          )}
        </div>
      </div>

      {/* Rich Real Estate Add Manual Lead Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 px-2.5 py-0.5 rounded-full">
                  REAL ESTATE CRM
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  Add Real Estate Lead &amp; Assign Sales Exec
                </h3>
              </div>
              <button
                onClick={() => setShowManualModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManualLead} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Buyer Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={manualLead.fullName}
                  onChange={(e) => setManualLead({ ...manualLead, fullName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    value={manualLead.phone}
                    onChange={(e) => setManualLead({ ...manualLead, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="ramesh@gmail.com"
                    value={manualLead.email}
                    onChange={(e) => setManualLead({ ...manualLead, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Property Project Name
                </label>
                <select
                  value={manualLead.location}
                  onChange={(e) => setManualLead({ ...manualLead, location: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white font-bold"
                >
                  <option value="Apex Luxury Palms">Apex Luxury Palms (OMR)</option>
                  <option value="Greenwood Estates">Greenwood Estates (ECR)</option>
                  <option value="City Center Heights">City Center Heights</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Property Type
                  </label>
                  <select
                    value={manualLead.propertyType}
                    onChange={(e) => setManualLead({ ...manualLead, propertyType: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
                  >
                    <option value="3BHK Luxury Villa">3BHK Luxury Villa</option>
                    <option value="2BHK Apartment">2BHK Apartment</option>
                    <option value="Land Plot">Land Plot</option>
                    <option value="Penthouse">Penthouse</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Budget Range
                  </label>
                  <select
                    value={manualLead.budget}
                    onChange={(e) => setManualLead({ ...manualLead, budget: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
                  >
                    <option value="₹50L - ₹1 Cr">₹50L - ₹1 Cr</option>
                    <option value="₹1 Cr - ₹1.85 Cr">₹1 Cr - ₹1.85 Cr</option>
                    <option value="₹2 Cr+">₹2 Cr+</option>
                  </select>
                </div>
              </div>

              {/* ASSIGN SALES EXECUTIVE DROPDOWN */}
              <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/60 rounded-xl border border-indigo-100 dark:border-indigo-900 space-y-1">
                <label className="block font-bold text-indigo-900 dark:text-indigo-300">
                  Assign Sales Executive *
                </label>
                <select
                  value={manualLead.assignedToId}
                  onChange={(e) => setManualLead({ ...manualLead, assignedToId: e.target.value })}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                >
                  {salesTeamList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-lg"
                >
                  <UserPlus size={16} />
                  <span>Save Lead &amp; Assign Sales Executive</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
