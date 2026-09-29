'use client';

import React, { useState } from 'react';
import {
  FileText,
  MessageCircle,
  Users,
  Megaphone,
  Plus,
  Send,
  CheckCircle2,
  Trash2,
  ArrowLeft,
  Search,
  Upload,
  Download,
  Check,
  ChevronDown,
  Smartphone,
  Pencil,
  Sparkles
} from 'lucide-react';

export default function WhatsAppHubPage() {
  const [activeTab, setActiveTab] = useState<'CREATE_TEMPLATE' | 'CREATE_CAMPAIGN' | 'CONTACTS' | 'INBOX'>('CREATE_TEMPLATE');

  // --- 1. CREATE TEMPLATE STATE ---
  const [templateName, setTemplateName] = useState('appointment_reminder_v1');
  const [language, setLanguage] = useState('English (US)');
  const [category, setCategory] = useState<'MARKETING' | 'UTILITY' | 'AUTHENTICATION'>('MARKETING');
  const [headerType, setHeaderType] = useState('None');
  const [bodyText, setBodyText] = useState('Hello {{1}}, your order #{{2}} has been confirmed and is scheduled for delivery.');
  const [var1Sample, setVar1Sample] = useState('Alex Rivera');
  const [var2Sample, setVar2Sample] = useState('94820');
  const [footerText, setFooterText] = useState('Acme Customer Service');
  const [buttonType, setButtonType] = useState('Quick Reply');
  const [buttonText, setButtonText] = useState('Track Order');

  // --- 2. CREATE CAMPAIGN STATE ---
  const [campaignName, setCampaignName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('welcome_offer_marketing (MARKETING) - Approved');
  const [campVar1, setCampVar1] = useState('');
  const [campVar2, setCampVar2] = useState('');
  const [selectedAudience, setSelectedAudience] = useState<string[]>(['c1', 'c2']);

  // --- 3. CONTACTS STATE ---
  const [contactsSearch, setContactsSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('All Tags');
  const [contactsList, setContactsList] = useState([
    { id: 'c1', name: 'Elena Rostova', phone: '+14155559820', email: 'elena@techcorp.io', tag: 'Active Client', source: 'INBOUND_MESSAGE', date: '9/22/2026' },
    { id: 'c2', name: 'Alex Rivera', phone: '+14155552671', email: 'alex@example.com', tag: 'VIP Lead', source: 'MANUAL', date: '9/22/2026' }
  ]);

  // --- 4. INBOX STATE ---
  const [activeChatId, setActiveChatId] = useState('c1');
  const [chatFilter, setChatFilter] = useState('All');
  const [messages, setMessages] = useState<{ [key: string]: Array<{ sender: 'user' | 'agent'; text: string; time: string }> }>({
    c1: [
      { sender: 'user', text: 'Got it! When is your team available for a quick demo?', time: '03:25 PM' }
    ],
    c2: [
      { sender: 'user', text: 'Sounds great! Can you send me the template details?', time: '12:01 AM' }
    ]
  });
  const [replyInput, setReplyInput] = useState('');

  // Notifications / feedback
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const getPreviewBody = () => {
    let result = bodyText;
    result = result.replace(/\{\{1\}\}/g, var1Sample || '{{1}}');
    result = result.replace(/\{\{2\}\}/g, var2Sample || '{{2}}');
    return result;
  };

  const activeContact = contactsList.find(c => c.id === activeChatId) || contactsList[0];

  const handleSendInboxMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), { sender: 'agent', text: replyInput, time }]
    }));
    setReplyInput('');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 p-4 md:p-8 space-y-6">
      {/* Toast Banner */}
      {statusMessage && (
        <div className="fixed top-5 right-5 z-50 p-4 bg-emerald-600 text-white font-medium text-xs rounded-xl shadow-xl flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle2 size={16} />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Header Navigation Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
            <MessageCircle size={22} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">WhatsApp Meta Suite</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Templates, Campaigns, Audience &amp; 2-Way Inbox</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('CREATE_TEMPLATE')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'CREATE_TEMPLATE'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Create Template
          </button>
          <button
            onClick={() => setActiveTab('CREATE_CAMPAIGN')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'CREATE_CAMPAIGN'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Broadcast Campaign
          </button>
          <button
            onClick={() => setActiveTab('CONTACTS')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'CONTACTS'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Contacts Directory
          </button>
          <button
            onClick={() => setActiveTab('INBOX')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'INBOX'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Live Inbox
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. SCREEN: CREATE WHATSAPP MESSAGE TEMPLATE */}
      {/* ========================================================= */}
      {activeTab === 'CREATE_TEMPLATE' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white">
              <ArrowLeft size={16} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create WhatsApp Message Template</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Build Meta-compliant message templates with dynamic variable placeholders</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Form */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-xs">
              {/* Section 1 */}
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">1. Basic Template Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                      Template Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-mono text-slate-900 dark:text-white focus:border-emerald-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Lowercase, numbers and underscores only</span>
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Language</label>
                    <div className="relative">
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white appearance-none cursor-pointer"
                      >
                        <option>English (US)</option>
                        <option>Spanish</option>
                        <option>Hindi</option>
                        <option>French</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-2">Category</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['MARKETING', 'UTILITY', 'AUTHENTICATION'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`py-2.5 px-3 rounded-xl font-bold tracking-wider transition text-[11px] border ${
                          category === cat
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <hr className="border-slate-100 dark:border-slate-800" />

              {/* Section 2 */}
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">2. Template Components &amp; Variables</h3>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Header (Optional)</label>
                  <div className="relative">
                    <select
                      value={headerType}
                      onChange={(e) => setHeaderType(e.target.value)}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white appearance-none"
                    >
                      <option>None</option>
                      <option>Text Header</option>
                      <option>Media (Image / Document)</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    Body Text <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      rows={4}
                      value={bodyText}
                      onChange={(e) => setBodyText(e.target.value)}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white focus:border-emerald-500 leading-relaxed resize-none"
                    />
                    <Pencil size={14} className="absolute right-3 bottom-3 text-slate-400" />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                    <span>💡</span> Use variables like <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-emerald-600 font-mono">{"{{1}}"}</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-emerald-600 font-mono">{"{{2}}"}</code> for dynamic personalization.
                  </p>
                </div>

                {/* Variable Samples for Review */}
                <div className="p-4 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 rounded-xl space-y-3">
                  <span className="font-bold text-emerald-800 dark:text-emerald-400 block text-[11px]">Required Variable Examples for Meta Review</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-500 text-[10px] mb-1">Sample for {"{{1}}"}</label>
                      <input
                        type="text"
                        value={var1Sample}
                        onChange={(e) => setVar1Sample(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-emerald-300 dark:border-emerald-700 outline-none text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 text-[10px] mb-1">Sample for {"{{2}}"}</label>
                      <input
                        type="text"
                        value={var2Sample}
                        onChange={(e) => setVar2Sample(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-emerald-300 dark:border-emerald-700 outline-none text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Footer (Optional)</label>
                  <input
                    type="text"
                    value={footerText}
                    onChange={(e) => setFooterText(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <hr className="border-slate-100 dark:border-slate-800" />

              {/* Section 3 */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">3. Interactive Buttons</h3>
                  <button type="button" className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 hover:underline text-[11px]">
                    <Plus size={14} /> Add Button
                  </button>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="w-1/3 relative">
                    <select
                      value={buttonType}
                      onChange={(e) => setButtonType(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white appearance-none"
                    >
                      <option>Quick Reply</option>
                      <option>Call to Action</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-3 text-slate-400 pointer-events-none" />
                  </div>
                  <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    className="flex-1 p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white"
                  />
                  <button type="button" className="text-red-400 hover:text-red-600 p-2">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => showToast('WhatsApp Message Template submitted for Meta Review!')}
                  className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition"
                >
                  <Send size={16} /> Submit Template to Meta
                </button>
              </div>
            </div>

            {/* Right Mockup Phone Preview */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-sm bg-slate-900 rounded-[36px] p-4 shadow-2xl border-4 border-slate-800 text-slate-900 relative">
                {/* Smartphone Bar Header */}
                <div className="flex justify-between items-center px-4 py-2 border-b border-slate-800 text-[10px] font-bold text-slate-300">
                  <span className="flex items-center gap-1">
                    <Smartphone size={12} className="text-emerald-400" /> WHATSAPP SMARTPHONE PREVIEW
                  </span>
                  <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-400">WhatsApp iOS / Android</span>
                </div>

                {/* Smartphone Screen Canvas */}
                <div className="mt-3 bg-[#e5ddd5] dark:bg-[#0b141a] rounded-[24px] p-4 min-h-[380px] flex flex-col justify-end shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                  {/* WhatsApp Message Card */}
                  <div className="bg-white dark:bg-[#1f2c34] rounded-2xl p-4 shadow-md space-y-2 border border-slate-200/50 dark:border-slate-700/40 relative z-10 text-xs">
                    <p className="text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-wrap">
                      {getPreviewBody()}
                    </p>

                    {footerText && (
                      <p className="text-[10px] text-slate-400 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-1">
                        {footerText}
                      </p>
                    )}

                    <div className="text-[9px] text-slate-400 text-right">
                      12:45 PM
                    </div>

                    {buttonText && (
                      <div className="border-t border-slate-100 dark:border-slate-700/50 pt-2.5 mt-2">
                        <button className="w-full py-2 text-center text-emerald-600 dark:text-emerald-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition text-xs flex items-center justify-center gap-1">
                          {buttonText}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. SCREEN: CREATE BROADCAST CAMPAIGN */}
      {/* ========================================================= */}
      {activeTab === 'CREATE_CAMPAIGN' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white">
              <ArrowLeft size={16} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create Broadcast Campaign</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Configure target audience and variable values for WhatsApp template broadcast</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Campaign Name</label>
              <input
                type="text"
                placeholder="e.g. Q4 Black Friday Sale Blast"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Select Meta Approved Template</label>
              <div className="relative">
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white appearance-none cursor-pointer"
                >
                  <option>welcome_offer_marketing (MARKETING) - Approved</option>
                  <option>appointment_reminder_v1 (UTILITY) - Approved</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Template Content Display Box */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">Template Content:</span>
              <p className="text-slate-600 dark:text-slate-400">Welcome {"{{1}}"}! Use code {"{{2}}"} to get 20% off your first subscription.</p>
            </div>

            {/* Variable Placeholder Mapping */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white">Variable Placeholder Mapping</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 text-[11px] mb-1">Value for {"{{1}}"}</label>
                  <input
                    type="text"
                    placeholder="e.g. Customer Name"
                    value={campVar1}
                    onChange={(e) => setCampVar1(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[11px] mb-1">Value for {"{{2}}"}</label>
                  <input
                    type="text"
                    placeholder="e.g. Discount Code or Date"
                    value={campVar2}
                    onChange={(e) => setCampVar2(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Target Audience Selector */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 dark:text-white">
                  Target Audience ({selectedAudience.length} / {contactsList.length} selected)
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedAudience(selectedAudience.length === contactsList.length ? [] : contactsList.map(c => c.id))}
                  className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                >
                  {selectedAudience.length === contactsList.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="space-y-2">
                {contactsList.map((contact) => {
                  const isChecked = selectedAudience.includes(contact.id);
                  return (
                    <div
                      key={contact.id}
                      onClick={() => {
                        if (isChecked) {
                          setSelectedAudience(selectedAudience.filter(id => id !== contact.id));
                        } else {
                          setSelectedAudience([...selectedAudience, contact.id]);
                        }
                      }}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                        isChecked
                          ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/40 dark:bg-emerald-950/30'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                          {isChecked && <Check size={12} />}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">{contact.name}</span>
                        <span className="text-slate-400 font-mono text-[11px]">{contact.phone}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => showToast('WhatsApp Broadcast Campaign Draft Created Successfully!')}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition"
              >
                <Send size={15} /> Create Campaign Draft
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. SCREEN: CONTACTS MANAGEMENT */}
      {/* ========================================================= */}
      {activeTab === 'CONTACTS' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Contacts Management</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Manage your WhatsApp customer profiles, tags, and audience segmentation</p>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-xs flex items-center gap-1.5">
                <Download size={14} /> Export CSV
              </button>
              <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-xs flex items-center gap-1.5">
                <Upload size={14} /> Import CSV
              </button>
              <button
                onClick={() => {
                  const name = prompt('Contact Name:');
                  const phone = prompt('WhatsApp Phone (+1...):');
                  if (name && phone) {
                    setContactsList([
                      ...contactsList,
                      { id: `c-${Date.now()}`, name, phone, email: 'user@example.com', tag: 'New Lead', source: 'MANUAL', date: new Date().toLocaleDateString() }
                    ]);
                    showToast('New WhatsApp contact added!');
                  }
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition text-xs flex items-center gap-1.5"
              >
                <Plus size={14} /> Add Contact
              </button>
            </div>
          </div>

          {/* Search Bar & Tag Filter */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center text-xs">
            <div className="relative w-full md:w-96">
              <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, phone or email..."
                value={contactsSearch}
                onChange={(e) => setContactsSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <span className="text-slate-500 font-medium">Tag Filter:</span>
              <div className="relative w-40">
                <select
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white appearance-none cursor-pointer"
                >
                  <option>All Tags</option>
                  <option>Active Client</option>
                  <option>VIP Lead</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Contacts Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm text-xs">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/60 font-bold uppercase tracking-wider text-slate-400 text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-4 px-6">NAME</th>
                  <th className="py-4 px-6">WHATSAPP PHONE</th>
                  <th className="py-4 px-6">EMAIL</th>
                  <th className="py-4 px-6">TAGS</th>
                  <th className="py-4 px-6">SOURCE</th>
                  <th className="py-4 px-6">CREATED DATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
                {contactsList
                  .filter(c => c.name.toLowerCase().includes(contactsSearch.toLowerCase()) || c.phone.includes(contactsSearch))
                  .map((contact) => (
                    <tr key={contact.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                      <td className="py-4 px-6 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-xs border border-slate-200 dark:border-slate-700">
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        {contact.name}
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-600 dark:text-slate-400">{contact.phone}</td>
                      <td className="py-4 px-6 text-slate-500">{contact.email}</td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          {contact.tag}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-[10px] uppercase text-slate-500 bg-slate-100/60 dark:bg-slate-800/60 px-2 py-1 rounded w-max">
                        {contact.source}
                      </td>
                      <td className="py-4 px-6 text-slate-400 text-[11px]">{contact.date}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. SCREEN: LIVE 2-WAY INBOX */}
      {/* ========================================================= */}
      {activeTab === 'INBOX' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          {/* Left Chat List Column */}
          <div className="lg:col-span-3 border-r border-slate-200 dark:border-slate-800 flex flex-col">
            {/* Header Search */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Inbox</h3>
                <button className="text-slate-400 hover:text-slate-600">
                  <Sparkles size={16} />
                </button>
              </div>

              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search chat or phone..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 outline-none text-xs text-slate-900 dark:text-white"
                />
              </div>

              {/* Chat Status Filter Tabs */}
              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 pt-1">
                {(['All', 'Unread', 'Open', 'Closed'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setChatFilter(f)}
                    className={`px-2.5 py-1 rounded-md transition ${
                      chatFilter === f ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold' : 'hover:text-slate-900'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat List Items */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {contactsList.map((c) => {
                const userMsgs = messages[c.id] || [];
                const lastMsg = userMsgs[userMsgs.length - 1];
                const isActive = activeChatId === c.id;

                return (
                  <div
                    key={c.id}
                    onClick={() => setActiveChatId(c.id)}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer transition ${
                      isActive ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-l-4 border-emerald-600' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">
                      {c.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h4 className="font-bold text-slate-900 dark:text-white truncate">{c.name}</h4>
                        <span className="text-[10px] text-slate-400 shrink-0">{lastMsg?.time || '12:00 AM'}</span>
                      </div>
                      <p className="text-slate-500 truncate text-[11px] mb-1">{lastMsg?.text || 'No messages yet'}</p>
                      <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
                        {c.tag}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Middle Active Chat Column */}
          <div className="lg:col-span-6 flex flex-col bg-slate-50/30 dark:bg-slate-950/40">
            {/* Top Active Chat Header */}
            <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                  {activeContact.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{activeContact.name}</h3>
                    <span className="text-emerald-600 font-mono text-xs font-bold">{activeContact.phone}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Unassigned agent</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => showToast(`Template sent to ${activeContact.name}`)}
                  className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold hover:bg-emerald-100 transition flex items-center gap-1"
                >
                  <FileText size={13} /> Send Template
                </button>
              </div>
            </div>

            {/* Chat Body Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
              {(messages[activeChatId] || []).map((msg, index) => (
                <div key={index} className={`flex flex-col ${msg.sender === 'agent' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3.5 rounded-2xl max-w-[80%] shadow-sm ${
                    msg.sender === 'agent'
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-none'
                  }`}>
                    <p className="leading-relaxed">{msg.text}</p>
                    <span className={`text-[9px] block text-right mt-1 ${msg.sender === 'agent' ? 'text-emerald-100' : 'text-slate-400'}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Message Input */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
              <form onSubmit={handleSendInboxMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a WhatsApp message..."
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  className="flex-1 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-md shrink-0"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>

          {/* Right Contact Details Column */}
          <div className="lg:col-span-3 border-l border-slate-200 dark:border-slate-800 p-6 space-y-6 text-xs bg-white dark:bg-slate-900">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 font-bold text-xl flex items-center justify-center">
                {activeContact.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">{activeContact.name}</h4>
              <p className="font-mono text-slate-500 text-xs">{activeContact.phone}</p>
            </div>

            <hr className="border-slate-100 dark:border-slate-800" />

            <div className="space-y-3">
              <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">CONTACT DETAILS</span>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{activeContact.email}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Source:</span>
                  <span className="font-mono font-bold text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                    {activeContact.source}
                  </span>
                </div>
              </div>
            </div>

            <hr className="border-slate-100 dark:border-slate-800" />

            <div className="space-y-2">
              <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">TAGS</span>
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  {activeContact.tag}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
