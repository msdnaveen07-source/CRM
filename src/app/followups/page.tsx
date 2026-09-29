'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Plus,
  Phone,
  Check,
  MessageSquare,
  Send,
  FileText,
  UserCheck,
  History,
  Bell,
  Search,
  ChevronDown,
  ChevronUp,
  Tag,
  Edit3,
  Trash2
} from 'lucide-react';

interface PastCallLog {
  id: string;
  callDate: string;
  callTime: string;
  agentName: string;
  discussionNotes: string;
  outcome: 'INTERESTED' | 'SITE_VISIT_AGREED' | 'QUOTATION_SENT' | 'PRICE_HIGH' | 'NO_ANSWER' | 'DEAL_WON';
  nextFollowupScheduled?: string;
}

interface FollowupItem {
  id: string;
  leadName: string;
  leadPhone: string;
  assignedName: string;
  dueDate: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'DUE' | 'OVERDUE' | 'UPCOMING' | 'COMPLETED';
  currentTask: string;
  property: string;
  callLogs: PastCallLog[];
}

export default function FollowupsPage() {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState<'DUE' | 'OVERDUE' | 'UPCOMING' | 'COMPLETED'>('DUE');
  const [searchQuery, setSearchQuery] = useState('');

  const [followups, setFollowups] = useState<FollowupItem[]>([
    {
      id: 'f-101',
      leadName: 'Rajesh Nair',
      leadPhone: '+91 97112 33445',
      assignedName: 'Rohan Verma',
      dueDate: 'Sept 29, 2026 - 06:30 PM',
      priority: 'HIGH',
      status: 'DUE',
      currentTask: 'Call back to confirm site visit timing for Apex Villa 12-A project.',
      property: 'Apex Luxury Palms',
      callLogs: [
        {
          id: 'cl-1',
          callDate: 'Sept 27, 2026',
          callTime: '11:30 AM',
          agentName: 'Rohan Verma',
          discussionNotes: 'Explained 3BHK villa floor plan and 185 Lakhs pricing. Buyer asked to call back today evening after discussing with family.',
          outcome: 'INTERESTED',
          nextFollowupScheduled: 'Sept 29, 2026 - 06:30 PM'
        },
        {
          id: 'cl-0',
          callDate: 'Sept 25, 2026',
          callTime: '04:15 PM',
          agentName: 'Rohan Verma',
          discussionNotes: 'First response call made within 4 minutes SLA. Sent e-brochure on WhatsApp.',
          outcome: 'QUOTATION_SENT'
        }
      ]
    },
    {
      id: 'f-102',
      leadName: 'Ananya Deshmukh',
      leadPhone: '+91 98920 11223',
      assignedName: 'Priya Sundaram',
      dueDate: 'Sept 29, 2026 - 02:15 PM',
      priority: 'HIGH',
      status: 'OVERDUE',
      currentTask: 'Send revised price quotation with 3% festival discount.',
      property: 'Greenwood Estates',
      callLogs: [
        {
          id: 'cl-2',
          callDate: 'Sept 28, 2026',
          callTime: '03:45 PM',
          agentName: 'Priya Sundaram',
          discussionNotes: 'Buyer requested special festival discount on Plot 45. Promised to get approval from Sales Manager.',
          outcome: 'PRICE_HIGH',
          nextFollowupScheduled: 'Sept 29, 2026 - 02:15 PM'
        }
      ]
    },
    {
      id: 'f-103',
      leadName: 'Vikramaditya R.',
      leadPhone: '+91 98409 99887',
      assignedName: 'Karthik Raja',
      dueDate: 'Oct 02, 2026 - 11:00 AM',
      priority: 'MEDIUM',
      status: 'UPCOMING',
      currentTask: 'Confirm token advance bank transfer for Villa 14-B.',
      property: 'Apex Luxury Palms',
      callLogs: [
        {
          id: 'cl-3',
          callDate: 'Sept 28, 2026',
          callTime: '05:20 PM',
          agentName: 'Karthik Raja',
          discussionNotes: 'Site visit completed successfully! Buyer selected Villa 14-B and agreed to pay ₹5L token advance on Friday.',
          outcome: 'SITE_VISIT_AGREED',
          nextFollowupScheduled: 'Oct 02, 2026 - 11:00 AM'
        }
      ]
    }
  ]);

  // Call Logger Modal State
  const [selectedItemForLog, setSelectedItemForLog] = useState<FollowupItem | null>(null);
  const [discussionNotes, setDiscussionNotes] = useState('');
  const [callOutcome, setCallOutcome] = useState<PastCallLog['outcome']>('INTERESTED');
  const [nextFollowupDate, setNextFollowupDate] = useState('');
  const [nextFollowupTime, setNextFollowupTime] = useState('');
  const [nextTaskNote, setNextTaskNote] = useState('');

  // EDIT Followup Modal State
  const [editFollowupModal, setEditFollowupModal] = useState(false);
  const [editingItem, setEditingItem] = useState<FollowupItem | null>(null);
  const [editLeadName, setEditLeadName] = useState('');
  const [editLeadPhone, setEditLeadPhone] = useState('');
  const [editProperty, setEditProperty] = useState('');
  const [editAssignedName, setEditAssignedName] = useState('');
  const [editPriority, setEditPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [editCurrentTask, setEditCurrentTask] = useState('');
  const [editDueDate, setEditDueDate] = useState('');

  // EDIT Past Call Log Note State
  const [editingLogItem, setEditingLogItem] = useState<{ followupId: string; log: PastCallLog } | null>(null);
  const [editLogNotesText, setEditLogNotesText] = useState('');
  const [editLogOutcome, setEditLogOutcome] = useState<PastCallLog['outcome']>('INTERESTED');

  const [toastMsg, setToastMsg] = useState('');
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);

  // Open Log Call Modal
  const handleOpenCallLogModal = (item: FollowupItem) => {
    setSelectedItemForLog(item);
    setDiscussionNotes('');
    setCallOutcome('INTERESTED');
    setNextFollowupDate('2026-10-02');
    setNextFollowupTime('16:00');
    setNextTaskNote('Follow up on call outcome');
  };

  // Open Edit Followup Modal
  const handleOpenEditFollowup = (item: FollowupItem) => {
    setEditingItem(item);
    setEditLeadName(item.leadName);
    setEditLeadPhone(item.leadPhone);
    setEditProperty(item.property);
    setEditAssignedName(item.assignedName);
    setEditPriority(item.priority);
    setEditCurrentTask(item.currentTask);
    setEditDueDate(item.dueDate);
    setEditFollowupModal(true);
  };

  // Submit Edit Followup Form
  const handleSaveEditFollowupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setFollowups(prev =>
      prev.map(item => {
        if (item.id === editingItem.id) {
          return {
            ...item,
            leadName: editLeadName,
            leadPhone: editLeadPhone,
            property: editProperty,
            assignedName: editAssignedName,
            priority: editPriority,
            currentTask: editCurrentTask,
            dueDate: editDueDate
          };
        }
        return item;
      })
    );

    setToastMsg(`Follow-up task details for ${editLeadName} updated successfully!`);
    setTimeout(() => {
      setEditFollowupModal(false);
      setEditingItem(null);
      setToastMsg('');
    }, 1200);
  };

  // Open Edit Past Call Log Note
  const handleOpenEditLog = (followupId: string, log: PastCallLog) => {
    setEditingLogItem({ followupId, log });
    setEditLogNotesText(log.discussionNotes);
    setEditLogOutcome(log.outcome);
  };

  // Save Edit Past Call Log Note
  const handleSaveEditLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLogItem) return;

    setFollowups(prev =>
      prev.map(item => {
        if (item.id === editingLogItem.followupId) {
          return {
            ...item,
            callLogs: item.callLogs.map(l =>
              l.id === editingLogItem.log.id
                ? { ...l, discussionNotes: editLogNotesText, outcome: editLogOutcome }
                : l
            )
          };
        }
        return item;
      })
    );

    setToastMsg('Past call discussion log note updated!');
    setTimeout(() => {
      setEditingLogItem(null);
      setToastMsg('');
    }, 1200);
  };

  // Submit Call Discussion & Schedule Next Follow-up
  const handleSaveCallLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForLog || !discussionNotes) return;

    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const nextScheduledStr = `${nextFollowupDate || todayStr} - ${nextFollowupTime || '04:00 PM'}`;

    const newLog: PastCallLog = {
      id: `cl-${Date.now()}`,
      callDate: todayStr,
      callTime: timeStr,
      agentName: user.name || 'Rohan Verma',
      discussionNotes,
      outcome: callOutcome,
      nextFollowupScheduled: nextScheduledStr
    };

    setFollowups(prev =>
      prev.map(item => {
        if (item.id === selectedItemForLog.id) {
          return {
            ...item,
            status: 'UPCOMING',
            dueDate: nextScheduledStr,
            currentTask: nextTaskNote || discussionNotes,
            callLogs: [newLog, ...item.callLogs]
          };
        }
        return item;
      })
    );

    setToastMsg(`Call conversation logged for ${selectedItemForLog.leadName}! Next follow-up set for ${nextScheduledStr}.`);
    setTimeout(() => {
      setSelectedItemForLog(null);
      setToastMsg('');
    }, 1200);
  };

  const filteredFollowups = followups.filter(f => {
    const matchesTab = f.status === activeTab;
    const matchesSearch =
      f.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.leadPhone.includes(searchQuery) ||
      f.property.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
              SALES CALL LOGS &amp; REMINDERS
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
              EDITABLE DISCUSSION HISTORY
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Scheduled Follow-ups &amp; Call Discussion History
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Log call conversations, edit follow-up task notes, update next follow-up dates, and record buyer discussions.
          </p>
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-600" />
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      {/* Live Upcoming Notification Reminder Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-indigo-600 p-4 rounded-2xl text-white shadow-lg flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Bell className="animate-bounce" size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Follow-up Reminder Alert
              </span>
              <span className="text-xs font-mono text-amber-100">Sept 29, 2026 - 06:30 PM</span>
            </div>
            <p className="text-sm font-semibold mt-0.5">
              Call Rajesh Nair (+91 97112 33445) to confirm site visit timing for Apex Luxury Palms.
            </p>
          </div>
        </div>

        <button
          onClick={() => handleOpenCallLogModal(followups[0])}
          className="px-3.5 py-2 bg-white text-slate-900 font-bold rounded-xl text-xs shadow-md hover:bg-slate-100 transition shrink-0"
        >
          Call &amp; Log Discussion
        </button>
      </div>

      {/* Tabs & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            {(['DUE', 'OVERDUE', 'UPCOMING', 'COMPLETED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === tab
                    ? 'bg-slate-900 text-white dark:bg-indigo-600'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search buyer name or phone..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Follow-up Cards List */}
        <div className="space-y-4">
          {filteredFollowups.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 font-medium">
              No follow-ups found under {activeTab} tab.
            </div>
          ) : (
            filteredFollowups.map((fol) => {
              const isExpanded = expandedHistoryId === fol.id;
              return (
                <div key={fol.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-sm hover:border-indigo-500 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 dark:text-white text-base">
                          {fol.leadName}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">({fol.leadPhone})</span>
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 uppercase">
                          {fol.priority} PRIORITY
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                        Property: {fol.property} • Assigned RM: {fol.assignedName}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* EDIT FOLLOW-UP BUTTON */}
                      <button
                        onClick={() => handleOpenEditFollowup(fol)}
                        className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs transition inline-flex items-center gap-1 shadow-sm"
                        title="Edit Follow-up Task Details & Schedule"
                      >
                        <Edit3 size={13} />
                        <span>Edit Follow-up</span>
                      </button>

                      <a
                        href={`tel:${fol.leadPhone}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleOpenCallLogModal(fol);
                        }}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                      >
                        <Phone size={14} />
                        <span>Call &amp; Log Discussion</span>
                      </a>
                    </div>
                  </div>

                  {/* Task Note */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Current Task / Reminder Note:</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{fol.currentTask}</p>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono block mt-1 font-bold">
                      ⏰ Scheduled Date &amp; Time: {fol.dueDate}
                    </span>
                  </div>

                  {/* Past Call History Expander */}
                  <div className="pt-1">
                    <button
                      onClick={() => setExpandedHistoryId(isExpanded ? null : fol.id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <History size={14} />
                      <span>{isExpanded ? 'Hide Call Discussion History' : `View Past Call Discussion Logs (${fol.callLogs.length})`}</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 space-y-3 pl-3 border-l-2 border-indigo-200 dark:border-indigo-900 animate-in fade-in duration-200">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Date-Wise Conversation History
                        </span>
                        {fol.callLogs.map((log) => (
                          <div key={log.id} className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 dark:text-white">{log.agentName}</span>
                                <span className="text-[10px] text-slate-400 font-mono">{log.callDate} at {log.callTime}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold text-[10px] rounded uppercase">
                                  {log.outcome.replace('_', ' ')}
                                </span>
                                {/* EDIT LOG NOTE BUTTON */}
                                <button
                                  onClick={() => handleOpenEditLog(fol.id, log)}
                                  className="p-1 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 hover:bg-amber-200 rounded transition"
                                  title="Edit Log Note"
                                >
                                  <Edit3 size={11} />
                                </button>
                              </div>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed font-mono">
                              🗣️ Spoke: &quot;{log.discussionNotes}&quot;
                            </p>
                            {log.nextFollowupScheduled && (
                              <p className="text-[10px] text-emerald-600 font-semibold">
                                🗓️ Scheduled Next Call: {log.nextFollowupScheduled}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 1. Modal to EDIT Follow-up Task Details */}
      {editFollowupModal && editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2.5 py-0.5 rounded-full">
                  EDIT FOLLOW-UP TASK
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  Edit Task for {editingItem.leadName}
                </h3>
              </div>
              <button
                onClick={() => setEditFollowupModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditFollowupSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Buyer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editLeadName}
                    onChange={(e) => setEditLeadName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Buyer Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={editLeadPhone}
                    onChange={(e) => setEditLeadPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Current Task / Reminder Note *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editCurrentTask}
                  onChange={(e) => setEditCurrentTask(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Property Project Name
                  </label>
                  <input
                    type="text"
                    value={editProperty}
                    onChange={(e) => setEditProperty(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={editPriority}
                    onChange={(e: any) => setEditPriority(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none"
                  >
                    <option value="HIGH">HIGH Priority</option>
                    <option value="MEDIUM">MEDIUM Priority</option>
                    <option value="LOW">LOW Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Scheduled Due Date &amp; Time
                </label>
                <input
                  type="text"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  placeholder="e.g. Sept 29, 2026 - 06:30 PM"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-md"
                >
                  <CheckCircle2 size={16} />
                  <span>Save Updated Follow-up Task</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal to EDIT Past Call Discussion Note */}
      {editingLogItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2.5 py-0.5 rounded-full">
                  EDIT CALL LOG NOTE
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  Edit Past Spoke Discussion Note
                </h3>
              </div>
              <button
                onClick={() => setEditingLogItem(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditLogSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Spoke Discussion Notes *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editLogNotesText}
                  onChange={(e) => setEditLogNotesText(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Call Outcome Status *
                </label>
                <select
                  value={editLogOutcome}
                  onChange={(e: any) => setEditLogOutcome(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none"
                >
                  <option value="INTERESTED">Hot Interest</option>
                  <option value="SITE_VISIT_AGREED">Site Visit Agreed</option>
                  <option value="QUOTATION_SENT">Quotation Sent</option>
                  <option value="PRICE_HIGH">Price Concern</option>
                  <option value="NO_ANSWER">No Answer</option>
                  <option value="DEAL_WON">Deal Won / Token Received</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-md"
                >
                  <CheckCircle2 size={16} />
                  <span>Update Call Log Note</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal to Log New Call Discussion */}
      {selectedItemForLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 rounded-full">
                  CALL CONVERSATION LOGGER
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  Log Call with {selectedItemForLog.leadName}
                </h3>
                <p className="text-xs text-slate-400 font-mono">{selectedItemForLog.leadPhone} • {selectedItemForLog.property}</p>
              </div>
              <button
                onClick={() => setSelectedItemForLog(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCallLogSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  What was discussed on the call? (Spoke Details) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={discussionNotes}
                  onChange={(e) => setDiscussionNotes(e.target.value)}
                  placeholder="e.g. Spoke with buyer. Interested in Villa 12-A. Wants 5% discount on registration fee. Promised to call back on Friday..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-indigo-500 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Call Outcome / Result *
                  </label>
                  <select
                    value={callOutcome}
                    onChange={(e: any) => setCallOutcome(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none"
                  >
                    <option value="INTERESTED">Hot Interest</option>
                    <option value="SITE_VISIT_AGREED">Site Visit Agreed</option>
                    <option value="QUOTATION_SENT">Quotation Sent</option>
                    <option value="PRICE_HIGH">Price Concern</option>
                    <option value="NO_ANSWER">No Answer</option>
                    <option value="DEAL_WON">Deal Won / Token Received</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Next Follow-up Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={nextFollowupDate}
                    onChange={(e) => setNextFollowupDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Next Follow-up Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={nextFollowupTime}
                    onChange={(e) => setNextFollowupTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Next Reminder Task Note
                  </label>
                  <input
                    type="text"
                    value={nextTaskNote}
                    onChange={(e) => setNextTaskNote(e.target.value)}
                    placeholder="e.g. Call back after spouse discussion"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-lg"
                >
                  <CheckCircle2 size={16} />
                  <span>Save Call Log &amp; Set Next Follow-up Reminder</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
